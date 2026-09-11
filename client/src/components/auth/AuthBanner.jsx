function AuthBanner({
  title = "Welcome Back",
  description = "Sign in to continue shopping premium fashion products, manage your wishlist, track orders and enjoy a seamless shopping experience.",
}) {
  return (
    <div className="relative hidden overflow-hidden bg-gradient-to-br from-accent-soft via-surface to-brand-bg lg:flex lg:flex-col lg:justify-between lg:p-12">

      {/* Background Glow */}

      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl"></div>

      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl"></div>

      {/* Logo */}

      <div className="relative z-10">

        <h2 className="text-3xl font-extrabold tracking-wide text-accent">
          FashionStore
        </h2>

      </div>

      {/* Content */}

      <div className="relative z-10 my-auto">

        <h1 className="text-5xl font-bold leading-tight text-text-primary">
          {title}
        </h1>

        <p className="mt-6 max-w-md text-lg leading-8 text-text-secondary">
          {description}
        </p>

        {/* Features */}

        <div className="mt-12 space-y-5">

          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-accent"></div>

            <span className="text-text-secondary">
              Premium Fashion Collection
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-accent"></div>

            <span className="text-text-secondary">
              Secure Shopping Experience
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-accent"></div>

            <span className="text-text-secondary">
              Fast Delivery Across India
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-accent"></div>

            <span className="text-text-secondary">
              Trusted by Thousands of Customers
            </span>
          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="relative z-10 border-t border-border-subtle pt-6">

        <p className="text-sm text-text-muted">
          © 2026 FashionStore. All Rights Reserved.
        </p>

      </div>

    </div>
  );
}

export default AuthBanner;