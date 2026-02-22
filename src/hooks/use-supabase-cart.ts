"use client";

import { useEffect, useState } from "react";
import { getCart, addToCart as addToCartDB, removeFromCart, updateCartItemQuantity } from "@/lib/supabase/database";
import { useSupabaseAuth } from "./use-supabase-auth";
import type { Product } from "@/lib/types";

interface CartItem extends Product {
  quantity: number;
  cartItemId: string;
}

export function useSupabaseCart() {
  const { user } = useSupabaseAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    if (!user) {
      setCart([]);
      setLoading(false);
      return;
    }

    try {
      const data = await getCart(user.id);
      setCart(data);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };
    
    window.addEventListener("cartUpdated", handleCartUpdate);
    
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) {
      throw new Error("Must be logged in to add to cart");
    }

    await addToCartDB(user.id, productId, quantity);
    await loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    await updateCartItemQuantity(cartItemId, quantity);
    await loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = async (cartItemId: string) => {
    await removeFromCart(cartItemId);
    await loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return {
    cart,
    loading,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeItem,
    refreshCart: loadCart
  };
}
