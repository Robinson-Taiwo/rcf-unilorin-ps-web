import type { CSSProperties, ReactNode } from "react"

/* =====================================================================
   RCF UI — the one set of styles every page uses.
   Look, labels and layout follow the Figma frames: the 360px mobile frames
   below 1024px, the 1440px desktop frames from 1024px (`lg:`).
   Sizes are normalised to a standard web scale (tokens in globals.css).
   ===================================================================== */

// Stagger for data-reveal elements: style={revealDelay(i * 90)}
export const revealDelay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties

/* ---------- Layout ---------- */

// Page column. Phones: 30px side margins (as in the mobile frames). Desktop: 1200px content, 40px gutters.
export const container = "mx-auto w-full max-w-shell px-[30px] sm:px-8 lg:px-10"

// Section padding: 40px top/bottom on phones (Figma 30), ~80–90px on desktop
export const sectionY = "py-10 lg:py-section"

// Space between a section's label, heading, text and content: 28px on phones (Figma 32), 24px on desktop
export const stack = "gap-7 lg:gap-6"

/* ---------- Type ---------- */
// Phones: Fraunces SemiBold headings (mobile frames). Desktop: Fraunces Regular (desktop frames).
// The case comes from the text itself — write it in capitals where the design does.

export const type = {
  display: "cap-trim font-serif text-display uppercase max-lg:font-semibold",
  // Page titles: Regular by default; add `max-lg:font-semibold` on pages whose mobile frame uses SemiBold
  title: "cap-trim font-serif text-title",
  heading: "cap-trim font-serif text-heading max-lg:font-semibold max-lg:tracking-[-0.035em]",
  subheading: "cap-trim text-subheading font-medium tracking-[-0.01em]",
  lead: "cap-trim font-serif text-lead tracking-[-0.005em]",
  body: "cap-trim text-[15px] leading-[1.6] lg:text-base lg:leading-[1.65]",
  small: "cap-trim text-sm leading-[1.6]",
}

// Kept for older imports — same as type.body
export const body = type.body

/* ---------- Buttons ---------- */
// 40px on phones (Figma 40), 44px on desktop (Figma 58). Uppercase label, lift + soft shadow on hover.

const buttonBase =
  "inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[8px] px-5 text-[13px] leading-none font-semibold uppercase tracking-[0.06em] transition-[translate,background-color,box-shadow,color,border-color,opacity] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-14px_rgba(0,0,0,0.55)] active:translate-y-0 active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a8e8] disabled:pointer-events-none disabled:opacity-50 lg:h-11 lg:rounded-[10px] lg:px-6"

export const button = {
  // Blue — the main action
  primary: `${buttonBase} bg-[#00a8e8] text-[#18306e] hover:bg-[#2bbbf0]`,
  // Near-black — on blue sections and secondary actions (desktop)
  dark: `${buttonBase} bg-[#1d1c1c] text-white hover:bg-black`,
  // Navy — the "see more" buttons at the end of sections on phones (mobile frames)
  navy: `${buttonBase} bg-[#18306e] text-[#d9d9d9] hover:bg-[#1f3c88]`,
  // Blue outline — on photos and dark backgrounds
  outline: `${buttonBase} border border-[#00a8e8] text-[#d9d9d9] backdrop-blur-sm hover:bg-[#00a8e8]/15`,
}

// Small button inside cards (Download audio, View details).
// Phones: small blue tag, 28px (Figma 26–28). Desktop: 36px pill — colours set per card.
export const chip =
  "inline-flex h-7 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-[5px] px-2.5 text-[11px] leading-none font-semibold uppercase tracking-[0.04em] transition-colors duration-300 lg:h-9 lg:gap-1.5 lg:rounded-full lg:px-4 lg:tracking-[0.08em]"

/* ---------- Pills (labels above sections) ---------- */
// 38px tall (Figma 38), at least 150px wide (Figma 155), 12px uppercase.
// `tone` is the desktop look; `mobileTone` overrides it on phones where the mobile frame differs.

const pillTones = {
  dark: "border border-[#1c1c1c] text-[#1c1c1c]",
  light: "border border-[#d9d9d9] text-[#d9d9d9]",
  blue: "border border-[#00a8e8] text-[#1c1c1c]",
  blueOnDark: "border border-[#00a8e8] text-[#d9d9d9]",
  solid: "border border-[#00a8e8] bg-[#00a8e8] text-[#1c1c1c]",
  solidLight: "border border-[#00a8e8] bg-[#00a8e8] text-[#d9d9d9]",
}

const pillMobileTones = {
  dark: "max-lg:border-[#1c1c1c] max-lg:bg-transparent max-lg:text-[#1c1c1c]",
  light: "max-lg:border-[#d9d9d9] max-lg:bg-transparent max-lg:text-[#d9d9d9]",
  blue: "max-lg:border-[#00a8e8] max-lg:bg-transparent max-lg:text-[#1c1c1c]",
  blueOnDark: "max-lg:border-[#00a8e8] max-lg:bg-transparent max-lg:text-[#d9d9d9]",
  solid: "max-lg:border-[#00a8e8] max-lg:bg-[#00a8e8] max-lg:text-[#1c1c1c]",
  solidLight: "max-lg:border-[#00a8e8] max-lg:bg-[#00a8e8] max-lg:text-[#d9d9d9]",
}

export function Pill({
  children,
  tone = "dark",
  mobileTone,
  className = "",
}: {
  children: ReactNode
  tone?: keyof typeof pillTones
  mobileTone?: keyof typeof pillMobileTones
  className?: string
}) {
  return (
    <span
      className={`inline-flex h-[38px] min-w-[150px] shrink-0 items-center justify-center rounded-full px-6 text-[12px] leading-none font-medium uppercase tracking-[0.1em] ${pillTones[tone]} ${mobileTone ? pillMobileTones[mobileTone] : ""} ${className}`}
    >
      {children}
    </span>
  )
}

/* ---------- Forms ---------- */

export const fieldLabel = "text-sm font-medium tracking-[-0.01em] text-[#1c1c1c]"

// 50px inputs on phones (Figma 50), 48px on desktop (Figma 79). Textareas set their own height.
export const field =
  "w-full rounded-[12px] border border-[#8a8d93]/60 bg-[#e8e8e9] px-4 text-[15px] text-[#1c1c1c] outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-[#242323]/55 focus:border-[#00a8e8] focus:bg-white focus:ring-4 focus:ring-[#00a8e8]/15"
export const fieldHeight = "h-[50px] lg:h-12"

// Segmented toggle (Testimony / Prayer point, Offerings / Tithe / Project).
// Phones: 50px track with 30px tabs (Figma 49–50 / 29–30). Desktop: 48px track with 40px tabs (Figma 66 / 45).
export const segmented = "flex h-[50px] w-full items-center gap-1 rounded-full bg-[#8a8d93]/20 p-2.5 lg:h-12 lg:p-1"
export const segment =
  "flex h-full flex-1 cursor-pointer items-center justify-center rounded-full px-2 text-[11px] leading-none font-semibold uppercase tracking-[0.06em] transition-colors duration-300 sm:text-[12px]"
