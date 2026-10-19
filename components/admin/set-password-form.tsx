"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase/client"
import { adminButton, adminInput, adminLabel } from "@/components/admin/ui"

// Opened from the invite email or a password-reset email. The Supabase client reads the sign-in token from the
// link, then the admin chooses a password (and their name, for new invites).
export default function SetPasswordForm() {
  const router = useRouter()
  const [ready, setReady] = useState<"checking" | "ok" | "expired">("checking")
  const [isInvite, setIsInvite] = useState(false)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const supabase = supabaseBrowser()
    let done = false
    const finish = async () => {
      const { data } = await supabase.auth.getUser()
      if (done) return
      done = true
      if (!data.user) return setReady("expired")
      const { data: profile } = await supabase.from("profiles").select("status, full_name").eq("id", data.user.id).maybeSingle()
      setIsInvite(profile?.status === "invited")
      setName(profile?.full_name ?? "")
      setReady("ok")
    }
    // The token in the link is exchanged asynchronously; wait for it, with a fallback check
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY" || event === "INITIAL_SESSION") finish()
    })
    const t = setTimeout(finish, 2500)
    return () => {
      sub.subscription.unsubscribe()
      clearTimeout(t)
    }
  }, [])

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (password.length < 8) return setError("Use at least 8 characters.")
    if (password !== confirm) return setError("The two passwords don't match.")
    setBusy(true)
    const supabase = supabaseBrowser()
    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) {
      setBusy(false)
      return setError(err.message)
    }
    if (name.trim()) await supabase.rpc("set_my_name", { p_name: name.trim() })
    await supabase.rpc("activate_me")
    await supabase.rpc("touch_last_active")
    router.replace("/admin")
    router.refresh()
  }

  if (ready === "checking") return <p className="text-center text-[15px] text-[#8a8d93]">Checking your link…</p>

  if (ready === "expired")
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-[15px] leading-[1.55] text-[#8a8d93]">This link has expired or was already used. Ask a Super Admin to resend your invite, or use “Forgot password?” on the sign-in page.</p>
        <Link href="/admin/sign-in" className={adminButton.primary()}>Go to sign in</Link>
      </div>
    )

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-5">
      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-[12px] bg-[#e5d3d3] px-4 py-3.5 text-sm leading-[1.4] text-[#d32f2f]">
          <X className="mt-0.5 size-4 shrink-0" strokeWidth={2.25} />
          {error}
        </div>
      )}
      {isInvite && (
        <div className="flex flex-col gap-2.5">
          <label htmlFor="sp-name" className={adminLabel}>Your name</label>
          <input id="sp-name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="e.g. Ngozi Eze" className={adminInput} />
        </div>
      )}
      <div className="flex flex-col gap-2.5">
        <label htmlFor="sp-password" className={adminLabel}>New password</label>
        <input id="sp-password" type="password" required minLength={8} value={password} onChange={(e) => { setPassword(e.target.value); setError("") }} autoComplete="new-password" className={adminInput} />
      </div>
      <div className="flex flex-col gap-2.5">
        <label htmlFor="sp-confirm" className={adminLabel}>Confirm password</label>
        <input id="sp-confirm" type="password" required value={confirm} onChange={(e) => { setConfirm(e.target.value); setError("") }} autoComplete="new-password" className={adminInput} />
      </div>
      <button type="submit" disabled={busy} className={`${adminButton.primary()} mt-1 w-full`}>
        {busy ? "Saving…" : isInvite ? "Set password and continue" : "Save new password"}
      </button>
    </form>
  )
}
