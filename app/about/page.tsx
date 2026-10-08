import Image from "next/image"
import Link from "next/link"
import { Eyebrow, body, cta } from "@/components/rcf/Ui"
import PhotoCollage from "@/components/rcf/photo-collage"
import VisitCard from "@/components/rcf/visit-card"
import SiteFooter from "@/components/rcf/site-footer"
import ValuesAccordion from "@/components/values-accordion"

import logo from "@/public/rcf-logo.png"
import menu from "@/public/icons/hamburger.svg"
import aboutHero from "@/public/about-hero.png"

export default function AboutPage() {
    return (
        <main className="bg-[#d9d9d9]">

            {/* ===================== NAV — sticky, 100 tall ===================== */}
            <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between bg-[#1d1c1c] px-5 lg:h-[100px] lg:px-[35px]">
                <Link href="/">
                    <Image src={logo} alt="RCF Unilorin PS logo" priority className="size-12 lg:size-[66px]" />
                </Link>
                <button type="button" aria-label="Open menu" className="flex size-11 cursor-pointer items-center justify-center">
                    <Image src={menu} alt="" className="h-[16.5px] w-[33px]" />
                </button>
            </header>


            {/* ===================== INTRO + HERO IMAGE + MISSION — 1200 wide ===================== */}
            <section className="mx-auto w-full max-w-[1240px] px-5 pt-14 pb-16 lg:pt-[124px] lg:pb-[130px]">

                {/* Title block (712 wide) left, button bottom-right */}
                <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex w-full max-w-[712px] flex-col items-start gap-[42px]">

                        {/* Back button — 100 x 45 */}
                        <Link
                            href="/"
                            className="flex h-[45px] w-[100px] items-center justify-center gap-1 rounded-[26px] bg-[#1d1c1c] text-[16px] leading-[27px] tracking-[0.05em] text-[#d9d9d9]"
                        >
                            <svg aria-hidden width="8" height="14" viewBox="0 0 8 14" fill="none">
                                <path d="M7 1 1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            BACK
                        </Link>

                        <div className="flex flex-col gap-[15px]">
                            <h1 className="cap-trim font-serif text-[44px] tracking-[-0.03em] text-[#1c1c1c] lg:min-h-16 lg:text-[65px]">
                                RCF UNILORIN PS
                            </h1>
                            <p className={`cap-trim text-black lg:min-h-[188px] ${body}`}>
                                RCF Unilorin PS also known as the Success Centre is the campus fellowship of Christ The Redeemer
                                Ministries, RCCG. We believe success goes beyond grades: it&apos;s growing in faith, sharpening
                                character, excelling academically, and living out God&apos;s purpose on campus. Built on Aggressive
                                Evangelism, we carry the Gospel beyond our walls and into every corner of student life.
                            </p>
                        </div>
                    </div>

                    <a
                        href="#values"
                        className={`${cta} flex w-[224px] items-center justify-center bg-[#00a8e8] font-normal text-[#18306e] hover:bg-[#00a8e8]/90`}
                    >
                        KNOW OUR VALUES
                    </a>
                </div>

                {/* Hero image — 1200 x 820, 10px corners, 48% dark overlay */}
                <div className="relative mt-12 aspect-[1200/820] w-full overflow-hidden rounded-[10px] lg:mt-[78px]">
                    <Image src={aboutHero} alt="Students worshipping" fill priority sizes="(min-width: 1240px) 1200px, 100vw" className="object-cover" />
                    <div className="absolute inset-0 bg-black/[0.48]" />
                </div>

                {/* Mission */}
                <div className="mt-16 flex flex-col items-start gap-10 lg:mt-[130px] lg:gap-[67px]">
                    <Eyebrow width="w-[172px]" tone="blue">The mission</Eyebrow>
                    <p className="cap-trim font-serif text-2xl leading-[40px] text-black lg:min-h-[215px] lg:text-[32px] lg:leading-[54px]">
                        Our mission is to lead people into a deeper relationship with God and create a welcoming community
                        where everyone feels seen, loved, and valued. We envision a church that transforms lives through faith,
                        service, and genuine connection—a place where hope is restored and hearts are united in purpose.
                    </p>
                </div>

            </section>


            {/* ===================== PHOTO COLLAGE (same as landing) ===================== */}
            <section className="w-full overflow-hidden pb-16 lg:pb-[130px]">
                <PhotoCollage />
            </section>


            {/* ===================== VALUES — dark, 974 tall at desktop ===================== */}
            <section id="values" className="w-full scroll-mt-[100px] bg-[#1d1c1c] px-5 py-16 lg:min-h-[974px] lg:py-[115px]">
                <div className="mx-auto flex max-w-[1200px] flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">

                    {/* Left — 468 wide, sticks below the nav while the accordion scrolls */}
                    <div className="flex flex-col items-start gap-[39px] lg:sticky lg:top-[100px] lg:w-[468px] lg:py-5">
                        <Eyebrow width="w-[133px]" tone="blue">Our values</Eyebrow>
                        <div className="flex flex-col gap-6">
                            <h2 className="cap-trim font-serif text-[40px] font-light text-[#d9d9d9] lg:text-[48px]">What We Believe</h2>
                            <p className={`cap-trim max-w-[415px] text-[#d9d9d9]/60 ${body}`}>
                                Our faith is rooted in the truth of God&apos;s Word and the love of Jesus Christ. We believe in
                                living out that truth daily.
                            </p>
                        </div>
                    </div>

                    <ValuesAccordion />
                </div>
            </section>


            {/* ===================== VISIT US ===================== */}
            <section className="w-full px-5 py-16 lg:pt-[78px] lg:pb-[68px]">
                <VisitCard />
            </section>


            <SiteFooter />

        </main>
    )
}