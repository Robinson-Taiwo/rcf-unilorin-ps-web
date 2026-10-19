import Image from "next/image"
import SiteNav from "@/components/site-nav"
import SiteFooter from "@/components/site-footer"
import Marquee from "@/components/marquee"
import CheckInForm from "@/components/check-in-form"
import { type } from "@/components/rcf/Ui"
import heroBg from "@/public/rcf-hero.png"

// Same photo treatment as the Give page: 71% black plus two fades
const heroOverlay =
  "linear-gradient(rgba(0,0,0,0.71), rgba(0,0,0,0.71)), linear-gradient(180deg, rgba(102,102,102,0.024) 0%, rgba(0,0,0,0.81) 100%), linear-gradient(0.25deg, rgba(102,102,102,0) 10.3%, rgba(0,0,0,0.38) 96.9%)"

export default function CheckInPage() {
  return (
    <main className="w-full overflow-x-clip bg-[#1d1c1c]">

      {/* ===================== CHECK-IN — one screen: photo, card, blue strip ===================== */}
      <div className="relative flex min-h-svh w-full flex-col overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          <Image src={heroBg} alt="" fill priority sizes="100vw" className="animate-hero-zoom object-cover object-bottom" />
          <div className="absolute inset-0" style={{ backgroundImage: heroOverlay }} />
        </div>

        <SiteNav variant="transparent" />

        <section className="relative flex flex-1 items-center justify-center px-6 pt-24 pb-14">
          {/* White card with a 2px blue border (Figma 607 x 648) */}
          <div className="flex w-full max-w-[480px] animate-fade-up flex-col items-center rounded-[28px] border-2 border-[#00a8e8] bg-white px-6 py-10 text-center shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] [animation-delay:200ms] sm:px-10 sm:py-12">
            <p className="text-[12px] leading-none font-semibold tracking-[0.25em] text-[#00a8e8]">RCF UNILORIN</p>
            <h1 className={`${type.heading} mt-4 text-[#1c1c1c]`}>Service Check-In</h1>
            <p className={`${type.body} mt-4 max-w-[360px] text-[#1c1c1c]/75`}>
              Enter the code shared during today&apos;s service to be counted in attendance.
            </p>
            <CheckInForm />
          </div>
        </section>

        <Marquee className="relative bg-[#00a8e8] text-[#1c1c1c]" />
      </div>


      <SiteFooter />

    </main>
  )
}
