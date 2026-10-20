"use client"

import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from "react"
import { CircleCheck } from "lucide-react"
import { button } from "@/components/rcf/Ui"

const CODE_LENGTH = 3

// Keep letters and digits only, uppercase
const clean = (value: string) => value.replace(/[^0-9a-z]/gi, "").toUpperCase()

// The id this phone keeps in the browser's storage (the server also keeps one in a cookie)
function deviceId() {
  try {
    let id = localStorage.getItem("rcf-device")
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem("rcf-device", id)
    }
    return id
  } catch {
    return null
  }
}

type Status = "loading" | "idle" | "sending" | "done" | "already" | "wrong" | "error"

// Code boxes + submit. Opening the page from the service QR code (?code=ABC) checks in straight away.
// Each phone can check in once per service; after that the page just says so.
export default function CheckInForm() {
  const [chars, setChars] = useState<string[]>(Array(CODE_LENGTH).fill(""))
  const [status, setStatus] = useState<Status>("loading")
  const [service, setService] = useState<string | null>(null)
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const complete = chars.every(Boolean)

  async function send(code: string) {
    setStatus("sending")
    try {
      const res = await fetch("/api/check-in", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, device: deviceId() }) })
      const { status: result } = (await res.json()) as { status: string }
      if (result === "ok") setStatus("done")
      else if (result === "already") setStatus("already")
      else if (result === "invalid") setStatus("wrong")
      else setStatus("error")
    } catch {
      setStatus("error")
    }
  }

  // On open: already checked in today? Otherwise use the code from the QR link, if any.
  useEffect(() => {
    const fromLink = clean(new URLSearchParams(window.location.search).get("code") ?? "").slice(0, CODE_LENGTH)
    if (fromLink) window.history.replaceState(null, "", window.location.pathname)
    const device = deviceId()
    fetch(`/api/check-in${device ? `?device=${device}` : ""}`)
      .then((r) => r.json() as Promise<{ service: string | null }>)
      .catch(() => ({ service: null }))
      .then(({ service: done }) => {
        if (done) {
          setService(done)
          setStatus("already")
        } else if (fromLink.length === CODE_LENGTH) {
          setChars(fromLink.split(""))
          send(fromLink)
        } else {
          setStatus("idle")
        }
      })
  }, [])

  function setChar(index: number, value: string) {
    if (status === "wrong" || status === "error") setStatus("idle")
    const char = clean(value).slice(-1)
    setChars((prev) => {
      const next = [...prev]
      next[index] = char
      return next
    })
    // Move to the next box after typing
    if (char && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !chars[index] && index > 0) inputs.current[index - 1]?.focus()
    if (e.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus()
    if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus()
  }

  // Pasting the whole code into any box fills all three
  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = clean(e.clipboardData.getData("text")).slice(0, CODE_LENGTH)
    if (!pasted) return
    e.preventDefault()
    setChars(Array.from({ length: CODE_LENGTH }, (_, i) => pasted[i] ?? ""))
    inputs.current[pasted.length - 1]?.focus()
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (complete && (status === "idle" || status === "wrong" || status === "error")) send(chars.join(""))
  }

  // Checked in (just now, or earlier today)
  if (status === "done" || status === "already") {
    return (
      <div role="status" className="mt-8 flex animate-fade-in flex-col items-center gap-4">
        <span className="flex size-16 items-center justify-center rounded-full bg-[#5c8e13]/15 text-[#5c8e13]">
          <CircleCheck className="size-9" strokeWidth={1.75} />
        </span>
        <p className="font-serif text-[22px] font-semibold text-[#1c1c1c]">{status === "done" ? "You're checked in!" : "You've already checked in"}</p>
        <p className="max-w-[320px] text-[14px] leading-[1.55] text-[#1c1c1c]/70">
          {status === "done" ? "Welcome to service. You only need to check in once." : `This phone is already counted${service ? ` for ${service}` : " for this service"}. Each phone checks in once.`}
        </p>
      </div>
    )
  }

  const busy = status === "loading" || status === "sending"

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col items-center gap-8">

      {/* Code boxes — 72 x 80 (Figma 107 x 113), 12px apart */}
      <div role="group" aria-label="Check-in code" className="flex items-center gap-3">
        {chars.map((char, i) => (
          <div key={i} className="relative h-20 w-[72px]">
            <input
              ref={(el) => {
                inputs.current[i] = el
              }}
              value={char}
              onChange={(e) => setChar(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
              maxLength={1}
              disabled={busy}
              autoComplete={i === 0 ? "one-time-code" : "off"}
              autoCapitalize="characters"
              aria-label={`Code character ${i + 1}`}
              className="peer size-full rounded-[12px] border border-[#8a8d93]/60 bg-[#e8e8e9] text-center text-[30px] font-semibold text-[#1c1c1c] caret-[#00a8e8] shadow-[0_4px_4px_rgba(0,0,0,0.06)] outline-none transition-[box-shadow,border-color,translate,background-color] duration-300 focus:-translate-y-0.5 focus:border-[#00a8e8] focus:bg-white focus:ring-4 focus:ring-[#00a8e8]/20 disabled:opacity-60"
            />
            {/* Dark dot shown in empty boxes (hidden while typing in that box) */}
            {!char && (
              <span
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4a4a4a] peer-focus:hidden"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col items-center gap-3">
        <button type="submit" disabled={!complete || busy} className={`${button.primary} w-full max-w-[240px]`}>
          {status === "sending" ? "Checking in…" : "Submit check-in"}
        </button>
        <p aria-live="polite" className="min-h-5 text-center text-[13px] font-medium text-[#d32f2f]">
          {status === "wrong" && "That code isn't right, or check-in has closed. Check the screen and try again."}
          {status === "error" && "Couldn't reach the server. Please check your connection and try again."}
        </p>
      </div>

    </form>
  )
}
