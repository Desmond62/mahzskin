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
                <div className="lg:order-1">
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
                <div className="lg:order-2 text-center lg:text-left">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-playfair">
                    ABOUT MAHZ SKIN
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                      In Persian, ‘محض’ (MAHZ) means <i><b>PURELY</b></i>; word that expresses intention, clarity, and pureness. That meaning drives all we produce.MAHZ SKIN is without compromise. We believe that skincare should enhance your skin’s natural richness rather than stripping, suppressing, or forcing it into something it was never intended to be. To transform your skin, you need balance, dignity, and sensible formulation, not aggression. 

MAHZ SKIN develops results-driven formulations that perform well with every complexion, with a focus on melanin-rich skin.We combine scientifically proven actives with carefully selected botanicals to produce visible effects without undue harshness. There are no shortcuts. No false claims. Simply effective, skin-friendly skincare.
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
                {/* Right: Image - First on mobile */}
                <div className="lg:order-2">
                  <div className="relative aspect-4/5 rounded-lg overflow-hidden group cursor-pointer">
                    <Image
                      src="/our-vision.jpg"
                      alt="malzskin face serrum Product"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
                
                {/* Left: Content - Second on mobile */}
                <div className="lg:order-1 text-center lg:text-left">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-playfair">
                    OUR VISION 
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
 To reinvent results-driven skincare by setting a new worldwide standard for intelligent, melanin-conscious formulas, where noticeable transformation meets uncompromising skin dignity and every complexion is refined, elevated, and empowered to glow purely.
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

      {/* Our Approach Section */}
      <ScrollAnimation>
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Image - First on mobile */}
                <div className="lg:order-1">
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
                
                {/* Right: Content - Second on mobile */}
                <div className="lg:order-2 text-center lg:text-left">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-playfair">
                     BRAND STORY
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                                     
Mahz Skin was founded on a simple yet powerful belief: you deserve visibly clear, glowing skin without compromise. In a market crowded with harsh lightening creams and false claims, we choose a different approach: science-backed formulations that are effective, intentional, and kind on your skin. Every product is designed with high-performance actives, balanced quality, and an in depth understanding of genuine skin challenges such as dark spots, sunburn, uneven tone, compromised skin-barrier, and dullness; particularly for melanin-rich skin that requires expert care rather than shortcuts. 

Trends are not our focus here. We are here to help with transformation. Mahz Skin represents confidence, clarity, and quiet luxury. Visible results, trusted formulas, and a glow that looks like you but is upgraded. This is skincare for women who seek more radiance, refinement, and power in their routine. Your skin is not a flaw to be fixed; it is a standard to be improved.
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