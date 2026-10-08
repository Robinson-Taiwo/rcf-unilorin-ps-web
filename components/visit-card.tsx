import { Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { body, mobileTitle } from "@/components/rcf/Ui"

const services = [
  { name: "Sunday Service", time: "7:20AM WAT" },
  { name: "Tuesday Bible Study", time: "6:15PM WAT" },
  { name: "Thursday Prayer Meeting", time: "6:15PM WAT" },
]

// Mobile: centred, no card border, 30px padding, no button
// Desktop: 1297-wide outlined card, two columns
export default function VisitCard() {
  return (
    <div className="mx-auto flex w-full max-w-[1297px] flex-col items-center gap-8 p-[30px] text-center lg:items-start lg:gap-[45px] lg:rounded-[55px] lg:border lg:border-[#8a8d93] lg:px-[44px] lg:py-[56px] lg:text-left">

      <span className="inline-flex h-[38px] w-[155px] items-center justify-center rounded-[26px] border-[0.5px] border-[#00a8e8] text-[12px] font-medium uppercase tracking-[0.05em] text-[#1c1c1c] lg:w-[133px] lg:border lg:border-[#1c1c1c] lg:text-[13px] lg:tracking-[0.1em]">
        <span className="lg:hidden">Service time</span>
        <span className="hidden lg:inline">Visit us</span>
      </span>

      <div className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">

        <div className="flex flex-col items-center gap-[33px] lg:w-[572px] lg:items-start">
          <div className="flex flex-col items-center gap-6 lg:items-start lg:gap-[15px]">
            <h2 className={`cap-trim max-w-[226px] uppercase text-[#1c1c1c] ${mobileTitle} lg:min-h-16 lg:max-w-none lg:text-[65px] lg:tracking-normal lg:normal-case`}>
              We saved you a seat
            </h2>
            <p className={`cap-trim text-[#1c1c1c]/75 lg:min-h-[94px] lg:text-[#242323]/60 ${body}`}>
              Pull up. You&apos;re most welcome.
              <br />
              Come find your people, grow in faith, and experience genuine community.
            </p>
          </div>

          <Button className="hidden h-[58px] w-[218px] rounded-[10px] bg-[#00a8e8] text-[18px] leading-[27px] font-normal tracking-[0.05em] text-[#18306e] hover:bg-[#00a8e8]/90 lg:flex">
            PLAN YOUR VISIT
          </Button>
        </div>

        <ul className="flex flex-col items-center gap-6 lg:w-[362px] lg:items-start lg:gap-[39px]">
          {services.map((service) => (
            <li key={service.name} className="flex flex-col items-center gap-[19px] lg:items-start">
              <h3 className="cap-trim text-[18px] leading-[1.2] font-medium tracking-[-0.03em] text-[#1c1c1c] lg:text-[32px] lg:tracking-normal">
                {service.name}
              </h3>
              <p className="flex items-center gap-[10px] text-[14px] leading-none tracking-[0.05em] text-[#1c1c1c] opacity-75 lg:text-[18px] lg:leading-[27px] lg:opacity-100">
                <Timer className="size-[18px] shrink-0 lg:size-6" strokeWidth={1.5} />
                <span>{service.time}</span>
              </p>
            </li>
          ))}
        </ul>

      </div>
    </div>
  )
}