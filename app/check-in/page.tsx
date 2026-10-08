import Image from "next/image"
import SiteNav from "@/components/site-nav"
import Marquee from "@/components/marquee"
import CheckInForm from "@/components/check-in-form"
import heroBg from "@/public/rcf-hero.png"

// Same photo treatment as the Give page: 71% black plus two fades
const heroOverlay =
    "linear-gradient(rgba(0,0,0,0.71), rgba(0,0,0,0.71)), linear-gradient(180deg, rgba(102,102,102,0.024) 0%, rgba(0,0,0,0.81) 100%), linear-gradient(0.25deg, rgba(102,102,102,0) 10.3%, rgba(0,0,0,0.38) 96.9%)"

export default function CheckInPage() {
    return (
        <main className="relative flex min-h-svh w-full flex-col overflow-hidden bg-[#1d1c1c]">

            {/* ===================== BACKGROUND ===================== */}
            <div aria-hidden className="absolute inset-0">
                <Image src={heroBg} alt="" fill priority sizes="100vw" className="object-cover object-bottom" />
                <div className="absolute inset-0" style={{ backgroundImage: heroOverlay }} />
            </div>

            {/* Nav floats over the image */}
            <SiteNav variant="transparent" />


            {/* ===================== CHECK-IN CARD ===================== */}
            {/* 150px from the top, 163px above the strip at 1440 x 1024; centred on taller screens */}
            <section className="relative flex flex-1 items-center justify-center px-5 pt-32 pb-16 lg:pt-[150px] lg:pb-[163px]">

                {/* Card — 607 x 648, white, 2px blue border, 45px corners */}
                <div className="flex w-full max-w-[607px] flex-col items-center justify-center rounded-[32px] border-2 border-[#00a8e8] bg-white px-5 py-14 sm:px-10 lg:h-[648px] lg:rounded-[45px] lg:py-0">

                    {/* Text — 431 wide */}
                    <div className="flex w-full max-w-[431px] flex-col items-center gap-6 text-center lg:min-h-[124px]">
                        <div className="flex flex-col items-center gap-5">
                            <p className="cap-trim text-[15px] leading-[27px] font-semibold tracking-[0.25em] text-[#00a8e8] [font-variation-settings:'opsz'_32]">
                                RCF UNILORIN
                            </p>
                            <h1 className="cap-trim font-serif text-[34px] font-semibold text-[#1c1c1c] sm:text-[42px]">
                                Service Check-In
                            </h1>
                        </div>
                        <p className="cap-trim text-base leading-[26px] tracking-[0.05em] text-[#1c1c1c] lg:text-[18px] lg:leading-[27px]">
                            Enter the code shared during today&apos;s service to be counted in attendance.
                        </p>
                    </div>

                    {/* Code boxes + submit (53px below the text) */}
                    <CheckInForm />

                </div>
            </section>


            {/* ===================== BLUE STRIP ===================== */}
            <Marquee className="relative bg-[#00a8e8] text-[#1c1c1c]" />

        </main>
    )
}