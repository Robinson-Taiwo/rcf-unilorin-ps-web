import Image from "next/image"
import Link from "next/link"
import logo from "@/public/Images/rcf-logo.png"
import menu from "@/public/icons/hamburger.svg"

// Mobile: 30px side padding, 44px logo, 24px menu button
// Desktop: 35px side padding, 66px logo, 44px menu button
export default function SiteNav({ variant = "solid" }: { variant?: "solid" | "transparent" }) {
  const styles =
    variant === "solid"
      ? "sticky top-0 z-50 h-16 bg-[#1d1c1c] lg:h-[100px]"
      : "absolute inset-x-0 top-0 z-50 py-[10px] lg:py-0 lg:pt-[36px]"

  return (
    <header className={`flex w-full items-center justify-between px-[30px] lg:px-[35px] ${styles}`}>
      <Link href="/">
        <Image src={logo} alt="RCF Unilorin PS logo" priority className="size-11 lg:size-[66px]" />
      </Link>
      <button type="button" aria-label="Open menu" className="flex size-6 cursor-pointer items-center justify-center lg:size-11">
        <Image src={menu} alt="" className="h-[9px] w-[18px] lg:h-[16.5px] lg:w-[33px]" />
      </button>
    </header>
  )
}