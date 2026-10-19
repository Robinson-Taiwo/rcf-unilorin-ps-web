"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { useAdmin } from "@/components/admin/admin-shell"
import InviteAdminModal from "@/components/admin/invite-admin-modal"
import ModuleGate from "@/components/admin/module-gate"
import { AdminHeader, Avatar, Tag, TableScroll, adminButton, adminCard, th } from "@/components/admin/ui"
import { db, logActivity, must, timeAgo, useLoad } from "@/lib/admin/data"
import { roleLabel, type Role } from "@/lib/admin/permissions"

type Profile = { id: string; full_name: string; email: string; role: Role; status: "active" | "invited" | "inactive"; last_active_at: string | null; created_at: string }

const statusTag = { active: "green", invited: "yellow", inactive: "grey" } as const

// Server-side actions that need the service-role key (see app/api/admin/users/route.ts)
export async function usersApi(body: Record<string, string>) {
  const res = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
  const json = (await res.json().catch(() => ({}))) as { error?: string }
  if (!res.ok) throw new Error(json.error ?? "Something went wrong.")
}

// Figma "Users and roles" (Super Admin only): admins table with per-row actions, "Invite admin", role summaries.
export default function AdminUsersPage() {
  const me = useAdmin()
  const [inviting, setInviting] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null)

  const { data, reload } = useLoad(async () => must(await db().from("profiles").select("*").order("created_at")) as Profile[])
  const users = data ?? []

  async function run(u: Profile, label: string, fn: () => Promise<unknown>, done?: string) {
    setBusy(u.id)
    setNotice(null)
    try {
      await fn()
      if (done) setNotice({ tone: "ok", text: done })
      reload()
    } catch (err) {
      setNotice({ tone: "error", text: err instanceof Error ? err.message : `Couldn't ${label}.` })
    } finally {
      setBusy(null)
    }
  }

  const update = (u: Profile, change: Partial<Profile>, action: string) =>
    run(u, "update", async () => {
      must(await db().from("profiles").update(change).eq("id", u.id).select().single())
      await logActivity(action, "users")
    })

  const name = (u: Profile) => u.full_name || u.email.split("@")[0]
  const gridCols = "grid-cols-[2fr_1fr_0.9fr_1fr_auto]"

  return (
    <ModuleGate permission="users" moduleName="Users and roles">
      <div className="flex flex-col gap-8">
        <AdminHeader
          pill="Administration · Super Admin only"
          title="Users and roles"
          subtitle="Control who can sign in and what they can do."
          action={
            <button type="button" onClick={() => setInviting(true)} className={adminButton.primary()}>
              <Plus className="size-[18px]" /> Invite admin
            </button>
          }
        />

        <section className={`${adminCard} flex flex-col gap-5 p-5 sm:p-7`}>
          <h2 className="font-serif text-[22px] font-semibold text-[#1c1c1c]">Admins · {users.length}</h2>
          {notice && <p role="status" className={`text-sm ${notice.tone === "ok" ? "text-[#5c8e13]" : "text-[#d32f2f]"}`}>{notice.text}</p>}
          <TableScroll minWidth={860}>
            <div className={`grid ${gridCols} gap-4 border-b border-[#e0e0e1] pb-3 ${th}`}>
              <span>Name</span><span>Role</span><span>Status</span><span>Last active</span><span className="w-[240px]" />
            </div>
            <ul>
              {users.map((u) => {
                const isMe = u.id === me.id
                const disabled = busy === u.id
                return (
                  <li key={u.id} className={`grid ${gridCols} items-center gap-4 border-b border-[#e0e0e1] py-3.5 text-[15px]`}>
                    <span className="flex min-w-0 items-center gap-3">
                      <Avatar name={name(u)} tone={u.status === "active" ? (u.role === "super_admin" ? "yellow" : "blue") : "grey"} />
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="truncate text-[#1c1c1c]">{u.full_name || "Not set yet"}</span>
                        <span className="truncate text-[13px] text-[#8a8d93]">{u.email}</span>
                      </span>
                    </span>
                    <Tag tone={u.role === "super_admin" ? "yellow" : "blue"}>{roleLabel[u.role]}</Tag>
                    <Tag tone={statusTag[u.status]}>{u.status}</Tag>
                    <span className="text-[#242323]/85">{isMe ? "Now" : u.last_active_at ? timeAgo(u.last_active_at) : "—"}</span>
                    <span className="flex w-[240px] justify-end gap-2">
                      {isMe ? (
                        <span className="text-[15px] text-[#8a8d93]">You</span>
                      ) : u.status === "active" ? (
                        <>
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => {
                              const role: Role = u.role === "admin" ? "super_admin" : "admin"
                              if (window.confirm(`Make ${name(u)} ${roleLabel[role]}?`)) update(u, { role }, `Changed ${name(u)}'s role to ${roleLabel[role]}`)
                            }}
                            className={adminButton.neutral("sm")}
                          >
                            Change role
                          </button>
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => window.confirm(`Deactivate ${name(u)}? They won't be able to sign in.`) && update(u, { status: "inactive" }, `Deactivated ${name(u)}`)}
                            className={adminButton.neutral("sm")}
                          >
                            Deactivate
                          </button>
                        </>
                      ) : u.status === "invited" ? (
                        <>
                          <button type="button" disabled={disabled} onClick={() => run(u, "resend the invite", () => usersApi({ action: "resend", id: u.id }), `Invite sent again to ${u.email}.`)} className={adminButton.neutral("sm")}>
                            Resend invite
                          </button>
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => window.confirm(`Cancel the invite for ${u.email}?`) && run(u, "cancel the invite", () => usersApi({ action: "cancel", id: u.id }))}
                            className={adminButton.neutral("sm")}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button type="button" disabled={disabled} onClick={() => update(u, { status: "active" }, `Reactivated ${name(u)}`)} className={adminButton.neutral("sm")}>Reactivate</button>
                      )}
                    </span>
                  </li>
                )
              })}
              {!data && <li className="py-10 text-center text-[15px] text-[#8a8d93]">Loading…</li>}
            </ul>
          </TableScroll>
        </section>

        {/* Role summaries */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={`${adminCard} flex flex-col items-start gap-3 p-6`}>
            <Tag tone="yellow">Super Admin</Tag>
            <p className="text-[15px] leading-[1.55] text-[#1c1c1c]">Every module, including Giving, Users and roles, the Activity Log, and all deletions.</p>
          </div>
          <div className={`${adminCard} flex flex-col items-start gap-3 p-6`}>
            <Tag tone="blue">Admin</Tag>
            <p className="text-[15px] leading-[1.55] text-[#1c1c1c]">Check-In, Transport, Sermons, Events, Testimonies and Messages. No Giving, user management, or deletions.</p>
          </div>
        </div>
      </div>

      {inviting && (
        <InviteAdminModal
          open
          onClose={() => setInviting(false)}
          onInvite={async (email, role) => {
            await usersApi({ action: "invite", email, role })
            setNotice({ tone: "ok", text: `Invite sent to ${email}.` })
            reload()
          }}
        />
      )}
    </ModuleGate>
  )
}
