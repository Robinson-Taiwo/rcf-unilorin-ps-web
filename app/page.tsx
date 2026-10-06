import React from 'react'
import Image from 'next/image'
import logo from "@/public/Images/rcf-logo.png"
import menu from "@/public/icons/hamburger.svg"
import { Button } from '@/components/ui/button'
import { Clock } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import { Download } from 'lucide-react'
import Link from 'next/link'

const page = () => {
  return (
    <div>

      {/* ===================== HERO SECTION (already built — untouched) =====================.  */}
      <section className="hero bg-[url('/images/rcf-hero.png')] w-screen h-227.25 bg-cover bg-center flex-col items-center flex  pt-[20px]  px-6.5 ">

        <div className="nav flex flex-row w-full h-fit items-center justify-between ">

          <Image className='logo h-15 w-15 '
            src={logo}
            height={60}
            width={60}
            alt='rcf logo'

          />


          <Image className='logo text-white h-[33.5px] cursor-pointer w-8.25 '
            src={menu}
            height={16.5}
            width={33}
            alt='rcf logo'

          />

        </div>


        <div className="cta flex flex-row w-full justify-center mt-147.5 gap-6 ">

          <Button className='bg-[#00A8E8] text-white text-[18px] w-45.5 h-14.5 rounded-[10px] font-bold text-lg leading-6 tracking-wide'>Get Started</Button>

          <Button className='bg-transparent text-white border-[#00A8E8] w-45.5 h-14.5 rounded-[10px] font-bold text-lg leading-6 tracking-wide'>Get Started</Button>

        </div>


      </section>


      {/* ===================== MARQUEE / TICKER BAR ===================== */}
      {/* Thin gray strip, text scrolls infinitely left. Content is duplicated 
    inside a single flex track so the loop is seamless — when the first 
    copy slides fully out, the second copy is right behind it. */}
      <section className="marquee w-screen bg-[#d9d9d9] border-t-4 border-black border-b-2 border-b-[#00A8E8] py-4 overflow-hidden">

        <div className="marquee-track flex whitespace-nowrap animate-marquee">

          {/* First copy of the text */}
          <p className="text-[13px] tracking-[0.25em] font-medium text-black uppercase pr-8">
            We are a praying fellowship . Rooted in the word . We love God &amp; we love people . Aggressive evangelism .
          </p>

          {/* Duplicate copy — sits right after the first so the scroll loops without a visible gap */}
          <p className="text-[13px] tracking-[0.25em] font-medium text-black uppercase pr-8" aria-hidden="true">
            We are a praying fellowship . Rooted in the word . We love God &amp; we love people . Aggressive evangelism .
          </p>

        </div>

      </section>


      {/* ===================== WELCOME TEXT SECTION (blue gradient) ===================== */}
      {/* This sits directly below the marquee, still part of the blue gradient block seen in the full-page screenshot */}
      <section className="welcome-text w-screen bg-gradient-to-br from-[#4FA8E0] to-[#00A8E8] flex flex-col items-center justify-center text-center px-6.5 py-24">

        {/* Pill badge */}
        <span className="badge border border-black/70 text-black text-xs font-semibold tracking-widest rounded-[26px] px-[21.5px] py-[14px] mb-8">
          WELCOME TO RCF
        </span>

        {/* Big serif stacked heading */}
        <h1 className="font-serif font-semibold text-black leading-[0.95] text-6xl lg:text-[109px]  lg:leading-26.75 md:text-8xl">
          THE
          <br />
          JOYOUS
          <br />
          PEOPLE
          <br />
          ON CAMPUS
        </h1>

        {/* Supporting paragraph */}
        <p className="text-black lg:text-[18px] lg:leading-[27px]  text-base md:text-lg max-w-2x   mt-[43px] lg:h-[69px] lg:w-[650px] leading-relaxed">
          We are a student fellowship in Unilorin committed to aggressive evangelism,
          deep discipleship, and building people who carry the gospel into every  place they go.
        </p>

      </section>


      {/* ===================== SERVICE TIMES SECTION (gray) ===================== */}


      <section className="flex w-full bg-[#D9D9D9] py-[85px] justify-center items-center "
      >

        <div className="service-times w-fit lg:px-[44px] px-6.5 md:px-20 pb-[56px] flex flex-col md:flex-row  justify-between lg:gap-[273px] border rounded-[55px] border-[#8A8D93]">

          {/* LEFT SIDE — badge, heading, copy, CTA */}
          <div className="left flex flex-col  max-w-lg">

            <span className="badge border mt-[56px] border-[#000000] text-[black] text-[13px] items-center mb-[45px] flex justify-center font-semibold tracking-widest rounded-[26px] px-5 py-2.5 w-fit">
              Visit US
            </span>

            <h2 className="text-5xl mb-[15px] font-semibold font-serif text-black leading-tight">
              We saved you a seat
            </h2>

            <p className="text-gray-600 lg:h-[94px] lg:text-[18px] lg:leading-[27px] leading-relaxed">
              Pull up. You&apos;re most welcome.
              <br />
              Come find your people, grow in faith, and experience genuine community.
            </p>

            <Button className="bg-[#00A8E8] mt-[39px] text-white text-[16px] w-56 h-14.5 rounded-[10px] font-bold tracking-wide">
              PLAN YOUR VISIT
            </Button>
          </div>

          {/* RIGHT SIDE — list of service times */}
          <div className="right flex flex-col lg:mt-[139px] gap-8 md:pt-4">

            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-semibold text-black">Sunday Service</h3>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock size={18} />
                <span>7:20AM WAT</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-semibold text-black">Tuesday Bible Study</h3>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock size={18} />
                <span>6:15PM WAT</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-semibold text-black">Thursday Prayer Meeting</h3>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock size={18} />
                <span>6:15PM WAT</span>
              </div>
            </div>

          </div>

        </div>

      </section>






      {/* ===================== ABOUT US SECTION ===================== */}
      {/* Sits inside the continuing blue gradient background. 
          Photo collage: 5 images in a row, center one taller, side ones 
          partially cropped off-screen for that "bleeding edge" effect. 
          overflow-hidden on the section clips the outer two images. */}
      <section className="about-us w-screen bg-gradient-to-b from-[#00A8E8] to-[#00A8E8] overflow-hidden px-6.5 py-24 flex flex-col items-center">

        {/* Badge */}
        <span className="badge border border-black/70 text-black text-xs font-semibold tracking-widest rounded-full px-6 py-2.5 mb-16">
          ABOUT US
        </span>

        {/* Photo collage row */}
        <div className="collage flex flex-row items-center justify-center gap-5 mb-20 max-w-[1400px] w-full">

          {/* Far left image — partially cropped by overflow-hidden */}
          <div className="relative w-25 h-71.5 -ml-12 rounded-2xl overflow-hidden shrink-0 hidden lg:block">
            <Image src="/images/raised-hands-1.png" alt="Worship" fill className="object-cover" />
          </div>

          {/* Left stacked column — two images */}
          <div className="flex flex-col gap-5 shrink-0">
            <div className="relative w-[327px] h-[355px] rounded-2xl overflow-hidden">
              <Image src="/images/holy-holy.png" alt="Holy Holy worship night" fill className="object-cover" />
            </div>
            <div className="relative w-[327px] h-[475px] rounded-2xl overflow-hidden">
              <Image src="/images/bw-hands.png" alt="Worship black and white" fill className="object-cover" />
            </div>
          </div>

          {/* Center tall image */}
          <div className="relative w-[498px] h-[1013px] rounded-2xl overflow-hidden shrink-0">
            <Image src="/images/prayer-center.png" alt="Students praying" fill className="object-cover" />
          </div>

          {/* Right stacked column — two images */}
          <div className="flex flex-col gap-5 shrink-0">
            <div className="relative w-[327px] h-[470px] rounded-2xl overflow-hidden">
              <Image src="/images/crowd-hands.png" alt="Congregation worship" fill className="object-cover" />
            </div>
            <div className="relative w-[327px] h-[355px] rounded-2xl overflow-hidden">
              <Image src="/images/prayer-back.png" alt="Prayer shirt back view" fill className="object-cover" />
            </div>
          </div>

          {/* Far right image — partially cropped by overflow-hidden */}
          <div className="relative w-25 h-102.5 -mr-12 rounded-2xl overflow-hidden shrink-0 hidden lg:block">
            <Image src="/images/sanctuary.png" alt="Sanctuary" fill className="object-cover" />
          </div>

        </div>

        {/* About paragraph */}
        <p className="font-serif text-black text-2xl md:text-3xl text-center leading-snug max-w-4xl">
          RCF Unilorin PS also known as the Success Centre is the campus fellowship
          of Christ The Redeemer Ministries, RCCG. We believe success goes beyond
          grades: it&apos;s growing in faith, sharpening character, excelling academically,
          and living out God&apos;s purpose on campus. Built on Aggressive Evangelism, we
          carry the Gospel beyond our walls and into every corner of student life.
        </p>

        {/* CTA */}
        <Button className="bg-[#4FA8E0]/60 text-white text-[15px] w-56 h-14 rounded-[10px] font-bold tracking-wide mt-10 hover:bg-[#4FA8E0]/80">
          MORE ABOUT US
        </Button>

      </section>


      {/* ===================== FEATURED SERMONS SECTION ===================== */}
      <section className="sermons w-screen bg-[#d9d9d9] border-t-2 border-[#00A8E8] border-b-2 px-6.5 md:px-20 py-20">

        {/* Header row: badge + description on the left, CTA button on the right */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-14">

          <div className="flex flex-col gap-4 max-w-xl">
            <span className="badge border border-[#00A8E8] text-[#00A8E8] text-xs font-semibold tracking-widest rounded-full px-5 py-2.5 w-fit">
              FEATURED SERMONS
            </span>

            <p className="text-black text-lg leading-relaxed">
              There&apos;s a Word for you, Press play and discover messages of faith,
              hope, and truth to encourage you wherever you are in your walk with God.
            </p>
          </div>

          <Button className="bg-[#00A8E8] text-white text-[16px] w-56 h-14.5 rounded-[10px] font-bold tracking-wide shrink-0">
            SEE ALL SERMONS
          </Button>

        </div>

        {/* Sermon cards grid — 2 columns x 2 rows on desktop, 1 column on mobile.
            Each card below is identical in structure — once confirmed, this 
            should become a reusable <SermonCard /> component that takes 
            { image, duration, title, date, audioUrl } as props. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* ---- SERMON CARD 1 ---- */}
          <div className="sermon-card flex flex-col gap-5">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src="/images/the-very-life-of-prayer.png" alt="The Weight of a Calling" fill className="object-cover" />
              {/* Duration pill — bottom left over image */}
              <span className="absolute bottom-4 left-4 bg-white text-black text-xs font-semibold px-4 py-2 rounded-full">
                1HR 30MINS
              </span>
            </div>

            <h3 className="font-serif font-bold text-3xl text-black">The Weight of a Calling</h3>

            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 bg-black text-white text-xs font-semibold px-5 py-3 rounded-full">
                <Download size={14} />
                DOWNLOAD AUDIO
              </button>
              <span className="text-black text-sm font-semibold tracking-wide">AUGUST 5, 2025</span>
            </div>
          </div>

          {/* ---- SERMON CARD 2 ---- */}
          <div className="sermon-card flex flex-col gap-5">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src="/images/the-very-life-of-prayer.png" alt="The Weight of a Calling" fill className="object-cover" />
              <span className="absolute bottom-4 left-4 bg-white text-black text-xs font-semibold px-4 py-2 rounded-full">
                1HR 30MINS
              </span>
            </div>

            <h3 className="font-serif font-bold text-3xl text-black">The Weight of a Calling</h3>

            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 bg-black text-white text-xs font-semibold px-5 py-3 rounded-full">
                <Download size={14} />
                DOWNLOAD AUDIO
              </button>
              <span className="text-black text-sm font-semibold tracking-wide">AUGUST 5, 2025</span>
            </div>
          </div>

          {/* ---- SERMON CARD 3 ---- */}
          <div className="sermon-card flex flex-col gap-5">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src="/images/the-very-life-of-prayer.png" alt="The Weight of a Calling" fill className="object-cover" />
              <span className="absolute bottom-4 left-4 bg-white text-black text-xs font-semibold px-4 py-2 rounded-full">
                1HR 30MINS
              </span>
            </div>

            <h3 className="font-serif font-bold text-3xl text-black">The Weight of a Calling</h3>

            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 bg-black text-white text-xs font-semibold px-5 py-3 rounded-full">
                <Download size={14} />
                DOWNLOAD AUDIO
              </button>
              <span className="text-black text-sm font-semibold tracking-wide">AUGUST 5, 2025</span>
            </div>
          </div>

          {/* ---- SERMON CARD 4 ---- */}
          <div className="sermon-card flex flex-col gap-5">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src="/images/the-very-life-of-prayer.png" alt="The Weight of a Calling" fill className="object-cover" />
              <span className="absolute bottom-4 left-4 bg-white text-black text-xs font-semibold px-4 py-2 rounded-full">
                1HR 30MINS
              </span>
            </div>

            <h3 className="font-serif font-bold text-3xl text-black">The Weight of a Calling</h3>

            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 bg-black text-white text-xs font-semibold px-5 py-3 rounded-full">
                <Download size={14} />
                DOWNLOAD AUDIO
              </button>
              <span className="text-black text-sm font-semibold tracking-wide">AUGUST 5, 2025</span>
            </div>
          </div>

        </div>

      </section>



      {/* ===================== UPCOMING EVENTS SECTION ===================== */}
      {/* Blue gradient background, continues from the sermons section above */}
      <section className="events w-screen bg-gradient-to-b from-[#4FA8E0] to-[#3B7FE0] px-6.5 md:px-20 py-20">

        {/* Header row: badge + description on left, CTA button on right */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-14">

          <div className="flex flex-col gap-4 max-w-xl">
            <span className="badge border border-black/70 text-black text-xs font-semibold tracking-widest rounded-full px-6 py-2.5 w-fit">
              UPCOMING EVENTS
            </span>

            <p className="text-black text-lg leading-relaxed">
              Stay in the loop with what&apos;s happening at RCF. From worship Sundays,
              to varieties Sundays there&apos;s always something to look forward to.
              See what&apos;s coming up.
            </p>
          </div>

          <Button className="bg-black text-white text-[14px] w-48 h-13 rounded-[10px] font-semibold tracking-wide shrink-0">
            SEE ALL EVENTS
          </Button>

        </div>

        {/* Event cards grid — 2 columns x 2 rows on desktop, 1 column on mobile.
            Each card is identical in structure — once confirmed, this should
            become a reusable <EventCard /> component that takes
            { image, date, title, detailsUrl } as props. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* ---- EVENT CARD 1 ---- */}
          <div className="event-card flex flex-col gap-4">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src="/images/doctrine-of-christ.png" alt="Word & Prayer Conference" fill className="object-cover" />
              {/* View details pill — bottom left over image */}
              <button className="absolute bottom-5 left-5 flex items-center gap-1 bg-white/90 text-black text-xs font-semibold px-4 py-2.5 rounded-lg">
                VIEW DETAILS
                <ChevronRight size={14} />
              </button>
            </div>

            <p className="text-black text-sm">Thursday, January 8th-26TH, 2026</p>
            <h3 className="font-serif font-bold text-3xl text-black -mt-2">Word &amp; Prayer Conference</h3>
          </div>

          {/* ---- EVENT CARD 2 ---- */}
          <div className="event-card flex flex-col gap-4">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src="/images/doctrine-of-christ.png" alt="Word & Prayer Conference" fill className="object-cover" />
              <button className="absolute bottom-5 left-5 flex items-center gap-1 bg-white/90 text-black text-xs font-semibold px-4 py-2.5 rounded-lg">
                VIEW DETAILS
                <ChevronRight size={14} />
              </button>
            </div>

            <p className="text-black text-sm">Thursday, January 8th-26TH, 2026</p>
            <h3 className="font-serif font-bold text-3xl text-black -mt-2">Word &amp; Prayer Conference</h3>
          </div>

          {/* ---- EVENT CARD 3 ---- */}
          <div className="event-card flex flex-col gap-4">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src="/images/doctrine-of-christ.png" alt="Word & Prayer Conference" fill className="object-cover" />
              <button className="absolute bottom-5 left-5 flex items-center gap-1 bg-white/90 text-black text-xs font-semibold px-4 py-2.5 rounded-lg">
                VIEW DETAILS
                <ChevronRight size={14} />
              </button>
            </div>

            <p className="text-black text-sm">Thursday, January 8th-26TH, 2026</p>
            <h3 className="font-serif font-bold text-3xl text-black -mt-2">Word &amp; Prayer Conference</h3>
          </div>

          {/* ---- EVENT CARD 4 ---- */}
          <div className="event-card flex flex-col gap-4">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src="/images/doctrine-of-christ.png" alt="Word & Prayer Conference" fill className="object-cover" />
              <button className="absolute bottom-5 left-5 flex items-center gap-1 bg-white/90 text-black text-xs font-semibold px-4 py-2.5 rounded-lg">
                VIEW DETAILS
                <ChevronRight size={14} />
              </button>
            </div>

            <p className="text-black text-sm">Thursday, January 8th-26TH, 2026</p>
            <h3 className="font-serif font-bold text-3xl text-black -mt-2">Word &amp; Prayer Conference</h3>
          </div>

        </div>

      </section>


      {/* ===================== SUPPORT THE MISSION / GIVE SECTION ===================== */}
      {/* Full-bleed background image (same silhouette-hands photo as hero) 
          with a dark overlay so white text is readable on top. */}
      <section className="give relative w-screen h-125 bg-[url('/images/rcf-hero.png')] bg-cover bg-center flex flex-col items-center justify-center text-center px-6.5">

        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content sits above the overlay */}
        <div className="relative z-10 flex flex-col items-center">

          <span className="badge border border-[#00A8E8] text-white text-xs font-semibold tracking-widest rounded-full px-6 py-2.5 mb-8">
            GIVE
          </span>

          <h2 className="font-serif text-white text-5xl md:text-6xl mb-6">
            Support the Mission
          </h2>

          <p className="text-white/90 text-base md:text-lg max-w-xl leading-relaxed mb-10">
            Be Part of the Mission.
            <br />
            Your support helps us turn ideas into action, serve people, and
            make a lasting impact in our fellowship and beyond.
          </p>

          <Button className="bg-[#00A8E8] text-white text-[16px] w-56 h-14.5 rounded-[10px] font-bold tracking-wide">
            MAKE AN IMPACT
          </Button>

        </div>

      </section>


      {/* ===================== TESTIMONY / PRAYERS SECTION ===================== */}
      {/* Blue gradient background */}
      <section className="testimonies w-screen bg-gradient-to-b from-[#3B7FE0] to-[#4FA8E0] px-6.5 md:px-20 py-20">

        {/* Header row: badge + description on left, CTA button on right */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-14">

          <div className="flex flex-col gap-4 max-w-xl">
            <span className="badge border border-black/70 text-black text-xs font-semibold tracking-widest rounded-full px-6 py-2.5 w-fit">
              TESTIMONY/PRAYERS
            </span>

            <p className="text-black text-lg leading-relaxed">
              Look What God Is Doing!
              <br />
              Real people. Real stories. Real testimonies of God&apos;s faithfulness.
              Come see how He&apos;s been moving, answering prayers, changing lives,
              and making a way.
            </p>
          </div>

          <Button className="bg-black text-white text-[14px] w-44 h-13 rounded-[10px] font-semibold tracking-wide shrink-0">
            SHARE YOURS
          </Button>

        </div>

        {/* Testimony cards row — 3 columns on desktop, stacked on mobile.
            Middle card uses a dark variant to break the pattern (matches screenshot).
            Once confirmed, this should become a reusable <TestimonyCard /> 
            component that takes { badgeLabel, quote, attribution, dark } as props. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ---- TESTIMONY CARD 1 (light) ---- */}
          <div className="testimony-card bg-[#d9d9d9] rounded-2xl p-8 flex flex-col justify-between min-h-[420px]">
            <span className="badge bg-[#00A8E8] text-white text-xs font-semibold tracking-widest rounded-full px-4 py-2 w-fit">
              TESTIMONY
            </span>

            <p className="text-black text-xl leading-relaxed my-8">
              &quot;I struggled with my results for two sessions. After joining the
              prayer unit and staying consistent, I made my best grades this
              semester. God is faithful.&quot;
            </p>

            <span className="text-black/70 text-sm">— A 300L student</span>
          </div>

          {/* ---- TESTIMONY CARD 2 (dark variant) ---- */}
          <div className="testimony-card bg-[#1a1a1a] rounded-2xl p-8 flex flex-col justify-between min-h-[420px]">
            <span className="badge bg-[#00A8E8] text-white text-xs font-semibold tracking-widest rounded-full px-4 py-2 w-fit">
              PRAYER POINT
            </span>

            <p className="text-white text-xl leading-relaxed my-8">
              &quot;Please pray for my final year project defense coming up next
              month for wisdom and a sound mind as I prepare.&quot;
            </p>

            <span className="text-white/70 text-sm">— Submitted anonymously</span>
          </div>

          {/* ---- TESTIMONY CARD 3 (light) ---- */}
          <div className="testimony-card bg-[#d9d9d9] rounded-2xl p-8 flex flex-col justify-between min-h-[420px]">
            <span className="badge bg-[#00A8E8] text-white text-xs font-semibold tracking-widest rounded-full px-4 py-2 w-fit">
              TESTIMONY
            </span>

            <p className="text-black text-xl leading-relaxed my-8">
              &quot;I came for one service as a visitor and found a family. A year
              later, I&apos;m serving in the choir and growing more than I imagined.&quot;
            </p>

            <span className="text-black/70 text-sm">— A 300L student</span>
          </div>

        </div>

      </section>


      {/* ===================== TRANSPORTATION SECTION ===================== */}
      {/* Gray background page section, containing a dark rounded "panel" 
          that itself contains a light "ticket info" card on the right. */}
      <section className="transport w-screen bg-[#d9d9d9] px-6.5 md:px-20 py-20">

        <div className="transport-panel relative bg-[#1a1a1a] rounded-3xl px-8 md:px-16 py-16 flex flex-col md:flex-row items-center justify-between gap-12">

          {/* LEFT SIDE — badge, heading, description */}
          <div className="flex flex-col gap-6 max-w-md">
            <span className="badge border border-white/60 text-white text-xs font-semibold tracking-widest rounded-full px-6 py-2.5 w-fit">
              TRANSPORTATION
            </span>

            <h2 className="font-serif text-white text-4xl md:text-5xl leading-tight">
              Reserve your seat on the bus.
            </h2>

            <p className="text-white/70 text-base leading-relaxed">
              One route, two directions — school to church before service,
              church back to school after. Book your slot ahead so you know
              you have a seat. No payment online; you pay on the bus.
            </p>
          </div>

          {/* RIGHT SIDE — light card with route options.
              Each route row below should become a reusable 
              <RouteOption /> component taking { from, to, seatsLeft, 
              departureTime, note, selected } as props. */}
          <div className="bg-[#f0f0f0] rounded-2xl p-6 w-full max-w-md flex flex-col gap-4">

            {/* Route option 1 — selected/highlighted state (blue border) */}
            <div className="route-option bg-[#c9e4f5] border-2 border-[#00A8E8] rounded-xl p-4 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-black text-lg">School → Church</span>
                <span className="bg-[#6b9b3f] text-white text-[10px] font-semibold tracking-wide px-3 py-1 rounded-full">
                  12 SEATS LEFT
                </span>
              </div>
              <span className="text-gray-600 text-sm">Departs 8:15 AM · Frisch laundry</span>
            </div>

            {/* Route option 2 — default state */}
            <div className="route-option bg-white border border-gray-300 rounded-xl p-4 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-black text-lg">Church → School</span>
                <span className="bg-[#6b9b3f] text-white text-[10px] font-semibold tracking-wide px-3 py-1 rounded-full">
                  12 SEATS LEFT
                </span>
              </div>
              <span className="text-gray-600 text-sm">Departs 8:15 AM · Frisch laundry</span>
            </div>

            {/* Footnote */}
            <p className="text-gray-600 text-sm leading-relaxed mt-1">
              You&apos;ll get a confirmation message once your slot is reserved.
              Please arrive 10 minutes before departure.
            </p>

          </div>

        </div>

      </section>


      {/* ===================== FOOTER ===================== */}
      {/* Dark full-width footer with logo/name on left, nav links on right,
          a row of social links below, then a divider line. */}
      <footer className="footer w-screen bg-[#1a1a1a] border-t-2 border-white px-6.5 md:px-20 pt-12 pb-10">

        {/* Top row — logo + fellowship name (left), nav links (right) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">

          {/* Logo + name */}
          <div className="flex items-center gap-4">
            <Image
              src="/images/rcf-logo.png"
              alt="RCF Unilorin PS logo"
              height={56}
              width={56}
              className="h-14 w-14"
            />
            <span className="font-serif text-white text-3xl">RCF UNILORIN PS</span>
          </div>

          {/* Nav links — 2 columns x 3 rows, matches screenshot layout.
              Should become a <FooterNav /> component that maps over a 
              links array: [{ label: 'Home', href: '/' }, ...] */}
          <nav className="grid grid-cols-2 gap-x-16 gap-y-2 text-white text-sm font-medium tracking-wide">
            <Link href="/" className="hover:text-[#00A8E8]">HOME</Link>
            <Link href="/events" className="hover:text-[#00A8E8]">EVENTS</Link>
            <Link href="/about" className="hover:text-[#00A8E8]">ABOUT US</Link>
            <Link href="/give" className="hover:text-[#00A8E8]">GIVE</Link>
            <Link href="/sermons" className="hover:text-[#00A8E8]">SERMONS</Link>
            <Link href="/transport" className="hover:text-[#00A8E8]">TRANSPORT</Link>
          </nav>

        </div>

        {/* Social links row — should become a <SocialLinks /> component
            mapping over [{ label: 'Instagram', href: '...' }, ...] */}
        <div className="flex flex-wrap items-center justify-between gap-6 text-white text-xs font-semibold tracking-widest border-t border-white/20 pt-8">
          <Link href="#" className="hover:text-[#00A8E8]">INSTAGRAM</Link>
          <Link href="#" className="hover:text-[#00A8E8]">X</Link>
          <Link href="#" className="hover:text-[#00A8E8]">TIKTOK</Link>
          <Link href="#" className="hover:text-[#00A8E8]">YOUTUBE</Link>
        </div>

      </footer>


    </div>
  )
}

export default page