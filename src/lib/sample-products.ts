import type { Product } from "./types"

// Product Categories Structure
export const PRODUCT_CATEGORIES = {
  FACE_CARE: "Face Care",
  BODY_CARE: "Body Care",
  TARGETED_TREATMENTS: "Targeted Treatments",
  COLLECTIONS: "Collections",
  SHOP_BY_CONCERN: "Shop by Skin Concern",
  SHOP_BY_TONE: "Shop by Skin Tone",
  ACCESSORIES: "Accessories"
} as const

// Subcategories for each main category (excluding future items)
export const SUBCATEGORIES = {
  FACE_CARE: [
    "Face Creams",
    "Serums",
    "Toners",
    "Cleansers"
  ],
  BODY_CARE: [
    "Body Lotions",
    "Body Washes",
    "Bar Soaps",
    "Hand & Foot Creams"
  ],
  TARGETED_TREATMENTS: [
    "Armpit Lightening Deodorants",
    "Spot Correctors",
    "Dark Knuckle Treatments",
    "Inner Thigh Brighteners",
    "Acne Spot Serums"
  ],
  COLLECTIONS: [
    "Advanced Clarifying Line",
    "Advanced Glow Line"
  ],
  SHOP_BY_CONCERN: [
    "Acne & Breakouts",
    "Dark Spots & Hyperpigmentation",
    "Uneven Skin Tone",
    "Dull & Rough Skin",
    "Oily / Combination Skin",
    "Dry / Dehydrated Skin",
    "Sensitive Skin"
  ],
  SHOP_BY_TONE: [
    "Light Skin",
    "Medium / Brown Skin",
    "Deep Skin",
    "All Skin Types"
  ],
  ACCESSORIES: [
    "Facial Towels",
    "Cotton Pads",
    "Lip Balm",
    "Cosmetic Bags",
    "Mirrors"
  ]
} as const

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "ADVANCED CLARIFYING FACE CREAM 50g",
    description: "Advanced Clarifying Face Cream. A powerfully gentle brightening cream designed to fade dark spots, sunburn, and uneven tone; without bleaching, dryness, or irritation. Formulated with dermatologist-backed actives, it restores clarity, smooths texture, and supports healthy, melanin-rich skin. Lighten. Smoothen. Restore.",
    price: 15000,
    currency: "NGN",
    image: "/skin-fair.png",
    category: "Face Care",
    inStock: true,
    featured: true,
    sales: 150,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "ADVANCED GLOW BODY WASH 500ml",
    description: "COMING SOON!…",
    price: 18000,
    currency: "NGN",
    image: "/glow-body.jpeg",
    category: "Body Care",
    inStock: true,
    featured: false,
    sales: 200,
    createdAt: "2024-02-10",
  },
  {
    id: "3",
   name: "ADVANCED GLOW BODY WASH 500ml",
    description: "COMING SOON!…",
    price: 7000,
    currency: "NGN",
    image: "/glow-body.jpeg",
    category: "Body Care",
    inStock: true,
    featured: true,
    sales: 180,
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    name: "Maxi Tone | So White",
    description: "Advanced brightening treatment for luminous complexion",
    price: 20500,
    currency: "NGN",
    image: "/fair-cream.png",
    category: "Targeted Treatments",
    inStock: true,
    featured: false,
    sales: 95,
    createdAt: "2024-03-05",
  },
  {
    id: "5",
    name: "Exfoliating Soap | So White",
    description: "Deep cleansing exfoliating soap for fresh, glowing skin",
    price: 7000,
    currency: "NGN",
    image: "/glow-body.jpeg",
    category: "Body Care",
    inStock: true,
    featured: false,
    sales: 220,
    createdAt: "2024-02-28",
  },
  {
    id: "6",
    name: "Brightening Oil | So White",
    description: "Lightweight brightening oil for radiant, even-toned skin",
    price: 17000,
    currency: "NGN",
    image: "/mahz-cream.jpeg",
    category: "Face Care",
    inStock: true,
    featured: true,
    sales: 130,
    createdAt: "2024-01-25",
  },
  {
    id: "7",
   name: "ADVANCED GLOW BODY WASH 500ml",
    description: "COMING SOON!…",
    price: 7000,
    currency: "NGN",
    image: "/glow-body.jpeg",
    category: "Body Care",
    inStock: true,
    featured: false,
    sales: 110,
    createdAt: "2024-03-12",
  },
  {
    id: "8",
    name: "Brightening Face Cream | So White",
    description: "Advanced face cream for brighter, more youthful appearance",
    price: 18500,
    currency: "NGN",
    image: "/mahz-cream.jpeg",
    category: "Face Care",
    inStock: true,
    featured: false,
    sales: 140,
    createdAt: "2024-02-15",
  },
  {
    id: "9",
    name: "Exfoliating Scrub | Lemon",
    description: "Refreshing lemon-infused scrub for smooth, glowing skin",
    price: 8500,
    currency: "NGN",
    image: "/glow-body.jpeg",
    category: "Face Care",
    inStock: true,
    featured: false,
    sales: 175,
    createdAt: "2024-03-01",
  },
  {
    id: "10",
    name: "Nourishing Body Oil | Gold Ultimate",
    description: "Premium body oil with 24k gold for ultimate luxury",
    price: 32000,
    currency: "NGN",
    image: "/cosmestic-set.avif",
    category: "Body Care",
    inStock: true,
    featured: true,
    sales: 85,
    createdAt: "2024-01-10",
  },
  {
    id: "11",
    name: "Clarifying Toner | So White",
    description: "Balancing toner that prepares skin for optimal absorption",
    price: 12000,
    currency: "NGN",
    image: "/organic-spa.avif",
    category: "Face Care",
    inStock: false,
    featured: false,
    sales: 160,
    createdAt: "2024-02-20",
  },
  {
    id: "12",
    name: "Intensive Serum | Vitamin C",
    description: "Powerful vitamin C serum for radiant, protected skin",
    price: 16500,
    currency: "NGN",
    image: "/two-black-white.avif",
    category: "Face Care",
    inStock: true,
    featured: false,
    sales: 190,
    createdAt: "2024-03-08",
  },
  {
    id: "13",
    name: "Gentle Foaming Cleanser | So White",
    description: "Mild foaming cleanser that removes impurities without stripping skin",
    price: 9500,
    currency: "NGN",
    image: "/skin-care.jpeg",
    category: "Face Care",
    inStock: true,
    featured: false,
    sales: 165,
    createdAt: "2024-03-15",
  },
  {
    id: "14",
    name: "Refreshing Body Wash | Lemon Fresh",
    description: "Energizing body wash with natural lemon extracts",
    price: 8000,
    currency: "NGN",
    image: "/dripping-cream.jpeg",
    category: "Body Care",
    inStock: true,
    featured: false,
    sales: 145,
    createdAt: "2024-03-20",
  },
  {
    id: "15",
    name: "Armpit Brightening Deodorant | 24hr Protection",
    description: "Long-lasting deodorant that brightens underarm area while providing protection",
    price: 6500,
    currency: "NGN",
    image: "/fair-skin.png",
    category: "Targeted Treatments",
    inStock: true,
    featured: true,
    sales: 210,
    createdAt: "2024-03-25",
  },
  {
    id: "16",
    name: "Dark Knuckle Treatment Cream",
    description: "Specialized treatment for dark knuckles and elbows",
    price: 15000,
    currency: "NGN",
    image: "/care.webp",
    category: "Targeted Treatments",
    inStock: true,
    featured: false,
    sales: 85,
    createdAt: "2024-04-01",
  },
  {
    id: "17",
    name: "Hand & Foot Repair Cream | Ultra Moisturizing",
    description: "Intensive repair cream for dry, cracked hands and feet",
    price: 11000,
    currency: "NGN",
    image: "/frw.webp",
    category: "Body Care",
    inStock: true,
    featured: false,
    sales: 125,
    createdAt: "2024-04-05",
  },
  {
    id: "18",
    name: "Inner Thigh Brightener | Gentle Formula",
    description: "Gentle brightening treatment for sensitive inner thigh area",
    price: 18000,
    currency: "NGN",
    image: "/aore.webp",
    category: "Targeted Treatments",
    inStock: true,
    featured: false,
    sales: 95,
    createdAt: "2024-04-10",
  },
]

