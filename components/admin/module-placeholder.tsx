import { AdminHeader, adminCard } from "@/components/admin/ui"

// For modules whose screens haven't been designed/built yet
export default function ModulePlaceholder({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="flex flex-col gap-8">
      <AdminHeader pill={name} title={name} subtitle={detail} />
      <div className={`${adminCard} flex flex-col items-center gap-2 px-6 py-16 text-center`}>
        <p className="font-serif text-[22px] text-[#1c1c1c]">Coming next</p>
        <p className="max-w-[420px] text-[15px] text-[#8a8d93]">This screen is waiting on its design. The sidebar link and access rules are already in place.</p>
      </div>
    </div>
  )
}
