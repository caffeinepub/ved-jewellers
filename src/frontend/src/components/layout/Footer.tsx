// Using plain anchor tags for hash routing compatibility
import { Facebook, Instagram, Youtube } from "lucide-react";
import { SiPinterest } from "react-icons/si";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-burgundy text-ivory">
      {/* Newsletter */}
      <div className="border-b border-gold/20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-serif text-2xl text-gold mb-1">
              Join the Inner Circle
            </h3>
            <p className="text-ivory/70 text-sm font-sans">
              Exclusive previews, private sales, and jewellery stories.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-0 w-full max-w-md"
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent border border-gold/30 border-r-0 px-4 py-3 text-sm font-sans text-ivory placeholder:text-ivory/40 outline-none focus:border-gold transition-colors"
            />
            <button
              type="submit"
              className="btn-gold text-[11px] border border-gold/30 py-3 px-6 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <img
              src="/assets/generated/ved-logo-transparent.dim_300x80.png"
              alt="Ved Jewellers"
              className="h-10 w-auto mb-4 opacity-90"
            />
            <p className="font-serif-italic text-gold text-sm mb-4">
              "Timeless Elegance. Pure Craft."
            </p>
            <p className="text-ivory/60 text-xs font-sans leading-relaxed">
              Crafting heirloom-quality jewellery since 1987. Every piece tells
              a story of love, craft, and timeless beauty.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-ivory/60 hover:text-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-ivory/60 hover:text-gold transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="text-ivory/60 hover:text-gold transition-colors"
              >
                <SiPinterest className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-ivory/60 hover:text-gold transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-gold mb-5">
              Collections
            </h4>
            <ul className="space-y-2.5">
              {[
                "Rings",
                "Earrings",
                "Necklaces",
                "Bracelets",
                "Mangalsutra",
                "Wedding Collection",
              ].map((item) => (
                <li key={item}>
                  <a
                    href={`#/products?category=${item.toLowerCase().replace(/ /g, "-")}`}
                    className="text-ivory/60 hover:text-gold text-sm font-sans transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-gold mb-5">
              Customer Care
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "My Orders", href: "#" },
                { label: "Wishlist", href: "#/wishlist" },
                { label: "Cart", href: "#/cart" },
                { label: "Shipping Policy", href: "#" },
                { label: "Return Policy", href: "#" },
                { label: "Contact Us", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-ivory/60 hover:text-gold text-sm font-sans transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-gold mb-5">
              Company
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "About Ved Jewellers", href: "#" },
                { label: "Craftsmanship", href: "#" },
                { label: "BIS Hallmark", href: "#" },
                {
                  label: "Gifting Services",
                  href: "#/products?category=gifting-collection",
                },
                { label: "Admin", href: "#/admin" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-ivory/60 hover:text-gold text-sm font-sans transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Trust badges compact */}
            <div className="mt-6 pt-6 border-t border-gold/20 space-y-2">
              <div className="flex items-center gap-2 text-ivory/60 text-xs font-sans">
                <span className="text-gold">✦</span> BIS Hallmarked
              </div>
              <div className="flex items-center gap-2 text-ivory/60 text-xs font-sans">
                <span className="text-gold">✦</span> Secure Payments
              </div>
              <div className="flex items-center gap-2 text-ivory/60 text-xs font-sans">
                <span className="text-gold">✦</span> 30-Day Returns
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gold/15">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-ivory/40 text-xs font-sans text-center sm:text-left">
            © {year} Ved Jewellers. All rights reserved.
          </p>
          <p className="text-ivory/30 text-xs font-sans">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/60 hover:text-gold transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
