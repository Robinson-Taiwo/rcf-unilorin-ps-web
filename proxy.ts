import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

// Runs before /admin pages: refreshes the Supabase sign-in cookies and sends signed-out visitors to the
// sign-in page. (Next.js 16 calls this file `proxy.ts`; it used to be `middleware.ts`.)
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  const { data } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname
  const isPublicAdminPage = path.startsWith("/admin/sign-in") || path.startsWith("/admin/set-password")

  // API routes check the caller themselves and answer 401; pages redirect to sign-in.
  if (!data.user && !isPublicAdminPage && !path.startsWith("/api/")) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/sign-in"
    url.search = ""
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
