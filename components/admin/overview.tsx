"use client"

import Link from "next/link"
import { Bus, CircleCheck, Lock, Mail, MessageCircle, QrCode } from "lucide-react"
import { useAdmin } from "@/components/admin/admin-shell"
import { AdminHeader, Avatar, StatCard, adminButton, adminCaps, adminCard, cardTitle } from "@/components/admin/ui"
import { db, must, timeAgo, todayLagos, useLoad } from "@/lib/admin/data"
import { can, modules, superOnly } from "@/lib/admin/permissions"

const directionLabel = { school_to_church: "School → Church", church_to_school: "Church → School" } as const


// Which service runs on which weekday (0 = Sunday)
const serviceForDay: Record<number, { key: string; name: string; time: string }> = {
  0: { key: "sunday", name: "Sunday", time: "Sunday Service opens 7:20 AM today" },
  2: { key: "tuesday", name: "Tuesday", time: "Bible Study opens 6:15 PM today" },
  4: { key: "thursday", name: "Thursday", time: "Prayer Meeting opens 6:15 PM today" },
}

function greeting() {
  const h = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", hour: "numeric", hour12: false }).format(new Date()))
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"
}

type AttentionItem = { icon: typeof QrCode; title: string; detail: string; action: string; href: string; primary?: boolean }

