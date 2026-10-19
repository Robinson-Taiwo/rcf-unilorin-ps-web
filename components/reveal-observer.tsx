"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

// Watches every [data-reveal] element and marks it data-revealed once it
// scrolls into view (see the MOTION block in globals.css). Re-scans on
// route changes and when new content is added to the page.
export default function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "")
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    )

    const scan = () =>
      document.querySelectorAll("[data-reveal]:not([data-revealed])").forEach((el) => io.observe(el))

    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])

  return null
}
