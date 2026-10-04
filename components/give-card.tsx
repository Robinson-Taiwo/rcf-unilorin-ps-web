'use client'

import React, { useState } from 'react'

type GiveTab = 'offerings' | 'tithe' | 'project'

type Account = {
  bank: string
  accountName: string
  accountNumber: string
}

// Placeholder details — replace with the fellowship's real accounts.
// If every tab uses the same account, keep the values identical.
const TABS: { id: GiveTab; label: string; account: Account }[] = [
  {
    id: 'offerings',
    label: 'OFFERINGS',
    account: { bank: 'First Bank', accountName: 'RCF Unilorin', accountNumber: '0123456789' },
  },
  {
    id: 'tithe',
    label: 'TITHE',
    account: { bank: 'First Bank', accountName: 'RCF Unilorin', accountNumber: '0123456789' },
  },
  {
    id: 'project',
    label: 'PROJECT',
    account: { bank: 'First Bank', accountName: 'RCF Unilorin', accountNumber: '0123456789' },
  },
]

const GiveCard = () => {
  const [active, setActive] = useState<GiveTab>('offerings')

  const current = TABS.find((t) => t.id === active)!
  const rows = [
    { label: 'Bank', value: current.account.bank },
    { label: 'Account Name', value: current.account.accountName },
    { label: 'Account Number', value: current.account.accountNumber },
  ]

  return (
    <div className="give-card w-full max-w-[480px] bg-white rounded-[28px] md:rounded-[36px] border border-[#4FA8E0]/70 shadow-[0_0_30px_rgba(79,168,224,0.25)] p-5 sm:p-8">

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Giving category"
        className="grid grid-cols-3 bg-[#e8e8e8] rounded-full p-1.5 md:p-2"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              id={`give-tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls="give-panel"
              onClick={() => setActive(tab.id)}
              className={`rounded-full py-2.5 md:py-3 text-[11px] sm:text-xs md:text-sm font-medium tracking-wide transition-colors ${
                isActive ? 'bg-[#1c1c1c] text-white' : 'text-[#1c1c1c] hover:bg-black/5'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Account details */}
      <div
        id="give-panel"
        role="tabpanel"
        aria-labelledby={`give-tab-${active}`}
        className="flex flex-col gap-3 mt-5 md:mt-7 md:mb-6"
      >
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 bg-[#e8e8e8] border border-gray-300 rounded-[20px] min-h-14 md:min-h-16 px-5 md:px-6 py-3"
          >
            <span className="text-gray-500 text-sm md:text-base shrink-0">{row.label}</span>
            <span className="text-[#1c1c1c] text-sm md:text-base font-semibold text-right break-words tabular-nums">
              {row.value}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}

export default GiveCard
