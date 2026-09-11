import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  FiArrowRight,
  FiHeart,
  FiHome,
  FiLogIn,
  FiShield,
  FiUser,
  FiX,
} from "react-icons/fi";

function MobileMenu({
  isOpen,
  onClose,
  navigationItems = [],
}) {
  // ==========================================================
  // LOCK BODY SCROLL
  // ==========================================================

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isOpen]);

  // ==========================================================
  // ESCAPE KEY
  // ==========================================================

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, onClose]);

  // ==========================================================
  // CLOSE
  // ==========================================================

  if (!isOpen) {
    return null;
  }

  // ==========================================================
  // COMPONENT
  // ==========================================================

  return (
    <div
      id="mobile-navigation"
      className="
        fixed
        inset-0
        z-[100]
        lg:hidden
      "
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {/* ====================================================
          BACKDROP
      ==================================================== */}

      <button
        type="button"
        onClick={onClose}
        aria-label="Close navigation menu"
        className="
          absolute
          inset-0
          h-full
          w-full
          cursor-default
          bg-black/65
          backdrop-blur-[3px]
          transition-opacity
          duration-300
        "
      />

      {/* ====================================================
          DRAWER
      ==================================================== */}

      <aside
        className="
          absolute
          left-0
          top-0
          flex
          h-full
          w-[88%]
          max-w-[380px]
          flex-col
          overflow-hidden
          border-r
          border-border-subtle
          bg-surface
          shadow-[20px_0_60px_rgba(0,0,0,0.35)]
        "
      >
        {/* ==================================================
            DRAWER HEADER
        ================================================== */}

        <div
          className="
            flex
            h-[68px]
            shrink-0
            items-center
            justify-between
            border-b
            border-border-subtle
            px-5
            sm:px-6
          "
        >
          {/* Logo */}

          <Link
            to="/"
            onClick={onClose}
            aria-label="Go to home page"
            className="
              group
              inline-flex
              items-center
              gap-2.5
            "
          >
            <span
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-accent/20
                bg-accent/10
                text-[11px]
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
                text-xl
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

          {/* Close */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-border-subtle
              bg-brand-bg
              text-text-secondary
              transition-all
              duration-300
              hover:border-accent
              hover:bg-accent
              hover:text-brand-bg
              active:scale-95
            "
          >
            <FiX size={19} />
          </button>
        </div>

        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <nav
          className="
            flex-1
            overflow-y-auto
            overscroll-contain
            px-4
            py-5
            sm:px-5
          "
          aria-label="Main navigation"
        >
          {/* Section Label */}

          <div className="mb-3 flex items-center justify-between px-2">
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.25em]
                text-text-muted
              "
            >
              Explore
            </p>

            <span className="h-px w-10 bg-border-subtle" />
          </div>

          {/* Navigation Items */}

          <div className="space-y-1">
            {navigationItems.map(
              (item, index) => (
                <NavLink
                  key={
                    item.path ||
                    `${item.label}-${index}`
                  }
                  to={item.path}
                  onClick={onClose}
                  className={({
                    isActive,
                  }) =>
                    `
                      group
                      relative
                      flex
                      min-h-[48px]
                      items-center
                      justify-between
                      overflow-hidden
                      rounded-xl
                      px-3
                      text-sm
                      font-medium
                      transition-all
                      duration-300

                      ${
                        isActive
                          ? "bg-accent-soft text-accent"
                          : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                      }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator */}

                      <span
                        className={`
                          absolute
                          left-0
                          top-1/2
                          h-6
                          w-[2px]
                          -translate-y-1/2
                          rounded-full
                          bg-accent
                          transition-all
                          duration-300

                          ${
                            isActive
                              ? "opacity-100"
                              : "opacity-0"
                          }
                        `}
                      />

                      <span className="flex items-center gap-3">
                        {/* Number */}

                        <span
                          className={`
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-lg
                            text-[10px]
                            font-semibold
                            transition-all
                            duration-300

                            ${
                              isActive
                                ? "bg-accent text-brand-bg"
                                : "bg-brand-bg text-text-muted group-hover:text-accent"
                            }
                          `}
                        >
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </span>

                        <span>
                          {item.label}
                        </span>
                      </span>

                      <FiArrowRight
                        size={16}
                        className={`
                          transition-all
                          duration-300

                          ${
                            isActive
                              ? "translate-x-0 text-accent opacity-100"
                              : "translate-x-1 text-text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          }
                        `}
                      />
                    </>
                  )}
                </NavLink>
              )
            )}
          </div>

          {/* =================================================
              QUICK LINKS
          ================================================= */}

          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between px-2">
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-text-muted
                "
              >
                Your Space
              </p>

              <span className="h-px w-10 bg-border-subtle" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Account */}

              <Link
                to="/profile"
                onClick={onClose}
                className="
                  group
                  flex
                  min-h-[76px]
                  flex-col
                  justify-between
                  rounded-xl
                  border
                  border-border-subtle
                  bg-brand-bg
                  p-3
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-accent
                "
              >
                <span
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-accent/10
                    text-accent
                    transition-all
                    duration-300
                    group-hover:bg-accent
                    group-hover:text-brand-bg
                  "
                >
                  <FiUser size={16} />
                </span>

                <span className="flex items-center justify-between">
                  <span className="text-xs font-medium text-text-primary">
                    Account
                  </span>

                  <FiArrowRight
                    size={13}
                    className="
                      text-text-muted
                      transition-transform
                      duration-300
                      group-hover:translate-x-0.5
                    "
                  />
                </span>
              </Link>

              {/* Wishlist */}

              <Link
                to="/wishlist"
                onClick={onClose}
                className="
                  group
                  flex
                  min-h-[76px]
                  flex-col
                  justify-between
                  rounded-xl
                  border
                  border-border-subtle
                  bg-brand-bg
                  p-3
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-accent
                "
              >
                <span
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-accent/10
                    text-accent
                    transition-all
                    duration-300
                    group-hover:bg-accent
                    group-hover:text-brand-bg
                  "
                >
                  <FiHeart size={16} />
                </span>

                <span className="flex items-center justify-between">
                  <span className="text-xs font-medium text-text-primary">
                    Wishlist
                  </span>

                  <FiArrowRight
                    size={13}
                    className="
                      text-text-muted
                      transition-transform
                      duration-300
                      group-hover:translate-x-0.5
                    "
                  />
                </span>
              </Link>
            </div>
          </div>

          {/* =================================================
              TRUST CARD
          ================================================= */}

          <div
            className="
              mt-5
              rounded-xl
              border
              border-green-500/15
              bg-green-500/[0.05]
              p-3.5
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-green-500/10
                  text-green-500
                "
              >
                <FiShield size={16} />
              </div>

              <div>
                <p className="text-xs font-semibold text-text-primary">
                  Secure Shopping
                </p>

                <p className="mt-1 text-[11px] leading-5 text-text-muted">
                  Safe checkout, secure payments
                  and trusted delivery.
                </p>
              </div>
            </div>
          </div>
        </nav>

        {/* ==================================================
            BOTTOM ACTION
        ================================================== */}

        <div
          className="
            shrink-0
            border-t
            border-border-subtle
            bg-surface
            p-4
            sm:p-5
          "
        >
          <Link
            to="/"
            onClick={onClose}
            className="
              group
              flex
              min-h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-accent
              px-4
              text-sm
              font-semibold
              text-brand-bg
              transition-all
              duration-300
              hover:bg-accent-hover
              hover:shadow-lg
              active:scale-[0.98]
            "
          >
            <FiHome size={17} />

            <span>
              Continue Shopping
            </span>

            <FiArrowRight
              size={16}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </Link>

          <p className="mt-2.5 text-center text-[10px] text-text-muted">
            Discover your next favorite look
          </p>
        </div>
      </aside>
    </div>
  );
}

export default MobileMenu;