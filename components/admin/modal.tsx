"use client"

import { useEffect, type ReactNode } from "react"

// White pop-up over a dimmed page (Figma "New trip", "Invite an admin"). 560 wide (Figma 580–600), 32px corners.
// Closes on Esc or a click outside.
export default function Modal({ open, onClose, title, icon, children }: { open: boolean; onClose: () => void; title: string; icon?: ReactNode; children: ReactNode }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 animate-fade-in bg-[#1d1c1c]/80 [animation-duration:0.25s]" />
      <div className="relative max-h-[calc(100svh-24px)] w-full max-w-[560px] animate-fade-up overflow-y-auto rounded-[24px] bg-white p-6 [animation-duration:0.4s] sm:rounded-[32px] sm:p-10">
        {icon && <span className="mb-6 flex size-14 items-center justify-center rounded-full bg-[#00a8e8] text-white">{icon}</span>}
        <h2 className="font-serif text-[28px] leading-tight text-[#1c1c1c] sm:text-[32px]">{title}</h2>
        {children}
      </div>
    </div>
  )
}
