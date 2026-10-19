"use client"

import { useState } from "react"
import { Check, Eye, Lock, Mail, Pencil, Phone } from "lucide-react"
import { useAdmin } from "@/components/admin/admin-shell"
import ModuleGate from "@/components/admin/module-gate"
import { AdminHeader, Avatar, Notice, Segmented, Tag, adminButton, adminCard, adminTextarea, cardTitle } from "@/components/admin/ui"
import { db, logActivity, must, timeAgo, useLoad } from "@/lib/admin/data"

type Submission = {
  id: string
  type: "testimony" | "prayer"
  name: string | null
  anonymous: boolean
  message: string
  contact: string | null
  status: "pending" | "approved" | "rejected" | "prayed"
  reviewed_at: string | null
  created_at: string
}

const tones = ["blue", "yellow", "grey"] as const
const shownName = (s: Submission) => (s.anonymous || !s.name?.trim() ? "Anonymous" : s.name.trim())
const short = (text: string, n = 40) => `“${text.split(/[.!?]/)[0].slice(0, n).trim()}…”`
const contactHref = (c: string) => (c.includes("@") ? `mailto:${c}` : `tel:${c.replace(/[^\d+]/g, "")}`)

// Figma "Review submissions": Testimonies tab (approve / edit / reject, recently published) and
// Prayer requests tab (contact / mark as prayed for, prayed-for list). Prayer requests are never published.
export default function AdminTestimoniesPage() {
  const user = useAdmin()
  const [tab, setTab] = useState<"testimonies" | "prayer">("testimonies")
  const [editing, setEditing] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [error, setError] = useState("")

  const { data, reload, setData } = useLoad(async () => {
    const [pending, done] = await Promise.all([
      db().from("submissions").select("*").eq("status", "pending").order("created_at"),
      db().from("submissions").select("*").in("status", ["approved", "prayed"]).order("reviewed_at", { ascending: false }).limit(12),
    ])
    return { pending: must(pending) as Submission[], done: must(done) as Submission[] }
  })

  const testimonies = data?.pending.filter((s) => s.type === "testimony") ?? []
  const prayers = data?.pending.filter((s) => s.type === "prayer") ?? []
  const side = (data?.done ?? []).filter((s) => (tab === "testimonies" ? s.status === "approved" : s.status === "prayed")).slice(0, 5)

  async function review(s: Submission, status: Submission["status"]) {
    setError("")
    const message = drafts[s.id]?.trim()
    // Take it off the list straight away
    setData((d) => (d ? { ...d, pending: d.pending.filter((x) => x.id !== s.id) } : d))
    const res = await db()
      .from("submissions")
      .update({ status, reviewed_by: user.id, reviewed_at: new Date().toISOString(), ...(message && message !== s.message ? { message } : {}) })
      .eq("id", s.id)
    if (res.error) {
      setError(res.error.message)
      return reload()
    }
    const who = shownName(s)
    await logActivity(
      status === "approved" ? `Approved a testimony from ${who}` : status === "rejected" ? `Rejected a testimony from ${who}` : `Marked a prayer request from ${who} as prayed for`,
      "testimonies",
    )
    setEditing(null)
    reload()
  }

  return (
    <ModuleGate permission="testimonies" moduleName="Testimonies & Prayer">
      <div className="flex flex-col gap-8">
        <AdminHeader
          pill="Testimonies and prayer"
          title="Review submissions"
          subtitle={
            tab === "testimonies"
              ? "Approved testimonies appear on the home page. Nothing is published automatically."
              : "Prayer requests are private. They are never published on the website."
          }
          action={
            <a href="/#testimonies" target="_blank" rel="noreferrer" className={adminButton.outline()}>
              <Eye className="size-[18px]" /> View on the site
            </a>
          }
        />

        <Segmented
          label="Submission type"
          options={[
            { value: "testimonies", label: `Testimonies · ${testimonies.length}` },
            { value: "prayer", label: `Prayer requests · ${prayers.length}` },
          ] as const}
          value={tab}
          onChange={setTab}
        />

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]">

          {/* Queue */}
          <section className={`${adminCard} flex flex-col gap-5 p-5 sm:p-7`}>
            <h2 className={cardTitle}>{tab === "testimonies" ? "Waiting for review" : "Prayer requests"}</h2>
            {error && <p role="alert" className="text-sm text-[#d32f2f]">{error}</p>}

            {tab === "testimonies" ? (
              <ul className="flex flex-col gap-3">
                {testimonies.map((t, i) => (
                  <li key={t.id} className="flex flex-col gap-4 rounded-[18px] bg-[#f2f2f2] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-3">
                        <Avatar name={t.name || "Anonymous"} tone={t.anonymous || !t.name ? "grey" : tones[i % 2]} />
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span className="truncate text-[15px] font-medium text-[#1c1c1c]">{t.name?.trim() || "No name given"}</span>
                          <span className="text-[13px] text-[#8a8d93]">{timeAgo(t.created_at)}</span>
                        </span>
                      </span>
                      <Tag tone="blue">Testimony</Tag>
                    </div>
                    {editing === t.id ? (
                      <textarea
                        autoFocus
                        rows={4}
                        maxLength={600}
                        value={drafts[t.id] ?? t.message}
                        onChange={(e) => setDrafts((d) => ({ ...d, [t.id]: e.target.value }))}
                        className={`${adminTextarea} bg-white`}
                      />
                    ) : (
                      <p className="text-[15px] leading-[1.6] whitespace-pre-line text-[#1c1c1c]">{drafts[t.id] ?? t.message}</p>
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[13px] text-[#8a8d93]">Will show as: {shownName(t)}</span>
                      <span className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => review(t, "rejected")} className={adminButton.neutral("sm")}>Reject</button>
                        <button type="button" onClick={() => setEditing(editing === t.id ? null : t.id)} className={adminButton.outline("sm")}>
                          <Pencil className="size-3.5" /> {editing === t.id ? "Done" : "Edit"}
                        </button>
                        <button type="button" onClick={() => review(t, "approved")} className={adminButton.primary("sm")}>
                          <Check className="size-4" /> Approve
                        </button>
                      </span>
                    </div>
                  </li>
                ))}
                {data && testimonies.length === 0 && <li className="py-10 text-center text-[15px] text-[#8a8d93]">All caught up — nothing waiting for review.</li>}
                {!data && <li className="py-10 text-center text-[15px] text-[#8a8d93]">Loading…</li>}
              </ul>
            ) : (
              <ul className="flex flex-col gap-3">
                {prayers.map((p, i) => (
                  <li key={p.id} className="flex flex-col gap-4 rounded-[18px] bg-[#f2f2f2] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-3">
                        <Avatar name={shownName(p)} tone={shownName(p) === "Anonymous" ? "grey" : tones[i % 2]} />
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span className="truncate text-[15px] font-medium text-[#1c1c1c]">{shownName(p)}</span>
                          <span className="text-[13px] text-[#8a8d93]">{timeAgo(p.created_at)}</span>
                        </span>
                      </span>
                      <Tag tone="yellow">Prayer request</Tag>
                    </div>
                    <p className="text-[15px] leading-[1.6] whitespace-pre-line text-[#1c1c1c]">{p.message}</p>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="min-w-0 truncate text-[13px] text-[#8a8d93]">{p.contact ? `Contact: ${p.contact}` : "No contact left"}</span>
                      <span className="flex flex-wrap gap-2">
                        {p.contact ? (
                          <a href={contactHref(p.contact)} className={adminButton.neutral("sm")}>
                            {p.contact.includes("@") ? <Mail className="size-4" /> : <Phone className="size-4" />} Contact
                          </a>
                        ) : (
                          <button type="button" disabled className={adminButton.neutral("sm")}><Mail className="size-4" /> Contact</button>
                        )}
                        <button type="button" onClick={() => review(p, "prayed")} className={adminButton.primary("sm")}>
                          <Check className="size-4" /> Mark as prayed for
                        </button>
                      </span>
                    </div>
                  </li>
                ))}
                {data && prayers.length === 0 && <li className="py-10 text-center text-[15px] text-[#8a8d93]">No prayer requests waiting.</li>}
                {!data && <li className="py-10 text-center text-[15px] text-[#8a8d93]">Loading…</li>}
              </ul>
            )}
          </section>

          {/* Side list */}
          <section className={`${adminCard} flex flex-col gap-4 p-5 sm:p-7`}>
            <h2 className={cardTitle}>{tab === "testimonies" ? "Recently published" : "Prayed for"}</h2>
            <ul className="flex flex-col">
              {side.map((s) => (
                <li key={s.id} className="flex flex-col items-start gap-2 border-b border-[#e0e0e1] py-3.5 first:pt-0">
                  <span className="text-[15px] text-[#1c1c1c]">{tab === "testimonies" ? short(s.message) : `${short(s.message, 28)} — ${shownName(s).split(" ")[0]}`}</span>
                  <span className="flex items-center gap-2">
                    <Tag tone="green">{tab === "testimonies" ? "Published" : "Prayed"}</Tag>
                    {s.reviewed_at && <span className="text-[13px] text-[#8a8d93]">{timeAgo(s.reviewed_at)}</span>}
                  </span>
                </li>
              ))}
              {data && side.length === 0 && <li className="py-3 text-[15px] text-[#8a8d93]">Nothing yet.</li>}
            </ul>
            <Notice icon={<Lock className="size-4" />}>
              {tab === "testimonies"
                ? "Names shown only if the person did not choose to stay anonymous."
                : "Visible to admins only. Contact details are never shown publicly."}
            </Notice>
          </section>
        </div>
      </div>
    </ModuleGate>
  )
}
