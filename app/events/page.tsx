import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import VisitCard from '@/components/visit-card'
import EventCard from '@/components/event-card'
import { events } from '@/data/events'

const page = () => {
  return (
    <div className="w-full overflow-x-hidden">

      {/* ===================== NAV ===================== */}
      <SiteNav />

      {/* ===================== HEADER + EVENTS GRID ===================== */}
      <section className="events-page w-full bg-[#d9d9d9] px-6 md:px-20 pt-16 md:pt-24 pb-16 md:pb-24">

        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 bg-[#1c1c1c] text-white text-xs font-medium tracking-wide rounded-full pl-3 pr-5 py-2.5 mb-6"
        >
          <ChevronLeft size={14} />
          BACK
        </Link>

        {/* Title (left) + intro paragraph (right, bottom-aligned on desktop) */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10 mb-12 md:mb-16">

          <h1 className="font-serif text-[#1c1c1c] text-5xl md:text-6xl leading-[0.95] max-w-xs md:max-w-sm">
            UPCOMING EVENTS
          </h1>

          <p className="text-[#1c1c1c] text-xs md:text-[13px] leading-relaxed max-w-md">
            Stay in the loop with what&apos;s happening at RCF. From worship
            Sundays to varieties Sundays, there&apos;s always something to look
            forward to. See what&apos;s coming up.
          </p>

        </div>

        {/* 1 column on mobile, 2 on tablet, 3 on wide screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-10 md:gap-y-12">
          {events.map((event) => (
            <EventCard
              key={event.id}
              image={event.image}
              date={event.listDate}
              title={event.title}
              detailsUrl={`/events/${event.id}`}
            />
          ))}
        </div>

      </section>

      {/* ===================== VISIT US ===================== */}
      <VisitCard />

      {/* ===================== FOOTER ===================== */}
      <SiteFooter />

    </div>
  )
}

export default page
