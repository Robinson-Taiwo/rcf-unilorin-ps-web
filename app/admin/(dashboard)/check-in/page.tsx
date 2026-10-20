"use client"

import { useEffect, useState } from "react"
import { Download, Eye, RefreshCw, Search, Users } from "lucide-react"
import { useAdmin } from "@/components/admin/admin-shell"
import CheckInQr from "@/components/admin/checkin-qr"
import ModuleGate from "@/components/admin/module-gate"
import { AdminHeader, Avatar, Segmented, Switch, Tag, TableScroll, adminButton, adminCard, adminInput, cardTitle, th } from "@/components/admin/ui"
import { db, fmtDayYear, fmtTime, logActivity, must, todayLagos, useLoad } from "@/lib/admin/data"
import { downloadCsv } from "@/lib/admin/csv"

type Service = { key: string; name: string; time_label: string }
type Session = { id: string; service_key: string; service_date: string; code: string; is_open: boolean; checkins: { count: number }[] }

const daysAgo = (iso: string, n: number) => {
  const d = new Date(`${iso}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() - n)
  return d.toISOString().slice(0, 10)
}

// Figma "Check-In Control": set today's code per service, open/close check-in, live count, history.
export default function AdminCheckInPage() {
  const user = useAdmin()
  const today = todayLagos()
  const [service, setService] = useState("sunday")
  const [code, setCode] = useState("")
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  // Which service's names are shown (defaults to today's)
  const [viewing, setViewing] = useState<string | null>(null)
  const [who, setWho] = useState("")

  const { data, reload } = useLoad(async () => {
    const [services, sessions] = await Promise.all([
      db().from("services").select("key, name, time_label").order("sort"),
      db().from("checkin_sessions").select("id, service_key, service_date, code, is_open, checkins(count)").order("service_date", { ascending: false }).limit(30),
    ])
    return { services: must(services) as Service[], sessions: must(sessions) as Session[] }
  })

  const current = data?.services.find((s) => s.key === service)
  const todays = data?.sessions.find((s) => s.service_key === service && s.service_date === today) ?? null
  const lastWeek = data?.sessions.find((s) => s.service_key === service && s.service_date === daysAgo(today, 7)) ?? null

  // Live count + last check-in time for today's session, refreshed every 20 seconds
  const live = useLoad(async () => {
    if (!todays) return { count: 0, last: null as string | null }
    const res = await db().from("checkins").select("created_at", { count: "exact" }).eq("session_id", todays.id).order("created_at", { ascending: false }).limit(1)
    return { count: res.count ?? 0, last: (res.data?.[0]?.created_at as string | undefined) ?? null }
  }, [todays?.id])
  const reloadLive = live.reload
  useEffect(() => {
    if (!todays) return
    const t = setInterval(reloadLive, 20000)
    return () => clearInterval(t)
  }, [todays, reloadLive])

  // Show the saved code when switching service
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCode(todays?.code ?? "")
    setStatus("idle")
  }, [todays?.code, service])

  const digits = code.padEnd(3, " ").slice(0, 3).split("")
  const lastCount = lastWeek?.checkins[0]?.count ?? 0
  const percent = lastCount ? Math.round(((live.data?.count ?? 0) / lastCount) * 100) : 0

  function setDigit(i: number, value: string) {
    const d = value.replace(/[^0-9a-z]/gi, "").slice(-1).toUpperCase()
    setCode(digits.map((c, j) => (j === i ? d || " " : c)).join("").replace(/\s+$/, ""))
    setStatus("idle")
    if (d) (document.getElementById(`code-${i + 1}`) as HTMLInputElement | null)?.focus()
  }

  async function save() {
    setStatus("saving")
    const res = await db()
      .from("checkin_sessions")
      .upsert({ service_key: service, service_date: today, code, is_open: todays?.is_open ?? true, created_by: user.id }, { onConflict: "service_key,service_date" })
    if (res.error) return setStatus("error")
    await logActivity(`Set the ${current?.name ?? service} check-in code`, "check-in")
    setStatus("saved")
    reload()
  }

  async function toggleOpen(open: boolean) {
    if (!todays) return
    must(await db().from("checkin_sessions").update({ is_open: open }).eq("id", todays.id))
    await logActivity(`${open ? "Opened" : "Closed"} ${current?.name ?? service} check-in`, "check-in")
    reload()
  }

  const nameOf = (key: string) => data?.services.find((s) => s.key === key)

  // Names of everyone who checked in to the chosen service (refreshes with the live count)
  const shownSession = data?.sessions.find((s) => s.id === (viewing ?? todays?.id)) ?? null
  const people = useLoad(async () => {
    if (!shownSession) return []
    const res = await db().from("checkins").select("id, member_name, member_email, created_at").eq("session_id", shownSession.id).order("created_at")
    return must(res) as { id: number; member_name: string | null; member_email: string | null; created_at: string }[]
  }, [shownSession?.id, live.data?.count])
  const q = who.trim().toLowerCase()
  const shownPeople = (people.data ?? []).filter((p) => !q || `${p.member_name} ${p.member_email}`.toLowerCase().includes(q))
  const sessionLabel = shownSession ? `${nameOf(shownSession.service_key)?.name ?? shownSession.service_key} · ${fmtDayYear(`${shownSession.service_date}T12:00:00Z`)}` : ""

  return (
    <ModuleGate permission="check-in" moduleName="Check-In">
      <div className="flex flex-col gap-8">
        <AdminHeader
          pill="Check-in"
          title="Check-In Control"
          subtitle="Set the code you will announce in service, or show the QR code. Each phone can check in once per service."
          action={
            <a href="/check-in" target="_blank" rel="noreferrer" className={adminButton.outline()}>
              <Eye className="size-[18px]" /> Preview check-in page
            </a>
          }
        />

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <section className={`${adminCard} flex flex-col gap-6 p-5 sm:p-7`}>
            <h2 className={cardTitle}>Today&apos;s service code</h2>
            <Segmented label="Service" options={(data?.services ?? []).map((s) => ({ value: s.key, label: s.key }))} value={service} onChange={setService} />

            <div className="flex gap-3">
              {digits.map((d, i) => (
                <input
                  key={i}
                  id={`code-${i}`}
                  aria-label={`Code character ${i + 1}`}
                  autoCapitalize="characters"
                  value={d.trim()}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className="h-[92px] w-[76px] rounded-[16px] border-[1.5px] border-[#00a8e8] bg-[#e8e8e9] text-center font-serif text-[46px] text-[#1c1c1c] outline-none transition-shadow focus:ring-4 focus:ring-[#00a8e8]/20 sm:h-[104px] sm:w-[88px] sm:text-[52px]"
                />
              ))}
            </div>

            <p className="text-sm leading-[1.55] text-[#8a8d93]">
              {current ? `${current.name} · ${current.time_label}. ` : ""}Announce this code from the pulpit or show it on screen.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => { setCode(String(Math.floor(100 + Math.random() * 900))); setStatus("idle") }} className={adminButton.outline()}>
                <RefreshCw className="size-4" /> Generate new code
              </button>
              <button type="button" onClick={save} disabled={code.length !== 3 || status === "saving"} className={adminButton.primary()}>
                {status === "saving" ? "Saving…" : status === "saved" ? "Saved" : "Save code"}
              </button>
              {status === "error" && <span className="text-sm text-[#d32f2f]">Couldn&apos;t save. Try again.</span>}
            </div>

            <div className="flex items-center gap-4 rounded-[16px] bg-[#f2f2f2] p-4">
              <Switch checked={todays?.is_open ?? false} onChange={toggleOpen} label="Check-in open" />
              <span className="flex flex-col gap-0.5">
                <span className="text-[15px] font-semibold text-[#1c1c1c]">
                  {!todays ? "No code saved for today" : todays.is_open ? "Check-in is open" : "Check-in is closed"}
                </span>
                <span className="text-[13px] text-[#8a8d93]">
                  {!todays ? "Save a code to open check-in." : todays.is_open ? "Turn off to stop new check-ins. The code stays saved." : "Turn on to let members check in with the code."}
                </span>
              </span>
            </div>
          </section>

          <div className="flex flex-col gap-5">
          <section className={`${adminCard} flex flex-col gap-5 p-5 sm:p-7`}>
            <h2 className={cardTitle}>Live attendance</h2>
            <p className="font-serif text-[72px] leading-none font-semibold tracking-[-0.03em] text-[#1c1c1c] sm:text-[88px]">{live.data?.count ?? 0}</p>
            <p className="text-[15px] text-[#8a8d93]">people checked in so far</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#e8e8e9]">
              <div className="h-full rounded-full bg-[#00a8e8] transition-[width] duration-700" style={{ width: `${Math.min(percent, 100)}%` }} />
            </div>
            <p className="text-[13px] text-[#8a8d93]">
              {lastCount ? `${percent}% of last week (${lastCount}).` : "No count from last week to compare."}
              {live.data?.last ? ` Last check-in ${fmtTime(live.data.last)}.` : ""}
            </p>
          </section>

          {todays ? (
            <CheckInQr code={todays.code} serviceName={current?.name ?? service} dateLabel={fmtDayYear(`${today}T12:00:00Z`)} open={todays.is_open} />
          ) : (
            <section className={`${adminCard} p-5 text-[14px] leading-[1.55] text-[#8a8d93] sm:p-7`}>Save today&apos;s code to get a QR code members can scan.</section>
          )}
          </div>
        </div>

        {shownSession && (
          <section id="who-checked-in" className={`${adminCard} flex scroll-mt-24 flex-col gap-5 p-5 sm:p-7`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-1">
                <h2 className={cardTitle}>Who checked in</h2>
                <p className="text-[13px] text-[#8a8d93]">{sessionLabel} · {people.data?.length ?? 0} people</p>
              </div>
              <div className="flex w-full flex-wrap gap-3 sm:w-auto">
                <label className="relative min-w-0 flex-1 sm:w-[240px] sm:flex-none">
                  <Search className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#8a8d93]" />
                  <input value={who} onChange={(e) => setWho(e.target.value)} placeholder="Search names" aria-label="Search names" className={`${adminInput} pl-11`} />
                </label>
                <button
                  type="button"
                  disabled={!people.data?.length}
                  onClick={() =>
                    downloadCsv(`attendance-${shownSession.service_key}-${shownSession.service_date}.csv`, [
                      ["Name", "Email", "Checked in at"],
                      ...(people.data ?? []).map((p) => [p.member_name ?? "", p.member_email ?? "", fmtTime(p.created_at)]),
                    ])
                  }
                  className={adminButton.neutral()}
                >
                  <Download className="size-4" /> Export names
                </button>
              </div>
            </div>
            <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 xl:grid-cols-3">
              {shownPeople.map((p) => (
                <li key={p.id} className="flex min-w-0 items-center gap-3 border-b border-[#e0e0e1] py-3">
                  <Avatar name={p.member_name || "Guest"} tone={p.member_name ? "blue" : "grey"} />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-[15px] text-[#1c1c1c]">{p.member_name || "Checked in before names were collected"}</span>
                    <span className="truncate text-[13px] text-[#8a8d93]">{p.member_email ?? ""}</span>
                  </span>
                  <span className="shrink-0 text-[13px] text-[#8a8d93]">{fmtTime(p.created_at)}</span>
                </li>
              ))}
              {people.data && shownPeople.length === 0 && (
                <li className="col-span-full py-8 text-center text-[15px] text-[#8a8d93]">{q ? `No one matches “${who}”.` : "No one has checked in yet."}</li>
              )}
            </ul>
          </section>
        )}

        <section className={`${adminCard} flex flex-col gap-5 p-5 sm:p-7`}>
          <div className="flex items-center justify-between gap-4">
            <h2 className={cardTitle}>Attendance history</h2>
            <button
              type="button"
              disabled={!data?.sessions.length}
              onClick={() =>
                downloadCsv("attendance-history.csv", [
                  ["Service", "Date", "Code", "Check-ins", "Status"],
                  ...(data?.sessions ?? []).map((s) => [nameOf(s.service_key)?.name ?? s.service_key, s.service_date, s.code, s.checkins[0]?.count ?? 0, s.is_open ? "Open" : "Closed"]),
                ])
              }
              className={adminButton.neutral("sm")}
            >
              <Download className="size-4" /> Export CSV
            </button>
          </div>
          <TableScroll minWidth={760}>
            <div className={`grid grid-cols-[2fr_1.5fr_0.8fr_1fr_0.9fr_auto] gap-4 border-b border-[#e0e0e1] pb-3 ${th}`}>
              <span>Service</span><span>Date</span><span>Code</span><span>Check-ins</span><span>Status</span><span className="w-[96px]" />
            </div>
            <ul>
              {(data?.sessions ?? []).slice(0, 12).map((s) => (
                <li key={s.id} className="grid grid-cols-[2fr_1.5fr_0.8fr_1fr_0.9fr_auto] items-center gap-4 border-b border-[#e0e0e1] py-4 text-[15px]">
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[#1c1c1c]">{nameOf(s.service_key)?.name ?? s.service_key}</span>
                    <span className="text-[13px] text-[#8a8d93]">{nameOf(s.service_key)?.time_label}</span>
                  </span>
                  <span className="text-[#242323]/85">{fmtDayYear(`${s.service_date}T12:00:00Z`)}</span>
                  <span className="font-semibold text-[#1c1c1c]">{s.code}</span>
                  <span className="text-[#242323]/85">{s.checkins[0]?.count ?? 0}</span>
                  <Tag tone={s.is_open ? "green" : "grey"}>{s.is_open ? "Open" : "Closed"}</Tag>
                  <span className="flex w-[96px] justify-end">
                    <button
                      type="button"
                      aria-pressed={shownSession?.id === s.id}
                      onClick={() => { setViewing(s.id); setWho(""); document.getElementById("who-checked-in")?.scrollIntoView({ behavior: "smooth", block: "start" }) }}
                      className={shownSession?.id === s.id ? adminButton.primary("sm") : adminButton.neutral("sm")}
                    >
                      <Users className="size-4" /> Names
                    </button>
                  </span>
                </li>
              ))}
              {data && data.sessions.length === 0 && <li className="py-10 text-center text-[15px] text-[#8a8d93]">No services yet. Save today&apos;s code to start.</li>}
            </ul>
          </TableScroll>
        </section>
      </div>
    </ModuleGate>
  )
}
