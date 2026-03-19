"use client";

import { createClient } from "./client";
import type { Product } from "../types";

// ============================================
// PRODUCTS
// ============================================

// Map raw Supabase product row to the Product type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    price: row.price,
    currency: 'NGN',
    image: row.image_url || row.image || '',
    // Use joined category name if available, fallback to category_id or category
    category: row.categories?.name || row.category || '',
    inStock: row.stock == null ? true : row.stock > 0,
    featured: row.is_featured ?? row.featured ?? false,
    sales: row.sales ?? 0,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

export async function getProducts(): Promise<Product[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return (data || []).map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data ? mapProduct(data) : null;
}

// ============================================
// CART
// ============================================

export async function getCart(userId: string) {
  if (!userId) {
    return [];
  }
  
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (*, categories(name))
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching cart:', error);
      return [];
    }

    // Transform to match existing cart structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data || []).map((item: any) => ({
      ...mapProduct(item.products),
      quantity: item.quantity,
      cartItemId: item.id
    }));
  } catch (err) {
    console.error('Unexpected error fetching cart:', err);
    return [];
  }
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
  if (!userId) {
    console.warn('Cannot clear cart: No user ID provided');
    return;
  }
  
  const supabase = createClient();
  
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error clearing cart:', error);
    // Don't throw error, just log it to prevent app crashes
    return;
  }
}

// ============================================
// WISHLIST
// ============================================

export async function getWishlist(userId: string) {
  if (!userId) {
    return [];
  }
  
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        products (*, categories(name))
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }

    // Transform to match existing wishlist structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data || []).map((item: any) => ({
      ...mapProduct(item.products),
      wishlistItemId: item.id
    }));
  } catch (err) {
    console.error('Unexpected error fetching wishlist:', err);
    return [];
  }
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
