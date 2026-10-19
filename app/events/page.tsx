import SiteNav from "@/components/site-nav"
import SiteFooter from "@/components/site-footer"
import VisitCard from "@/components/visit-card"
import EventCard from "@/components/event-card"
import BackButton from "@/components/back-button"
import { events } from "@/data/events"
import { container, revealDelay, type } from "@/components/rcf/Ui"

// Phones (mobile frame 488:900): "UPCOMING EVENTS" title, then the cards stacked 16px apart. No back button,
//   no intro paragraph, no "Visit us".
// Desktop (desktop frame): back button, title with the intro paragraph beside it, 2-column grid, "Visit us".
export default function EventsPage() {
  return (
    <main className="w-full overflow-x-clip bg-[#d9d9d9]">

      <SiteNav />


      {/* ===================== HEADER + EVENTS GRID ===================== */}
      <section className={`${container} pt-7 pb-10 lg:pt-14 lg:pb-section`}>
        <div data-reveal className="mb-8 hidden lg:block">
          <BackButton href="/" />
        </div>

        {/* Title + intro (intro on desktop only), bottom-aligned on one row */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h1 data-reveal style={revealDelay(100)} className={`${type.title} shrink-0 text-[#1c1c1c]`}>
            UPCOMING
            <br />
            EVENTS
          </h1>
          <p data-reveal style={revealDelay(200)} className={`${type.body} hidden max-w-[520px] text-[#242323]/80 lg:block`}>
            Stay in the loop with what&apos;s happening at RCF. From worship Sundays to varieties Sundays,
            there&apos;s always something to look forward to. See what&apos;s coming up.
          </p>
        </div>

        {/* Phones: one column, 16px apart (Figma). Tablet up: 2 columns */}
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 md:gap-y-10 lg:mt-12 lg:gap-y-12">
          {events.map((event, i) => (
            <div key={event.id} data-reveal style={revealDelay((i % 2) * 120)}>
              <EventCard image={event.image} date={event.listDate} shortDate={event.shortDate} title={event.title} detailsUrl={`/events/${event.id}`} />
            </div>
          ))}
        </div>
      </section>


      {/* ===================== VISIT US — desktop only ===================== */}
      <section className={`${container} hidden pb-section lg:block`}>
        <VisitCard />
      </section>


      <SiteFooter />

    </main>
  )
}
