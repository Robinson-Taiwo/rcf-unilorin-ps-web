import { NextResponse, type NextRequest } from "next/server"
import { supabaseServer } from "@/lib/supabase/server"

// Google sends members back here after sign-in; swap the one-time code for a session, then return to `next`.
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")
  const nextParam = req.nextUrl.searchParams.get("next") ?? "/check-in"
  // Only ever send people back to a page on this site
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/check-in"
  if (code) {
    const sb = await supabaseServer()
    const { error } = await sb.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL(next, req.nextUrl.origin))
  }
  const back = new URL(next, req.nextUrl.origin)
  back.searchParams.set("signin", "failed")
  return NextResponse.redirect(back)
}
