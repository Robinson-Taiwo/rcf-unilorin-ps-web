"use client"

import { useRef, useState, type ReactNode } from "react"
import { Plus } from "lucide-react"
import { useAdmin } from "@/components/admin/admin-shell"
import ModuleGate from "@/components/admin/module-gate"
import { AdminHeader, Segmented, Tag, TableScroll, adminButton, adminCard, cardTitle, th } from "@/components/admin/ui"
import { db, logActivity, must, useLoad } from "@/lib/admin/data"
import { can } from "@/lib/admin/permissions"

export type ContentStatus = "published" | "draft"
export type ContentRow = { id: string; title: string; status: ContentStatus } & Record<string, unknown>
export type ContentItem<R extends ContentRow = ContentRow> = { row: R; detail: string; cells: Record<string, string> }

type Column = { label: string; key: string; width: string }

export type FormProps<R extends ContentRow> = {
  editing: R | null
  formRef: React.RefObject<HTMLElement | null>
  // Called by the form after it has saved; clears the form and refreshes the list
  onSaved: (title: string, status: ContentStatus, isNew: boolean) => void
}

// Shared layout for Sermons and Events (Figma "Content" frames):
// list card with All / Published / Draft and Edit + Delete per row (Admins get Unpublish instead of Delete),
// and the add/edit form card on the right.
export default function ContentManager<R extends ContentRow>({
  noun,
  title,
  subtitle,
  table,
  columns,
  load,
  toItem,
  files,
  renderForm,
}: {
  noun: string
  title: string
  subtitle: string
  table: "sermons" | "events"
  columns: Column[]
  load: () => Promise<R[]>
  toItem: (row: R) => ContentItem<R>
  // Uploaded files to remove when a row is deleted
  files?: (row: R) => { bucket: "sermon-audio" | "site-media"; path: string | null }[]
  renderForm: (props: FormProps<R>) => ReactNode
}) {
  const user = useAdmin()
  const canDelete = can(user, "contentDelete")
  const [filter, setFilter] = useState<"all" | ContentStatus>("all")
  const [editing, setEditing] = useState<R | null>(null)
  const [error, setError] = useState("")
  const formRef = useRef<HTMLElement | null>(null)

  const { data, reload } = useLoad(load)
  const items = (data ?? []).map(toItem)
  const shown = items.filter((i) => filter === "all" || i.row.status === filter)
  // Column widths: title, the page's own columns, status, actions
  const template = `minmax(0,2fr) ${columns.map((c) => c.width).join(" ")} 0.9fr auto`

  function onSaved(itemTitle: string, status: ContentStatus, isNew: boolean) {
    logActivity(`${isNew ? (status === "published" ? "Published" : "Drafted") : "Edited"} the ${noun} “${itemTitle}”`, "content")
    setEditing(null)
    reload()
  }

  async function remove(row: R) {
    if (!window.confirm(`Delete “${row.title}”? This can't be undone.`)) return
    setError("")
    const res = await db().from(table).delete().eq("id", row.id)
    if (res.error) return setError(res.error.message)
    for (const f of files?.(row) ?? []) if (f.path) await db().storage.from(f.bucket).remove([f.path])
    await logActivity(`Deleted the ${noun} “${row.title}”`, "content")
    if (editing?.id === row.id) setEditing(null)
    reload()
  }

  async function unpublish(row: R) {
    setError("")
    try {
      must(await db().from(table).update({ status: "draft" }).eq("id", row.id).select().single())
      await logActivity(`Unpublished the ${noun} “${row.title}”`, "content")
      reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't unpublish.")
    }
  }

  function startAdd() {
    setEditing(null)
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    formRef.current?.querySelector("input")?.focus({ preventScroll: true })
  }

  return (
    <ModuleGate permission={table} moduleName={title}>
      <div className="flex flex-col gap-8">
        <AdminHeader
          pill="Content"
          title={title}
          subtitle={subtitle}
          action={
            <button type="button" onClick={startAdd} className={adminButton.primary()}>
              <Plus className="size-[18px]" /> Add {noun}
            </button>
          }
        />

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
          <section className={`${adminCard} flex flex-col gap-5 p-5 sm:p-7`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className={cardTitle}>All {noun}s</h2>
              <Segmented label="Filter" size="sm" options={[{ value: "all", label: "All" }, { value: "published", label: "Published" }, { value: "draft", label: "Draft" }] as const} value={filter} onChange={setFilter} />
            </div>

            <TableScroll minWidth={640}>
              <div className={`grid gap-4 border-b border-[#e0e0e1] pb-3 ${th}`} style={{ gridTemplateColumns: template }}>
                <span>{noun}</span>
                {columns.map((c) => <span key={c.key}>{c.label}</span>)}
                <span>Status</span>
                <span className="w-[164px]" />
              </div>
              <ul>
                {shown.map(({ row, detail, cells }) => (
                  <li key={row.id} className={`grid items-center gap-4 border-b border-[#e0e0e1] py-3.5 text-[15px] ${editing?.id === row.id ? "bg-[#00a8e8]/5" : ""}`} style={{ gridTemplateColumns: template }}>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-[#1c1c1c]">{row.title}</span>
                      <span className="truncate text-[13px] text-[#8a8d93]">{detail}</span>
                    </span>
                    {columns.map((c) => <span key={c.key} className="truncate text-[#242323]/85">{cells[c.key]}</span>)}
                    <Tag tone={row.status === "published" ? "green" : "grey"}>{row.status}</Tag>
                    <span className="flex w-[164px] justify-end gap-2">
                      <button type="button" onClick={() => { setEditing(row); formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }) }} className={adminButton.neutral("sm")}>Edit</button>
                      {canDelete ? (
                        <button type="button" onClick={() => remove(row)} className={adminButton.neutral("sm")}>Delete</button>
                      ) : row.status === "published" ? (
                        <button type="button" onClick={() => unpublish(row)} className={adminButton.neutral("sm")}>Unpublish</button>
                      ) : null}
                    </span>
                  </li>
                ))}
                {data && shown.length === 0 && <li className="py-10 text-center text-[15px] text-[#8a8d93]">Nothing here yet.</li>}
                {!data && <li className="py-10 text-center text-[15px] text-[#8a8d93]">Loading…</li>}
              </ul>
            </TableScroll>
            {error && <p role="alert" className="text-sm text-[#d32f2f]">{error}</p>}
            {!canDelete && <p className="text-[13px] text-[#8a8d93]">Only a Super Admin can delete. You can unpublish instead.</p>}
          </section>

          {renderForm({ editing, onSaved, formRef })}
        </div>
      </div>
    </ModuleGate>
  )
}

