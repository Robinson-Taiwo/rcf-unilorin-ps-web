import type { ReactNode } from "react"

/* =====================================================================
   Admin UI — styles for the admin area (Figma admin frames).
   Same colours and fonts as the public site; buttons here are sentence case, as designed.
   Sizes normalised: 44px buttons, 48px pill inputs, 24px card corners.
   ===================================================================== */

const buttonBase =
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[10px] font-semibold transition-[background-color,color,border-color,box-shadow,translate] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a8e8] disabled:pointer-events-none disabled:opacity-50"

const sizes = { md: "h-11 px-5 text-[15px]", sm: "h-9 px-4 text-[14px]" }

export const adminButton = {
  primary: (size: keyof typeof sizes = "md") => `${buttonBase} ${sizes[size]} bg-[#00a8e8] text-white hover:bg-[#0096d0] hover:shadow-[0_10px_24px_-12px_rgba(0,168,232,0.9)]`,
  outline: (size: keyof typeof sizes = "md") => `${buttonBase} ${sizes[size]} border-[1.5px] border-[#00a8e8] text-[#00a8e8] hover:bg-[#00a8e8]/10`,
  neutral: (size: keyof typeof sizes = "md") => `${buttonBase} ${sizes[size]} border border-[#8a8d93] bg-white text-[#1c1c1c] hover:bg-[#f2f2f2]`,
  danger: (size: keyof typeof sizes = "md") => `${buttonBase} ${sizes[size]} border border-[#d32f2f]/60 bg-white text-[#d32f2f] hover:bg-[#d32f2f]/5`,
}

export const adminLabel = "text-sm font-medium text-[#1c1c1c]"

// Pill-shaped input (Figma: fully rounded, grey fill, grey outline)
const fieldBase =
  "w-full border border-[#8a8d93]/60 bg-[#e8e8e9] px-5 text-[15px] text-[#1c1c1c] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-[#242323]/50 focus:border-[#00a8e8] focus:ring-4 focus:ring-[#00a8e8]/15"

// Multi-line field: same look, 20px corners
export const adminTextarea = `${fieldBase} resize-none rounded-[20px] py-3.5 leading-[1.5]`

export const adminInput =
  "h-12 w-full rounded-full border border-[#8a8d93]/60 bg-[#e8e8e9] px-5 text-[15px] text-[#1c1c1c] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-[#242323]/50 focus:border-[#00a8e8] focus:ring-4 focus:ring-[#00a8e8]/15 aria-[invalid=true]:border-[#d32f2f] aria-[invalid=true]:focus:ring-[#d32f2f]/15"

export const adminCard = "rounded-[24px] bg-white"

export const adminTitle = "font-serif text-[28px] leading-[1.15] font-semibold tracking-[-0.01em] text-[#1c1c1c] lg:text-[34px]"

// Small all-caps label above a group (MANAGE, YOU CAN MANAGE, card headings in stats)
export const adminCaps = "text-[11px] leading-none font-medium uppercase tracking-[0.14em] text-[#8a8d93]"

// Outlined blue pill above page titles (OVERVIEW, RESTRICTED, ADMIN ACCESS)
export function AdminPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-8 items-center rounded-full border border-[#00a8e8] px-4 text-[11px] leading-none font-medium uppercase tracking-[0.14em] text-[#00a8e8]">
      {children}
    </span>
  )
}

