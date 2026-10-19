"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, X } from "lucide-react"
import { signIn } from "@/lib/admin/session"
import { supabaseBrowser } from "@/lib/supabase/client"
import { adminButton, adminInput, adminLabel } from "@/components/admin/ui"

// Email + password form (Figma "Admin Sign In"). Wrong details show the red banner and a red password field.
export default function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState<null | "credentials" | "inactive" | "no-profile">(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState("")

  async function forgot() {
    if (!email.trim()) {
      setNotice("")
      document.getElementById("admin-email")?.focus()
      setError(null)
      setNotice("Enter your email above, then tap “Forgot password?” again.")
      return
    }
    await supabaseBrowser().auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/admin/set-password`,
    })
    // Same message whether or not the email exists, so the form can't be used to discover admin emails
    setNotice("If that email belongs to an admin, a reset link is on its way.")
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    const result = await signIn(email, password)
    setBusy(false)
    if ("error" in result) {
      setError(result.error)
      return
    }
    router.replace("/admin")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5" noValidate>
      {error && (
        <div role="alert" className="flex animate-fade-in items-start gap-3 rounded-[12px] bg-[#e5d3d3] px-4 py-3.5 text-sm leading-[1.4] text-[#d32f2f] [animation-duration:0.3s]">
          <X className="mt-0.5 size-4 shrink-0" strokeWidth={2.25} />
          {error === "credentials" && "Email or password is incorrect. Try again or reset your password."}
          {error === "inactive" && "This account is not active. Ask a Super Admin to reactivate it."}
          {error === "no-profile" && "This email is not set up as an admin. Ask a Super Admin to invite you."}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        <label htmlFor="admin-email" className={adminLabel}>Email</label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError(null)
          }}
          placeholder="you@rcfunilorin.org"
          className={adminInput}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <label htmlFor="admin-password" className={adminLabel}>Password</label>
        <div className="relative">
          <input
            id="admin-password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(null)
            }}
            aria-invalid={error === "credentials"}
            className={`${adminInput} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-4 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center text-[#8a8d93] transition-colors hover:text-[#1c1c1c]"
          >
            {show ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={busy || !email || !password} className={`${adminButton.primary()} mt-1 w-full`}>
        {busy ? "Signing in…" : "Sign in"}
      </button>

      {/* Sends a reset link to the email typed above; the link opens /admin/set-password */}
      <button type="button" onClick={forgot} className="cursor-pointer self-center text-sm font-medium text-[#00a8e8] hover:underline">
        Forgot password?
      </button>
      {notice && <p role="status" className="text-center text-sm text-[#5c8e13]">{notice}</p>}
    </form>
  )
}
