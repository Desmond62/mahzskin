"use client";

import { useEffect, useState, useCallback } from "react";
import { getWishlist, addToWishlist as addToWishlistDB, removeFromWishlist, isInWishlist as checkIsInWishlist } from "@/lib/supabase/database";
import { useSupabaseAuth } from "./use-supabase-auth";
import type { Product } from "@/lib/types";

interface WishlistItem extends Product {
  wishlistItemId: string;
}

// Guest wishlist in localStorage
const GUEST_WISHLIST_KEY = "mahzskin_guest_wishlist";

interface GuestWishlistItem {
  productId: string;
  wishlistItemId: string;
}

function getGuestWishlist(): GuestWishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuestWishlist(items: GuestWishlistItem[]): void {
  localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
}

function clearGuestWishlist(): void {
  localStorage.removeItem(GUEST_WISHLIST_KEY);
}

export function useSupabaseWishlist() {
  const { user } = useSupabaseAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = useCallback(async () => {
    // Guest: load from localStorage (product details are minimal — just IDs)
    if (!user) {
      const guestItems = getGuestWishlist();
      // Build minimal WishlistItem shapes so the UI can check membership by id
      const items = guestItems.map((g) => ({
        id: g.productId,
        wishlistItemId: g.wishlistItemId,
      })) as WishlistItem[];
      setWishlist(items);
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
  }, [user]);

  // When a user logs in, merge guest wishlist into Supabase then clear it
  useEffect(() => {
    if (!user) return;

    const guestItems = getGuestWishlist();
    if (guestItems.length === 0) return;

    const mergeGuestWishlist = async () => {
      try {
        for (const item of guestItems) {
          await addToWishlistDB(user.id, item.productId);
        }
        clearGuestWishlist();
        await loadWishlist();
        window.dispatchEvent(new Event("wishlistUpdated"));
      } catch (error) {
        console.error("Error merging guest wishlist:", error);
      }
    };

    mergeGuestWishlist();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    loadWishlist();

    const handleWishlistUpdate = () => loadWishlist();
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  }, [loadWishlist]);

  const addToWishlist = async (productId: string) => {
    // Logged-in user: save to Supabase
    if (user) {
      const added = await addToWishlistDB(user.id, productId);
      if (added) {
        await loadWishlist();
        window.dispatchEvent(new Event("wishlistUpdated"));
      }
      return added;
    }

    // Guest: save to localStorage
    const guestItems = getGuestWishlist();
    const alreadyIn = guestItems.some((g) => g.productId === productId);
    if (alreadyIn) return false;

    guestItems.push({ productId, wishlistItemId: `guest-wl-${productId}` });
    saveGuestWishlist(guestItems);
    await loadWishlist();
    window.dispatchEvent(new Event("wishlistUpdated"));
    return true;
  };

  const removeItem = async (wishlistItemId: string) => {
    if (user) {
      await removeFromWishlist(wishlistItemId);
      await loadWishlist();
      window.dispatchEvent(new Event("wishlistUpdated"));
      return;
    }

    // Guest
    const guestItems = getGuestWishlist().filter((g) => g.wishlistItemId !== wishlistItemId);
    saveGuestWishlist(guestItems);
    await loadWishlist();
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const isInWishlist = async (productId: string): Promise<boolean> => {
    if (!user) {
      return getGuestWishlist().some((g) => g.productId === productId);
    }
    return checkIsInWishlist(user.id, productId);
  };

  return {
    wishlist,
    loading,
    wishlistCount: wishlist.length,
    addToWishlist,
    removeItem,
    isInWishlist,
    refreshWishlist: loadWishlist,
  };
}
