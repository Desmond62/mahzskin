"use client";

import { ScrollAnimation } from "@/components/scroll-animation";
import Link from "next/link";
import Image from "next/image";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#F8E7DD]">
      {/* Hero Section - About Us */}
      <ScrollAnimation>
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-5xl font-bold mb-8 font-playfair">
                ABOUT US
              </h1>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Image */}
                <div className="order-2 lg:order-1">
                  <div className="relative aspect-4/5 rounded-lg overflow-hidden group cursor-pointer">
                    <Image
                      src="/care.webp"
                      alt="Beautiful woman with glowing skin"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
                
                {/* Right: Content */}
                <div className="order-1 lg:order-2 text-center lg:text-left">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-playfair">
                    ABOUT MAHZ SKIN
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                                    In Persian, “محض” (MAHZ) means purely — a word used to express purity, intention, and absoluteness.
That meaning defines everything we create.
MAHZ SKIN exists without compromise.
We believe skincare should enhance your skin’s natural richness, never strip it away or force it to change.
Your skin does not need aggression to improve — it needs balance, respect, and intelligent care.
Born from science and rooted in inclusivity, MAHZ SKIN is dedicated to creating results-driven, skin-respectful formulations that work in harmony with every complexion — with special attention to melanin-rich skin.
We blend clinically proven actives with pure botanicals, ensuring every formula is effective, gentle, and thoughtfully designed for all skin types.
No unnecessary harshness.
No empty promises.
Just skincare that works — purely.
                  </p>
                  <button className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors">
                    EXPLORE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Our Story Section */}
      <ScrollAnimation>
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Content */}
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-playfair">
                    OUR PHILOSOPHY
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                               Skincare, Reimagined
At MAHZ SKIN, we don’t chase trends.
We study skin.
Our approach is guided by science, skin biology, and real-world results. Every ingredient serves a purpose. Every formula respects the skin barrier.
We believe: <br />
●Healthy skin comes before “perfect” skin <br />

●Gentle formulas can still deliver powerful results <br />

●Melanin-rich skin deserves specialized, informed care

Skincare should feel intelligent, intentional, and honest
                  </p>
                  <button className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors">
                    EXPLORE
                  </button>
                </div>
                
                {/* Right: Image */}
                <div>
                  <div className="relative aspect-4/5 rounded-lg overflow-hidden group cursor-pointer">
                    <Image
                      src="/face-serrum.avif"
                      alt="malzskin face serrum Product"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Our Approach Section */}
      <ScrollAnimation>
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Image */}
                <div className="order-2 lg:order-1">
                  <div className="relative aspect-4/5 rounded-lg overflow-hidden group cursor-pointer">
                    <Image
                      src="/dripping-cream.jpeg"
                      alt="malzskin Aore Product"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>
                
                {/* Right: Content */}
                <div className="order-1 lg:order-2 text-center lg:text-left">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-playfair">
                    OUR PILLARS 
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                                      Our Pillars <br />
1. Results-Driven
Visible improvements you can trust — backed by proven actives and thoughtful formulation. <br />
2. Skin-Respectful
Barrier-friendly, non-stripping care designed to support long-term skin health. <br />
3. Inclusive Beauty
Formulated in the USA for MAHZ SKIN Ltd, MAHZ SKIN celebrates every shade and every story — creating space where melanin-rich skin is seen, understood, and prioritized. <br />
4. Intelligent Ingredients
Clinically supported actives, blended with purposeful botanicals — science-led, never excessive.
                  </p>
                  <button className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors">
                    EXPLORE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Call to Action */}
      <ScrollAnimation>
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-playfair">
              Ready to Transform Your Skin?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Discover our range of premium skincare products designed to give you the confidence you deserve.
            </p>
            <Link 
              href="/shop" 
              className="inline-block bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-accent transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </section>
      </ScrollAnimation>
    </div>
  );
}