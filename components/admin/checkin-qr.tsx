"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"
import { Copy, Download } from "lucide-react"
import { adminButton, adminCard, cardTitle } from "@/components/admin/ui"

// QR code for today's check-in. Scanning opens /check-in?c=ABC: sign in with Google, then checked in at once.
// "Download" saves a print-ready poster (PNG) with the QR, the service, the date and the code.
export default function CheckInQr({ code, serviceName, dateLabel, open }: { code: string; serviceName: string; dateLabel: string; open: boolean }) {
  const [src, setSrc] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState("")

  useEffect(() => {
    const link = `${window.location.origin}/check-in?c=${encodeURIComponent(code)}`
    let live = true
    QRCode.toDataURL(link, { width: 480, margin: 1, errorCorrectionLevel: "M", color: { dark: "#1c1c1c", light: "#ffffff" } }).then((d) => {
      if (live) {
        setUrl(link)
        setSrc(d)
      }
    })
    return () => {
      live = false
    }
  }, [code])

  async function download() {
    const W = 1200
    const H = 1600
    const canvas = document.createElement("canvas")
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = "#00a8e8"
    ctx.fillRect(0, 0, W, 24)

    ctx.textAlign = "center"
    ctx.fillStyle = "#00a8e8"
    ctx.font = "600 34px Inter, Arial, sans-serif"
    ctx.fillText("R C F   U N I L O R I N", W / 2, 130)
    ctx.fillStyle = "#1c1c1c"
    ctx.font = "600 84px Fraunces, Georgia, serif"
    ctx.fillText("Scan to check in", W / 2, 240)
    ctx.fillStyle = "#555555"
    ctx.font = "400 38px Inter, Arial, sans-serif"
    ctx.fillText(`${serviceName} · ${dateLabel}`, W / 2, 305)

    // Large, sharp QR drawn straight onto the poster
    const qr = document.createElement("canvas")
    await QRCode.toCanvas(qr, url, { width: 860, margin: 0, errorCorrectionLevel: "M", color: { dark: "#1c1c1c", light: "#ffffff" } })
    ctx.drawImage(qr, (W - 860) / 2, 380)

    ctx.fillStyle = "#555555"
    ctx.font = "400 36px Inter, Arial, sans-serif"
    ctx.fillText("Or open the check-in page and enter", W / 2, 1345)
    ctx.fillStyle = "#1c1c1c"
    ctx.font = "700 120px Inter, Arial, sans-serif"
    ctx.fillText(code.split("").join(" "), W / 2, 1480)

    const a = document.createElement("a")
    a.href = canvas.toDataURL("image/png")
    a.download = `check-in-${serviceName.toLowerCase().replace(/\s+/g, "-")}-${code}.png`
    a.click()
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard blocked
    }
  }

  return (
    <section className={`${adminCard} flex flex-col gap-5 p-5 sm:p-7`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className={cardTitle}>Check-in QR code</h2>
        {!open && <span className="text-[13px] text-[#d32f2f]">Check-in is closed</span>}
      </div>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div className="flex size-[180px] shrink-0 items-center justify-center overflow-hidden rounded-[16px] border border-[#e0e0e1] bg-white p-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- generated data URL */}
          {src ? <img src={src} alt={`QR code for check-in code ${code}`} className="size-full" /> : <span className="text-[13px] text-[#8a8d93]">Making QR…</span>}
        </div>
        <div className="flex min-w-0 flex-col gap-3">
          <p className="text-[14px] leading-[1.55] text-[#8a8d93]">
            Show it on screen or print it. Scanning opens check-in with the code filled in; members sign in with Google once. Each person and each phone counts once.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={download} disabled={!src} className={adminButton.primary("sm")}>
              <Download className="size-4" /> Download poster
            </button>
            <button type="button" onClick={copy} disabled={!url} className={adminButton.neutral("sm")}>
              <Copy className="size-4" /> {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
