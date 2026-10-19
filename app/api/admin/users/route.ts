import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { supabaseServer, supabaseService } from "@/lib/supabase/server"

// Invite, resend and cancel need the service-role key, so they run here — only for active Super Admins.
type Body = { action: "invite" | "resend" | "link" | "cancel"; email?: string; role?: "admin" | "super_admin"; id?: string }

export async function POST(req: NextRequest) {
  const sb = await supabaseServer()
  const { data: auth } = await sb.auth.getUser()
  if (!auth.user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 })
  const { data: me } = await sb.from("profiles").select("full_name, role, status").eq("id", auth.user.id).single()
  if (me?.role !== "super_admin" || me.status !== "active") return NextResponse.json({ error: "Only a Super Admin can do this." }, { status: 403 })
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY is missing from .env.local." }, { status: 500 })

  const body = (await req.json()) as Body
  const service = supabaseService()
  const redirectTo = `${req.nextUrl.origin}/admin/set-password`
  const log = (action: string) => sb.rpc("log_activity", { p_action: action, p_module: "users" })

  // When Supabase can't send the email (its built-in sender allows only a few an hour), make the same
  // one-time link without sending it, so the Super Admin can pass it on (WhatsApp, text, their own email).
  const emailBlocked = (msg: string) => /rate limit|sending|smtp|email/i.test(msg)
  async function shareLink(type: "invite" | "recovery", email: string, data?: Record<string, string>) {
    const res =
      type === "invite"
        ? await service.auth.admin.generateLink({ type: "invite", email, options: { data, redirectTo } })
        : await service.auth.admin.generateLink({ type: "recovery", email, options: { redirectTo } })
    if (res.error) return { error: res.error.message }
    const link = `${redirectTo}?token_hash=${encodeURIComponent(res.data.properties.hashed_token)}&type=${type}`
    return { link }
  }

  if (body.action === "invite") {
    const email = body.email?.trim().toLowerCase()
    const role = body.role === "super_admin" ? "super_admin" : "admin"
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 })
    const { data: existing } = await service.from("profiles").select("id").eq("email", email).maybeSingle()
    if (existing) return NextResponse.json({ error: "That email already has an admin account." }, { status: 409 })
    const { error } = await service.auth.admin.inviteUserByEmail(email, { data: { role }, redirectTo })
    const roleName = role === "super_admin" ? "Super Admin" : "Admin"
    if (error) {
      if (!emailBlocked(error.message)) return NextResponse.json({ error: error.message }, { status: 400 })
      // The user may already have been created before the email failed
      let shared = await shareLink("invite", email, { role })
      if (shared.error) shared = await shareLink("recovery", email)
      if (shared.error) return NextResponse.json({ error: shared.error }, { status: 400 })
      await log(`Invited ${email} as ${roleName} (link shared directly)`)
      return NextResponse.json({ ok: true, link: shared.link })
    }
    await log(`Invited ${email} as ${roleName}`)
    return NextResponse.json({ ok: true })
  }

  if (!body.id) return NextResponse.json({ error: "Missing user." }, { status: 400 })
  const { data: target } = await service.from("profiles").select("id, email, status").eq("id", body.id).single()
  if (!target) return NextResponse.json({ error: "That admin no longer exists." }, { status: 404 })
  if (target.status !== "invited") return NextResponse.json({ error: "This admin has already accepted their invite." }, { status: 409 })

  // A fresh link to pass on by hand, without sending any email
  if (body.action === "link") {
    const shared = await shareLink("recovery", target.email)
    if (shared.error) return NextResponse.json({ error: shared.error }, { status: 400 })
    await log(`Made a new invite link for ${target.email}`)
    return NextResponse.json({ ok: true, link: shared.link })
  }

  if (body.action === "resend") {
    let { error } = await service.auth.admin.inviteUserByEmail(target.email, { redirectTo })
    if (error) {
      // Already-registered users can't be re-invited; a password link lands on the same page
      const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!, { auth: { persistSession: false } })
      ;({ error } = await anon.auth.resetPasswordForEmail(target.email, { redirectTo }))
    }
    if (error) {
      if (!emailBlocked(error.message)) return NextResponse.json({ error: error.message }, { status: 400 })
      const shared = await shareLink("recovery", target.email)
      if (shared.error) return NextResponse.json({ error: shared.error }, { status: 400 })
      await log(`Made a new invite link for ${target.email}`)
      return NextResponse.json({ ok: true, link: shared.link })
    }
    await log(`Resent the invite to ${target.email}`)
    return NextResponse.json({ ok: true })
  }

  if (body.action === "cancel") {
    const { error } = await service.auth.admin.deleteUser(target.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    await log(`Cancelled the invite for ${target.email}`)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 })
}
