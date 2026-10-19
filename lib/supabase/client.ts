"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

// Supabase client for the browser (client components). Reads the public URL and publishable key.
// RLS (Row Level Security) in the database decides what each signed-in admin can read or change.
let client: SupabaseClient | undefined

export function supabaseBrowser(): SupabaseClient {
  client ??= createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
  )
  return client
}
