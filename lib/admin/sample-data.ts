// Sample data matching the Figma admin frames. Replace each export with real queries once the backend exists.

import type { Role } from "@/lib/admin/permissions"
import type { AvatarTone, TagTone } from "@/components/admin/ui"

/* ---------- Dashboard ---------- */

export const stats = [
  { label: "Check-ins today", value: "184", note: "Sunday Service · 7:20 AM", tone: "green" },
  { label: "Seats booked", value: "38 / 55", note: "School → Church · Sun", tone: "grey" },
  { label: "Pending reviews", value: "5", note: "3 testimonies · 2 prayer points", tone: "red" },
  { label: "Upcoming events", value: "3", note: "Next: Word & Prayer Conference", tone: "grey" },
] as const

export const attention = [
  { icon: "checkIn", title: "Thursday check-in code not set", detail: "Prayer Meeting opens 6:15 PM today", action: "Set code", href: "/admin/check-in", primary: true },
  { icon: "testimonies", title: "5 submissions waiting for review", detail: "3 testimonies · 2 prayer points", action: "Review", href: "/admin/testimonies", primary: false },
  { icon: "transport", title: "Sunday trip is 69% full", detail: "School → Church · 17 seats left", action: "Bookings", href: "/admin/transport/t1", primary: false },
  { icon: "messages", title: "2 unread messages", detail: "Latest from a first-time visitor", action: "Open inbox", href: "/admin/messages", primary: false },
] as const

// Sidebar badges
export const badges: Partial<Record<string, number>> = { testimonies: 5, messages: 2 }

/* ---------- People (used for avatars across modules) ---------- */

export const people: Record<string, { name: string; tone: AvatarTone }> = {
  funke: { name: "Funke Olatunji", tone: "yellow" },
  ade: { name: "Ade Bello", tone: "blue" },
  tola: { name: "Tola Kuti", tone: "grey" },
}

export const recentActivity = [
  { who: "ade", text: "Ade Bello approved a testimony", when: "12 min ago" },
  { who: "funke", text: "You updated Offerings account details", when: "2 hrs ago" },
  { who: "ade", text: "Ade Bello set Sunday check-in code", when: "Yesterday" },
  { who: "tola", text: "Tola Kuti uploaded “The Weight of a Calling”", when: "Yesterday" },
  { who: "funke", text: "You invited ngozi@rcfunilorin.org", when: "2 days ago" },
] as const

/* ---------- Check-In ---------- */

export const services = [
  { value: "sunday", label: "Sunday", name: "Sunday Service", time: "7:20 AM WAT", code: "482" },
  { value: "tuesday", label: "Tuesday", name: "Tuesday Bible Study", time: "6:15 PM WAT", code: "305" },
  { value: "thursday", label: "Thursday", name: "Thursday Prayer Meeting", time: "6:15 PM WAT", code: "" },
] as const

export const liveAttendance = { count: 184, lastWeek: 212, lastCheckIn: "7:41 AM" }

export const attendanceHistory = [
  { service: "Sunday Service", time: "7:20 AM WAT", date: "Sun, 11 Oct 2026", code: "482", count: 184, open: true },
  { service: "Thursday Prayer Meeting", time: "6:15 PM WAT", date: "Thu, 8 Oct 2026", code: "917", count: 96, open: false },
  { service: "Tuesday Bible Study", time: "6:15 PM WAT", date: "Tue, 6 Oct 2026", code: "305", count: 121, open: false },
  { service: "Sunday Service", time: "7:20 AM WAT", date: "Sun, 4 Oct 2026", code: "660", count: 212, open: false },
]

/* ---------- Transport ---------- */

export type TripStatus = "open" | "scheduled" | "full" | "closed"
export type Trip = { id: string; direction: string; date: string; time: string; pickup: string; seats: number; booked: number; status: TripStatus; past?: boolean }

export const transportStats = [
  { label: "Seats booked this Sunday", value: "63 / 110", note: "Across both directions", tone: "grey" },
  { label: "Open trips", value: "4", note: "2 this Sunday · 2 next", tone: "green" },
  { label: "No-shows last Sunday", value: "6", note: "Out of 58 booked", tone: "red" },
] as const

