import Image from "next/image"
import Link from "next/link"
import logo from "@/public/rcf-logo.png"
import { container } from "@/components/rcf/Ui"

// Figma: two columns of three links. Prayers/Testimonies and Check-in are added so every page is reachable.
const footerColumns = [
  [
    { label: "Home", href: "/" },
    { label: "About us", href: "/about" },
    { label: "Sermons", href: "/sermons" },
    { label: "Events", href: "/events" },
  ],
  [
    { label: "Give", href: "/giving" },
    { label: "Transport", href: "/#transport" },
    { label: "Testimonies", href: "/testimony" },
    { label: "Check-in", href: "/check-in" },
  ],
]

const socials = [
  { label: "Instagram", href: "#" },
  { label: "X", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "YouTube", href: "#" },
]

// Same footer on every page.
// Phones (mobile frame): 38px logo + name, two centred link columns, socials spread, full-width divider.
// Desktop (desktop frame): logo + name left, link columns right, socials spread, thin divider.
export default function SiteFooter() {
  return (
    <footer className="w-full overflow-hidden bg-[#1d1c1c] pt-11 pb-10 text-white lg:pt-16 lg:pb-12">
      <div className={`${container} flex flex-col gap-8 lg:gap-12`}>

        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between">
          <Link href="/" className="flex items-center gap-4 transition-opacity hover:opacity-80">
            <Image src={logo} alt="" className="size-[38px] lg:size-11" />
            <span className="font-serif text-[22px] leading-none tracking-[-0.02em] lg:text-[24px]">RCF UNILORIN PS</span>
          </Link>

          <nav aria-label="Footer" className="flex gap-8 sm:gap-12 lg:gap-16">
            {footerColumns.map((column, i) => (
              <ul key={i} className="flex min-w-[100px] flex-col gap-4 text-center lg:min-w-0 lg:text-left">
                {column.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[14px] leading-none font-medium uppercase tracking-[0.06em] text-white/90 transition-colors hover:text-[#00a8e8] lg:text-[13px] lg:tracking-[0.1em]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </nav>
        </div>

        <div className="flex justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.12em] lg:text-[11px] lg:tracking-[0.14em]">
          {socials.map((social) => (
            <Link key={social.label} href={social.href} className="link-underline pb-1 transition-colors hover:text-[#00a8e8]">
              {social.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Divider — full width on phones, as designed */}
      <div className="mt-8 h-px w-full bg-[#d9d9d9]/40 lg:mx-auto lg:mt-12 lg:w-[calc(100%-5rem)] lg:max-w-[75rem] lg:bg-[#d9d9d9]/30" />
    </footer>
  )
}
