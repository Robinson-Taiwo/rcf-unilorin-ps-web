import Image from "next/image"
import SiteNav from "@/components/site-nav"
import SiteFooter from "@/components/site-footer"
import VisitCard from "@/components/visit-card"
import BackButton from "@/components/back-button"
import PhotoCollage from "@/components/rcf/photo-collage"
import ValuesAccordion from "@/components/values-accordion"
import { Pill, button, container, revealDelay, sectionY, stack, type } from "@/components/rcf/Ui"
import aboutHero from "@/public/about-hero.png"

export default function AboutPage() {
  return (
    // Phones: white page. Desktop: grey (as designed)
    <main className="w-full overflow-x-clip bg-white lg:bg-[#d9d9d9]">

      <SiteNav />


      {/* ===================== INTRO + HERO IMAGE ===================== */}
      <section className={`${container} pt-8 lg:pt-14`}>
        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:text-left">
          <div className="flex max-w-[620px] flex-col items-center gap-5 lg:items-start lg:gap-6">
            <div data-reveal className="hidden lg:block">
              <BackButton href="/" />
            </div>
            {/* Phones: "ABOUT US". Desktop: "RCF UNILORIN PS" (as designed) */}
            <h1 data-reveal style={revealDelay(100)} className={`${type.title} text-[#1c1c1c] max-lg:font-semibold`}>
              <span className="lg:hidden">ABOUT US</span>
              <span className="hidden lg:inline">RCF UNILORIN PS</span>
            </h1>
            <p data-reveal style={revealDelay(200)} className={`${type.body} text-[#242323]/80`}>
              RCF Unilorin PS also known as the Success Centre is the campus fellowship of Christ The Redeemer
              Ministries, RCCG. We believe success goes beyond grades: it&apos;s growing in faith, sharpening
              character, excelling academically, and living out God&apos;s purpose on campus. Built on Aggressive
              Evangelism, we carry the Gospel beyond our walls and into every corner of student life.
            </p>
          </div>

          <a href="#values" data-reveal style={revealDelay(300)} className={`${button.primary} hidden lg:inline-flex`}>
            Know our values
          </a>
        </div>

        {/* Phones: 300 x 205 (Figma). Desktop: full column width */}
        <div data-reveal="scale" style={revealDelay(250)} className="relative mt-7 aspect-[300/205] w-full overflow-hidden rounded-[10px] lg:mt-12 lg:aspect-[1200/620] lg:rounded-[28px]">
          <Image src={aboutHero} alt="Students worshipping" fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="animate-hero-zoom object-cover object-center" />
          <div className="absolute inset-0 bg-black/30 lg:bg-black/45" />
        </div>
      </section>


      {/* ===================== MISSION + PHOTO COLLAGE ===================== */}
      <section className={`w-full ${sectionY}`}>
        <div className={`${container} flex flex-col items-center text-center lg:items-start lg:text-left ${stack}`}>
          <div data-reveal>
            <Pill tone="solid" mobileTone="blue">
              <span className="lg:hidden">Our mission</span>
              <span className="hidden lg:inline">The mission</span>
            </Pill>
          </div>
          <p data-reveal style={revealDelay(120)} className={`${type.body} max-w-[900px] text-black lg:font-serif lg:text-lead`}>
            Our mission is to lead people into a deeper relationship with God and create a welcoming community
            where everyone feels seen, loved, and valued. We envision a church that transforms lives through faith,
            service, and genuine connection—a place where hope is restored and hearts are united in purpose.
          </p>
        </div>

        <div className="mt-7 overflow-hidden lg:mt-14">
          <PhotoCollage />
        </div>
      </section>


      {/* ===================== VALUES — dark ===================== */}
      <section id="values" className={`w-full bg-[#1d1c1c] ${sectionY}`}>
        <div className={`${container} flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between lg:gap-16`}>
          <div data-reveal="left" className={`flex flex-col items-center text-center lg:sticky lg:top-28 lg:w-[380px] lg:shrink-0 lg:items-start lg:text-left ${stack}`}>
            <Pill tone="solid" mobileTone="solidLight">Our values</Pill>
            <h2 className={`${type.heading} text-[#d9d9d9]`}>
              <span className="lg:hidden">What we believe</span>
              <span className="hidden lg:inline">What We Believe</span>
            </h2>
            <p className={`${type.body} text-[#d9d9d9] lg:text-[#d9d9d9]/65`}>
              Our faith is rooted in the truth of God&apos;s Word and the love of Jesus Christ. We believe in
              living out that truth daily.
            </p>
          </div>

          <ValuesAccordion />
        </div>
      </section>


      {/* ===================== VISIT US / SERVICE TIME ===================== */}
      <section className={`w-full ${sectionY}`}>
        <div className={container}>
          <VisitCard />
        </div>
      </section>


      <SiteFooter />

    </main>
  )
}
