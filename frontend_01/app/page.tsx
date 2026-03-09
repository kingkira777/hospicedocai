"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace("/dashboard")
    }, 50)

    return () => clearTimeout(t)
  }, [router])

  return null
}