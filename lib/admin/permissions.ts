// Roles & Permissions — from the Figma "Access control" frame.
// Two roles share one dashboard. Super Admin sees every module; Admin sees the day-to-day modules only.
// The design marks this as a proposed split — change it here and the sidebar, pages and
// "Your access" card all follow.

export type Role = "super_admin" | "admin"

export const roleLabel: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
}

// Every module/action in the table. `admin` is whether the Admin role has it (Super Admin has everything).
export const permissions = {
  dashboard: { label: "Dashboard overview", detail: "Stats, needs-attention list, activity", admin: true, why: "Admin does not see Giving or user stats" },
  checkIn: { label: "Check-In", detail: "Set code, open/close, live count, history", admin: true, why: "Needed by whoever runs the service" },
  transport: { label: "Transport", detail: "Create trips, bookings, boarding list", admin: true, why: "Day-to-day operations" },
  transportDelete: { label: "Transport — delete a trip", detail: "", admin: false, why: "Destructive; Super Admin only" },
  giving: { label: "Giving", detail: "Account details, other church needs", admin: false, why: "Financial details — fraud risk if changed" },
  content: { label: "Sermons & Events", detail: "Add, edit, upload audio", admin: true, why: "Content updates" },
  contentDelete: { label: "Sermons & Events — delete", detail: "", admin: false, why: "Admin can unpublish instead" },
  testimonies: { label: "Testimonies & Prayer", detail: "Review, approve, reject", admin: true, why: "Prayer requests stay private to admins" },
  messages: { label: "Messages", detail: "Contact form inbox", admin: true, why: "Reply and archive" },
  users: { label: "Users & Roles", detail: "Invite, change role, deactivate", admin: false, why: "Controls who can enter" },
  activity: { label: "Activity Log", detail: "Who changed what, and when", admin: false, why: "Accountability for Super Admin" },
} as const

export type Permission = keyof typeof permissions

export function can(role: Role, permission: Permission) {
  return role === "super_admin" || permissions[permission].admin
}
