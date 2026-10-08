const text =
    "We are a praying fellowship . Rooted in the word . We love God & we love people . Aggressive evangelism ."

// 63px strip, Inter Medium 13 with 45% letter spacing.
// Pass colours in className, e.g. "bg-[#00a8e8] text-[#1c1c1c]".
// Uses your existing `animate-marquee` keyframes.
export default function Marquee({ className = "" }: { className?: string }) {
    return (
        <section aria-label="Fellowship values" className={`flex h-[66px] lg:h-[63px] w-full items-center overflow-hidden ${className}`}>
            <div className="animate-marquee flex whitespace-nowrap">
                {[0, 1].map((i) => (
                    <p key={i} aria-hidden={i === 1} className="pr-[0.75em] text-[13px] font-medium uppercase tracking-[0.45em]">
                        {text}
                    </p>
                ))}
            </div>
        </section>
    )
}