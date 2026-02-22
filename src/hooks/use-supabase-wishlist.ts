"use client";

import { useEffect, useState } from "react";
import { getWishlist, addToWishlist as addToWishlistDB, removeFromWishlist, isInWishlist as checkIsInWishlist } from "@/lib/supabase/database";
import { useSupabaseAuth } from "./use-supabase-auth";
import type { Product } from "@/lib/types";

interface WishlistItem extends Product {
  wishlistItemId: string;
}

export function useSupabaseWishlist() {
  const { user } = useSupabaseAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    try {
      const data = await getWishlist(user.id);
      setWishlist(data);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
    
    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      loadWishlist();
    };
    
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    
    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addToWishlist = async (productId: string) => {
    if (!user) {
      throw new Error("Must be logged in to add to wishlist");
    }

    const added = await addToWishlistDB(user.id, productId);
    if (added) {
      await loadWishlist();
      window.dispatchEvent(new Event("wishlistUpdated"));
    }
    return added;
  };

  const removeItem = async (wishlistItemId: string) => {
    await removeFromWishlist(wishlistItemId);
    await loadWishlist();
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const isInWishlist = async (productId: string): Promise<boolean> => {
    if (!user) return false;
    return checkIsInWishlist(user.id, productId);
  };

  return {
    wishlist,
    loading,
    wishlistCount: wishlist.length,
    addToWishlist,
    removeItem,
    isInWishlist,
    refreshWishlist: loadWishlist
  };
}
