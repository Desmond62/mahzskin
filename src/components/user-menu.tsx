"use client"

import { useEffect, useState } from "react"
import { User, LogOut } from "lucide-react"
import { getUser, logout } from "@/lib/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function UserMenu() {
  const router = useRouter()
  const [user, setUser] = useState(getUser())
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getUser())
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("userChanged", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("userChanged", handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setUser(null)
    setIsOpen(false)
    window.dispatchEvent(new Event("userChanged"))
    router.push("/")
    router.refresh()
  }

  if (!user) {
    return (
      <Link href="/auth/login" className="hover:text-primary transition-colors" aria-label="User account">
        <User className="h-5 w-5" />
      </Link>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:text-primary transition-colors"
        aria-label="User menu"
      >
        <User className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  )
}
