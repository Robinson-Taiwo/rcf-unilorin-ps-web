import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { ChevronLeft, Clock } from 'lucide-react'
import logo from '@/public/Images/rcf-logo.png'
import menu from '@/public/icons/hamburger.svg'
import { Button } from '@/components/ui/button'
import ValuesAccordion from '@/components/values-accordion'

const serviceTimes = [
    { name: 'Sunday Service', time: '7:20AM WAT' },
    { name: 'Tuesday Bible Study', time: '6:15PM WAT' },
    { name: 'Thursday Prayer Meeting', time: '6:15PM WAT' },
]

const footerLinks = [
    { label: 'HOME', href: '/' },
    { label: 'EVENTS', href: '/events' },
    { label: 'ABOUT US', href: '/about' },
    { label: 'GIVE', href: '/give' },
    { label: 'SERMONS', href: '/sermons' },
    { label: 'TRANSPORT', href: '/transport' },
]

const socialLinks = [
    { label: 'INSTAGRAM', href: '#' },
    { label: 'X', href: '#' },
    { label: 'TIKTOK', href: '#' },
    { label: 'YOUTUBE', href: '#' },
]

const page = () => {
    return (
        <div>

            {/* ===================== SCREENSHOT 1 — NAV BAR ===================== */}
            {/* Solid dark bar (not overlaid on an image like the landing hero). */}
            <header className="nav w-screen h-22 bg-[#1c1c1c] flex flex-row items-center justify-between px-6.5 md:px-9.5">

                <Link href="/">
                    <Image
                        className="logo h-15 w-15"
                        src={logo}
                        height={60}
                        width={60}
                        alt="rcf logo"
                    />
                </Link>

                <Image
                    className="cursor-pointer w-8.25 h-[33.5px]"
                    src={menu}
                    height={16.5}
                    width={33}
                    alt="menu"
                />

            </header>


            {/* ===================== SCREENSHOT 1 — INTRO + HERO IMAGE + MISSION ===================== */}
            <section className="about-intro w-screen bg-[#d9d9d9] px-6.5 md:px-24 pt-24 pb-24">

                {/* Back button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-1 bg-[#1c1c1c] text-white text-xs font-medium tracking-wide rounded-full pl-3 pr-5 py-3 mb-8"
                >
                    <ChevronLeft size={14} />
                    BACK
                </Link>

                {/* Title + paragraph on the left, "Know our values" button bottom-right */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">

                    <div className="flex flex-col gap-4 max-w-[580px]">
                        <h1 className="font-serif text-[#1c1c1c] text-5xl md:text-6xl leading-none">
                            RCF UNILORIN PS
                        </h1>

                        <p className="text-[#1c1c1c] text-sm md:text-[15px] leading-relaxed">
                            RCF Unilorin PS&nbsp; also known as the Success Centre is the campus
                            fellowship of Christ The Redeemer Ministries, RCCG. We believe success
                            goes beyond grades: it&apos;s growing in faith, sharpening character,
                            excelling academically, and living out God&apos;s purpose on campus.
                            Built on Aggressive Evangelism, we carry the Gospel beyond our walls
                            and into every corner of student life.
                        </p>
                    </div>

                    {/* Anchor link scrolls to the values section below */}
                    <a
                        href="#values"
                        className="inline-flex items-center justify-center bg-[#4FA8E0] text-[#0b2a4a] text-[15px] w-45 h-12.5 rounded-lg font-medium tracking-wide shrink-0 hover:bg-[#4FA8E0]/90 transition-colors"
                    >
                        KNOW OUR VALUES
                    </a>

                </div>

                {/* Big hero image with blue outline */}
                <div className="relative w-full aspect-[3/2] md:aspect-[960/655] mt-14 rounded-2xl overflow-hidden border-[3px] border-[#3B8FE8]">
                    <Image
                        src="/images/about-hero.png"
                        alt="Students worshipping"
                        fill
                        priority
                        className="object-cover"
                    />
                </div>

                {/* Mission */}
                <div className="mission mt-32 flex flex-col gap-8">
                    <span className="badge bg-[#4FA8E0] text-[#0b2a4a] text-[11px] font-medium tracking-widest rounded-full px-7 py-2 w-fit">
                        THE MISSION
                    </span>

                    <p className="font-serif text-[#1c1c1c] text-2xl md:text-[28px] leading-[1.55] max-w-[960px]">
                        Our mission is to lead people into a deeper relationship with God and
                        create a welcoming community where everyone feels seen, loved, and
                        valued. We envision a church that transforms lives through faith,
                        service, and genuine connection—a place where hope is restored and
                        hearts are united in purpose.
                    </p>
                </div>

            </section>


            {/* ===================== SCREENSHOT 2 — PHOTO COLLAGE ===================== */}
            {/* Desktop: 5 columns centered inside an overflow-hidden wrapper. The row is
          wider than the screen on purpose, so the two outer images get cropped
          equally on both sides (the "bleeding edge" look). */}
            <section className="collage-section w-screen bg-[#d9d9d9] overflow-hidden pb-24">

                <div className="collage hidden md:flex flex-row items-center justify-center gap-2">

                    {/* Far left — cropped */}
                    <div className="relative w-65 h-108 rounded-2xl overflow-hidden shrink-0">
                        <Image src="/images/raised-hands-1.png" alt="Worship" fill className="object-cover" />
                    </div>

                    {/* Left stacked column */}
                    <div className="flex flex-col gap-2 shrink-0">
                        <div className="relative w-65 h-71 rounded-2xl overflow-hidden">
                            <Image src="/images/holy-holy.png" alt="Holy Holy worship night" fill className="object-cover" />
                        </div>
                        <div className="relative w-65 h-95 rounded-2xl overflow-hidden">
                            <Image src="/images/bw-hands.png" alt="Worship black and white" fill className="object-cover" />
                        </div>
                    </div>

                    {/* Center tall image */}
                    <div className="relative w-100 h-202 rounded-2xl overflow-hidden shrink-0">
                        <Image src="/images/prayer-center.png" alt="Students praying" fill className="object-cover" />
                    </div>

                    {/* Right stacked column */}
                    <div className="flex flex-col gap-2 shrink-0">
                        <div className="relative w-65 h-94 rounded-2xl overflow-hidden">
                            <Image src="/images/crowd-hands.png" alt="Congregation worship" fill className="object-cover" />
                        </div>
                        <div className="relative w-65 h-71 rounded-2xl overflow-hidden">
                            <Image src="/images/prayer-back.png" alt="Prayer shirt back view" fill className="object-cover" />
                        </div>
                    </div>

                    {/* Far right — cropped */}
                    <div className="relative w-65 h-108 rounded-2xl overflow-hidden shrink-0">
                        <Image src="/images/sanctuary.png" alt="Sanctuary" fill className="object-cover" />
                    </div>

                </div>

                {/* Mobile fallback: simple 2-column grid so nothing gets squeezed */}
                <div className="grid grid-cols-2 gap-2 px-6.5 md:hidden">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                        <Image src="/images/holy-holy.png" alt="Holy Holy worship night" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                        <Image src="/images/crowd-hands.png" alt="Congregation worship" fill className="object-cover" />
                    </div>
                    <div className="relative col-span-2 aspect-[4/3] rounded-2xl overflow-hidden">
                        <Image src="/images/prayer-center.png" alt="Students praying" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                        <Image src="/images/bw-hands.png" alt="Worship black and white" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                        <Image src="/images/prayer-back.png" alt="Prayer shirt back view" fill className="object-cover" />
                    </div>
                </div>

            </section>


            {/* ===================== SCREENSHOT 3 — VALUES (dark) ===================== */}
            <section
                id="values"
                className="values w-screen bg-[#1c1c1c] px-6.5 md:px-24 py-24 grid grid-cols-1 md:grid-cols-[1fr_1.15fr] gap-16 md:gap-24 scroll-mt-4"
            >

                {/* Left — badge, heading, copy */}
                <div className="flex flex-col gap-4 md:pt-2">
                    <span className="badge bg-[#4FA8E0] text-[#0b2a4a] text-[10px] font-medium tracking-widest rounded-full px-4 py-2 w-fit">
                        OUR VALUES
                    </span>

                    <h2 className="font-serif font-light text-white/90 text-4xl md:text-5xl">
                        What We Believe
                    </h2>

                    <p className="text-white/50 text-sm leading-relaxed max-w-[300px]">
                        Our faith is rooted in the truth of God&apos;s Word and the love of
                        Jesus Christ. We believe in living out that truth daily.
                    </p>
                </div>

                {/* Right — accordion (client component) */}
                <ValuesAccordion />

            </section>


            {/* ===================== SCREENSHOT 3/4 — VISIT US CARD ===================== */}
            {/* Gray section wrapping a big rounded, outlined card. */}
            <section className="visit w-screen bg-[#d9d9d9] px-6.5 md:px-14 py-16">

                <div className="visit-card border border-gray-400 rounded-[40px] px-8 md:px-9 py-10 md:pb-12 flex flex-col md:flex-row md:justify-between gap-12">

                    {/* LEFT — badge, heading, copy, CTA */}
                    <div className="flex flex-col gap-5">
                        <span className="badge border border-[#1c1c1c]/70 text-[#1c1c1c] text-[10px] font-medium tracking-widest rounded-full px-5 py-1.5 w-fit">
                            VISIT US
                        </span>

                        <h2 className="font-serif font-bold text-[#1c1c1c] text-5xl md:text-[56px] leading-tight">
                            We saved you a seat
                        </h2>

                        <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                            Pull up. You&apos;re most welcome.
                            <br />
                            Come find your people, grow in faith, and experience genuine community.
                        </p>

                        <Button className="bg-[#4FA8E0] text-[#0b2a4a] text-[14px] w-43 h-11.5 rounded-lg font-medium tracking-wide mt-4 hover:bg-[#4FA8E0]/90">
                            PLAN YOUR VISIT
                        </Button>
                    </div>

                    {/* RIGHT — service times */}
                    <div className="flex flex-col gap-5 md:pt-6">
                        {serviceTimes.map((item) => (
                            <div key={item.name} className="flex flex-col gap-1">
                                <h3 className="text-2xl text-[#1c1c1c]">{item.name}</h3>
                                <div className="flex items-center gap-2 text-gray-700 text-sm">
                                    <Clock size={16} />
                                    <span>{item.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </section>


            {/* ===================== SCREENSHOT 4 — FOOTER ===================== */}
            <footer className="footer w-screen bg-[#1c1c1c] px-6.5 md:px-10 pt-20 pb-24">

                {/* Top row — logo + name (left), nav links (right) */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">

                    <div className="flex items-center gap-4">
                        <Image
                            src="/images/rcf-logo.png"
                            alt="RCF Unilorin PS logo"
                            height={56}
                            width={56}
                            className="h-14 w-14"
                        />
                        <span className="font-serif text-white text-3xl md:text-4xl">RCF UNILORIN PS</span>
                    </div>

                    {/* 2 columns x 3 rows — grid-flow-col fills down each column first */}
                    <nav className="grid grid-rows-3 grid-flow-col gap-x-12 gap-y-2 text-white text-sm tracking-wide">
                        {footerLinks.map((link) => (
                            <Link key={link.label} href={link.href} className="hover:text-[#4FA8E0]">
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                </div>

                {/* Social row */}
                <div className="flex flex-wrap items-center justify-between gap-6 text-white text-[11px] font-semibold tracking-wide">
                    {socialLinks.map((link) => (
                        <Link key={link.label} href={link.href} className="hover:text-[#4FA8E0]">
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Bottom divider */}
                <div className="mt-12 border-t border-white/25" />

            </footer>

        </div>
    )
}

export default page