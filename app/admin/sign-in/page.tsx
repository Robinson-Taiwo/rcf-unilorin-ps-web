import type { Metadata } from "next"
import Image from "next/image"
import SignInForm from "@/components/admin/sign-in-form"
import { AdminPill } from "@/components/admin/ui"
import logo from "@/public/rcf-logo.png"

export const metadata: Metadata = { title: "Admin Sign In · RCF UNILORIN PS", robots: { index: false } }

// Figma "Admin Sign In": dark page, one light card with a blue outline, centred.
// Card 480 wide (Figma 520), 40px corners (Figma 44).
export default function AdminSignInPage() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-[#1d1c1c] px-5 py-12">
      <div className="flex w-full max-w-[480px] animate-fade-up flex-col items-center rounded-[32px] border border-[#00a8e8] bg-[#ebe9e9] px-6 py-10 [animation-duration:0.6s] sm:rounded-[40px] sm:px-11 sm:py-12">
        <Image src={logo} alt="RCF Unilorin PS logo" priority className="size-14" />
        <div className="mt-6">
          <AdminPill>Admin access</AdminPill>
        </div>
        <h1 className="mt-5 text-center font-serif text-[34px] leading-tight tracking-[-0.01em] text-[#1c1c1c] sm:text-[40px]">Admin Sign In</h1>
        <p className="mt-3.5 max-w-[380px] text-center text-[15px] leading-[1.5] text-[#8a8d93]">
          Sign in with the email your Super Admin invited. Only authorised RCF Unilorin PS admins can enter.
        </p>
        <div className="mt-7 w-full">
          <SignInForm />
        </div>
      </div>
    </main>
  )
}
