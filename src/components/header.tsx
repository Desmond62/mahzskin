"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Search, Menu, X, ChevronDown } from "lucide-react";
import { CurrencySelector } from "./currency-selector";
import { useEffect, useState } from "react";
import { getCart, getWishlist } from "@/lib/storage";
import { UserMenu } from "./user-menu";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/range", label: "RANGE" },
  { href: "/needs", label: "NEEDS" },
  { href: "/care", label: "CARE" },
  { href: "/sale", label: "SALE" },
  { 
    href: "#", 
    label: "ABOUT US",
    dropdown: [
      { href: "/about/about-us", label: "About" },
      { href: "/about/contact-us", label: "Contact Us" }
    ]
  },
  { href: "/support", label: "SUPPORT" },
  { href: "/blog", label: "BLOG" },
];

export function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Lock scroll when search bar is open
  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [searchOpen]);

  useEffect(() => {
    const updateCounts = () => {
      const cart = getCart();
      const wishlist = getWishlist();
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
      setWishlistCount(wishlist.length);
    };

    updateCounts();

    window.addEventListener("cartUpdated", updateCounts);
    window.addEventListener("wishlistUpdated", updateCounts);

    return () => {
      window.removeEventListener("cartUpdated", updateCounts);
      window.removeEventListener("wishlistUpdated", updateCounts);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        setIsScrolled(true);
        if (currentScrollY > lastScrollY) {
          // Scrolling down
          setIsVisible(false);
        } else {
          // Scrolling up
          setIsVisible(true);
        }
      } else {
        setIsScrolled(false);
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  return (
    <>
      {/* Top banner - hide completely when scrolled */}
      <div className={`fixed top-0 left-0 right-0 z-60 bg-[#FFF8E7] text-center py-2 px-4 transition-all duration-300 ${
        isScrolled ? 'hidden' : 'block'
      }`}>
        <p className="text-xs sm:text-sm text-foreground">
          5% discount for first orders above ₦500,000{" "}
          <Link
            href="/products"
            className="underline font-medium hover:text-primary"
          >
            Shop Now
          </Link>
        </p>
      </div>

      {/* Main header */}
      <header
        className={`fixed left-0 right-0 z-50 bg-background transition-all duration-300 ${
          isScrolled ? "shadow-md top-0" : "top-[40px] md:top-[40px]"
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="container mx-auto px-3 sm:px-4">
          {/* Scrolled simplified header - shown when scrolled */}
          {isScrolled && (
            <div className="flex items-center justify-between py-2 sm:py-3 gap-2 sm:gap-4">
              {/* Left: Logo */}
              <Link href="/" className="shrink-0">
                <Image 
                  src="/logo-removebg-preview.png" 
                  alt="Mahz Logo" 
                  width={80}
                  height={80}
                  className="object-cover h-14 sm:h-16 w-auto" 
                />
              </Link>

              {/* Center: Navigation - Desktop only */}
              <nav className="hidden lg:block flex-1">
                <ul className="flex items-center justify-center gap-4 xl:gap-6">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href} className="relative">
                      {link.dropdown ? (
                        <div
                          className="relative"
                          onMouseEnter={() => setAboutDropdownOpen(true)}
                          onMouseLeave={() => setAboutDropdownOpen(false)}
                        >
                          <button className="nav-link-underline text-xs font-medium tracking-wide hover:text-primary transition-colors">
                            {link.label}
                          </button>
                          
                          {aboutDropdownOpen && (
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-2 z-50">
                              <div className="w-48 bg-background border border-border rounded-lg shadow-lg overflow-hidden">
                                {link.dropdown.map((dropdownItem) => (
                                  <Link
                                    key={dropdownItem.href}
                                    href={dropdownItem.href}
                                    className="block px-4 py-3 text-sm hover:bg-accent transition-colors border-b border-border last:border-b-0"
                                  >
                                    {dropdownItem.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={link.href}
                          className="nav-link-underline text-xs font-medium tracking-wide hover:text-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Right: Search, Wishlist, Cart, Menu (mobile) */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="hover:text-primary transition-colors p-1"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5 sm:h-5 sm:w-5" />
                </button>

                <Link
                  href="/wishlist"
                  className="relative hover:text-primary transition-colors p-1"
                  aria-label="Wishlist"
                >
                  <Heart className="h-5 w-5 sm:h-5 sm:w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium text-[9px] sm:text-[10px]">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <button
                  onClick={() => {
                    window.dispatchEvent(new Event("toggleCart"));
                  }}
                  className="relative hover:text-primary transition-colors p-1"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart className="h-5 w-5 sm:h-5 sm:w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium text-[9px] sm:text-[10px]">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden hover:text-primary transition-colors p-1"
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5 sm:h-5 sm:w-5" />
                  ) : (
                    <Menu className="h-5 w-5 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Full header - shown when not scrolled */}
          {!isScrolled && (
            <>
              {/* Mobile header */}
              <div className="md:hidden flex items-center justify-between py-3 gap-2">
                {/* Left: Currency Selector */}
                <div className="shrink-0 w-16">
                  <CurrencySelector />
                </div>

                {/* Center: Logo */}
                <Link href="/" className="shrink-0">
                  <div className="text-center">
                    <Image src="/logo-removebg-preview.png" 
                    alt="F&W Logo" 
                    width={120}
                    height={120}
                    className="object-cover h-24 w-auto" />
                  </div>
                </Link>

                {/* Right: Icons */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setSearchOpen(!searchOpen)}
                    className="hover:text-primary transition-colors p-1"
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5 sm:h-5 sm:w-5" />
                  </button>

                  <Link
                    href="/wishlist"
                    className="relative hover:text-primary transition-colors p-1"
                    aria-label="Wishlist"
                  >
                    <Heart className="h-5 w-5 sm:h-5 sm:w-5" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium text-[10px]">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  <button
                    onClick={() => {
                      window.dispatchEvent(new Event("toggleCart"));
                    }}
                    className="relative hover:text-primary transition-colors p-1"
                    aria-label="Shopping cart"
                  >
                    <ShoppingCart className="h-5 w-5 sm:h-5 sm:w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium text-[10px]">
                        {cartCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="hover:text-primary transition-colors p-1"
                    aria-label="Menu"
                  >
                    {mobileMenuOpen ? (
                      <X className="h-5 w-5 sm:h-5 sm:w-5" />
                    ) : (
                      <Menu className="h-5 w-5 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Desktop header */}
              <div className="hidden md:flex items-center justify-between py-4 gap-4">
                {/* Left: Currency Selector */}
                <div className="shrink-0 w-[120px]">
                  <CurrencySelector />
                </div>

                {/* Center: Logo */}
                <Link href="/" className="shrink-0">
                  <div className="text-center">
                    <Image src="/logo-removebg-preview.png" 
                    alt="F&W Logo" 
                    width={120}
                    height={120}
                    className="object-cover h-24 w-auto" />
                  </div>
                </Link>

                {/* Right: Search, User, Wishlist, Cart */}
                <div className="flex items-center gap-4 w-[120px] justify-end">
                  <button
                    onClick={() => setSearchOpen(!searchOpen)}
                    className="hover:text-primary transition-colors"
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5" />
                  </button>

                  <UserMenu />

                  <Link
                    href="/wishlist"
                    className="relative hover:text-primary transition-colors"
                    aria-label="Wishlist"
                  >
                    <Heart className="h-5 w-5" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  <button
                    onClick={() => {
                      window.dispatchEvent(new Event("toggleCart"));
                    }}
                    className="relative hover:text-primary transition-colors"
                    aria-label="Shopping cart"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Search bar - expandable with overlay */}

          {/* Navigation - Desktop - only show when not scrolled */}
          {!isScrolled && (
            <nav className="hidden md:block border-t border-border">
              <ul className="flex items-center justify-center gap-4 lg:gap-8 py-4">
                {NAV_LINKS.map((link) => (
                  <li key={link.href} className="relative">
                    {link.dropdown ? (
                      // Dropdown menu item
                      <div
                        className="relative"
                        onMouseEnter={() => setAboutDropdownOpen(true)}
                        onMouseLeave={() => setAboutDropdownOpen(false)}
                      >
                        <button className="nav-link-underline text-xs lg:text-sm font-medium tracking-wide hover:text-primary transition-colors flex items-center gap-1">
                          {link.label}
                          {/* <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`} /> */}
                        </button>
                        
                        {/* Dropdown Menu */}
                        {aboutDropdownOpen && (
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-2 z-50">
                            <div className="w-48 bg-background border border-border rounded-lg shadow-lg overflow-hidden animate__animated animate__fadeInDown animate_faster">
                              {link.dropdown.map((dropdownItem) => (
                                <Link
                                  key={dropdownItem.href}
                                  href={dropdownItem.href}
                                  className="block px-4 py-3 text-sm hover:bg-accent transition-colors border-b border-border last:border-b-0"
                                >
                                  {dropdownItem.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Regular menu item
                      <Link
                        href={link.href}
                        className="nav-link-underline text-xs lg:text-sm font-medium tracking-wide hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden border-t border-border py-4 animate-in slide-in-from-top-2">
              <ul className="space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    {link.dropdown ? (
                      // Dropdown for mobile
                      <div>
                        <button
                          onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                          className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium hover:bg-accent rounded transition-colors"
                        >
                          {link.label}
                          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {aboutDropdownOpen && (
                          <div className="ml-4 mt-2 space-y-1">
                            {link.dropdown.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.href}
                                href={dropdownItem.href}
                                className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent rounded transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {dropdownItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Regular mobile menu item
                      <Link
                        href={link.href}
                        className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
                <li>
                  <UserMenu isMobile={true} onNavigate={() => setMobileMenuOpen(false)} />
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>

      {/* Spacer to prevent content jump */}
      <div
        className={`${
          isScrolled 
            ? "h-[80px]"  // Simplified header height when scrolled
            : "h-[180px] md:h-[200px]"  // Full header with banner
        }`}
      />

      {/* Search overlay - outside header for full screen coverage */}
      {searchOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={() => setSearchOpen(false)}
          />
          
          {/* Search bar */}
          <div className="fixed top-24 left-0 right-0 z-[70] px-4">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-white shadow-2xl"
              />
            </form>
          </div>
        </>
      )}
    </>
  );
}
