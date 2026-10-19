"use client"

import type { ReactNode } from "react"
import { useAdmin } from "@/components/admin/admin-shell"
import Restricted from "@/components/admin/restricted"
import { can, type Permission } from "@/lib/admin/permissions"

// Shows the page if the signed-in role has the permission; otherwise the "Access restricted" screen.
export default function ModuleGate({ permission, moduleName, children }: { permission: Permission; moduleName: string; children: ReactNode }) {
  const user = useAdmin()
  return can(user.role, permission) ? <>{children}</> : <Restricted moduleName={moduleName} />
}
