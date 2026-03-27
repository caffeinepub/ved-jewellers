// Frontend-only product data for display purposes
// Do NOT store these in backend

const BASE = "/assets/generated";

const heroBannerImg = `${BASE}/hero-banner.dim_1600x700.jpg`;
const vedLogoImg = `${BASE}/ved-logo-transparent.dim_300x80.png`;
const weddingCollectionImg = `${BASE}/wedding-collection.dim_800x600.jpg`;
const giftingCollectionImg = `${BASE}/gifting-collection.dim_800x600.jpg`;
const productRingImg = `${BASE}/product-ring.dim_600x600.jpg`;
const productEarringsImg = `${BASE}/product-earrings.dim_600x600.jpg`;
const productNecklaceImg = `${BASE}/product-necklace.dim_600x600.jpg`;
const productBraceletImg = `${BASE}/product-bracelet.dim_600x600.jpg`;
const productMangalsutraImg = `${BASE}/product-mangalsutra.dim_600x600.jpg`;

export {
  heroBannerImg,
  vedLogoImg,
  weddingCollectionImg,
  giftingCollectionImg,
};

export interface MockProduct {
  id: number;
  name: string;
  price: number; // in paise
  originalPrice?: number;
  category: string;
  imageUrl: string;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  metal: string;
  rating: number;
  reviewCount: number;
  description: string;
  stock: number;
}

const CATEGORY_IMAGES: Record<string, string> = {
  rings: productRingImg,
  earrings: productEarringsImg,
  necklaces: productNecklaceImg,
  bracelets: productBraceletImg,
  mangalsutra: productMangalsutraImg,
  wedding: weddingCollectionImg,
  gifting: giftingCollectionImg,
};

export function getCategoryImage(category: string): string {
  return CATEGORY_IMAGES[category.toLowerCase()] || CATEGORY_IMAGES.rings;
}

