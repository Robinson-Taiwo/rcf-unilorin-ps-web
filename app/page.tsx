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
import { Eyebrow, body, cta, mobileTitle, responsiveCta } from "@/components/rcf/Ui"

import heroBg from "@/public/Images/rcf-hero.png"
import sermonPoster from "@/public/Images/the-very-life-of-prayer.png"
import eventPoster from "@/public/Images/doctrine-of-christ.png"

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

// Mobile: everything centred, 32px apart. Desktop: paragraph left, button right
function SectionHeader({
  eyebrow,
  eyebrowWidth,
  eyebrowSize = 13,
  textClass,
  mobileHeading,
  children,
  action,
}: {
  eyebrow: string
  eyebrowWidth: string
  eyebrowSize?: 10 | 12 | 13
  textClass: string
  mobileHeading?: ReactNode
  children: ReactNode
  action: ReactNode
}) {
  return (
    <div className="flex w-full flex-col items-center gap-8 text-center lg:items-stretch lg:gap-10 lg:text-left">
      <div className="flex justify-center lg:justify-start">
        <Eyebrow width={eyebrowWidth} mobileSize={eyebrowSize}>{eyebrow}</Eyebrow>
      </div>
      {mobileHeading}
      <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-end lg:justify-between">
        <p className={`cap-trim text-[#1c1c1c] ${body} ${textClass}`}>{children}</p>
        {action}
      </div>
    </div>
  )
}

/* ===================== PAGE ===================== */

