import type { StaticImageData } from "next/image"
import { storageUrl, supabasePublic } from "@/lib/supabase/public"
import sermonPoster from "@/public/the-very-life-of-prayer.png"
import eventPoster from "@/public/doctrine-of-christ.png"

// Published content for the public pages. Each call fails soft (empty list) so a database hiccup
// never takes the site down.

const tz = "Africa/Lagos"
const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { timeZone: tz, ...o }).format(d)

export type PublicSermon = { id: string; image: StaticImageData | string; duration: string; title: string; date: string; audioUrl: string }
export type PublicEvent = {
  id: string
  image: StaticImageData | string
  title: string
  date: string // Saturday, 24 October 2026
  shortDate: string // 24 Oct 2026
  time: string // 5:00 PM
  place: string
  description: string[]
  featured: boolean
}
export type PublicTestimony = { id: string; quote: string; by: string }
export type PublicTrip = { id: string; direction: "school_to_church" | "church_to_school"; departs_at: string; day: string; time: string; pickup: string; seats_left: number }

function duration(seconds: number | null) {
  if (!seconds) return "Audio"
  const h = Math.floor(seconds / 3600)
  const m = Math.round((seconds % 3600) / 60)
  return h ? `${h}hr${m ? ` ${m}mins` : ""}` : `${m} mins`
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

export const getSermons = (limit?: number) =>
  safe(async () => {
    let q = supabasePublic()
      .from("sermons")
      .select("id, title, preached_on, audio_path, duration_seconds, image_path")
      .eq("status", "published")
      .not("audio_path", "is", null)
      .order("preached_on", { ascending: false })
    if (limit) q = q.limit(limit)
    const { data, error } = await q
    if (error) throw error
    return (data ?? []).map((s): PublicSermon => ({
      id: s.id,
      image: s.image_path ? storageUrl("site-media", s.image_path) : sermonPoster,
      duration: duration(s.duration_seconds),
      title: s.title,
      date: fmt(new Date(`${s.preached_on}T12:00:00+01:00`), { month: "long", day: "numeric", year: "numeric" }),
      audioUrl: storageUrl("sermon-audio", s.audio_path!),
    }))
  }, [] as PublicSermon[])

type EventRow = { id: string; title: string; starts_at: string; place: string | null; description: string | null; poster_path: string | null; featured: boolean }

function toEvent(e: EventRow): PublicEvent {
  const d = new Date(e.starts_at)
  return {
    id: e.id,
    image: e.poster_path ? storageUrl("site-media", e.poster_path) : eventPoster,
    title: e.title,
    date: fmt(d, { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    shortDate: fmt(d, { day: "numeric", month: "short", year: "numeric" }),
    time: fmt(d, { hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase(),
    place: e.place ?? "RCF auditorium",
    description: (e.description ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    featured: e.featured,
  }
}

const eventCols = "id, title, starts_at, place, description, poster_path, featured"

// Upcoming events first (featured on top), soonest first
export const getEvents = (limit?: number) =>
  safe(async () => {
    const since = new Date(Date.now() - 12 * 3600e3).toISOString()
    let q = supabasePublic().from("events").select(eventCols).eq("status", "published").gte("starts_at", since).order("featured", { ascending: false }).order("starts_at")
    if (limit) q = q.limit(limit)
    const { data, error } = await q
    if (error) throw error
    return (data ?? []).map(toEvent)
  }, [] as PublicEvent[])

export const getEvent = (id: string) =>
  safe(async () => {
    if (!/^[0-9a-f-]{36}$/i.test(id)) return null
    const { data } = await supabasePublic().from("events").select(eventCols).eq("status", "published").eq("id", id).maybeSingle()
    return data ? toEvent(data) : null
  }, null)

export const getTestimonies = (limit = 6) =>
  safe(async () => {
    const { data, error } = await supabasePublic().from("published_testimonies").select("id, display_name, message").order("reviewed_at", { ascending: false }).limit(limit)
    if (error) throw error
    return (data ?? []).map((t): PublicTestimony => ({ id: t.id, quote: t.message, by: t.display_name }))
  }, [] as PublicTestimony[])

// Open trips on the next day that has any
export const getNextTrips = () =>
  safe(async () => {
    const { data, error } = await supabasePublic()
      .from("trip_availability")
      .select("id, direction, departs_at, pickup, seats_left")
      .eq("is_open", true)
      .gte("departs_at", new Date().toISOString())
      .order("departs_at")
      .limit(10)
    if (error) throw error
    const trips = (data ?? []).map((t): PublicTrip => {
      const d = new Date(t.departs_at)
      return { ...t, day: fmt(d, { weekday: "long", day: "numeric", month: "long" }), time: fmt(d, { hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase() }
    })
    return trips.filter((t) => t.day === trips[0]?.day)
  }, [] as PublicTrip[])
