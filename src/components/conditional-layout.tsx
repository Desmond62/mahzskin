"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith("/auth")
  const isCheckoutPage = pathname?.startsWith("/checkout")

  if (isAuthPage) {
    return <main>{children}</main>
  }

  if (isCheckoutPage) {
    return (
      <>
        <Header />
        <main>{children}</main>
        <CartDrawer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
    </>
  )
}
