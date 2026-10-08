import Image, { type StaticImageData } from "next/image"
import SiteNav from "@/components/site-nav"
import SiteFooter from "@/components/site-footer"
import GiveCard from "@/components/give-card"
import heroBg from "@/public/Images/rcf-hero.png"
import bus from "@/public/Images/give-bus.png"
import accommodation from "@/public/Images/give-accomodation.png"
import sound from "@/public/Images/give-sound.png"
import solar from "@/public/Images/give-solar.png"

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

// Outlined pill label, blue border
const eyebrow =
  "inline-flex h-[38px] shrink-0 items-center justify-center rounded-[26px] border border-[#00a8e8] text-[13px] font-medium uppercase tracking-[0.1em] text-[#d9d9d9]"

export default function GivePage() {
  return (
    <main className="w-full overflow-x-hidden bg-[#242323]">

      <section className="relative w-full overflow-hidden">

        {/* ===================== BACKGROUND — top 1073px ===================== */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-full lg:h-[1073px]">
          <Image src={heroBg} alt="" fill priority sizes="100vw" className="object-cover object-bottom" />
          <div className="absolute inset-0" style={{ backgroundImage: heroOverlay }} />
        </div>

        {/* Nav floats over the image, 36px from the top */}
        <SiteNav variant="transparent" />


        {/* ===================== INTRO (left) + GIVING CARD (right) ===================== */}
        {/* Content starts 201px from the top; 120px left margin, 95px right margin */}
        <div className="relative flex flex-col gap-12 px-5 pt-32 lg:flex-row lg:items-start lg:justify-between lg:gap-[54px] lg:pt-[201px] lg:pr-[95px] lg:pl-[120px]">

          {/* Left — 666 wide */}
          <div className="flex w-full max-w-[666px] flex-col items-start gap-[41px]">
            <span className={`${eyebrow} w-[124px]`}>Give</span>

            <div className="flex flex-col gap-[31px] text-white">
              <h1 className="cap-trim max-w-[487px] font-serif text-[52px] leading-[54px] sm:text-[68px] sm:leading-[70px] lg:text-[86px] lg:leading-[86px]">
                Your Gift Changes Lives
              </h1>
              <p className="cap-trim text-base leading-[26px] tracking-[0.05em] lg:text-[18px] lg:leading-[27px]">
                Every act of giving helps us make a lasting impact in our church and community. Your generosity
                allows RCF to share God&apos;s love, serve those in need, and build a place where faith continues
                to grow.
              </p>
            </div>
          </div>

          {/* Right — 505 x 495 card */}
          <GiveCard />
        </div>


        {/* ===================== OTHER CHURCH NEEDS ===================== */}
        <div className="relative px-5 pt-20 lg:pt-[184px] lg:pl-[120px]">
          <span className={`${eyebrow} w-[235px]`}>Other church needs</span>
        </div>

        {/* Photo strip — 405 x 440 tiles, 2px gaps, scrolls sideways (4th tile runs off-screen in the design) */}
        <div className="relative mt-10 flex snap-x snap-mandatory gap-[2px] overflow-x-auto [scrollbar-width:none] lg:mt-[84px] [&::-webkit-scrollbar]:hidden">
          {needs.map((item) => (
            <div key={item.alt} className="relative h-[330px] w-[304px] shrink-0 snap-start overflow-hidden bg-[#d9d9d9] lg:h-[440px] lg:w-[405px]">
              <Image src={item.image} alt={item.alt} fill sizes="405px" className="object-cover" />
              {item.overlays.map((overlay, i) => (
                <div
                  key={i}
                  aria-hidden
                  className={`absolute inset-0 ${overlay.hardLight ? "mix-blend-hard-light" : ""}`}
                  style={{ backgroundImage: overlay.image }}
                />
              ))}
            </div>
          ))}
        </div>

      </section>


      {/* ===================== FOOTER ===================== */}
      <SiteFooter />

    </main>
  )
}