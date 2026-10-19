import Link from "next/link"

// Dark pill with a chevron, 40px tall — same on every page. Chevron nudges left on hover.
export default function BackButton({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex h-10 items-center gap-2 rounded-full bg-[#1d1c1c] pr-5 pl-4 text-[12px] leading-none font-semibold uppercase tracking-[0.12em] text-[#d9d9d9] transition-colors duration-300 hover:bg-black"
    >
      <svg aria-hidden width="7" height="12" viewBox="0 0 8 14" fill="none" className="transition-transform duration-300 group-hover:-translate-x-0.5">
        <path d="M7 1 1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back
    </Link>
  )
}
