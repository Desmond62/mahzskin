import { create } from 'zustand'

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
  
  // Actions
  setCartCount: (count: number) => void
  setWishlistCount: (count: number) => void
  setIsScrolled: (scrolled: boolean) => void
  setIsHeaderVisible: (visible: boolean) => void
  setSearchOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
  setMobileMenuOpen: (open: boolean) => void
  setAboutDropdownOpen: (open: boolean) => void
  toggleSearch: () => void
  toggleMobileMenu: () => void
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

  setCartCount: (count) => set({ cartCount: count }),
  setWishlistCount: (count) => set({ wishlistCount: count }),
  setIsScrolled: (scrolled) => set({ isScrolled: scrolled }),
  setIsHeaderVisible: (visible) => set({ isHeaderVisible: visible }),
  setSearchOpen: (open) => {
    set({ searchOpen: open })
    document.body.style.overflow = open ? 'hidden' : 'unset'
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
  setMobileMenuOpen: (open) => {
    set({ mobileMenuOpen: open })
    document.body.style.overflow = open ? 'hidden' : 'unset'
  },
  setAboutDropdownOpen: (open) => set({ aboutDropdownOpen: open }),
  
  toggleSearch: () => {
    const { searchOpen } = get()
    get().setSearchOpen(!searchOpen)
  },
  
  toggleMobileMenu: () => {
    const { mobileMenuOpen } = get()
    get().setMobileMenuOpen(!mobileMenuOpen)
  },
}))
