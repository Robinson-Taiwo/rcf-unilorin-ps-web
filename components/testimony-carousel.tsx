"use client"

import { useRef, useState } from "react"

export type Testimony = { label: string; quote: string; by: string; dark: boolean }

const GAP = 16

// Mobile: one 300-wide card at a time, swipe to scroll, dots underneath
// Tablet up: 3 columns. Desktop: 387 x 602 cards, 19px gap
export default function TestimonyCarousel({ items }: { items: Testimony[] }) {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  function handleScroll() {
    const el = track.current
    if (el) setActive(Math.round(el.scrollLeft / (el.clientWidth + GAP)))
  }

  function goTo(i: number) {
    const el = track.current
    el?.scrollTo({ left: i * (el.clientWidth + GAP), behavior: "smooth" })
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        ref={track}
        onScroll={handleScroll}
        className="flex w-full max-w-[300px] snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] md:grid md:max-w-none md:grid-cols-3 md:gap-[19px] md:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {items.map((t, i) => (
          <article
            key={i}
            className={`flex w-full shrink-0 snap-center flex-col items-center gap-8 rounded-[10px] px-[30px] py-[25px] lg:h-[602px] lg:justify-center lg:gap-[81px] lg:rounded-[25px] lg:px-[10px] lg:py-0 ${
              t.dark ? "bg-[#1d1c1c] text-[#d9d9d9]" : "bg-[#d9d9d9] text-[#1c1c1c]"
            }`}
          >
            <div className="flex w-full justify-center lg:max-w-[315px] lg:justify-start">
              <span className="flex h-8 w-[120px] items-center justify-center rounded-[26px] bg-[#00a8e8] text-[10px] font-medium uppercase tracking-[0.1em] text-[#1c1c1c]">
                {t.label}
              </span>
            </div>

            <div className="flex w-full max-w-[250px] flex-col items-center gap-[18px] text-center lg:max-w-[325px] lg:items-start lg:gap-[56px] lg:text-left">
              <p className="cap-trim text-[18px] leading-[1.2] font-light tracking-[-0.02em] lg:min-h-[255px] lg:text-[24px] lg:leading-[39px] lg:font-medium lg:tracking-[0.05em]">
                {`"${t.quote}"`}
              </p>
              <p className="cap-trim text-[12px] tracking-[0.05em] lg:text-[16px]">— {t.by}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Dots — 32px wide row, mobile only */}
      <div className="flex items-center gap-1 md:hidden">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show testimony ${i + 1}`}
            aria-current={i === active}
            onClick={() => goTo(i)}
            className={`size-2 cursor-pointer rounded-full transition-colors ${i === active ? "bg-[#18306e]" : "bg-[#18306e]/30"}`}
          />
        ))}
      </div>
    </div>
  )
}