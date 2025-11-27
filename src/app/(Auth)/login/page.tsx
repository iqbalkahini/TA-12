'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const { isLoggedIn, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Jika user sudah login, redirect ke admin dashboard
    if (!loading && isLoggedIn) {
      router.push('/admin')
    }
  }, [isLoggedIn, loading, router])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // If user is already logged in, show redirecting message
  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-svh bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}