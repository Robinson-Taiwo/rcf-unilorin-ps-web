import type { ReactNode } from "react"
import Image, { type StaticImageData } from "next/image"

import raisedHands from "@/public/raised-hands-1.png"
import holyHoly from "@/public/holy-holy.png"
import bwHands from "@/public/bw-hands.png"
import prayerCenter from "@/public/prayer-center.png"
import crowdHands from "@/public/crowd-hands.png"
import prayerBack from "@/public/prayer-back.png"
import sanctuary from "@/public/sanctuary.png"

const collage = {
    farLeft: { src: raisedHands, alt: "Worship" },
    leftTop: { src: holyHoly, alt: "Holy Holy worship night" },
    leftBottom: { src: bwHands, alt: "Worship in black and white" },
    center: { src: prayerCenter, alt: "Students praying" },
    rightTop: { src: crowdHands, alt: "Congregation worshipping" },
    rightBottom: { src: prayerBack, alt: "Back view of a prayer shirt" },
    farRight: { src: sanctuary, alt: "Sanctuary" },
}

// Figma pixel sizes multiplied by --s, so the whole collage scales together
function Tile({ src, alt, w, h, r = 25, d = 0, children }: { src: StaticImageData; alt: string; w: number; h: number; r?: number; d?: number; children?: ReactNode }) {
    return (
        <div
            data-reveal="scale"
            className="group relative shrink-0 overflow-hidden bg-[#d9d9d9]"
            style={{ width: `calc(${w}px * var(--s))`, height: `calc(${h}px * var(--s))`, borderRadius: `calc(${r}px * var(--s))`, ["--reveal-delay" as string]: `${d}ms` }}
        >
            <Image src={src} alt={alt} fill sizes={`${w}px`} className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-105" />
            {children}
        </div>
    )
}

// Figma is 1833px wide at scale 1. Desktop uses 0.5–0.6 so the collage is ~500–610px tall
// instead of 1013px; outer images are still cut off by the screen edge.
// Tiles are vertically centred with 7px gaps. The parent must have overflow-hidden.
export default function PhotoCollage() {
    return (
        <div className="flex w-full justify-center">
            <div className="flex items-center gap-[calc(7px*var(--s))] [--s:0.25] sm:[--s:0.34] md:[--s:0.42] lg:[--s:0.5] xl:[--s:0.56] 2xl:[--s:0.6]">
                <Tile {...collage.farLeft} w={327} h={543} d={240} />

                <div className="flex shrink-0 flex-col gap-[calc(9px*var(--s))]">
                    <Tile {...collage.leftTop} w={327} h={355} d={120} />
                    <Tile {...collage.leftBottom} w={327} h={475} d={160} />
                </div>

                {/* Figma: a large "Faith" word (445 x 162) centred on the middle photo */}
                <Tile {...collage.center} w={498} h={1013} r={30}>
                    <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 flex items-center justify-center font-serif leading-none tracking-[-0.03em] text-white"
                        style={{ fontSize: "calc(135px * var(--s))" }}
                    >
                        Faith
                    </span>
                </Tile>

                <div className="flex shrink-0 flex-col gap-[calc(9px*var(--s))]">
                    <Tile {...collage.rightTop} w={327} h={470} d={120} />
                    <Tile {...collage.rightBottom} w={327} h={355} d={160} />
                </div>

                <Tile {...collage.farRight} w={327} h={543} d={240} />
            </div>
        </div>
    )
}