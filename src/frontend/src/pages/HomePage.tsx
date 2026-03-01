import {
  ArrowRight,
  Award,
  CreditCard,
  RotateCcw,
  Shield,
  Star,
} from "lucide-react";
import { useRef } from "react";
import { ProductCard } from "../components/shared/ProductCard";
import { CATEGORIES, MOCK_PRODUCTS, formatPrice } from "../data/products";
import { useReveal } from "../hooks/useReveal";

// ─── Hero ──────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-banner.dim_1600x700.jpg"
          alt="Luxury jewellery"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink/70" />
        {/* Decorative vignette */}
        <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent via-transparent to-ink/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <p className="whisper-text text-base mb-4 opacity-90 animate-fade-in-up [animation-delay:0.2s] [animation-fill-mode:both]">
          Est. 1987 · Certified Jewellery
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-ivory font-medium leading-tight mb-4 animate-fade-in-up [animation-delay:0.4s] [animation-fill-mode:both]">
          Timeless
          <br />
          <span className="shimmer-text">Elegance</span>
        </h1>
        <p className="font-serif-italic text-ivory/80 text-lg sm:text-xl mb-10 animate-fade-in-up [animation-delay:0.6s] [animation-fill-mode:both]">
          Pure Craft. Eternal Beauty.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:0.8s] [animation-fill-mode:both]">
          <a href="#/products" className="btn-gold inline-block">
            Explore Collection
          </a>
          <a
            href="#/products?category=wedding-collection"
            className="btn-gold-outline inline-block"
          >
            Wedding Jewellery
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in-up [animation-delay:1.2s] [animation-fill-mode:both]">
        <span className="text-ivory/50 text-[10px] font-sans uppercase tracking-widest">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}

