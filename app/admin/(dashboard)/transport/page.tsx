"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { useAdmin } from "@/components/admin/admin-shell"
import NewTripModal, { type NewTrip } from "@/components/admin/new-trip-modal"
import ModuleGate from "@/components/admin/module-gate"
import { AdminHeader, Segmented, StatCard, Tag, TableScroll, adminButton, adminCard, cardTitle, th } from "@/components/admin/ui"
import { db, fmtDay, fmtTime, logActivity, must, useLoad } from "@/lib/admin/data"
import { directionLabel, joinLagos, splitLagos, tripStatus, tripStatusTag, type TripRow } from "@/lib/admin/transport"

// Figma "Transport": stats, Trips (Upcoming / Past) with seat bars, Bookings + Edit per trip, "New trip".
export default function AdminTransportPage() {
  const user = useAdmin()
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming")
  const [editing, setEditing] = useState<TripRow | null>(null)
  const [creating, setCreating] = useState(false)

  const { data, reload } = useLoad(async () => {
    const [trips, noShows] = await Promise.all([
      db().from("trip_availability").select("*").order("departs_at"),
      db().from("bookings").select("status, trips!inner(departs_at)").gte("trips.departs_at", new Date(Date.now() - 8 * 864e5).toISOString()).lt("trips.departs_at", new Date().toISOString()),
    ])
    return { trips: must(trips) as TripRow[], lastWeek: must(noShows) as { status: string }[], now: Date.now() }
  })

  const now = data?.now ?? 0
  const trips = data?.trips ?? []
  const upcoming = trips.filter((t) => new Date(t.departs_at).getTime() >= now)
  const past = trips.filter((t) => new Date(t.departs_at).getTime() < now).reverse()
  const shown = tab === "upcoming" ? upcoming : past

  // Next Sunday's trips (or the next trip day)
  const nextDay = upcoming[0] ? fmtDay(upcoming[0].departs_at) : null
  const nextDayTrips = upcoming.filter((t) => fmtDay(t.departs_at) === nextDay)
  const booked = nextDayTrips.reduce((n, t) => n + t.seats - t.seats_left, 0)
  const seats = nextDayTrips.reduce((n, t) => n + t.seats, 0)
  const openTrips = upcoming.filter((t) => t.is_open)
  const noShows = data?.lastWeek.filter((b) => b.status === "no_show").length ?? 0

  async function save(t: NewTrip) {
    const row = { direction: t.direction, departs_at: joinLagos(t.date, t.time), pickup: t.pickup, seats: t.seats, is_open: t.open }
    if (editing) {
      must(await db().from("trips").update(row).eq("id", editing.id))
      await logActivity(`Edited a trip for ${fmtDay(row.departs_at)}`, "transport")
    } else {
      must(await db().from("trips").insert({ ...row, created_by: user.id }))
      await logActivity(`Created a trip for ${fmtDay(row.departs_at)}`, "transport")
    }
    reload()
  }

  const cols = "grid-cols-[1.3fr_1.2fr_1fr_1.4fr_0.9fr_184px]"

  return (
    <ModuleGate permission="transport" moduleName="Transport">
      <div className="flex flex-col gap-8">
        <AdminHeader
          pill="Transport"
          title="Transport"
          subtitle="One route, two directions. Create trips, watch seats fill, and manage who boards."
          action={
            <button type="button" onClick={() => setCreating(true)} className={adminButton.primary()}>
              <Plus className="size-[18px]" /> New trip
            </button>
          }
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard label={nextDay ? `Seats booked · ${nextDay}` : "Seats booked"} value={seats ? `${booked} / ${seats}` : "—"} note={nextDayTrips.length > 1 ? "Across both directions" : nextDayTrips.length ? "One trip" : "No upcoming trips"} />
          <StatCard label="Open trips" value={openTrips.length} note={`${nextDayTrips.filter((t) => t.is_open).length} on the next trip day · ${openTrips.length - nextDayTrips.filter((t) => t.is_open).length} later`} tone="green" />
          <StatCard label="No-shows last week" value={noShows} note={`Out of ${data?.lastWeek.length ?? 0} booked`} tone={noShows ? "red" : "grey"} />
        </div>

        <section className={`${adminCard} flex flex-col gap-5 p-5 sm:p-7`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className={cardTitle}>Trips</h2>
            <Segmented label="Trips" options={[{ value: "upcoming", label: "Upcoming" }, { value: "past", label: "Past" }] as const} value={tab} onChange={setTab} />
          </div>

          <TableScroll minWidth={880}>
            <div className={`grid ${cols} gap-4 border-b border-[#e0e0e1] pb-3 ${th}`}>
              <span>Direction</span><span>Date &amp; time</span><span>Pickup</span><span>Seats</span><span>Status</span><span />
            </div>
            <ul>
              {shown.map((t) => {
                const taken = t.seats - t.seats_left
                const status = tripStatus(t)
                const pct = Math.min(100, Math.round((taken / t.seats) * 100))
                return (
                  <li key={t.id} className={`grid ${cols} items-center gap-4 border-b border-[#e0e0e1] py-4 text-[15px]`}>
                    <span className="text-[#1c1c1c]">{directionLabel[t.direction]}</span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[#1c1c1c]">{fmtDay(t.departs_at)}</span>
                      <span className="text-[13px] text-[#8a8d93]">{fmtTime(t.departs_at)}</span>
                    </span>
                    <span className="truncate text-[#242323]/85">{t.pickup}</span>
                    <span className="flex items-center gap-3">
                      <span className="h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-[#e8e8e9]">
                        <span className={`block h-full rounded-full ${status === "full" ? "bg-[#d32f2f]" : "bg-[#00a8e8]"}`} style={{ width: `${Math.max(pct, 4)}%` }} />
                      </span>
                      <span className="whitespace-nowrap text-[#1c1c1c]">{taken} / {t.seats}</span>
                    </span>
                    <Tag tone={tripStatusTag[status]}>{status}</Tag>
                    <span className="flex justify-end gap-2">
                      <Link href={`/admin/transport/${t.id}`} className={adminButton.outline("sm")}>Bookings</Link>
                      <button type="button" onClick={() => setEditing(t)} className={adminButton.neutral("sm")}>Edit</button>
                    </span>
                  </li>
                )
              })}
              {data && shown.length === 0 && <li className="py-10 text-center text-[15px] text-[#8a8d93]">{tab === "upcoming" ? "No upcoming trips. Create one with “New trip”." : "No past trips yet."}</li>}
            </ul>
          </TableScroll>
        </section>
      </div>

      {creating && <NewTripModal key="new" open onClose={() => setCreating(false)} onCreate={save} />}
      {editing && (
        <NewTripModal
          key={editing.id}
          open
          onClose={() => setEditing(null)}
          onCreate={save}
          initial={{ direction: editing.direction, ...splitLagos(editing.departs_at), pickup: editing.pickup, seats: editing.seats, open: editing.is_open }}
        />
      )}
    </ModuleGate>
  )
}
