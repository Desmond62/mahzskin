"use client"

import { useWishlist } from "@/hooks/use-wishlist"
import { ProductCard } from "@/components/product-card"
import { Heart } from "lucide-react"

export default function WishlistPage() {
  const { wishlist } = useWishlist()

  return (
    <div className="min-h-screen bg-[#F8E7DD]">
      <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8" />
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <span className="text-muted-foreground">({wishlist.length} items)</span>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Start adding products you love to your wishlist</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <ProductCard key={item.product.id} product={item.product} />
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  )
}
