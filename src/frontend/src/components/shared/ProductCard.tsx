import { Heart, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { type MockProduct, formatPrice } from "../../data/products";

interface ProductCardProps {
  product: MockProduct;
  showActions?: boolean;
}

export function ProductCard({ product, showActions = true }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success("Added to cart", {
      description: product.name,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id);
      toast("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  return (
    <a href={`#/product/${product.id}`} className="group block">
      <div className="product-card luxury-card rounded overflow-hidden">
        {/* Image */}
        <div className="relative overflow-hidden bg-muted aspect-square">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isBestSeller && (
              <span className="bg-gold text-ink text-[10px] font-sans font-semibold px-2 py-0.5 uppercase tracking-wider">
                Bestseller
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-burgundy text-ivory text-[10px] font-sans font-semibold px-2 py-0.5 uppercase tracking-wider">
                New
              </span>
            )}
            {discount && (
              <span className="bg-red-700 text-white text-[10px] font-sans font-semibold px-2 py-0.5 uppercase tracking-wider">
                -{discount}%
              </span>
            )}
          </div>

          {/* Hover actions */}
          {showActions && (
            <div className="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-gold flex items-center gap-2 mx-2 text-[11px]"
                aria-label="Add to cart"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Add to Cart
              </button>
            </div>
          )}

          {/* Wishlist button */}
          <button
            type="button"
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-ivory/90 hover:bg-gold transition-colors duration-200 rounded-sm"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                wishlisted ? "fill-burgundy stroke-burgundy" : "stroke-ink/70"
              }`}
            />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground mb-1">
            {product.metal}
          </p>
          <h3 className="font-serif text-sm text-foreground mb-2 leading-snug line-clamp-2 group-hover:text-gold transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 ${
                  star <= Math.floor(product.rating)
                    ? "fill-gold stroke-gold"
                    : "fill-muted stroke-muted-foreground"
                }`}
              />
            ))}
            <span className="text-[11px] text-muted-foreground ml-1">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-sans font-semibold text-foreground text-sm">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-sans text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
