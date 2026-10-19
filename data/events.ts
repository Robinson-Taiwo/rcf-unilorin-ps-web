import { StaticImageData } from 'next/image'
import doctrineOfChrist from '@/public/doctrine-of-christ.png'

export type RCFEvent = {
  id: string
  image: StaticImageData
  title: string            // full title, used on cards
  shortTitle: string       // used as the big heading on the details page (desktop)
  mobileTitle: string      // heading on the details page on phones (mobile frame)
  listDate: string         // date text shown on the cards (desktop)
  shortDate: string        // shorter date shown on the cards on phones (mobile frames)
  description: string[]    // paragraphs under the poster
  note: string             // the "NOTE: ..." line (desktop)
  mobileNote: string       // the note under the Register button on phones (mobile frame)
  overview: string
  recurrence: string
  date: string
  time: string
  cost: string
  location: string
  directionsUrl?: string
  registerUrl: string
}

// Placeholder content — five copies of the same event, matching the design.
// Replace with real events (or fetch from your CMS/DB later).
const base = {
  image: doctrineOfChrist,
  title: 'Word & Prayer Conference',
  shortTitle: 'WORD & PRAYER CONF.',
  mobileTitle: 'Word And Prayer Conference',
  listDate: 'Thursday, January 8th-26TH, 2026',
  shortDate: 'January 8th - 14th, 2026',
  description: [
    'High school and college students — this weekend is for you! Join us for a powerful time of worship, fun, and connection as we dive into what it means to live out faith in real life.',
    'Expect engaging sessions, group activities, and plenty of opportunities to meet new friends and grow closer to God.',
  ],
  note: 'NOTE: Registration includes meals and accommodation for the weekend.',
  mobileNote: 'NOTE: Registration is free but compulsory, It covers meals and accommodation for the weekend.',
  overview: 'A weekend retreat for youth and students to grow in faith and community.',
  recurrence: 'Annual',
  date: 'Saturday, 14th February, 2026',
  time: '4PM',
  cost: 'Registration is free but compulsory',
  location: 'RCF auditorium',
  directionsUrl: '#', // TODO: Google Maps link
  registerUrl: '#',   // TODO: registration form link
}

export const events: RCFEvent[] = Array.from({ length: 5 }, (_, i) => ({
  id: String(i + 1),
  ...base,
}))

export const getEvent = (id: string) => events.find((e) => e.id === id)