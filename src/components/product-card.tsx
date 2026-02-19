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
            
            {/* Wishlist button - only visible on hover */}
            <button
              onClick={handleToggleWishlist}
              className="absolute top-3 right-3 p-2 bg-card/90 rounded-full hover:bg-card transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Add to wishlist"
            >
              <Heart
                className={`h-5 w-5 ${
                  inWishlist ? "fill-red-500 text-red-500" : "text-foreground"
                }`}
              />
            </button>

            {/* Quick View button - only visible on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 z-0">
              <Button
                onClick={handleQuickView}
                variant="secondary"
                size="sm"
                className="shadow-lg"
              >
                Quick View
              </Button>
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {product.category}
            </p>
            <h3 className="font-medium text-sm mb-2 line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <p className="font-semibold">{formatPrice(price, currency)}</p>
              <Button 
                size="sm" 
                onClick={handleAddToCart} 
                className="gap-2"
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  <Loader className="h-4 w-4" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
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
