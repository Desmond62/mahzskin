"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, convertPrice, getCurrency } from "@/lib/currency-rates";
import { Loader } from "@/components/ui/loader";
import { useSupabaseCart } from "@/hooks/use-supabase-cart";
import { useSupabaseWishlist } from "@/hooks/use-supabase-wishlist";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { showToast } from "./toast";

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, isClosing, onClose }: QuickViewModalProps) {
  const [currency, setCurrency] = useState(getCurrency());
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [showHeartSplash, setShowHeartSplash] = useState(false);

  const { user } = useSupabaseAuth();
  const { addToCart } = useSupabaseCart();
  const { wishlist, addToWishlist, removeItem } = useSupabaseWishlist();
  
  const wishlistItem = wishlist.find(item => item.id === product.id);
  const inWishlist = !!wishlistItem;

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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

  // Only render on client side
  if (typeof window === 'undefined' || !isOpen) return null;

  const price = convertPrice(product.price, "NGN", currency);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      showToast(`"${product.name}" (${quantity}x) added to cart!`, "success");
      onClose();
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast("Failed to add product to cart", "error");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }
    
    setIsBuying(true);
    try {
      await addToCart(product.id, quantity);
      showToast(`"${product.name}" (${quantity}x) added to cart!`, "success");
      // Open cart drawer
      window.dispatchEvent(new Event("toggleCart"));
      onClose();
    } catch (error) {
      console.error("Error buying now:", error);
      showToast("Failed to add product to cart", "error");
    } finally {
      setIsBuying(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }
    
    // Trigger splash animation
    setShowHeartSplash(true);
    setTimeout(() => setShowHeartSplash(false), 600);
    
    try {
      if (inWishlist && wishlistItem) {
        await removeItem(wishlistItem.wishlistItemId);
        showToast(`"${product.name}" removed from wishlist`, "success");
      } else {
        await addToWishlist(product.id);
        showToast(`"${product.name}" added to wishlist!`, "success");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      showToast("Failed to update wishlist", "error");
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-999999999">
      {/* Overlay - covers entire screen */}
      <div
        className={`fixed inset-0 bg-black/80 ${
          isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
        }`}
        onClick={onClose}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Modal Container - centered */}
      <div 
        className="fixed inset-0 flex items-center justify-center p-6 pointer-events-none"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        {/* Modal Content */}
        <div 
          className={`relative bg-white rounded-lg max-w-3xl w-full shadow-2xl pointer-events-auto ${
            isClosing ? 'animate-scaleOut' : 'animate-scaleIn'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-black text-white hover:bg-gray-800 rounded-sm transition-colors shadow-lg z-10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Product Image with Zoom */}
              <ImageZoom
                src={product.image || "/placeholder.svg"}
                alt={product.name}
              />

              {/* Product Details */}
              <div className="p-6 flex flex-col">
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                  
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span>🔥</span> 8 sold in last 17 hours
                  </p>
                  
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>Availability: {product.inStock ? "In stock" : "Out of stock"}</p>
                    <p>Product type:</p>
                  </div>

                  <div className="text-2xl font-bold text-gray-900">
                    {formatPrice(price, currency)}
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2 text-gray-700">Quantity:</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-gray-600"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-gray-600"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-700">
                    <p>Subtotal: <span className="font-semibold">{formatPrice(price * quantity, currency)}</span></p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart || isBuying}
                      className="flex-1 bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isAddingToCart && <Loader className="h-5 w-5" />}
                      {isAddingToCart ? "ADDING..." : "ADD TO CART"}
                    </button>
                    
                    <button
                      onClick={handleToggleWishlist}
                      className="p-3 border border-gray-300 rounded hover:bg-gray-100 transition-colors relative overflow-hidden"
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        className={`h-5 w-5 transition-all duration-300 ${
                          inWishlist ? "fill-red-500 text-red-500 scale-110" : "text-gray-600"
                        }`}
                      />
                      {/* Splash effect */}
                      {showHeartSplash && (
                        <>
                          <span className="absolute inset-0 rounded bg-red-500/30 animate-ping" />
                          <span className="absolute inset-0 rounded bg-red-500/20 animate-pulse" />
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={handleBuyNow}
                    disabled={isAddingToCart || isBuying}
                    className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isBuying && <Loader className="h-5 w-5" />}
                    {isBuying ? "Processing..." : "Buy Now"}
                  </button>

                  <div className="text-xs text-gray-500 flex items-center gap-1 pt-2">
                    <span>👁</span> 283 customers are viewing this product
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.7);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes scaleOut {
          from {
            opacity: 1;
            transform: scale(0.7);
          }
          to {
            opacity: 0;
            transform: scale(0.7);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-fadeOut {
          animation: fadeOut 0.4s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-scaleOut {
          animation: scaleOut 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
}

////=================== Image Zoom Component ===================////
function ImageZoom({ src, alt }: { src: string; alt: string }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  // Use lazy initializer to detect touch device on mount without useEffect
  const [isTouchDevice] = useState(() => 
    typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || isTouchDevice) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPosition({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    
    setPosition({ x, y });
  };

  const handleTouchStart = () => {
    setIsZoomed(true);
  };

  const handleTouchEnd = () => {
    setIsZoomed(false);
  };

  return (
    <div
      className="relative aspect-square bg-gray-100 flex items-center justify-center p-8 overflow-hidden cursor-zoom-in touch-none"
      onMouseEnter={() => !isTouchDevice && setIsZoomed(true)}
      onMouseLeave={() => !isTouchDevice && setIsZoomed(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-contain transition-transform duration-200 ${
          isZoomed ? 'scale-300' : 'scale-100'
        }`}
        style={
          isZoomed
            ? {
                transformOrigin: `${position.x}% ${position.y}%`,
              }
            : undefined
        }
        onError={(e) => {
          e.currentTarget.src = '/placeholder.svg';
        }}
      />
      {isZoomed && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
          {isTouchDevice ? 'Drag to explore' : 'Move cursor to explore'}
        </div>
      )}
    </div>
  );
}
