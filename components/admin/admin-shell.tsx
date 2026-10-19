"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import logo from "@/public/rcf-logo.png"
import Sidebar from "@/components/admin/sidebar"
import { getAdmin, signOut, type AdminUser } from "@/lib/admin/session"

const UserContext = createContext<AdminUser | null>(null)

// Signed-in admin for any admin page/component
export function useAdmin() {
  const user = useContext(UserContext)
  if (!user) throw new Error("useAdmin must be used inside AdminShell")
  return user
}

// Dark page with the sidebar on the left and a light rounded panel for the page (Figma dashboard frames).
// Phones/tablets: a top bar with the menu button; the sidebar slides in as a drawer.
// Loads the signed-in admin from Supabase; sends anyone signed out or deactivated to /admin/sign-in.
export default function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [drawer, setDrawer] = useState(false)

  useEffect(() => {
    let cancelled = false
    getAdmin().then(async (admin) => {
      if (cancelled) return
      if (!admin || admin.status !== "active") {
        await signOut()
        router.replace("/admin/sign-in")
        return
      }
      setUser(admin)
    })
    return () => {
      cancelled = true
    }
  }, [router])

  if (!user) {
    return <div className="min-h-svh bg-[#1d1c1c]" aria-busy="true" />
  }

  return (
    <UserContext.Provider value={user}>
      <div className="min-h-svh bg-[#1d1c1c]">

        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 hidden w-[260px] lg:block">
          <Sidebar user={user} />
        </aside>

        {/* Phone/tablet top bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-[#1d1c1c]/95 px-5 backdrop-blur-md lg:hidden">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image src={logo} alt="" className="size-9" />
            <span className="font-serif text-[17px] text-white">RCF UNILORIN PS</span>
          </Link>
          <button type="button" aria-label="Open menu" onClick={() => setDrawer(true)} className="flex size-9 cursor-pointer items-center justify-center text-white">
            <Menu className="size-6" strokeWidth={1.75} />
          </button>
        </header>

        {/* Phone/tablet drawer */}
        {drawer && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
            <button type="button" aria-label="Close menu" onClick={() => setDrawer(false)} className="absolute inset-0 animate-fade-in bg-black/60 [animation-duration:0.25s]" />
            <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] animate-fade-in bg-[#1d1c1c] [animation-duration:0.25s]">
              <button type="button" aria-label="Close menu" onClick={() => setDrawer(false)} className="absolute top-5 right-4 z-10 flex size-8 cursor-pointer items-center justify-center text-white/70 hover:text-white">
                <X className="size-5" />
              </button>
              <Sidebar user={user} onNavigate={() => setDrawer(false)} />
            </div>
          </div>
        )}

        {/* Page panel */}
        <div className="p-2.5 pt-0 lg:ml-[260px] lg:p-5">
          <main className="min-h-[calc(100svh-74px)] rounded-[20px] bg-[#d9d9d9] p-5 sm:p-8 lg:min-h-[calc(100svh-40px)] lg:rounded-[24px] lg:p-10">
            {children}
          </main>
        </div>

      </div>
    </UserContext.Provider>
  )
}
