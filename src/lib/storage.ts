import type { CartItem, WishlistItem, Product } from "./types"
import { showToast } from "@/components/toast"

export const STORAGE_KEYS = {
  CART: "fw_cart",
  WISHLIST: "fw_wishlist",
  PRODUCTS: "fw_products",
  CURRENCY: "fw_currency",
  USER: "fw_user",
}

// Cart operations
export function getCart(): CartItem[] {
  if (typeof window === "undefined") return []
  const cart = localStorage.getItem(STORAGE_KEYS.CART)
  return cart ? JSON.parse(cart) : []
}

export function saveCart(cart: CartItem[]): void {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart))
}

export function addToCart(product: Product, quantity = 1): void {
  const cart = getCart()
  const existingItem = cart.find((item) => item.product.id === product.id)

  if (existingItem) {
    existingItem.quantity += quantity
    showToast(`Updated ${product.name} quantity in cart`, "success")
  } else {
    cart.push({ product, quantity })
    showToast(`${product.name} added to cart successfully!`, "success")
  }

  saveCart(cart)
}

export function removeFromCart(productId: string): void {
  const cart = getCart()
  const item = cart.find((item) => item.product.id === productId)
  const filteredCart = cart.filter((item) => item.product.id !== productId)
  
  if (item) {
    showToast(`${item.product.name} removed from cart`, "info")
  }
  
  saveCart(filteredCart)
}

export function updateCartQuantity(productId: string, quantity: number): void {
  const cart = getCart()
  const item = cart.find((item) => item.product.id === productId)
  if (item) {
    item.quantity = quantity
    saveCart(cart)
  }
}

// Wishlist operations
export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return []
  const wishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST)
  return wishlist ? JSON.parse(wishlist) : []
}

export function saveWishlist(wishlist: WishlistItem[]): void {
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist))
}

export function addToWishlist(product: Product): boolean {
  const wishlist = getWishlist()
  const exists = wishlist.some((item) => item.product.id === product.id)

  if (!exists) {
    wishlist.push({ product, addedAt: Date.now() })
    saveWishlist(wishlist)
    showToast(`${product.name} added to wishlist!`, "success")
    return true
  } else {
    showToast(`${product.name} is already in your wishlist`, "info")
  }
  return false
}

export function removeFromWishlist(productId: string): void {
  const wishlist = getWishlist()
  const item = wishlist.find((item) => item.product.id === productId)
  const filteredWishlist = wishlist.filter((item) => item.product.id !== productId)
  
  if (item) {
    showToast(`${item.product.name} removed from wishlist`, "info")
  }
  
  saveWishlist(filteredWishlist)
}

export function isInWishlist(productId: string): boolean {
  return getWishlist().some((item) => item.product.id === productId)
}

// Currency operations
export function getCurrency(): string {
  if (typeof window === "undefined") return "NGN"
  return localStorage.getItem(STORAGE_KEYS.CURRENCY) || "NGN"
}

export function saveCurrency(currency: string): void {
  localStorage.setItem(STORAGE_KEYS.CURRENCY, currency)
}
