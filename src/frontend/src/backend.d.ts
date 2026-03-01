import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Coupon {
    discountValue: bigint;
    expiresAt?: bigint;
    code: string;
    discountType: DiscountType;
    minOrderValue?: bigint;
    isActive: boolean;
}
export interface OrderItem {
    productId: bigint;
    quantity: bigint;
    price: bigint;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    userId: Principal;
    createdAt: bigint;
    totalAmount: bigint;
    stripePaymentIntentId?: string;
    items: Array<OrderItem>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export interface Review {
    userId: Principal;
    createdAt: bigint;
    productId: bigint;
    comment: string;
    rating: bigint;
}
export interface Product {
    id: bigint;
    name: string;
    createdAt: bigint;
    isNewArrival: boolean;
    description: string;
    stock: bigint;
    imageUrl: string;
    isFeatured: boolean;
    price: bigint;
    isBestSeller: boolean;
}
export enum DiscountType {
    fixed = "fixed",
    percentage = "percentage"
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    processing = "processing"
}
export enum PaymentStatus {
    pending = "pending",
    paid = "paid",
    failed = "failed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addReview(productId: bigint, rating: bigint, comment: string): Promise<void>;
    addToCart(productId: bigint, quantity: bigint): Promise<void>;
    applyCoupon(code: string, totalAmount: bigint): Promise<[bigint, bigint]>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createOrder(paymentIntentId: string | null): Promise<bigint>;
    deleteProduct(productId: bigint): Promise<void>;
    getActiveCoupons(): Promise<Array<Coupon>>;
    getAllCoupons(): Promise<Array<Coupon>>;
    getAllProducts(): Promise<Array<Product>>;
    getBestSellers(): Promise<Array<Product>>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getCouponByCode(code: string): Promise<Coupon>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getNewArrivals(): Promise<Array<Product>>;
    getOrderById(orderId: bigint): Promise<Order>;
    getProductById(id: bigint): Promise<Product>;
    getProductsByPriceRange(minPrice: bigint, maxPrice: bigint): Promise<Array<Product>>;
    getReviewsForProduct(productId: bigint): Promise<Array<Review>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserOrders(): Promise<Array<Order>>;
    isCallerAdmin(): Promise<boolean>;
    isProductInStock(productId: bigint): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    removeCoupon(code: string): Promise<void>;
    removeFromCart(productId: bigint): Promise<void>;
    searchProducts(searchText: string): Promise<Array<Product>>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCouponStatus(code: string, isActive: boolean): Promise<void>;
    updateOrderPaymentStatus(orderId: bigint, newPaymentStatus: PaymentStatus): Promise<PaymentStatus>;
    updateOrderStatus(orderId: bigint, newStatus: OrderStatus): Promise<OrderStatus>;
    upsertCoupon(coupon: Coupon): Promise<string>;
    upsertProduct(product: Product): Promise<bigint>;
}
