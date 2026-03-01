import {
  Award,
  ChevronDown,
  ChevronUp,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Shield,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "../components/shared/ProductCard";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { MOCK_PRODUCTS, formatPrice } from "../data/products";

function AccordionItem({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="font-sans text-sm font-medium tracking-wide">
          {title}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gold" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="pb-4 text-sm font-sans text-muted-foreground leading-relaxed">
          {content}
        </div>
      )}
    </div>
  );
}

function getProductIdFromHash(): string {
  const hash = window.location.hash;
  const match = hash.match(/\/product\/([^?#/]+)/);
  return match ? match[1] : "";
}

export function ProductDetailPage() {
  const id = getProductIdFromHash();
  const product = MOCK_PRODUCTS.find((p) => p.id === Number(id));

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("16");
  const [selectedMetal, setSelectedMetal] = useState("18K Gold");
  const wishlisted = product ? isWishlisted(product.id) : false;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-24">
        <div className="text-center">
          <p className="font-serif text-2xl mb-4">Piece not found</p>
          <a href="#/products" className="btn-gold inline-block">
            Browse Collection
          </a>
        </div>
      </div>
    );
  }

  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 4);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success("Added to cart", {
      description: `${product.name} × ${quantity}`,
    });
  };

  const handleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(product.id);
      toast("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  const sizes = ["14", "15", "16", "17", "18", "19", "20"];
  const metals = ["18K Gold", "22K Gold", "Rose Gold", "Platinum"];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6">
        <nav className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground">
          <a href="#/" className="hover:text-gold transition-colors">
            Home
          </a>
          <span className="mx-2 text-gold">·</span>
          <a
            href={`#/products?category=${product.category}`}
            className="hover:text-gold transition-colors capitalize"
          >
            {product.category}
          </a>
          <span className="mx-2 text-gold">·</span>
          <span className="text-foreground/60 truncate">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square luxury-card overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isBestSeller && (
                <span className="bg-gold text-ink text-[10px] font-sans font-semibold px-2 py-1 uppercase tracking-wider">
                  Bestseller
                </span>
              )}
              {product.isNewArrival && (
                <span className="bg-burgundy text-ivory text-[10px] font-sans font-semibold px-2 py-1 uppercase tracking-wider">
                  New Arrival
                </span>
              )}
              {discount && (
                <span className="bg-red-700 text-white text-[10px] font-sans font-semibold px-2 py-1 uppercase tracking-wider">
                  Save {discount}%
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-gold mb-2">
              {product.metal} ·{" "}
              {product.category.replace(/^\w/, (c) => c.toUpperCase())}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.floor(product.rating)
                        ? "fill-gold stroke-gold"
                        : "fill-muted stroke-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-sans text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
              <span className="font-serif text-3xl text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="font-sans text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs font-sans font-semibold px-2 py-0.5">
                    {discount}% off
                  </span>
                </>
              )}
            </div>

            {/* Metal selector */}
            <div className="mb-5">
              <p className="text-[11px] font-sans uppercase tracking-wider text-muted-foreground mb-2">
                Metal: <span className="text-foreground">{selectedMetal}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {metals.map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setSelectedMetal(m)}
                    className={`px-3 py-1.5 text-[11px] font-sans uppercase tracking-wider border transition-all ${
                      selectedMetal === m
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border text-muted-foreground hover:border-gold hover:text-gold"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="mb-6">
              <p className="text-[11px] font-sans uppercase tracking-wider text-muted-foreground mb-2">
                Size: <span className="text-foreground">{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-9 h-9 text-xs font-sans border transition-all ${
                      selectedSize === s
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border text-muted-foreground hover:border-gold hover:text-gold"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <p className="text-[11px] font-sans uppercase tracking-wider text-muted-foreground">
                Qty:
              </p>
              <div className="flex items-center border border-border">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-sans text-sm font-medium">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs font-sans text-muted-foreground">
                {product.stock} available
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-gold flex-1 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>
              <button
                type="button"
                onClick={handleWishlist}
                className="btn-gold-outline w-12 h-12 flex items-center justify-center"
                aria-label="Add to wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${wishlisted ? "fill-burgundy stroke-burgundy" : ""}`}
                />
              </button>
            </div>

            {/* EMI info */}
            <div className="bg-muted/40 border border-border px-4 py-3 mb-6">
              <p className="text-xs font-sans text-muted-foreground">
                <span className="text-gold font-medium">EMI available</span>{" "}
                from {formatPrice(Math.round(product.price / 12))}/month · No
                cost EMI on select cards
              </p>
            </div>

            {/* Trust icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { icon: Award, label: "BIS Hallmarked" },
                { icon: Shield, label: "Secure Payment" },
                { icon: Truck, label: "Free Shipping" },
                { icon: RotateCcw, label: "30-Day Return" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 text-center"
                >
                  <Icon className="w-4 h-4 text-gold" />
                  <span className="text-[10px] font-sans text-muted-foreground uppercase tracking-wider">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div className="border-t border-border">
              <AccordionItem
                title="Product Description"
                content={product.description}
              />
              <AccordionItem
                title="Metal & Gemstone Details"
                content="All our jewellery is crafted from BIS Hallmarked gold. Diamonds are GIA/IGI certified. Gemstones are ethically sourced and treated to enhance brilliance."
              />
              <AccordionItem
                title="Shipping & Returns"
                content="Free shipping on all orders. Delivered in 5-7 business days in a luxury gift box. Easy 30-day return policy for unworn pieces in original packaging."
              />
              <AccordionItem
                title="Care Instructions"
                content="Store in the provided box away from sunlight. Clean with a soft, lint-free cloth. Avoid contact with perfumes, chemicals, and water. Professional cleaning recommended annually."
              />
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-20">
          <h2 className="luxury-heading text-2xl mb-8">Customer Reviews</h2>
          <div className="flex items-center gap-8 mb-8 pb-8 border-b border-border">
            <div className="text-center">
              <p className="font-serif text-5xl text-foreground">
                {product.rating}
              </p>
              <div className="flex gap-0.5 justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-gold stroke-gold" />
                ))}
              </div>
              <p className="text-xs font-sans text-muted-foreground mt-1">
                {product.reviewCount} reviews
              </p>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-xs font-sans text-muted-foreground w-4">
                    {stars}
                  </span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold"
                      style={{
                        width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : 2}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Ananya R.",
                date: "Jan 2026",
                text: "Absolutely stunning piece. The craftsmanship is impeccable — even better in person than in the photos.",
                rating: 5,
              },
              {
                name: "Vikram S.",
                date: "Feb 2026",
                text: "Bought this as an anniversary gift. My wife was speechless. The packaging was also gorgeous — truly a luxury experience end to end.",
                rating: 5,
              },
            ].map((review) => (
              <div key={review.name} className="luxury-card p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-sans font-medium text-sm">
                      {review.name}
                    </p>
                    <p className="text-xs font-sans text-muted-foreground">
                      {review.date}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-3 h-3 fill-gold stroke-gold"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm font-sans text-foreground/80 leading-relaxed">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="luxury-heading text-2xl mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
