import Image, { StaticImageData } from 'next/image'
import React from 'react'
import { Download } from 'lucide-react'

export type SermonCardProps = {
  image: StaticImageData
  duration: string
  title: string
  date: string
  audioUrl: string
}

const SermonCard = ({ image, duration, title, date, audioUrl }: SermonCardProps) => {
  return (
    <article className="sermon-card flex flex-col gap-4">

      <div className="relative w-full aspect-[217/227] rounded-md overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          className="object-cover"
        />

        {/* Duration pill — bottom left over the image */}
        <span className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-white/90 text-black text-[10px] md:text-[11px] font-semibold tracking-wide px-3 py-1.5 rounded-full">
          {duration}
        </span>
      </div>

      <h3 className="font-serif text-black text-xl md:text-2xl leading-tight">{title}</h3>

      <div className="flex items-center justify-between gap-3">
        {/* Plain link with the download attribute — no client JS needed */}
        <a
          href={audioUrl}
          download
          className="flex items-center gap-2 bg-[#1c1c1c] text-white text-[10px] md:text-[11px] font-semibold tracking-wide px-4 py-2.5 rounded-full hover:bg-black transition-colors whitespace-nowrap"
        >
          <Download size={12} />
          DOWNLOAD AUDIO
        </a>

        <span className="text-black text-[10px] md:text-xs font-semibold tracking-wide whitespace-nowrap">
          {date}
        </span>
      </div>

    </article>
  )
}

export default SermonCard
