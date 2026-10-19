import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import SiteNav from "@/components/site-nav"
import SiteFooter from "@/components/site-footer"
import VisitCard from "@/components/visit-card"
import SermonCard from "@/components/sermon-card"
import EventCard from "@/components/event-card"
import Marquee from "@/components/marquee"
import PhotoCollage from "@/components/rcf/photo-collage"
import TestimonyCarousel, { type Testimony } from "@/components/testimony-carousel"
import { Pill, button, container, revealDelay, sectionY, stack, type } from "@/components/rcf/Ui"

import heroBg from "@/public/rcf-hero.png"
import sermonPoster from "@/public/the-very-life-of-prayer.png"
import eventPoster from "@/public/doctrine-of-christ.png"

/* ===================== OVERLAYS ===================== */

const heroOverlay =
  "linear-gradient(180deg, rgba(102,102,102,0.024) 0%, rgba(0,0,0,0.81) 100%), linear-gradient(0.25deg, rgba(102,102,102,0) 10.3%, rgba(0,0,0,0.38) 96.9%)"
const giveOverlay =
  "linear-gradient(180deg, rgba(102,102,102,0.03) 0%, #000 100%), linear-gradient(0.21deg, rgba(102,102,102,0) 10.3%, rgba(0,0,0,0.6) 96.9%)"

/* ===================== DATA ===================== */

const sermons = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  image: sermonPoster,
  duration: "1hr 30mins",
  title: "The Weight of a Calling",
  date: "August 5, 2025",
  audioUrl: "#",
}))

const events = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  image: eventPoster,
  date: "Thursday, January 8th-26TH, 2026",
  shortDate: "January 8th - 14th, 2026",
  title: "Word & Prayer Conference",
  href: "/events",
}))

const testimonies: Testimony[] = [
  {
    label: "Testimony",
    quote: "I struggled with my results for two sessions. After joining the prayer unit and staying consistent, I made my best grades this semester. God is faithful.",
    by: "A 300L student",
    dark: false,
  },
  {
    label: "Prayer point",
    quote: "Please pray for my final year project defense coming up next month for wisdom and a sound mind as I prepare.",
    by: "Submitted anonymously",
    dark: true,
  },
  {
    label: "Testimony",
    quote: "I came for one service as a visitor and found a family. A year later, I'm serving in the choir and growing more than I imagined.",
    by: "A 300L student",
    dark: false,
  },
]

const routes = [
  { from: "School", to: "Church", seatsLeft: 12, time: "8:15 AM", pickup: "Frisch laundry", selected: true },
  { from: "Church", to: "School", seatsLeft: 12, time: "8:15 AM", pickup: "Frisch laundry", selected: false },
]

/* ===================== BUILDING BLOCKS ===================== */

// Desktop-only blue glow (the mobile design has flat blue)
function BlueGlow({ at, size = "1070px 1440px" }: { at: string; size?: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden mix-blend-overlay lg:block"
      style={{ backgroundImage: `radial-gradient(${size} at ${at}, #000 11.66%, transparent 100%)` }}
    />
  )
}

// Section intro used by Sermons, Events and Testimonies.
// Phones (mobile frames): centred pill, optional heading, paragraph. Desktop: pill on top, paragraph left, button right.
function SectionIntro({
  eyebrow,
  heading,
  children,
  action,
}: {
  eyebrow: ReactNode
  heading?: ReactNode
  children: ReactNode
  action: ReactNode
}) {
  return (
    <div className={`flex w-full flex-col items-center text-center lg:items-start lg:text-left ${stack}`}>
      <div data-reveal>
        <Pill>{eyebrow}</Pill>
      </div>
      {heading}
      <div className="flex w-full flex-col items-center lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <p data-reveal style={revealDelay(100)} className={`${type.body} max-w-[560px] text-[#1c1c1c]`}>{children}</p>
        <div data-reveal style={revealDelay(200)} className="hidden lg:block">{action}</div>
      </div>
    </div>
  )
}

/* ===================== PAGE ===================== */

