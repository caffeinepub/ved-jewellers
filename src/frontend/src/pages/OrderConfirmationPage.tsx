import { CheckCircle, Loader2, Package, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { StripeSessionStatus } from "../backend";
import { useActor } from "../hooks/useActor";

function getHashSearchParam(key: string): string | null {
  const hash = window.location.hash;
  const queryIndex = hash.indexOf("?");
  if (queryIndex === -1) return null;
  return new URLSearchParams(hash.slice(queryIndex + 1)).get(key);
}

export function OrderConfirmationPage() {
  const sessionId = getHashSearchParam("session_id");
  const { actor, isFetching } = useActor();
  const [status, setStatus] = useState<StripeSessionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId || isFetching) return;
    if (!actor) {
      setLoading(false);
      setError("Not authenticated");
      return;
    }

    actor
      .getStripeSessionStatus(sessionId)
      .then((s) => {
        setStatus(s);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error(err);
        setError("Could not verify payment status.");
        setLoading(false);
      });
  }, [sessionId, actor, isFetching]);

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-24 px-4">
        <div className="text-center">
          <p className="font-serif text-2xl mb-4">No order found</p>
          <a href="#/products" className="btn-gold inline-block">
            Browse Collection
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center pt-24 px-4">
      <div className="max-w-lg w-full text-center">
        {loading ? (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto" />
            <p className="font-serif text-xl text-muted-foreground">
              Verifying your payment...
            </p>
          </div>
        ) : error ? (
          <div className="luxury-card p-10 space-y-4">
            <XCircle className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="font-serif text-2xl">Payment Verification Failed</h1>
            <p className="text-muted-foreground text-sm font-sans">{error}</p>
            <a href="#/cart" className="btn-gold inline-block mt-4">
              Return to Cart
            </a>
          </div>
        ) : status?.__kind__ === "completed" ? (
          <div className="luxury-card p-10 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gold/10 flex items-center justify-center mx-auto border border-gold/30">
                <CheckCircle className="w-10 h-10 text-gold" />
              </div>
            </div>
            <div>
              <h1 className="font-serif text-3xl mb-2">Order Confirmed!</h1>
              <p className="text-muted-foreground text-sm font-sans">
                Thank you for your purchase. Your jewellery will be beautifully
                packaged and delivered within 5-7 business days.
              </p>
            </div>

            <div className="bg-muted/40 border border-border p-4 text-left">
              <div className="flex items-center gap-3 mb-3">
                <Package className="w-4 h-4 text-gold" />
                <span className="text-[11px] font-sans uppercase tracking-wider font-semibold">
                  Order Details
                </span>
              </div>
              <p className="text-xs font-sans text-muted-foreground break-all">
                Session: {sessionId}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#/products" className="btn-gold inline-block">
                Continue Shopping
              </a>
              <a href="#/" className="btn-gold-outline inline-block">
                Back to Home
              </a>
            </div>

            <p className="text-xs font-sans text-muted-foreground">
              A confirmation email has been sent to your registered address.
            </p>
          </div>
        ) : (
          <div className="luxury-card p-10 space-y-4">
            <XCircle className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="font-serif text-2xl">Payment Failed</h1>
            <p className="text-muted-foreground text-sm font-sans">
              {status?.__kind__ === "failed"
                ? status.failed.error
                : "Payment could not be processed."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <a href="#/cart" className="btn-gold inline-block">
                Try Again
              </a>
              <a href="#/" className="btn-gold-outline inline-block">
                Back to Home
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