// Initialize products in localStorage
export function initializeProducts() {
  if (typeof window === "undefined") return

  // Force update products to match current SAMPLE_PRODUCTS
  localStorage.setItem("mahzskin_products", JSON.stringify(SAMPLE_PRODUCTS))
}

export function getProducts(): Product[] {
  if (typeof window === "undefined") return SAMPLE_PRODUCTS

  const stored = localStorage.getItem("mahzskin_products")
  return stored ? JSON.parse(stored) : SAMPLE_PRODUCTS
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return getProducts().filter((p) => p.category === category)
}

export function getProductsByMainCategory(mainCategory: keyof typeof SUBCATEGORIES): Product[] {
  const subcategories = SUBCATEGORIES[mainCategory]
  return getProducts().filter((p) => (subcategories as readonly string[]).includes(p.category))
}

export function getAllCategories(): string[] {
  const products = getProducts()
  return [...new Set(products.map(p => p.category))]
}

export function getMainCategoryForSubcategory(subcategory: string): string | null {
  for (const [mainCat, subCats] of Object.entries(SUBCATEGORIES)) {
    if ((subCats as readonly string[]).includes(subcategory)) {
      return PRODUCT_CATEGORIES[mainCat as keyof typeof PRODUCT_CATEGORIES]
    }
  }
  return null
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase()
  return getProducts().filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery),
  )
}

// Helper function to get products by skin concern
export function getProductsByConcern(concern: string): Product[] {
  // This would be enhanced with actual product tagging in a real app
  const concernKeywords: Record<string, string[]> = {
    "Acne & Breakouts": ["acne", "clarifying", "spot"],
    "Dark Spots & Hyperpigmentation": ["brightening", "spot corrector", "whitening"],
    "Uneven Skin Tone": ["tone", "even", "brightening"],
    "Dull & Rough Skin": ["exfoliating", "radiance", "glow"],
    "Oily / Combination Skin": ["clarifying", "toner", "oil control"],
    "Dry / Dehydrated Skin": ["nourishing", "hydra", "moisturizing"],
    "Sensitive Skin": ["gentle", "sensitive", "soothing"]
  }

  const keywords = concernKeywords[concern] || []
  return getProducts().filter(p =>
    keywords.some(keyword =>
      p.name.toLowerCase().includes(keyword) ||
      p.description.toLowerCase().includes(keyword)
    )
  )
}

// Helper function to get products by skin tone
export function getProductsByTone(tone: string): Product[] {
  // In a real app, products would have tone compatibility tags
  // For now, return all products as most are suitable for all tones
  if (tone === "All Skin Types") {
    return getProducts()
  }
  // This would be enhanced with actual tone compatibility data
  return getProducts()
}
