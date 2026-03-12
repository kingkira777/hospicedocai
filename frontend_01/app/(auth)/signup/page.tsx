"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const router = useRouter();



  const handleSignUp = async () => {
    try {
      const { data } = await api.post("/auth/register", {
        email,
        password,
        company : name,
      })
      console.log(data);
      router.replace("/signin")
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <main className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg flex overflow-hidden">
        {/* left image panel */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://www.marketsandmarkets.com/Images/ai-technologies24.jpg" 
            alt="Signup illustration"
            className="h-full w-full object-cover"
          />
        </div>
        {/* right form panel */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2 text-center">
            HOSPICEIQ - Create account
          </h1>
          {/* <p className="text-sm text-muted-foreground mb-6">Join and control your smart home.</p> */}
          <form className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm text-muted-foreground">Company Name</span>
              <input
                type="text"
                className="h-10 rounded-md bg-background ring-1 ring-border px-3 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Company Name"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-muted-foreground">Email</span>
              <input
                type="email"
                className="h-10 rounded-md bg-background ring-1 ring-border px-3 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-muted-foreground">Password</span>
              <input
                type="password"
                className="h-10 rounded-md bg-background ring-1 ring-border px-3 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </label>
            <button type="button" onClick={handleSignUp} className="h-10 rounded-md bg-brand text-background hover:bg-blue-400">
              Sign up
            </button>
          </form>

          <p className="mt-4 mb-2 text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link href="/signin" className="text-brand">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
