"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import type { Product } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/supabase/database";
import { formatPrice, convertPrice, getCurrency } from "@/lib/currency-rates";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [currency, setCurrency] = useState(getCurrency());
  const [isDesktop, setIsDesktop] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect if desktop
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Auto-focus input when component mounts on desktop only
  useEffect(() => {
    if (isDesktop && inputRef.current) {
      // Small delay to ensure the overlay animation completes
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isDesktop]);

  // Load all products once on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getProducts();
        setAllProducts(products);
        console.log("✅ Loaded products:", products.length);
      } catch (error) {
        console.error("❌ Error loading products:", error);
      }
    };
    loadProducts();
  }, []);

  // Listen for currency changes
  useEffect(() => {
    const handleCurrencyChange = () => setCurrency(getCurrency());
    window.addEventListener("currencyChange", handleCurrencyChange);
    return () => window.removeEventListener("currencyChange", handleCurrencyChange);
  }, []);

  useEffect(() => {
    const searchProducts = () => {
      if (query.trim() && allProducts.length > 0) {
        const lowerQuery = query.toLowerCase();
        const filtered = allProducts.filter(
          (p) =>
            p.name?.toLowerCase().includes(lowerQuery) ||
            p.description?.toLowerCase().includes(lowerQuery) ||
            p.category?.toLowerCase().includes(lowerQuery)
        );
        console.log("🔍 Search query:", query, "| Results:", filtered.length);
        setResults(filtered.slice(0, 8));
        setShowResults(true);
      } else {
        setResults([]);
        setShowResults(false);
      }
    };

    searchProducts();
  }, [query, allProducts]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-3 text-base border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-white shadow-2xl"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setShowResults(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-primary transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {showResults && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-2xl max-h-[500px] overflow-y-auto z-50">
          {results.length > 0 ? (
            <>
              {results.map((product) => {
                const price = convertPrice(product.price, "NGN", currency);
                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={() => {
                      setQuery("");
                      setResults([]);
                      setShowResults(false);
                    }}
                    className="flex items-center gap-4 p-4 hover:bg-accent transition-colors border-b border-border last:border-b-0"
                  >
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-medium line-clamp-1">{product.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {product.category}
                      </p>
                    </div>
                    <p className="text-sm sm:text-base font-semibold">{formatPrice(price, currency)}</p>
                  </Link>
                );
              })}
              {allProducts.filter(p => 
                p.name?.toLowerCase().includes(query.toLowerCase()) ||
                p.description?.toLowerCase().includes(query.toLowerCase()) ||
                p.category?.toLowerCase().includes(query.toLowerCase())
              ).length > 8 && (
                <Link
                  href={`/products?search=${encodeURIComponent(query)}`}
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                    setShowResults(false);
                  }}
                  className="block p-4 text-center text-sm sm:text-base text-primary hover:bg-accent transition-colors font-medium border-t-2 border-primary"
                >
                  View all results for &quot;{query}&quot;
                </Link>
              )}
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm sm:text-base text-muted-foreground mb-3">No products found for &quot;{query}&quot;</p>
              <Link
                href="/products"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setShowResults(false);
                }}
                className="text-sm sm:text-base text-primary hover:underline inline-block"
              >
                Browse all products
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