export default function Home() {
  return (
    <main className="bg-[#d9d9d9]">

      {/* ===================== HERO — 800 tall on phones, 1036 on desktop ===================== */}
      <section className="relative flex h-svh min-h-[640px] w-full flex-col justify-end pb-[109px] lg:h-[1036px] lg:min-h-0 lg:pb-[78px]">
        <Image src={heroBg} alt="" fill priority sizes="100vw" className="object-cover object-center" />
        <div aria-hidden className="absolute inset-0" style={{ backgroundImage: heroOverlay }} />

        <SiteNav variant="transparent" />

        {/* Mobile: 100 x 40 buttons, 21px apart. Desktop: 182 x 58, 24px apart */}
        <div className="relative flex justify-center gap-[21px] lg:gap-6">
          <Link
            href="/about"
            className="flex h-10 w-[100px] items-center justify-center rounded-[10px] bg-[#00a8e8] text-[14px] leading-none font-bold tracking-[0.05em] text-[#d9d9d9] hover:bg-[#00a8e8]/90 lg:h-[58px] lg:w-[182px] lg:text-[18px] lg:leading-[27px] lg:font-medium lg:text-[#18306e]"
          >
            ABOUT US
          </Link>
          <Link
            href="/give"
            className="flex h-10 w-[100px] items-center justify-center rounded-[10px] border border-[#00a8e8] text-[14px] leading-none font-bold tracking-[0.05em] text-[#d9d9d9] hover:bg-[#00a8e8]/10 lg:h-[58px] lg:w-[182px] lg:text-[18px] lg:leading-[27px] lg:font-normal"
          >
            PARTNER
          </Link>
        </div>
      </section>


      {/* ===================== MARQUEE ===================== */}
      <Marquee className="bg-[#d9d9d9] text-[#8a8d93] lg:text-[#242323]" />


      {/* ===================== WELCOME ===================== */}
      <section className="relative isolate w-full overflow-hidden bg-[#00a8e8] p-[30px] text-center lg:px-5 lg:pt-[100px] lg:pb-[122px]">
        <BlueGlow size="1440px 1070px" at="calc(100% + 653px) 720px" />

        <div className="relative flex flex-col items-center">
          <Eyebrow width="w-[155px] lg:w-[178px]" mobileSize={12} thin>Welcome to RCF</Eyebrow>

          {/* Mobile: 36px, wraps naturally. Desktop: 109px, one word per line */}
          <h1 className={`cap-trim mt-8 text-[#1c1c1c] ${mobileTitle} md:text-[64px] md:leading-[1.1] lg:mt-5 lg:text-[109px] lg:leading-[107px] lg:tracking-[-0.06em]`}>
            THE <br className="hidden lg:block" />
            JOYOUS <br className="hidden lg:block" />
            PEOPLE <br className="hidden lg:block" />
            ON CAMPUS
          </h1>

          <p className={`cap-trim mt-8 max-w-[714px] text-[#1c1c1c] lg:mt-[43px] lg:text-black ${body}`}>
            We are a student fellowship in Unilorin committed to aggressive evangelism, deep discipleship, and
            building people who carry the gospel into every place they go.
          </p>
        </div>
      </section>


      {/* ===================== VISIT US / SERVICE TIME ===================== */}
      <section className="w-full bg-[#d9d9d9] lg:px-5 lg:py-[85px]">
        <VisitCard />
      </section>


      {/* ===================== ABOUT US ===================== */}
      <section className="relative isolate w-full overflow-hidden bg-[#00a8e8] py-[30px] lg:pt-[168px] lg:pb-[175px]">
        <BlueGlow at="50% calc(100% + 506px)" />

        <div className="relative flex flex-col items-center">
          <Eyebrow width="w-[155px] lg:w-[172px]" mobileSize={12}>About us</Eyebrow>

          <div className="mt-8 w-full lg:mt-[46px]">
            <PhotoCollage />
          </div>

          {/* Mobile: Inter 16, 296 wide. Desktop: Fraunces 42, 1190 wide */}
          <p className="cap-trim mt-8 max-w-[296px] text-center text-base leading-[1.3] tracking-[-0.02em] text-[#1c1c1c] md:max-w-[600px] lg:mt-[87px] lg:max-w-[1190px] lg:px-5 lg:font-serif lg:text-[42px] lg:leading-normal lg:tracking-normal lg:text-black">
            RCF Unilorin PS also known as the Success Centre is the campus fellowship of Christ The Redeemer
            Ministries, RCCG. We believe success goes beyond grades: it&apos;s growing in faith, sharpening
            character, excelling academically, and living out God&apos;s purpose on campus. Built on Aggressive
            Evangelism, we carry the Gospel beyond our walls and into every corner of student life.
          </p>

          <Link
            href="/about"
            className={`${responsiveCta} mt-8 lg:mt-[80px] lg:w-[233px] lg:bg-[#00a8e8] lg:text-[#18306e] lg:hover:bg-[#00a8e8]/90`}
          >
            MORE ABOUT US
          </Link>
        </div>
      </section>


      {/* ===================== FEATURED SERMONS ===================== */}
      <section className="w-full bg-[#d9d9d9] p-[30px] lg:px-0 lg:pt-[151px] lg:pb-[156px]">
        <div className="mx-auto flex w-full max-w-[1242px] flex-col items-center lg:items-stretch lg:px-5">
          <SectionHeader
            eyebrow="Featured sermons"
            eyebrowWidth="w-[214px]"
            textClass="max-w-[299px] lg:min-h-[70px] lg:max-w-[618px]"
            action={
              <Link href="/sermons" className={`${cta} hidden w-[225px] items-center justify-center bg-[#00a8e8] font-medium text-[#1c1c1c] hover:bg-[#00a8e8]/90 lg:flex`}>
                SEE ALL SERMONS
              </Link>
            }
          >
            There&apos;s a Word for you, Press play and discover messages of faith, hope, and truth to encourage
            you wherever you are in your walk with God.
          </SectionHeader>

          {/* Mobile: stacked, 16px apart. Desktop: 2 x 2, 20px / 50px gaps */}
          <div className="mt-8 grid w-full grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2 lg:mt-16 lg:gap-y-[50px]">
            {sermons.map((sermon) => (
              <SermonCard key={sermon.id} {...sermon} />
            ))}
          </div>

          <Link href="/sermons" className={`${responsiveCta} mt-8 lg:hidden`}>SEE MORE SERMONS</Link>
        </div>
      </section>


      {/* ===================== UPCOMING EVENTS — grey on mobile, blue on desktop ===================== */}
      <section className="relative isolate w-full overflow-hidden bg-[#d9d9d9] p-[30px] lg:bg-[#00a8e8] lg:px-0 lg:pt-[83px] lg:pb-[68px]">
        <BlueGlow at="50% calc(100% + 723px)" />

        <div className="relative mx-auto flex w-full max-w-[1244px] flex-col items-center lg:items-stretch lg:px-5">
          <SectionHeader
            eyebrow="Upcoming events"
            eyebrowWidth="w-[214px]"
            textClass="max-w-[299px] lg:min-h-[98px] lg:max-w-[692px]"
            action={
              <Link href="/events" className={`${cta} hidden w-[225px] items-center justify-center bg-[#1d1c1c] font-medium text-white hover:bg-[#1d1c1c]/90 lg:flex`}>
                SEE ALL EVENTS
              </Link>
            }
          >
            Stay in the loop with what&apos;s happening at RCF. From worship Sundays, to varieties Sundays
            there&apos;s always something to look forward to.
            <br />
            See what&apos;s coming up.
          </SectionHeader>

          <div className="mt-8 grid w-full grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:mt-[57px] lg:gap-y-10">
            {events.map((event) => (
              <EventCard key={event.id} image={event.image} date={event.date} title={event.title} detailsUrl={event.href} />
            ))}
          </div>

          <Link href="/events" className={`${responsiveCta} mt-8 lg:hidden`}>VIEW MORE EVENTS</Link>
        </div>
      </section>


      {/* ===================== GIVE ===================== */}
      <section className="relative w-full overflow-hidden p-[30px] lg:pt-[290px] lg:pb-[278px]">
        <Image src={heroBg} alt="" fill sizes="100vw" className="object-cover object-center" />
        <div aria-hidden className="absolute inset-0 bg-black/20 lg:hidden" />
        <div aria-hidden className="absolute inset-0 hidden lg:block" style={{ backgroundImage: giveOverlay }} />

        <div className="relative mx-auto flex max-w-[617px] flex-col items-center gap-8 px-[30px] py-[25px] text-center lg:gap-[52px] lg:p-0">
          {/* Mobile: blue border. Desktop: grey border */}
          <span className="inline-flex h-[38px] w-[155px] items-center justify-center rounded-[26px] border border-[#00a8e8] text-[10px] font-medium uppercase tracking-[0.05em] text-[#d9d9d9] lg:h-10 lg:w-[124px] lg:border-[#d9d9d9] lg:text-[13px] lg:tracking-[0.1em]">
            Give
          </span>

          <div className="flex flex-col items-center gap-6 lg:gap-[34px]">
            <div className="flex flex-col items-center gap-6 text-[#d9d9d9] lg:gap-[35px] lg:text-white">
              <h2 className={`cap-trim max-w-[267px] uppercase ${mobileTitle} lg:max-w-none lg:text-[65px] lg:leading-normal lg:font-normal lg:tracking-normal lg:normal-case`}>
                Support the Mission
              </h2>
              <p className={`cap-trim opacity-75 lg:min-h-[88px] lg:opacity-100 ${body}`}>
                Be Part of the Mission.
                <br />
                Your support helps us turn ideas into action, serve people, and make a lasting impact in our
                fellowship and beyond.
              </p>
            </div>

            <Link href="/give" className={`${cta} hidden w-[225px] items-center justify-center bg-[#00a8e8] font-medium text-[#18306e] hover:bg-[#00a8e8]/90 lg:flex`}>
              MAKE AN IMPACT
            </Link>
          </div>
        </div>
      </section>


      {/* ===================== TESTIMONY / PRAYERS ===================== */}
      <section className="relative isolate w-full overflow-hidden bg-[#00a8e8] p-[30px] lg:px-0 lg:pt-[84px] lg:pb-[160px]">
        <BlueGlow at="50% calc(100% + 451px)" />

        <div className="relative mx-auto flex w-full max-w-[1246px] flex-col items-center lg:items-stretch lg:px-5">
          <SectionHeader
            eyebrow="Testimony/Prayers"
            eyebrowWidth="w-[155px] lg:w-[233px]"
            eyebrowSize={10}
            textClass="lg:min-h-[98px] lg:max-w-[692px]"
            mobileHeading={<h2 className={`cap-trim text-[#1c1c1c] lg:hidden ${mobileTitle}`}>Look what God is doing!</h2>}
            action={
              <Link href="/share-your-story" className={`${cta} hidden w-[225px] items-center justify-center bg-[#1d1c1c] font-medium text-white hover:bg-[#1d1c1c]/90 lg:flex`}>
                SHARE YOURS
              </Link>
            }
          >
            <span className="hidden lg:inline">
              Look What God Is Doing!
              <br />
            </span>
            Real people. Real stories. Real testimonies of God&apos;s faithfulness. Come see how He&apos;s been
            moving, answering prayers, changing lives, and making a way.
          </SectionHeader>

          <div className="mt-8 w-full lg:mt-[77px]">
            <TestimonyCarousel items={testimonies} />
          </div>

          <Link href="/share-your-story" className={`${responsiveCta} mt-8 lg:hidden`}>SHARE YOUR TESTIMONY</Link>
        </div>
      </section>


      {/* ===================== TRANSPORTATION — full-bleed dark on mobile, rounded panel on desktop ===================== */}
      <section className="w-full bg-[#1d1c1c] lg:bg-[#d9d9d9] lg:px-5 lg:py-[99px]">
        <div className="mx-auto flex max-w-[1312px] flex-col items-center gap-8 bg-[#1d1c1c] p-[30px] lg:h-[626px] lg:flex-row lg:justify-center lg:gap-[95px] lg:rounded-[45px] lg:py-0">

          <div className="flex w-full max-w-[617px] flex-col items-center gap-8 text-center text-[#d9d9d9] lg:items-start lg:gap-[37px] lg:text-left">
            <Eyebrow width="w-[155px] lg:w-[233px]" tone="light" tall mobileSize={10}>Transportation</Eyebrow>
            <div className="flex flex-col gap-8 lg:gap-[37px]">
              <h2 className={`cap-trim ${mobileTitle} lg:text-[65px] lg:leading-normal lg:font-normal lg:tracking-normal`}>
                Reserve your seat on the bus.
              </h2>
              <p className={`cap-trim lg:min-h-[94px] ${body}`}>
                One route, two directions — school to church before service, church back to school after. Book
                your slot ahead so you know you have a seat. No payment online; you pay on the bus.
              </p>
            </div>
          </div>

          {/* Mobile: 300-wide white card. Desktop: 513 x 498 grey card with navy border */}
          <div className="flex w-full max-w-[300px] flex-col items-center justify-center gap-5 rounded-[20px] bg-white px-[15px] py-5 lg:h-[498px] lg:max-w-[513px] lg:gap-[28px] lg:rounded-[45px] lg:border lg:border-[#18306e] lg:bg-[#d9d9d9] lg:px-5 lg:py-0">
            <div className="flex w-full max-w-[434px] flex-col gap-[25px]">
              <h3 className="cap-trim hidden font-serif text-[22px] font-semibold text-[#1c1c1c] lg:block">Sunday, 20 September</h3>

              <div className="flex flex-col gap-5">
                {routes.map((route) => (
                  <button
                    key={`${route.from}-${route.to}`}
                    type="button"
                    aria-pressed={route.selected}
                    className={`flex h-20 w-full cursor-pointer flex-col items-start justify-center gap-[21px] rounded-[20px] border px-[10px] lg:h-[105px] lg:items-center ${
                      route.selected ? "border-[#00a8e8] bg-[#00a8e8]/10" : "border-[#8a8d93] bg-[#8a8d93]/10"
                    }`}
                  >
                    <span className="flex w-full items-center justify-between lg:max-w-[380px]">
                      <span className="text-[16px] leading-[27px] font-semibold tracking-[-0.02em] text-[#1c1c1c] lg:text-[20px]">
                        {route.from} → {route.to}
                      </span>
                      <span className="flex h-6 w-[92px] items-center justify-center rounded-[25px] bg-[#5c8e13] text-[10px] font-medium uppercase tracking-[-0.02em] text-[#d9d9d9]">
                        {route.seatsLeft} seats left
                      </span>
                    </span>
                    <span className="w-full text-left text-[11px] leading-none font-medium tracking-[0.03em] text-[#242323]/60 lg:max-w-[380px] lg:text-[15px] lg:leading-normal lg:tracking-[0.1em]">
                      Departs {route.time} · {route.pickup}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <p className="cap-trim w-full max-w-[260px] text-[12px] leading-[1.2] tracking-[-0.02em] text-[#242323]/60 lg:max-w-[418px] lg:text-[16px] lg:leading-[27px] lg:tracking-[0.05em]">
              You&apos;ll get a confirmation message once your slot is reserved. Please arrive 10 minutes before departure.
            </p>
          </div>

        </div>
      </section>


      {/* ===================== FOOTER ===================== */}
      <SiteFooter />

    </main>
  )
}