"use client"

import { useState } from "react"
import { revealDelay, type } from "@/components/rcf/Ui"

// Paste the descriptions from your current accordion into each `body`
const values = [
  { title: "Holiness", body: "Your Holiness description" },
  { title: "Accountability and Responsibility", body: "Your Accountability and Responsibility description" },
  { title: "Resourcefulness", body: "Your Resourcefulness description" },
  { title: "Sacrifice", body: "Your Sacrifice description" },
]

// Phones (mobile frame): compact rows, 15px titles, divider under each row.
// Desktop (desktop frame): 88px rows (Figma 169), 22px titles, divider above each row plus one at the bottom.
export default function ValuesAccordion() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="flex w-full flex-col lg:max-w-[640px] lg:flex-1 lg:border-b lg:border-[#d9d9d9]/25">
      {values.map((value, i) => {
        const isOpen = open === i
        return (
          <div key={value.title} data-reveal style={revealDelay(i * 100)} className="border-b border-[#d9d9d9]/40 lg:border-t lg:border-b-0 lg:border-[#d9d9d9]/25">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="group flex h-14 w-full cursor-pointer items-center justify-between gap-4 px-2.5 text-left lg:h-[88px] lg:gap-6 lg:px-0"
            >
              <span className="text-[15px] leading-snug text-white transition-[color,translate] duration-500 ease-out-expo group-hover:text-[#00a8e8] lg:text-subheading lg:group-hover:translate-x-1.5">
                {value.title}
              </span>
              <svg
                aria-hidden
                width="28"
                height="16"
                viewBox="0 0 28 16"
                fill="none"
                className={`h-auto w-5 shrink-0 text-white transition-transform duration-500 ease-out-expo ${isOpen ? "rotate-180" : ""}`}
              >
                <path d="M1.5 1.5 14 14.5 26.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="overflow-hidden">
                <p className={`${type.body} px-2.5 pb-5 text-[#d9d9d9]/65 lg:px-0 lg:pb-7`}>{value.body}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
