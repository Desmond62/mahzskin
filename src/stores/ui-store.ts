import { create } from 'zustand'
import { getCurrency } from '@/lib/currency-rates'
import type { Product } from '@/lib/types'

interface UIStore {
  // Header state
  cartCount: number
  wishlistCount: number
  isScrolled: boolean
  isHeaderVisible: boolean
  searchOpen: boolean
  searchQuery: string
  mobileMenuOpen: boolean
  aboutDropdownOpen: boolean
  
  // Search bar state
  searchResults: Product[]
  showSearchResults: boolean
  
  // Global UI state
  currency: string
  isDesktop: boolean
  
  // Actions
  setCartCount: (count: number) => void
  setWishlistCount: (count: number) => void
  setIsScrolled: (scrolled: boolean) => void
  setIsHeaderVisible: (visible: boolean) => void
  setSearchOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
  setMobileMenuOpen: (open: boolean) => void
  setAboutDropdownOpen: (open: boolean) => void
  setSearchResults: (results: Product[]) => void
  setShowSearchResults: (show: boolean) => void
  setCurrency: (currency: string) => void
  setIsDesktop: (isDesktop: boolean) => void
  toggleSearch: () => void
  toggleMobileMenu: () => void
  clearSearch: () => void
  closeSearch: () => void
}

export const useUIStore = create<UIStore>((set, get) => ({
  cartCount: 0,
  wishlistCount: 0,
  isScrolled: false,
  isHeaderVisible: true,
  searchOpen: false,
  searchQuery: '',
  mobileMenuOpen: false,
  aboutDropdownOpen: false,
  searchResults: [],
  showSearchResults: false,
  currency: getCurrency(),
  isDesktop: typeof window !== 'undefined' ? window.innerWidth >= 1024 : false,

  setCartCount: (count) => set({ cartCount: count }),
  setWishlistCount: (count) => set({ wishlistCount: count }),
  setIsScrolled: (scrolled) => set({ isScrolled: scrolled }),
  setIsHeaderVisible: (visible) => set({ isHeaderVisible: visible }),
  setSearchOpen: (open) => {
    set({ searchOpen: open })
    if (typeof document !== 'undefined') {
      document.body.style.overflow = open ? 'hidden' : 'unset'
    }
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
  setMobileMenuOpen: (open) => {
    set({ mobileMenuOpen: open })
    if (typeof document !== 'undefined') {
      document.body.style.overflow = open ? 'hidden' : 'unset'
    }
  },
  setAboutDropdownOpen: (open) => set({ aboutDropdownOpen: open }),
  setSearchResults: (results) => set({ searchResults: results }),
  setShowSearchResults: (show) => set({ showSearchResults: show }),
  setCurrency: (currency) => set({ currency }),
  setIsDesktop: (isDesktop) => set({ isDesktop }),
  
  toggleSearch: () => {
    const { searchOpen } = get()
    get().setSearchOpen(!searchOpen)
  },
  
  toggleMobileMenu: () => {
    const { mobileMenuOpen } = get()
    get().setMobileMenuOpen(!mobileMenuOpen)
  },
  
  clearSearch: () => {
    set({ searchQuery: '', searchResults: [], showSearchResults: false, searchOpen: false })
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'unset'
    }
  },
  
  closeSearch: () => {
    set({ searchOpen: false, showSearchResults: false })
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'unset'
    }
  },
}))
