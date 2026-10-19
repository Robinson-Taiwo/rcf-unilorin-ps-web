"use client"

import { useState } from "react"
import { Archive, Send } from "lucide-react"
import { useAdmin } from "@/components/admin/admin-shell"
import ModuleGate from "@/components/admin/module-gate"
import { AdminHeader, Avatar, Notice, Segmented, adminButton, adminCard, adminLabel, adminTextarea } from "@/components/admin/ui"
import { db, fmtDayTime, logActivity, must, timeAgo, useLoad } from "@/lib/admin/data"

type Reply = { id: string; body: string; created_at: string; author: { full_name: string | null } | null }
type Message = { id: string; name: string; email: string; subject: string; body: string; is_read: boolean; created_at: string; replies: Reply[] }

// Figma "Messages": inbox list (All / Unread) on the left, the open message with a reply box on the right.
// Replies are saved here and sent from the admin's own email app (no mail server yet).
export default function AdminMessagesPage() {
  const user = useAdmin()
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const [openId, setOpenId] = useState<string | null>(null)
  const [reply, setReply] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const { data, reload, setData } = useLoad(async () => {
    const res = await db()
      .from("messages")
      .select("id, name, email, subject, body, is_read, created_at, replies:message_replies(id, body, created_at, author:profiles(full_name))")
      .eq("archived", false)
      .order("created_at", { ascending: false })
      .order("created_at", { referencedTable: "message_replies" })
    return must(res) as unknown as Message[]
  })

  const messages = data ?? []
  const shown = messages.filter((m) => filter === "all" || !m.is_read)
  const open = messages.find((m) => m.id === openId) ?? null

  async function select(m: Message) {
    setOpenId(m.id)
    setReply("")
    setError("")
    if (!m.is_read) {
      setData((d) => d?.map((x) => (x.id === m.id ? { ...x, is_read: true } : x)) ?? d)
      await db().from("messages").update({ is_read: true }).eq("id", m.id)
    }
  }

  async function archive(m: Message) {
    setError("")
    const res = await db().from("messages").update({ archived: true }).eq("id", m.id)
    if (res.error) return setError(res.error.message)
    await logActivity(`Archived a message from ${m.name}`, "messages")
    setOpenId(null)
    reload()
  }

  async function send(m: Message) {
    const body = reply.trim()
    if (!body) return
    setBusy(true)
    setError("")
    const res = await db().from("message_replies").insert({ message_id: m.id, body, sent_by: user.id })
    setBusy(false)
    if (res.error) return setError(res.error.message)
    await logActivity(`Replied to ${m.name}`, "messages")
    // Hand the reply to the admin's email app, addressed and quoted
    const quoted = `${body}\n\n— ${user.name}, RCF Unilorin\n\n> ${m.body.split("\n").join("\n> ")}`
    window.location.href = `mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent(`Re: ${m.subject}`)}&body=${encodeURIComponent(quoted)}`
    setReply("")
    reload()
  }

  return (
    <ModuleGate permission="messages" moduleName="Messages">
      <div className="flex flex-col gap-8">
        <AdminHeader pill="Inbox" title="Messages" subtitle="Everything sent through the Contact page." />

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">

          {/* Inbox */}
          <section className={`${adminCard} flex flex-col gap-4 p-4 sm:p-5`}>
            <div className="flex items-center justify-between gap-3 px-1">
              <h2 className="font-serif text-[22px] font-semibold text-[#1c1c1c]">Inbox</h2>
              <Segmented label="Filter" size="sm" options={[{ value: "all", label: "All" }, { value: "unread", label: "Unread" }] as const} value={filter} onChange={setFilter} />
            </div>
            <ul className="flex flex-col gap-2.5">
              {shown.map((m) => {
                const active = m.id === openId
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => select(m)}
                      className={`flex w-full cursor-pointer items-start gap-3 rounded-[16px] border-[1.5px] p-3.5 text-left transition-colors ${
                        active ? "border-[#00a8e8] bg-[#00a8e8]/10" : "border-transparent bg-[#f2f2f2] hover:bg-[#ebebec]"
                      }`}
                    >
                      <Avatar name={m.name} tone="grey" />
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="truncate text-[15px] font-medium text-[#1c1c1c]">{m.name}</span>
                        <span className={`truncate text-sm ${!m.is_read ? "font-semibold text-[#1c1c1c]" : "text-[#242323]/85"}`}>{m.subject}</span>
                        <span className="line-clamp-2 text-[13px] text-[#8a8d93]">{m.body}</span>
                      </span>
                      <span className="flex shrink-0 flex-col items-end gap-2 pt-1">
                        <span className="text-[12px] text-[#8a8d93]">{timeAgo(m.created_at)}</span>
                        {!m.is_read && <span className="size-2 rounded-full bg-[#00a8e8]" aria-label="Unread" />}
                      </span>
                    </button>
                  </li>
                )
              })}
              {data && shown.length === 0 && <li className="py-10 text-center text-[15px] text-[#8a8d93]">{filter === "unread" ? "No unread messages." : "No messages yet."}</li>}
              {!data && <li className="py-10 text-center text-[15px] text-[#8a8d93]">Loading…</li>}
            </ul>
          </section>

          {/* Open message */}
          {open ? (
            <section className={`${adminCard} flex flex-col gap-5 p-5 sm:p-7`}>
              <div className="flex items-center gap-3">
                <Avatar name={open.name} tone="grey" size="lg" />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-[15px] font-semibold text-[#1c1c1c]">{open.name}</span>
                  <span className="truncate text-[13px] text-[#8a8d93]">
                    <a href={`mailto:${open.email}`} className="hover:text-[#00a8e8]">{open.email}</a> · {fmtDayTime(open.created_at)}
                  </span>
                </span>
              </div>
              <h2 className="font-serif text-[26px] font-semibold break-words text-[#1c1c1c]">{open.subject}</h2>
              <p className="max-w-[560px] text-[15px] leading-[1.65] break-words whitespace-pre-line text-[#1c1c1c]">{open.body}</p>

              {open.replies.length > 0 && (
                <ul className="flex flex-col gap-2.5">
                  {open.replies.map((r) => (
                    <li key={r.id} className="rounded-[16px] bg-[#00a8e8]/10 px-4 py-3">
                      <p className="text-[13px] text-[#8a8d93]">{r.author?.full_name ?? "An admin"} replied · {timeAgo(r.created_at)}</p>
                      <p className="mt-1 text-[15px] leading-[1.6] whitespace-pre-line text-[#1c1c1c]">{r.body}</p>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-col gap-2.5">
                <label htmlFor="reply" className={adminLabel}>Your reply</label>
                <textarea id="reply" rows={5} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a short, warm reply…" className={adminTextarea} />
              </div>
              <Notice icon={<Send className="size-4" />}>Sending saves the reply here and opens your email app with it ready to send.</Notice>
              {error && <p role="alert" className="text-sm text-[#d32f2f]">{error}</p>}

              <div className="flex flex-wrap items-center justify-end gap-3">
                <button type="button" onClick={() => archive(open)} className={adminButton.neutral()}>
                  <Archive className="size-4" /> Archive
                </button>
                <button type="button" disabled={!reply.trim() || busy} onClick={() => send(open)} className={adminButton.primary()}>
                  {busy ? "Saving…" : "Send reply"}
                </button>
              </div>
            </section>
          ) : (
            <section className={`${adminCard} flex items-center justify-center p-10 text-[15px] text-[#8a8d93]`}>Select a message to read it.</section>
          )}
        </div>
      </div>
    </ModuleGate>
  )
}
