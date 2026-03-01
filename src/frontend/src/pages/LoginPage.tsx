import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function LoginPage() {
  const { login, identity, isLoggingIn, isInitializing } =
    useInternetIdentity();

  useEffect(() => {
    if (identity) {
      window.location.hash = "/";
    }
  }, [identity]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-20">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gold/5" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-burgundy/5" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="luxury-card p-10 text-center">
          {/* Logo */}
          <img
            src="/assets/generated/ved-logo-transparent.dim_300x80.png"
            alt="Ved Jewellers"
            className="h-10 w-auto mx-auto mb-8"
          />

          {/* Divider */}
          <div className="gold-divider mb-8" />

          <h1 className="font-serif text-2xl mb-2">Welcome Back</h1>
          <p className="text-muted-foreground text-sm font-sans mb-8">
            Sign in to access your account, wishlist, and orders.
          </p>

          <button
            type="button"
            onClick={login}
            disabled={isLoggingIn || isInitializing}
            className="btn-gold w-full flex items-center justify-center gap-2"
          >
            {isLoggingIn || isInitializing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Sign In Securely"
            )}
          </button>

          <p className="text-[11px] font-sans text-muted-foreground mt-4">
            Powered by Internet Identity — no password required
          </p>

          <div className="gold-divider mt-8 mb-6" />

          <p className="text-xs font-sans text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
