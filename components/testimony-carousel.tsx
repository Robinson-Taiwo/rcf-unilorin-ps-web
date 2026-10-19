"use client"

import { useRef, useState } from "react"
import { revealDelay } from "@/components/rcf/Ui"

export type Testimony = { label: string; quote: string; by: string; dark: boolean }

// Phones and tablets: swipeable row — one card (with the next one peeking) on phones, ~1.6 on tablets; dots underneath.
// Desktop: 3 equal columns (Figma 387 x 602 → content height, 360px minimum).
export default function TestimonyCarousel({ items }: { items: Testimony[] }) {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  // Distance between card starts = card width + gap
  function step() {
    const el = track.current
    const [a, b] = [el?.children[0] as HTMLElement | undefined, el?.children[1] as HTMLElement | undefined]
    return a && b ? b.offsetLeft - a.offsetLeft : 1
  }

  function handleScroll() {
    const el = track.current
    if (el) setActive(Math.min(items.length - 1, Math.round(el.scrollLeft / step())))
  }

  function goTo(i: number) {
    track.current?.scrollTo({ left: i * step(), behavior: "smooth" })
  }

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div
        ref={track}
        onScroll={handleScroll}
        className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {items.map((t, i) => (
          <article
            key={i}
            data-reveal
            style={revealDelay(i * 120)}
            className={`flex w-[86%] shrink-0 snap-start flex-col items-center justify-between gap-6 rounded-[12px] px-6 py-7 text-center transition-[translate,box-shadow] duration-500 ease-out-expo sm:w-[60%] lg:w-full lg:min-h-[360px] lg:items-start lg:gap-8 lg:rounded-[20px] lg:p-9 lg:text-left lg:hover:-translate-y-1.5 lg:hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.45)] ${
              t.dark ? "bg-[#1d1c1c] text-[#d9d9d9]" : "bg-[#d9d9d9] text-[#1c1c1c]"
            }`}
          >
            {/* Label — 120 x 32 in the design */}
            <span className="inline-flex h-8 min-w-[120px] items-center justify-center rounded-full bg-[#00a8e8] px-4 text-[11px] leading-none font-semibold uppercase tracking-[0.1em] text-[#1c1c1c]">
              {t.label}
            </span>
            <p className="text-[17px] leading-[1.45] font-light tracking-[-0.01em] lg:text-[19px] lg:leading-[1.55] lg:font-medium">{`"${t.quote}"`}</p>
            <p className="text-[12px] tracking-[0.05em] opacity-75 lg:text-[13px]">— {t.by}</p>
          </article>
        ))}
      </div>

      {/* Dots — phones and tablets */}
      <div className="flex items-center gap-1.5 lg:hidden">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show testimony ${i + 1}`}
            aria-current={i === active}
            onClick={() => goTo(i)}
            className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${i === active ? "w-5 bg-[#18306e]" : "w-2 bg-[#18306e]/30"}`}
          />
        ))}
      </div>
    </div>
  )
}
