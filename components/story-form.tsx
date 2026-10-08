"use client"

import { useState, type FormEvent } from "react"
import { Check } from "lucide-react"

type StoryType = "testimony" | "prayer"

const MAX_LENGTH = 600

const tabs = [
  { value: "testimony", label: "TESTIMONY" },
  { value: "prayer", label: "PRAYER POINT" },
] as const

// Field labels: Inter Medium 16, −3% letter spacing
const labelClass = "cap-trim block text-[16px] leading-[27px] font-medium tracking-[-0.03em] text-[#1c1c1c]"

// Inputs: #E8E8E9 fill, 0.5px grey border, 25px corners, Inter Light 18
const fieldClass =
  "w-full rounded-[25px] border-[0.5px] border-[#8a8d93] bg-[#e8e8e9] text-base font-light tracking-[0.05em] text-[#1c1c1c] outline-none transition-colors placeholder:text-[#242323]/70 focus:border-[#00a8e8] lg:text-[18px]"

export default function StoryForm() {
  const [type, setType] = useState<StoryType>("testimony")
  const [name, setName] = useState("")
  const [anonymous, setAnonymous] = useState(false)
  const [message, setMessage] = useState("")
  const [contact, setContact] = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Move your existing submit logic here. Everything you need:
    // { type, name, anonymous, message, contact }
  }

  return (
    <>
      {/* ===== Toggle — 403 x 66 track, two 174 x 45 tabs, 15px apart ===== */}
      <div
        role="group"
        aria-label="Submission type"
        className="mt-[31px] flex h-[66px] w-full max-w-[403px] items-center justify-center gap-[15px] rounded-[33px] bg-[#8a8d93]/20 px-[10px]"
      >
        {tabs.map((tab) => {
          const active = type === tab.value
          return (
            <button
              key={tab.value}
              type="button"
              aria-pressed={active}
              onClick={() => setType(tab.value)}
              className={`flex h-[45px] w-full max-w-[174px] cursor-pointer items-center justify-center rounded-[25px] text-[14px] leading-[27px] font-medium tracking-[0.05em] transition-colors sm:text-[16px] ${
                active ? "bg-[#00a8e8] text-white" : "text-[#00a8e8] hover:bg-[#00a8e8]/10"
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>


      {/* ===== Form — 795 wide, 55px below the toggle ===== */}
      <form onSubmit={handleSubmit} className="mt-[55px] flex w-full max-w-[795px] flex-col gap-[31px]">

        {/* Field groups, 25px apart */}
        <div className="flex flex-col gap-[25px]">

          {/* Name + "post anonymously" (14px below the input) */}
          <div className="flex flex-col gap-[14px]">
            <div className="flex flex-col gap-[25px]">
              <label htmlFor="story-name" className={labelClass}>
                Your Name <span className="text-black/40">(optional)</span>
              </label>
              <input
                id="story-name"
                type="text"
                autoComplete="name"
                placeholder="E.g Amaka Nwafor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${fieldClass} h-[79px] px-[25px]`}
              />
            </div>

            {/* 15px checkbox, 3px corners */}
            <label className="flex w-fit cursor-pointer items-center gap-[6px] text-[13px] leading-[27px] font-medium tracking-[-0.03em] text-[#191919]/70">
              <span className="relative flex size-[15px] shrink-0">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="peer size-[15px] cursor-pointer appearance-none rounded-[3px] border border-[#191919]/70 bg-[#d9d9d9] checked:border-[#00a8e8] checked:bg-[#00a8e8]"
                />
                <Check aria-hidden strokeWidth={3} className="pointer-events-none absolute inset-0 m-auto hidden size-[11px] text-white peer-checked:block" />
              </span>
              Post this anonymously
            </label>
          </div>

          {/* Message — 214 tall, counter 20px below on the right */}
          <div className="flex flex-col items-end gap-5">
            <div className="flex w-full flex-col gap-[25px]">
              <label htmlFor="story-message" className={labelClass}>
                {type === "testimony" ? "Your Testimony" : "Your Prayer Point"}
              </label>
              <textarea
                id="story-message"
                required
                maxLength={MAX_LENGTH}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  type === "testimony"
                    ? "Tell us what God has done…"
                    : "What would you like us to pray with you about?"
                }
                className={`${fieldClass} h-[214px] resize-none px-[26px] py-[27px] leading-[27px]`}
              />
            </div>
            <p aria-live="polite" className="cap-trim text-[13px] leading-[27px] font-semibold tracking-[-0.03em] text-[#8a8d93]">
              {message.length} / {MAX_LENGTH}
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-[25px]">
            <label htmlFor="story-contact" className={labelClass}>
              Phone or Email <span className="text-[#242323]/70">(optional — only used if we need to follow up)</span>
            </label>
            <input
              id="story-contact"
              type="text"
              autoComplete="email"
              placeholder="Never shown publicly"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className={`${fieldClass} h-[79px] px-[25px]`}
            />
          </div>

        </div>

        {/* Submit — full width x 55, 13px corners */}
        <button
          type="submit"
          className="flex h-[55px] w-full cursor-pointer items-center justify-center rounded-[13px] bg-[#00a8e8] text-[18px] leading-[27px] font-semibold tracking-[0.05em] text-white transition-colors hover:bg-[#00a8e8]/90"
        >
          Submit
        </button>

      </form>
    </>
  )
}