export const trips: Trip[] = [
  { id: "t1", direction: "School → Church", date: "Sun, 11 Oct", time: "6:45 AM", pickup: "Main Gate", seats: 55, booked: 38, status: "open" },
  { id: "t2", direction: "Church → School", date: "Sun, 11 Oct", time: "11:30 AM", pickup: "Auditorium", seats: 55, booked: 25, status: "open" },
  { id: "t3", direction: "School → Church", date: "Sun, 18 Oct", time: "6:45 AM", pickup: "Main Gate", seats: 55, booked: 0, status: "scheduled" },
  { id: "t4", direction: "Church → School", date: "Sun, 18 Oct", time: "11:30 AM", pickup: "Auditorium", seats: 55, booked: 55, status: "full" },
  { id: "t5", direction: "School → Church", date: "Sun, 25 Oct", time: "6:45 AM", pickup: "Main Gate", seats: 55, booked: 6, status: "closed" },
  { id: "t0", direction: "School → Church", date: "Sun, 4 Oct", time: "6:45 AM", pickup: "Main Gate", seats: 55, booked: 58, status: "closed", past: true },
]

export const tripStatusTag: Record<TripStatus, TagTone> = { open: "green", scheduled: "blue", full: "red", closed: "grey" }

export const riders = [
  { name: "Tomiwa Adeyemi", phone: "0803 *** 1100", bookedAt: "Fri, 9 Oct · 6:10 PM", boarded: true, tone: "blue" },
  { name: "Chioma Eze", phone: "0803 *** 1137", bookedAt: "Fri, 9 Oct · 7:14 PM", boarded: true, tone: "grey" },
  { name: "Ibrahim Yusuf", phone: "0803 *** 1174", bookedAt: "Fri, 9 Oct · 8:18 PM", boarded: true, tone: "blue" },
  { name: "Bukola Ojo", phone: "0803 *** 1211", bookedAt: "Fri, 9 Oct · 9:22 PM", boarded: false, tone: "grey" },
  { name: "David Okafor", phone: "0803 *** 1248", bookedAt: "Fri, 9 Oct · 10:26 PM", boarded: true, tone: "blue" },
  { name: "Zainab Musa", phone: "0803 *** 1285", bookedAt: "Fri, 9 Oct · 6:30 PM", boarded: false, tone: "grey" },
  { name: "Samuel Adeleke", phone: "0803 *** 1322", bookedAt: "Fri, 9 Oct · 7:34 PM", boarded: false, tone: "blue" },
  { name: "Grace Nwosu", phone: "0803 *** 1359", bookedAt: "Fri, 9 Oct · 8:38 PM", boarded: true, tone: "grey" },
] as const

/* ---------- Giving ---------- */

export const givingAccounts = {
  offerings: { bank: "First Bank", accountName: "RCF Unilorin", accountNumber: "0123456789" },
  tithe: { bank: "First Bank", accountName: "RCF Unilorin", accountNumber: "0123456789" },
  project: { bank: "First Bank", accountName: "RCF Unilorin", accountNumber: "0123456789" },
}

export const churchNeeds = [
  { id: "bus", name: "Church bus fund", visible: true },
  { id: "hostel", name: "Hostel outreach", visible: true },
  { id: "media", name: "Media equipment", visible: false },
  { id: "solar", name: "Solar power", visible: true },
]

/* ---------- Sermons & Events ---------- */

export type ContentStatus = "published" | "draft"

export const sermonsList = [
  { id: "s1", title: "The Weight of a Calling", detail: "Audio · 48 min", speaker: "Pastor A.", date: "Oct 4", status: "published" as ContentStatus },
  { id: "s2", title: "Faith That Moves First", detail: "Audio · 41 min", speaker: "Bro. Daniel", date: "Sep 27", status: "published" as ContentStatus },
  { id: "s3", title: "Sent, Not Just Saved", detail: "Audio · 52 min", speaker: "Sis. Grace", date: "Sep 20", status: "published" as ContentStatus },
  { id: "s4", title: "Rooted in the Word", detail: "Audio · 39 min", speaker: "Pastor A.", date: "Sep 13", status: "published" as ContentStatus },
  { id: "s5", title: "The Joy of Service", detail: "No audio yet", speaker: "Bro. Tunde", date: "Sep 6", status: "draft" as ContentStatus },
]

export const eventsList = [
  { id: "e1", title: "Word and Prayer Conference", detail: "Featured", date: "Oct 24", place: "Auditorium", status: "published" as ContentStatus },
  { id: "e2", title: "New Members Class", detail: "After service", date: "Oct 18", place: "Hall B", status: "published" as ContentStatus },
  { id: "e3", title: "Campus Outreach Week", detail: "Sign-ups open", date: "Nov 2", place: "Campus", status: "published" as ContentStatus },
  { id: "e4", title: "Choir Auditions", detail: "Not announced", date: "Nov 8", place: "Hall A", status: "draft" as ContentStatus },
]

/* ---------- Testimonies & Prayer ---------- */

