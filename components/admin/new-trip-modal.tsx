"use client"

import { useState, type FormEvent } from "react"
import { Calendar, Clock } from "lucide-react"
import Modal from "@/components/admin/modal"
import { adminButton, adminInput, adminLabel } from "@/components/admin/ui"

export const directions = [
  { value: "school_to_church", label: "School → Church" },
  { value: "church_to_school", label: "Church → School" },
] as const

// date is YYYY-MM-DD, time is HH:MM (Lagos time)
export type NewTrip = { direction: (typeof directions)[number]["value"]; date: string; time: string; pickup: string; seats: number; open: boolean }

// Figma "New trip" (opens over Transport after "New trip"). Also used for "Edit" with `initial` filled in.
// Give it a `key` that changes per trip so the fields reset.
export default function NewTripModal({
  open,
  onClose,
  onCreate,
  initial,
}: {
  open: boolean
  onClose: () => void
  onCreate: (trip: NewTrip) => Promise<void> | void
  initial?: Partial<NewTrip>
}) {
  const [direction, setDirection] = useState<NewTrip["direction"]>(initial?.direction ?? directions[0].value)
  const [date, setDate] = useState(initial?.date ?? "")
  const [time, setTime] = useState(initial?.time ?? "")
  const [pickup, setPickup] = useState(initial?.pickup ?? "Main Gate")
  const [seats, setSeats] = useState(initial?.seats ?? 55)
  const [isOpen, setIsOpen] = useState(initial?.open ?? true)
  const editing = Boolean(initial)

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    try {
      await onCreate({ direction, date, time, pickup, seats, open: isOpen })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save the trip.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Edit trip" : "New trip"}>
      <p className="mt-3 text-[15px] leading-[1.55] text-[#8a8d93]">One route, two directions. Riders reserve a seat here and pay on the bus.</p>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-5">
        <fieldset className="flex flex-col gap-2.5">
          <legend className={`${adminLabel} mb-2.5`}>Direction</legend>
          <div className="flex w-full max-w-[380px] items-center gap-1 rounded-full bg-[#e8e8e9] p-1">
            {directions.map((d) => (
              <button
                key={d.value}
                type="button"
                aria-pressed={direction === d.value}
                onClick={() => setDirection(d.value)}
                className={`flex h-10 flex-1 cursor-pointer items-center justify-center rounded-full text-[12px] font-medium uppercase tracking-[0.06em] transition-colors ${
                  direction === d.value ? "bg-[#00a8e8] text-white" : "text-[#00a8e8] hover:bg-[#00a8e8]/10"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="trip-date" className={adminLabel}>Date</label>
          <div className="relative">
            <input id="trip-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={`${adminInput} pr-12 [&::-webkit-calendar-picker-indicator]:opacity-0`} />
            <Calendar className="pointer-events-none absolute top-1/2 right-5 size-[18px] -translate-y-1/2 text-[#8a8d93]" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
          <div className="flex flex-col gap-2.5">
            <label htmlFor="trip-time" className={adminLabel}>Time</label>
            <div className="relative">
              <input id="trip-time" type="time" required value={time} onChange={(e) => setTime(e.target.value)} className={`${adminInput} pr-12 [&::-webkit-calendar-picker-indicator]:opacity-0`} />
              <Clock className="pointer-events-none absolute top-1/2 right-5 size-[18px] -translate-y-1/2 text-[#8a8d93]" />
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <label htmlFor="trip-pickup" className={adminLabel}>Pickup point</label>
            <input id="trip-pickup" required value={pickup} onChange={(e) => setPickup(e.target.value)} className={adminInput} />
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="trip-seats" className={adminLabel}>Seats available</label>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <input id="trip-seats" type="number" min={1} required value={seats} onChange={(e) => setSeats(Number(e.target.value))} className={`${adminInput} sm:flex-1`} />
            <label className="flex cursor-pointer items-center gap-3 text-[15px] text-[#1c1c1c]">
              <button
                type="button"
                role="switch"
                aria-checked={isOpen}
                onClick={() => setIsOpen((v) => !v)}
                className={`relative h-7 w-[50px] shrink-0 cursor-pointer rounded-full transition-colors ${isOpen ? "bg-[#5c8e13]" : "bg-[#8a8d93]/50"}`}
              >
                <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-[left] duration-200 ${isOpen ? "left-[26px]" : "left-1"}`} />
              </button>
              Open for booking
            </label>
          </div>
        </div>

        {error && <p role="alert" className="text-sm text-[#d32f2f]">{error}</p>}
        <div className="mt-2 flex justify-end gap-3">
          <button type="button" onClick={onClose} className={adminButton.neutral()}>Cancel</button>
          <button type="submit" disabled={busy} className={adminButton.primary()}>{busy ? "Saving…" : editing ? "Save trip" : "Create trip"}</button>
        </div>
      </form>
    </Modal>
  )
}
