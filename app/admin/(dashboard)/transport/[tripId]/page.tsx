"use client"

import { useMemo, useState, type FormEvent } from "react"
import { useParams } from "next/navigation"
import { Download, Search, UserMinus, UserPlus } from "lucide-react"
import ModuleGate from "@/components/admin/module-gate"
import { AdminHeader, Avatar, Notice, Segmented, StatCard, Tag, TableScroll, adminButton, adminCard, adminInput, cardTitle, th } from "@/components/admin/ui"
import { db, fmtDay, fmtDayTime, fmtTime, logActivity, must, useLoad } from "@/lib/admin/data"
import { downloadCsv } from "@/lib/admin/csv"
import { directionLabel, type TripRow } from "@/lib/admin/transport"

type Booking = { id: string; rider_name: string; phone: string; status: "booked" | "boarded" | "no_show" | "cancelled"; created_at: string; cancelled_at: string | null }

const mask = (phone: string) => phone.replace(/\s+/g, "").replace(/^(\d{4})\d+(\d{4})$/, "$1 *** $2")
const statusTag = { boarded: "green", booked: "blue", no_show: "red", cancelled: "grey" } as const
const statusLabel = { boarded: "boarded", booked: "booked", no_show: "no-show", cancelled: "cancelled" } as const

// Figma "Transport · Boarding list": tick riders as they board, mark no-shows, export, close the trip.
// Cancelling a booking frees the seat at once, so someone who is at the bus can take it ("Add rider").
export default function BoardingListPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const [query, setQuery] = useState("")
  const [view, setView] = useState<"active" | "cancelled">("active")
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState("")

  const { data, reload, setData } = useLoad(async () => {
    const [trip, bookings] = await Promise.all([
      db().from("trip_availability").select("*").eq("id", tripId).maybeSingle(),
      db().from("bookings").select("id, rider_name, phone, status, created_at, cancelled_at").eq("trip_id", tripId).order("created_at"),
    ])
    return { trip: must(trip) as TripRow | null, bookings: must(bookings) as Booking[] }
  }, [tripId])

  const trip = data?.trip
  const all = useMemo(() => data?.bookings ?? [], [data])
  const riders = all.filter((r) => r.status !== "cancelled")
  const cancelled = all.filter((r) => r.status === "cancelled")
  const waiting = riders.filter((r) => r.status === "booked")
  const boarded = riders.filter((r) => r.status === "boarded").length
  const seatsLeft = trip ? Math.max(trip.seats - riders.length, 0) : 0

  const shown = useMemo(() => {
    const list = view === "active" ? all.filter((r) => r.status !== "cancelled") : all.filter((r) => r.status === "cancelled")
    const q = query.trim().toLowerCase()
    const digits = q.replace(/\D/g, "")
    return q ? list.filter((r) => r.rider_name.toLowerCase().includes(q) || (digits && r.phone.replace(/\D/g, "").includes(digits))) : list
  }, [all, view, query])

  async function setStatus(r: Booking, status: Booking["status"]) {
    setError("")
    if (r.status === "cancelled" && status !== "cancelled" && seatsLeft <= 0) return setError("The bus is full. Cancel someone else first.")
    const change = { status, cancelled_at: status === "cancelled" ? new Date().toISOString() : null }
    // Update on screen straight away, then save
    setData((d) => (d ? { ...d, bookings: d.bookings.map((b) => (b.id === r.id ? { ...b, ...change } : b)) } : d))
    const res = await db().from("bookings").update(change).eq("id", r.id)
    if (res.error) {
      setError(res.error.message)
      return reload()
    }
    if (status === "cancelled") await logActivity(`Cancelled ${r.rider_name}'s seat on the ${trip ? fmtDay(trip.departs_at) : ""} trip`, "transport")
    if (r.status === "cancelled") await logActivity(`Restored ${r.rider_name}'s seat`, "transport")
    reload()
  }

  // Everyone booked who hasn't boarded yet loses their seat, so people at the bus can get on
  async function releaseWaiting() {
    if (!waiting.length || !window.confirm(`Cancel the ${waiting.length} booking${waiting.length > 1 ? "s" : ""} not boarded yet? Their seats open up for people who are here.`)) return
    setError("")
    const res = await db().from("bookings").update({ status: "cancelled", cancelled_at: new Date().toISOString() }).in("id", waiting.map((r) => r.id))
    if (res.error) return setError(res.error.message)
    await logActivity(`Released ${waiting.length} unclaimed seat${waiting.length > 1 ? "s" : ""} on the ${trip ? fmtDay(trip.departs_at) : ""} trip`, "transport")
    reload()
  }

  async function toggleTrip() {
    if (!trip) return
    must(await db().from("trips").update({ is_open: !trip.is_open }).eq("id", trip.id))
    await logActivity(`${trip.is_open ? "Closed" : "Reopened"} the ${directionLabel[trip.direction]} trip for ${fmtDay(trip.departs_at)}`, "transport")
    reload()
  }

  const cols = "grid-cols-[72px_2fr_1.4fr_1fr_190px]"

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
                disabled={!all.length}
                onClick={() => downloadCsv(`boarding-list-${tripId}.csv`, [["Rider", "Phone", "Booked at", "Status"], ...all.map((r) => [r.rider_name, r.phone, fmtDayTime(r.created_at), statusLabel[r.status]])])}
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Booked" value={riders.length} note={trip ? `of ${trip.seats} seats` : ""} />
          <StatCard label="Boarded" value={boarded} note="so far" tone="green" />
          <StatCard label="Not here yet" value={waiting.length} note={waiting.length ? "Booked, not boarded" : "Everyone booked is on"} tone={waiting.length ? "red" : "grey"} />
          <StatCard label="Seats left" value={trip ? seatsLeft : "—"} note={trip?.is_open ? "Open for booking" : "Booking closed"} tone={seatsLeft ? "green" : "grey"} />
        </div>

        <section className={`${adminCard} flex flex-col gap-5 p-5 sm:p-7`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className={cardTitle}>Riders</h2>
              <Segmented
                label="Show"
                size="sm"
                options={[{ value: "active", label: `On the list · ${riders.length}` }, { value: "cancelled", label: `Cancelled · ${cancelled.length}` }] as const}
                value={view}
                onChange={setView}
              />
            </div>
            <label className="relative w-full sm:w-[280px]">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#8a8d93]" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or phone" aria-label="Search riders" className={`${adminInput} pl-11`} />
            </label>
          </div>

          {view === "active" && (
            <div className="flex flex-wrap items-center gap-3 rounded-[16px] bg-[#f2f2f2] p-4">
              <p className="min-w-0 flex-1 text-[14px] leading-[1.5] text-[#1c1c1c]">
                {waiting.length
                  ? `${waiting.length} booked rider${waiting.length > 1 ? "s haven't" : " hasn't"} boarded. Cancel late riders to give their seats to people who are here.`
                  : seatsLeft
                    ? `${seatsLeft} seat${seatsLeft > 1 ? "s" : ""} free. Add people who are at the bus.`
                    : "The bus is full."}
              </p>
              <div className="flex flex-wrap gap-2">
                {waiting.length > 0 && (
                  <button type="button" onClick={releaseWaiting} className={adminButton.neutral("sm")}>
                    <UserMinus className="size-4" /> Release {waiting.length} unclaimed
                  </button>
                )}
                <button type="button" disabled={!seatsLeft} onClick={() => setAdding((v) => !v)} className={adminButton.primary("sm")}>
                  <UserPlus className="size-4" /> Add rider
                </button>
              </div>
            </div>
          )}

          {adding && view === "active" && trip && <AddRider tripId={trip.id} seatsLeft={seatsLeft} existing={all} onDone={() => { setAdding(false); reload() }} />}
          {error && <p role="alert" className="text-sm text-[#d32f2f]">{error}</p>}

          <TableScroll minWidth={780}>
            <div className={`grid ${cols} gap-4 border-b border-[#e0e0e1] pb-3 ${th}`}>
              <span>Boarded</span><span>Rider</span><span>{view === "active" ? "Booked at" : "Cancelled at"}</span><span>Status</span><span />
            </div>
            <ul>
              {shown.map((r, i) => (
                <li key={r.id} className={`grid ${cols} items-center gap-4 border-b border-[#e0e0e1] py-3.5 text-[15px] ${r.status === "cancelled" ? "opacity-70" : ""}`}>
                  <input
                    type="checkbox"
                    aria-label={`${r.rider_name} boarded`}
                    checked={r.status === "boarded"}
                    disabled={r.status === "cancelled"}
                    onChange={(e) => setStatus(r, e.target.checked ? "boarded" : "booked")}
                    className="size-5 cursor-pointer accent-[#00a8e8] disabled:cursor-not-allowed"
                  />
                  <span className="flex min-w-0 items-center gap-3">
                    <Avatar name={r.rider_name} tone={r.status === "cancelled" ? "grey" : i % 2 ? "grey" : "blue"} />
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-[#1c1c1c]">{r.rider_name}</span>
                      <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`} className="w-fit text-[13px] text-[#8a8d93] hover:text-[#00a8e8]" title="Call">{mask(r.phone)}</a>
                    </span>
                  </span>
                  <span className="text-[#242323]/85">{fmtDayTime(r.status === "cancelled" && r.cancelled_at ? r.cancelled_at : r.created_at)}</span>
                  <Tag tone={statusTag[r.status]}>{statusLabel[r.status]}</Tag>
                  <span className="flex justify-end gap-2">
                    {r.status === "cancelled" ? (
                      <button type="button" disabled={!seatsLeft} onClick={() => setStatus(r, "booked")} className={adminButton.neutral("sm")}>Restore</button>
                    ) : (
                      <>
                        {r.status !== "boarded" && (
                          <button type="button" onClick={() => setStatus(r, r.status === "no_show" ? "booked" : "no_show")} className={adminButton.neutral("sm")}>
                            {r.status === "no_show" ? "Undo" : "No-show"}
                          </button>
                        )}
                        <button type="button" onClick={() => setStatus(r, "cancelled")} className={adminButton.danger("sm")}>Cancel</button>
                      </>
                    )}
                  </span>
                </li>
              ))}
              {data && shown.length === 0 && (
                <li className="py-10 text-center text-[15px] text-[#8a8d93]">{query ? `No riders match “${query}”.` : view === "active" ? "No bookings yet." : "No cancelled bookings."}</li>
              )}
            </ul>
          </TableScroll>

          <Notice icon={<UserMinus className="size-4" />}>
            Cancelled riders can book again from the website if seats are still open. Marking a no-show keeps the seat taken; cancel to free it.
          </Notice>
        </section>
      </div>
    </ModuleGate>
  )
}

// Someone at the bus without a booking: name + phone, counted as boarded
function AddRider({ tripId, seatsLeft, existing, onDone }: { tripId: string; seatsLeft: number; existing: Booking[]; onDone: () => void }) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (seatsLeft <= 0) return setError("The bus is full.")
    const clean = phone.replace(/\s+/g, "")
    const match = existing.find((b) => b.phone.replace(/\s+/g, "") === clean)
    if (match && match.status !== "cancelled") return setError(`${match.rider_name} is already on the list with that number.`)
    setBusy(true)
    setError("")
    const res = match
      ? await db().from("bookings").update({ status: "boarded", rider_name: name.trim(), cancelled_at: null }).eq("id", match.id)
      : await db().from("bookings").insert({ trip_id: tripId, rider_name: name.trim(), phone: clean, status: "boarded" })
    setBusy(false)
    if (res.error) return setError(res.error.message)
    await logActivity(`Added ${name.trim()} at the bus`, "transport")
    onDone()
  }

  return (
    <form onSubmit={submit} className="flex animate-fade-in flex-col gap-3 rounded-[16px] border-[1.5px] border-[#00a8e8] bg-[#00a8e8]/5 p-4 sm:flex-row sm:items-end">
      <label className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="text-[13px] font-medium text-[#1c1c1c]">Name</span>
        <input required autoFocus maxLength={60} value={name} onChange={(e) => setName(e.target.value)} className={`${adminInput} bg-white`} />
      </label>
      <label className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="text-[13px] font-medium text-[#1c1c1c]">Phone</span>
        <input required type="tel" inputMode="tel" pattern="[+0-9 ]{10,16}" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0803 000 0000" className={`${adminInput} bg-white`} />
      </label>
      <button type="submit" disabled={busy} className={adminButton.primary()}>{busy ? "Adding…" : "Add as boarded"}</button>
      {error && <p role="alert" className="text-sm text-[#d32f2f] sm:basis-full">{error}</p>}
    </form>
  )
}
