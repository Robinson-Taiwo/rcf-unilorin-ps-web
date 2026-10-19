"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { supabaseBrowser } from "@/lib/supabase/client"

export const db = () => supabaseBrowser()

// Loads data on mount and whenever `deps` change. `reload()` refetches after a change.
export function useLoad<T>(load: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  // Always call the latest `load`; refetch when the values in `deps` change
  const loadRef = useRef(load)
  useEffect(() => {
    loadRef.current = load
  })
  const key = JSON.stringify(deps)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(() => loadRef.current(), [key])

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      setData(await run())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [run])

  useEffect(() => {
    let cancelled = false
    run()
      .then((d) => {
        if (!cancelled) {
          setData(d)
          setError(null)
        }
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Something went wrong"))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [run])

  return { data, error, loading, reload, setData }
}

// Throws Supabase errors so useLoad / try-catch can show them
export function must<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message)
  return res.data as T
}

// Writes an Activity Log entry as the signed-in admin
export const logActivity = (action: string, module: "content" | "giving" | "check-in" | "users" | "transport" | "testimonies" | "messages") =>
  db().rpc("log_activity", { p_action: action, p_module: module })

/* ---------- Dates (all shown in Lagos time) ---------- */

const tz = "Africa/Lagos"
const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { timeZone: tz, ...o }).format(d)

export const fmtDay = (iso: string) => fmt(new Date(iso), { weekday: "short", day: "numeric", month: "short" }) // Sun, 11 Oct
export const fmtDayYear = (iso: string) => fmt(new Date(iso), { weekday: "short", day: "numeric", month: "short", year: "numeric" })
export const fmtShort = (iso: string) => fmt(new Date(iso), { month: "short", day: "numeric" }) // Oct 4
export const fmtTime = (iso: string) => fmt(new Date(iso), { hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase()
export const fmtDayTime = (iso: string) => `${fmtDay(iso)} · ${fmtTime(iso)}`

// Today in Lagos as YYYY-MM-DD
export const todayLagos = () => new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date())

export function timeAgo(iso: string | null | undefined) {
  if (!iso) return "—"
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return "Just now"
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} hr${h > 1 ? "s" : ""} ago`
  const d = Math.round(h / 24)
  if (d === 1) return "Yesterday"
  if (d < 7) return `${d} days ago`
  const w = Math.round(d / 7)
  if (w < 5) return `${w} week${w > 1 ? "s" : ""} ago`
  return fmtDayYear(iso)
}

// "Today, 9:41 AM" / "Yesterday, 6:30 PM" / "Mon, 5 Oct, 2:20 PM"
export function fmtWhen(iso: string) {
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date(iso))
  const today = todayLagos()
  const yesterday = new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date(Date.now() - 864e5))
  const label = day === today ? "Today" : day === yesterday ? "Yesterday" : fmtDay(iso)
  return `${label}, ${fmtTime(iso)}`
}

// Upload a file to a public storage bucket and return its path
export async function uploadFile(bucket: "sermon-audio" | "site-media", folder: string, file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin"
  const path = `${folder}/${crypto.randomUUID()}.${ext}`
  must(await db().storage.from(bucket).upload(path, file, { contentType: file.type, upsert: false }))
  return path
}

export const publicUrl = (bucket: "sermon-audio" | "site-media", path: string) => db().storage.from(bucket).getPublicUrl(path).data.publicUrl
