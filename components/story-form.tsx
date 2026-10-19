"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import { Check } from "lucide-react"
import { button, field, fieldHeight, fieldLabel, segment, segmented } from "@/components/rcf/Ui"
import { supabasePublic } from "@/lib/supabase/public"

type StoryType = "testimony" | "prayer"

const MAX_LENGTH = 600

const tabs = [
  { value: "testimony", label: "Testimony" },
  { value: "prayer", label: "Prayer point" },
] as const

// "Share Your Story": heading + intro, toggle, form (name, message, contact), submit, footnote.
// Phones (mobile frame): straight on the page, 50px fields, mobile labels and placeholders.
// Tablet/desktop (desktop frame): a centred card. On `fit:` screens (1024+ wide, 640+ tall) the card fills the
// screen height under the nav and the message box takes the spare height, so the whole form is visible.
export default function StoryForm({ intro, footnote }: { intro: ReactNode; footnote: ReactNode }) {
  const [type, setType] = useState<StoryType>("testimony")
  const [name, setName] = useState("")
  const [anonymous, setAnonymous] = useState(false)
  const [message, setMessage] = useState("")
  const [contact, setContact] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!message.trim() || status === "sending") return
    setStatus("sending")
    // Goes to the admin review queue; nothing is published until an admin approves it
    const { error } = await supabasePublic().from("submissions").insert({
      type,
      name: name.trim() || null,
      anonymous,
      message: message.trim(),
      contact: contact.trim() || null,
    })
    if (error) return setStatus("error")
    setStatus("sent")
    setName("")
    setAnonymous(false)
    setMessage("")
    setContact("")
  }

  const isTestimony = type === "testimony"

  return (
    <div
      data-reveal
      className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-7 sm:rounded-[28px] sm:bg-[#ebe9e9] sm:px-10 sm:py-10 lg:gap-6 lg:px-12 fit:h-full fit:min-h-0 fit:gap-[clamp(0.625rem,1.6svh,1.5rem)] fit:py-[clamp(1.25rem,3svh,2.5rem)]"
    >
      {/* Heading + intro */}
      <div className="flex w-full max-w-[600px] shrink-0 flex-col items-center gap-5 text-center lg:gap-4 fit:gap-[clamp(0.5rem,1.2svh,1rem)]">
        {intro}
      </div>

      {/* Toggle */}
      <div role="group" aria-label="Submission type" className={`${segmented} max-w-[320px] shrink-0`}>
        {tabs.map((tab) => {
          const active = type === tab.value
          return (
            <button
              key={tab.value}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setType(tab.value)
                if (status !== "sending") setStatus("idle")
              }}
              className={`${segment} ${active ? "bg-[#00a8e8] text-white" : "text-[#00a8e8] hover:bg-[#00a8e8]/10"}`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Form — name, message, contact (as designed) */}
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6 lg:gap-5 fit:min-h-0 fit:flex-1 fit:gap-[clamp(0.625rem,1.6svh,1.25rem)]">

        {/* Name — phones: "post anonymously" under the field; desktop: on the label row */}
        <div className="flex shrink-0 flex-col gap-2.5 lg:gap-2">
          <div className="flex items-end justify-between gap-4">
            <label htmlFor="story-name" className={fieldLabel}>
              Your Name <span className="text-[#1c1c1c]/45">(optional)</span>
            </label>
            <span className="hidden lg:block"><Anonymous checked={anonymous} onChange={setAnonymous} /></span>
          </div>
          <input
            id="story-name"
            type="text"
            autoComplete="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${field} ${fieldHeight}`}
          />
          <span className="lg:hidden"><Anonymous checked={anonymous} onChange={setAnonymous} /></span>
        </div>

        {/* Message — counter on the label row; takes the spare height on `fit:` screens */}
        <div className="flex flex-col gap-2.5 lg:gap-2 fit:min-h-0 fit:flex-1">
          <div className="flex items-end justify-between gap-4">
            <label htmlFor="story-message" className={fieldLabel}>
              {isTestimony ? "Your Testimony" : "Your Prayer Point"}
            </label>
            <span aria-live="polite" className="text-[12px] leading-none font-semibold text-[#8a8d93]">
              {message.length} / {MAX_LENGTH}
            </span>
          </div>
          <textarea
            id="story-message"
            required
            maxLength={MAX_LENGTH}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              if (status === "sent" || status === "error") setStatus("idle")
            }}
            placeholder={isTestimony ? "Enter your testimony" : "Enter your prayer point"}
            className={`${field} h-[140px] resize-none py-3 leading-[1.6] lg:h-40 fit:h-auto fit:max-h-[240px] fit:min-h-[72px] fit:flex-1`}
          />
        </div>

        {/* Contact */}
        <div className="flex shrink-0 flex-col gap-2.5 lg:gap-2">
          <label htmlFor="story-contact" className={fieldLabel}>
            <span className="lg:hidden">Your Phone/Email <span className="text-[#242323]/60">(optional)</span></span>
            <span className="hidden lg:inline">
              Phone or Email <span className="text-[#242323]/60">(optional — only used if we need to follow up)</span>
            </span>
          </label>
          <input
            id="story-contact"
            type="text"
            autoComplete="email"
            placeholder="Never shown publicly"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className={`${field} ${fieldHeight}`}
          />
        </div>

        <div className="flex shrink-0 flex-col gap-3">
          <button type="submit" disabled={status === "sending"} className={`${button.primary} w-full`}>
            {status === "sending" ? "Sending…" : "Submit"}
          </button>
          {status === "sent" && (
            <p role="status" className="animate-fade-in text-center text-[13px] font-medium text-[#3c8a2e]">
              {isTestimony ? "Thank you! Your testimony has been sent for review." : "Thank you. We'll be praying with you."}
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="animate-fade-in text-center text-[13px] font-medium text-[#d32f2f]">
              Something went wrong. Please check your connection and try again.
            </p>
          )}
        </div>
      </form>

      {/* Footnote */}
      <p className="max-w-[560px] shrink-0 text-center text-[12px] leading-[1.55] text-[#242323]/60 lg:text-[13px]">{footnote}</p>
    </div>
  )
}

// 14px checkbox + "Post this anonymously"
function Anonymous({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex w-fit cursor-pointer items-center gap-1.5 text-[12px] leading-none font-medium text-[#191919]/70">
      <span className="relative flex size-3.5 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer size-full cursor-pointer appearance-none rounded-[3px] border border-[#191919]/60 bg-[#d9d9d9] checked:border-[#00a8e8] checked:bg-[#00a8e8]"
        />
        <Check aria-hidden strokeWidth={3} className="pointer-events-none absolute inset-0 m-auto hidden size-2.5 text-white peer-checked:block" />
      </span>
      Post this anonymously
    </label>
  )
}
