import Image from "next/image"
import Link from "next/link"
import logo from "@/public/rcf-logo.png"

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

// 401px tall at desktop: 100px above, 56px gaps, divider, 100px below
export default function SiteFooter() {
  return (
    <footer className="flex w-full flex-col items-center gap-[56px] bg-[#1d1c1c] py-16 lg:py-[100px]">

      <div className="flex w-full max-w-[1385px] flex-col gap-10 px-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-[23px]">
          <Image src={logo} alt="RCF Unilorin PS logo" className="size-12 lg:size-[66px]" />
          <span className="cap-trim font-serif text-[28px] leading-[27px] tracking-[-0.02em] text-white lg:text-[42px]">
            RCF UNILORIN PS
          </span>
        </div>

        <nav className="flex gap-[33px] text-[18px] leading-[27px] tracking-[0.05em] text-white">
          {footerColumns.map((column, i) => (
            <ul key={i} className={`flex flex-col gap-5 ${column.width}`}>
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

      <div className="flex w-full max-w-[1382px] flex-wrap justify-between gap-6 px-5 text-[13px] font-semibold uppercase tracking-[0.1em] text-white">
        {socials.map((social) => (
          <Link key={social.label} href={social.href} className="hover:text-[#00a8e8]">
            {social.label}
          </Link>
        ))}
      </div>

      <div className="h-[0.5px] w-full bg-[#d9d9d9]" />
    </footer>
  )
}