import React from 'react'
import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

const serviceTimes = [
  { name: 'Sunday Service', time: '7:20AM WAT' },
  { name: 'Tuesday Bible Study', time: '6:15PM WAT' },
  { name: 'Thursday Prayer Meeting', time: '6:15PM WAT' },
]

const VisitCard = () => {
  return (
    <section className="visit w-full bg-[#d9d9d9] px-4 md:px-12 py-12 md:py-20">

      <div className="visit-card border border-gray-400 rounded-[28px] md:rounded-[40px] px-6 md:px-9 py-8 md:py-10 md:pb-12 flex flex-col md:flex-row md:justify-between gap-10 md:gap-12">

        {/* LEFT — badge, heading, copy, CTA */}
        <div className="flex flex-col gap-5">
          <span className="badge border border-[#1c1c1c]/70 text-[#1c1c1c] text-[10px] font-medium tracking-widest rounded-full px-5 py-1.5 w-fit">
            VISIT US
          </span>

          <h2 className="font-serif font-bold text-[#1c1c1c] text-4xl sm:text-5xl md:text-[56px] leading-tight">
            We saved you a seat
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed max-w-md">
            Pull up. You&apos;re most welcome.
            <br />
            Come find your people, grow in faith, and experience genuine community.
          </p>

          <Button className="bg-[#4FA8E0] text-[#0b2a4a] text-[14px] w-full sm:w-43 h-11.5 rounded-lg font-medium tracking-wide mt-2 md:mt-4 hover:bg-[#4FA8E0]/90">
            PLAN YOUR VISIT
          </Button>
        </div>

        {/* RIGHT — service times */}
        <div className="flex flex-col gap-5 md:pt-6">
          {serviceTimes.map((item) => (
            <div key={item.name} className="flex flex-col gap-1">
              <h3 className="text-xl md:text-2xl text-[#1c1c1c]">{item.name}</h3>
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Clock size={16} />
                <span>{item.time}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  )
}

export default VisitCard