export default function Home() {
  return (
    <main className="bg-[#d9d9d9]">

      {/* ===================== HERO — full screen height, capped at 860 on desktop ===================== */}
      <section className="relative flex h-svh min-h-[560px] w-full flex-col justify-end overflow-hidden pb-24 lg:max-h-[860px] lg:pb-16">
        <Image src={heroBg} alt="" fill priority sizes="100vw" className="animate-hero-zoom object-cover object-center" />
        <div aria-hidden className="absolute inset-0" style={{ backgroundImage: heroOverlay }} />

        <SiteNav variant="transparent" />

        {/* Phones: 120 x 40 (Figma 100 x 40). Desktop: 168 x 44 (Figma 182 x 58). */}
        <div className="relative flex justify-center gap-3 px-[30px] lg:gap-4">
          <Link href="/about" className={`${button.primary} w-[120px] animate-fade-up [animation-delay:500ms] max-lg:text-[#d9d9d9] lg:w-[168px]`}>About us</Link>
          <Link href="/giving" className={`${button.outline} w-[120px] animate-fade-up [animation-delay:650ms] lg:w-[168px]`}>Partner</Link>
        </div>
      </section>


      {/* ===================== MARQUEE ===================== */}
      <Marquee className="bg-[#d9d9d9] text-[#8a8d93] lg:text-[#242323]" />


      {/* ===================== WELCOME ===================== */}
      <section className={`relative isolate w-full overflow-hidden bg-[#00a8e8] text-center ${sectionY}`}>
        <BlueGlow size="1440px 1070px" at="calc(100% + 653px) 720px" />

        <div className={`${container} relative flex flex-col items-center ${stack}`}>
          <div data-reveal>
            <Pill>Welcome to RCF</Pill>
          </div>

          {/* Phones: one sentence that wraps. Desktop: one word per line (as designed) */}
          <h1 data-reveal style={revealDelay(120)} className={`${type.display} text-[#1c1c1c]`}>
            THE
            <br className="hidden lg:block" />
            <span className="lg:hidden"> GATHERING OF THE MOST </span>
            <span className="hidden lg:inline"> </span>
            JOYOUS <br className="hidden lg:block" />
            PEOPLE <br className="hidden lg:block" />
            ON CAMPUS
          </h1>

          <p data-reveal style={revealDelay(240)} className={`${type.body} max-w-[560px] text-[#1c1c1c]`}>
            We are a student fellowship in Unilorin committed to aggressive evangelism, deep discipleship, and
            building people who carry the gospel into every place they go.
          </p>
        </div>
      </section>


      {/* ===================== VISIT US / SERVICE TIME ===================== */}
      <section className={`w-full bg-[#d9d9d9] ${sectionY}`}>
        <div className={container}>
          <VisitCard />
        </div>
      </section>


      {/* ===================== ABOUT US ===================== */}
      <section className={`relative isolate w-full overflow-hidden bg-[#00a8e8] ${sectionY}`}>
        <BlueGlow at="50% calc(100% + 506px)" />

        <div className={`relative flex flex-col items-center ${stack}`}>
          <div data-reveal>
            <Pill>About us</Pill>
          </div>

          <div className="w-full lg:mt-4">
            <PhotoCollage />
          </div>

          <div className={`${container} flex flex-col items-center text-center ${stack} lg:mt-6`}>
            {/* Phones and desktop frames use different copy here */}
            <p data-reveal className={`${type.body} text-[#1c1c1c] lg:hidden`}>
              The Redeemed Christian Fellowship, University of Ilorin, Permanent site, (RCFUNILORINPS) serves as the
              campus fellowship arm under the Christ The Redeemer Ministries by the Redeemed Christian Church of God.
              Known as the Success Centre, we&apos;re a community of students growing in our relationship with God while
              pursuing academic excellence and preparing for the future.
              <br />
              <br />
              Our fellowship is built on Aggressive Evangelism taking the Gospel beyond the walls of our fellowship and
              boldly representing sharing the message of Christ with our campuses, communities, and generation. Through
              prayer, worship, the study of God&apos;s Word, academic support, mentorship, shared moments, fun activities
              and genuine fellowship, we create a space that fosters growth spiritually, academically, and personally.
            </p>
            <p data-reveal className={`${type.lead} hidden max-w-[880px] text-black lg:block`}>
              RCF Unilorin PS also known as the Success Centre is the campus fellowship of Christ The Redeemer
              Ministries, RCCG. We believe success goes beyond grades: it&apos;s growing in faith, sharpening
              character, excelling academically, and living out God&apos;s purpose on campus. Built on Aggressive
              Evangelism, we carry the Gospel beyond our walls and into every corner of student life.
            </p>

            <Link href="/about" data-reveal style={revealDelay(120)} className={`${button.navy} lg:bg-[#00a8e8] lg:text-[#18306e] lg:hover:bg-[#2bbbf0]`}>
              More about us
            </Link>
          </div>
        </div>
      </section>


      {/* ===================== FEATURED SERMONS ===================== */}
      <section className={`w-full bg-[#d9d9d9] ${sectionY}`}>
        <div className={`${container} flex flex-col items-center lg:items-stretch`}>
          <SectionIntro
            eyebrow="Featured sermons"
            action={<Link href="/sermons" className={button.primary}>See all sermons</Link>}
          >
            There&apos;s a Word for you, Press play and discover messages of faith, hope, and truth to encourage
            you wherever you are in your walk with God.
          </SectionIntro>

          {/* Phones: stacked. Tablet up: 2 x 2 (as designed) */}
          <div className="mt-7 grid w-full grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:mt-12 lg:gap-y-12">
            {sermons.map((sermon, i) => (
              <div key={sermon.id} data-reveal style={revealDelay((i % 2) * 120)}>
                <SermonCard {...sermon} />
              </div>
            ))}
          </div>

          <Link href="/sermons" className={`${button.navy} mt-8 lg:hidden`}>See more sermons</Link>
        </div>
      </section>


      {/* ===================== UPCOMING EVENTS — grey on phones, blue on desktop (as designed) ===================== */}
      <section className={`relative isolate w-full overflow-hidden bg-[#d9d9d9] lg:bg-[#00a8e8] ${sectionY}`}>
        <BlueGlow at="50% calc(100% + 723px)" />

        <div className={`${container} relative flex flex-col items-center lg:items-stretch`}>
          <SectionIntro
            eyebrow="Upcoming events"
            action={<Link href="/events" className={button.dark}>See all events</Link>}
          >
            Stay in the loop with what&apos;s happening at RCF. From worship Sundays, to varieties Sundays
            there&apos;s always something to look forward to. See what&apos;s coming up.
          </SectionIntro>

          <div className="mt-7 grid w-full grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:mt-12 lg:gap-y-12">
            {events.map((event, i) => (
              <div key={event.id} data-reveal style={revealDelay((i % 2) * 120)}>
                <EventCard image={event.image} date={event.date} shortDate={event.shortDate} title={event.title} detailsUrl={event.href} />
              </div>
            ))}
          </div>

          <Link href="/events" className={`${button.navy} mt-8 lg:hidden`}>View more events</Link>
        </div>
      </section>


      {/* ===================== GIVE ===================== */}
      <section className="relative w-full overflow-hidden py-20 lg:py-32">
        <Image src={heroBg} alt="" fill sizes="100vw" className="object-cover object-center" />
        <div aria-hidden className="absolute inset-0 bg-black/30 lg:hidden" />
        <div aria-hidden className="absolute inset-0 hidden lg:block" style={{ backgroundImage: giveOverlay }} />

        <div className={`${container} relative flex flex-col items-center text-center text-[#d9d9d9] lg:text-white ${stack}`}>
          <div data-reveal>
            <Pill tone="light" mobileTone="blueOnDark">Give</Pill>
          </div>
          <h2 data-reveal style={revealDelay(100)} className={`${type.heading} max-w-[560px]`}>
            <span className="lg:hidden">SUPPORT THE MISSION</span>
            <span className="hidden lg:inline">Support the Mission</span>
          </h2>
          <p data-reveal style={revealDelay(200)} className={`${type.body} max-w-[520px] opacity-80 lg:opacity-90`}>
            Be Part of the Mission.
            <br />
            Your support helps us turn ideas into action, serve people, and make a lasting impact in our
            fellowship and beyond.
          </p>
          <div data-reveal style={revealDelay(300)} className="hidden lg:block">
            <Link href="/giving" className={button.primary}>Make an impact</Link>
          </div>
        </div>
      </section>


      {/* ===================== TESTIMONY / PRAYERS ===================== */}
      <section className={`relative isolate w-full overflow-hidden bg-[#00a8e8] ${sectionY}`}>
        <BlueGlow at="50% calc(100% + 451px)" />

        <div className={`${container} relative flex flex-col items-center lg:items-stretch`}>
          <SectionIntro
            eyebrow={<><span className="lg:hidden">Testimonies/Prayers</span><span className="hidden lg:inline">Testimony/Prayers</span></>}
            heading={<h2 data-reveal style={revealDelay(50)} className={`${type.heading} text-[#1c1c1c] lg:hidden`}>Look what God is doing!</h2>}
            action={<Link href="/testimony" className={button.dark}>Share yours</Link>}
          >
            <span className="hidden lg:inline">
              Look What God Is Doing!
              <br />
            </span>
            Real people. Real stories. Real testimonies of God&apos;s faithfulness. Come see how He&apos;s been
            moving, answering prayers, changing lives, and making a way.
          </SectionIntro>

          <div className="mt-7 w-full lg:mt-12">
            <TestimonyCarousel items={testimonies} />
          </div>

          <Link href="/testimony" className={`${button.navy} mt-8 lg:hidden`}>Share your testimony</Link>
        </div>
      </section>


      {/* ===================== TRANSPORTATION — full-bleed dark on phones, rounded panel on desktop ===================== */}
      <section id="transport" className={`w-full bg-[#1d1c1c] lg:bg-[#d9d9d9] ${sectionY}`}>
        <div className={container}>
          <div data-reveal="scale" className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-14 lg:rounded-[28px] lg:bg-[#1d1c1c] lg:p-14">

            <div className={`flex max-w-[480px] flex-col items-center text-center text-[#d9d9d9] lg:items-start lg:text-left ${stack}`}>
              <div data-reveal style={revealDelay(150)}>
                <Pill tone="light">Transportation</Pill>
              </div>
              <h2 data-reveal style={revealDelay(250)} className={type.heading}>
                Reserve your seat on the bus<span className="hidden lg:inline">.</span>
              </h2>
              <p data-reveal style={revealDelay(350)} className={`${type.body} text-[#d9d9d9]/75`}>
                One route, two directions — school to church before service, church back to school after. Book
                your slot ahead so you know you have a seat. No payment online; you pay on the bus.
              </p>
            </div>

            {/* Booking card — white on phones (Figma 300 x 285), grey with a navy border on desktop (Figma 513 x 498) */}
            <div data-reveal="right" style={revealDelay(300)} className="flex w-full max-w-[440px] flex-col gap-5 rounded-[20px] bg-white p-5 lg:rounded-[24px] lg:border lg:border-[#18306e] lg:bg-[#d9d9d9] lg:p-7">
              <h3 className="cap-trim hidden font-serif text-subheading font-semibold text-[#1c1c1c] lg:block">Sunday, 20 September</h3>

              <div className="flex flex-col gap-3 lg:gap-3.5">
                {routes.map((route) => (
                  <button
                    key={`${route.from}-${route.to}`}
                    type="button"
                    aria-pressed={route.selected}
                    className={`flex w-full cursor-pointer flex-col gap-3 rounded-[14px] border px-4 py-4 text-left transition-[border-color,background-color,translate] duration-300 hover:-translate-y-0.5 hover:border-[#00a8e8] lg:gap-2.5 ${
                      route.selected ? "border-[#00a8e8] bg-[#00a8e8]/10" : "border-[#8a8d93]/60 bg-[#8a8d93]/10"
                    }`}
                  >
                    <span className="flex w-full items-center justify-between gap-3">
                      <span className="text-[15px] leading-none font-semibold tracking-[-0.01em] text-[#1c1c1c] lg:text-base">
                        {route.from} → {route.to}
                      </span>
                      <span className="inline-flex h-6 items-center rounded-full bg-[#5c8e13] px-2.5 text-[10px] leading-none font-semibold uppercase tracking-[0.02em] text-[#d9d9d9]">
                        {route.seatsLeft} seats left
                      </span>
                    </span>
                    <span className="text-[12px] leading-none text-[#242323]/65 lg:text-[13px]">
                      Departs {route.time} · {route.pickup}
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-[12px] leading-[1.5] text-[#242323]/65 lg:text-[13px]">
                You&apos;ll get a confirmation message once your slot is reserved. Please arrive 10 minutes before departure.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ===================== FOOTER ===================== */}
      <SiteFooter />

    </main>
  )
}
