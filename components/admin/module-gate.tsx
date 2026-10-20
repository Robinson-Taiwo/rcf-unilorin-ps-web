"use client"

import type { ReactNode } from "react"
import { useAdmin } from "@/components/admin/admin-shell"
import Restricted from "@/components/admin/restricted"
import { can, superOnly, type Permission } from "@/lib/admin/permissions"

// Shows the page if the signed-in admin has the permission; otherwise the "Access restricted" screen.
export default function ModuleGate({ permission, moduleName, children }: { permission: Permission; moduleName: string; children: ReactNode }) {
  const user = useAdmin()
  return can(user, permission) ? <>{children}</> : <Restricted moduleName={moduleName} superOnly={permission in superOnly} />
}
