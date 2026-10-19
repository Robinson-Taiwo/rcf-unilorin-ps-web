"use client"

import { useState } from "react"
import { Check, Shield } from "lucide-react"
import Modal from "@/components/admin/modal"
import { adminButton, adminCaps } from "@/components/admin/ui"

type Account = { bank: string; accountName: string; accountNumber: string }

const line = (a: Account) => [a.bank, a.accountName, a.accountNumber].join(" · ")

// Figma "Confirm account change" (appears over Giving after "Save changes").
// The confirm button stays disabled until the finance-lead box is ticked.
export default function ConfirmAccountModal({
  open,
  onClose,
  onConfirm,
  label,
  before,
  after,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  label: string
  before: Account
  after: Account
}) {
  const [checked, setChecked] = useState(false)
  const [busy, setBusy] = useState(false)

  return (
    <Modal open={open} onClose={onClose} title="Confirm account change" icon={<Shield className="size-6" />}>
      <p className="mt-3 text-[15px] leading-[1.55] text-[#8a8d93]">
        This changes where members send their gifts. Check the new details with your finance lead before confirming.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <div className="rounded-[14px] bg-[#f2f2f2] px-5 py-4">
          <p className={`${adminCaps} mb-2`}>Before · {label}</p>
          <p className="text-[15px] text-[#1c1c1c]">{line(before)}</p>
        </div>
        <div className="rounded-[14px] border-[1.5px] border-[#00a8e8] bg-[#00a8e8]/10 px-5 py-4">
          <p className={`${adminCaps} mb-2`}>After · {label}</p>
          <p className="text-[15px] font-semibold text-[#1c1c1c]">{line(after)}</p>
        </div>
      </div>

      <label className="mt-5 flex cursor-pointer items-center gap-3 text-[15px] text-[#1c1c1c]">
        <span className="relative flex size-5 shrink-0">
          <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="peer size-full cursor-pointer appearance-none rounded-[5px] border-[1.5px] border-[#8a8d93] checked:border-[#00a8e8] checked:bg-[#00a8e8]" />
          <Check aria-hidden strokeWidth={3} className="pointer-events-none absolute inset-0 m-auto hidden size-3.5 text-white peer-checked:block" />
        </span>
        I have checked these details with the finance lead
      </label>

      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onClose} className={adminButton.neutral()}>Cancel</button>
        <button type="button" disabled={!checked || busy} onClick={async () => { setBusy(true); await onConfirm(); setBusy(false) }} className={adminButton.primary()}>{busy ? "Saving…" : "Confirm change"}</button>
      </div>

      <p className="mt-6 text-[13px] text-[#8a8d93]">Recorded in the Activity Log with your name and the time.</p>
    </Modal>
  )
}
