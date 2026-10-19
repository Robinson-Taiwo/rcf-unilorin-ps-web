"use client"

import { useState } from "react"
import { Download, Search } from "lucide-react"
import ModuleGate from "@/components/admin/module-gate"
import { AdminHeader, Avatar, Segmented, Tag, TableScroll, adminButton, adminCard, adminInput, th, type TagTone } from "@/components/admin/ui"
import { db, fmtDayTime, fmtWhen, must, useLoad } from "@/lib/admin/data"
import { downloadCsv } from "@/lib/admin/csv"

type LogModule = "content" | "giving" | "check-in" | "users" | "transport" | "testimonies" | "messages"
type Entry = { id: number; action: string; module: LogModule; created_at: string; actor: { full_name: string; email: string } | null }

const moduleTag: Record<LogModule, TagTone> = { content: "navy", giving: "yellow", "check-in": "blue", users: "grey", transport: "blue", testimonies: "green", messages: "grey" }

const filters = [
  { value: "all", label: "All" },
  { value: "giving", label: "Giving" },
  { value: "users", label: "Users" },
  { value: "content", label: "Content" },
  { value: "check-in", label: "Check-in" },
  { value: "transport", label: "Transport" },
] as const

const PAGE = 100
const who = (e: Entry) => e.actor?.full_name || e.actor?.email || "Removed admin"

// Figma "Activity log" (Super Admin only): read-only list of who changed what, with filters, search and CSV export.
export default function AdminActivityPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all")
  const [query, setQuery] = useState("")
  const [limit, setLimit] = useState(PAGE)

  const { data } = useLoad(async () => {
    let q = db().from("activity_log").select("id, action, module, created_at, actor:profiles(full_name, email)").order("created_at", { ascending: false }).limit(limit)
    if (filter !== "all") q = q.eq("module", filter)
    return must(await q) as unknown as Entry[]
  }, [filter, limit])

  const text = query.trim().toLowerCase()
  const shown = (data ?? []).filter((e) => !text || `${who(e)} ${e.action}`.toLowerCase().includes(text))

  const gridCols = "grid-cols-[1.4fr_2.4fr_1fr_1.3fr]"

  return (
    <ModuleGate permission="activity" moduleName="the Activity Log">
      <div className="flex flex-col gap-8">
        <AdminHeader
          pill="Administration · Super Admin only"
          title="Activity log"
          subtitle="Who changed what, and when. Entries cannot be edited or deleted."
          action={
            <button
              type="button"
              disabled={!shown.length}
              onClick={() => downloadCsv("activity-log.csv", [["Who", "Action", "Module", "When"], ...shown.map((e) => [who(e), e.action, e.module, fmtDayTime(e.created_at)])])}
              className={adminButton.outline()}
            >
              <Download className="size-4" /> Export CSV
            </button>
          }
        />

        <section className={`${adminCard} flex flex-col gap-5 p-5 sm:p-7`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Segmented label="Module" size="sm" options={filters} value={filter} onChange={(v) => { setFilter(v); setLimit(PAGE) }} />
            <label className="relative w-full sm:w-[280px]">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#8a8d93]" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the log" aria-label="Search the log" className={`${adminInput} pl-11`} />
            </label>
          </div>

          <TableScroll minWidth={760}>
            <div className={`grid ${gridCols} gap-4 border-b border-[#e0e0e1] pb-3 ${th}`}>
              <span>Who</span><span>Action</span><span>Module</span><span>When</span>
            </div>
            <ul>
              {shown.map((e) => (
                <li key={e.id} className={`grid ${gridCols} items-center gap-4 border-b border-[#e0e0e1] py-3.5 text-[15px]`}>
                  <span className="flex min-w-0 items-center gap-3">
                    <Avatar name={who(e)} tone={e.actor ? "blue" : "grey"} />
                    <span className="truncate text-[#1c1c1c]">{who(e)}</span>
                  </span>
                  <span className="text-[#1c1c1c]">{e.action}</span>
                  <Tag tone={moduleTag[e.module]}>{e.module}</Tag>
                  <span className="text-[#242323]/85" title={fmtDayTime(e.created_at)}>{fmtWhen(e.created_at)}</span>
                </li>
              ))}
              {data && shown.length === 0 && <li className="py-10 text-center text-[15px] text-[#8a8d93]">{data.length ? "No entries match." : "Nothing recorded yet."}</li>}
              {!data && <li className="py-10 text-center text-[15px] text-[#8a8d93]">Loading…</li>}
            </ul>
          </TableScroll>

          {data && data.length >= limit && (
            <div className="flex justify-center">
              <button type="button" onClick={() => setLimit((l) => l + PAGE)} className={adminButton.neutral("sm")}>Load older entries</button>
            </div>
          )}
        </section>
      </div>
    </ModuleGate>
  )
}
