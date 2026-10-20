// Who can open what.
// Super Admin: everything. Admin: only the pages a Super Admin has ticked for them (Users and roles → Access),
// so e.g. the transport secretary can be given Transport alone. The database enforces the same rules (has_module).

export type Role = "super_admin" | "admin"

export const roleLabel: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
}

// Pages a Super Admin can give to an Admin, in sidebar order
export const modules = [
  { key: "check-in", label: "Check-In", detail: "Set the service code, QR code, live count" },
  { key: "transport", label: "Transport", detail: "Trips, bookings, boarding list" },
  { key: "sermons", label: "Sermons", detail: "Upload and publish sermons" },
  { key: "events", label: "Events", detail: "Add and publish events" },
  { key: "testimonies", label: "Testimonies & Prayer", detail: "Review testimonies and prayer requests" },
  { key: "messages", label: "Messages", detail: "Contact inbox" },
] as const

export type Module = (typeof modules)[number]["key"]
export const allModules: Module[] = modules.map((m) => m.key)
export const moduleLabel = Object.fromEntries(modules.map((m) => [m.key, m.label])) as Record<Module, string>

// Always Super Admin only
export const superOnly = {
  giving: "Giving",
  users: "Users and roles",
  activity: "Activity log",
  transportDelete: "Deleting trips",
  contentDelete: "Deleting sermons and events",
} as const

export type Permission = "dashboard" | Module | keyof typeof superOnly

export function can(user: { role: Role; modules?: readonly string[] | null }, permission: Permission) {
  if (user.role === "super_admin" || permission === "dashboard") return true
  return (user.modules ?? []).includes(permission)
}
