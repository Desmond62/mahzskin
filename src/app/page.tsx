"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import {
  FadeInUp,
  FadeInLeft,
  FadeInRight,
} from "@/components/scroll-animation";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import WhatsAppWidget from "@/components/whatsApp-widget";

export default function HomePage() {
  const { products, loading } = useProducts();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const featuredProducts = products.slice(0, 4);
  const newArrivals = products.slice(4, 8);
  const bestSellers = products.slice(0, 4);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setSubmitMessage("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Simulate API call - replace with your actual newsletter signup logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store email in localStorage for now (replace with actual API call)
      const existingEmails = JSON.parse(localStorage.getItem("newsletter_emails") || "[]");
      if (!existingEmails.includes(email)) {
        existingEmails.push(email);
        localStorage.setItem("newsletter_emails", JSON.stringify(existingEmails));
      }
      
      setSubmitMessage("🎉 Welcome to the Glow Squad! Check your email for your 10% discount.");
      setEmail("");
    } catch (error) {
      console.error("Newsletter signup error:", error);
      setSubmitMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8E7DD]">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-pink-50 via-white to-amber-50 py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image first on mobile, text first on desktop */}
            <FadeInRight className="relative lg:order-2">
              <div className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer h-full">
                <Image
                  src="/girlie-cream.jpeg"
                  alt="Mahzskin Products"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  width={600}
                  height={600}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Premium Quality</p>
                    <p className="text-sm text-muted-foreground">
                      Trusted by thousands
                    </p>
                  </div>
                </div>
              </div>
            </FadeInRight>
            <FadeInLeft className="space-y-6 lg:order-1">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium">
                Premium Skincare Collection
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight">
                MAHZ SKIN _ FOR OUR SKIN 
                {/* <br />
                <span className="text-primary">Ranges</span> */}
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
               Purely thoughtful formulations. Designed for long-term skin health,
created to enhance your skin’s natural richness.
              </p>
              <div className="flex gap-4">
                <Button size="lg" asChild>
                  <Link href="/shop">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about/about-us">Learn More</Link>
                </Button>
              </div>
            </FadeInLeft>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <FadeInUp className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              FEATURED ON MAHZ-SKIN
            </h2>
            <p className="text-muted-foreground">
              Discover our most popular product categories
            </p>
          </FadeInUp>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeInUp delay={100}>
              <div className="group relative aspect-4/5 rounded-2xl overflow-hidden bg-linear-to-br from-pink-100 to-pink-50 cursor-pointer">
                <Image
                  src="/shelf-image.jpeg"
                  alt="Range"
                  width={400}
                  height={500}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Range</h3>
                  <p className="text-sm opacity-90">
                    Elevate your skincare routine with our luxurious collection
                    of premium products designed for radiant, healthy skin.
                  </p>
                  <Button variant="secondary" size="sm" className="mt-4" asChild>
                    <Link href="/shop">Shop Now</Link>
                  </Button>
                </div>
              </div>
            </FadeInUp>

            <FadeInUp delay={200}>
              <div className="group relative aspect-4/5 rounded-2xl overflow-hidden bg-linear-to-br from-blue-100 to-blue-50 cursor-pointer">
                <Image
                  src="/baby-face.jpeg"
                  alt="Care"
                  width={400}
                  height={500}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Care</h3>
                  <p className="text-sm opacity-90">
                    Your skin deserves attention! Our care products are
                    formulated to nourish, hydrate, and protect your skin.
                  </p>
                  <Button variant="secondary" size="sm" className="mt-4" asChild>
                    <Link href="/shop">Shop Now</Link>
                  </Button>
                </div>
              </div>
            </FadeInUp>

            <FadeInUp delay={300}>
              <div className="group relative aspect-4/5 rounded-2xl overflow-hidden bg-linear-to-br from-amber-100 to-amber-50 cursor-pointer">
                <Image
                  src="/care-cream.jpeg"
                  alt="Needs"
                  width={400}
                  height={500}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Needs</h3>
                  <p className="text-sm opacity-90">
                    How should you be caring for your skin? We&apos;ve got the
                    answers. From serums to creams, find what you need.
                  </p>
                  <Button variant="secondary" size="sm" className="mt-4" asChild>
                    <Link href="/shop">Shop Now</Link>
                  </Button>
                </div>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 px-4 bg-accent/30">
        <div className="container mx-auto">
          <FadeInUp className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">NEW ARRIVALS</h2>
            <Button variant="outline" asChild>
              <Link href="/shop">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </FadeInUp>

          <FadeInUp
            delay={100}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {loading ? (
              <ProductGridSkeleton count={4} />
            ) : (
              newArrivals.map((product, index) => (
                <div
                  key={product.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </FadeInUp>
        </div>
      </section>

      {/* Skincare for Queens */}
      <section className="relative py-20 px-4 bg-[#E6C6B4] overflow-hidden">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image first on mobile, text first on desktop */}
            <FadeInRight className="relative h-full lg:order-2">
              <div className="relative aspect-4/4 rounded-2xl overflow-hidden group cursor-pointer h-full shadow-2xl">
                <Image
                  src="/cream-girl.jpeg"
                  alt="Skincare for Queens"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover object-[center_25%] group-hover:scale-105 transition-transform duration-500 brightness-105 contrast-110"
                  priority
                />
              </div>
            </FadeInRight>
            <FadeInLeft className="space-y-6 text-white lg:order-1">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                SKINCARE FOR
                <br />
                QUEENS
              </h2>
              <p className="text-lg opacity-90 max-w-md">
                Luxurious care enriched with powerful actives to nourish,
                smooth, and reveal youthful, radiant skin in a complete 3-step
                ritual.
              </p>
              <Button size="lg" variant="secondary" className="">
                Learn More
              </Button>
            </FadeInLeft>
          </div>
        </div>
      </section>

      {/* Malhz-skin Picks */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <FadeInUp className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">MAHZ-SKIN Picks</h2>
            <p className="text-muted-foreground">
              Discover the skincare favourites for glowing skin that get
              noticed. From body-boosting cream to the ultimate brightening
              serum, these are the MAHZ-SKIN products everyone&apos;s talking
              about.
            </p>
          </FadeInUp>

          <FadeInUp
            delay={100}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {loading ? (
              <ProductGridSkeleton count={4} />
            ) : (
              featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </FadeInUp>

          <FadeInUp delay={200} className="text-center">
            <Button size="lg" asChild>
              <Link href="/shop">
                SHOW MORE
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </FadeInUp>
        </div>
      </section>

      {/* So Lemon Section */}
      <section className="relative py-20 px-4 bg-[#E6C6B4] overflow-hidden">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image first on mobile, text first on desktop */}
            <FadeInRight className="relative h-full lg:order-2">
              <div className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer h-full">
                <Image
                  src="/sparkling-bottle-cream.jpeg"
                  alt=" bottle cream "
                  width={600}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </FadeInRight>
            <FadeInLeft className="space-y-6 lg:order-1">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                ADVANCED GLOW BODY WASH
              </h2>
              <p className="text-lg text-muted-foreground max-w-md">
               The Advanced Glow Body Wash is a gentle, brightening cleanser that refreshes, smooths, and enhances radiance without drying the skin. With mild exfoliation, balanced pH, and hydrating ingredients, it supports an even tone while delivering a soft, spa-like cleansing experience. 
              </p>
              <Button size="lg" asChild>
                <Link href="/shop">Shop Now</Link>
              </Button>
            </FadeInLeft>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 px-4 bg-accent/30">
        <div className="container mx-auto">
          <FadeInUp className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">BEST SELLERS</h2>
            <p className="text-muted-foreground">
              Our most loved products by customers worldwide
            </p>
          </FadeInUp>

          <FadeInUp
            delay={100}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {loading ? (
              <ProductGridSkeleton count={4} />
            ) : (
              bestSellers.map((product, index) => (
                <div
                  key={product.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </FadeInUp>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <FadeInUp className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">WHY US?</h2>
          </FadeInUp>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeInUp delay={100} className="text-center space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Expert Approved</h3>
              <p className="text-muted-foreground">
                All our products are dermatologically tested and approved by
                skincare experts worldwide.
              </p>
            </FadeInUp>

            <FadeInUp className="text-center space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Easy Shopping</h3>
              <p className="text-muted-foreground">
                Quick and easy checkout with multiple payment options and fast,
                reliable delivery.
              </p>
            </FadeInUp>

            <FadeInUp delay={200} className="text-center space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Secure Payments</h3>
              <p className="text-muted-foreground">
                Shop with confidence knowing your transactions are protected and
                encrypted.
              </p>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <FadeInUp className="container mx-auto max-w-2xl text-center space-y-6">
          <h2 className="text-3xl font-bold">JOIN THE GLOW SQUAD!</h2>
          <p className="text-lg opacity-90">
            Get insider deals, skincare tips, and first dibs on new arrivals.
            Plus, enjoy 10% off your first order!
          </p>
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full px-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-gray-400 px-4 py-3 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-w-0"
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              size="lg" 
              variant="secondary"
              className="cursor-pointer whitespace-nowrap sm:text-base text-sm sm:px-6 px-4 sm:py-3 py-2"
              disabled={isSubmitting || !email.trim()}
            >
              {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
            </Button>
          </form>
          {submitMessage && (
            <p className={`text-sm ${submitMessage.includes("🎉") ? "text-green-200" : "text-red-200"}`}>
              {submitMessage}
            </p>
          )}
          <p className="text-sm opacity-75">100% Fun. Zero spam.</p>
        </FadeInUp>
      </section>
      <WhatsAppWidget/>
    </div>
  );
}
