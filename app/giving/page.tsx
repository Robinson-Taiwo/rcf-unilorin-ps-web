import Image, { type StaticImageData } from "next/image"
import SiteNav from "@/components/site-nav"
import SiteFooter from "@/components/site-footer"
import GiveCard from "@/components/give-card"
import { Pill, container, revealDelay, type } from "@/components/rcf/Ui"
import heroBg from "@/public/rcf-hero.png"
import bus from "@/public/give-bus.png"
import accommodation from "@/public/give-accomodation.png"
import sound from "@/public/give-sound.png"
import solar from "@/public/give-solar.png"

// Hero photo overlay: 71% black plus the same fades used on the landing hero
const heroOverlay =
  "linear-gradient(rgba(0,0,0,0.71), rgba(0,0,0,0.71)), linear-gradient(180deg, rgba(102,102,102,0.024) 0%, rgba(0,0,0,0.81) 100%), linear-gradient(0.25deg, rgba(102,102,102,0) 10.3%, rgba(0,0,0,0.38) 96.9%)"

// "Other church needs" strip — each photo has its own overlay in Figma
type Overlay = { image: string; hardLight?: boolean }

const needs: { image: StaticImageData; alt: string; overlays: Overlay[] }[] = [
  {
    image: bus,
    alt: "Church bus",
    overlays: [
      { image: "linear-gradient(rgba(0,0,0,0.38), rgba(0,0,0,0.38))" },
      { image: "linear-gradient(89.35deg, rgba(29,28,28,0.95) 27.2%, rgba(102,102,102,0) 99.4%)", hardLight: true },
    ],
  },
  {
    image: accommodation,
    alt: "Student accommodation",
    overlays: [{ image: "linear-gradient(180deg, rgba(0,0,0,0.64) 30.77%, rgba(102,102,102,0) 100%)" }],
  },
  {
    image: sound,
    alt: "Sound equipment",
    overlays: [{ image: "linear-gradient(180deg, rgba(0,0,0,0.36) 26.84%, rgba(102,102,102,0.06) 100%)" }],
  },
  {
    image: solar,
    alt: "Solar panels",
    overlays: [
      { image: "linear-gradient(rgba(0,0,0,0.34), rgba(0,0,0,0.34))" },
      { image: "linear-gradient(269.33deg, rgba(29,28,28,0.95) 71.84%, rgba(102,102,102,0.257) 99.38%)", hardLight: true },
    ],
  },
]

export default function GivePage() {
  return (
    <main className="w-full overflow-x-clip bg-[#242323]">

      <section className="relative w-full overflow-hidden pb-10 lg:pb-section">

        {/* ===================== BACKGROUND — photo behind the top of the page ===================== */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-full overflow-hidden lg:h-[760px]">
          <Image src={heroBg} alt="" fill priority sizes="100vw" className="animate-hero-zoom object-cover object-bottom" />
          <div className="absolute inset-0" style={{ backgroundImage: heroOverlay }} />
        </div>

        <SiteNav variant="transparent" />


        {/* ===================== INTRO (left) + GIVING CARD (right) ===================== */}
        <div className={`${container} relative flex flex-col items-center gap-10 pt-[100px] lg:flex-row lg:items-center lg:justify-between lg:gap-14 lg:pt-36`}>
          {/* Phones: centred (mobile frame). Desktop: left column. */}
          {/* Phones: pill → 18px → heading → 12px → text (Figma). Desktop: 24px steps. */}
          <div className="flex max-w-[520px] flex-col items-center text-center lg:items-start lg:text-left">
            <Pill tone="blueOnDark" className="animate-fade-up [animation-delay:150ms]">Give</Pill>
            <h1 className={`${type.title} mt-[18px] animate-fade-up text-white [animation-delay:250ms] lg:mt-6`}>Your Gift Changes Lives</h1>
            <p className={`${type.body} mt-3 animate-fade-up text-white/90 [animation-delay:350ms] lg:mt-6 lg:text-white/80`}>
              Every act of giving helps us make a lasting impact in our church and community. Your generosity
              allows RCF to share God&apos;s love, serve those in need, and build a place where faith continues
              to grow.
            </p>
          </div>

          <div className="w-full max-w-[460px] animate-fade-up [animation-delay:450ms]">
            <GiveCard />
          </div>
        </div>


        {/* ===================== OTHER CHURCH NEEDS ===================== */}
        <div data-reveal className={`${container} relative flex justify-center pt-14 lg:justify-start lg:pt-24`}>
          <Pill tone="blueOnDark">Other church needs</Pill>
        </div>

        {/* Photo strip — scrolls sideways on phones; four equal tiles across the full width on desktop, 2px gaps */}
        <div className="relative mt-7 flex snap-x snap-mandatory gap-[2px] overflow-x-auto [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
          {needs.map((item, i) => (
            <div key={item.alt} data-reveal style={revealDelay(i * 100)} className="group relative h-[300px] w-[260px] shrink-0 snap-start overflow-hidden bg-[#d9d9d9] lg:h-[clamp(280px,24vw,360px)] lg:w-auto">
              <Image src={item.image} alt={item.alt} fill sizes="(min-width: 1024px) 25vw, 260px" className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-105" />
              {item.overlays.map((overlay, j) => (
                <div
                  key={j}
                  aria-hidden
                  className={`absolute inset-0 ${overlay.hardLight ? "mix-blend-hard-light" : ""}`}
                  style={{ backgroundImage: overlay.image }}
                />
              ))}
            </div>
          ))}
        </div>

      </section>


      <SiteFooter />

    </main>
  )
}
