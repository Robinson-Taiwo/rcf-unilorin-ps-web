import SiteNav from "@/components/site-nav"
import SiteFooter from "@/components/site-footer"
import VisitCard from "@/components/visit-card"
import BackButton from "@/components/back-button"
import SermonCard, { type SermonCardProps } from "@/components/sermon-card"
import theVeryLifeOfPrayer from "@/public/the-very-life-of-prayer.png"

// Placeholder data — replace with real sermons (or fetch from your CMS/DB later).
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
    // Mobile: white page. Desktop: grey
    <main className="w-full overflow-x-hidden bg-white lg:bg-[#d9d9d9]">

      {/* ===================== NAV — 64 tall on mobile, 100 on desktop ===================== */}
      <SiteNav />


      {/* ===================== HEADER + SERMONS GRID ===================== */}
      {/* Mobile: 30px sides, title 29px below the nav, 25px bottom padding */}
      <section className="mx-auto w-full max-w-[1343px] px-[30px] pt-[29px] pb-[25px] lg:px-5 lg:pt-[131px] lg:pb-[116px]">

        <div className="flex flex-col items-start gap-[42px]">
          {/* No back button on mobile */}
          <div className="hidden lg:block">
            <BackButton href="/" />
          </div>

          {/* Mobile: Fraunces SemiBold 32 / 1.4 / −2%, 300 wide (wraps to two lines)
              Desktop: 77 / 83px / −3%, one line */}
          <h1 className="cap-trim max-w-[300px] font-serif text-[32px] leading-[1.4] font-semibold tracking-[-0.02em] text-black lg:max-w-none lg:text-[77px] lg:leading-[83px] lg:tracking-[-0.03em] lg:text-[#1c1c1c]">
            FEATURED SERMONS
          </h1>
        </div>

        {/* Mobile: stacked, 16px apart, 53px below the title
            Tablet: 2 columns. Desktop: 3 columns of 421, 20px / 60px gaps */}
        <div className="mt-[53px] grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 sm:gap-y-10 lg:mt-[74px] lg:grid-cols-3 lg:gap-y-[60px]">
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


      {/* ===================== VISIT US — desktop only ===================== */}
      <section className="hidden w-full px-5 pb-[116px] lg:block">
        <VisitCard />
      </section>


      {/* ===================== FOOTER ===================== */}
      <SiteFooter />

    </main>
  )
}