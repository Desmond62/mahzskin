"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react"
import type { CartItem } from "@/lib/types"
import { getCart, updateCartQuantity, removeFromCart } from "@/lib/storage"
import { formatPrice, convertPrice, getCurrency } from "@/lib/currency-rates"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from 'next/image'

export default function CartPage() {
  // Cart page is now accessible to all users
  
  const [cart, setCart] = useState<CartItem[]>([])
  const [currency, setCurrency] = useState("NGN")
  const [couponCode, setCouponCode] = useState("")
  const [country, setCountry] = useState("Nigeria")
  const [state, setState] = useState("Abia")

  useEffect(() => {
    const initializeCart = () => {
      setCart(getCart())
      setCurrency(getCurrency())
    }
    
    initializeCart()

    const handleCurrencyChange = () => setCurrency(getCurrency())
    window.addEventListener("currencyChange", handleCurrencyChange)

    return () => window.removeEventListener("currencyChange", handleCurrencyChange)
  }, [])

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateCartQuantity(productId, newQuantity)
    setCart(getCart())
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const handleRemove = (productId: string) => {
    removeFromCart(productId)
    setCart(getCart())
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const subtotal = cart.reduce((sum, item) => {
    const price = convertPrice(item.product.price, "NGN", currency)
    return sum + price * item.quantity
  }, 0)

  const shipping = 4000
  const shippingConverted = convertPrice(shipping, "NGN", currency)
  const total = subtotal + shippingConverted

  return (
    <div className="min-h-screen bg-[#F8E7DD]">
      <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">YOUR CART</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-6">Your cart is empty</p>
            <Button asChild size="lg">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-accent/50 border border-border rounded-lg p-4 mb-8 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm">
                Please, hurry! Someone has placed an order on one of the items you have in the cart. We&apos;ll keep it for
                you for 39:52 minutes.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart items */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  {/* Table header - Desktop only */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-accent/30 border-b border-border text-sm font-medium">
                    <div className="col-span-5">PRODUCT</div>
                    <div className="col-span-2 text-center">PRICE</div>
                    <div className="col-span-3 text-center">QUANTITY</div>
                    <div className="col-span-2 text-right">TOTAL</div>
                  </div>

                  {/* Cart items */}
                  {cart.map((item) => {
                    const price = convertPrice(item.product.price, "NGN", currency)
                    const itemTotal = price * item.quantity

                    return (
                      <div key={item.product.id}>
                        {/* Desktop layout */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-6 border-b border-border items-center">
                          <div className="col-span-5 flex items-center gap-4">
                            <Image
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-cover rounded"
                            />
                            <div>
                              <h3 className="font-medium text-sm mb-1">{item.product.name}</h3>
                              <p className="text-xs text-muted-foreground">{item.product.category}</p>
                            </div>
                          </div>

                          <div className="col-span-2 text-center">
                            <p className="font-medium">{formatPrice(price, currency)}</p>
                          </div>

                          <div className="col-span-3 flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="h-8 w-8 rounded border border-border flex items-center justify-center hover:bg-accent"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="text-sm w-12 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="h-8 w-8 rounded border border-border flex items-center justify-center hover:bg-accent"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRemove(item.product.id)}
                              className="ml-2 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="col-span-2 text-right">
                            <p className="font-semibold">{formatPrice(itemTotal, currency)}</p>
                          </div>
                        </div>

                        {/* Mobile layout - Card style */}
                        <div className="md:hidden p-4 border-b border-border">
                          <div className="flex gap-4 mb-4">
                            <Image
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-cover rounded flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.product.name}</h3>
                              <p className="text-xs text-muted-foreground mb-2">{item.product.category}</p>
                              <p className="font-semibold text-sm">{formatPrice(price, currency)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                className="h-8 w-8 rounded border border-border flex items-center justify-center hover:bg-accent"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="text-sm w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                className="h-8 w-8 rounded border border-border flex items-center justify-center hover:bg-accent"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Total</p>
                                <p className="font-semibold">{formatPrice(itemTotal, currency)}</p>
                              </div>
                              <button
                                onClick={() => handleRemove(item.product.id)}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Additional comments */}
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">Additional Comments</label>
                  <textarea
                    placeholder="Special instruction for seller..."
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    rows={4}
                  />
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <p className="text-sm text-muted-foreground">Secure shopping guarantee</p>
                </div>
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                  <h2 className="text-lg font-semibold mb-6">ORDER SUMMARY</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal: {cart.length} items</span>
                      <span className="font-medium">{formatPrice(subtotal, currency)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">{formatPrice(shippingConverted, currency)}</span>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between text-base font-semibold">
                        <span>TOTAL:</span>
                        <span>{formatPrice(total, currency)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Get shipping estimate:</label>
                    <select
                      value={country}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCountry(e.target.value)}
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option>Nigeria</option>
                      <option>Ghana</option>
                      <option>Kenya</option>
                    </select>

                    <select
                      value={state}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setState(e.target.value)}
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option>Abia</option>
                      <option>Lagos</option>
                      <option>Abuja</option>
                    </select>

                    <Input placeholder="Postal code" className="mb-3" />

                    <Button variant="outline" className="w-full bg-transparent">
                      CALCULATE SHIPPING
                    </Button>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Coupon code</label>
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCouponCode(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Coupon code will be applied on the checkout page
                    </p>
                  </div>

                  <p className="text-sm text-center text-muted-foreground mb-4">Nationwide Shipping Available</p>

                  <Button asChild className="w-full mb-3" size="lg">
                    <Link href="/checkout">
                      PROCEED TO CHECKOUT
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full bg-transparent" size="lg">
                    <Link href="/">CONTINUE SHOPPING</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-12 bg-accent/30 border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-destructive mb-2">Disclaimer (International Orders)</h3>
              <p className="text-sm text-muted-foreground">
                Please note that the international shipping fee displayed at checkout may not be accurate, as our
                website is currently undergoing an upgrade. The final shipping cost will be confirmed and communicated
                after your order arrives at DHL and has been processed by them. Thank you for your understanding.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
  );
}
