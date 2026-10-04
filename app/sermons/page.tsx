import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import VisitCard from '@/components/visit-card'
import SermonCard, { SermonCardProps } from '@/components/sermon-card'
import theVeryLifeOfPrayer from '@/public/Images/the-very-life-of-prayer.png'

// Placeholder data — nine identical entries, as in the design.
// Replace with real sermons (or fetch from your CMS/DB later).
const sermons: (SermonCardProps & { id: number })[] = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  image: theVeryLifeOfPrayer,
  duration: '1HR 30MINS',
  title: 'The Weight of a Calling',
  date: 'AUGUST 5, 2025',
  audioUrl: '/audio/the-weight-of-a-calling.mp3', // TODO: real audio file URL
}))

const page = () => {
  return (
    <div className="w-full overflow-x-hidden">

      {/* ===================== NAV ===================== */}
      <SiteNav />

      {/* ===================== HEADER + SERMONS GRID ===================== */}
      <section className="sermons-page w-full bg-[#d9d9d9] px-6 md:px-12 lg:px-20 pt-16 md:pt-24 pb-16 md:pb-24">

        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 bg-[#1c1c1c] text-white text-xs font-medium tracking-wide rounded-full pl-3 pr-5 py-2.5 mb-5"
        >
          <ChevronLeft size={14} />
          BACK
        </Link>

        <h1 className="font-serif text-[#1c1c1c] text-4xl sm:text-5xl lg:text-6xl leading-none mb-10 md:mb-14">
          FEATURED SERMONS
        </h1>

        {/* 1 column on phones, 2 on tablets, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
          {sermons.map((sermon) => (
            <SermonCard
              key={sermon.id}
              image={sermon.image}
              duration={sermon.duration}
              title={sermon.title}
              date={sermon.date}
              audioUrl={sermon.audioUrl}
            />
          ))}
        </div>

      </section>

      {/* ===================== VISIT US ===================== */}
      <VisitCard />

      {/* ===================== FOOTER ===================== */}
      <SiteFooter />

    </div>
  )
}

export default page
