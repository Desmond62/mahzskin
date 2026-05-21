"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getCart as getSupabaseCart, addToCart as addToCartDB, removeFromCart as removeFromCartDB, updateCartItemQuantity } from "@/lib/supabase/database";
import { useSupabaseAuth } from "./use-supabase-auth";
import type { Product } from "@/lib/types";

interface CartItem extends Product {
  quantity: number;
  cartItemId: string;
}

// Guest cart key in localStorage
const GUEST_CART_KEY = "mahzskin_guest_cart";

function getGuestCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(cart: CartItem[]): void {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
}

function clearGuestCart(): void {
  localStorage.removeItem(GUEST_CART_KEY);
}

export function useSupabaseCart() {
  const { user } = useSupabaseAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(false);

  const loadCart = useCallback(async () => {
    if (loadingRef.current) return;

    // Guest: load from localStorage
    if (!user) {
      setCart(getGuestCart());
      setLoading(false);
      return;
    }

    loadingRef.current = true;
    try {
      const data = await getSupabaseCart(user.id);
      setCart(data);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [user]);

  // When a user logs in, merge their guest cart into Supabase then clear it
  useEffect(() => {
    if (!user) return;

    const guestCart = getGuestCart();
    if (guestCart.length === 0) return;

    const mergeGuestCart = async () => {
      try {
        for (const item of guestCart) {
          await addToCartDB(user.id, item.id, item.quantity);
        }
        clearGuestCart();
        await loadCart();
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (error) {
        console.error("Error merging guest cart:", error);
      }
    };

    mergeGuestCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => loadCart();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [loadCart]);

  const addToCart = async (productId: string, quantity: number = 1, product?: Product) => {
    // Logged-in user: save to Supabase
    if (user) {
      await addToCartDB(user.id, productId, quantity);
      await loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
      return;
    }

    // Guest: save full product details to localStorage so cart can render correctly
    const guestCart = getGuestCart();
    const existing = guestCart.find((item) => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      // Store the full product so image/name/price are available when rendering
      const fullItem: CartItem = {
        ...(product as Product),
        id: productId,
        quantity,
        cartItemId: `guest-${productId}`,
      };
      guestCart.push(fullItem);
    }
    saveGuestCart(guestCart);
    setCart([...guestCart]);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (user) {
      await updateCartItemQuantity(cartItemId, quantity);
      await loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
      return;
    }

    // Guest
    const guestCart = getGuestCart().map((item) =>
      item.cartItemId === cartItemId ? { ...item, quantity } : item
    );
    saveGuestCart(guestCart);
    setCart(guestCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = async (cartItemId: string) => {
    if (user) {
      await removeFromCartDB(cartItemId);
      await loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
      return;
    }

    // Guest
    const guestCart = getGuestCart().filter((item) => item.cartItemId !== cartItemId);
    saveGuestCart(guestCart);
    setCart(guestCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);

  return {
    cart,
    loading,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeItem,
    refreshCart: loadCart,
  };
}
