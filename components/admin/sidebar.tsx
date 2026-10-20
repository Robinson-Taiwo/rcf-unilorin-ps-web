"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bus, CalendarDays, CircleCheck, FileText, Gift, House, LogOut, Mail, MessageCircle, Mic, Users, type LucideIcon } from "lucide-react"
import logo from "@/public/rcf-logo.png"
import { can, roleLabel, type Permission } from "@/lib/admin/permissions"
import { initials, signOut, type AdminUser } from "@/lib/admin/session"
import { db, useLoad } from "@/lib/admin/data"
import { adminCaps } from "@/components/admin/ui"

type Item = { label: string; href: string; icon: LucideIcon; permission: Permission; badge?: string }

// Figma sidebar. MANAGE: the day-to-day modules (Giving only for Super Admins).
// ADMINISTRATION: Users & Roles and Activity Log, Super Admins only.
// Items the signed-in admin can't use are left out (Admins see only the pages they were given).
const manage: Item[] = [
  { label: "Dashboard", href: "/admin", icon: House, permission: "dashboard" },
  { label: "Check-In", href: "/admin/check-in", icon: CircleCheck, permission: "check-in" },
  { label: "Transport", href: "/admin/transport", icon: Bus, permission: "transport" },
  { label: "Giving", href: "/admin/giving", icon: Gift, permission: "giving" },
  { label: "Sermons", href: "/admin/sermons", icon: Mic, permission: "sermons" },
  { label: "Events", href: "/admin/events", icon: CalendarDays, permission: "events" },
  { label: "Testimonies & Prayer", href: "/admin/testimonies", icon: MessageCircle, permission: "testimonies", badge: "testimonies" },
  { label: "Messages", href: "/admin/messages", icon: Mail, permission: "messages", badge: "messages" },
]

const administration: Item[] = [
  { label: "Users & Roles", href: "/admin/users", icon: Users, permission: "users" },
  { label: "Activity Log", href: "/admin/activity", icon: FileText, permission: "activity" },
]

// 260px dark sidebar (Figma 280): logo + name, role pill, nav, signed-in user at the bottom.
export default function Sidebar({ user, onNavigate }: { user: AdminUser; onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  // Badge counts: submissions waiting for review, unread messages
  const { data: badges } = useLoad(async () => {
    const [subs, msgs] = await Promise.all([
      can(user, "testimonies") ? db().from("submissions").select("id", { count: "exact", head: true }).eq("status", "pending") : { count: 0 },
      can(user, "messages") ? db().from("messages").select("id", { count: "exact", head: true }).eq("is_read", false).eq("archived", false) : { count: 0 },
    ])
    return { testimonies: subs.count ?? 0, messages: msgs.count ?? 0 } as Record<string, number>
  }, [pathname])

  const link = (item: Item) => {
    const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
    const count = item.badge ? badges?.[item.badge] : undefined
    const Icon = item.icon
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className={`flex h-11 items-center gap-3 rounded-[12px] px-3.5 text-[15px] transition-colors ${
            active ? "bg-white/10 font-semibold text-white" : "text-white/85 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Icon className="size-[18px] shrink-0" strokeWidth={1.75} />
          <span className="flex-1 truncate">{item.label}</span>
          {count ? (
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#00a8e8] text-[11px] font-semibold text-white">{count}</span>
          ) : null}
        </Link>
      </li>
    )
  }

  return (
    <div className="flex h-full flex-col gap-7 p-5">
      <div className="flex flex-col items-start gap-4 px-1.5">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-3">
          <Image src={logo} alt="" className="size-10" />
          <span className="font-serif text-[19px] leading-none text-white">RCF UNILORIN PS</span>
        </Link>
        <span className="rounded-full bg-[#00a8e8] px-3 py-1 text-[11px] leading-none font-semibold uppercase tracking-[0.06em] text-white">
          {roleLabel[user.role]}
        </span>
      </div>

      <nav aria-label="Admin" className="flex flex-1 flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col gap-2.5">
          <p className={`${adminCaps} px-3.5 text-white/55`}>Manage</p>
          <ul className="flex flex-col gap-1">{manage.filter((i) => can(user, i.permission)).map(link)}</ul>
        </div>
        {administration.some((i) => can(user, i.permission)) && (
          <div className="flex flex-col gap-2.5">
            <p className={`${adminCaps} px-3.5 text-white/55`}>Administration</p>
            <ul className="flex flex-col gap-1">{administration.filter((i) => can(user, i.permission)).map(link)}</ul>
          </div>
        )}
      </nav>

      {/* Signed-in user */}
      <div className="flex items-center gap-3 rounded-[16px] bg-white/[0.07] p-3.5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#00a8e8] text-sm font-semibold text-[#1c1c1c]">
          {initials(user.name)}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-sm font-semibold text-white">{user.name}</span>
          <span className="text-[12px] text-white/60">{roleLabel[user.role]}</span>
        </span>
        <button
          type="button"
          aria-label="Sign out"
          title="Sign out"
          onClick={async () => {
            await signOut()
            router.replace("/admin/sign-in")
            router.refresh()
          }}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </div>
  )
}
