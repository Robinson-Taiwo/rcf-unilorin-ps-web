"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import Marquee from "@/components/marquee"
import logo from "@/public/rcf-logo.png"
import menu from "@/public/icons/hamburger.svg"
import heroBg from "@/public/rcf-hero.png"
import { container } from "@/components/rcf/Ui"

// Menu labels and order from the Figma "Nav Pop-up" frame
const menuLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Service", href: "/check-in" },
  { label: "Sermon", href: "/sermons" },
  { label: "Events", href: "/events" },
  { label: "Giving", href: "/giving" },
  { label: "Prayers / Testimonies", href: "/testimony" },
  { label: "Transport", href: "/#transport" },
]

const menuOverlay =
  "linear-gradient(rgba(0,0,0,0.72), rgba(0,0,0,0.72)), linear-gradient(180deg, rgba(102,102,102,0.024) 0%, rgba(0,0,0,0.81) 100%)"

// Sticky nav bar, same on every page: logo left, menu button right (as designed).
// 64px tall on phones, 72px on desktop.
// "solid" (default): dark bar that stays at the top while you scroll.
// "transparent": for pages with a photo hero (home, giving, check-in) — floats over the photo, then turns
// into the dark bar once you scroll down.
export default function SiteNav({ variant = "solid" }: { variant?: "solid" | "transparent" }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Track scroll so the bar can go dark (transparent variant) and get a shadow (both)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // While the menu is open: lock page scroll and close on Esc. Links close it on click.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const position = variant === "solid" ? "sticky" : "fixed inset-x-0"
  const surface =
    variant === "solid" || scrolled
      ? "bg-[#1d1c1c]/95 backdrop-blur-md"
      : "bg-transparent"
  const shadow = scrolled ? "shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]" : ""

  const bar = (inMenu: boolean) => (
    <div className={`${container} flex h-full items-center justify-between`}>
      <Link href="/" onClick={() => setOpen(false)} className="transition-opacity hover:opacity-80">
        <Image src={logo} alt="RCF Unilorin PS logo" priority className="size-10 lg:size-11" />
      </Link>
      {inMenu ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="flex size-8 cursor-pointer items-center justify-center text-[#d9d9d9] transition-transform duration-300 hover:rotate-90"
        >
          <X className="size-6" strokeWidth={1.5} />
        </button>
      ) : (
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(true)}
          className="flex size-8 cursor-pointer items-center justify-center transition-opacity hover:opacity-75"
        >
          <Image src={menu} alt="" className="size-7" />
        </button>
      )}
    </div>
  )

  return (
    <>
      <header
        className={`top-0 z-50 h-16 w-full transition-[background-color,box-shadow] duration-300 lg:h-[72px] ${position} ${surface} ${shadow}`}
      >
        {bar(false)}
      </header>

      {open && (
        <div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[100] flex animate-fade-in flex-col overflow-hidden bg-[#1d1c1c] [animation-duration:0.35s]"
        >
          <Image src={heroBg} alt="" fill sizes="100vw" className="animate-hero-zoom object-cover" />
          <div aria-hidden className="absolute inset-0" style={{ backgroundImage: menuOverlay }} />

          <div className="relative h-16 shrink-0 lg:h-[72px]">{bar(true)}</div>

          {/* Links — stacked on the left, as designed. 20px on phones, up to 28px on desktop. */}
          <nav aria-label="Main" className={`${container} relative flex flex-1 flex-col justify-center overflow-y-auto py-8`}>
            <ul className="flex flex-col gap-[clamp(0.875rem,2.6svh,1.75rem)]">
              {menuLinks.map((link, i) => {
                const active = link.href === pathname
                return (
                  <li key={link.href} className="animate-fade-up" style={{ animationDelay: `${100 + i * 50}ms` }}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`group inline-flex items-center gap-3 font-serif text-[20px] leading-tight uppercase tracking-[0.01em] transition-colors duration-300 sm:text-[22px] lg:text-[clamp(1.375rem,3svh,1.75rem)] ${
                        active ? "text-[#00a8e8]" : "text-[#d9d9d9] hover:text-[#00a8e8]"
                      }`}
                    >
                      <span aria-hidden className={`h-px bg-current transition-all duration-500 ease-out-expo ${active ? "w-6" : "w-0 group-hover:w-6"}`} />
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <Marquee className="relative shrink-0 bg-[#00a8e8] text-[#1c1c1c]" />
        </div>
      )}
    </>
  )
}
