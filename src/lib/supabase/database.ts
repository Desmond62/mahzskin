"use client";

import { createClient } from "./client";
import type { Product } from "../types";

// ============================================
// PRODUCTS
// ============================================

export async function getProducts(): Promise<Product[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

// ============================================
// CART
// ============================================

export async function getCart(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      products (*)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching cart:', error);
    return [];
  }

  // Transform to match existing cart structure
  return data.map(item => ({
    ...item.products,
    quantity: item.quantity,
    cartItemId: item.id
  }));
}

export async function addToCart(userId: string, productId: string, quantity: number = 1) {
  const supabase = createClient();
  
  // Check if item already exists in cart
  const { data: existing } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existing) {
    // Update quantity
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id);

    if (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  } else {
    // Insert new item
    const { error } = await supabase
      .from('cart_items')
      .insert({ user_id: userId, product_id: productId, quantity });

    if (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const supabase = createClient();
  
  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId);

  if (error) {
    console.error('Error updating cart quantity:', error);
    throw error;
  }
}

export async function removeFromCart(cartItemId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);

  if (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

export async function clearCart(userId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}

// ============================================
// WISHLIST
// ============================================

export async function getWishlist(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('wishlist')
    .select(`
      *,
      products (*)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }

  // Transform to match existing wishlist structure
  return data.map(item => ({
    ...item.products,
    wishlistItemId: item.id
  }));
}

export async function addToWishlist(userId: string, productId: string) {
  const supabase = createClient();
  
  // Check if already in wishlist
  const { data: existing } = await supabase
    .from('wishlist')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existing) {
    return false; // Already in wishlist
  }

  const { error } = await supabase
    .from('wishlist')
    .insert({ user_id: userId, product_id: productId });

  if (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }

  return true;
}

export async function removeFromWishlist(wishlistItemId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('id', wishlistItemId);

  if (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
}

export async function isInWishlist(userId: string, productId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data } = await supabase
    .from('wishlist')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  return !!data;
}
