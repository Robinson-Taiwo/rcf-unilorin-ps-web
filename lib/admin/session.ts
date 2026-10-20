"use client"

import { supabaseBrowser } from "@/lib/supabase/client"
import type { Module, Role } from "@/lib/admin/permissions"

// Admin sign-in on Supabase Auth. The rest of the admin code uses only these functions.

export type AdminUser = { id: string; name: string; email: string; role: Role; status: "active" | "invited" | "inactive"; modules: Module[] }

export type SignInResult = { user: AdminUser } | { error: "credentials" | "inactive" | "no-profile" }

export async function signIn(email: string, password: string): Promise<SignInResult> {
  const supabase = supabaseBrowser()
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
  if (error) return { error: "credentials" }

  const user = await getAdmin()
  if (!user) {
    await supabase.auth.signOut()
    return { error: "no-profile" }
  }
  if (user.status !== "active") {
    await supabase.auth.signOut()
    return { error: "inactive" }
  }
  await supabase.rpc("touch_last_active")
  return { user }
}

// The signed-in admin's profile, or null when signed out / not an admin
export async function getAdmin(): Promise<AdminUser | null> {
  const supabase = supabaseBrowser()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return null
  const { data } = await supabase.from("profiles").select("id, full_name, email, role, status, modules").eq("id", auth.user.id).maybeSingle()
  if (!data) return null
  return { id: data.id, name: data.full_name || data.email.split("@")[0], email: data.email, role: data.role, status: data.status, modules: data.modules ?? [] }
}

export async function signOut() {
  await supabaseBrowser().auth.signOut()
}

export const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase()