// ─── Trust Badges ──────────────────────────────────────────────────────────
function TrustBadges() {
  const ref = useReveal();
  const badges = [
    { icon: Award, label: "BIS Hallmarked", desc: "Certified 22K/18K Gold" },
    {
      icon: Shield,
      label: "Certified Purity",
      desc: "GIA & IGI Certified Diamonds",
    },
    {
      icon: CreditCard,
      label: "Secure Payments",
      desc: "256-bit SSL Encryption",
    },
    {
      icon: RotateCcw,
      label: "Easy Returns",
      desc: "Hassle-free 30-Day Policy",
    },
  ];

  return (
    <section
      ref={ref}
      className="reveal bg-burgundy py-10 border-y border-gold/20"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 flex items-center justify-center border border-gold/40 mb-1">
                <Icon className="w-5 h-5 text-gold" />
              </div>
              <p className="font-sans font-semibold text-ivory text-sm uppercase tracking-wider">
                {label}
              </p>
              <p className="text-ivory/50 text-xs font-sans">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Category Grid ─────────────────────────────────────────────────────────
function CategoryGrid() {
  const ref = useReveal();

  return (
    <section
      ref={ref}
      className="reveal py-20 px-4 sm:px-8 max-w-[1400px] mx-auto"
    >
      <div className="text-center mb-12">
        <p className="whisper-text mb-2">Our Collections</p>
        <h2 className="luxury-heading text-3xl sm:text-4xl">
          Shop by Category
        </h2>
        <div className="gold-divider mt-4" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.id}
            href={`#/products?category=${cat.id}`}
            className="group flex flex-col items-center gap-3"
          >
            <div className="w-full aspect-square overflow-hidden luxury-card">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            <div className="text-center">
              <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-ink/80 group-hover:text-gold transition-colors font-medium">
                {cat.name}
              </p>
              <div className="w-0 group-hover:w-full h-px bg-gold transition-all duration-300 mx-auto mt-1" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ─── Best Sellers ──────────────────────────────────────────────────────────
function BestSellersSection() {
  const ref = useReveal();
  const scrollRef = useRef<HTMLDivElement>(null);
  const bestSellers = MOCK_PRODUCTS.filter((p) => p.isBestSeller);

  return (
    <section ref={ref} className="reveal py-20 bg-ivory/70">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="whisper-text mb-2">Most Loved</p>
            <h2 className="luxury-heading text-3xl sm:text-4xl">
              Best Sellers
            </h2>
            <div
              className="gold-divider mt-4 ml-0"
              style={{ margin: "1rem 0 0 0" }}
            />
          </div>
          <a
            href="#/products"
            className="hidden sm:flex items-center gap-2 text-[11px] font-sans uppercase tracking-widest text-gold hover:text-gold-dark transition-colors"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4"
        >
          {bestSellers.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-64 sm:w-72">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── New Arrivals ──────────────────────────────────────────────────────────
function NewArrivalsSection() {
  const ref = useReveal();
  const newArrivals = MOCK_PRODUCTS.filter((p) => p.isNewArrival).slice(0, 4);

  return (
    <section ref={ref} className="reveal py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="whisper-text mb-2">Fresh In</p>
            <h2 className="luxury-heading text-3xl sm:text-4xl">
              New Arrivals
            </h2>
            <div
              className="gold-divider mt-4 ml-0"
              style={{ margin: "1rem 0 0 0" }}
            />
          </div>
          <a
            href="#/products?filter=new"
            className="hidden sm:flex items-center gap-2 text-[11px] font-sans uppercase tracking-widest text-gold hover:text-gold-dark transition-colors"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Collection Banners ────────────────────────────────────────────────────
function CollectionBanners() {
  const ref = useReveal();

  return (
    <section ref={ref} className="reveal py-20 bg-ivory/50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Wedding Collection */}
          <a
            href="#/products?category=wedding-collection"
            className="group relative overflow-hidden aspect-[4/3] block luxury-card"
          >
            <img
              src="/assets/generated/wedding-collection.dim_800x600.jpg"
              alt="Wedding Collection"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <p className="whisper-text text-sm mb-2">Bridal</p>
              <h3 className="font-serif text-3xl text-ivory mb-3">
                Wedding Collection
              </h3>
              <span className="btn-gold-outline text-[10px] inline-block py-2 px-4">
                Explore →
              </span>
            </div>
          </a>

          {/* Gifting Collection */}
          <a
            href="#/products?category=gifting-collection"
            className="group relative overflow-hidden aspect-[4/3] block luxury-card"
          >
            <img
              src="/assets/generated/gifting-collection.dim_800x600.jpg"
              alt="Gifting Collection"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <p className="whisper-text text-sm mb-2">For Loved Ones</p>
              <h3 className="font-serif text-3xl text-ivory mb-3">
                Gifting Collection
              </h3>
              <span className="btn-gold-outline text-[10px] inline-block py-2 px-4">
                Explore →
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ──────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "The Polki Rani Haar I ordered for my daughter's wedding was absolutely breathtaking. The craftsmanship is exquisite — you can feel the love in every detail. We've now become lifelong customers.",
    product: "Polki Diamond Rani Haar",
  },
  {
    name: "Arjun Mehta",
    location: "Delhi",
    rating: 5,
    text: "I ordered the solitaire engagement ring for my proposal and she said yes! The GIA certification gave me confidence and the ring exceeded all expectations. Truly a world-class piece.",
    product: "Solitaire Diamond Ring",
  },
  {
    name: "Deepa Krishnan",
    location: "Chennai",
    rating: 5,
    text: "The diamond mangalsutra is modern yet traditional, exactly what I was looking for. The quality is impeccable and the packaging was stunning — felt like opening a luxury gift every step of the way.",
    product: "Eternal Diamond Mangalsutra",
  },
];

function TestimonialsSection() {
  const ref = useReveal();

  return (
    <section ref={ref} className="reveal py-20 bg-burgundy">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="text-center mb-14">
          <p className="whisper-text text-gold mb-2">Words from Our Patrons</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-ivory">
            Stories of Timeless Moments
          </h2>
          <div className="gold-divider mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-ivory/5 border border-gold/20 p-8 flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-gold stroke-gold" />
                ))}
              </div>

              <p className="text-ivory/80 text-sm font-sans leading-relaxed italic">
                "{t.text}"
              </p>

              <div className="mt-auto pt-4 border-t border-gold/20">
                <p className="font-serif text-gold text-base">{t.name}</p>
                <p className="text-ivory/40 text-xs font-sans mt-0.5">
                  {t.location} · Purchased: {t.product}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Featured Products Callout ─────────────────────────────────────────────
function FeaturedCallout() {
  const ref = useReveal();
  const featured = MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, 1)[0];

  if (!featured) return null;

  return (
    <section ref={ref} className="reveal py-0">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        <div className="relative overflow-hidden">
          <img
            src={featured.imageUrl}
            alt={featured.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ivory/20" />
        </div>
        <div className="bg-ink flex flex-col justify-center px-12 py-16">
          <p className="whisper-text text-gold mb-4">Editor's Pick</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-ivory mb-4 leading-tight">
            {featured.name}
          </h2>
          <p className="text-ivory/60 text-sm font-sans leading-relaxed mb-6">
            {featured.description}
          </p>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-sans text-2xl font-semibold text-gold">
              {formatPrice(featured.price)}
            </span>
            {featured.originalPrice && (
              <span className="font-sans text-base text-ivory/40 line-through">
                {formatPrice(featured.originalPrice)}
              </span>
            )}
          </div>
          <a
            href={`#/product/${featured.id}`}
            className="btn-gold inline-block w-fit"
          >
            View Piece
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustBadges />
      <CategoryGrid />
      <BestSellersSection />
      <FeaturedCallout />
      <NewArrivalsSection />
      <CollectionBanners />
      <TestimonialsSection />
    </main>
  );
}
