import { create } from 'zustand'
import type { CartItem } from '@/lib/types'
import { getCart, updateCartQuantity as updateCartInStorage, removeFromCart as removeFromCartInStorage } from '@/lib/storage'

interface CartStore {
  isOpen: boolean
  isVisible: boolean
  cart: CartItem[]
  isCheckingOut: boolean
  isViewingCart: boolean
  
  // Actions
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
  setIsVisible: (visible: boolean) => void
  updateCart: () => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  setIsCheckingOut: (loading: boolean) => void
  setIsViewingCart: (loading: boolean) => void
}

export const useCartStore = create<CartStore>((set, get) => ({
  isOpen: false,
  isVisible: false,
  cart: [],
  isCheckingOut: false,
  isViewingCart: false,

  openDrawer: () => {
    set({ isOpen: true })
    setTimeout(() => set({ isVisible: true }), 10)
    document.body.style.overflow = 'hidden'
    get().updateCart()
  },

  closeDrawer: () => {
    set({ isVisible: false })
    setTimeout(() => {
      set({ isOpen: false })
      document.body.style.overflow = 'unset'
    }, 300)
  },

  toggleDrawer: () => {
    const { isOpen } = get()
    if (isOpen) {
      get().closeDrawer()
    } else {
      get().openDrawer()
    }
  },

  setIsVisible: (visible) => set({ isVisible: visible }),

  updateCart: () => {
    set({ cart: getCart() })
  },

  updateQuantity: (productId, quantity) => {
    if (quantity < 1) return
    updateCartInStorage(productId, quantity)
    get().updateCart()
    window.dispatchEvent(new Event('cartUpdated'))
  },

  removeItem: (productId) => {
    removeFromCartInStorage(productId)
    get().updateCart()
    window.dispatchEvent(new Event('cartUpdated'))
  },

  setIsCheckingOut: (loading) => set({ isCheckingOut: loading }),
  
  setIsViewingCart: (loading) => set({ isViewingCart: loading }),
}))
