"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/lib/types"
import { getProducts, initializeProducts } from "@/lib/sample-products"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = () => {
      initializeProducts()
      setProducts(getProducts())
      setLoading(false)
    }
    
    loadProducts()
  }, [])

  return { products, loading }
}
