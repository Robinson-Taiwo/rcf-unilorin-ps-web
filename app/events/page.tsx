import SiteNav from "@/components/site-nav"
import SiteFooter from "@/components/site-footer"
import VisitCard from "@/components/visit-card"
import EventCard from "@/components/event-card"
import BackButton from "@/components/back-button"
import { events } from "@/data/events"

export default function EventsPage() {
  return (
    <main className="w-full overflow-x-hidden bg-[#d9d9d9]">

      {/* ===================== NAV ===================== */}
      <SiteNav />


      {/* ===================== HEADER + EVENTS GRID — 1204 wide ===================== */}
      <section className="mx-auto w-full max-w-[1244px] px-5 pt-14 pb-16 lg:pt-[144px] lg:pb-[130px]">

        <BackButton href="/" />

        {/* Title (568 wide) + intro paragraph bottom-aligned, 15px apart */}
        <div className="mt-[42px] flex flex-col gap-6 md:flex-row md:items-end md:gap-[15px]">
          <h1 className="cap-trim shrink-0 font-serif text-[52px] leading-[56px] tracking-[-0.03em] text-[#1c1c1c] md:w-[400px] lg:w-[568px] lg:text-[77px] lg:leading-[83px]">
            UPCOMING
            <br />
            EVENTS
          </h1>

          <p className="cap-trim min-w-0 flex-1 text-base leading-[26px] tracking-[0.05em] text-black lg:text-[18px] lg:leading-[27px]">
            Stay in the loop with what&apos;s happening at RCF. From worship Sundays to varieties Sundays,
            there&apos;s always something to look forward to. See what&apos;s coming up.
          </p>
        </div>

        {/* 2 columns — 24px column gap, 72px row gap */}
        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:mt-[95px] lg:gap-y-[72px]">
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


      {/* ===================== VISIT US — 130px above and below ===================== */}
      <section className="w-full px-5 pb-16 lg:pb-[130px]">
        <VisitCard />
      </section>


      {/* ===================== FOOTER ===================== */}
      <SiteFooter />

    </main>
  )
}