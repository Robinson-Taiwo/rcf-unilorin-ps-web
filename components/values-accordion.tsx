'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

type Value = { title: string; body: string }

// Placeholder copy — replace with the fellowship's real value statements.
const DEFAULT_VALUES: Value[] = [
  {
    title: 'Holiness',
    body: 'We pursue a life set apart for God, in what we say, what we do, and who we are when no one is watching.',
  },
  {
    title: 'Accountability and Responsibility',
    body: 'We own our walk with God, our work, and our commitments, and we help one another stay faithful to them.',
  },
  {
    title: 'Resourcefulness',
    body: 'We make the most of what we have: our time, talents, and opportunities, to serve well on campus and beyond.',
  },
  {
    title: 'Sacrifice',
    body: 'We give of ourselves, our time, and our comfort, because the gospel is worth it and people are worth it.',
  },
]

const ValuesAccordion = ({ values = DEFAULT_VALUES }: { values?: Value[] }) => {
  // Only one item open at a time. null = all closed (matches the screenshot).
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="values-accordion w-full border-t border-white/25">
      {values.map((value, i) => {
        const isOpen = openIndex === i

        return (
          <div key={value.title} className="border-b border-white/25">

            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`value-panel-${i}`}
              className="flex w-full items-center justify-between gap-6 py-10 px-5 text-left text-white text-xl md:text-2xl cursor-pointer"
            >
              <span>{value.title}</span>
              <ChevronDown
                size={28}
                strokeWidth={1.5}
                className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* grid-rows trick: animates height from 0 to content height without JS measuring */}
            <div
              id={`value-panel-${i}`}
              role="region"
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-10 text-white/60 text-base leading-relaxed max-w-lg">
                  {value.body}
                </p>
              </div>
            </div>

          </div>
        )
      })}
    </div>
  )
}

export default ValuesAccordion