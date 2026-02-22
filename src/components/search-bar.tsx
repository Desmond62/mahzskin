"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, convertPrice, getCurrency } from "@/lib/currency-rates";
import { useProductsStore } from "@/stores/products-store";
import { useUIStore } from "@/stores/ui-store";

export function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);

  // Get state from Zustand stores
  const { products: allProducts, loadProducts } = useProductsStore();
  const { 
    searchQuery, 
    searchResults, 
    showSearchResults,
    currency,
    isDesktop,
    setSearchQuery, 
    setSearchResults, 
    setShowSearchResults,
    setCurrency,
    setIsDesktop,
    clearSearch
  } = useUIStore();

  // Detect if desktop
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, [setIsDesktop]);

  // Auto-focus input when component mounts on desktop only
  useEffect(() => {
    if (isDesktop && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isDesktop]);

  // Load products once on mount if not already loaded
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Listen for currency changes
  useEffect(() => {
    const handleCurrencyChange = () => setCurrency(getCurrency());
    window.addEventListener("currencyChange", handleCurrencyChange);
    return () => window.removeEventListener("currencyChange", handleCurrencyChange);
  }, [setCurrency]);

  // Search products when query changes
  useEffect(() => {
    if (searchQuery.trim() && allProducts.length > 0) {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = allProducts.filter(
        (p) =>
          p.name?.toLowerCase().includes(lowerQuery) ||
          p.description?.toLowerCase().includes(lowerQuery) ||
          p.category?.toLowerCase().includes(lowerQuery)
      );
      console.log("🔍 Search query:", searchQuery, "| Results:", filtered.length);
      setSearchResults(filtered.slice(0, 8));
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery, allProducts, setSearchResults, setShowSearchResults]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-3 text-base border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-white shadow-2xl"
          autoComplete="off"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-primary transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {showSearchResults && searchQuery.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-2xl max-h-[500px] overflow-y-auto z-50">
          {searchResults.length > 0 ? (
            <>
              {searchResults.map((product) => {
                const price = convertPrice(product.price, "NGN", currency);
                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={clearSearch}
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
                p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length > 8 && (
                <Link
                  href={`/products?search=${encodeURIComponent(searchQuery)}`}
                  onClick={clearSearch}
                  className="block p-4 text-center text-sm sm:text-base text-primary hover:bg-accent transition-colors font-medium border-t-2 border-primary"
                >
                  View all results for &quot;{searchQuery}&quot;
                </Link>
              )}
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm sm:text-base text-muted-foreground mb-3">No products found for &quot;{searchQuery}&quot;</p>
              <Link
                href="/products"
                onClick={clearSearch}
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
