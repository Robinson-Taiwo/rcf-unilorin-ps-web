import Image, { type StaticImageData } from "next/image"
import { Download } from "lucide-react"
import { chip } from "@/components/rcf/Ui"

export type SermonCardProps = {
  image: StaticImageData | string
  duration: string
  title: string
  date: string
  audioUrl: string
  // Desktop image shape: "lg" = landing page (Figma 589 x 617), "md" = Sermons page (Figma 421 x 440)
  size?: "lg" | "md"
}

const sizes = {
  lg: { image: "lg:aspect-[589/617]", sizes: "(min-width: 1280px) 590px, (min-width: 768px) 50vw, 100vw" },
  md: { image: "lg:aspect-[421/440]", sizes: "(min-width: 1280px) 384px, (min-width: 640px) 50vw, 100vw" },
}

// Phones (mobile frame): 300 x 270 poster, title, date, small blue "Download audio" tag.
// Desktop (desktop frame): poster with a duration pill, title, then a dark download pill with the date on the right.
export default function SermonCard({ image, duration, title, date, audioUrl, size = "lg" }: SermonCardProps) {
  const s = sizes[size]

  return (
    <article className="group flex flex-col gap-3 lg:gap-4">
      <div className={`relative aspect-[10/9] w-full overflow-hidden rounded-[10px] bg-[#1d1c1c] lg:rounded-[14px] ${s.image}`}>
        <Image src={image} alt={title} fill sizes={s.sizes} className="object-cover object-top transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.05]" />
        <div className="absolute inset-0 bg-black/20 transition-colors duration-500 lg:bg-black/35 lg:group-hover:bg-black/20" />
        <span className="absolute bottom-4 left-4 hidden h-7 items-center rounded-full bg-[#d9d9d9] px-3 text-[10px] leading-none font-bold uppercase tracking-[0.1em] text-[#1c1c1c] lg:inline-flex">
          {duration}
        </span>
      </div>

      <h3 className="cap-trim font-serif text-[18px] leading-[1.25] font-bold tracking-[-0.02em] text-[#1c1c1c] lg:text-subheading lg:font-semibold">
        {title}
      </h3>

      {/* Phones: date above the tag. Desktop: download pill left, date right. */}
      <div className="flex flex-col items-start gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-3 lg:gap-y-2">
        <span className="text-[11px] leading-none font-medium uppercase tracking-[0.02em] text-[#1c1c1c]/75 lg:order-2 lg:text-[13px] lg:normal-case lg:tracking-normal lg:text-[#1c1c1c]/70">
          {date}
        </span>
        <a
          href={audioUrl}
          download
          className={`${chip} bg-[#00a8e8] text-[#18306e] hover:bg-[#2bbbf0] lg:order-1 lg:bg-[#1d1c1c] lg:text-[#d9d9d9] lg:hover:bg-[#00a8e8] lg:hover:text-[#18306e]`}
        >
          <Download className="size-3.5" />
          Download audio
        </a>
      </div>
    </article>
  )
}
