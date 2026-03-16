"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, convertPrice, getCurrency } from "@/lib/currency-rates";
import Image from "next/image";
import { Button } from "./ui/button";
import { Loader } from "./ui/loader";
import { QuickViewModal } from "./quick-view-modal";
import { useSupabaseCart } from "@/hooks/use-supabase-cart";
import { useSupabaseWishlist } from "@/hooks/use-supabase-wishlist";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { showToast } from "./toast";

interface ProductCardProps {
  product: Product;
  showNewBadge?: boolean;
}

export function ProductCard({ product, showNewBadge = false }: ProductCardProps) {
  const [currency, setCurrency] = useState(getCurrency());
  const [showQuickView, setShowQuickView] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showHeartSplash, setShowHeartSplash] = useState(false);
  
  const { user } = useSupabaseAuth();
  const { addToCart } = useSupabaseCart();
  const { wishlist, addToWishlist, removeItem } = useSupabaseWishlist();
  
  const wishlistItem = wishlist.find(item => item.id === product.id);
  const inWishlist = !!wishlistItem;

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

  const price = convertPrice(product.price, "NGN", currency);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    // Check if user is online
    if (!navigator.onLine) {
      showToast("No internet connection. Try again when you're back online.", "error");
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, 1);
      showToast(`"${product.name}" added to cart!`, "success");
    } catch (error) {
      console.error("Error adding to cart:", error);
      
      // Check if it's a network error
      if (!navigator.onLine) {
        showToast("No internet connection. Try again when you're back online.", "error");
      } else {
        showToast("Failed to add product to cart", "error");
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    // Check if user is online
    if (!navigator.onLine) {
      showToast("No internet connection. Try again when you're back online.", "error");
      return;
    }
    
    // Trigger splash animation
    setShowHeartSplash(true);
    setTimeout(() => setShowHeartSplash(false), 600);
    
    try {
      if (inWishlist && wishlistItem) {
        await removeItem(wishlistItem.wishlistItemId);
        showToast(`"${product.name}" removed from wishlist`, "info");
      } else {
        await addToWishlist(product.id);
        showToast(`"${product.name}" added to wishlist!`, "success");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      
      // Check if it's a network error
      if (!navigator.onLine) {
        showToast("No internet connection. Try again when you're back online.", "error");
      } else {
        showToast("Failed to update wishlist", "error");
      }
    }
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
              className={`object-cover group-hover:scale-105 transition-transform duration-300 ${!product.inStock ? "blur-sm scale-105" : ""}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* New badge */}
            {showNewBadge && (
              <span className="absolute top-3 left-3 z-10 bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                New
              </span>
            )}

            {/* Out of stock overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/20">
                {/* COMING text in center */}
                <p className="text-white font-bold text-xl sm:text-2xl italic tracking-wide drop-shadow-lg" style={{ fontFamily: 'serif' }}>
                  COMING
                </p>
                {/* Spinner + LOADING pinned to bottom */}
                <div className="absolute bottom-4 flex flex-col items-center gap-1">
                  <div className="relative flex items-center justify-center">
                    <svg className="h-14 w-14" viewBox="0 0 40 40" fill="none">
                      {[0,45,90,135,180,225,270,315].map((angle, i) => (
                        <line
                          key={angle}
                          x1="20" y1="4" x2="20" y2="9"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          className={`seg-${i}`}
                          transform={`rotate(${angle} 20 20)`}
                        />
                      ))}
                    </svg>
                    <div className="absolute flex flex-col items-center leading-none">
                      <span className="text-white text-[9px] font-bold">42%</span>
                      <span className="text-white/60 text-[6px] uppercase tracking-wide">loading</span>
                    </div>
                  </div>
                  <p className="text-white text-[8px] font-semibold uppercase tracking-widest">LOADING...</p>
                </div>
              </div>
            )}
            
            {/* Wishlist button - always visible on mobile, hover on desktop */}
            <button
              onClick={handleToggleWishlist}
              className="absolute top-3 right-3 p-2 bg-card/90 rounded-full hover:bg-card transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10 overflow-hidden"
              aria-label="Add to wishlist"
            >
              <Heart
                className={`h-6 w-6 md:h-5 md:w-5 transition-all duration-300 ${
                  inWishlist ? "fill-red-500 text-red-500 scale-110" : "text-foreground"
                }`}
                strokeWidth={2.5}
              />
              {/* Splash effect */}
              {showHeartSplash && (
                <>
                  <span className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
                  <span className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse" />
                </>
              )}
            </button>

            {/* Quick View button - always visible on mobile, hover on desktop */}
            <button
              onClick={handleQuickView}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 py-2 bg-card/90 rounded hover:bg-card transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10 flex items-center gap-1.5"
              aria-label="Quick view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="hidden md:inline text-xs font-medium">Quick View</span>
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
              className="w-full text-xs sm:text-sm py-2 sm:py-3"
              disabled={isAddingToCart || !product.inStock}
              variant="outline"
            >
              {!product.inStock ? (
                <span className="text-muted-foreground">Out of Stock</span>
              ) : isAddingToCart ? (
                <>
                  <Loader className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Adding...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Add to Cart</span>
                  <span className="sm:hidden">Add</span>
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
