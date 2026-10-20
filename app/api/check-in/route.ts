import { NextResponse, type NextRequest } from "next/server"
import { supabasePublic } from "@/lib/supabase/public"

// Check-in without signing in. Each phone is recognised by two ids: a long-lived cookie set here and an id the
// page keeps in the browser's storage. Both are checked, so clearing one of them isn't enough to check in twice.
const COOKIE = "rcf_device"
const TWO_YEARS = 60 * 60 * 24 * 730
const isId = (v: unknown): v is string => typeof v === "string" && /^[0-9a-f-]{36}$/i.test(v)

function ids(req: NextRequest, local: unknown) {
  const cookie = req.cookies.get(COOKIE)?.value
  const stored = isId(local) ? local : null
  const primary = isId(cookie) ? cookie : stored ?? crypto.randomUUID()
  return { primary, alt: stored && stored !== primary ? stored : null }
}

function withCookie(res: NextResponse, id: string) {
  res.cookies.set(COOKIE, id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: TWO_YEARS, path: "/" })
  return res
}

// Has this phone already checked in today? → { service: "Sunday Service" | null }
export async function GET(req: NextRequest) {
  const { primary, alt } = ids(req, req.nextUrl.searchParams.get("device"))
  const { data } = await supabasePublic().rpc("my_checkin_today", { p_device_id: primary, p_alt_id: alt })
  return withCookie(NextResponse.json({ service: (data as string | null) ?? null }), primary)
}

// { code, device } → { status: "ok" | "already" | "invalid" }
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { code?: unknown; device?: unknown }
  const code = typeof body.code === "string" ? body.code.replace(/[^0-9a-z]/gi, "").toUpperCase().slice(0, 3) : ""
  if (code.length !== 3) return NextResponse.json({ status: "invalid" })
  const { primary, alt } = ids(req, body.device)
  const { data, error } = await supabasePublic().rpc("check_in", { p_code: code, p_device_id: primary, p_alt_id: alt })
  if (error) return NextResponse.json({ status: "error" }, { status: 500 })
  return withCookie(NextResponse.json({ status: data }), primary)
}
