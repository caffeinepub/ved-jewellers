import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { NAV_CATEGORIES, vedLogoImg } from "../../data/products";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

const CATEGORY_LINKS = NAV_CATEGORIES.map((cat) => ({
  name: cat,
  href: `/products?category=${encodeURIComponent(cat.toLowerCase().replace(/ /g, "-"))}`,
}));

// Mega menu sub-items
const MEGA_MENU: Record<string, Array<{ label: string; href: string }>> = {
  Rings: [
    { label: "Engagement Rings", href: "/products?category=rings" },
    { label: "Wedding Bands", href: "/products?category=rings" },
    { label: "Cocktail Rings", href: "/products?category=rings" },
    { label: "Diamond Rings", href: "/products?category=rings" },
    { label: "Gold Rings", href: "/products?category=rings" },
    { label: "Silver Rings", href: "/products?category=rings" },
  ],
  Earrings: [
    { label: "Jhumkas", href: "/products?category=earrings" },
    { label: "Drop Earrings", href: "/products?category=earrings" },
    { label: "Stud Earrings", href: "/products?category=earrings" },
    { label: "Hoop Earrings", href: "/products?category=earrings" },
    { label: "Chandelier", href: "/products?category=earrings" },
    { label: "Ear Cuffs", href: "/products?category=earrings" },
  ],
  Necklaces: [
    { label: "Mangalsutra", href: "/products?category=mangalsutra" },
    { label: "Chokers", href: "/products?category=necklaces" },
    { label: "Pendants", href: "/products?category=necklaces" },
    { label: "Layered", href: "/products?category=necklaces" },
    { label: "Diamond Necklaces", href: "/products?category=necklaces" },
    { label: "Gold Chains", href: "/products?category=necklaces" },
  ],
};

function getCurrentHashPath() {
  return window.location.hash.replace(/^#/, "") || "/";
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPath, setCurrentPath] = useState(getCurrentHashPath());
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { identity, login, clear } = useInternetIdentity();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleHash = () => {
      setCurrentPath(getCurrentHashPath());
      setMobileOpen(false);
      setActiveMenu(null);
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.hash = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isHomePage = currentPath === "/" || currentPath === "";
  const transparent = isHomePage && !scrolled && !mobileOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          transparent
            ? "bg-transparent"
            : "bg-ivory/97 backdrop-blur-sm border-b border-gold/15 shadow-xs"
        }`}
      >
        {/* Top announcement bar */}
        {!scrolled && !mobileOpen && (
          <div className="bg-burgundy text-ivory text-center py-1.5 text-[11px] tracking-widest uppercase font-sans">
            Free shipping on orders above ₹5,000 &nbsp;|&nbsp; BIS Hallmarked
            Jewellery
          </div>
        )}

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Hamburger - Mobile */}
            <button
              type="button"
              className="lg:hidden p-2 text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Logo */}
            <a href="#/" className="flex-shrink-0">
              <img
                src={vedLogoImg}
                alt="Ved Jewellers"
                className="h-10 lg:h-12 w-auto"
              />
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0">
              {NAV_CATEGORIES.map((cat) => (
                <div
                  key={cat}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(cat)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <a
                    href={`#/products?category=${encodeURIComponent(cat.toLowerCase().replace(/ /g, "-"))}`}
                    className={`flex items-center gap-0.5 px-4 py-2 text-[12px] font-sans font-medium uppercase tracking-widest transition-colors duration-200 ${
                      transparent
                        ? "text-ivory/90 hover:text-gold"
                        : "text-ink/80 hover:text-gold"
                    }`}
                  >
                    {cat}
                    {MEGA_MENU[cat] && (
                      <ChevronDown className="w-3 h-3 mt-0.5" />
                    )}
                  </a>

                  {/* Mega menu dropdown */}
                  {MEGA_MENU[cat] && activeMenu === cat && (
                    <div className="mega-menu absolute top-full left-1/2 -translate-x-1/2 w-56 bg-ivory border border-gold/20 shadow-luxury z-50">
                      <div className="py-4 px-5">
                        <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-gold mb-3">
                          {cat}
                        </p>
                        {MEGA_MENU[cat].map((item) => (
                          <a
                            key={item.label}
                            href={`#${item.href}`}
                            className="block py-1.5 text-[12px] font-sans text-ink/70 hover:text-gold transition-colors"
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 transition-colors ${
                  transparent
                    ? "text-ivory/90 hover:text-gold"
                    : "text-ink/80 hover:text-gold"
                }`}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <a
                href="#/wishlist"
                className={`relative p-2 transition-colors ${
                  transparent
                    ? "text-ivory/90 hover:text-gold"
                    : "text-ink/80 hover:text-gold"
                }`}
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold text-ink text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </a>

              {/* Cart */}
              <a
                href="#/cart"
                className={`relative p-2 transition-colors ${
                  transparent
                    ? "text-ivory/90 hover:text-gold"
                    : "text-ink/80 hover:text-gold"
                }`}
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold text-ink text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </a>

              {/* Account */}
              {identity ? (
                <button
                  type="button"
                  onClick={clear}
                  className={`hidden sm:flex items-center gap-1 p-2 text-[11px] font-sans uppercase tracking-wider transition-colors ${
                    transparent
                      ? "text-ivory/90 hover:text-gold"
                      : "text-ink/80 hover:text-gold"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={login}
                  className={`hidden sm:flex items-center gap-1 p-2 text-[11px] font-sans uppercase tracking-wider transition-colors ${
                    transparent
                      ? "text-ivory/90 hover:text-gold"
                      : "text-ink/80 hover:text-gold"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden lg:inline">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="bg-ivory border-t border-gold/20 px-4 py-3">
            <form
              onSubmit={handleSearch}
              className="max-w-xl mx-auto flex items-center gap-3"
            >
              <Search className="w-4 h-4 text-gold flex-shrink-0" />
              <input
                type="text"
                placeholder="Search for jewellery, collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm font-sans text-foreground placeholder:text-muted-foreground outline-none border-b border-gold/30 pb-1 focus:border-gold transition-colors"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm cursor-default border-0 p-0"
            onClick={() => setMobileOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-72 bg-ivory flex flex-col">
            <div className="h-16 border-b border-gold/20 flex items-center px-4">
              <img
                src={vedLogoImg}
                alt="Ved Jewellers"
                className="h-9 w-auto"
              />
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              {CATEGORY_LINKS.map((cat) => (
                <a
                  key={cat.name}
                  href={`#${cat.href}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-6 py-3.5 text-sm font-sans uppercase tracking-wider text-ink/80 hover:text-gold hover:bg-gold/5 transition-colors border-b border-gold/10"
                >
                  {cat.name}
                </a>
              ))}
              <div className="px-6 pt-6 space-y-3">
                {identity ? (
                  <button
                    type="button"
                    onClick={() => {
                      clear();
                      setMobileOpen(false);
                    }}
                    className="w-full btn-gold-outline text-center block"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      login();
                      setMobileOpen(false);
                    }}
                    className="w-full btn-gold text-center block"
                  >
                    Login
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    window.location.hash = "/admin";
                  }}
                  className="block w-full text-center text-xs text-muted-foreground hover:text-gold py-2"
                >
                  Admin
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
