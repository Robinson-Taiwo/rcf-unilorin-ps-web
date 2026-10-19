"use client"

import type { TagTone } from "@/components/admin/ui"

export type TripRow = { id: string; direction: "school_to_church" | "church_to_school"; departs_at: string; pickup: string; seats: number; is_open: boolean; seats_left: number }
export type TripStatus = "open" | "scheduled" | "full" | "closed"

export const directionLabel = { school_to_church: "School → Church", church_to_school: "Church → School" } as const

// Open = bookable this week; Scheduled = bookable but more than a week away
export function tripStatus(t: TripRow): TripStatus {
  if (!t.is_open || new Date(t.departs_at) < new Date()) return "closed"
  if (t.seats_left <= 0) return "full"
  return new Date(t.departs_at).getTime() - Date.now() > 7 * 864e5 ? "scheduled" : "open"
}

export const tripStatusTag: Record<TripStatus, TagTone> = { open: "green", scheduled: "blue", full: "red", closed: "grey" }

// Lagos date/time parts for the edit form, and back to an ISO timestamp
export function splitLagos(iso: string) {
  const d = new Date(iso)
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(d)
  const time = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", hour: "2-digit", minute: "2-digit", hour12: false }).format(d)
  return { date, time }
}
export const joinLagos = (date: string, time: string) => new Date(`${date}T${time}:00+01:00`).toISOString()
