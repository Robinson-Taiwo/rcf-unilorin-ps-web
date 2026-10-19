"use client"

import { useState, type FormEvent } from "react"
import { Mail } from "lucide-react"
import Modal from "@/components/admin/modal"
import { adminButton, adminInput, adminLabel } from "@/components/admin/ui"
import type { Role } from "@/lib/admin/permissions"

const roles: { value: Role; title: string; detail: string }[] = [
  { value: "admin", title: "Admin", detail: "Check-In, Transport, Sermons, Events, Testimonies and Messages. No Giving, users, or deletions." },
  { value: "super_admin", title: "Super Admin", detail: "Full access, including Giving, Users and roles, and the Activity Log." },
]

// Figma "Invite an admin" (opens over Users and roles after "Invite admin").
export default function InviteAdminModal({ open, onClose, onInvite }: { open: boolean; onClose: () => void; onInvite: (email: string, role: Role) => Promise<void> }) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("admin")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError("")
    try {
      await onInvite(email.trim(), role)
      setEmail("")
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send the invite.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Invite an admin">
      <form onSubmit={submit} className="mt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2.5">
          <label htmlFor="invite-email" className={adminLabel}>Email</label>
          <div className="relative">
            <input id="invite-email" type="email" required placeholder="name@rcfunilorin.org" value={email} onChange={(e) => setEmail(e.target.value)} className={`${adminInput} pr-12`} />
            <Mail className="pointer-events-none absolute top-1/2 right-5 size-[18px] -translate-y-1/2 text-[#8a8d93]" />
          </div>
        </div>

        <fieldset className="flex flex-col gap-2.5">
          <legend className={`${adminLabel} mb-2.5`}>Role</legend>
          {roles.map((r) => {
            const selected = role === r.value
            return (
              <label
                key={r.value}
                className={`flex cursor-pointer items-start gap-4 rounded-[16px] border px-5 py-4 transition-colors ${
                  selected ? "border-[#00a8e8] bg-[#00a8e8]/10" : "border-[#8a8d93]/50 bg-[#f2f2f2] hover:border-[#8a8d93]"
                }`}
              >
                <input type="radio" name="role" value={r.value} checked={selected} onChange={() => setRole(r.value)} className="peer sr-only" />
                <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-[#00a8e8]" : "border-[#8a8d93]"} peer-focus-visible:ring-4 peer-focus-visible:ring-[#00a8e8]/20`}>
                  {selected && <span className="size-2.5 rounded-full bg-[#00a8e8]" />}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-[15px] font-semibold text-[#1c1c1c]">{r.title}</span>
                  <span className="text-[13px] leading-[1.5] text-[#8a8d93]">{r.detail}</span>
                </span>
              </label>
            )
          })}
        </fieldset>

        <p className="text-[13px] text-[#8a8d93]">They get an email link to set a password. Invites expire after 24 hours; you can resend one.</p>
        {error && <p role="alert" className="text-sm text-[#d32f2f]">{error}</p>}

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className={adminButton.neutral()}>Cancel</button>
          <button type="submit" disabled={busy} className={adminButton.primary()}>{busy ? "Sending…" : "Send invite"}</button>
        </div>
      </form>
    </Modal>
  )
}
