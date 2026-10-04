import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

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

const SiteFooter = () => {
  return (
    <footer className="footer w-full bg-[#1c1c1c] px-4 sm:px-6 lg:px-10 pt-12 md:pt-16 pb-10 md:pb-14">
      <div className="mx-auto w-full max-w-7xl">

        {/* Top row — logo + name (left), nav links (right) */}
        <div className="mb-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-3">
            <Image
              src="/images/rcf-logo.png"
              alt="RCF Unilorin PS logo"
              width={56}
              height={56}
              sizes="(min-width: 1024px) 48px, 40px"
              className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11 lg:h-12 lg:w-12"
            />
            <span className="font-serif text-xl text-white sm:text-2xl lg:text-3xl">
              RCF UNILORIN PS
            </span>
          </div>

          {/* 2 columns x 3 rows */}
          <nav className="grid w-fit grid-flow-col grid-rows-3 gap-x-10 gap-y-2 text-sm tracking-wide text-white">
            {footerLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-[#4FA8E0]">
                {link.label}
              </Link>
            ))}
          </nav>

        </div>

        {/* Social row */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 text-[11px] font-semibold tracking-wide text-white">
          {socialLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-[#4FA8E0]">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Bottom divider */}
        <div className="mt-10 border-t border-white/25 md:mt-12" />

      </div>
    </footer>
  )
}

export default SiteFooter