export const MOCK_PRODUCTS: MockProduct[] = [
  // Rings
  {
    id: 1,
    name: "Solitaire Diamond Engagement Ring",
    price: 8999900,
    originalPrice: 10999900,
    category: "rings",
    imageUrl: productRingImg,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    metal: "18K Gold",
    rating: 4.9,
    reviewCount: 234,
    description:
      "A breathtaking 1.2 carat round brilliant diamond set in a classic 18K gold prong setting. Certified GIA and hallmarked.",
    stock: 5,
  },
  {
    id: 2,
    name: "Ruby Halo Ring",
    price: 4599900,
    originalPrice: 5499900,
    category: "rings",
    imageUrl: productRingImg,
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true,
    metal: "Rose Gold",
    rating: 4.7,
    reviewCount: 89,
    description:
      "A striking Burmese ruby surrounded by a halo of brilliant-cut diamonds set in 18K rose gold.",
    stock: 8,
  },
  {
    id: 3,
    name: "Emerald Eternity Band",
    price: 3299900,
    originalPrice: undefined,
    category: "rings",
    imageUrl: productRingImg,
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: false,
    metal: "Platinum",
    rating: 4.8,
    reviewCount: 56,
    description:
      "A full eternity band featuring alternating round diamonds and Colombian emeralds in platinum.",
    stock: 3,
  },
  // Earrings
  {
    id: 4,
    name: "Chandelier Diamond Jhumkas",
    price: 6799900,
    originalPrice: 7999900,
    category: "earrings",
    imageUrl: productEarringsImg,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    metal: "22K Gold",
    rating: 4.9,
    reviewCount: 178,
    description:
      "Elaborate chandelier-style jhumkas crafted in 22K gold with diamond accents and pearl drops.",
    stock: 6,
  },
  {
    id: 5,
    name: "Peacock Stud Earrings",
    price: 2499900,
    originalPrice: undefined,
    category: "earrings",
    imageUrl: productEarringsImg,
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: false,
    metal: "Gold Plated",
    rating: 4.6,
    reviewCount: 142,
    description:
      "Intricately designed peacock motif studs with coloured gemstones and diamond accents.",
    stock: 12,
  },
  {
    id: 6,
    name: "Classic Pearl Drop Earrings",
    price: 1899900,
    originalPrice: 2199900,
    category: "earrings",
    imageUrl: productEarringsImg,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: false,
    metal: "925 Silver",
    rating: 4.7,
    reviewCount: 203,
    description:
      "Timeless south sea pearl drop earrings with sterling silver hooks and diamond accent.",
    stock: 20,
  },
  // Necklaces
  {
    id: 7,
    name: "Polki Diamond Rani Haar",
    price: 24999900,
    originalPrice: 28999900,
    category: "necklaces",
    imageUrl: productNecklaceImg,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    metal: "22K Gold",
    rating: 5.0,
    reviewCount: 67,
    description:
      "A majestic rani haar featuring polki diamonds and emeralds set in 22K gold. A true heirloom piece.",
    stock: 2,
  },
  {
    id: 8,
    name: "Diamond Tennis Necklace",
    price: 12999900,
    originalPrice: undefined,
    category: "necklaces",
    imageUrl: productNecklaceImg,
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true,
    metal: "18K Gold",
    rating: 4.8,
    reviewCount: 95,
    description:
      "An elegant tennis necklace featuring 5 carats of round brilliant diamonds in 18K white gold.",
    stock: 4,
  },
  {
    id: 9,
    name: "Temple Lakshmi Pendant",
    price: 3499900,
    originalPrice: 3999900,
    category: "necklaces",
    imageUrl: productNecklaceImg,
    isBestSeller: false,
    isNewArrival: false,
    isFeatured: false,
    metal: "22K Gold",
    rating: 4.9,
    reviewCount: 312,
    description:
      "A traditional Lakshmi pendant in 22K gold with intricate temple-style craftsmanship.",
    stock: 8,
  },
  // Bracelets
  {
    id: 10,
    name: "Diamond Bangle Set",
    price: 9499900,
    originalPrice: 10999900,
    category: "bracelets",
    imageUrl: productBraceletImg,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    metal: "18K Gold",
    rating: 4.8,
    reviewCount: 124,
    description:
      "Set of 3 matching 18K gold bangles with diamond accents, perfect for stacking.",
    stock: 5,
  },
  {
    id: 11,
    name: "Sapphire Tennis Bracelet",
    price: 6299900,
    originalPrice: undefined,
    category: "bracelets",
    imageUrl: productBraceletImg,
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: false,
    metal: "18K Gold",
    rating: 4.7,
    reviewCount: 78,
    description:
      "Stunning alternating sapphire and diamond tennis bracelet in 18K white gold.",
    stock: 7,
  },
  // Mangalsutra
  {
    id: 12,
    name: "Eternal Diamond Mangalsutra",
    price: 5499900,
    originalPrice: 6299900,
    category: "mangalsutra",
    imageUrl: productMangalsutraImg,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    metal: "22K Gold",
    rating: 4.9,
    reviewCount: 456,
    description:
      "A modern diamond mangalsutra with traditional black bead chain and diamond-studded 22K gold pendant.",
    stock: 10,
  },
  {
    id: 13,
    name: "Solitaire Mangalsutra Pendant",
    price: 3999900,
    originalPrice: undefined,
    category: "mangalsutra",
    imageUrl: productMangalsutraImg,
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: false,
    metal: "18K Gold",
    rating: 4.8,
    reviewCount: 234,
    description:
      "Minimalist modern mangalsutra with a single solitaire diamond in a sleek 18K gold pendant.",
    stock: 15,
  },
];

export const CATEGORIES = [
  { id: "rings", name: "Rings", image: productRingImg },
  { id: "earrings", name: "Earrings", image: productEarringsImg },
  { id: "necklaces", name: "Necklaces", image: productNecklaceImg },
  { id: "bracelets", name: "Bracelets", image: productBraceletImg },
  { id: "mangalsutra", name: "Mangalsutra", image: productMangalsutraImg },
  { id: "wedding", name: "Wedding", image: weddingCollectionImg },
];

export const NAV_CATEGORIES = [
  "Rings",
  "Earrings",
  "Necklaces",
  "Bracelets",
  "Mangalsutra",
  "Wedding Collection",
  "Gifting Collection",
];

// Format price from paise to INR
export function formatPrice(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

export function formatBigIntPrice(paise: bigint): string {
  return formatPrice(Number(paise));
}
