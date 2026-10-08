"use client"

import { useState } from "react"
import { body } from "@/components/rcf/Ui"

// Paste the descriptions from your current accordion into each `body`
const values = [
  { title: "Holiness", body: "Your Holiness description" },
  { title: "Accountability and Responsibility", body: "Your Accountability and Responsibility description" },
  { title: "Resourcefulness", body: "Your Resourcefulness description" },
  { title: "Sacrifice", body: "Your Sacrifice description" },
]

// 685 wide; each row is 169 tall with a 60%-grey top border, the last row also has a bottom border
export default function ValuesAccordion() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="w-full border-b border-[#d9d9d9]/60 lg:w-[685px] lg:shrink-0">
      {values.map((value, i) => {
        const isOpen = open === i
        return (
          <div key={value.title} className="border-t border-[#d9d9d9]/60">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex min-h-[120px] w-full cursor-pointer items-center justify-between gap-6 px-[25px] py-[10px] text-left lg:h-[169px]"
            >
              <span className="text-[24px] leading-tight text-white lg:text-[32px]">{value.title}</span>

              {/* 28 x 16 chevron from the design */}
              <svg
                aria-hidden
                width="28"
                height="16"
                viewBox="0 0 28 16"
                fill="none"
                className={`shrink-0 text-white transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              >
                <path d="M1.5 1.5 14 14.5 26.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className={`px-[25px] pb-10 text-[#d9d9d9]/60 ${body}`}>{value.body}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}