import type { StaticImageData } from "next/image"
import { storageUrl } from "@/lib/supabase/public"
import bus from "@/public/give-bus.png"
import accommodation from "@/public/give-accomodation.png"
import sound from "@/public/give-sound.png"
import solar from "@/public/give-solar.png"

// Uploaded image if there is one, else a bundled photo picked from the need's name
export function needImage(n: { name: string; image_path: string | null }): StaticImageData | string {
  if (n.image_path) return storageUrl("site-media", n.image_path)
  const name = n.name.toLowerCase()
  if (name.includes("bus")) return bus
  if (name.includes("hostel") || name.includes("accom")) return accommodation
  if (name.includes("media") || name.includes("sound")) return sound
  if (name.includes("solar") || name.includes("power")) return solar
  return bus
}

export type GivingTab = "offerings" | "tithe" | "project"
export type GivingAccount = { bank: string; accountName: string; accountNumber: string }
