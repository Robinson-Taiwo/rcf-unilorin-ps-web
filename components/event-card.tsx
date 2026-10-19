import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { chip } from "@/components/rcf/Ui"

type EventCardProps = {
  image: StaticImageData | string
  date: string        // desktop date text
  shortDate?: string  // phone date text (mobile frames use a shorter date)
  title: string
  detailsUrl: string
  align?: "start" | "center" // phones only: the "see more" carousel on event details is centred
}

// Phones (mobile frame): 300 x 270 poster, title, short date, small blue "View details" tag.
// Desktop (desktop frame): poster (590 x 595) with a "View details" pill on it, then date and title.
export default function EventCard({ image, date, shortDate, title, detailsUrl, align = "start" }: EventCardProps) {
  const center = align === "center" ? "max-lg:items-center max-lg:text-center" : ""

  return (
    <article className="group flex flex-col gap-3 lg:gap-4">
      <div className="relative aspect-[10/9] w-full overflow-hidden rounded-[10px] bg-[#1d1c1c] lg:aspect-[590/595] lg:rounded-[14px]">
        <Image src={image} alt={title} fill sizes="(min-width: 1280px) 590px, (min-width: 768px) 50vw, 100vw" className="object-cover object-[center_9%] transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.05]" />
        <div aria-hidden className="absolute inset-0 hidden bg-linear-to-t from-black/45 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100 lg:block" />
        <Link href={detailsUrl} className={`${chip} absolute bottom-4 left-4 hidden bg-[#d9d9d9] pr-3 text-[#1c1c1c] hover:bg-white lg:inline-flex`}>
          View details
          <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2} />
        </Link>
      </div>

      <div className={`flex flex-col items-start gap-3 text-[#1c1c1c] lg:gap-2.5 ${center}`}>
        <p className="cap-trim order-2 text-[11px] leading-none font-medium uppercase tracking-[0.02em] text-[#1c1c1c]/75 lg:order-1 lg:text-[13px] lg:normal-case lg:tracking-normal lg:text-[#1c1c1c]/70">
          <span className="lg:hidden">{shortDate ?? date}</span>
          <span className="hidden lg:inline">{date}</span>
        </p>
        <h3 className="cap-trim order-1 font-serif text-[18px] leading-[1.25] font-bold tracking-[-0.02em] lg:order-2 lg:text-subheading lg:font-normal">
          <Link href={detailsUrl} className="transition-colors hover:text-[#18306e]">{title}</Link>
        </h3>
        <Link href={detailsUrl} className={`${chip} order-3 bg-[#00a8e8] pr-1.5 text-[#18306e] hover:bg-[#2bbbf0] lg:hidden`}>
          View details
          <ChevronRight className="size-4" strokeWidth={2} />
        </Link>
      </div>
    </article>
  )
}
