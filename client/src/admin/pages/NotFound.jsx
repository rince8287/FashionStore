import {
  ArrowLeft,
  ArrowRight,
  Home,
  Search,
  ShieldAlert,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

// ============================================================
// ADMIN NOT FOUND PAGE
// ============================================================

function NotFound() {
  const navigate = useNavigate();

  // ============================================================
  // GO BACK
  // ============================================================

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/admin");
    }
  };

  // ============================================================
  // GO DASHBOARD
  // ============================================================

  const handleDashboard = () => {
    navigate("/admin");
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="min-h-screen bg-brand-bg">

      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">

        <div className="w-full max-w-2xl text-center">

          {/* ==================================================
              ICON
              ================================================== */}

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-accent/20 bg-accent/10 sm:h-24 sm:w-24">
            <ShieldAlert
              size={42}
              strokeWidth={1.7}
              className="text-accent sm:h-12 sm:w-12"
            />
          </div>

          {/* ==================================================
              ERROR CODE
              ================================================== */}

          <p className="text-7xl font-black tracking-tight text-text-primary sm:text-8xl">
            404
          </p>

          {/* ==================================================
              TITLE
              ================================================== */}

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Page Not Found
          </h1>

          {/* ==================================================
              DESCRIPTION
              ================================================== */}

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-text-secondary sm:text-base">
            The admin page you're looking for doesn't exist,
            has been moved, or may no longer be available.
          </p>

          {/* ==================================================
              ACTIONS
              ================================================== */}

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

            {/* Go Back */}

            <button
              type="button"
              onClick={handleGoBack}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm font-semibold text-text-primary transition hover:border-accent/40 hover:text-accent"
            >
              <ArrowLeft size={17} />

              Go Back
            </button>

            {/* Dashboard */}

            <button
              type="button"
              onClick={handleDashboard}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-black transition hover:opacity-90"
            >
              <Home size={17} />

              Dashboard

              <ArrowRight size={16} />
            </button>

          </div>

          {/* ==================================================
              QUICK LINKS
              ================================================== */}

          <div className="mx-auto mt-10 max-w-md rounded-2xl border border-border-subtle bg-surface p-5 text-left">

            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                <Search
                  size={17}
                  className="text-accent"
                />
              </div>

              <div>
                <h2 className="text-sm font-bold text-text-primary">
                  Quick Navigation
                </h2>

                <p className="text-xs text-text-muted">
                  Jump to an admin section
                </p>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-2">

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/products")
                }
                className="rounded-xl border border-border-subtle bg-brand-bg px-3 py-2.5 text-xs font-semibold text-text-secondary transition hover:border-accent/30 hover:text-accent"
              >
                Products
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/orders")
                }
                className="rounded-xl border border-border-subtle bg-brand-bg px-3 py-2.5 text-xs font-semibold text-text-secondary transition hover:border-accent/30 hover:text-accent"
              >
                Orders
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/customers")
                }
                className="rounded-xl border border-border-subtle bg-brand-bg px-3 py-2.5 text-xs font-semibold text-text-secondary transition hover:border-accent/30 hover:text-accent"
              >
                Customers
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/reviews")
                }
                className="rounded-xl border border-border-subtle bg-brand-bg px-3 py-2.5 text-xs font-semibold text-text-secondary transition hover:border-accent/30 hover:text-accent"
              >
                Reviews
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/coupons")
                }
                className="rounded-xl border border-border-subtle bg-brand-bg px-3 py-2.5 text-xs font-semibold text-text-secondary transition hover:border-accent/30 hover:text-accent"
              >
                Coupons
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/analytics")
                }
                className="rounded-xl border border-border-subtle bg-brand-bg px-3 py-2.5 text-xs font-semibold text-text-secondary transition hover:border-accent/30 hover:text-accent"
              >
                Analytics
              </button>

            </div>

          </div>

          {/* ==================================================
              FOOTER
              ================================================== */}

          <p className="mt-8 text-xs text-text-muted">
            FashionStore Admin Panel
          </p>

        </div>

      </div>

    </main>
  );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default NotFound;