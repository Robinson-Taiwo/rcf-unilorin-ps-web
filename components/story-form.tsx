'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

type StoryType = 'testimony' | 'prayer'
type Status = 'idle' | 'submitting' | 'success' | 'error'

const MAX_LENGTH = 600

// Copy that changes with the toggle
const COPY: Record<StoryType, { label: string; placeholder: string }> = {
  testimony: {
    label: 'Your Testimony',
    placeholder: 'Tell us what God has done...',
  },
  prayer: {
    label: 'Your Prayer Point',
    placeholder: 'Share what you would like us to pray about...',
  },
}

const inputBase =
  'w-full rounded-[20px] border border-gray-400 bg-transparent px-6 text-base text-[#1c1c1c] placeholder:text-gray-500 ' +
  'focus:outline-none focus:ring-2 focus:ring-[#4FA8E0] focus:border-[#4FA8E0] disabled:opacity-50'

const StoryForm = () => {
  const [type, setType] = useState<StoryType>('testimony')
  const [name, setName] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const reset = () => {
    setName('')
    setAnonymous(false)
    setMessage('')
    setContact('')
    setStatus('idle')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!message.trim() || status === 'submitting') return

    setStatus('submitting')

    try {
      // TODO: point this at your real endpoint (route handler, Supabase insert, etc.)
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          name: anonymous ? null : name.trim() || null,
          anonymous,
          message: message.trim(),
          contact: contact.trim() || null,
        }),
      })

      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  // ---------- Success state ----------
  if (status === 'success') {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-10">
        <h2 className="font-serif text-3xl md:text-4xl text-[#1c1c1c]">Thank you</h2>
        <p className="text-[#1c1c1c]/70 max-w-sm leading-relaxed">
          Your submission has been sent to our team for review. Nothing is posted until it has been approved.
        </p>
        <Button
          type="button"
          onClick={reset}
          className="bg-[#4FA8E0] text-white rounded-xl h-12 px-8 font-semibold mt-2 hover:bg-[#4FA8E0]/90"
        >
          Share another
        </Button>
      </div>
    )
  }

  const copy = COPY[type]
  const isSubmitting = status === 'submitting'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">

      {/* Testimony / Prayer point toggle */}
      <div className="flex justify-center mb-8 md:mb-10">
        <div className="inline-flex rounded-full bg-[#d9d9d9] p-1.5 md:p-2 w-full max-w-[340px] md:w-auto">
          {(['testimony', 'prayer'] as StoryType[]).map((t) => {
            const active = type === t
            return (
              <button
                key={t}
                type="button"
                aria-pressed={active}
                onClick={() => setType(t)}
                className={`flex-1 md:flex-none rounded-full px-5 md:px-8 py-3 text-xs md:text-sm font-medium tracking-wide transition-colors ${
                  active ? 'bg-[#4FA8E0] text-white' : 'text-[#4FA8E0] hover:bg-white/40'
                }`}
              >
                {t === 'testimony' ? 'TESTIMONY' : 'PRAYER POINT'}
              </button>
            )
          })}
        </div>
      </div>

      {/* Name */}
      <label htmlFor="story-name" className="text-sm text-[#1c1c1c]">
        Your Name <span className="text-gray-500">(optional)</span>
      </label>
      <input
        id="story-name"
        type="text"
        value={anonymous ? '' : name}
        onChange={(e) => setName(e.target.value)}
        disabled={anonymous}
        placeholder="E.g Amaka Nwafor"
        autoComplete="name"
        className={`${inputBase} h-14 md:h-16 mt-2`}
      />

      <label className="flex items-center gap-2 text-xs text-[#1c1c1c] cursor-pointer w-fit mt-1 mb-5">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="h-4 w-4 accent-[#4FA8E0]"
        />
        Post this anonymously
      </label>

      {/* Message */}
      <label htmlFor="story-message" className="text-sm text-[#1c1c1c]">
        {copy.label}
      </label>
      <textarea
        id="story-message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={MAX_LENGTH}
        required
        placeholder={copy.placeholder}
        className={`${inputBase} h-44 md:h-48 py-5 mt-2 resize-none`}
      />
      <p className="text-right text-xs text-gray-500 mb-5" aria-live="polite">
        {message.length} / {MAX_LENGTH}
      </p>

      {/* Contact */}
      <label htmlFor="story-contact" className="text-sm text-[#1c1c1c]">
        Phone or Email{' '}
        <span className="text-gray-500">(optional — only used if we need to follow up)</span>
      </label>
      <input
        id="story-contact"
        type="text"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="Never shown publicly"
        autoComplete="email"
        className={`${inputBase} h-14 md:h-16 mt-2`}
      />

      {/* Error message */}
      {status === 'error' && (
        <p role="alert" className="text-sm text-red-700 mt-4">
          Something went wrong and your submission was not sent. Please try again.
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting || !message.trim()}
        className="w-full h-12 md:h-14 rounded-xl bg-[#4FA8E0] text-white text-base font-semibold mt-6 hover:bg-[#4FA8E0]/90 disabled:opacity-60"
      >
        {isSubmitting ? 'Sending...' : 'Submit'}
      </Button>

      <p className="text-center text-gray-600 text-sm leading-relaxed mt-4 px-2 md:px-8">
        Your submission goes to our team for review first. Approved stories appear on the About page — nothing is posted automatically.
      </p>

    </form>
  )
}

export default StoryForm
