"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import { Eye, Plus, Shield, Trash2 } from "lucide-react"
import ConfirmAccountModal from "@/components/admin/confirm-account-modal"
import Dropzone from "@/components/admin/dropzone"
import Modal from "@/components/admin/modal"
import ModuleGate from "@/components/admin/module-gate"
import { AdminHeader, Notice, Segmented, Switch, Tag, adminButton, adminCaps, adminCard, adminInput, adminLabel, cardTitle } from "@/components/admin/ui"
import { db, logActivity, must, uploadFile, useLoad } from "@/lib/admin/data"
import { needImage } from "@/lib/giving"

type Tab = "offerings" | "tithe" | "project"
type Account = { bank: string; accountName: string; accountNumber: string }
type Accounts = Record<Tab, Account>
type Need = { id: string; name: string; image_path: string | null; visible: boolean; sort: number }

const blank: Account = { bank: "", accountName: "", accountNumber: "" }
const empty: Accounts = { offerings: blank, tithe: blank, project: blank }

const tabs = [
  { value: "offerings", label: "Offerings" },
  { value: "tithe", label: "Tithe" },
  { value: "project", label: "Project" },
] as const

const fields: { key: keyof Account; label: string }[] = [
  { key: "bank", label: "Bank" },
  { key: "accountName", label: "Account name" },
  { key: "accountNumber", label: "Account number" },
]

