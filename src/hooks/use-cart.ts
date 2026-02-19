"use client"

import { useState, useEffect } from "react"
import type { CartItem } from "@/lib/types"
import { getCart } from "@/lib/storage"

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    const updateCart = () => {
      const currentCart = getCart()
      setCart(currentCart)
      setCount(currentCart.reduce((sum, item) => sum + item.quantity, 0))
    }

    updateCart()

    window.addEventListener("cartUpdated", updateCart)
    return () => window.removeEventListener("cartUpdated", updateCart)
  }, [])

  return { cart, count }
}
