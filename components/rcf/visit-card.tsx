import { Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow, body } from "@/components/rcf/Ui"

const services = [
    { name: "Sunday Service", time: "7:20AM WAT" },
    { name: "Tuesday Bible Study", time: "6:15PM WAT" },
    { name: "Thursday Prayer Meeting", time: "6:15PM WAT" },
]

// Card is 1297 wide at desktop. The page decides the spacing around it.
export default function VisitCard() {
    return (
        <div className="mx-auto flex w-full max-w-[1297px] flex-col gap-8 rounded-[32px] border border-[#8a8d93] px-6 py-10 lg:gap-[45px] lg:rounded-[55px] lg:px-[44px] lg:py-[56px]">
            <Eyebrow width="w-[133px]">Visit us</Eyebrow>

            <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">

                {/* Left — 572 wide */}
                <div className="flex flex-col items-start gap-[33px] lg:w-[572px]">
                    <div className="flex flex-col gap-[15px]">
                        <h2 className="cap-trim font-serif text-[40px] font-semibold text-[#1c1c1c] lg:min-h-16 lg:text-[65px]">
                            We saved you a seat
                        </h2>
                        <p className={`cap-trim text-[#242323]/60 lg:min-h-[94px] ${body}`}>
                            Pull up. You&apos;re most welcome.
                            <br />
                            Come find your people, grow in faith, and experience genuine community.
                        </p>
                    </div>

                    <Button className="h-[58px] w-[218px] rounded-[10px] bg-[#00a8e8] text-[18px] leading-[27px] font-normal tracking-[0.05em] text-[#18306e] hover:bg-[#00a8e8]/90">
                        PLAN YOUR VISIT
                    </Button>
                </div>

                {/* Right — 362 wide */}
                <ul className="flex flex-col gap-[39px] lg:w-[362px]">
                    {services.map((service) => (
                        <li key={service.name} className="flex flex-col gap-[19px]">
                            <h3 className="cap-trim text-2xl font-medium text-[#1c1c1c] lg:text-[32px]">{service.name}</h3>
                            <p className={`flex items-center gap-[10px] text-[#1c1c1c] ${body}`}>
                                <Timer className="size-6 shrink-0" strokeWidth={1.5} />
                                <span>{service.time}</span>
                            </p>
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    )
}