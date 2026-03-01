import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  ChevronDown,
  Loader2,
  Package,
  Pencil,
  Plus,
  ShoppingCart,
  Tag,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Coupon, Order, Product } from "../backend";
import { DiscountType, OrderStatus, PaymentStatus } from "../backend";
import { formatBigIntPrice } from "../data/products";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type AdminTab = "products" | "orders" | "coupons";

// ─── Product Form ────────────────────────────────────────────────────────────
const EMPTY_PRODUCT: Omit<Product, "id" | "createdAt"> = {
  name: "",
  description: "",
  price: BigInt(0),
  imageUrl: "",
  stock: BigInt(0),
  isFeatured: false,
  isNewArrival: false,
  isBestSeller: false,
};

function ProductsTab() {
  const { actor } = useActor();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["admin-products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor,
  });

  const upsertMutation = useMutation({
    mutationFn: async (p: Product) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.upsertProduct(p);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      setShowForm(false);
      setEditProduct(null);
      setForm(EMPTY_PRODUCT);
      toast.success("Product saved");
    },
    onError: () => toast.error("Failed to save product"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      stock: p.stock,
      isFeatured: p.isFeatured,
      isNewArrival: p.isNewArrival,
      isBestSeller: p.isBestSeller,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: editProduct?.id ?? BigInt(0),
      createdAt: editProduct?.createdAt ?? BigInt(Date.now() * 1_000_000),
      ...form,
    };
    upsertMutation.mutate(product);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl">Products</h2>
        <button
          type="button"
          onClick={() => {
            setEditProduct(null);
            setForm(EMPTY_PRODUCT);
            setShowForm(true);
          }}
          className="btn-gold flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Product
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="luxury-card p-6 mb-6">
          <h3 className="font-serif text-lg mb-4">
            {editProduct ? "Edit Product" : "Add New Product"}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="sm:col-span-2">
              <label htmlFor="prod-name" className="admin-label">
                Name \*
              </label>
              <input
                required
                id="prod-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="admin-input w-full"
                placeholder="Solitaire Diamond Ring"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="prod-desc" className="admin-label">
                Description \*
              </label>
              <textarea
                required
                id="prod-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                className="admin-input w-full resize-none"
                placeholder="Product description..."
              />
            </div>
            <div>
              <label htmlFor="prod-price" className="admin-label">
                Price \(in paise\) \*
              </label>
              <input
                required
                type="number"
                id="prod-price"
                value={form.price.toString()}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    price: BigInt(e.target.value || "0"),
                  }))
                }
                className="admin-input w-full"
                placeholder="999900 = ₹9,999"
              />
            </div>
            <div>
              <label htmlFor="prod-stock" className="admin-label">
                Stock \*
              </label>
              <input
                required
                type="number"
                id="prod-stock"
                value={form.stock.toString()}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    stock: BigInt(e.target.value || "0"),
                  }))
                }
                className="admin-input w-full"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="prod-imageUrl" className="admin-label">
                Image URL
              </label>
              <input
                id="prod-image"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                className="admin-input w-full"
                placeholder="/assets/generated/product-ring.dim_600x600.jpg"
              />
            </div>
            <div className="sm:col-span-2 flex gap-6">
              {(["isFeatured", "isNewArrival", "isBestSeller"] as const).map(
                (key) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [key]: e.target.checked }))
                      }
                      className="w-4 h-4 accent-gold"
                    />
                    <span className="text-sm font-sans text-foreground/80 capitalize">
                      {key
                        .replace("is", "")
                        .replace(/([A-Z])/g, " $1")
                        .trim()}
                    </span>
                  </label>
                ),
              )}
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={upsertMutation.isPending}
                className="btn-gold flex items-center gap-2"
              >
                {upsertMutation.isPending && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                {editProduct ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-gold-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      ) : (
        <div className="luxury-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Price
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Stock
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Tags
                  </th>
                  <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => (
                  <tr
                    key={p.id.toString()}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-gold">
                      {formatBigIntPrice(p.price)}
                    </td>
                    <td className="px-4 py-3">{p.stock.toString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {p.isFeatured && (
                          <span className="text-[9px] bg-gold/20 text-gold px-1.5 py-0.5">
                            Featured
                          </span>
                        )}
                        {p.isNewArrival && (
                          <span className="text-[9px] bg-burgundy/20 text-burgundy px-1.5 py-0.5">
                            New
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5">
                            Bestseller
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
                          className="p-1.5 text-muted-foreground hover:text-gold transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Delete this product?"))
                              deleteMutation.mutate(p.id);
                          }}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-12 text-muted-foreground"
                    >
                      No products yet. Add your first product.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Orders Tab ──────────────────────────────────────────────────────────────
function OrdersTab() {
  const { actor } = useActor();
  const qc = useQueryClient();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserOrders();
    },
    enabled: !!actor,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateOrderStatus(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const STATUS_COLORS: Record<OrderStatus, string> = {
    [OrderStatus.pending]: "bg-yellow-100 text-yellow-700",
    [OrderStatus.processing]: "bg-blue-100 text-blue-700",
    [OrderStatus.shipped]: "bg-purple-100 text-purple-700",
    [OrderStatus.delivered]: "bg-green-100 text-green-700",
    [OrderStatus.cancelled]: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <h2 className="font-serif text-xl mb-6">Orders</h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      ) : (
        <div className="luxury-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Order ID
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Amount
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Payment
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((o) => (
                  <tr
                    key={o.id.toString()}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs">
                      {o.id.toString()}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatBigIntPrice(o.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 font-semibold uppercase ${
                          o.paymentStatus === PaymentStatus.paid
                            ? "bg-green-100 text-green-700"
                            : o.paymentStatus === PaymentStatus.failed
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        onChange={(e) =>
                          updateStatusMutation.mutate({
                            id: o.id,
                            status: e.target.value as OrderStatus,
                          })
                        }
                        className={`text-[10px] px-2 py-0.5 font-semibold uppercase cursor-pointer border-0 outline-none ${STATUS_COLORS[o.status]}`}
                      >
                        {Object.values(OrderStatus).map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(
                        Number(o.createdAt) / 1_000_000,
                      ).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-12 text-muted-foreground"
                    >
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Coupons Tab ─────────────────────────────────────────────────────────────
function CouponsTab() {
  const { actor } = useActor();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discountType: DiscountType.percentage,
    discountValue: "",
    minOrderValue: "",
    isActive: true,
  });

  const { data: coupons = [], isLoading } = useQuery<Coupon[]>({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCoupons();
    },
    enabled: !!actor,
  });

  const upsertMutation = useMutation({
    mutationFn: async (c: Coupon) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.upsertCoupon(c);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
      setShowForm(false);
      setForm({
        code: "",
        discountType: DiscountType.percentage,
        discountValue: "",
        minOrderValue: "",
        isActive: true,
      });
      toast.success("Coupon saved");
    },
    onError: () => toast.error("Failed to save coupon"),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({
      code,
      isActive,
    }: { code: string; isActive: boolean }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateCouponStatus(code, isActive);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-coupons"] }),
  });

  const removeMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.removeCoupon(code);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon removed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const coupon: Coupon = {
      code: form.code.toUpperCase(),
      discountType: form.discountType,
      discountValue: BigInt(form.discountValue || "0"),
      minOrderValue: form.minOrderValue
        ? BigInt(form.minOrderValue)
        : undefined,
      isActive: form.isActive,
      expiresAt: undefined,
    };
    upsertMutation.mutate(coupon);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl">Coupons</h2>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="btn-gold flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Coupon
        </button>
      </div>

      {showForm && (
        <div className="luxury-card p-6 mb-6">
          <h3 className="font-serif text-lg mb-4">New Coupon</h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label htmlFor="coupon-code" className="admin-label">
                Coupon Code \*
              </label>
              <input
                required
                id="coupon-code-input"
                value={form.code}
                onChange={(e) =>
                  setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                }
                className="admin-input w-full uppercase"
                placeholder="SAVE20"
              />
            </div>
            <div>
              <label htmlFor="coupon-type" className="admin-label">
                Discount Type
              </label>
              <select
                id="coupon-type-input"
                value={form.discountType}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    discountType: e.target.value as DiscountType,
                  }))
                }
                className="admin-input w-full"
              >
                <option value={DiscountType.percentage}>Percentage (%)</option>
                <option value={DiscountType.fixed}>Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label htmlFor="coupon-value" className="admin-label">
                Discount Value \*
              </label>
              <input
                required
                type="number"
                id="coupon-value-input"
                value={form.discountValue}
                onChange={(e) =>
                  setForm((f) => ({ ...f, discountValue: e.target.value }))
                }
                className="admin-input w-full"
                placeholder={
                  form.discountType === DiscountType.percentage
                    ? "20 = 20%"
                    : "5000 = ₹50"
                }
              />
            </div>
            <div>
              <label htmlFor="coupon-min" className="admin-label">
                Min Order Value \(paise\)
              </label>
              <input
                type="number"
                id="coupon-min-input"
                value={form.minOrderValue}
                onChange={(e) =>
                  setForm((f) => ({ ...f, minOrderValue: e.target.value }))
                }
                className="admin-input w-full"
                placeholder="Optional"
              />
            </div>
            <div className="sm:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isActive: e.target.checked }))
                }
                className="w-4 h-4 accent-gold"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-sans cursor-pointer"
              >
                Active
              </label>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={upsertMutation.isPending}
                className="btn-gold flex items-center gap-2"
              >
                {upsertMutation.isPending && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-gold-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      ) : (
        <div className="luxury-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Code
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Value
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {coupons.map((c) => (
                  <tr
                    key={c.code}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-semibold">
                      {c.code}
                    </td>
                    <td className="px-4 py-3 capitalize">{c.discountType}</td>
                    <td className="px-4 py-3 text-gold font-medium">
                      {c.discountType === DiscountType.percentage
                        ? `${c.discountValue}%`
                        : formatBigIntPrice(c.discountValue)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          toggleMutation.mutate({
                            code: c.code,
                            isActive: !c.isActive,
                          })
                        }
                        className={`flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 ${
                          c.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {c.isActive ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {c.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete coupon "${c.code}"?`))
                            removeMutation.mutate(c.code);
                        }}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-12 text-muted-foreground"
                    >
                      No coupons yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Admin Page ──────────────────────────────────────────────────────────────
export function AdminPage() {
  const { actor, isFetching } = useActor();
  const { identity, login } = useInternetIdentity();
  const [tab, setTab] = useState<AdminTab>("products");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .isCallerAdmin()
      .then((result) => setIsAdmin(result))
      .catch(() => setIsAdmin(false));
  }, [actor, isFetching]);

  if (!identity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-24 px-4">
        <div className="text-center luxury-card p-10 max-w-sm">
          <h2 className="font-serif text-2xl mb-3">Admin Access</h2>
          <p className="text-muted-foreground text-sm font-sans mb-6">
            Please login to access the admin dashboard.
          </p>
          <button type="button" onClick={login} className="btn-gold w-full">
            Login
          </button>
        </div>
      </div>
    );
  }

  if (isFetching || isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-24">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-24 px-4">
        <div className="text-center luxury-card p-10 max-w-sm">
          <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="font-serif text-2xl mb-3">Access Denied</h2>
          <p className="text-muted-foreground text-sm font-sans mb-6">
            You don't have admin privileges.
          </p>
          <a href="#/" className="btn-gold-outline inline-block">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "products" as AdminTab, label: "Products", icon: Package },
    { id: "orders" as AdminTab, label: "Orders", icon: ShoppingCart },
    { id: "coupons" as AdminTab, label: "Coupons", icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="whisper-text mb-1">Management</p>
            <h1 className="luxury-heading text-3xl">Admin Dashboard</h1>
          </div>
          <a
            href="#/"
            className="text-[11px] font-sans uppercase tracking-wider text-muted-foreground hover:text-gold transition-colors"
          >
            ← Back to Store
          </a>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-3 text-[12px] font-sans uppercase tracking-wider border-b-2 transition-colors ${
                tab === id
                  ? "border-gold text-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "products" && <ProductsTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "coupons" && <CouponsTab />}
      </div>
    </div>
  );
}