// Figma "Overview": greeting + Open check-in, four stat cards, "Needs attention", then
// "Recent activity" for Super Admins or "Your access" for Admins. All figures are live from Supabase.
export default function Overview() {
  const user = useAdmin()
  const firstName = user.name.split(" ")[0]
  const isSuper = user.role === "super_admin"
  // Only load and show what this admin can open
  const has = {
    checkIn: can(user, "check-in"),
    transport: can(user, "transport"),
    events: can(user, "events"),
    reviews: can(user, "testimonies"),
    messages: can(user, "messages"),
  }
  const none = Promise.resolve({ data: [], error: null })

  const { data, loading } = useLoad(async () => {
    const today = todayLagos()
    const nowIso = new Date().toISOString()
    const [sessions, trips, subs, events, msgs, log] = await Promise.all([
      has.checkIn ? db().from("checkin_sessions").select("id, service_key, is_open, created_at, services(name, time_label), checkins(count)").eq("service_date", today) : none,
      has.transport ? db().from("trip_availability").select("*").gte("departs_at", nowIso).order("departs_at").limit(1) : none,
      has.reviews ? db().from("submissions").select("type").eq("status", "pending") : none,
      has.events ? db().from("events").select("title, starts_at").eq("status", "published").gte("starts_at", nowIso).order("starts_at") : none,
      has.messages ? db().from("messages").select("name, subject").eq("is_read", false).eq("archived", false).order("created_at", { ascending: false }) : none,
      isSuper
        ? db().from("activity_log").select("action, created_at, actor:profiles(full_name, id)").order("created_at", { ascending: false }).limit(5)
        : Promise.resolve({ data: [], error: null }),
    ])
    return {
      sessions: must(sessions) as unknown as { service_key: string; is_open: boolean; services: { name: string; time_label: string } | null; checkins: { count: number }[] }[],
      trip: (must(trips) as { id: string; direction: keyof typeof directionLabel; departs_at: string; seats: number; seats_left: number }[])[0] ?? null,
      subs: must(subs) as { type: "testimony" | "prayer" }[],
      events: must(events) as { title: string; starts_at: string }[],
      msgs: must(msgs) as { name: string; subject: string }[],
      log: (must(log) ?? []) as unknown as { action: string; created_at: string; actor: { full_name: string; id: string } | null }[],
      today: new Date(`${today}T12:00:00+01:00`).getDay(),
    }
  }, [isSuper, user.modules.join(",")])

  const checkins = data?.sessions.reduce((n, s) => n + (s.checkins[0]?.count ?? 0), 0) ?? 0
  const openSession = data?.sessions.find((s) => s.is_open) ?? data?.sessions[0]
  const testimonies = data?.subs.filter((s) => s.type === "testimony").length ?? 0
  const prayers = (data?.subs.length ?? 0) - testimonies
  const trip = data?.trip
  const booked = trip ? trip.seats - trip.seats_left : 0

  const attention: AttentionItem[] = []
  if (data) {
    const svc = serviceForDay[data.today]
    if (has.checkIn && svc && !data.sessions.some((s) => s.service_key === svc.key))
      attention.push({ icon: QrCode, title: `${svc.name} check-in code not set`, detail: svc.time, action: "Set code", href: "/admin/check-in", primary: true })
    if (data.subs.length)
      attention.push({ icon: MessageCircle, title: `${data.subs.length} submission${data.subs.length > 1 ? "s" : ""} waiting for review`, detail: `${testimonies} testimonies · ${prayers} prayer points`, action: "Review", href: "/admin/testimonies" })
    if (trip && booked / trip.seats >= 0.5)
      attention.push({ icon: Bus, title: `Next trip is ${Math.round((booked / trip.seats) * 100)}% full`, detail: `${directionLabel[trip.direction]} · ${trip.seats_left} seats left`, action: "Bookings", href: `/admin/transport/${trip.id}` })
    if (data.msgs.length)
      attention.push({ icon: Mail, title: `${data.msgs.length} unread message${data.msgs.length > 1 ? "s" : ""}`, detail: `Latest: ${data.msgs[0].subject}`, action: "Open inbox", href: "/admin/messages" })
  }

  return (
    <div className="flex flex-col gap-8">
      <AdminHeader
        pill="Overview"
        title={`${greeting()}, ${firstName}`}
        subtitle="Here is what needs attention across the fellowship today."
        action={
          has.checkIn ? (
            <Link href="/admin/check-in" className={adminButton.primary()}>
              <QrCode className="size-[18px]" /> Open check-in
            </Link>
          ) : has.transport ? (
            <Link href="/admin/transport" className={adminButton.primary()}>
              <Bus className="size-[18px]" /> Open transport
            </Link>
          ) : undefined
        }
      />

      {(has.checkIn || has.transport || has.reviews || has.events) && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {has.checkIn && <StatCard label="Check-ins today" value={loading ? "—" : checkins} note={openSession?.services ? `${openSession.services.name} · ${openSession.services.time_label}` : "No service today yet"} tone={checkins ? "green" : "grey"} />}
          {has.transport && <StatCard label="Seats booked" value={trip ? `${booked} / ${trip.seats}` : "—"} note={trip ? `${directionLabel[trip.direction]} · next trip` : "No upcoming trips"} />}
          {has.reviews && <StatCard label="Pending reviews" value={loading ? "—" : data?.subs.length ?? 0} note={`${testimonies} testimonies · ${prayers} prayer points`} tone={data?.subs.length ? "red" : "grey"} />}
          {has.events && <StatCard label="Upcoming events" value={loading ? "—" : data?.events.length ?? 0} note={data?.events[0] ? `Next: ${data.events[0].title}` : "Nothing scheduled"} />}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <section className={`${adminCard} flex flex-col gap-5 p-5 sm:p-7`}>
          <h2 className={cardTitle}>Needs attention</h2>
          <ul className="flex flex-col gap-3">
            {attention.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.title} className="flex flex-wrap items-center gap-4 rounded-[16px] bg-[#f2f2f2] p-4 sm:flex-nowrap">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#00a8e8]/12 text-[#00a8e8]">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-[15px] font-medium text-[#1c1c1c]">{item.title}</span>
                    <span className="truncate text-[13px] text-[#8a8d93]">{item.detail}</span>
                  </span>
                  <Link href={item.href} className={`${item.primary ? adminButton.primary("sm") : adminButton.outline("sm")} max-sm:w-full`}>
                    {item.action}
                  </Link>
                </li>
              )
            })}
            {!loading && attention.length === 0 && (
              <li className="rounded-[16px] bg-[#f2f2f2] p-6 text-center text-[15px] text-[#8a8d93]">All clear — nothing needs attention right now.</li>
            )}
            {loading && <li className="h-20 animate-pulse rounded-[16px] bg-[#f2f2f2]" />}
          </ul>
        </section>

        {isSuper ? (
          <section className={`${adminCard} flex flex-col gap-5 p-5 sm:p-7`}>
            <h2 className={cardTitle}>Recent activity</h2>
            <ul className="flex flex-col gap-4">
              {data?.log.map((a, i) => {
                const name = a.actor?.full_name || "Someone"
                const isMe = a.actor?.id === user.id
                return (
                  <li key={i} className="flex items-start gap-3">
                    <Avatar name={name} tone={isMe ? "yellow" : "blue"} />
                    <span className="flex min-w-0 flex-col gap-0.5 pt-0.5">
                      <span className="text-[15px] leading-snug text-[#1c1c1c]">
                        {isMe ? "You" : name} {a.action.charAt(0).toLowerCase() + a.action.slice(1)}
                      </span>
                      <span className="text-[13px] text-[#8a8d93]">{timeAgo(a.created_at)}</span>
                    </span>
                  </li>
                )
              })}
              {data && data.log.length === 0 && <li className="text-[15px] text-[#8a8d93]">No activity yet.</li>}
            </ul>
            <Link href="/admin/activity" className="text-sm font-semibold text-[#00a8e8] hover:underline">View activity log</Link>
          </section>
        ) : (
          <section className={`${adminCard} flex flex-col gap-5 p-5 sm:p-7`}>
            <h2 className={cardTitle}>Your access</h2>
            <div className="flex flex-col gap-3">
              <p className={adminCaps}>You can manage</p>
              <ul className="flex flex-col gap-2.5">
                {modules.filter((m) => can(user, m.key)).map((m) => (
                  <li key={m.key} className="flex items-center gap-3 text-[15px] text-[#1c1c1c]">
                    <CircleCheck className="size-[18px] shrink-0 text-[#5c8e13]" strokeWidth={1.75} /> {m.label}
                  </li>
                ))}
                {!modules.some((m) => can(user, m.key)) && <li className="text-[15px] text-[#8a8d93]">No pages yet. Ask a Super Admin to give you access.</li>}
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <p className={adminCaps}>Not in your access</p>
              <ul className="flex flex-col gap-2.5">
                {[...modules.filter((m) => !can(user, m.key)).map((m) => m.label), ...Object.values(superOnly)].map((m) => (
                  <li key={m} className="flex items-center gap-3 text-[15px] text-[#8a8d93]">
                    <Lock className="size-[18px] shrink-0" strokeWidth={1.75} /> {m}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
