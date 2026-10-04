import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import VisitCard from '@/components/visit-card'
import EventCard from '@/components/event-card'
import { Button } from '@/components/ui/button'
import { events, getEvent } from '@/data/events'
// import { events, getEvent } from '@/data/Events'

// Pre-render one page per event at build time
export function generateStaticParams() {
  return events.map((event) => ({ id: event.id }))
}

// Next.js 15+: params is a Promise
const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const event = getEvent(id)

  if (!event) notFound()

  // "See more" shows two other events
  const moreEvents = events.filter((e) => e.id !== event.id).slice(0, 2)

  // Right-hand side panel rows
  const details = [
    { label: 'Overview', value: event.overview },
    { label: 'Recurrence', value: event.recurrence },
    { label: 'Date', value: event.date },
    { label: 'Time', value: event.time },
    { label: 'Cost', value: event.cost },
    { label: 'Location & Directions', value: event.location, href: event.directionsUrl },
  ]

  return (
    <div className="w-full overflow-x-hidden">

      {/* ===================== NAV ===================== */}
      <SiteNav />

      {/* ===================== EVENT DETAILS ===================== */}
      <section className="event-details w-full bg-[#d9d9d9] px-6 md:px-12 lg:px-[120px] pt-14 md:pt-20 pb-16 md:pb-24">

        {/* Back button */}
        <Link
          href="/events"
          className="inline-flex items-center gap-1 bg-[#1c1c1c] text-white text-xs font-medium tracking-wide rounded-full pl-3 pr-5 py-2.5 mb-4"
        >
          <ChevronLeft size={14} />
          BACK
        </Link>

        {/* Big sans-serif title */}
        <h1 className="font-sans font-bold tracking-tight text-[#1c1c1c] text-4xl sm:text-6xl lg:text-[109px] leading-none mb-8 md:mb-10">
          {event.shortTitle}
        </h1>

        {/* Two columns: poster + copy | divider + details panel */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-10 md:gap-x-8">

          {/* LEFT — poster, description, register */}
          <div className="flex flex-col gap-8">

            <div className="relative   h-[595px] w-[682px] rounded-xl overflow-hidden">
              <Image
                src={event.image}
                alt={event.title}
                fill
                priority
                // sizes="(min-width: 768px) 55vw, 92vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col gap-5 text-[#1c1c1c] text-sm md:text-base leading-relaxed max-w-xl">
              {event.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p>{event.note}</p>
            </div>

            <a
              href={event.registerUrl}
              className="inline-flex items-center justify-center bg-[#4FA8E0] text-[#0b2a4a] text-[13px] w-full sm:w-fit h-11.5 px-8 rounded-lg font-medium tracking-wide hover:bg-[#4FA8E0]/90"
            >
              REGISTER NOW
            </a>

          </div>

          {/* RIGHT — details panel with a vertical divider on desktop */}
          <aside className="flex flex-col gap-6 border-t border-gray-500 pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-6">

            <h2 className="text-[#4FA8E0] text-2xl font-semibold tracking-tight">Event Details</h2>

            {details.map((item) => (
              <div key={item.label} className="flex flex-col gap-1.5">
                {item.href ? (
                  <a href={item.href} className="text-[#4FA8E0] text-lg font-medium hover:underline w-fit">
                    {item.label}
                  </a>
                ) : (
                  <h3 className="text-[#4FA8E0] text-lg font-medium">{item.label}</h3>
                )}
                <p className="text-gray-700 text-sm leading-relaxed">{item.value}</p>
              </div>
            ))}

          </aside>

        </div>

      </section>


      {/* ===================== SEE MORE UPCOMING EVENTS ===================== */}
      <section className="more-events w-full bg-[#d9d9d9] px-6 md:px-12 lg:px-20 pb-16 md:pb-20">

        <h2 className="font-sans font-semibold tracking-tight text-[#1c1c1c] text-3xl sm:text-4xl md:text-5xl mb-8 md:mb-10">
          See More Upcoming Events
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-10">
          {moreEvents.map((e) => (
            <EventCard
              key={e.id}
              image={e.image}
              date={e.listDate}
              title={e.title}
              detailsUrl={`/events/${e.id}`}
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
