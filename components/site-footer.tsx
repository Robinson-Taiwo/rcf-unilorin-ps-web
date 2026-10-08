import Image from "next/image"
import Link from "next/link"
import logo from "@/public/Images/rcf-logo.png"

const footerColumns = [
  { width: "w-[100px]", links: [{ label: "Home", href: "/" }, { label: "About us", href: "/about" }, { label: "Sermons", href: "/sermons" }] },
  { width: "w-[118px]", links: [{ label: "Events", href: "/events" }, { label: "Give", href: "/give" }, { label: "Transport", href: "/transport" }] },
]

const socials = [
  { label: "Instagram", href: "#" },
  { label: "X", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "YouTube", href: "#" },
]

// Mobile: 30px padding, 38px logo + 24px name, links centred at 16px, socials at 10px
// Desktop: 401 tall, logo/name left, links right, socials spread, 0.5px divider
export default function SiteFooter() {
  return (
    <footer className="flex w-full flex-col items-center gap-7 overflow-hidden bg-[#1d1c1c] p-[30px] lg:gap-[56px] lg:px-0 lg:py-[100px]">

      <div className="flex w-full max-w-[1385px] flex-col gap-8 py-[10px] lg:flex-row lg:items-start lg:justify-between lg:gap-10 lg:px-5 lg:py-0">
        <div className="flex items-center gap-[23px] px-5 py-[10px] lg:p-0">
          <Image src={logo} alt="RCF Unilorin PS logo" className="size-[38px] lg:size-[66px]" />
          <span className="cap-trim font-serif text-[24px] leading-[27px] tracking-[-0.02em] text-white lg:text-[42px]">
            RCF UNILORIN PS
          </span>
        </div>

        <nav className="flex justify-center gap-[33px] text-[16px] leading-[27px] tracking-[0.05em] text-white lg:justify-start lg:text-[18px]">
          {footerColumns.map((column, i) => (
            <ul key={i} className={`flex flex-col gap-5 text-center lg:text-left ${column.width}`}>
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="cap-trim block uppercase hover:text-[#00a8e8]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </nav>
      </div>

      <div className="flex w-full max-w-[1382px] justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-white lg:gap-6 lg:px-5 lg:text-[13px]">
        {socials.map((social) => (
          <Link key={social.label} href={social.href} className="hover:text-[#00a8e8]">
            {social.label}
          </Link>
        ))}
      </div>

      {/* Divider runs edge to edge (past the 30px padding on mobile) */}
      <div className="h-px w-[calc(100%+60px)] shrink-0 bg-[#d9d9d9] lg:h-[0.5px] lg:w-full" />
    </footer>
  )
}