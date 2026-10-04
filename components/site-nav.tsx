import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import logo from '@/public/Images/rcf-logo.png'
import menu from '@/public/icons/hamburger.svg'

type SiteNavProps = {
  // 'solid'       -> dark bar in normal flow (About, Events, Testimony)
  // 'transparent' -> floats over a hero image (Give). The parent section must be `relative`.
  variant?: 'solid' | 'transparent'
}

const SiteNav = ({ variant = 'solid' }: SiteNavProps) => {
  const base =
    'site-nav w-full h-18 md:h-22 flex flex-row items-center justify-between px-6 md:px-10'
  const styles =
    variant === 'transparent'
      ? 'absolute top-0 left-0 z-20 bg-transparent'
      : 'bg-[#1c1c1c]'

  return (
    <header className={`${base} ${styles}`}>

      <Link href="/" aria-label="RCF Unilorin PS home">
        <Image
          className="h-12 w-12 md:h-15 md:w-15"
          src={logo}
          height={60}
          width={60}
          alt="rcf logo"
        />
      </Link>

      <Image
        className="cursor-pointer w-7 md:w-8.25 h-auto"
        src={menu}
        height={16.5}
        width={33}
        alt="menu"
      />

    </header>
  )
}

export default SiteNav
