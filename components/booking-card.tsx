"use client"

import { useState, type FormEvent } from "react"
import { field, fieldLabel } from "@/components/rcf/Ui"
import { button } from "@/components/rcf/Ui"
import type { PublicTrip } from "@/lib/content"
import { supabasePublic } from "@/lib/supabase/public"

const label = { school_to_church: ["School", "Church"], church_to_school: ["Church", "School"] } as const

// Home page "Reserve your seat": pick a direction, leave a name and phone, and the seat is held (pay on the bus).
// Phones: white card (Figma 300 x 285). Desktop: grey with a navy border (Figma 513 x 498).
export default function BookingCard({ trips }: { trips: PublicTrip[] }) {
  const [selected, setSelected] = useState<string | null>(trips[0]?.id ?? null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "booked" | "full" | "closed" | "error">("idle")
  const [seats, setSeats] = useState<Record<string, number>>(Object.fromEntries(trips.map((t) => [t.id, t.seats_left])))

  const trip = trips.find((t) => t.id === selected)

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!trip || status === "sending") return
    setStatus("sending")
    const { data, error } = await supabasePublic().rpc("book_seat", { p_trip_id: trip.id, p_name: name.trim(), p_phone: phone.replace(/\s+/g, "") })
    if (error) {
      // Same phone on the same trip
      return setStatus(error.code === "23505" ? "booked" : "error")
    }
    setStatus(data as "booked" | "full" | "closed")
    if (data === "booked") setSeats((s) => ({ ...s, [trip.id]: Math.max(0, (s[trip.id] ?? 1) - 1) }))
  }

  return (
    <div data-reveal="right" className="flex w-full max-w-[440px] flex-col gap-5 rounded-[20px] bg-white p-5 lg:rounded-[24px] lg:border lg:border-[#18306e] lg:bg-[#d9d9d9] lg:p-7">
      <h3 className="cap-trim hidden font-serif text-subheading font-semibold text-[#1c1c1c] lg:block">{trips[0]?.day ?? "Bus booking"}</h3>

      {trips.length === 0 ? (
        <p className="text-[14px] leading-[1.55] text-[#242323]/75">No trips are open for booking right now. Check back closer to the next service.</p>
      ) : status === "booked" && trip ? (
        <div role="status" className="flex animate-fade-in flex-col gap-2 rounded-[14px] border border-[#5c8e13] bg-[#5c8e13]/10 px-4 py-4">
          <p className="text-[15px] font-semibold text-[#1c1c1c]">Your seat is reserved.</p>
          <p className="text-[13px] leading-[1.5] text-[#242323]/75">
            {label[trip.direction].join(" → ")} · {trip.day}, {trip.time} from {trip.pickup}. Please arrive 10 minutes early. You pay on the bus.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:gap-3.5">
            {trips.map((t) => {
              const left = seats[t.id] ?? t.seats_left
              const active = t.id === selected
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={active}
                  disabled={left <= 0}
                  onClick={() => { setSelected(t.id); setStatus("idle") }}
                  className={`flex w-full cursor-pointer flex-col gap-3 rounded-[14px] border px-4 py-4 text-left transition-[border-color,background-color,translate] duration-300 enabled:hover:-translate-y-0.5 enabled:hover:border-[#00a8e8] disabled:cursor-not-allowed disabled:opacity-60 lg:gap-2.5 ${
                    active ? "border-[#00a8e8] bg-[#00a8e8]/10" : "border-[#8a8d93]/60 bg-[#8a8d93]/10"
                  }`}
                >
                  <span className="flex w-full items-center justify-between gap-3">
                    <span className="text-[15px] leading-none font-semibold tracking-[-0.01em] text-[#1c1c1c] lg:text-base">{label[t.direction].join(" → ")}</span>
                    <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-[10px] leading-none font-semibold uppercase tracking-[0.02em] text-[#d9d9d9] ${left > 0 ? "bg-[#5c8e13]" : "bg-[#d32f2f]"}`}>
                      {left > 0 ? `${left} seats left` : "Full"}
                    </span>
                  </span>
                  <span className="text-[12px] leading-none text-[#242323]/65 lg:text-[13px]">Departs {t.time} · {t.pickup}</span>
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className={`${fieldLabel} text-[12px]`}>Name</span>
              <input required maxLength={60} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={`${field} h-11 bg-white`} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={`${fieldLabel} text-[12px]`}>Phone</span>
              <input required type="tel" inputMode="tel" pattern="[+0-9 ]{10,16}" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0803 000 0000" className={`${field} h-11 bg-white`} />
            </label>
          </div>

          <button type="submit" disabled={!trip || status === "sending"} className={`${button.primary} w-full`}>
            {status === "sending" ? "Reserving…" : "Reserve my seat"}
          </button>

          {(status === "full" || status === "closed" || status === "error") && (
            <p role="alert" className="text-[13px] font-medium text-[#d32f2f]">
              {status === "full" ? "Sorry, that trip just filled up." : status === "closed" ? "Booking for that trip has closed." : "Couldn't reserve the seat. Please try again."}
            </p>
          )}
          <p className="text-[12px] leading-[1.5] text-[#242323]/65 lg:text-[13px]">Please arrive 10 minutes before departure. No payment online — you pay on the bus.</p>
        </form>
      )}
    </div>
  )
}
