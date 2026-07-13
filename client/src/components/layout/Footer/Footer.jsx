import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
} from "react-icons/fi";

const shopLinks = [
  {
    label: "New In",
    path: "/new-in",
  },
  {
    label: "Men",
    path: "/men",
  },
  {
    label: "Women",
    path: "/women",
  },
  {
    label: "Kids",
    path: "/kids",
  },
  {
    label: "Beauty",
    path: "/beauty",
  },
  {
    label: "Accessories",
    path: "/accessories",
  },
];

const customerCareLinks = [
  {
    label: "Contact Us",
    path: "/contact",
  },
  {
    label: "Shipping",
    path: "/shipping",
  },
  {
    label: "Returns",
    path: "/returns",
  },
  {
    label: "FAQ",
    path: "/faq",
  },
];

const legalLinks = [
  {
    label: "Privacy Policy",
    path: "/privacy",
  },
  {
    label: "Terms & Conditions",
    path: "/terms",
  },
  {
    label: "Cookie Policy",
    path: "/cookies",
  },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: FiInstagram,
  },
  {
    label: "Facebook",
    href: "#",
    icon: FiFacebook,
  },
  {
    label: "Twitter",
    href: "#",
    icon: FiTwitter,
  },
  {
    label: "YouTube",
    href: "#",
    icon: FiYoutube,
  },
];

function Footer() {
  function handleNewsletterSubmit(event) {
    event.preventDefault();
  }

  return (
    <footer className="border-t border-border-subtle bg-surface">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link
              to="/"
              className="inline-block font-display text-3xl font-semibold tracking-wide text-accent"
              aria-label="Go to home page"
            >
              LOGO
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-text-secondary">
              Contemporary fashion designed for modern expression. Discover
              refined pieces created to elevate your everyday wardrobe.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle text-text-secondary transition-colors duration-300 hover:border-accent hover:text-accent"
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-primary">
              Shop
            </h2>

            <ul className="mt-5 space-y-3">
              {shopLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-text-secondary transition-colors duration-300 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-primary">
              Customer Care
            </h2>

            <ul className="mt-5 space-y-3">
              {customerCareLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-text-secondary transition-colors duration-300 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-primary">
              Private Access
            </h2>

            <p className="mt-5 max-w-md text-sm leading-6 text-text-secondary">
              Join our list for new collection previews, private releases and
              selected updates.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>

              <input
                id="newsletter-email"
                type="email"
                placeholder="Email address"
                className="min-h-12 min-w-0 flex-1 rounded-lg border border-border-subtle bg-brand-bg px-4 text-sm text-text-primary outline-none transition-colors duration-300 placeholder:text-text-muted focus:border-accent"
              />

              <button
                type="submit"
                className="min-h-12 shrink-0 rounded-lg bg-accent px-6 text-sm font-semibold text-brand-bg transition-colors duration-300 hover:bg-accent-hover"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-border-subtle pt-6 lg:mt-16">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="text-xs leading-5 text-text-muted sm:text-sm">
              © 2026 Fashion Store. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-xs text-text-muted transition-colors duration-300 hover:text-text-primary sm:text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;