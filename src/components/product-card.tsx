"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";
import {
  addToCart,
  addToWishlist,
  isInWishlist,
  removeFromWishlist,
} from "@/lib/storage";
import { formatPrice, convertPrice, getCurrency } from "@/lib/currency-rates";
import Image from "next/image";
import { Button } from "./ui/button";
import { Loader } from "./ui/loader";
import { QuickViewModal } from "./quick-view-modal";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [currency, setCurrency] = useState(getCurrency());
  const [inWishlist, setInWishlist] = useState(isInWishlist(product.id));
  const [showQuickView, setShowQuickView] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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

  // Listen for wishlist changes
  useEffect(() => {
    const handleWishlistChange = () => {
      setInWishlist(isInWishlist(product.id));
    };

    window.addEventListener("wishlistUpdated", handleWishlistChange);

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistChange);
    };
  }, [product.id]);

  const price = convertPrice(product.price, "NGN", currency);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    setTimeout(() => {
      addToCart(product, quantity);
      window.dispatchEvent(new Event("cartUpdated"));
      setIsAddingToCart(false);
    }, 500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product.id);
      setInWishlist(false);
    } else {
      const added = addToWishlist(product);
      if (added) {
        setInWishlist(true);
      }
    }
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
    document.body.style.overflow = "hidden";
  };

  const closeQuickView = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowQuickView(false);
      setIsClosing(false);
      document.body.style.overflow = "unset";
    }, 400);
  };

  return (
    <>
      <div className="group">
        <div className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow">
          <div className="relative aspect-square overflow-hidden bg-accent">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Wishlist button - always visible on mobile, hover on desktop */}
            <button
              onClick={handleToggleWishlist}
              className="absolute top-3 right-3 p-2 bg-card/90 rounded-full hover:bg-card transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
              aria-label="Add to wishlist"
            >
              <Heart
                className={`h-6 w-6 md:h-5 md:w-5 ${
                  inWishlist ? "fill-red-500 text-red-500" : "text-foreground"
                }`}
                strokeWidth={2.5}
              />
            </button>

            {/* Quick View icon - always visible on mobile, hover on desktop */}
            <button
              onClick={handleQuickView}
              className="absolute bottom-3 left-3 p-2 bg-card/90 rounded-full hover:bg-card transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
              aria-label="Quick view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.category}
            </p>
            <h3 className="font-medium text-sm line-clamp-2 min-h-[40px]">
              {product.name}
            </h3>
            <p className="font-semibold text-lg">{formatPrice(price, currency)}</p>
            <Button 
              onClick={handleAddToCart} 
              className="w-full"
              disabled={isAddingToCart}
              variant="outline"
            >
              {isAddingToCart ? (
                <>
                  <Loader className="h-4 w-4 mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        isClosing={isClosing}
        onClose={closeQuickView}
      />
    </>
  );
}
