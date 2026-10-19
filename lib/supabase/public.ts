import { createClient } from "@supabase/supabase-js"

// Signed-out client for public pages (server or browser). Only sees what RLS lets anyone see.
export function supabasePublic() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export const storageUrl = (bucket: "sermon-audio" | "site-media", path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path.split("/").map(encodeURIComponent).join("/")}`
