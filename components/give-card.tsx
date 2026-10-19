"use client"

import { useState } from "react"
import { segment, segmented } from "@/components/rcf/Ui"

const tabs = [
  { value: "offerings", label: "Offerings" },
  { value: "tithe", label: "Tithe" },
  { value: "project", label: "Project" },
] as const

type Tab = (typeof tabs)[number]["value"]

// TODO: real account details per tab
const accounts: Record<Tab, { label: string; value: string }[]> = {
  offerings: [
    { label: "Bank", value: "First Bank" },
    { label: "Account Name", value: "RCF Unilorin" },
    { label: "Account Number", value: "0123456789" },
  ],
  tithe: [
    { label: "Bank", value: "First Bank" },
    { label: "Account Name", value: "RCF Unilorin" },
    { label: "Account Number", value: "0123456789" },
  ],
  project: [
    { label: "Bank", value: "First Bank" },
    { label: "Account Name", value: "RCF Unilorin" },
    { label: "Account Number", value: "0123456789" },
  ],
}

// Phones (mobile frame 461:265): 10px side padding, 26px top/bottom, 50px toggle, 24px gap, three 50px rows 10px apart.
// Desktop (desktop frame): same card with a blue border (Figma 505 x 495).
export default function GiveCard() {
  const [tab, setTab] = useState<Tab>("offerings")

  return (
    <div className="flex w-full flex-col gap-6 rounded-[20px] border border-[#00a8e8] bg-white px-2.5 py-[26px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] sm:p-6 lg:gap-5 lg:rounded-[28px] lg:p-8">
      <div role="tablist" aria-label="Giving type" className={segmented}>
        {tabs.map((t) => {
          const active = tab === t.value
          return (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.value)}
              className={`${segment} ${active ? "bg-[#1d1c1c] text-white" : "text-[#1c1c1c] hover:bg-black/5"}`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      <dl key={tab} className="flex animate-fade-in flex-col gap-2.5 lg:gap-3">
        {accounts[tab].map((row) => (
          <div
            key={row.label}
            className="flex h-[50px] items-center justify-between gap-4 rounded-[16px] border border-[#8a8d93]/50 bg-[#e8e8e9] px-4 text-[13px] tracking-[0.02em] lg:h-14 lg:rounded-[18px] lg:px-5 lg:text-[15px] lg:tracking-normal"
          >
            <dt className="font-light text-[#242323]/70">{row.label}</dt>
            <dd className="text-right font-semibold text-[#1c1c1c]">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
