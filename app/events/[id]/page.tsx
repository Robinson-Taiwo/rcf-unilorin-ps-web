import Image from "next/image"
import { notFound } from "next/navigation"
import SiteNav from "@/components/site-nav"
import SiteFooter from "@/components/site-footer"
import VisitCard from "@/components/visit-card"
import EventCard from "@/components/event-card"
import BackButton from "@/components/back-button"
import SwipeRow from "@/components/swipe-row"
import { events, getEvent } from "@/data/events"
import { button, container, revealDelay, type } from "@/components/rcf/Ui"

// Pre-render one page per event at build time
export function generateStaticParams() {
  return events.map((event) => ({ id: event.id }))
}

// Phones (mobile frame 491:1287): title, poster, centred details 12px apart (Overview, Date & Time, Location),
//   160 x 40 Register button with the note 16px below, then "See More Upcoming Events" as a one-card swipe row
//   with dots. No back button, no "Visit us".
// Desktop (desktop frame): back button, big title, poster + description + Register on the left,
//   divider, details panel on the right; then more events and "Visit us".
export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = getEvent(id)

  if (!event) notFound()

  // "See more" shows other events (two on desktop, a swipe row on phones)
  const moreEvents = events.filter((e) => e.id !== event.id)

  // Desktop details panel
  const details = [
    { label: "Overview", value: event.overview },
    { label: "Recurrence", value: event.recurrence },
    { label: "Date", value: event.date },
    { label: "Time", value: event.time },
    { label: "Cost", value: event.cost },
    { label: "Location & Directions", value: event.location, href: event.directionsUrl },
  ]

  // Phone details (mobile frame groups these differently)
  const mobileDetails = [
    { label: "Overview", value: [event.overview, ...event.description].join(" ") },
    { label: "Date & Time", value: `${event.date} by ${event.time}` },
    { label: "Location", value: event.location, href: event.directionsUrl },
  ]

  return (
    <main className="w-full overflow-x-clip bg-[#d9d9d9]">

      <SiteNav />


      {/* ===================== EVENT DETAILS ===================== */}
      <section className={`${container} pt-9 pb-10 lg:pt-14 lg:pb-section`}>

        <div className="flex flex-col items-center gap-8 text-center lg:items-start lg:text-left">
          <div data-reveal className="hidden lg:block">
            <BackButton href="/events" />
          </div>
          <h1 data-reveal style={revealDelay(100)} className={`${type.title} text-[#1c1c1c] max-lg:font-semibold`}>
            <span className="lg:hidden">{event.mobileTitle}</span>
            <span className="hidden lg:inline">{event.shortTitle}</span>
          </h1>
        </div>

        <div className="mt-14 flex flex-col gap-5 lg:mt-12 lg:flex-row lg:items-stretch lg:justify-between lg:gap-12">

          {/* LEFT — poster (+ description and Register on desktop) */}
          <div className="flex w-full flex-col items-start gap-8 lg:max-w-[640px]">
            <div data-reveal="scale" style={revealDelay(150)} className="relative aspect-[10/9] w-full overflow-hidden rounded-[10px] lg:aspect-[682/595] lg:rounded-[14px]">
              <Image src={event.image} alt={event.title} fill priority sizes="(min-width: 1024px) 640px, 100vw" className="object-cover object-[center_9%]" />
            </div>

            <div data-reveal className={`${type.body} hidden max-w-[620px] space-y-5 lg:block`}>
              {event.description.map((paragraph) => (
                <p key={paragraph} className="text-[#242323]/75">{paragraph}</p>
              ))}
              <p className="font-medium text-[#1c1c1c]">{event.note}</p>
            </div>

            <a href={event.registerUrl} data-reveal className={`${button.primary} hidden lg:inline-flex`}>Register now</a>
          </div>

          {/* Phones — centred detail groups, Register, note */}
          <div className="flex flex-col items-center text-center lg:hidden">
            <dl className="flex flex-col gap-4">
              {mobileDetails.map((item) => (
                <div key={item.label} data-reveal className="flex flex-col items-center gap-2">
                  <dt className="font-serif text-[20px] leading-none font-semibold text-[#00a8e8]">{item.label}</dt>
                  <dd className={`${type.body} text-[#242323]/75`}>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">{item.value}</a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <a href={event.registerUrl} className={`${button.primary} mt-10 w-[160px]`}>Register now</a>
            <p className="mt-4 text-[13px] leading-[1.5] font-medium text-[#1c1c1c]/80">{event.mobileNote}</p>
          </div>

          {/* Desktop — divider + details panel (sticks while the description scrolls) */}
          <div aria-hidden className="hidden w-px shrink-0 bg-[#8a8d93]/50 lg:block" />

          <aside data-reveal="right" style={revealDelay(250)} className="hidden w-full flex-col gap-7 lg:sticky lg:top-28 lg:flex lg:max-w-[400px] lg:self-start">
            <h2 className={`${type.heading} text-[#00a8e8]`}>Event Details</h2>
            <dl className="flex flex-col gap-6">
              {details.map((item) => (
                <div key={item.label} className="flex flex-col gap-2">
                  <dt className="text-base font-semibold text-[#00a8e8]">
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noreferrer" className="hover:underline">{item.label}</a>
                    ) : (
                      item.label
                    )}
                  </dt>
                  <dd className={`${type.body} text-[#242323]/75`}>{item.value}</dd>
                </div>
              ))}
            </dl>
          </aside>

        </div>
      </section>


      {/* ===================== SEE MORE UPCOMING EVENTS ===================== */}
      <section className={`${container} pt-4 pb-10 lg:pt-0 lg:pb-section`}>
        <h2 data-reveal className={`${type.heading} text-center text-[#1c1c1c] lg:text-left`}>See More Upcoming Events</h2>

        {/* Phones: one card at a time with dots (Figma). Tablet up: 2 columns */}
        <div className="mt-7 lg:mt-12">
          <SwipeRow>
            {moreEvents.map((e) => (
              <EventCard key={e.id} image={e.image} date={e.listDate} shortDate={e.shortDate} title={e.title} detailsUrl={`/events/${e.id}`} align="center" />
            ))}
          </SwipeRow>
        </div>
      </section>


      {/* ===================== VISIT US — desktop only (the mobile frame has none) ===================== */}
      <section className={`${container} hidden pb-section lg:block`}>
        <VisitCard />
      </section>


      <SiteFooter />

    </main>
  )
}
