# Ved Jewellers

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full luxury jewellery e-commerce website for brand "Ved Jewellers"
- Tagline: "Timeless Elegance. Pure Craft."
- Brand colors: Matte Gold (#C8A951), Deep Burgundy (#4A0F1E), Ivory White (#FAF7F2)

**Frontend Pages:**
1. Homepage with:
   - Sticky transparent header (turns solid on scroll) with mega menu
   - Mega menu categories: Rings, Earrings, Necklaces, Bracelets, Mangalsutra, Wedding Collection, Gifting Collection
   - Full-screen hero banner with cinematic jewellery photography
   - Premium collection sections with large image banners
   - Best Sellers carousel
   - New Arrivals section
   - Wedding Collection highlight
   - Trust badges (Certified, Hallmark, Secure Payments, Easy Returns)
   - Testimonials section
   - Newsletter subscription section
   - Luxury styled footer
2. Product Listing Page (PLP) with filters:
   - Price range slider
   - Metal type (925 Silver, Gold Plated, Rose Gold, Diamond)
   - Occasion, Gender, Style, Color, Availability filters
   - Sort by: Popularity, Newest, Price
3. Product Detail Page (PDP):
   - Large image gallery with zoom
   - Variant selector (size, metal, color)
   - Add to Cart + Wishlist
   - Product details accordion
   - Shipping & return policy section
   - Reviews section
   - Related products slider
4. Cart page with coupon system
5. Checkout page with Stripe integration
6. Order confirmation page
7. Wishlist page
8. Admin dashboard:
   - Product management (add/edit/delete)
   - Order management
   - Coupon management

**Backend:**
- Product catalog with categories, variants, pricing
- Cart and order management
- Wishlist system
- Coupon/discount codes
- User authentication (admin vs customer)
- Stripe payment integration
- Product reviews

### Modify
- None (new project)

### Remove
- None (new project)

## Implementation Plan
1. Select components: authorization, stripe
2. Generate Motoko backend with: products, categories, cart, orders, wishlist, coupons, reviews
3. Build React frontend with luxury design system matching brand identity
4. Wire Stripe payments and authorization
5. Add sample product data for jewellery categories
6. Deploy
