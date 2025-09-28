"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ZawdaLogo } from "@/components/zawda-logo"
import { AuthForm } from "@/components/auth-form"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated (simplified check)
    const isAuthenticated = localStorage.getItem("zawda-authenticated")
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [router])

  const handleAuthSuccess = () => {
    localStorage.setItem("zawda-authenticated", "true")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand Section */}
      <div className="flex-1 gradient-bg flex flex-col items-center justify-center p-8 text-white">
        <div className="max-w-md text-center space-y-8">
          <ZawdaLogo className="w-20 h-20 mx-auto" />

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-balance">Preserve Your Wealth</h1>
            <p className="text-lg text-white/90 text-pretty">
              Zawda uses the Multisig to protect your Bitcoin while you retain full control of your holdings.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <AuthForm />

          {/* Demo Login Button */}
          <div className="mt-6 pt-6 border-t">
            <button
              onClick={handleAuthSuccess}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip authentication (Demo Mode)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
