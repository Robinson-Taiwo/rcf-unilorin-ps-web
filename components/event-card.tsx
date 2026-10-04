import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import React from 'react'
import { ChevronRight } from 'lucide-react'

export type EventCardProps = {
  image: StaticImageData
  date: string
  title: string
  detailsUrl: string
}

const EventCard = ({ image, date, title, detailsUrl }: EventCardProps) => {
  return (
    <article className="event-card flex flex-col gap-3">

      <div className="relative w-full h-[595px] w-[682px] aspect-square rounded-xl overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />

        {/* View details pill — bottom left over the image */}
        <Link
          href={detailsUrl}
          className="absolute bottom-3 left-3 md:bottom-4 md:left-4 flex items-center gap-1 bg-white/90 text-black text-[11px] font-medium tracking-wide px-3 py-2 rounded-md hover:bg-white transition-colors"
        >
          VIEW DETAILS
          <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-black text-xs">{date}</p>
        <h3 className="font-serif text-black text-2xl md:text-[26px] leading-tight">{title}</h3>
      </div>

    </article>
  )
}

export default EventCard
