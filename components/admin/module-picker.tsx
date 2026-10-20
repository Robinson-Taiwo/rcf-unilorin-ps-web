"use client"

import { useState } from "react"
import { Check, KeyRound } from "lucide-react"
import Modal from "@/components/admin/modal"
import { adminButton, adminLabel } from "@/components/admin/ui"
import { allModules, modules, type Module } from "@/lib/admin/permissions"

// Tick the pages an Admin can open. Used when inviting and from "Access" on Users and roles.
export function ModulePicker({ value, onChange }: { value: Module[]; onChange: (v: Module[]) => void }) {
  const all = value.length === allModules.length
  const toggle = (m: Module) => onChange(value.includes(m) ? value.filter((x) => x !== m) : allModules.filter((x) => x === m || value.includes(x)))

  return (
    <fieldset className="flex flex-col gap-2.5">
      <div className="mb-1 flex items-center justify-between gap-3">
        <legend className={adminLabel}>Pages they can open</legend>
        <button type="button" onClick={() => onChange(all ? [] : [...allModules])} className="text-[13px] font-semibold text-[#00a8e8] hover:underline">
          {all ? "Clear all" : "Select all"}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {modules.map((m) => {
          const on = value.includes(m.key)
          return (
            <label
              key={m.key}
              className={`flex cursor-pointer items-start gap-3 rounded-[14px] border px-4 py-3 transition-colors ${on ? "border-[#00a8e8] bg-[#00a8e8]/10" : "border-[#8a8d93]/40 bg-[#f2f2f2] hover:border-[#8a8d93]"}`}
            >
              <span className="relative mt-0.5 flex size-5 shrink-0">
                <input type="checkbox" checked={on} onChange={() => toggle(m.key)} className="peer size-full cursor-pointer appearance-none rounded-[5px] border-[1.5px] border-[#8a8d93] checked:border-[#00a8e8] checked:bg-[#00a8e8] focus-visible:ring-4 focus-visible:ring-[#00a8e8]/20" />
                <Check aria-hidden strokeWidth={3} className="pointer-events-none absolute inset-0 m-auto hidden size-3.5 text-white peer-checked:block" />
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[14px] font-semibold text-[#1c1c1c]">{m.label}</span>
                <span className="text-[12px] leading-[1.4] text-[#8a8d93]">{m.detail}</span>
              </span>
            </label>
          )
        })}
      </div>
      <p className="text-[12px] text-[#8a8d93]">Every admin also sees the Dashboard. Giving, Users and roles, the Activity Log and deleting stay with Super Admins.</p>
    </fieldset>
  )
}

// Short summary for the users table: "All pages", "Transport", "Check-In, Transport", "3 pages"
export function accessSummary(value: readonly string[]) {
  if (value.length === allModules.length) return "All pages"
  if (value.length === 0) return "Dashboard only"
  const labels = modules.filter((m) => value.includes(m.key)).map((m) => m.label)
  return labels.length <= 2 ? labels.join(", ") : `${labels.length} pages`
}

export function AccessModal({ name, initial, onClose, onSave }: { name: string; initial: Module[]; onClose: () => void; onSave: (v: Module[]) => Promise<void> }) {
  const [value, setValue] = useState<Module[]>(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function save() {
    setBusy(true)
    setError("")
    try {
      await onSave(value)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal open onClose={onClose} title={`${name}'s access`} icon={<KeyRound className="size-6" />}>
      <p className="mt-3 text-[15px] leading-[1.55] text-[#8a8d93]">Choose what they see in the dashboard. Their menu updates the next time they reload or sign in; the database applies it straight away.</p>
      <div className="mt-6">
        <ModulePicker value={value} onChange={setValue} />
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-[#d32f2f]">{error}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onClose} className={adminButton.neutral()}>Cancel</button>
        <button type="button" disabled={busy} onClick={save} className={adminButton.primary()}>{busy ? "Saving…" : "Save access"}</button>
      </div>
    </Modal>
  )
}
