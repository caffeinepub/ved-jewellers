import { Heart } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "../components/shared/ProductCard";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export function WishlistPage() {
  const { items } = useWishlist();
  const { addToCart } = useCart();

  const handleAddAllToCart = () => {
    for (const p of items) {
      addToCart(p);
    }
    toast.success("All wishlist items added to cart");
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground mb-8">
          <a href="#/" className="hover:text-gold transition-colors">
            Home
          </a>
          <span className="mx-2 text-gold">·</span>
          <span>Wishlist</span>
        </nav>

        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="whisper-text mb-1">Saved for Later</p>
            <h1 className="luxury-heading text-3xl">My Wishlist</h1>
            <p className="text-muted-foreground text-sm font-sans mt-1">
              {items.length} {items.length === 1 ? "piece" : "pieces"} saved
            </p>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleAddAllToCart}
              className="btn-gold hidden sm:block"
            >
              Add All to Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <Heart className="w-16 h-16 text-gold/30 mx-auto mb-6" />
            <h2 className="font-serif text-2xl mb-3">Your wishlist is empty</h2>
            <p className="text-muted-foreground text-sm font-sans mb-8 max-w-sm mx-auto">
              Save your favourite pieces and come back to them anytime.
            </p>
            <a href="#/products" className="btn-gold inline-block">
              Explore Collection
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {/* Mobile add all */}
            {items.length > 0 && (
              <div className="sm:hidden mt-8 text-center">
                <button
                  type="button"
                  onClick={handleAddAllToCart}
                  className="btn-gold w-full max-w-xs"
                >
                  Add All to Cart
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
