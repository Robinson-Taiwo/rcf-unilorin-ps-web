import SiteNav from "@/components/site-nav"
import SiteFooter from "@/components/site-footer"
import VisitCard from "@/components/visit-card"
import BackButton from "@/components/back-button"
import SermonCard from "@/components/sermon-card"
import { container, revealDelay, type } from "@/components/rcf/Ui"
import { getSermons } from "@/lib/content"

// Published sermons from the admin; refresh every minute
export const revalidate = 60

export default async function SermonsPage() {
  const sermons = await getSermons()
  return (
    // Phone: white page. Desktop: grey (as designed)
    <main className="w-full overflow-x-clip bg-white lg:bg-[#d9d9d9]">

      <SiteNav />


      {/* ===================== HEADER + SERMONS GRID ===================== */}
      <section className={`${container} pt-8 pb-10 lg:pt-14 lg:pb-section`}>
        <div className="flex flex-col items-center gap-8 text-center lg:items-start lg:text-left">
          <div data-reveal className="hidden lg:block">
            <BackButton href="/" />
          </div>
          <h1 data-reveal style={revealDelay(100)} className={`${type.title} text-[#1c1c1c] max-lg:font-semibold`}>FEATURED SERMONS</h1>
        </div>

        {sermons.length === 0 && <p className="mt-10 text-[15px] text-[#242323]/70">New sermons will appear here soon.</p>}

        {/* Phone: stacked. Tablet: 2 columns. Desktop: 3 columns (as designed) */}
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-y-12">
          {sermons.map((sermon, i) => (
            <div key={sermon.id} data-reveal style={revealDelay((i % 3) * 100)}>
              <SermonCard
                size="md"
                image={sermon.image}
                duration={sermon.duration}
                title={sermon.title}
                date={sermon.date}
                audioUrl={sermon.audioUrl}
              />
            </div>
          ))}
        </div>
      </section>


      {/* ===================== VISIT US — desktop only (as designed) ===================== */}
      <section className={`${container} hidden pb-section lg:block`}>
        <VisitCard />
      </section>


      <SiteFooter />

    </main>
  )
}
