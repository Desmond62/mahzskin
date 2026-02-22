"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/hooks/use-products";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { OfflineMessage } from "@/components/offline-message";

import { Grid, LayoutGrid, LayoutList, X } from "lucide-react";
import { Button } from "@/components/ui";
import Image from "next/image";

type ViewMode = "one" | "two" | "three";
type SortOption =
  | "alphabetical-asc"
  | "alphabetical-desc"
  | "price-asc"
  | "price-desc"
  | "featured"
  | "best-selling"
  | "date-asc"
  | "date-desc";

function ProductsContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { products, loading, error, retry } = useProducts();

  const [viewMode, setViewMode] = useState<ViewMode>("three");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [showInStock, setShowInStock] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Lock scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  // Get unique categories
  const categories = Array.from(new Set(products.map((p) => p.category)));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode("one");
      } else if (window.innerWidth < 1024) {
        setViewMode("two");
      } else {
        setViewMode("three");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Stock filter
    if (showInStock && !showOutOfStock) {
      filtered = filtered.filter((p) => p.inStock);
    } else if (showOutOfStock && !showInStock) {
      filtered = filtered.filter((p) => !p.inStock);
    }

    // Sort
    switch (sortBy) {
      case "alphabetical-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "alphabetical-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "date-asc":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "date-desc":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "best-selling":
        filtered.sort((a, b) => (b.sales || 0) - (a.sales || 0));
        break;
      case "featured":
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return filtered;
  }, [
    products,
    searchQuery,
    selectedCategories,
    priceRange,
    showInStock,
    showOutOfStock,
    sortBy,
  ]);

  // Calculate current page ensuring it's valid for the filtered results
  const validCurrentPage = useMemo(() => {
    const maxPage = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
    return currentPage > maxPage ? 1 : currentPage;
  }, [currentPage, filteredProducts.length, itemsPerPage]);

  // Paginate
  const displayedProducts = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, validCurrentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="min-h-screen bg-[#F8E7DD]">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar Filters - Mobile Drawer */}
        <div
          className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        <aside
          className={`fixed left-0 top-0 bottom-0 w-64 bg-background z-999999 overflow-y-auto transition-transform lg:relative lg:w-auto lg:translate-x-0 lg:bg-transparent lg:z-auto ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 lg:p-0 space-y-6">
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-2 hover:bg-accent rounded"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Categories */}
            <div className="mt-8 lg:mt-0">
              <h3 className="font-semibold mb-3 text-sm lg:text-lg">
                CATEGORIES
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="rounded border-border"
                    />
                    <span className="text-xs lg:text-sm">{category}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      ({products.filter((p) => p.category === category).length})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="font-semibold mb-3 text-sm lg:text-lg">
                AVAILABILITY
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInStock}
                    onChange={(e) => {
                      setShowInStock(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="rounded border-border"
                  />
                  <span className="text-xs lg:text-sm">In Stock</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    ({products.filter((p) => p.inStock).length})
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOutOfStock}
                    onChange={(e) => {
                      setShowOutOfStock(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="rounded border-border"
                  />
                  <span className="text-xs lg:text-sm">Out of Stock</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    ({products.filter((p) => !p.inStock).length})
                  </span>
                </label>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold mb-3 text-sm lg:text-lg">PRICE</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => {
                      setPriceRange([Number(e.target.value), priceRange[1]]);
                      setCurrentPage(1);
                    }}
                    className="w-16 lg:w-20 px-2 py-1 border border-border rounded text-xs lg:text-sm"
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => {
                      setPriceRange([priceRange[0], Number(e.target.value)]);
                      setCurrentPage(1);
                    }}
                    className="w-16 lg:w-20 px-2 py-1 border border-border rounded text-xs lg:text-sm"
                    placeholder="Max"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => {
                    setPriceRange([priceRange[0], Number(e.target.value)]);
                    setCurrentPage(1);
                  }}
                  className="w-full"
                />
                <Button
                  onClick={() => {
                    setPriceRange([0, 50000]);
                    setCurrentPage(1);
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Featured Products */}
            <div>
              <h3 className="font-semibold mb-3 text-sm lg:text-lg">
                FEATURED PRODUCTS
              </h3>
              <div className="space-y-4">
                {products
                  .filter((p) => p.featured)
                  .slice(0, 3)
                  .map((product) => (
                    <div key={product.id} className="flex gap-3">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-xs lg:text-sm font-medium line-clamp-2">
                          {product.name}
                        </p>
                        <p className="text-xs lg:text-sm font-semibold">
                          ₦{product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 w-full">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto flex-wrap">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden px-3 py-2 border border-border rounded text-xs font-medium hover:bg-accent transition-colors"
              >
                Filters
              </button>

              {/* View Mode */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                  VIEW AS
                </span>
                <div className="flex gap-1 border border-border rounded p-1">
                  <button
                    onClick={() => setViewMode("one")}
                    className={`p-1 rounded ${
                      viewMode === "one"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                    aria-label="Single column view"
                  >
                    <LayoutList className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("two")}
                    className={`p-1 rounded ${
                      viewMode === "two"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                    aria-label="Two column view"
                  >
                    <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("three")}
                    className={`p-1 rounded ${
                      viewMode === "three"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                    aria-label="Three column view"
                  >
                    <LayoutGrid className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>

              {/* Items Per Page */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                  ITEMS
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-2 sm:px-3 py-1.5 border border-border rounded text-xs sm:text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                SORT
              </span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  setCurrentPage(1);
                }}
                className="px-2 sm:px-3 py-1.5 border border-border rounded text-xs sm:text-sm flex-1 sm:flex-none sm:min-w-[150px] lg:min-w-[200px]"
              >
                <option value="featured">Featured</option>
                <option value="best-selling">Best Selling</option>
                <option value="alphabetical-asc">A-Z</option>
                <option value="alphabetical-desc">Z-A</option>
                <option value="price-asc">Low to High</option>
                <option value="price-desc">High to Low</option>
                <option value="date-desc">New to Old</option>
                <option value="date-asc">Old to New</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {error ? (
            <div className="col-span-full">
              <OfflineMessage 
                onRetry={retry}
                message="We couldn't load the products"
              />
            </div>
          ) : (
            <div
              className={`grid gap-3 sm:gap-4 lg:gap-6 mb-8 ${
                viewMode === "one"
                  ? "grid-cols-1"
                  : viewMode === "two"
                  ? "grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {displayedProducts.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No products found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Total products: {products.length}, Filtered: {filteredProducts.length}
                  </p>
                </div>
              ) : (
                displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          )}

          {/* Pagination Info */}
          <div className="text-center mb-4 text-xs sm:text-sm text-muted-foreground">
            Showing {(validCurrentPage - 1) * itemsPerPage + 1}-
            {Math.min(validCurrentPage * itemsPerPage, filteredProducts.length)}{" "}
            of {filteredProducts.length} total
          </div>

          {/* Load More / Pagination */}
          {validCurrentPage < totalPages && (
            <div className="text-center">
              <Button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                variant="outline"
                size="lg"
                className="min-w-[150px] sm:min-w-[200px] text-xs sm:text-base"
              >
                SHOW MORE
              </Button>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8E7DD]">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ProductGridSkeleton count={12} />
            </div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
