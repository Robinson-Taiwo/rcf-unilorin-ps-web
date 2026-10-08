import SiteNav from "@/components/site-nav"
import SiteFooter from "@/components/site-footer"
import VisitCard from "@/components/visit-card"
import BackButton from "@/components/back-button"
import SermonCard, { type SermonCardProps } from "@/components/sermon-card"
import theVeryLifeOfPrayer from "@/public/Images/the-very-life-of-prayer.png"

// Placeholder data — nine identical entries, as in the design.
// Replace with real sermons (or fetch from your CMS/DB later).
const sermons: (SermonCardProps & { id: number })[] = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  image: theVeryLifeOfPrayer,
  duration: "1hr 30mins",
  title: "The Weight of a Calling",
  date: "August 5, 2025",
  audioUrl: "/audio/the-weight-of-a-calling.mp3", // TODO: real audio file URL
}))

export default function SermonsPage() {
  return (
    <main className="w-full overflow-x-hidden bg-[#d9d9d9]">

      {/* ===================== NAV ===================== */}
      <SiteNav />


      {/* ===================== HEADER + SERMONS GRID — 1303 wide ===================== */}
      <section className="mx-auto w-full max-w-[1343px] px-5 pt-14 pb-16 lg:pt-[131px] lg:pb-[116px]">

        {/* Back + title, 42px apart */}
        <div className="flex flex-col items-start gap-[42px]">
          <BackButton href="/" />
          <h1 className="cap-trim font-serif text-[44px] leading-[1.05] font-semibold tracking-[-0.03em] text-[#1c1c1c] sm:text-[60px] lg:text-[77px] lg:leading-[83px]">
            FEATURED SERMONS
          </h1>
        </div>

        {/* 3 columns of 421 — 20px column gap, 60px row gap */}
        <div className="mt-12 grid grid-cols-1 gap-x-5 gap-y-14 sm:grid-cols-2 lg:mt-[74px] lg:grid-cols-3 lg:gap-y-[60px]">
          {sermons.map((sermon) => (
            <SermonCard
              key={sermon.id}
              size="md"
              image={sermon.image}
              duration={sermon.duration}
              title={sermon.title}
              date={sermon.date}
              audioUrl={sermon.audioUrl}
            />
          ))}
        </div>

      </section>


      {/* ===================== VISIT US — 116px above and below ===================== */}
      <section className="w-full px-5 pb-16 lg:pb-[116px]">
        <VisitCard />
      </section>


      {/* ===================== FOOTER ===================== */}
      <SiteFooter />

    </main>
  )
}