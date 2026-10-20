import Link from "next/link"
import { Lock, Mail } from "lucide-react"
import { AdminHeader, adminButton, adminCard } from "@/components/admin/ui"

// Figma "Access restricted": shown when an Admin opens a page that isn't in their access.
export default function Restricted({ moduleName, superOnly = false }: { moduleName: string; superOnly?: boolean }) {
  return (
    <div className="flex flex-col gap-10 lg:gap-16">
      <AdminHeader pill="Restricted" title="Access restricted" subtitle={superOnly ? "You opened a page that is limited to Super Admins." : "This page isn't part of your access yet."} />

      <div className={`${adminCard} mx-auto flex w-full max-w-[540px] animate-fade-up flex-col items-center px-6 py-10 text-center [animation-duration:0.5s] sm:px-10`}>
        <span className="flex size-16 items-center justify-center rounded-full bg-[#e8e8e9] text-[#1c1c1c]">
          <Lock className="size-6" strokeWidth={1.75} />
        </span>
        <h2 className="mt-6 font-serif text-[26px] leading-tight text-[#1c1c1c] sm:text-[30px]">You don&apos;t have access to {moduleName}</h2>
        <p className="mt-4 text-[15px] leading-[1.6] text-[#8a8d93]">
          {superOnly
            ? "Giving, Users and roles, and the Activity Log are limited to Super Admins because they control where gifts go and who can sign in. If something there needs to change, ask a Super Admin."
            : "Each admin sees only the pages they were given. A Super Admin can add this one for you from Users and roles."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/admin" className={adminButton.primary()}>Back to dashboard</Link>
          <a href={`mailto:?subject=${encodeURIComponent(`Access request: ${moduleName}`)}`} className={adminButton.outline()}>
            <Mail className="size-4" /> Ask a Super Admin
          </a>
        </div>
      </div>
    </div>
  )
}
