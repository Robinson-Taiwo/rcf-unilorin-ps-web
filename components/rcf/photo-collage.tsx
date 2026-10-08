import Image, { type StaticImageData } from "next/image"

import raisedHands from "@/public/images/raised-hands-1.png"
import holyHoly from "@/public/images/holy-holy.png"
import bwHands from "@/public/images/bw-hands.png"
import prayerCenter from "@/public/images/prayer-center.png"
import crowdHands from "@/public/images/crowd-hands.png"
import prayerBack from "@/public/images/prayer-back.png"
import sanctuary from "@/public/images/sanctuary.png"

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
function Tile({ src, alt, w, h, r = 25 }: { src: StaticImageData; alt: string; w: number; h: number; r?: number }) {
    return (
        <div
            className="relative shrink-0 overflow-hidden bg-[#d9d9d9]"
            style={{ width: `calc(${w}px * var(--s))`, height: `calc(${h}px * var(--s))`, borderRadius: `calc(${r}px * var(--s))` }}
        >
            <Image src={src} alt={alt} fill sizes={`${w}px`} className="object-cover" />
        </div>
    )
}

// 1833px wide at desktop, centred, outer images cut off by the screen edge.
// Tiles are vertically centred with 7px gaps. The parent must have overflow-hidden.
export default function PhotoCollage() {
    return (
        <div className="flex w-full justify-center">
            <div className="flex items-center gap-[calc(7px*var(--s))] [--s:0.25] md:[--s:0.6] lg:[--s:1]">        <Tile {...collage.farLeft} w={327} h={543} />

                <div className="flex shrink-0 flex-col gap-[calc(9px*var(--s))]">
                    <Tile {...collage.leftTop} w={327} h={355} />
                    <Tile {...collage.leftBottom} w={327} h={475} />
                </div>

                <Tile {...collage.center} w={498} h={1013} r={30} />

                <div className="flex shrink-0 flex-col gap-[calc(9px*var(--s))]">
                    <Tile {...collage.rightTop} w={327} h={470} />
                    <Tile {...collage.rightBottom} w={327} h={355} />
                </div>

                <Tile {...collage.farRight} w={327} h={543} />
            </div>
        </div>
    )
}