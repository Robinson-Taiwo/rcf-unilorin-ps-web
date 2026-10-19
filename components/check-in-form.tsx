"use client"

import { useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from "react"
import { button } from "@/components/rcf/Ui"

const CODE_LENGTH = 3

// Keep letters and digits only, uppercase
const clean = (value: string) => value.replace(/[^0-9a-z]/gi, "").toUpperCase()

export default function CheckInForm() {
  const [chars, setChars] = useState<string[]>(Array(CODE_LENGTH).fill(""))
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const complete = chars.every(Boolean)

  function setChar(index: number, value: string) {
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!complete) return
    const code = chars.join("")
    // TODO: send `code` to your check-in endpoint
  }

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
              autoComplete={i === 0 ? "one-time-code" : "off"}
              autoCapitalize="characters"
              aria-label={`Code character ${i + 1}`}
              className="peer size-full rounded-[12px] border border-[#8a8d93]/60 bg-[#e8e8e9] text-center text-[30px] font-semibold text-[#1c1c1c] caret-[#00a8e8] shadow-[0_4px_4px_rgba(0,0,0,0.06)] outline-none transition-[box-shadow,border-color,translate,background-color] duration-300 focus:-translate-y-0.5 focus:border-[#00a8e8] focus:bg-white focus:ring-4 focus:ring-[#00a8e8]/20"
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

      <button type="submit" disabled={!complete} className={`${button.primary} w-full max-w-[240px]`}>
        Submit check-in
      </button>

    </form>
  )
}