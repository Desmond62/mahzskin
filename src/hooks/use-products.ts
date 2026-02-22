"use client"

import { useEffect } from "react"
import { useProductsStore } from "@/stores/products-store"

export function useProducts() {
  const { products, loading, error, loadProducts, retry } = useProductsStore()

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return { products, loading, error, retry }
}
