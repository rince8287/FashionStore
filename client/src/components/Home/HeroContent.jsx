import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

function HeroContent() {
  return (
    <div className="max-w-2xl">
      {/* Premium Badge */}
      <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent-soft px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          New Season 2026
        </span>
      </div>

      {/* Heading */}
      <h1 className="mt-8 font-display text-4xl font-semibold leading-tight text-text-primary sm:text-5xl lg:text-6xl">
        Elevate Your
        <span className="block text-accent">
          Everyday Style
        </span>
      </h1>

      {/* Description */}
      <p className="mt-6 max-w-xl text-base leading-8 text-text-secondary sm:text-lg">
        Discover premium fashion crafted for modern lifestyles.
        Timeless collections, luxurious fabrics and exceptional
        quality designed to make every day extraordinary.
      </p>

      {/* Buttons */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          to="/new-in"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-8 py-3 text-sm font-semibold text-brand-bg transition-all duration-300 hover:bg-accent-hover"
        >
          Shop Now
          <FiArrowRight className="ml-2" size={18} />
        </Link>

        <Link
          to="/men"
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border-subtle bg-surface px-8 py-3 text-sm font-semibold text-text-primary transition-all duration-300 hover:border-accent hover:text-accent"
        >
          Explore Collection
        </Link>
      </div>

      {/* Trust Text */}
      <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-text-muted">
        <span>✔ Premium Quality</span>
        <span>✔ Secure Checkout</span>
        <span>✔ Fast Delivery</span>
      </div>
    </div>
  );
}

export default HeroContent;