"use client"

import { useRef, useState } from "react"
import { Upload } from "lucide-react"

// Dashed upload area (Figma "Drop audio (.mp3) or browse", "Add poster image"). Click or drag a file onto it.
export default function Dropzone({ title, hint, accept, onFile }: { title: string; hint: string; accept: string; onFile?: (file: File | null) => void }) {
  const input = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [over, setOver] = useState(false)

  function pick(f: File | null) {
    setFile(f)
    onFile?.(f)
  }

  return (
    <button
      type="button"
      onClick={() => input.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        pick(e.dataTransfer.files[0] ?? null)
      }}
      className={`flex w-full cursor-pointer flex-col items-center gap-2 rounded-[18px] border-[1.5px] border-dashed px-4 py-6 text-center transition-colors ${
        over ? "border-[#00a8e8] bg-[#00a8e8]/10" : "border-[#8a8d93] bg-[#e8e8e9] hover:border-[#00a8e8]"
      }`}
    >
      <Upload className="size-5 text-[#8a8d93]" />
      <span className="text-[15px] font-medium text-[#1c1c1c]">{file ? file.name : title}</span>
      <span className="text-[13px] text-[#8a8d93]">{file ? "Click to choose a different file" : hint}</span>
      <input ref={input} type="file" accept={accept} className="hidden" onChange={(e) => pick(e.target.files?.[0] ?? null)} />
    </button>
  )
}
