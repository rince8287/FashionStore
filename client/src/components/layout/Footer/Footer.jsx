import { useState } from "react";
import { Link } from "react-router-dom";

import {
  FiArrowUpRight,
  FiFacebook,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
  FiShield,
  FiTwitter,
  FiYoutube,
} from "react-icons/fi";


// ============================================================
// NAVIGATION
// ============================================================

const shopLinks = [
  { label: "New In", path: "/new-in" },
  { label: "Men", path: "/men" },
  { label: "Women", path: "/women" },
  { label: "Kids", path: "/kids" },
  { label: "Beauty", path: "/beauty" },
  { label: "Accessories", path: "/accessories" },
];

const customerCareLinks = [
  { label: "Contact Us", path: "/contact" },
  { label: "Shipping", path: "/shipping" },
  { label: "Returns", path: "/returns" },
  { label: "FAQ", path: "/faq" },
];

const legalLinks = [
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms & Conditions", path: "/terms" },
  { label: "Cookie Policy", path: "/cookies" },
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


// ============================================================
// FOOTER
// ============================================================

function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ==========================================================
  // NEWSLETTER
  // ==========================================================

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) return;

    setSubmitted(true);
    setEmail("");

    setTimeout(() => {
      setSubmitted(false);
    }, 3500);
  };

  // ==========================================================
  // SCROLL TO TOP
  // ==========================================================

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================================
  // COMPONENT
  // ==========================================================

  return (
    <footer className="relative overflow-hidden border-t border-border-subtle bg-surface">

      {/* ======================================================
          DECORATIVE BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-80
          w-80
          rounded-full
          bg-accent/[0.035]
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-40
          bottom-0
          h-72
          w-72
          rounded-full
          bg-accent/[0.025]
          blur-3xl
        "
      />

      {/* ======================================================
          MAIN CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1280px]
          px-4
          py-10
          sm:px-6
          sm:py-12
          lg:px-8
          lg:py-14
        "
      >

        {/* ====================================================
            TOP BRAND / NEWSLETTER STRIP
        ==================================================== */}

        <div
          className="
            mb-10
            flex
            flex-col
            gap-6
            rounded-2xl
            border
            border-border-subtle
            bg-brand-bg/60
            p-5
            sm:p-6
            lg:flex-row
            lg:items-center
            lg:justify-between
            lg:p-7
          "
        >

          {/* Brand */}

          <div className="max-w-xl">

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-accent/20
                  bg-accent/10
                  text-accent
                "
              >
                <FiShield size={19} />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
                  FashionStore
                </p>

                <h2 className="mt-0.5 text-lg font-semibold text-text-primary sm:text-xl">
                  Stay in the style loop.
                </h2>
              </div>

            </div>

            <p className="mt-3 max-w-lg text-xs leading-6 text-text-secondary sm:text-sm">
              Get early access to new collections, exclusive launches
              and carefully selected offers.
            </p>

          </div>


          {/* Newsletter */}

          <form
            onSubmit={handleNewsletterSubmit}
            className="
              w-full
              lg:max-w-md
            "
          >

            <label
              htmlFor="newsletter-email"
              className="sr-only"
            >
              Email address
            </label>

            <div
              className="
                flex
                min-h-12
                overflow-hidden
                rounded-xl
                border
                border-border-subtle
                bg-surface
                transition-all
                duration-300
                focus-within:border-accent
                focus-within:shadow-[0_0_0_3px_rgba(212,175,55,0.06)]
              "
            >

              <div className="flex shrink-0 items-center pl-4 text-text-muted">
                <FiMail size={17} />
              </div>

              <input
                id="newsletter-email"
                type="email"
                value={email}
                required
                placeholder="Enter your email"
                onChange={(event) => {
                  setEmail(event.target.value);
                  setSubmitted(false);
                }}
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  px-3
                  text-sm
                  text-text-primary
                  outline-none
                  placeholder:text-text-muted
                "
              />

              <button
                type="submit"
                aria-label="Subscribe"
                className="
                  m-1
                  flex
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-accent
                  text-brand-bg
                  transition-all
                  duration-300
                  hover:bg-accent-hover
                  hover:scale-[1.02]
                  active:scale-95
                "
              >
                <FiSend size={17} />
              </button>

            </div>

            <p
              className={`
                mt-2
                text-xs
                transition-all
                duration-300
                ${
                  submitted
                    ? "translate-y-0 text-green-500 opacity-100"
                    : "pointer-events-none h-0 translate-y-1 overflow-hidden opacity-0"
                }
              `}
            >
              ✓ You're on the list. Welcome to FashionStore.
            </p>

          </form>

        </div>


        {/* ====================================================
            FOOTER CONTENT
        ==================================================== */}

        <div
          className="
            grid
            grid-cols-2
            gap-x-8
            gap-y-10
            sm:grid-cols-2
            lg:grid-cols-12
            lg:gap-8
          "
        >

          {/* ==================================================
              BRAND
          ================================================== */}

          <div className="col-span-2 lg:col-span-4">

            <Link
              to="/"
              aria-label="FashionStore home"
              className="
                group
                inline-flex
                items-center
                gap-3
              "
            >

              <span
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-accent/20
                  bg-accent/10
                  text-sm
                  font-bold
                  text-accent
                  transition-all
                  duration-300
                  group-hover:rotate-3
                  group-hover:bg-accent
                  group-hover:text-brand-bg
                "
              >
                FS
              </span>

              <span
                className="
                  font-display
                  text-2xl
                  font-semibold
                  tracking-wide
                  text-text-primary
                  transition-colors
                  duration-300
                  group-hover:text-accent
                "
              >
                FashionStore
              </span>

            </Link>


            <p
              className="
                mt-5
                max-w-sm
                text-sm
                leading-6
                text-text-secondary
              "
            >
              Contemporary fashion designed for modern expression.
              Discover refined pieces created to elevate your everyday
              wardrobe.
            </p>


            {/* Social */}

            <div className="mt-6 flex items-center gap-2">

              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="
                      group
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-border-subtle
                      bg-brand-bg
                      text-text-muted
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-accent
                      hover:bg-accent
                      hover:text-brand-bg
                    "
                  >
                    <Icon
                      size={16}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </a>
                );
              })}

            </div>


            {/* Trust */}

            <div
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-green-500/15
                bg-green-500/[0.06]
                px-3
                py-2
              "
            >

              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

              <span className="text-[11px] font-medium text-text-secondary">
                Secure & trusted shopping
              </span>

            </div>

          </div>


          {/* ==================================================
              SHOP
          ================================================== */}

          <div className="lg:col-span-2">

            <FooterHeading title="Shop" />

            <FooterLinks links={shopLinks} />

          </div>


          {/* ==================================================
              CUSTOMER CARE
          ================================================== */}

          <div className="lg:col-span-2">

            <FooterHeading title="Customer Care" />

            <FooterLinks links={customerCareLinks} />

          </div>


          {/* ==================================================
              CONTACT
          ================================================== */}

          <div className="col-span-2 sm:col-span-1 lg:col-span-4">

            <FooterHeading title="Get In Touch" />

            <div className="mt-5 space-y-3">

              <ContactRow
                icon={FiMail}
                text="support@fashionstore.com"
              />

              <ContactRow
                icon={FiPhone}
                text="+91 XXXXX XXXXX"
              />

              <ContactRow
                icon={FiMapPin}
                text="Delhi, India"
              />

            </div>


            <Link
              to="/contact"
              className="
                group
                mt-5
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-accent
              "
            >
              Contact our team

              <FiArrowUpRight
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </Link>

          </div>

        </div>


        {/* ====================================================
            BOTTOM
        ==================================================== */}

        <div
          className="
            mt-10
            border-t
            border-border-subtle
            pt-6
          "
        >

          <div
            className="
              flex
              flex-col
              gap-5
              md:flex-row
              md:items-center
              md:justify-between
            "
          >

            {/* Copyright */}

            <p className="text-xs text-text-muted sm:text-sm">
              © 2026 FashionStore. All rights reserved.
            </p>


            {/* Legal */}

            <div className="flex flex-wrap gap-x-5 gap-y-2">

              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="
                    text-xs
                    text-text-muted
                    transition-colors
                    duration-300
                    hover:text-accent
                    sm:text-sm
                  "
                >
                  {link.label}
                </Link>
              ))}

            </div>


            {/* Back to top */}

            <button
              type="button"
              onClick={handleBackToTop}
              className="
                group
                inline-flex
                items-center
                gap-2
                self-start
                text-xs
                font-medium
                text-text-secondary
                transition-colors
                duration-300
                hover:text-accent
                md:self-auto
              "
            >
              Back to top

              <span
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-border-subtle
                  transition-all
                  duration-300
                  group-hover:-translate-y-1
                  group-hover:border-accent
                  group-hover:text-accent
                "
              >
                ↑
              </span>

            </button>

          </div>

        </div>

      </div>
    </footer>
  );
}


