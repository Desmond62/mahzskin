"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/lib/types"
import { getProducts } from "@/lib/supabase/database"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Simulate loading delay to show skeleton
        await new Promise(resolve => setTimeout(resolve, 800))
        const data = await getProducts()
        setProducts(data)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }
    
    loadProducts()
  }, [])

  return { products, loading }
}
