"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { WelcomeBanner } from "@/components/welcome-banner"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith("/auth")
  const isCheckoutPage = pathname?.startsWith("/checkout")
  const isAdminPage = pathname?.startsWith("/admin")

  // Admin pages: no header, no footer, no cart drawer
  if (isAdminPage) {
    return <main>{children}</main>
  }

  // Auth pages: no header, no footer, no cart drawer
  if (isAuthPage) {
    return <main>{children}</main>
  }

  // Checkout pages: header and cart drawer only
  if (isCheckoutPage) {
    return (
      <>
        <Header />
        <main>{children}</main>
        <CartDrawer />
      </>
    )
  }

  // Regular pages: full layout
  return (
    <>
      <WelcomeBanner />
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
    </>
  )
}
