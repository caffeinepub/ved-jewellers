import { Minus, Plus, ShoppingBag, Tag, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/products";

export function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    couponDiscount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  // Use window.location.hash for navigation

  const total = subtotal - couponDiscount;
  const shipping = subtotal >= 5000 ? 0 : 499;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);

    // Simulate coupon check (hardcoded demo coupons)
    await new Promise((r) => setTimeout(r, 800));
    const mockCoupons: Record<string, number> = {
      VED10: 0.1,
      VED20: 0.2,
      WEDDING15: 0.15,
    };
    const rate = mockCoupons[couponCode.toUpperCase()];
    if (rate) {
      applyCoupon(couponCode.toUpperCase(), subtotal * rate);
      toast.success("Coupon applied!", {
        description: `${rate * 100}% discount applied`,
      });
    } else {
      toast.error("Invalid coupon code");
    }
    setCouponLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-24 px-4">
        <div className="text-center max-w-sm">
          <ShoppingBag className="w-16 h-16 text-gold/40 mx-auto mb-6" />
          <h2 className="font-serif text-2xl mb-3">Your cart is empty</h2>
          <p className="text-muted-foreground text-sm font-sans mb-8">
            Discover our curated collection of fine jewellery
          </p>
          <a href="#/products" className="btn-gold inline-block">
            Browse Collection
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground mb-8">
          <a href="#/" className="hover:text-gold transition-colors">
            Home
          </a>
          <span className="mx-2 text-gold">·</span>
          <span>Shopping Cart</span>
        </nav>

        <h1 className="luxury-heading text-3xl mb-10">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="luxury-card flex gap-4 p-4 sm:p-5"
              >
                <a href={`#/product/${product.id}`} className="flex-shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover"
                  />
                </a>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-sans uppercase tracking-widest text-gold mb-0.5">
                        {product.metal}
                      </p>
                      <a
                        href={`#/product/${product.id}`}
                        className="font-serif text-sm sm:text-base leading-snug hover:text-gold transition-colors"
                      >
                        {product.name}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="text-muted-foreground hover:text-destructive flex-shrink-0 transition-colors"
                      aria-label="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity */}
                    <div className="flex items-center border border-border">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-sans">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-sans font-semibold text-sm">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="luxury-card p-6 sticky top-24">
              <h2 className="font-serif text-xl mb-6">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6 pb-6 border-b border-border">
                <label
                  htmlFor="coupon-input"
                  className="text-[11px] font-sans uppercase tracking-wider text-muted-foreground block mb-2"
                >
                  Coupon Code
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-2 text-sm font-sans text-green-700">
                    <Tag className="w-4 h-4" />
                    <span className="flex-1">{appliedCoupon} applied</span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-destructive"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      id="coupon-input"
                      type="text"
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleApplyCoupon()
                      }
                      className="flex-1 border border-border bg-background px-3 py-2 text-sm font-sans outline-none focus:border-gold transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="btn-gold py-2 px-3 text-[10px] disabled:opacity-60"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground mt-1.5 font-sans">
                  Try: VED10, VED20, WEDDING15
                </p>
              </div>

              {/* Summary rows */}
              <div className="space-y-3 text-sm font-sans">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal * 100)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(couponDiscount * 100)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-700">Free</span>
                    ) : (
                      formatPrice(shipping * 100)
                    )}
                  </span>
                </div>
                {subtotal < 5000 && (
                  <p className="text-[11px] text-gold">
                    Add {formatPrice((5000 - subtotal) * 100)} more for free
                    shipping
                  </p>
                )}
                <div className="pt-3 border-t border-border flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>{formatPrice((total + shipping) * 100)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.location.hash = "/checkout";
                }}
                className="btn-gold w-full mt-6 text-center block"
              >
                Proceed to Checkout
              </button>

              <a
                href="#/products"
                className="block text-center mt-3 text-[11px] font-sans text-muted-foreground hover:text-gold uppercase tracking-wider transition-colors"
              >
                Continue Shopping
              </a>

              {/* Security note */}
              <p className="text-center text-[10px] text-muted-foreground mt-4 font-sans">
                🔒 Secure 256-bit SSL encrypted checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
