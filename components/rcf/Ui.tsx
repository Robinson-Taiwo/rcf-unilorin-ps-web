import type { ReactNode } from "react"

// Body text — mobile: Inter 16 / 1.3 / −2%, desktop: Inter 18 / 27px / 5%
export const body =
  "text-base leading-[1.3] tracking-[-0.02em] lg:text-[18px] lg:leading-[27px] lg:tracking-[0.05em]"

// Desktop 58px button base (add width, colours and weight per button)
export const cta = "h-[58px] shrink-0 rounded-[10px] text-[18px] leading-[27px] tracking-[0.05em]"

// Mobile section titles — Fraunces SemiBold 36 / 1.2 / −4%
export const mobileTitle = "font-serif text-[36px] leading-[1.2] font-semibold tracking-[-0.04em]"

// Mobile navy button (40 tall, 5px corners) that becomes a 58px button at lg.
// Add the desktop width and colours per button.
export const responsiveCta =
  "inline-flex h-10 shrink-0 items-center justify-center rounded-[5px] bg-[#18306e] px-[10px] text-[14px] leading-[27px] font-medium tracking-[0.05em] text-[#d9d9d9] hover:bg-[#18306e]/90 lg:h-[58px] lg:rounded-[10px] lg:px-0 lg:text-[18px]"

const mobileSizes = {
  10: "text-[10px] tracking-[0.05em]",
  12: "text-[12px] tracking-[0.05em]",
  13: "text-[13px] tracking-[0.1em]",
}

// Pill label above sections. Desktop is always 13px / 10% spacing; mobile size varies per section.
export function Eyebrow({
  children,
  width,
  tone = "dark",
  tall = false,
  thin = false,
  mobileSize = 13,
}: {
  children: ReactNode
  width: string
  tone?: "dark" | "light" | "blue"
  tall?: boolean
  thin?: boolean
  mobileSize?: 10 | 12 | 13
}) {
  const colors = {
    dark: "border-[#1c1c1c] text-[#1c1c1c]",
    light: "border-[#d9d9d9] text-[#d9d9d9]",
    blue: "bg-[#00a8e8] text-[#1c1c1c]",
  }[tone]
  const border = tone === "blue" ? "" : thin ? "border-[0.5px] border-solid" : "border-[0.5px] border-solid lg:border"

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[26px] font-medium uppercase lg:text-[13px] lg:tracking-[0.1em] ${mobileSizes[mobileSize]} ${tall ? "h-[38px] lg:h-10" : "h-[38px]"} ${border} ${colors} ${width}`}
    >
      {children}
    </span>
  )
}