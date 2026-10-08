import Link from "next/link"

// 100 x 45 dark pill with a 7 x 13 chevron
export default function BackButton({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="flex h-[45px] w-[100px] items-center justify-center gap-1 rounded-[26px] bg-[#1d1c1c] text-[16px] leading-[27px] tracking-[0.05em] text-[#d9d9d9] hover:bg-black"
    >
      <svg aria-hidden width="8" height="14" viewBox="0 0 8 14" fill="none">
        <path d="M7 1 1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      BACK
    </Link>
  )
}