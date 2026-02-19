export type Currency = "EUR" | "USD" | "GBP" | "NGN" | "CHF"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: Currency
  image: string
  category: string
  inStock: boolean
  featured?: boolean
  sales?: number
  createdAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface WishlistItem {
  product: Product
  addedAt: number
}

export interface User {
  id: string
  email: string
  name: string
}