// The form card on the right: title, fields, then Save as draft / Publish.
// `onSubmit` does the saving; errors show under the fields.
export function ContentForm({
  formRef,
  heading,
  children,
  onSubmit,
  onCancel,
}: {
  formRef: React.RefObject<HTMLElement | null>
  heading: string
  children: ReactNode
  onSubmit: (status: ContentStatus) => Promise<void>
  onCancel?: () => void
}) {
  const [busy, setBusy] = useState<ContentStatus | null>(null)
  const [error, setError] = useState("")

  async function run(status: ContentStatus) {
    setBusy(status)
    setError("")
    try {
      await onSubmit(status)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save.")
    } finally {
      setBusy(null)
    }
  }

  return (
    <section ref={formRef} className={`${adminCard} flex scroll-mt-24 flex-col gap-5 p-5 sm:p-7`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className={cardTitle}>{heading}</h2>
        {onCancel && <button type="button" onClick={onCancel} className="text-[14px] text-[#8a8d93] hover:text-[#1c1c1c]">Cancel</button>}
      </div>
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          run("published")
        }}
      >
        {children}
        {error && <p role="alert" className="text-sm text-[#d32f2f]">{error}</p>}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            disabled={!!busy}
            onClick={(e) => {
              // Drafts still need the required fields
              if (e.currentTarget.form?.reportValidity()) run("draft")
            }}
            className={adminButton.neutral()}
          >
            {busy === "draft" ? "Saving…" : "Save as draft"}
          </button>
          <button type="submit" disabled={!!busy} className={adminButton.primary()}>{busy === "published" ? "Publishing…" : "Publish"}</button>
        </div>
      </form>
    </section>
  )
}
