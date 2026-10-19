"use client"

import { useState } from "react"
import { useAdmin } from "@/components/admin/admin-shell"
import ContentManager, { ContentForm, type ContentRow, type FormProps } from "@/components/admin/content-manager"
import Dropzone from "@/components/admin/dropzone"
import { Switch, adminInput, adminLabel, adminTextarea } from "@/components/admin/ui"
import { db, fmtShort, must, uploadFile } from "@/lib/admin/data"
import { joinLagos, splitLagos } from "@/lib/admin/transport"

type Event = ContentRow & { starts_at: string; place: string | null; description: string | null; poster_path: string | null; featured: boolean }

// Figma "Events and announcements": list + "Add event" form (title, date and time, place, description, poster).
export default function AdminEventsPage() {
  return (
    <ContentManager<Event>
      noun="event"
      title="Events and announcements"
      subtitle="Add what is coming up. Published items appear on the Events page."
      table="events"
      columns={[
        { label: "Date", key: "date", width: "0.6fr" },
        { label: "Place", key: "place", width: "0.9fr" },
      ]}
      load={async () => must(await db().from("events").select("*").order("starts_at", { ascending: false })) as Event[]}
      toItem={(row) => ({
        row,
        detail: row.featured ? "Featured" : new Date(row.starts_at) < new Date() ? "Past" : row.description?.slice(0, 40) || "Upcoming",
        cells: { date: fmtShort(row.starts_at), place: row.place ?? "—" },
      })}
      files={(row) => [{ bucket: "site-media", path: row.poster_path }]}
      renderForm={(props) => <EventForm key={props.editing?.id ?? "new"} {...props} />}
    />
  )
}

function EventForm({ editing, onSaved, formRef }: FormProps<Event>) {
  const user = useAdmin()
  const start = editing ? splitLagos(editing.starts_at) : { date: "", time: "" }
  const [title, setTitle] = useState(editing?.title ?? "")
  const [date, setDate] = useState(start.date)
  const [time, setTime] = useState(start.time)
  const [place, setPlace] = useState(editing?.place ?? "")
  const [description, setDescription] = useState(editing?.description ?? "")
  const [featured, setFeatured] = useState(editing?.featured ?? false)
  const [poster, setPoster] = useState<File | null>(null)

  async function submit(status: "draft" | "published") {
    if (poster && poster.size > 5 * 1024 * 1024) throw new Error("The poster is over 5 MB.")
    const row: Record<string, unknown> = {
      title: title.trim(),
      starts_at: joinLagos(date, time || "17:00"),
      place: place.trim() || null,
      description: description.trim() || null,
      featured,
      status,
    }
    if (poster) row.poster_path = await uploadFile("site-media", "events", poster)
    // Only one featured event at a time
    if (featured) await db().from("events").update({ featured: false }).eq("featured", true).neq("id", editing?.id ?? "00000000-0000-0000-0000-000000000000")
    if (editing) {
      must(await db().from("events").update(row).eq("id", editing.id).select().single())
      if (poster && editing.poster_path) await db().storage.from("site-media").remove([editing.poster_path])
    } else {
      must(await db().from("events").insert({ ...row, created_by: user.id }).select().single())
    }
    onSaved(title.trim(), status, !editing)
  }

  return (
    <ContentForm formRef={formRef} heading={editing ? "Edit event" : "Add event"} onSubmit={submit} onCancel={editing ? () => onSaved(editing.title, editing.status, false) : undefined}>
      <div className="flex flex-col gap-2.5">
        <label htmlFor="event-title" className={adminLabel}>Title</label>
        <input id="event-title" required maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Word and Prayer Conference" className={adminInput} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <div className="flex flex-col gap-2.5">
          <label htmlFor="event-date" className={adminLabel}>Date</label>
          <input id="event-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={adminInput} />
        </div>
        <div className="flex flex-col gap-2.5">
          <label htmlFor="event-time" className={adminLabel}>Time</label>
          <input id="event-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className={adminInput} />
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <label htmlFor="event-place" className={adminLabel}>Place</label>
        <input id="event-place" maxLength={80} value={place} onChange={(e) => setPlace(e.target.value)} placeholder="e.g. Auditorium" className={adminInput} />
      </div>
      <div className="flex flex-col gap-2.5">
        <label htmlFor="event-description" className={adminLabel}>Description</label>
        <textarea id="event-description" rows={4} maxLength={600} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short line members will read" className={adminTextarea} />
      </div>
      <div className="flex items-center justify-between gap-4 rounded-[14px] bg-[#f2f2f2] px-5 py-4">
        <span className="flex flex-col gap-0.5">
          <span className="text-[15px] text-[#1c1c1c]">Feature on the Events page</span>
          <span className="text-[13px] text-[#8a8d93]">Replaces the current featured event</span>
        </span>
        <Switch checked={featured} onChange={setFeatured} label="Feature this event" />
      </div>
      <Dropzone
        title={editing?.poster_path ? "Replace poster image" : "Add poster image"}
        hint={editing?.poster_path ? "Leave empty to keep the current poster" : "JPG or PNG, up to 5 MB"}
        accept="image/jpeg,image/png,image/webp"
        onFile={setPoster}
      />
    </ContentForm>
  )
}
