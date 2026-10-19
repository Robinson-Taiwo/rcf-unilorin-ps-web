"use client"

import { useState } from "react"
import { useAdmin } from "@/components/admin/admin-shell"
import ContentManager, { ContentForm, type ContentRow, type FormProps } from "@/components/admin/content-manager"
import Dropzone from "@/components/admin/dropzone"
import { adminInput, adminLabel } from "@/components/admin/ui"
import { db, fmtShort, must, uploadFile } from "@/lib/admin/data"

type Sermon = ContentRow & { speaker: string | null; preached_on: string; audio_path: string | null; duration_seconds: number | null; image_path: string | null }

const minutes = (s: number | null) => (s ? `${Math.round(s / 60)} min` : "")

// Length of an audio file, read in the browser before upload
function audioLength(file: File) {
  return new Promise<number | null>((resolve) => {
    const a = new Audio()
    const url = URL.createObjectURL(file)
    a.preload = "metadata"
    a.onloadedmetadata = () => { URL.revokeObjectURL(url); resolve(Number.isFinite(a.duration) ? Math.round(a.duration) : null) }
    a.onerror = () => { URL.revokeObjectURL(url); resolve(null) }
    a.src = url
  })
}

// Figma "Sermons": list + "Add sermon" form (title, speaker, date, audio upload).
export default function AdminSermonsPage() {
  return (
    <ContentManager<Sermon>
      noun="sermon"
      title="Sermons"
      subtitle="Upload audio and publish messages members can download."
      table="sermons"
      columns={[
        { label: "Speaker", key: "speaker", width: "1fr" },
        { label: "Date", key: "date", width: "0.6fr" },
      ]}
      load={async () => must(await db().from("sermons").select("*").order("preached_on", { ascending: false })) as Sermon[]}
      toItem={(row) => ({
        row,
        detail: row.audio_path ? ["Audio", minutes(row.duration_seconds)].filter(Boolean).join(" · ") : "No audio yet",
        cells: { speaker: row.speaker ?? "—", date: fmtShort(`${row.preached_on}T12:00:00+01:00`) },
      })}
      files={(row) => [{ bucket: "sermon-audio", path: row.audio_path }, { bucket: "site-media", path: row.image_path }]}
      renderForm={(props) => <SermonForm key={props.editing?.id ?? "new"} {...props} />}
    />
  )
}

function SermonForm({ editing, onSaved, formRef }: FormProps<Sermon>) {
  const user = useAdmin()
  const [title, setTitle] = useState(editing?.title ?? "")
  const [speaker, setSpeaker] = useState(editing?.speaker ?? "")
  const [date, setDate] = useState(editing?.preached_on ?? "")
  const [audio, setAudio] = useState<File | null>(null)

  async function submit(status: "draft" | "published") {
    if (status === "published" && !audio && !editing?.audio_path) throw new Error("Add the audio before publishing, or save as a draft.")
    const row: Record<string, unknown> = { title: title.trim(), speaker: speaker.trim() || null, preached_on: date, status, updated_at: new Date().toISOString() }
    if (audio) {
      row.audio_path = await uploadFile("sermon-audio", date.slice(0, 7) || "misc", audio)
      row.duration_seconds = await audioLength(audio)
    }
    if (editing) {
      must(await db().from("sermons").update(row).eq("id", editing.id).select().single())
      if (audio && editing.audio_path) await db().storage.from("sermon-audio").remove([editing.audio_path])
    } else {
      must(await db().from("sermons").insert({ ...row, created_by: user.id }).select().single())
    }
    onSaved(title.trim(), status, !editing)
  }

  return (
    <ContentForm formRef={formRef} heading={editing ? "Edit sermon" : "Add sermon"} onSubmit={submit} onCancel={editing ? () => onSaved(editing.title, editing.status, false) : undefined}>
      <div className="flex flex-col gap-2.5">
        <label htmlFor="sermon-title" className={adminLabel}>Title</label>
        <input id="sermon-title" required maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. The Weight of a Calling" className={adminInput} />
      </div>
      <div className="flex flex-col gap-2.5">
        <label htmlFor="sermon-speaker" className={adminLabel}>Speaker</label>
        <input id="sermon-speaker" maxLength={80} value={speaker} onChange={(e) => setSpeaker(e.target.value)} placeholder="e.g. Pastor A." className={adminInput} />
      </div>
      <div className="flex flex-col gap-2.5">
        <label htmlFor="sermon-date" className={adminLabel}>Date</label>
        <input id="sermon-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={adminInput} />
      </div>
      <Dropzone
        title={editing?.audio_path ? "Replace audio (.mp3) or browse" : "Drop audio (.mp3) or browse"}
        hint={editing?.audio_path ? "Leave empty to keep the current audio" : "Thumbnail is added automatically"}
        accept="audio/mpeg,audio/*"
        onFile={setAudio}
      />
    </ContentForm>
  )
}
