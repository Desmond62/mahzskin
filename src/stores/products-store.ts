import { create } from 'zustand'
import type { Product } from '@/lib/types'
import { getProducts } from '@/lib/supabase/database'

interface ProductsStore {
  products: Product[]
  loading: boolean
  error: string | null
  lastFetched: number | null
  
  // Actions
  setProducts: (products: Product[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  loadProducts: () => Promise<void>
  retry: () => Promise<void>
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  lastFetched: null,

  setProducts: (products) => set({ products, lastFetched: Date.now() }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  loadProducts: async () => {
    const { lastFetched, loading } = get()
    
    // Don't fetch if already loading
    if (loading) return
    
    // Don't fetch if we fetched less than 5 minutes ago
    if (lastFetched && Date.now() - lastFetched < 5 * 60 * 1000) {
      console.log('✅ Using cached products')
      return
    }

    try {
      set({ loading: true, error: null })
      console.log('🔄 Fetching products from Supabase...')
      const data = await getProducts()
      set({ products: data, lastFetched: Date.now(), error: null })
      console.log('✅ Products loaded:', data.length)
    } catch (error) {
      console.error('❌ Error loading products:', error)
      set({ error: 'offline' })
    } finally {
      set({ loading: false })
    }
  },

  retry: async () => {
    set({ lastFetched: null }) // Reset cache
    await get().loadProducts()
  },
}))
