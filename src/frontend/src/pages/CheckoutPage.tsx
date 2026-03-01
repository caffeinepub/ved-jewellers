import { Loader2, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ShoppingItem } from "../backend";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/products";
import { useActor } from "../hooks/useActor";

interface AddressForm {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

const STATES = [
  "Andhra Pradesh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];

export function CheckoutPage() {
  const { items, subtotal, couponDiscount, clearCart } = useCart();
  const { actor } = useActor();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<AddressForm>({
    fullName: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const total = subtotal - couponDiscount;
  const shipping = subtotal >= 5000 ? 0 : 499;
  const finalTotal = total + shipping;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Please login to checkout");
      return;
    }
    if (items.length === 0) return;

    setLoading(true);
    try {
      const shoppingItems: ShoppingItem[] = items.map(
        ({ product, quantity }) => ({
          productName: product.name,
          currency: "inr",
          quantity: BigInt(quantity),
          priceInCents: BigInt(product.price),
          productDescription: product.description.slice(0, 100),
        }),
      );

      const origin = window.location.origin;
      const sessionId = await actor.createCheckoutSession(
        shoppingItems,
        `${origin}/order-confirmation`,
        `${origin}/cart`,
      );

      clearCart();
      window.location.href = sessionId;
    } catch (err) {
      console.error(err);
      toast.error("Could not initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-24 px-4">
        <div className="text-center">
          <h2 className="font-serif text-2xl mb-4">Cart is empty</h2>
          <a href="#/products" className="btn-gold inline-block">
            Browse Collection
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground mb-8">
          <a href="#/" className="hover:text-gold">
            Home
          </a>
          <span className="mx-2 text-gold">·</span>
          <a href="#/cart" className="hover:text-gold">
            Cart
          </a>
          <span className="mx-2 text-gold">·</span>
          <span>Checkout</span>
        </nav>

        <h1 className="luxury-heading text-3xl mb-10">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Address form */}
            <div className="lg:col-span-3 space-y-6">
              <div className="luxury-card p-6">
                <h2 className="font-serif text-xl mb-6">Shipping Address</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="field-fullName"
                      className="block text-[11px] font-sans uppercase tracking-wider text-muted-foreground mb-1.5"
                    >
                      Full Name *
                    </label>
                    <input
                      required
                      id="field-fullName"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Priya Sharma"
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="field-phone"
                      className="block text-[11px] font-sans uppercase tracking-wider text-muted-foreground mb-1.5"
                    >
                      Phone *
                    </label>
                    <input
                      required
                      id="field-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="field-email"
                      className="block text-[11px] font-sans uppercase tracking-wider text-muted-foreground mb-1.5"
                    >
                      Email *
                    </label>
                    <input
                      required
                      id="field-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="priya@email.com"
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="field-addressLine1"
                      className="block text-[11px] font-sans uppercase tracking-wider text-muted-foreground mb-1.5"
                    >
                      Address Line 1 *
                    </label>
                    <input
                      required
                      id="field-addressLine1"
                      name="addressLine1"
                      value={form.addressLine1}
                      onChange={handleChange}
                      placeholder="Street, Building, Floor"
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="field-addressLine2"
                      className="block text-[11px] font-sans uppercase tracking-wider text-muted-foreground mb-1.5"
                    >
                      Address Line 2
                    </label>
                    <input
                      id="field-addressLine2"
                      name="addressLine2"
                      value={form.addressLine2}
                      onChange={handleChange}
                      placeholder="Landmark (optional)"
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="field-city"
                      className="block text-[11px] font-sans uppercase tracking-wider text-muted-foreground mb-1.5"
                    >
                      City *
                    </label>
                    <input
                      required
                      id="field-city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="field-state"
                      className="block text-[11px] font-sans uppercase tracking-wider text-muted-foreground mb-1.5"
                    >
                      State *
                    </label>
                    <select
                      required
                      id="field-state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors"
                    >
                      <option value="">Select state</option>
                      {STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="field-pincode"
                      className="block text-[11px] font-sans uppercase tracking-wider text-muted-foreground mb-1.5"
                    >
                      Pincode *
                    </label>
                    <input
                      required
                      id="field-pincode"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="400001"
                      pattern="[0-9]{6}"
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Payment section info */}
              <div className="luxury-card p-6">
                <h2 className="font-serif text-xl mb-4">Payment</h2>
                <div className="flex items-center gap-3 bg-muted/50 p-4 border border-border">
                  <Shield className="w-5 h-5 text-gold flex-shrink-0" />
                  <div>
                    <p className="font-sans text-sm font-medium">
                      Secure Payment via Stripe
                    </p>
                    <p className="text-xs font-sans text-muted-foreground mt-0.5">
                      You will be redirected to Stripe's secure payment page. We
                      accept Visa, Mastercard, and UPI.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="luxury-card p-6 sticky top-24">
                <h2 className="font-serif text-xl mb-6">Order Review</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-72 overflow-y-auto">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-14 h-14 object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-xs text-foreground leading-tight line-clamp-2">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-gold font-sans mt-0.5">
                          {product.metal}
                        </p>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">
                            ×{quantity}
                          </span>
                          <span className="text-xs font-sans font-medium">
                            {formatPrice(product.price * quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 text-sm font-sans">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal * 100)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Discount</span>
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
                  <div className="pt-3 border-t border-border flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal * 100)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full mt-6 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Pay Securely"
                  )}
                </button>

                <p className="text-center text-[10px] text-muted-foreground mt-3 font-sans">
                  🔒 SSL Secure · Powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
