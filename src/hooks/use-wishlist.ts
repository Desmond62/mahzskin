"use client"

import { useState, useEffect } from "react"
import type { WishlistItem } from "@/lib/types"
import { getWishlist } from "@/lib/storage"

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    const updateWishlist = () => {
      const currentWishlist = getWishlist()
      setWishlist(currentWishlist)
      setCount(currentWishlist.length)
    }

    updateWishlist()

    window.addEventListener("wishlistUpdated", updateWishlist)
    return () => window.removeEventListener("wishlistUpdated", updateWishlist)
  }, [])

  return { wishlist, count }
}
