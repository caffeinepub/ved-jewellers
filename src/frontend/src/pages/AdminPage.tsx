import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  BarChart3,
  ChevronDown,
  Crown,
  Edit2,
  Loader2,
  Package,
  PackagePlus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Coupon, Order, Product } from "../backend";
import { DiscountType, OrderStatus } from "../backend";
import { MOCK_PRODUCTS, formatBigIntPrice } from "../data/products";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

// ─── Types ────────────────────────────────────────────────────────────────────
type AdminTab = "dashboard" | "products" | "orders" | "coupons";

const EMPTY_PRODUCT = {
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  isFeatured: false,
  isNewArrival: false,
  isBestSeller: false,
};

const EMPTY_COUPON = {
  code: "",
  discountType: DiscountType.percentage,
  discountValue: "",
  minOrderValue: "",
  isActive: true,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function orderStatusColor(status: OrderStatus) {
  switch (status) {
    case OrderStatus.delivered:
      return "bg-emerald-900/40 text-emerald-300 border-emerald-700";
    case OrderStatus.shipped:
      return "bg-blue-900/40 text-blue-300 border-blue-700";
    case OrderStatus.processing:
      return "bg-amber-900/40 text-amber-300 border-amber-700";
    case OrderStatus.cancelled:
      return "bg-red-900/40 text-red-300 border-red-700";
    default:
      return "bg-zinc-800 text-zinc-400 border-zinc-600";
  }
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
function DashboardTab() {
  const { actor, isFetching } = useActor();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["admin-products"],
    queryFn: async () => (actor ? actor.getAllProducts() : []),
    enabled: !!actor && !isFetching,
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => (actor ? actor.getUserOrders() : []),
    enabled: !!actor && !isFetching,
  });

  const { data: coupons = [] } = useQuery<Coupon[]>({
    queryKey: ["admin-coupons"],
    queryFn: async () => (actor ? actor.getAllCoupons() : []),
    enabled: !!actor && !isFetching,
  });

  const totalRevenue = orders
    .filter((o) => o.status === OrderStatus.delivered)
    .reduce((acc, o) => acc + Number(o.totalAmount), 0);

  const activeCoupons = coupons.filter((c) => c.isActive).length;

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      sub: "In catalogue",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      sub: "All time",
    },
    {
      label: "Total Revenue",
      value: formatBigIntPrice(BigInt(Math.round(totalRevenue))),
      icon: TrendingUp,
      sub: "From delivered orders",
    },
    {
      label: "Active Coupons",
      value: activeCoupons,
      icon: Tag,
      sub: "Currently active",
    },
  ];

  return (
    <div data-ocid="dashboard.section">
      <h2 className="text-2xl font-serif text-foreground mb-6">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </CardTitle>
                <s.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {s.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="mt-10">
        <h3 className="text-lg font-serif text-foreground mb-4">
          Recent Orders
        </h3>
        {orders.length === 0 ? (
          <div
            data-ocid="dashboard.empty_state"
            className="text-muted-foreground text-sm py-8 text-center border border-dashed border-border rounded-lg"
          >
            No orders yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Order ID</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.slice(0, 5).map((order) => (
                <TableRow key={order.id.toString()} className="border-border">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    #{order.id.toString()}
                  </TableCell>
                  <TableCell>{order.items.length} item(s)</TableCell>
                  <TableCell>{formatBigIntPrice(order.totalAmount)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs border ${orderStatusColor(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

// ─── Products ────────────────────────────────────────────────────────────────
function ProductsTab() {
  const { actor, isFetching } = useActor();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["admin-products"],
    queryFn: async () => (actor ? actor.getAllProducts() : []),
    enabled: !!actor && !isFetching,
  });

  const upsertMutation = useMutation({
    mutationFn: async (p: Product) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.upsertProduct(p);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      setDialogOpen(false);
      setEditTarget(null);
      setForm(EMPTY_PRODUCT);
      toast.success("Product saved successfully");
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
      setDeleteConfirm(null);
      toast.success("Product deleted");
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const seedMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not authenticated");
      const seedProducts: Product[] = MOCK_PRODUCTS.map((mp) => ({
        id: BigInt(0),
        createdAt: BigInt(Date.now() * 1_000_000),
        name: mp.name,
        description: mp.description,
        price: BigInt(mp.price),
        stock: BigInt(mp.stock),
        imageUrl: mp.imageUrl,
        isFeatured: mp.isFeatured,
        isNewArrival: mp.isNewArrival,
        isBestSeller: mp.isBestSeller,
      }));
      for (const p of seedProducts) {
        await actor.upsertProduct(p);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("13 products seeded successfully!");
    },
    onError: () => toast.error("Seed failed"),
  });

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_PRODUCT);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditTarget(p);
    setForm({
      name: p.name,
      description: p.description,
      price: (Number(p.price) / 100).toString(),
      stock: p.stock.toString(),
      imageUrl: p.imageUrl,
      isFeatured: p.isFeatured,
      isNewArrival: p.isNewArrival,
      isBestSeller: p.isBestSeller,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceRupees = Number.parseFloat(form.price) || 0;
    const product: Product = {
      id: editTarget?.id ?? BigInt(0),
      createdAt: editTarget?.createdAt ?? BigInt(Date.now() * 1_000_000),
      name: form.name,
      description: form.description,
      price: BigInt(Math.round(priceRupees * 100)),
      stock: BigInt(Number.parseInt(form.stock) || 0),
      imageUrl: form.imageUrl,
      isFeatured: form.isFeatured,
      isNewArrival: form.isNewArrival,
      isBestSeller: form.isBestSeller,
    };
    upsertMutation.mutate(product);
  };

  return (
    <div data-ocid="products.section">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif text-foreground">Products</h2>
        <div className="flex gap-2">
          {products.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => seedMutation.mutate()}
              disabled={seedMutation.isPending}
              data-ocid="products.secondary_button"
            >
              {seedMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <PackagePlus className="h-4 w-4 mr-2" />
              )}
              Seed 13 Products
            </Button>
          )}
          <Button
            onClick={openAdd}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="products.open_modal_button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div data-ocid="products.loading_state" className="space-y-3">
          {["a", "b", "c", "d"].map((k) => (
            <Skeleton key={k} className="h-14 w-full" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div
          data-ocid="products.empty_state"
          className="text-center py-16 border border-dashed border-border rounded-lg"
        >
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            No products yet. Add your first product or seed the sample
            catalogue.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/30">
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p, idx) => (
                <TableRow
                  key={p.id.toString()}
                  data-ocid={`products.item.${idx + 1}`}
                  className="border-border hover:bg-muted/20 transition-colors"
                >
                  <TableCell>
                    <div className="w-10 h-10 rounded overflow-hidden bg-muted">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-5 h-5 m-2.5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {p.name}
                  </TableCell>
                  <TableCell className="text-primary font-semibold">
                    {formatBigIntPrice(p.price)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-sm font-medium ${
                        Number(p.stock) === 0
                          ? "text-destructive"
                          : Number(p.stock) < 5
                            ? "text-amber-400"
                            : "text-muted-foreground"
                      }`}
                    >
                      {p.stock.toString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {p.isFeatured && (
                        <Badge className="bg-primary/20 text-primary border-primary/40 text-xs">
                          Featured
                        </Badge>
                      )}
                      {p.isNewArrival && (
                        <Badge className="bg-emerald-900/40 text-emerald-300 border-emerald-700 text-xs">
                          New
                        </Badge>
                      )}
                      {p.isBestSeller && (
                        <Badge className="bg-amber-900/40 text-amber-300 border-amber-700 text-xs">
                          Best Seller
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(p)}
                        data-ocid={`products.edit_button.${idx + 1}`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteConfirm(p.id)}
                        data-ocid={`products.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto"
          data-ocid="products.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editTarget ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label htmlFor="pname">Product Name</Label>
              <Input
                id="pname"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Solitaire Diamond Ring"
                required
                data-ocid="products.input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pdesc">Description</Label>
              <Textarea
                id="pdesc"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Describe the jewellery piece..."
                rows={3}
                data-ocid="products.textarea"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="pprice">Price (₹)</Label>
                <Input
                  id="pprice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="e.g. 25000"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="pstock">Stock Qty</Label>
                <Input
                  id="pstock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, stock: e.target.value }))
                  }
                  placeholder="e.g. 10"
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="pimg">Image URL</Label>
              <Input
                id="pimg"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                placeholder="https://... or /assets/generated/..."
              />
              {form.imageUrl && (
                <div className="mt-2 w-24 h-24 rounded overflow-hidden border border-border">
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={form.isFeatured}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isFeatured: !!v }))
                  }
                  data-ocid="products.checkbox"
                />
                <span className="text-sm">Featured</span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={form.isNewArrival}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isNewArrival: !!v }))
                  }
                />
                <span className="text-sm">New Arrival</span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={form.isBestSeller}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isBestSeller: !!v }))
                  }
                />
                <span className="text-sm">Best Seller</span>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                data-ocid="products.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={upsertMutation.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="products.submit_button"
              >
                {upsertMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                {upsertMutation.isPending
                  ? "Saving..."
                  : editTarget
                    ? "Update Product"
                    : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog
        open={deleteConfirm !== null}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent
          className="max-w-sm bg-card border-border"
          data-ocid="products.modal"
        >
          <DialogHeader>
            <DialogTitle className="font-serif">Delete Product?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. The product will be permanently
            removed from the catalogue.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              data-ocid="products.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteConfirm !== null && deleteMutation.mutate(deleteConfirm)
              }
              disabled={deleteMutation.isPending}
              data-ocid="products.confirm_button"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Orders ──────────────────────────────────────────────────────────────────
function OrdersTab() {
  const { actor, isFetching } = useActor();
  const qc = useQueryClient();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => (actor ? actor.getUserOrders() : []),
    enabled: !!actor && !isFetching,
  });

  const statusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: bigint;
      status: OrderStatus;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateOrderStatus(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  return (
    <div data-ocid="orders.section">
      <h2 className="text-2xl font-serif text-foreground mb-6">Orders</h2>

      {isLoading ? (
        <div data-ocid="orders.loading_state" className="space-y-3">
          {["a", "b", "c", "d"].map((k) => (
            <Skeleton key={k} className="h-14 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div
          data-ocid="orders.empty_state"
          className="text-center py-16 border border-dashed border-border rounded-lg"
        >
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No orders yet.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/30">
                <TableHead>Order ID</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, idx) => (
                <TableRow
                  key={order.id.toString()}
                  data-ocid={`orders.item.${idx + 1}`}
                  className="border-border"
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    #{order.id.toString()}
                  </TableCell>
                  <TableCell>{order.items.length} item(s)</TableCell>
                  <TableCell className="font-semibold text-primary">
                    {formatBigIntPrice(order.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <span className="capitalize text-sm">
                      {order.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs border capitalize ${orderStatusColor(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          data-ocid={`orders.dropdown_menu.${idx + 1}`}
                        >
                          Update <ChevronDown className="ml-1 h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card border-border">
                        {Object.values(OrderStatus).map((s) => (
                          <DropdownMenuItem
                            key={s}
                            onClick={() =>
                              statusMutation.mutate({ id: order.id, status: s })
                            }
                            className="capitalize cursor-pointer"
                          >
                            {s}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Coupons ─────────────────────────────────────────────────────────────────
function CouponsTab() {
  const { actor, isFetching } = useActor();
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_COUPON);

  const { data: coupons = [], isLoading } = useQuery<Coupon[]>({
    queryKey: ["admin-coupons"],
    queryFn: async () => (actor ? actor.getAllCoupons() : []),
    enabled: !!actor && !isFetching,
  });

  const upsertMutation = useMutation({
    mutationFn: async (c: Coupon) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.upsertCoupon(c);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
      setAddOpen(false);
      setForm(EMPTY_COUPON);
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon status updated");
    },
    onError: () => toast.error("Failed to update coupon"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.removeCoupon(code);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon removed");
    },
    onError: () => toast.error("Failed to remove coupon"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const coupon: Coupon = {
      code: form.code.toUpperCase(),
      discountType: form.discountType,
      discountValue: BigInt(Number.parseInt(form.discountValue) || 0),
      minOrderValue: form.minOrderValue
        ? BigInt(Math.round(Number.parseFloat(form.minOrderValue) * 100))
        : undefined,
      expiresAt: undefined,
      isActive: form.isActive,
    };
    upsertMutation.mutate(coupon);
  };

  return (
    <div data-ocid="coupons.section">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif text-foreground">Coupons</h2>
        <Button
          onClick={() => setAddOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          data-ocid="coupons.open_modal_button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      {isLoading ? (
        <div data-ocid="coupons.loading_state" className="space-y-3">
          {["a", "b", "c"].map((k) => (
            <Skeleton key={k} className="h-14 w-full" />
          ))}
        </div>
      ) : coupons.length === 0 ? (
        <div
          data-ocid="coupons.empty_state"
          className="text-center py-16 border border-dashed border-border rounded-lg"
        >
          <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No coupons yet. Create your first discount code.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/30">
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((c, idx) => (
                <TableRow
                  key={c.code}
                  data-ocid={`coupons.item.${idx + 1}`}
                  className="border-border"
                >
                  <TableCell className="font-mono font-bold text-primary">
                    {c.code}
                  </TableCell>
                  <TableCell>
                    {c.discountType === DiscountType.percentage
                      ? `${c.discountValue}% off`
                      : `₹${c.discountValue} off`}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.minOrderValue ? formatBigIntPrice(c.minOrderValue) : "—"}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() =>
                        toggleMutation.mutate({
                          code: c.code,
                          isActive: !c.isActive,
                        })
                      }
                      data-ocid={`coupons.toggle.${idx + 1}`}
                      className={`px-2 py-0.5 rounded-full text-xs border transition-colors cursor-pointer ${
                        c.isActive
                          ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
                          : "bg-zinc-800 text-zinc-400 border-zinc-600"
                      }`}
                    >
                      {c.isActive ? "Active" : "Inactive"}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteMutation.mutate(c.code)}
                      data-ocid={`coupons.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Coupon Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent
          className="max-w-md bg-card border-border"
          data-ocid="coupons.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              Create Coupon
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label>Coupon Code</Label>
              <Input
                value={form.code}
                onChange={(e) =>
                  setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                }
                placeholder="e.g. VED20"
                required
                className="font-mono uppercase"
                data-ocid="coupons.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Discount Type</Label>
                <select
                  value={form.discountType}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      discountType: e.target.value as DiscountType,
                    }))
                  }
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  data-ocid="coupons.select"
                >
                  <option value={DiscountType.percentage}>
                    Percentage (%)
                  </option>
                  <option value={DiscountType.fixed}>Fixed (₹)</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>Discount Value</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.discountValue}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, discountValue: e.target.value }))
                  }
                  placeholder={
                    form.discountType === DiscountType.percentage
                      ? "e.g. 20"
                      : "e.g. 500"
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Minimum Order Value (₹) — optional</Label>
              <Input
                type="number"
                min="0"
                value={form.minOrderValue}
                onChange={(e) =>
                  setForm((f) => ({ ...f, minOrderValue: e.target.value }))
                }
                placeholder="e.g. 5000"
              />
            </div>
            <div className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={form.isActive}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, isActive: !!v }))
                }
              />
              <span className="text-sm">Active immediately</span>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddOpen(false)}
                data-ocid="coupons.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={upsertMutation.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="coupons.submit_button"
              >
                {upsertMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Save Coupon
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Main AdminPage ───────────────────────────────────────────────────────────
export function AdminPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  const { data: isAdmin, isLoading: checkingAdmin } = useQuery<boolean>({
    queryKey: ["is-admin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
  });

  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "coupons", label: "Coupons", icon: Tag },
  ];

  // Not logged in
  if (!identity) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Crown className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-serif text-foreground mb-2">
            Admin Access
          </h1>
          <p className="text-muted-foreground mb-8">
            Admin access required. Please log in with your admin account to
            manage products, orders, and coupons.
          </p>
          <Button
            onClick={login}
            disabled={loginStatus === "logging-in"}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
            data-ocid="admin.primary_button"
          >
            {loginStatus === "logging-in" ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Log In
          </Button>
        </motion.div>
      </div>
    );
  }

  // Checking admin status
  if (checkingAdmin || isFetching) {
    return (
      <div
        data-ocid="admin.loading_state"
        className="min-h-[80vh] flex items-center justify-center"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not admin
  if (isAdmin === false) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div data-ocid="admin.error_state" className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-serif text-foreground mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            Your account does not have admin privileges. Contact the site owner
            to request access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5 text-primary" />
              <span className="font-serif text-lg text-foreground">
                Ved Jewellers
              </span>
              <Separator orientation="vertical" className="h-5" />
              <span className="text-sm text-muted-foreground">Admin Panel</span>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              {identity?.getPrincipal().toString().slice(0, 12)}...
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  data-ocid={`admin.${tab.id}.tab`}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "dashboard" && <DashboardTab />}
              {activeTab === "products" && <ProductsTab />}
              {activeTab === "orders" && <OrdersTab />}
              {activeTab === "coupons" && <CouponsTab />}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
