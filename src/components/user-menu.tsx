"use client"

import { useState } from "react"
import { User, LogOut } from "lucide-react"
import { signOut } from "@/lib/supabase/auth"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface UserMenuProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

export function UserMenu({ isMobile = false, onNavigate }: UserMenuProps) {
  const router = useRouter()
  const { user, loading } = useSupabaseAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut()
      setIsOpen(false)
      if (onNavigate) onNavigate()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-5 w-5 bg-gray-300 rounded-full" />
      </div>
    )
  }

  // Mobile: Direct link to login if not logged in
  if (!user && isMobile) {
    return (
      <Link 
        href="/auth/login" 
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-accent rounded transition-colors"
        onClick={onNavigate}
      >
        <User className="h-5 w-5" />
        Login / Register
      </Link>
    )
  }

  // Desktop: Icon link to login if not logged in
  if (!user) {
    return (
      <Link href="/auth/login" className="hover:text-primary transition-colors" aria-label="User account">
        <User className="h-5 w-5" />
      </Link>
    )
  }

  // Mobile: Show user details inline
  if (isMobile) {
    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
    const userAvatar = user.user_metadata?.avatar_url
    
    return (
      <div className="px-4 py-2 space-y-2">
        <div className="border-b border-border pb-2">
          <div className="flex items-center gap-3 mb-2">
            {userAvatar ? (
              <Image 
                src={userAvatar} 
                alt={userName}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm hover:bg-accent rounded transition-colors flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    )
  }

  // Desktop: Dropdown menu
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const userAvatar = user.user_metadata?.avatar_url

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:text-primary transition-colors flex items-center justify-center"
        aria-label="User menu"
      >
        {userAvatar ? (
          <Image 
            src={userAvatar} 
            alt={userName}
            width={56}
            height={56}
            className="rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all object-cover"
            style={{ width: '35px', height: '35px', minWidth: '35px', minHeight: '35px' }}
            priority
          />
        ) : (
          <User className="h-14 w-14" style={{ width: '56px', height: '56px' }} />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center gap-3 mb-2">
                {userAvatar ? (
                  <Image 
                    src={userAvatar} 
                    alt={userName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
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
