import Link from "next/link"
import { Timer } from "lucide-react"
import { Pill, button, revealDelay, type } from "@/components/rcf/Ui"

// Mobile and desktop frames name the services differently
const services = [
  { mobile: "Sunday - Encounter Service", desktop: "Sunday Service", time: "7:20AM WAT" },
  { mobile: "Tuesday - Bible Study", desktop: "Tuesday Bible Study", time: "6:15PM WAT" },
  { mobile: "Thursday - Prayer Meeting", desktop: "Thursday Prayer Meeting", time: "6:15PM WAT" },
]

// "Visit us" block, same on every page. Wrap it in the page container; it fills the column.
// Phones (mobile frame): "SERVICE TIME" pill, "WE SAVED YOU A SEAT!", centred, no outline, no button.
// Desktop (desktop frame): outlined card — "VISIT US" pill, heading, text and button left; service times right.
export default function VisitCard() {
  return (
    <div
      data-reveal
      className="flex w-full flex-col items-center gap-7 text-center lg:items-start lg:gap-8 lg:rounded-[28px] lg:border lg:border-[#8a8d93]/60 lg:p-12 lg:text-left"
    >
      <Pill tone="dark" mobileTone="blue">
        <span className="lg:hidden">Service time</span>
        <span className="hidden lg:inline">Visit us</span>
      </Pill>

      <div className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">

        <div className="flex max-w-[480px] flex-col items-center gap-6 lg:items-start lg:gap-8">
          <div className="flex flex-col items-center gap-6 lg:items-start lg:gap-5">
            <h2 className={`${type.heading} max-w-[260px] text-[#1c1c1c] lg:max-w-none`}>
              <span className="lg:hidden">WE SAVED YOU A SEAT!</span>
              <span className="hidden lg:inline">We saved you a seat</span>
            </h2>
            <p className={`${type.body} text-[#242323]/75`}>
              Pull up<span className="lg:hidden">!</span>
              <span className="hidden lg:inline">.</span> You&apos;re most welcome.
              <br />
              Come find your people, grow in faith, and experience genuine community.
            </p>
          </div>

          <div className="hidden lg:block">
            <Link href="/about" className={button.primary}>Plan your visit</Link>
          </div>
        </div>

        <ul className="flex w-full flex-col items-center gap-6 lg:w-[320px] lg:shrink-0 lg:items-start lg:gap-0 lg:divide-y lg:divide-[#8a8d93]/40">
          {services.map((service, i) => (
            <li
              key={service.desktop}
              data-reveal
              style={revealDelay(150 + i * 110)}
              className="flex flex-col items-center gap-3 lg:w-full lg:items-start lg:py-5 lg:first:pt-0 lg:last:pb-0"
            >
              <h3 className="cap-trim text-[17px] leading-tight font-medium tracking-[-0.02em] text-[#1c1c1c] lg:text-subheading">
                <span className="lg:hidden">{service.mobile}</span>
                <span className="hidden lg:inline">{service.desktop}</span>
              </h3>
              <p className="flex items-center gap-2 text-sm leading-none text-[#242323]/80">
                <Timer className="size-[18px] shrink-0 lg:size-4 lg:text-[#00a8e8]" strokeWidth={1.75} />
                {service.time}
              </p>
            </li>
          ))}
        </ul>

      </div>
    </div>
  )
}
