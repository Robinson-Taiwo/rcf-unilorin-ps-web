import { notFound } from "next/navigation"

// Every admin module now has its own folder; anything else under /admin is a 404.
export default function UnknownAdminPage() {
  notFound()
}
