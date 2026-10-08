import Image from "next/image"
import { notFound } from "next/navigation"
import SiteNav from "@/components/site-nav"
import SiteFooter from "@/components/site-footer"
import VisitCard from "@/components/visit-card"
import EventCard from "@/components/event-card"
import BackButton from "@/components/back-button"
import { events, getEvent } from "@/data/events"

// Pre-render one page per event at build time
export function generateStaticParams() {
  return events.map((event) => ({ id: event.id }))
}

// Next.js 15+: params is a Promise
export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = getEvent(id)

  if (!event) notFound()

  // "See more" shows two other events
  const moreEvents = events.filter((e) => e.id !== event.id).slice(0, 2)

  // Right-hand panel rows
  const details = [
    { label: "Overview", value: event.overview },
    { label: "Recurrence", value: event.recurrence },
    { label: "Date", value: event.date },
    { label: "Time", value: event.time },
    { label: "Cost", value: event.cost },
    { label: "Location & Directions", value: event.location, href: event.directionsUrl },
  ]

  return (
    <main className="w-full overflow-x-hidden bg-[#d9d9d9]">

      {/* ===================== NAV ===================== */}
      <SiteNav />


      {/* ===================== EVENT DETAILS — 1200 wide ===================== */}
      <section className="mx-auto w-full max-w-[1240px] px-5 pt-14 pb-16 lg:pt-[114px] lg:pb-[128px]">

        {/* Back + title. Figma indents this block 20px from the poster edge */}
        <div className="flex flex-col items-start gap-6 lg:gap-[34px] lg:px-5">
          <BackButton href="/events" />
          <h1 className="cap-trim text-[44px] leading-[1.1] font-semibold tracking-[-0.05em] text-[#1c1c1c] sm:text-[64px] lg:text-[109px] lg:leading-[109px]">
            {event.shortTitle}
          </h1>
        </div>

        {/* Poster column (682) | 1px divider | details panel (468) */}
        <div className="mt-10 flex flex-col gap-12 lg:mt-[70px] lg:flex-row lg:items-stretch lg:justify-between lg:gap-0">

          {/* LEFT — poster, description, register */}
          <div className="flex w-full flex-col items-start gap-[25px] lg:w-[682px] lg:shrink-0">
            <div className="flex w-full flex-col gap-10 lg:gap-[58px]">

              {/* Poster — 682 x 595, 10px corners */}
              <div className="relative aspect-[682/595] w-full overflow-hidden rounded-[10px]">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 682px, 100vw"
                  className="object-cover object-[center_9%]"
                />
              </div>

              {/* Description — Inter Medium 25 / 39, −5% letter spacing, one empty line between paragraphs */}
              <div className="cap-trim max-w-[657px] space-y-[30px] text-lg leading-[30px] font-medium tracking-[-0.05em] lg:min-h-[330px] lg:space-y-[39px] lg:text-[25px] lg:leading-[39px]">
                {event.description.map((paragraph) => (
                  <p key={paragraph} className="text-[#242323]/70">{paragraph}</p>
                ))}
                <p className="text-[#1c1c1c]">{event.note}</p>
              </div>
            </div>

            <a
              href={event.registerUrl}
              className="flex h-[58px] w-[218px] items-center justify-center rounded-[10px] bg-[#00a8e8] text-[18px] leading-[27px] tracking-[0.05em] text-[#18306e] hover:bg-[#00a8e8]/90"
            >
              REGISTER NOW
            </a>
          </div>

          {/* Divider — horizontal on mobile, full-height vertical line on desktop */}
          <div aria-hidden className="h-px w-full shrink-0 bg-[#8a8d93] lg:h-auto lg:w-px" />

          {/* RIGHT — details panel, 468 wide */}
          <aside className="flex w-full flex-col gap-[42px] lg:w-[468px] lg:shrink-0">
            <h2 className="cap-trim text-[32px] font-semibold text-[#00a8e8] lg:text-[40px]">Event Details</h2>

            <dl className="flex flex-col gap-[45px]">
              {details.map((item) => (
                <div key={item.label} className="flex flex-col gap-[26px]">
                  <dt className="cap-trim text-[24px] font-medium text-[#00a8e8] lg:text-[30px]">
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noreferrer" className="hover:underline">
                        {item.label}
                      </a>
                    ) : (
                      item.label
                    )}
                  </dt>
                  <dd className="cap-trim text-[18px] leading-[27px] tracking-[-0.02em] text-[#242323]/70 lg:text-[21px]">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>

        </div>
      </section>


      {/* ===================== SEE MORE UPCOMING EVENTS — 1209 wide ===================== */}
      <section className="mx-auto w-full max-w-[1249px] px-5 pb-16 lg:pb-[71px]">
        <h2 className="cap-trim text-[36px] leading-[1.1] font-semibold tracking-[-0.05em] text-[#1c1c1c] md:text-[56px] lg:text-[77px] lg:leading-[77px]">
          See More Upcoming Events
        </h2>

        {/* Two 590-wide cards, 29px apart */}
        <div className="mt-10 grid grid-cols-1 gap-x-[29px] gap-y-14 md:grid-cols-2 lg:mt-[70px]">
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


      {/* ===================== VISIT US — 71px above and below ===================== */}
      <section className="w-full px-5 pb-16 lg:pb-[71px]">
        <VisitCard />
      </section>


      {/* ===================== FOOTER ===================== */}
      <SiteFooter />

    </main>
  )
}