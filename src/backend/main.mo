import Principal "mo:core/Principal";
import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat8 "mo:core/Nat8";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Stripe "stripe/stripe";

actor {
  // Types
  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    stock : Nat;
    imageUrl : Text;
    isFeatured : Bool;
    isNewArrival : Bool;
    isBestSeller : Bool;
    createdAt : Int;
  };

  module Product {
    public func compareByPrice(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.price, product2.price);
    };

    public func compareByCreationDate(product1 : Product, product2 : Product) : Order.Order {
      Int.compare(product2.createdAt, product1.createdAt);
    };
  };

  public type Order = {
    id : Nat;
    userId : Principal;
    items : [OrderItem];
    totalAmount : Nat;
    createdAt : Int;
    status : OrderStatus;
    paymentStatus : PaymentStatus;
    stripePaymentIntentId : ?Text;
  };

  public type OrderItem = {
    productId : Nat;
    quantity : Int;
    price : Nat;
  };

  public type OrderStatus = {
    #pending;
    #processing;
    #shipped;
    #delivered;
    #cancelled;
  };

  public type PaymentStatus = {
    #pending;
    #paid;
    #failed;
  };

  public type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  public type Review = {
    productId : Nat;
    userId : Principal;
    rating : Nat;
    comment : Text;
    createdAt : Int;
  };

  public type Coupon = {
    code : Text;
    discountType : DiscountType;
    discountValue : Nat;
    minOrderValue : ?Nat;
    isActive : Bool;
    expiresAt : ?Int;
  };

  public type DiscountType = { #percentage; #fixed };

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Persistent state
  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  let cart = Map.empty<Principal, List.List<CartItem>>();
  let reviews = Map.empty<Nat, List.List<Review>>();
  let coupons = Map.empty<Text, Coupon>();

  var nextProductId = 1;
  var nextOrderId = 1;

  var stripeConfig : ?Stripe.StripeConfiguration = null;

  // Public functions
  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getProductById(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query func getFeaturedProducts() : async [Product] {
    products.values().filter(func(p) { p.isFeatured }).toArray();
  };

  public query func getNewArrivals() : async [Product] {
    products.values().filter(func(p) { p.isNewArrival }).toArray();
  };

  public query func getBestSellers() : async [Product] {
    products.values().filter(func(p) { p.isBestSeller }).toArray();
  };

  public query func searchProducts(searchText : Text) : async [Product] {
    products.values().filter(func(p) { p.name.contains(#text searchText) or p.description.contains(#text searchText) }).toArray();
  };

  public query func getProductsByPriceRange(minPrice : Nat, maxPrice : Nat) : async [Product] {
    products.values().filter(func(p) { p.price >= minPrice and p.price <= maxPrice }).toArray();
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };
    switch (cart.get(caller)) {
      case (null) { [] };
      case (?items) { items.toArray() };
    };
  };

  public query func getReviewsForProduct(productId : Nat) : async [Review] {
    switch (reviews.get(productId)) {
      case (null) { [] };
      case (?productReviews) { productReviews.toArray() };
    };
  };

  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };
    if (quantity == 0) { Runtime.trap("Quantity must be at least 1") };

    let product = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };

    let cartItems = switch (cart.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?items) { items };
    };

    var currentQuantity = 0;
    let filteredItems = List.empty<CartItem>();

    for (item in cartItems.values()) {
      if (item.productId == productId) {
        currentQuantity := item.quantity;
      } else {
        filteredItems.add(item);
      };
    };

    if (currentQuantity + quantity > product.stock) {
      Runtime.trap("Not enough stock available");
    };

    let newItems = filteredItems;
    newItems.add({
      productId;
      quantity = currentQuantity + quantity;
    });

    cart.add(caller, newItems);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from cart");
    };
    switch (cart.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?items) {
        let newItems = List.empty<CartItem>();
        for (item in items.values()) {
          if (item.productId != productId) {
            newItems.add(item);
          };
        };
        cart.add(caller, newItems);
      };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };
    cart.remove(caller);
  };

  public shared ({ caller }) func addReview(productId : Nat, rating : Nat, comment : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add reviews");
    };
    let newReview : Review = {
      productId;
      userId = caller;
      rating = if (rating >= 5) { 5 } else if (rating <= 1) { 1 } else { rating };
      comment;
      createdAt = Time.now();
    };

    switch (reviews.get(productId)) {
      case (null) {
        let newList = List.empty<Review>();
        newList.add(newReview);
        reviews.add(productId, newList);
      };
      case (?productReviews) {
        productReviews.add(newReview);
      };
    };
  };

  public shared ({ caller }) func createOrder(paymentIntentId : ?Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };
    let cartItems = switch (cart.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?items) { items };
    };

    let mapped = cartItems.map<CartItem, CartItem>(func(item) { item });

    let orderTotal = mapped.values().foldLeft(
      0,
      func(acc, item) {
        let product = switch (products.get(item.productId)) {
          case (null) { Runtime.trap("Product not found") };
          case (?p) { p };
        };
        acc + (product.price * (item.quantity : Nat));
      },
    );

    let newOrder : Order = {
      id = nextOrderId;
      userId = caller;
      items = cartItems.toArray().map(func(item) { { productId = item.productId; quantity = item.quantity; price = 0 } });
      totalAmount = orderTotal;
      createdAt = Time.now();
      status = #pending;
      paymentStatus = #pending;
      stripePaymentIntentId = paymentIntentId;
    };

    orders.add(nextOrderId, newOrder);

    // Update product stock
    for (cartItem in cartItems.values()) {
      let product = switch (products.get(cartItem.productId)) {
        case (null) { Runtime.trap("Product not found") };
        case (?p) { p };
      };

      if (cartItem.quantity >= product.stock) {
        Runtime.trap("Not enough stock available");
      };

      let updatedProduct = {
        id = product.id;
        name = product.name;
        description = product.description;
        price = product.price;
        stock = product.stock - cartItem.quantity;
        imageUrl = product.imageUrl;
        isFeatured = product.isFeatured;
        isNewArrival = product.isNewArrival;
        isBestSeller = product.isBestSeller;
        createdAt = product.createdAt;
      };

      products.add(cartItem.productId, updatedProduct);
    };

    // Clear user's cart
    cart.remove(caller);

    nextOrderId += 1;
    newOrder.id;
  };

  public query ({ caller }) func getUserOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    orders.values().filter(func(o) { o.userId == caller }).toArray();
  };

  public shared ({ caller }) func applyCoupon(code : Text, totalAmount : Nat) : async (Nat, Nat) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can apply coupons");
    };
    switch (coupons.get(code)) {
      case (null) { Runtime.trap("Coupon not found") };
      case (?coupon) {
        if (not coupon.isActive) {
          Runtime.trap("Coupon is not active");
        };

        let now = Time.now();
        switch (coupon.expiresAt) {
          case (?expiresAt) {
            if (now > expiresAt) {
              Runtime.trap("Coupon has expired");
            };
          };
          case (null) {};
        };

        switch (coupon.minOrderValue) {
          case (?minValue) {
            if (totalAmount < minValue) {
              Runtime.trap("Order does not meet minimum value for coupon");
            };
          };
          case (null) {};
        };

        let discountAmount = switch (coupon.discountType) {
          case (#percentage) {
            totalAmount * coupon.discountValue / 100;
          };
          case (#fixed) { coupon.discountValue };
        };

        let finalAmount = totalAmount - discountAmount;
        (finalAmount, discountAmount);
      };
    };
  };

  public query ({ caller }) func isStripeConfigured() : async Bool {
    switch (stripeConfig) {
      case (null) { false };
      case (?_) { true };
    };
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe not configured") };
      case (?config) {
        config;
      };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public query ({ caller }) func getOrderById(orderId : Nat) : async Order {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin)) and order.userId != caller) {
          Runtime.trap("Unauthorized: Cannot view this order");
        };
        order;
      };
    };
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, newStatus : OrderStatus) : async OrderStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = {
          id = order.id;
          userId = order.userId;
          items = order.items;
          totalAmount = order.totalAmount;
          createdAt = order.createdAt;
          status = newStatus;
          paymentStatus = order.paymentStatus;
          stripePaymentIntentId = order.stripePaymentIntentId;
        };
        orders.add(orderId, updatedOrder);
        newStatus;
      };
    };
  };

  public shared ({ caller }) func updateOrderPaymentStatus(orderId : Nat, newPaymentStatus : PaymentStatus) : async PaymentStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update payment status");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = {
          id = order.id;
          userId = order.userId;
          items = order.items;
          totalAmount = order.totalAmount;
          createdAt = order.createdAt;
          status = order.status;
          paymentStatus = newPaymentStatus;
          stripePaymentIntentId = order.stripePaymentIntentId;
        };
        orders.add(orderId, updatedOrder);
        newPaymentStatus;
      };
    };
  };

  public shared ({ caller }) func upsertProduct(product : Product) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let id = if (product.id == 0) {
      let newId = nextProductId;
      nextProductId += 1;
      newId;
    } else {
      product.id;
    };

    let newProduct : Product = {
      id;
      name = product.name;
      description = product.description;
      price = product.price;
      stock = product.stock;
      imageUrl = product.imageUrl;
      isFeatured = product.isFeatured;
      isNewArrival = product.isNewArrival;
      isBestSeller = product.isBestSeller;
      createdAt = Time.now();
    };

    products.add(id, newProduct);
    id;
  };

  public shared ({ caller }) func deleteProduct(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not products.containsKey(productId)) {
      Runtime.trap("Product not found");
    };
    products.remove(productId);
  };

  public shared ({ caller }) func upsertCoupon(coupon : Coupon) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    coupons.add(coupon.code, coupon);
    coupon.code;
  };

  public query ({ caller }) func getCouponByCode(code : Text) : async Coupon {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view coupons");
    };
    switch (coupons.get(code)) {
      case (null) { Runtime.trap("Coupon not found") };
      case (?coupon) { coupon };
    };
  };

  public shared ({ caller }) func removeCoupon(code : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove coupons");
    };
    switch (coupons.get(code)) {
      case (null) { Runtime.trap("Coupon not found") };
      case (?_) { coupons.remove(code) };
    };
  };

  public shared ({ caller }) func updateCouponStatus(code : Text, isActive : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update coupon status");
    };
    switch (coupons.get(code)) {
      case (null) { Runtime.trap("Coupon not found") };
      case (?coupon) {
        let updatedCoupon = {
          code = coupon.code;
          discountType = coupon.discountType;
          discountValue = coupon.discountValue;
          minOrderValue = coupon.minOrderValue;
          isActive;
          expiresAt = coupon.expiresAt;
        };
        coupons.add(code, updatedCoupon);
      };
    };
  };

  public query ({ caller }) func getActiveCoupons() : async [Coupon] {
    coupons.values().filter(func(coupon) { coupon.isActive }).toArray();
  };

  public query ({ caller }) func getAllCoupons() : async [Coupon] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all coupons");
    };
    coupons.values().toArray();
  };

  public query ({ caller }) func isProductInStock(productId : Nat) : async Bool {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        product.stock > 0;
      };
    };
  };
};
