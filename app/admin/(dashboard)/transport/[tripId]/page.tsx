"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { Download, Search } from "lucide-react"
import ModuleGate from "@/components/admin/module-gate"
import { AdminHeader, Avatar, StatCard, Tag, TableScroll, adminButton, adminCard, adminInput, cardTitle, th } from "@/components/admin/ui"
import { db, fmtDay, fmtDayTime, fmtTime, logActivity, must, useLoad } from "@/lib/admin/data"
import { downloadCsv } from "@/lib/admin/csv"
import { directionLabel, type TripRow } from "@/lib/admin/transport"

type Booking = { id: string; rider_name: string; phone: string; status: "booked" | "boarded" | "no_show" | "cancelled"; created_at: string }

const mask = (phone: string) => phone.replace(/\s+/g, "").replace(/^(\d{4})\d+(\d{4})$/, "$1 *** $2")
const statusTag = { boarded: "green", booked: "blue", no_show: "red", cancelled: "grey" } as const

// Figma "Transport · Boarding list": tick riders as they board, mark no-shows, export, close the trip.
export default function BoardingListPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const [query, setQuery] = useState("")

  const { data, reload, setData } = useLoad(async () => {
    const [trip, bookings] = await Promise.all([
      db().from("trip_availability").select("*").eq("id", tripId).maybeSingle(),
      db().from("bookings").select("id, rider_name, phone, status, created_at").eq("trip_id", tripId).neq("status", "cancelled").order("created_at"),
    ])
    return { trip: must(trip) as TripRow | null, bookings: must(bookings) as Booking[] }
  }, [tripId])

  const trip = data?.trip
  const riders = useMemo(() => data?.bookings ?? [], [data])
  const boarded = riders.filter((r) => r.status === "boarded").length
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    const digits = q.replace(/\D/g, "")
    return q ? riders.filter((r) => r.rider_name.toLowerCase().includes(q) || (digits && r.phone.replace(/\D/g, "").includes(digits))) : riders
  }, [riders, query])

  async function setStatus(id: string, status: Booking["status"]) {
    // Update on screen straight away, then save
    setData((d) => (d ? { ...d, bookings: d.bookings.map((b) => (b.id === id ? { ...b, status } : b)) } : d))
    const res = await db().from("bookings").update({ status }).eq("id", id)
    if (res.error) reload()
  }

  async function toggleTrip() {
    if (!trip) return
    must(await db().from("trips").update({ is_open: !trip.is_open }).eq("id", trip.id))
    await logActivity(`${trip.is_open ? "Closed" : "Reopened"} the ${directionLabel[trip.direction]} trip for ${fmtDay(trip.departs_at)}`, "transport")
    reload()
  }

  const cols = "grid-cols-[72px_2fr_1.4fr_1fr_110px]"

  if (data && !trip) {
    return <div className={`${adminCard} p-10 text-center text-[15px] text-[#8a8d93]`}>This trip doesn&apos;t exist any more.</div>
  }

  return (
    <ModuleGate permission="transport" moduleName="Transport">
      <div className="flex flex-col gap-8">
        <AdminHeader
          pill="Transport · Boarding list"
          title={trip ? `${directionLabel[trip.direction]} · ${fmtDay(trip.departs_at)}` : "Boarding list"}
          subtitle={trip ? `Departs ${fmtTime(trip.departs_at)} from ${trip.pickup}. Tick riders as they board. Payment is collected on the bus.` : "Loading…"}
          action={
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={!riders.length}
                onClick={() => downloadCsv(`boarding-list-${tripId}.csv`, [["Rider", "Phone", "Booked at", "Status"], ...riders.map((r) => [r.rider_name, r.phone, fmtDayTime(r.created_at), r.status])])}
                className={adminButton.outline()}
              >
                <Download className="size-4" /> Export list
              </button>
              <button type="button" disabled={!trip} onClick={toggleTrip} className={adminButton.neutral()}>
                {trip?.is_open === false ? "Reopen trip" : "Close trip"}
              </button>
            </div>
          }
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard label="Booked" value={riders.length} note={trip ? `of ${trip.seats} seats` : ""} />
          <StatCard label="Boarded" value={boarded} note="so far" tone="green" />
          <StatCard label="Seats left" value={trip ? Math.max(trip.seats_left, 0) : "—"} note={trip?.is_open ? "Trip is open" : "Trip is closed"} tone={trip?.is_open ? "grey" : "red"} />
        </div>

        <section className={`${adminCard} flex flex-col gap-5 p-5 sm:p-7`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className={cardTitle}>Riders</h2>
            <label className="relative w-full sm:w-[300px]">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#8a8d93]" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or phone" aria-label="Search riders" className={`${adminInput} pl-11`} />
            </label>
          </div>

          <TableScroll minWidth={720}>
            <div className={`grid ${cols} gap-4 border-b border-[#e0e0e1] pb-3 ${th}`}>
              <span>Boarded</span><span>Rider</span><span>Booked at</span><span>Status</span><span />
            </div>
            <ul>
              {shown.map((r, i) => (
                <li key={r.id} className={`grid ${cols} items-center gap-4 border-b border-[#e0e0e1] py-3.5 text-[15px]`}>
                  <input
                    type="checkbox"
                    aria-label={`${r.rider_name} boarded`}
                    checked={r.status === "boarded"}
                    onChange={(e) => setStatus(r.id, e.target.checked ? "boarded" : "booked")}
                    className="size-5 cursor-pointer accent-[#00a8e8]"
                  />
                  <span className="flex min-w-0 items-center gap-3">
                    <Avatar name={r.rider_name} tone={i % 2 ? "grey" : "blue"} />
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-[#1c1c1c]">{r.rider_name}</span>
                      <span className="text-[13px] text-[#8a8d93]">{mask(r.phone)}</span>
                    </span>
                  </span>
                  <span className="text-[#242323]/85">{fmtDayTime(r.created_at)}</span>
                  <Tag tone={statusTag[r.status]}>{r.status.replace("_", "-")}</Tag>
                  <span className="flex justify-end">
                    <button type="button" onClick={() => setStatus(r.id, r.status === "no_show" ? "booked" : "no_show")} className={adminButton.neutral("sm")}>
                      {r.status === "no_show" ? "Undo" : "No-show"}
                    </button>
                  </span>
                </li>
              ))}
              {data && shown.length === 0 && (
                <li className="py-10 text-center text-[15px] text-[#8a8d93]">{query ? `No riders match “${query}”.` : "No bookings yet."}</li>
              )}
            </ul>
          </TableScroll>
        </section>
      </div>
    </ModuleGate>
  )
}