// Page header used by every admin page: pill, title, subtitle, optional action on the right
export function AdminHeader({ pill, title, subtitle, action }: { pill: string; title: ReactNode; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col items-start gap-3.5">
        <AdminPill>{pill}</AdminPill>
        <h1 className={adminTitle}>{title}</h1>
        {subtitle && <p className="text-[15px] text-[#8a8d93]">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

/* ---------- Status tags (OPEN, CLOSED, PUBLISHED, ADMIN …) ---------- */

const tagTones = {
  green: "bg-[#5c8e13] text-white",
  grey: "bg-[#e8e8e9] text-[#3a3a3a]",
  blue: "bg-[#00a8e8] text-white",
  red: "bg-[#d32f2f] text-white",
  yellow: "bg-[#fbbf24] text-[#1c1c1c]",
  navy: "bg-[#18306e] text-white",
}

export type TagTone = keyof typeof tagTones

export function Tag({ tone, children }: { tone: TagTone; children: ReactNode }) {
  return (
    <span className={`inline-flex h-6 w-fit shrink-0 items-center rounded-full px-3 text-[11px] leading-none font-semibold uppercase tracking-[0.08em] whitespace-nowrap ${tagTones[tone]}`}>
      {children}
    </span>
  )
}

/* ---------- Filter / tab toggle (ALL · PUBLISHED · DRAFT, SUNDAY · TUESDAY …) ---------- */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
}: {
  options: readonly { value: T; label: ReactNode }[]
  value: T
  onChange: (v: T) => void
  label: string
  size?: "md" | "sm"
}) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full bg-[#e8e8e9] p-1 [scrollbar-width:none]">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`flex shrink-0 cursor-pointer items-center justify-center rounded-full font-medium uppercase tracking-[0.06em] whitespace-nowrap transition-colors ${
              size === "sm" ? "h-9 px-4 text-[12px]" : "h-10 px-5 text-[13px]"
            } ${active ? "bg-[#00a8e8] text-white" : "text-[#00a8e8] hover:bg-[#00a8e8]/10"}`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/* ---------- On/off switch (green when on) ---------- */

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-[50px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${checked ? "bg-[#5c8e13]" : "bg-[#c9c9cb]"}`}
    >
      <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-[left] duration-200 ${checked ? "left-[26px]" : "left-1"}`} />
    </button>
  )
}

/* ---------- Initials avatar ---------- */

const avatarTones = { blue: "bg-[#00a8e8] text-[#1c1c1c]", yellow: "bg-[#fbbf24] text-[#1c1c1c]", grey: "bg-[#e0e0e1] text-[#1c1c1c]" }
export type AvatarTone = keyof typeof avatarTones

export function Avatar({ name, tone = "blue", size = "md" }: { name: string; tone?: AvatarTone; size?: "sm" | "md" | "lg" }) {
  const letters = name === "Anonymous" ? "AN" : name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase()
  const s = { sm: "size-8 text-[12px]", md: "size-10 text-[13px]", lg: "size-12 text-[15px]" }[size]
  return <span className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${s} ${avatarTones[tone]}`}>{letters}</span>
}

/* ---------- Yellow notice ---------- */

export function Notice({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-[14px] bg-[#fdf1cc] px-4 py-3 text-[13px] leading-[1.45] text-[#1c1c1c]">
      <span className="mt-px shrink-0">{icon}</span>
      <span>{children}</span>
    </div>
  )
}

/* ---------- Card heading and table header row ---------- */

export const cardTitle = "font-serif text-[22px] font-semibold text-[#1c1c1c]"

// Wrap wide tables so they scroll sideways on small screens instead of squashing
export function TableScroll({ children, minWidth = 760 }: { children: ReactNode; minWidth?: number }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:-mx-7 sm:px-7">
      <div style={{ minWidth }}>{children}</div>
    </div>
  )
}

export const th = "text-[11px] leading-none font-medium uppercase tracking-[0.14em] text-[#8a8d93]"

/* ---------- Stat card (dashboard, transport, boarding list) ---------- */

const statTones = { green: "text-[#5c8e13]", red: "text-[#d32f2f]", grey: "text-[#8a8d93]" }

export function StatCard({ label, value, note, tone = "grey" }: { label: string; value: ReactNode; note: ReactNode; tone?: keyof typeof statTones }) {
  return (
    <div className={`${adminCard} flex flex-col gap-3 p-6`}>
      <p className={adminCaps}>{label}</p>
      <p className="font-serif text-[40px] leading-none font-semibold tracking-[-0.02em] text-[#1c1c1c]">{value}</p>
      <p className={`text-[13px] ${statTones[tone]}`}>{note}</p>
    </div>
  )
}
