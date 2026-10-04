import React from 'react'
import Image, { StaticImageData } from 'next/image'
import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import GiveCard from '@/components/give-card'
import heroBg from '@/public/Images/rcf-hero.png'
import bus from '@/public/Images/give-bus.png'
import accommodation from '@/public/Images/give-accomodation.png'
import sound from '@/public/Images/give-sound.png'
import solar from '@/public/Images/give-solar.png'

// "Other church needs" photo strip — swap in real images/titles.
const needs: { image: StaticImageData; alt: string }[] = [
  { image: bus, alt: 'Church bus' },
  { image: accommodation, alt: 'Student accommodation' },
  { image: sound, alt: 'Sound equipment' },
  { image: solar, alt: 'Solar panels' },
]

const page = () => {
  return (
    <div className="w-full overflow-x-hidden">

      {/* ===================== HERO (nav floats over it) ===================== */}
      <section className="give-hero relative w-full min-h-[810px] flex flex-col">

        {/* Background image (decorative) */}
        <Image
          src={heroBg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Dark overlay, fading to near-black toward the bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/80 to-black" />

        <SiteNav variant="transparent" />

        {/* Content */}
        <div className="relative z-10 flex-1 w-full px-6 md:px-24 pt-32 md:pt-40 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">

          {/* LEFT — badge, heading, copy */}
          <div className="flex flex-col gap-5 md:gap-6">
            <span className="badge border border-[#4FA8E0] text-white text-[11px] font-medium tracking-widest rounded-full px-7 py-2 w-fit">
              GIVE
            </span>

            <h1 className="font-serif text-white text-5xl sm:text-6xl md:text-7xl leading-[0.95]">
              Your Gift
              <br />
              Changes Lives
            </h1>

            <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-[520px]">
              Every act of giving helps us make a lasting impact in our church
              and community. Your generosity allows RCF to share God&apos;s love,
              serve those in need, and build a place where faith continues to grow.
            </p>
          </div>

          {/* RIGHT — giving details card (client component) */}
          <div className="flex lg:justify-end">
            <GiveCard />
          </div>

        </div>

        {/* Other church needs label — sits at the bottom of the hero */}
        <div className="relative z-10 px-6 md:px-24 pt-16 pb-12 md:pb-16">
          <span className="badge inline-block border border-[#4FA8E0] text-white text-[11px] font-medium tracking-widest rounded-full px-6 py-2.5">
            OTHER CHURCH NEEDS
          </span>
        </div>

      </section>


      {/* ===================== OTHER CHURCH NEEDS — PHOTO STRIP ===================== */}
      {/* 2 columns on mobile, 4 across on desktop. 1px black gaps act as dividers. */}
      <section className="needs w-full bg-black grid grid-cols-2 lg:grid-cols-4 gap-px">
        {needs.map((item) => (
          <div key={item.alt} className="relative aspect-[3/4] lg:aspect-auto lg:h-[480px] overflow-hidden">
            <Image
              src={item.image}
              alt={item.alt}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </section>


      {/* ===================== FOOTER ===================== */}
      <SiteFooter />

    </div>
  )
}

export default page