export const testimoniesQueue = [
  { id: "q1", name: "Anonymous", when: "2 hours ago", tone: "grey", showAs: "Anonymous", text: "My results were bad for two sessions. After joining the prayer unit and staying consistent, I made my best grades this semester. God is faithful." },
  { id: "q2", name: "Tobi O.", when: "Yesterday", tone: "yellow", showAs: "Tobi O.", text: "I came as a visitor for one service and found a family. A year later I serve in the choir and I am growing more than I imagined." },
  { id: "q3", name: "Chidi E.", when: "2 days ago", tone: "blue", showAs: "Chidi E.", text: "God provided my school fees within a week of praying with the fellowship. I am grateful." },
] as const

export const recentlyPublished = ["“I came as a visitor for one service…”", "“Faith over fear this semester”", "“Healed after the Thursday prayer”"]

export const prayerQueue = [
  { id: "p1", name: "Grace A.", when: "3 hours ago", tone: "blue", contact: "0803 *** 1142", text: "Please pray for my final year project defence next month, for wisdom and a sound mind as I prepare." },
  { id: "p2", name: "Anonymous", when: "Yesterday", tone: "grey", contact: "", text: "Pray for my family back home. Things have been tough and we need peace." },
] as const

export const prayedFor = ["Exam stress — Bukola", "Job search — Samuel", "Travel mercies — Zainab"]

/* ---------- Messages ---------- */

export const messages = [
  { id: "m1", name: "Amaka N.", email: "amaka.n@gmail.com", subject: "First time visiting", when: "10:12 AM", whenFull: "Today, 10:12 AM", unread: true, body: "Hi, I will be on campus next Sunday and would love to visit. Where exactly is the service held, and is there transport from the school gate? Thank you." },
  { id: "m2", name: "Yusuf B.", email: "yusuf.b@gmail.com", subject: "Choir interest", when: "Yesterday", whenFull: "Yesterday, 4:20 PM", unread: true, body: "Good day. How can I join the choir? I sing tenor and I'm free most evenings." },
  { id: "m3", name: "Rita T.", email: "rita.t@gmail.com", subject: "Transport question", when: "Mon", whenFull: "Mon, 12 Oct, 9:05 AM", unread: false, body: "Is the bus free for first-time visitors?" },
  { id: "m4", name: "Oluwaseun A.", email: "seun.a@gmail.com", subject: "Testimony follow-up", when: "Sat", whenFull: "Sat, 10 Oct, 6:48 PM", unread: false, body: "Thank you for publishing my story. It has encouraged my friends too." },
]

/* ---------- Users & roles ---------- */

export type AdminStatus = "active" | "invited" | "inactive"

export const adminUsers: { name: string; email: string; role: Role; status: AdminStatus; lastActive: string; tone: AvatarTone }[] = [
  { name: "Funke Olatunji", email: "funke@rcfunilorin.org", role: "super_admin", status: "active", lastActive: "Now", tone: "blue" },
  { name: "Ade Bello", email: "ade@rcfunilorin.org", role: "admin", status: "active", lastActive: "12 min ago", tone: "blue" },
  { name: "Tola Kuti", email: "tola@rcfunilorin.org", role: "admin", status: "active", lastActive: "Yesterday", tone: "grey" },
  { name: "Ngozi Eze", email: "ngozi@rcfunilorin.org", role: "admin", status: "invited", lastActive: "—", tone: "grey" },
  { name: "Segun Ade", email: "segun@rcfunilorin.org", role: "admin", status: "inactive", lastActive: "3 weeks ago", tone: "grey" },
]

/* ---------- Activity log ---------- */

export type LogModule = "content" | "giving" | "check-in" | "users" | "transport"

export const activityLog: { who: string; action: string; module: LogModule; when: string }[] = [
  { who: "ade", action: "Approved a testimony", module: "content", when: "Today, 9:41 AM" },
  { who: "funke", action: "Changed Offerings account number", module: "giving", when: "Today, 7:58 AM" },
  { who: "ade", action: "Set the Sunday check-in code", module: "check-in", when: "Yesterday, 6:30 PM" },
  { who: "tola", action: "Published sermon “The Weight of a Calling”", module: "content", when: "Yesterday, 4:12 PM" },
  { who: "funke", action: "Invited ngozi@rcfunilorin.org as Admin", module: "users", when: "Mon, 5 Oct, 2:20 PM" },
  { who: "ade", action: "Created a trip for Sun, 18 Oct", module: "transport", when: "Mon, 5 Oct, 11:05 AM" },
  { who: "funke", action: "Deactivated segun@rcfunilorin.org", module: "users", when: "Fri, 2 Oct, 9:48 AM" },
  { who: "tola", action: "Rejected a testimony", module: "content", when: "Thu, 1 Oct, 8:15 PM" },
]

export const logModuleTag: Record<LogModule, TagTone> = { content: "navy", giving: "yellow", "check-in": "blue", users: "grey", transport: "blue" }
