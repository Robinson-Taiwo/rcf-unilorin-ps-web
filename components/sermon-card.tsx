import Image, { type StaticImageData } from "next/image"
import { Download } from "lucide-react"

export type SermonCardProps = {
  image: StaticImageData | string
  duration: string
  title: string
  date: string
  audioUrl: string
  // Desktop size: "lg" = landing (589 x 617), "md" = Sermons page (421 x 440)
  size?: "lg" | "md"
}

const sizes = {
  lg: { image: "lg:aspect-[589/617]", pill: "lg:bottom-[37px] lg:left-5", title: "lg:text-[37px]", sizes: "(min-width: 1024px) 589px, (min-width: 768px) 50vw, 100vw" },
  md: { image: "lg:aspect-[421/440]", pill: "lg:bottom-[19px] lg:left-4", title: "lg:text-[28px]", sizes: "(min-width: 1024px) 421px, (min-width: 768px) 50vw, 100vw" },
}

// Mobile: 300 x 270 image (10px corners, 20% overlay), then title, date, blue download button
// Desktop: square-cornered image with 40% overlay + duration pill, title, then download pill | date
export default function SermonCard({ image, duration, title, date, audioUrl, size = "lg" }: SermonCardProps) {
  const s = sizes[size]

  return (
    <article className="flex flex-col gap-3 lg:gap-[28px]">

      <div className={`relative aspect-[300/270] w-full overflow-hidden rounded-[10px] lg:rounded-none ${s.image}`}>
        <Image src={image} alt={title} fill sizes={s.sizes} className="object-cover object-top" />
        <div className="absolute inset-0 bg-black/20 lg:bg-black/40" />
        <span
          className={`absolute hidden h-[31px] w-[124px] items-center justify-center rounded-[20px] bg-[#d9d9d9] text-[10px] font-bold uppercase tracking-[0.1em] text-[#1c1c1c] lg:flex ${s.pill}`}
        >
          {duration}
        </span>
      </div>

      <div className="flex flex-col items-start gap-3 lg:gap-[31px]">
        <h3 className={`cap-trim font-serif text-[18px] font-bold tracking-[-0.02em] text-[#1c1c1c] lg:font-semibold lg:tracking-normal ${s.title}`}>
          {title}
        </h3>

        {/* Mobile: date above button. Desktop: button left, date right */}
        <div className="flex w-full flex-col items-start gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
          <span className="text-[10px] leading-none font-medium uppercase tracking-[-0.02em] text-[#1c1c1c]/75 lg:order-2 lg:text-[14px] lg:font-bold lg:tracking-normal lg:text-[#1c1c1c]">
            {date}
          </span>
          <a
            href={audioUrl}
            download
            className="flex shrink-0 items-center justify-center gap-[2px] rounded-[3px] bg-[#00a8e8] p-[5px] text-[10px] leading-[1.2] uppercase tracking-[-0.03em] text-[#18306e] hover:bg-[#00a8e8]/90 lg:order-1 lg:h-9 lg:w-[157px] lg:rounded-[20px] lg:bg-[#1d1c1c] lg:p-0 lg:font-medium lg:tracking-normal lg:text-[#d9d9d9] lg:hover:bg-black"
          >
            <Download className="size-4 lg:size-[13px]" />
            Download audio
          </a>
        </div>
      </div>

    </article>
  )
}