// ============================================================
// FOOTER HEADING
// ============================================================

function FooterHeading({ title }) {
  return (
    <div>
      <h2
        className="
          text-xs
          font-semibold
          uppercase
          tracking-[0.2em]
          text-text-primary
        "
      >
        {title}
      </h2>

      <div
        className="
          mt-3
          h-px
          w-7
          bg-accent
          transition-all
          duration-300
          hover:w-12
        "
      />
    </div>
  );
}


// ============================================================
// FOOTER LINKS
// ============================================================

function FooterLinks({ links }) {
  return (
    <ul className="mt-5 space-y-2.5">

      {links.map((link) => (
        <li key={link.path}>

          <Link
            to={link.path}
            className="
              group
              inline-flex
              items-center
              gap-1.5
              text-sm
              text-text-secondary
              transition-all
              duration-300
              hover:translate-x-1
              hover:text-accent
            "
          >
            <span
              className="
                h-px
                w-0
                bg-accent
                transition-all
                duration-300
                group-hover:w-2
              "
            />

            {link.label}

          </Link>

        </li>
      ))}

    </ul>
  );
}


// ============================================================
// CONTACT ROW
// ============================================================

function ContactRow({ icon: Icon, text }) {
  return (
    <div className="group flex items-center gap-3">

      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          border
          border-border-subtle
          bg-brand-bg
          text-text-muted
          transition-all
          duration-300
          group-hover:border-accent/30
          group-hover:text-accent
        "
      >
        <Icon size={15} />
      </div>

      <span className="truncate text-sm text-text-secondary">
        {text}
      </span>

    </div>
  );
}


export default Footer;