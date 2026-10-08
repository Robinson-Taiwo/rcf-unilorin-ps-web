"use client"

import { useState } from "react"

const tabs = [
  { value: "offerings", label: "OFFERINGS" },
  { value: "tithe", label: "TITHE" },
  { value: "project", label: "PROJECT" },
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

// 505 x 495 white card, blue border, 45px corners
export default function GiveCard() {
  const [tab, setTab] = useState<Tab>("offerings")

  return (
    <div className="flex w-full max-w-[505px] shrink-0 flex-col items-center justify-center gap-[34px] overflow-hidden rounded-[32px] border border-[#00a8e8] bg-white px-5 py-10 sm:px-10 lg:h-[495px] lg:rounded-[45px] lg:px-0 lg:py-0">

      {/* Toggle — 425 x 66 track, three 129 x 45 tabs, 6px apart */}
      <div
        role="tablist"
        aria-label="Giving type"
        className="flex h-[66px] w-full max-w-[425px] items-center justify-center gap-[6px] rounded-[33px] bg-[#8a8d93]/20 px-[10px]"
      >
        {tabs.map((t) => {
          const active = tab === t.value
          return (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.value)}
              className={`flex h-[45px] w-full max-w-[129px] cursor-pointer items-center justify-center rounded-[25px] text-[14px] leading-[27px] font-medium tracking-[0.05em] transition-colors sm:text-[16px] ${
                active ? "bg-[#1d1c1c] text-white" : "text-[#1c1c1c] hover:bg-black/5"
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Account rows — 79 tall, 16px apart */}
      <dl className="flex w-full max-w-[425px] flex-col gap-4">
        {accounts[tab].map((row) => (
          <div
            key={row.label}
            className="flex h-[79px] items-center justify-between gap-4 rounded-[25px] border-[0.5px] border-[#8a8d93] bg-[#e8e8e9] px-5 text-base leading-[27px] tracking-[0.05em] sm:text-[18px]"
          >
            <dt className="font-light text-[#242323]/70">{row.label}</dt>
            <dd className="text-right font-bold text-[#1c1c1c]">{row.value}</dd>
          </div>
        ))}
      </dl>

    </div>
  )
}