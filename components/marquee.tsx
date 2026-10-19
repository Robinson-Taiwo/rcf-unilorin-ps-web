const text =
  "We are a praying fellowship . Rooted in the word . We love God & we love people . Aggressive evangelism ."

// Scrolling values strip: 48px on phones, 56px on desktop (Figma 63), 12px uppercase with wide spacing.
// Pass colours in className, e.g. "bg-[#00a8e8] text-[#1c1c1c]".
export default function Marquee({ className = "" }: { className?: string }) {
  return (
    <section aria-label="Fellowship values" className={`flex h-12 w-full items-center overflow-hidden lg:h-14 ${className}`}>
      <div className="animate-marquee flex whitespace-nowrap">
        {[0, 1].map((i) => (
          <p key={i} aria-hidden={i === 1} className="pr-[0.75em] text-[12px] font-medium uppercase tracking-[0.4em]">
            {text}
          </p>
        ))}
      </div>
    </section>
  )
}
