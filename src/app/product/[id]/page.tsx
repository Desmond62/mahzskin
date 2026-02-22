"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "@/lib/supabase/database";
import { useSupabaseCart } from "@/hooks/use-supabase-cart";
import { useSupabaseWishlist } from "@/hooks/use-supabase-wishlist";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { formatPrice, convertPrice, getCurrency } from "@/lib/currency-rates";
import { showToast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useSupabaseAuth();
  const [currency, setCurrency] = useState(getCurrency());
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const { addItem: addToCartSupabase } = useSupabaseCart();
  const { wishlist, addToWishlist: addToWishlistSupabase, removeItem: removeFromWishlistSupabase } = useSupabaseWishlist();

  const productId = params.id as string;

  // Check if product is in wishlist
  const inWishlist = wishlist.some(item => item.id === productId);

  // Fetch product from Supabase
  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const data = await getProductById(productId);
        
        if (!data) {
          showToast("Product not found", "error");
          router.push("/products");
          return;
        }
        
        setProduct(data);
      } catch (error) {
        console.error("Error loading product:", error);
        showToast("Failed to load product", "error");
        router.push("/products");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId, router]);

  // Listen for currency changes
  useEffect(() => {
    const handleCurrencyChange = () => {
      setCurrency(getCurrency());
    };

    window.addEventListener("currencyChange", handleCurrencyChange);

    return () => {
      window.removeEventListener("currencyChange", handleCurrencyChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const price = convertPrice(product.price, "NGN", currency);

  const handleAddToCart = async () => {
    if (!user) {
      showToast("Please login to add items to cart", "error");
      router.push("/auth/login");
      return;
    }

    try {
      await addToCartSupabase(product.id, quantity);
      showToast(`${product.name} added to cart`, "success");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast("Failed to add to cart", "error");
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      showToast("Please login to manage wishlist", "error");
      router.push("/auth/login");
      return;
    }

    try {
      if (inWishlist) {
        const wishlistItem = wishlist.find(item => item.id === productId);
        if (wishlistItem?.wishlistItemId) {
          await removeFromWishlistSupabase(wishlistItem.wishlistItemId);
          showToast(`${product.name} removed from wishlist`, "info");
        }
      } else {
        await addToWishlistSupabase(product.id);
        showToast(`${product.name} added to wishlist`, "success");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      showToast("Failed to update wishlist", "error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square bg-accent rounded-lg overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary">
              {formatPrice(price, currency)}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded border border-border flex items-center justify-center hover:bg-accent"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded border border-border flex items-center justify-center hover:bg-accent"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={handleAddToCart} className="w-full" size="lg">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>

            <Button
              onClick={handleToggleWishlist}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Heart
                className={`h-5 w-5 mr-2 ${
                  inWishlist ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </Button>
          </div>

          {/* Product Info */}
          <div className="border-t pt-6 space-y-2 text-sm text-muted-foreground">
            <p>✓ Free shipping on orders over ₦50,000</p>
            <p>✓ 30-day return policy</p>
            <p>✓ Authentic products guaranteed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
