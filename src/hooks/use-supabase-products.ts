"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/supabase/database";
import type { Product } from "@/lib/types";

export function useSupabaseProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        // Simulate loading delay to show skeleton
        await new Promise(resolve => setTimeout(resolve, 800));
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return { products, loading, error };
}
