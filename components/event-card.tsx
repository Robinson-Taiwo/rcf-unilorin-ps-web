import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

type EventCardProps = {
  image: StaticImageData | string
  date: string
  title: string
  detailsUrl: string
}

// Mobile: 300 x 270 image, then title, date, small blue "View details" button
// Desktop: 590 x 595 image with the pill on it, then date, title
export default function EventCard({ image, date, title, detailsUrl }: EventCardProps) {
  return (
    <article className="flex flex-col gap-3 lg:gap-[26px]">

      <div className="relative aspect-[300/270] w-full overflow-hidden rounded-[10px] lg:aspect-[590/595]">
        <Image src={image} alt={title} fill sizes="(min-width: 1024px) 590px, (min-width: 768px) 50vw, 100vw" className="object-cover object-[center_9%]" />
        <Link
          href={detailsUrl}
          className="absolute bottom-[30px] left-[22px] hidden h-11 w-[177px] items-center justify-center gap-[3px] rounded-[10px] bg-[#d9d9d9] text-[18px] leading-[27px] uppercase tracking-[0.01em] text-[#1c1c1c] hover:bg-white lg:flex"
        >
          View details
          <ChevronRight className="size-6" strokeWidth={1.5} />
        </Link>
      </div>

      <div className="flex max-w-[539px] flex-col items-start gap-3 text-[#1c1c1c] lg:gap-[25px]">
        <p className="cap-trim order-2 text-[10px] leading-none font-medium uppercase tracking-[-0.02em] opacity-75 lg:order-1 lg:text-[18px] lg:leading-[27px] lg:tracking-[0.05em] lg:normal-case lg:opacity-100">
          {date}
        </p>
        <h3 className="cap-trim order-1 font-serif text-[18px] font-bold tracking-[-0.02em] lg:order-2 lg:text-[36px] lg:font-normal lg:tracking-normal">
          {title}
        </h3>
        <Link
          href={detailsUrl}
          className="order-3 flex items-center gap-[2px] rounded-[3px] bg-[#00a8e8] p-[5px] text-[10px] leading-[1.2] uppercase tracking-[-0.03em] text-[#18306e] hover:bg-[#00a8e8]/90 lg:hidden"
        >
          View details
          <ChevronRight className="size-[18px]" strokeWidth={1.5} />
        </Link>
      </div>

    </article>
  )
}