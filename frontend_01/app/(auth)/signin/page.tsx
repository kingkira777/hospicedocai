"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import { message } from "antd"


export default function SignInPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  


  const handleSignIn = async () => {
    try {
      let userData:any = {};
      
      if (!email || !password) {
        messageApi.error("All fields are required")
        return;
      }

      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        messageApi.warning("Please enter a valid email address.");
        return;
      }
      
      const { data } = await api.post('/auth/login', {
        email,
        password,
      });
      console.log(data);

      if(data?.employee){
        userData.id = data?.employee?.id;
        userData.companyId = data?.employee?.company?.id;
        userData.company = data?.employee?.company?.name;
        userData.name = data?.employee?.firstName + ' ' + data?.employee?.lastName;
        userData.email = data?.email || '';
        userData.role = data?.accessLevel;
        userData.type = "employee";
        localStorage.setItem("user", JSON.stringify(userData))
        router.replace("/dashboard")
      }else{
        userData.id = data?.id;
        userData.companyId = data?.company?.id;
        userData.company = data?.company?.name;
        userData.name = data?.email;
        userData.email = data?.email || '';
        userData.role = data?.accessLevel;
        userData.type = "user";
        localStorage.setItem("user", JSON.stringify(userData))
        router.replace("/dashboard")
      }
      setLoginError("");
    } catch (error) {
      console.error("Sign in failed:", error)
      setLoginError("Invalid Credentials");
    }  
  }

  return (
    <main className="min-h-screen bg-blue-100 flex items-center justify-center">
      {contextHolder}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg flex overflow-hidden">
        {/* left image panel */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://www.marketsandmarkets.com/Images/ai-technologies24.jpg" 
            alt="Signin illustration"
            className="h-full w-full object-cover"
          />
        </div>
        {/* right form panel */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2 text-center">
            HOSPICEIQ - Sign in
          </h1>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            {loginError !== "" ? (
              <span className="text-red-500">{loginError}</span>
            ) : (
              "Enter your credentials."
            )}
          </p>
          <form className="grid gap-4">
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
            <button
              onClick={handleSignIn}
              type="button"
              className="h-10 rounded-md bg-brand text-background hover:bg-blue-400"
            >
              Sign in
            </button>
          </form>
          <p className="mt-4 mb-3 text-sm text-muted-foreground text-center">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-brand">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