// Figma "Giving · Super Admin only": edit account details per tab with a live preview of the public card,
// confirm before saving, and show/hide the "Other church needs" tiles.
export default function AdminGivingPage() {
  const [tab, setTab] = useState<Tab>("offerings")
  const [draft, setDraft] = useState<Accounts | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState("")

  const { data, reload, setData } = useLoad(async () => {
    const [acc, needs] = await Promise.all([
      db().from("giving_accounts").select("kind, bank, account_name, account_number"),
      db().from("church_needs").select("id, name, image_path, visible, sort").order("sort"),
    ])
    const accounts = { ...empty }
    for (const a of must(acc) as { kind: Tab; bank: string; account_name: string; account_number: string }[]) {
      accounts[a.kind] = { bank: a.bank, accountName: a.account_name, accountNumber: a.account_number }
    }
    setDraft(accounts)
    return { accounts, needs: must(needs) as Need[] }
  })

  const saved = data?.accounts ?? empty
  const current = draft ?? empty
  const needs = data?.needs ?? []

  const changed = JSON.stringify(current[tab]) !== JSON.stringify(saved[tab])
  const tabLabel = tabs.find((t) => t.value === tab)!.label

  async function saveAccount() {
    setError("")
    const a = current[tab]
    // The database records this change in the Activity Log itself
    const res = await db().from("giving_accounts").update({ bank: a.bank.trim(), account_name: a.accountName.trim(), account_number: a.accountNumber.trim(), updated_at: new Date().toISOString() }).eq("kind", tab)
    setConfirming(false)
    if (res.error) return setError(res.error.message)
    reload()
  }

  async function toggleNeed(n: Need, visible: boolean) {
    setData((d) => (d ? { ...d, needs: d.needs.map((x) => (x.id === n.id ? { ...x, visible } : x)) } : d))
    const res = await db().from("church_needs").update({ visible }).eq("id", n.id)
    if (res.error) return reload()
    await logActivity(`${visible ? "Showed" : "Hid"} “${n.name}” on the Giving page`, "giving")
  }

  async function removeNeed(n: Need) {
    if (!window.confirm(`Remove “${n.name}” from church needs?`)) return
    const res = await db().from("church_needs").delete().eq("id", n.id)
    if (res.error) return setError(res.error.message)
    await logActivity(`Removed the church need “${n.name}”`, "giving")
    reload()
  }

  return (
    <ModuleGate permission="giving" moduleName="Giving">
      <div className="flex flex-col gap-8">
        <AdminHeader
          pill="Giving · Super Admin only"
          title="Giving"
          subtitle="Account details members see on the public Giving page. Changes are confirmed and logged."
          action={
            <a href="/giving" target="_blank" rel="noreferrer" className={adminButton.outline()}>
              <Eye className="size-[18px]" /> Preview Giving page
            </a>
          }
        />

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">

          {/* Account details form */}
          <section className={`${adminCard} flex flex-col gap-5 p-5 sm:p-7`}>
            <h2 className={cardTitle}>Account details</h2>
            <Segmented label="Account" options={tabs} value={tab} onChange={setTab} />

            {fields.map((f) => (
              <div key={f.key} className="flex flex-col gap-2.5">
                <label htmlFor={`acc-${f.key}`} className={adminLabel}>{f.label}</label>
                <input
                  id={`acc-${f.key}`}
                  value={current[tab][f.key]}
                  disabled={!data}
                  inputMode={f.key === "accountNumber" ? "numeric" : undefined}
                  maxLength={f.key === "accountNumber" ? 10 : 80}
                  onChange={(e) => setDraft((d) => ({ ...(d ?? empty), [tab]: { ...(d ?? empty)[tab], [f.key]: f.key === "accountNumber" ? e.target.value.replace(/\D/g, "") : e.target.value } }))}
                  className={adminInput}
                />
              </div>
            ))}

            <Notice icon={<Shield className="size-4" />}>Saving asks you to confirm and records the change in the Activity Log.</Notice>
            {error && <p role="alert" className="text-sm text-[#d32f2f]">{error}</p>}

            <div className="flex justify-end gap-3">
              <button type="button" disabled={!changed} onClick={() => setDraft((d) => ({ ...(d ?? empty), [tab]: saved[tab] }))} className={adminButton.neutral()}>
                Discard
              </button>
              <button type="button" disabled={!changed} onClick={() => setConfirming(true)} className={adminButton.primary()}>
                Save changes
              </button>
            </div>
          </section>

          {/* Live preview of the public card */}
          <section className="flex flex-col gap-5 rounded-[24px] bg-[#1d1c1c] p-5 sm:p-7">
            <p className={`${adminCaps} text-white/70`}>Live preview · Public page</p>
            <div className="flex flex-col gap-3 rounded-[20px] bg-white p-5">
              <div className="flex w-full items-center gap-1 rounded-full bg-[#e8e8e9] p-1">
                {tabs.map((t) => (
                  <span key={t.value} className={`flex h-9 flex-1 items-center justify-center rounded-full text-[12px] font-medium uppercase tracking-[0.06em] ${t.value === tab ? "bg-[#00a8e8] text-white" : "text-[#00a8e8]"}`}>
                    {t.label}
                  </span>
                ))}
              </div>
              {[
                ["Bank", current[tab].bank],
                ["Account Name", current[tab].accountName],
                ["Account Number", current[tab].accountNumber],
              ].map(([k, v]) => (
                <div key={k} className="flex h-[52px] items-center justify-between gap-4 rounded-full border border-[#8a8d93]/50 bg-[#e8e8e9] px-5 text-[14px]">
                  <span className="text-[#8a8d93]">{k}</span>
                  <span className="truncate font-semibold text-[#1c1c1c]">{v || "—"}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Other church needs */}
        <section className={`${adminCard} flex flex-col gap-5 p-5 sm:p-7`}>
          <div className="flex items-center justify-between gap-4">
            <h2 className={cardTitle}>Other church needs</h2>
            <button type="button" onClick={() => setAdding(true)} className={adminButton.outline("sm")}><Plus className="size-4" /> Add a need</button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {needs.map((n) => (
              <div key={n.id} className="flex flex-col gap-3 rounded-[18px] bg-[#f2f2f2] p-3">
                <div className={`relative aspect-[16/9] overflow-hidden rounded-[14px] bg-[#1d1c1c] transition-opacity ${n.visible ? "" : "opacity-50"}`}>
                  <Image src={needImage(n)} alt="" fill sizes="(min-width: 1280px) 240px, 50vw" className="object-cover" />
                </div>
                <div className="flex items-center justify-between gap-3 px-1">
                  <span className="text-[15px] text-[#1c1c1c]">{n.name}</span>
                  <Switch checked={n.visible} label={`Show ${n.name}`} onChange={(v) => toggleNeed(n, v)} />
                </div>
                <div className="flex items-center justify-between px-1 pb-1">
                  <Tag tone={n.visible ? "green" : "grey"}>{n.visible ? "Visible" : "Hidden"}</Tag>
                  <button type="button" aria-label={`Remove ${n.name}`} onClick={() => removeNeed(n)} className="flex size-8 items-center justify-center rounded-full text-[#8a8d93] transition-colors hover:bg-[#d32f2f]/10 hover:text-[#d32f2f]">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
            {data && needs.length === 0 && <p className="col-span-full py-6 text-center text-[15px] text-[#8a8d93]">No church needs yet.</p>}
          </div>
        </section>
      </div>

      {confirming && (
        <ConfirmAccountModal
          open
          label={tabLabel}
          before={saved[tab]}
          after={current[tab]}
          onClose={() => setConfirming(false)}
          onConfirm={saveAccount}
        />
      )}
      {adding && <AddNeedModal next={needs.length + 1} onClose={() => setAdding(false)} onAdded={reload} />}
    </ModuleGate>
  )
}

function AddNeedModal({ next, onClose, onAdded }: { next: number; onClose: () => void; onAdded: () => void }) {
  const [name, setName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [visible, setVisible] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError("")
    try {
      const image_path = file ? await uploadFile("site-media", "needs", file) : null
      must(await db().from("church_needs").insert({ name: name.trim(), image_path, visible, sort: next }).select().single())
      await logActivity(`Added the church need “${name.trim()}”`, "giving")
      onAdded()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't add the need.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal open onClose={onClose} title="Add a need" icon={<Plus className="size-6" />}>
      <form onSubmit={submit} className="mt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2.5">
          <label htmlFor="need-name" className={adminLabel}>Name</label>
          <input id="need-name" required maxLength={60} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Church bus fund" className={adminInput} />
        </div>
        <Dropzone title="Add an image" hint="JPG or PNG, landscape works best" accept="image/*" onFile={setFile} />
        <div className="flex items-center justify-between gap-4 rounded-[14px] bg-[#f2f2f2] px-5 py-4">
          <span className="text-[15px] text-[#1c1c1c]">Show on the Giving page</span>
          <Switch checked={visible} onChange={setVisible} label="Show on the Giving page" />
        </div>
        {error && <p role="alert" className="text-sm text-[#d32f2f]">{error}</p>}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className={adminButton.neutral()}>Cancel</button>
          <button type="submit" disabled={busy || !name.trim()} className={adminButton.primary()}>{busy ? "Adding…" : "Add need"}</button>
        </div>
      </form>
    </Modal>
  )
}
