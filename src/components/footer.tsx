"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui"
import { useState } from "react"

export function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Store subscription in localStorage
      const subscriptions = JSON.parse(localStorage.getItem("mahzskin_newsletter") || "[]")
      subscriptions.push({ email, date: new Date().toISOString() })
      localStorage.setItem("mahzskin_newsletter", JSON.stringify(subscriptions))
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-[#FFF8E7] border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-4">JOIN THE GLOW SQUAD!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get insider deals, skincare tips, and first dibs on new drops delivered straight to your inbox. 100% Fun.
              Zero spam.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 min-w-[180px] px-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button type="submit" className="bg-black text-white hover:bg-black/90 px-6 shrink-0 min-w-[100px]">
                SUBMIT
              </Button>
            </form>
            {subscribed && <p className="text-sm text-green-600 mt-2">Thank you for subscribing!</p>}
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                <span>+234707723208</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                <a href="mailto:mahzskinltd@gmail.com" className="hover:text-primary">
                  mahzskinltd@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-bold text-lg mb-4">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:text-primary">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-primary">
                  Delivery Rates
                </Link>
              </li>
              <li>
                <Link href="/payment" className="hover:text-primary">
                  Payment Details
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-primary">
                  Refund & Return Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Shop */}
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <Link href="/about" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>

            <h3 className="font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=Face" className="hover:text-primary">
                  Face
                </Link>
              </li>
              <li>
                <Link href="/products?category=Body" className="hover:text-primary">
                  Body
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="hover:text-primary">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/products?sort=date-desc" className="hover:text-primary">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/sale" className="hover:text-primary">
                  Special Offers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Copyright © 2026 Mahz-Skin Nigeria. All Rights Reserved.</p>

          {/* Social Media */}
          <div className="flex items-center gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/mahzskin?igsh=cnhxb2hxdzVibG9z&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-2">
            <div  className="px-2 bg-white shadow-2xl rounded-md">
            <Image 
              src="/visa-image.png" 
              alt="Visa" 
              width={48} 
              height={32} 
              title="Visa"
              className="h-8 w-auto object-contain shadow-2xl rounded-md" 
              />
              </div>

           <div>
            <Image 
              src="/mastercard.png" 
              alt="Mastercard" 
              width={48} 
              height={32} 
              title="Mastercard"
              className="h-8 w-auto object-contain shadow-2xl rounded-md" 
              />
            </div>

            <div className="px-1 bg-white shadow-2xl rounded-md">
            <Image 
              src="/paypal.png" 
              alt="PayPal" 
              width={48} 
              height={32} 
              title="Paypal"
              className="h-8 w-auto object-contain" 
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
