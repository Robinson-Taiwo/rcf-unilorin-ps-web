"use client"

import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from "react"
import { CircleCheck } from "lucide-react"
import { button } from "@/components/rcf/Ui"
import { supabaseBrowser } from "@/lib/supabase/client"

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

type Status = "loading" | "signin" | "idle" | "sending" | "done" | "already" | "wrong" | "error"
type Member = { name: string; email: string }

// Sign in with Google, then the code boxes. Opening the page from the service QR code (?c=ABC) checks in
// straight away after sign-in. One check-in per Google account and per phone, per service.
export default function CheckInForm() {
  const [chars, setChars] = useState<string[]>(Array(CODE_LENGTH).fill(""))
  const [status, setStatus] = useState<Status>("loading")
  const [service, setService] = useState<string | null>(null)
  const [member, setMember] = useState<Member | null>(null)
  const [linkCode, setLinkCode] = useState("")
  const [signinFailed, setSigninFailed] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const complete = chars.every(Boolean)

  async function send(code: string) {
    setStatus("sending")
    try {
      const res = await fetch("/api/check-in", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, device: deviceId() }) })
      const { status: result } = (await res.json()) as { status: string }
      if (result === "ok") setStatus("done")
      else if (result === "already") setStatus("already")
      else if (result === "signin") setStatus("signin")
      else if (result === "invalid") setStatus("wrong")
      else setStatus("error")
    } catch {
      setStatus("error")
    }
  }

  // On open: signed in? Already checked in today? Then use the code from the QR link, if any.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const fromLink = clean(params.get("c") ?? params.get("code") ?? "").slice(0, CODE_LENGTH)
    const failed = params.get("signin") === "failed"
    if (fromLink || failed) window.history.replaceState(null, "", window.location.pathname)
    const device = deviceId()
    fetch(`/api/check-in${device ? `?device=${device}` : ""}`)
      .then((r) => r.json() as Promise<{ member: Member | null; service: string | null }>)
      .catch(() => ({ member: null, service: null }))
      .then(({ member: who, service: done }) => {
        setMember(who)
        setLinkCode(fromLink)
        setSigninFailed(failed)
        if (fromLink.length === CODE_LENGTH) setChars(fromLink.split(""))
        if (done) {
          setService(done)
          setStatus("already")
        } else if (!who) {
          setStatus("signin")
        } else if (fromLink.length === CODE_LENGTH) {
          send(fromLink)
        } else {
          setStatus("idle")
        }
      })
  }, [])

  async function signInWithGoogle() {
    // Come back to this page (with the QR code, if there was one) once Google is done
    const next = `/check-in${linkCode ? `?c=${linkCode}` : ""}`
    await supabaseBrowser().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`, queryParams: { prompt: "select_account" } },
    })
  }

  async function switchAccount() {
    await supabaseBrowser().auth.signOut()
    setMember(null)
    setStatus("signin")
  }

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
          {status === "done"
            ? `Welcome to service${member ? `, ${member.name.split(" ")[0]}` : ""}. You only need to check in once.`
            : `You're already counted${service ? ` for ${service}` : " for this service"}. Each person and each phone checks in once.`}
        </p>
      </div>
    )
  }

  // Step 1: sign in with Google
  if (status === "signin") {
    return (
      <div className="mt-8 flex w-full flex-col items-center gap-4">
        <button
          type="button"
          onClick={signInWithGoogle}
          className="flex h-12 w-full max-w-[300px] cursor-pointer items-center justify-center gap-3 rounded-full border border-[#8a8d93]/60 bg-white px-5 text-[15px] font-medium text-[#1c1c1c] shadow-[0_4px_12px_-6px_rgba(0,0,0,0.2)] transition-[border-color,translate] duration-300 hover:-translate-y-0.5 hover:border-[#00a8e8]"
        >
          <GoogleMark />
          Continue with Google
        </button>
        <p className="max-w-[320px] text-[13px] leading-[1.55] text-[#1c1c1c]/60">
          {linkCode ? "Sign in once, and you'll be checked in straight away. " : ""}We only use your name so the fellowship knows who attended.
        </p>
        {signinFailed && <p role="alert" className="text-[13px] font-medium text-[#d32f2f]">Google sign-in didn&apos;t finish. Please try again.</p>}
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
        {member && (
          <p className="text-[13px] text-[#1c1c1c]/60">
            Checking in as <span className="font-semibold text-[#1c1c1c]">{member.name || member.email}</span> ·{" "}
            <button type="button" onClick={switchAccount} className="cursor-pointer font-medium text-[#00a8e8] hover:underline">Not you?</button>
          </p>
        )}
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

// Google's "G" for the sign-in button
function GoogleMark() {
  return (
    <svg aria-hidden viewBox="0 0 48 48" className="size-5">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}
