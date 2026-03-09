"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthGuard({ user, loading, children }:any) {
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin")
    }
  }, [user, loading, router])
  
  if (loading) return <p>Loading...</p>

  if (!user) return null

  return children
}