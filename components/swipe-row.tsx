"use client"

import { Children, useRef, useState, type ReactNode } from "react"

// One-card-at-a-time swipe row with dots (mobile frames' "Carousel Indicator").
// Phones only: from `sm` up the children sit in a 2-column grid and the dots hide.
export default function SwipeRow({ children }: { children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const items = Children.toArray(children)

  function step() {
    const el = track.current
    const [a, b] = [el?.children[0] as HTMLElement | undefined, el?.children[1] as HTMLElement | undefined]
    return a && b ? b.offsetLeft - a.offsetLeft : 1
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        ref={track}
        onScroll={() => track.current && setActive(Math.min(items.length - 1, Math.round(track.current.scrollLeft / step())))}
        className="-mx-[30px] flex w-[calc(100%+60px)] snap-x snap-mandatory gap-[60px] overflow-x-auto px-[30px] [scrollbar-width:none] sm:mx-0 sm:grid sm:w-full sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((child, i) => (
          <div key={i} className={`w-full shrink-0 snap-center ${i > 1 ? "sm:hidden" : ""}`}>
            {child}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 sm:hidden">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show item ${i + 1}`}
            aria-current={i === active}
            onClick={() => track.current?.scrollTo({ left: i * step(), behavior: "smooth" })}
            className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${i === active ? "w-5 bg-[#18306e]" : "w-2 bg-[#18306e]/30"}`}
          />
        ))}
      </div>
    </div>
  )
}
