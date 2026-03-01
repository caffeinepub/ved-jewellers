import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "../components/shared/ProductCard";
import { MOCK_PRODUCTS, type MockProduct, formatPrice } from "../data/products";

const METAL_TYPES = [
  "925 Silver",
  "Gold Plated",
  "Rose Gold",
  "18K Gold",
  "22K Gold",
  "Diamond",
  "Platinum",
];
const OCCASIONS = ["Everyday", "Wedding", "Festive", "Party", "Gifting"];
const GENDERS = ["All", "Women", "Men", "Kids"];
const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function getHashSearchParams(): URLSearchParams {
  const hash = window.location.hash;
  const queryIndex = hash.indexOf("?");
  if (queryIndex === -1) return new URLSearchParams();
  return new URLSearchParams(hash.slice(queryIndex + 1));
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border pb-5 mb-5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.15em] text-foreground">
          {title}
        </span>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>
      {open && children}
    </div>
  );
}

export function ProductsPage() {
  const [hashParams, setHashParams] = useState(() => getHashSearchParams());

  useEffect(() => {
    const handler = () => setHashParams(getHashSearchParams());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const categoryParam = hashParams.get("category") || "";
  const searchParam = hashParams.get("search") || "";

  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedMetals, setSelectedMetals] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState("All");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleMetal = (metal: string) =>
    setSelectedMetals((prev) =>
      prev.includes(metal) ? prev.filter((m) => m !== metal) : [...prev, metal],
    );

  const toggleOccasion = (occ: string) =>
    setSelectedOccasions((prev) =>
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ],
    );

  const filteredProducts = useMemo<MockProduct[]>(() => {
    let results = [...MOCK_PRODUCTS];

    // Category filter
    if (categoryParam) {
      const normalized = categoryParam.replace(/-/g, " ").toLowerCase();
      results = results.filter(
        (p) =>
          p.category.toLowerCase().includes(normalized) ||
          normalized.includes(p.category.toLowerCase()),
      );
    }

    // Search filter
    if (searchParam) {
      const q = searchParam.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    // Price filter
    results = results.filter(
      (p) => p.price / 100 >= priceRange[0] && p.price / 100 <= priceRange[1],
    );

    // Metal filter
    if (selectedMetals.length > 0) {
      results = results.filter((p) =>
        selectedMetals.some((m) =>
          p.metal.toLowerCase().includes(m.toLowerCase()),
        ),
      );
    }

    // Stock filter
    if (inStockOnly) {
      results = results.filter((p) => p.stock > 0);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        results = [...results].sort((a, b) => b.id - a.id);
        break;
      case "price-asc":
        results = [...results].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results = [...results].sort((a, b) => b.price - a.price);
        break;
      default: // popularity
        results = [...results].sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return results;
  }, [
    categoryParam,
    searchParam,
    priceRange,
    selectedMetals,
    inStockOnly,
    sortBy,
  ]);

  const clearFilters = () => {
    setPriceRange([0, 100000]);
    setSelectedMetals([]);
    setSelectedOccasions([]);
    setSelectedGender("All");
    setInStockOnly(false);
  };

  const hasFilters =
    selectedMetals.length > 0 ||
    selectedOccasions.length > 0 ||
    selectedGender !== "All" ||
    inStockOnly ||
    priceRange[0] > 0 ||
    priceRange[1] < 100000;

  const pageTitle = categoryParam
    ? categoryParam.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : searchParam
      ? `Search: "${searchParam}"`
      : "All Collections";

  const SidebarContent = () => (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-sans text-[11px] uppercase tracking-[0.2em] font-semibold text-foreground">
          Filter
        </h2>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-[10px] font-sans text-gold hover:text-gold-dark flex items-center gap-1 uppercase tracking-wider"
          >
            <X className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <Slider
          value={priceRange}
          min={0}
          max={100000}
          step={500}
          onValueChange={setPriceRange}
          className="mt-4 mb-3"
        />
        <div className="flex items-center justify-between text-xs font-sans text-muted-foreground">
          <span>{formatPrice(priceRange[0] * 100)}</span>
          <span>{formatPrice(priceRange[1] * 100)}</span>
        </div>
      </FilterSection>

      {/* Metal Type */}
      <FilterSection title="Metal Type">
        <div className="space-y-2">
          {METAL_TYPES.map((metal) => (
            <label
              key={metal}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedMetals.includes(metal)}
                onChange={() => toggleMetal(metal)}
                className="w-3.5 h-3.5 border-border accent-gold"
              />
              <span className="text-sm font-sans text-foreground/80 group-hover:text-gold transition-colors">
                {metal}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Occasion */}
      <FilterSection title="Occasion">
        <div className="space-y-2">
          {OCCASIONS.map((occ) => (
            <label
              key={occ}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedOccasions.includes(occ)}
                onChange={() => toggleOccasion(occ)}
                className="w-3.5 h-3.5 border-border accent-gold"
              />
              <span className="text-sm font-sans text-foreground/80 group-hover:text-gold transition-colors">
                {occ}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Gender */}
      <FilterSection title="Gender">
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <button
              type="button"
              key={g}
              onClick={() => setSelectedGender(g)}
              className={`px-3 py-1 text-[11px] font-sans uppercase tracking-wider border transition-colors ${
                selectedGender === g
                  ? "bg-gold text-ink border-gold"
                  : "bg-transparent text-foreground/70 border-border hover:border-gold hover:text-gold"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-3.5 h-3.5 accent-gold"
          />
          <span className="text-sm font-sans text-foreground/80">
            In Stock Only
          </span>
        </label>
      </FilterSection>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground mb-6">
          <a href="#/" className="hover:text-gold transition-colors">
            Home
          </a>
          <span className="mx-2 text-gold">·</span>
          <span>{pageTitle}</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="luxury-heading text-2xl sm:text-3xl">{pageTitle}</h1>
            <p className="text-muted-foreground text-sm font-sans mt-1">
              {filteredProducts.length} pieces
            </p>
          </div>

          {/* Sort + mobile filter toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex items-center gap-2 text-[11px] font-sans uppercase tracking-wider border border-border px-3 py-2 hover:border-gold hover:text-gold transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-[11px] font-sans uppercase tracking-wider border border-border bg-background text-foreground px-3 py-2 outline-none hover:border-gold focus:border-gold transition-colors cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <SidebarContent />
          </div>

          {/* Mobile sidebar drawer */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                aria-label="Close filters"
                className="absolute inset-0 bg-ink/60 cursor-default border-0 p-0"
                onClick={() => setSidebarOpen(false)}
                onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
              />
              <div className="absolute right-0 top-0 h-full w-72 bg-background overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-sans text-sm uppercase tracking-wider font-semibold">
                    Filters
                  </h2>
                  <button type="button" onClick={() => setSidebarOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <SidebarContent />
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-serif text-2xl text-muted-foreground mb-4">
                  No pieces found
                </p>
                <p className="text-muted-foreground text-sm font-sans mb-6">
                  Try adjusting your filters
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn-gold-outline text-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
