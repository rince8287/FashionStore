import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  FiChevronDown,
  FiFilter,
  FiHeart,
  FiMenu,
  FiSearch,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";

import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";

import MobileMenu from "./MobileMenu";
import SearchOverlay from "./SearchOverlay";

// ==========================================================
// NAVIGATION
// ==========================================================

const navigationItems = [
  {
    label: "Filter",
    path: "/shop",
    icon: FiFilter,
    special: true,
  },
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

// ==========================================================
// NAVBAR
// ==========================================================

function Navbar() {
  const { isAuthenticated = false } = useAuth();

  const { totalItems = 0 } = useCart();

  const { totalWishlistItems = 0 } =
    useWishlist();

  const [
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  ] = useState(false);

  const [
    isSearchOpen,
    setIsSearchOpen,
  ] = useState(false);

  // ========================================================
  // HANDLERS
  // ========================================================

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  // ========================================================
  // COMPONENT
  // ========================================================

  return (
    <>
      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-border-subtle
          bg-surface/90
          backdrop-blur-xl
        "
      >
        <nav
          className="
            mx-auto
            w-full
            max-w-[1440px]
          "
          aria-label="Main navigation"
        >
          {/* ==================================================
              MAIN NAVBAR
          ================================================== */}

          <div
            className="
              flex
              h-16
              items-center
              gap-2
              px-4
              sm:h-[70px]
              sm:px-6
              lg:h-[76px]
              lg:px-8
              xl:gap-4
            "
          >
            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={openMobileMenu}
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="
                group
                flex
                h-10
                w-10
                shrink-0
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
                hover:bg-accent-soft
                hover:text-accent
                active:scale-95
                lg:hidden
              "
            >
              <FiMenu
                size={20}
                className="
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              />
            </button>

            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              to="/"
              aria-label="FashionStore home"
              className="
                group
                flex
                shrink-0
                items-center
                gap-2.5
              "
            >
              {/* Logo Mark */}

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
                  text-[10px]
                  font-bold
                  tracking-tight
                  text-accent
                  transition-all
                  duration-300
                  group-hover:rotate-3
                  group-hover:bg-accent
                  group-hover:text-brand-bg
                  sm:h-10
                  sm:w-10
                "
              >
                FS
              </span>

              {/* Logo Text */}

              <span
                className="
                  font-display
                  text-lg
                  font-semibold
                  tracking-wide
                  text-text-primary
                  transition-colors
                  duration-300
                  group-hover:text-accent
                  sm:text-xl
                  lg:text-[22px]
                "
              >
                FashionStore
              </span>
            </Link>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <div
              className="
                ml-auto
                hidden
                items-center
                gap-1
                lg:flex
                xl:ml-8
                xl:gap-1.5
              "
            >
              {navigationItems.map(
                (item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `
                          group
                          relative
                          flex
                          h-10
                          items-center
                          gap-1.5
                          rounded-xl
                          px-3
                          text-[13px]
                          font-medium
                          transition-all
                          duration-300
                          xl:px-3.5

                          ${
                            isActive
                              ? "bg-accent-soft text-accent"
                              : item.special
                              ? "border border-border-subtle bg-brand-bg text-text-secondary hover:border-accent/50 hover:text-accent"
                              : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                          }
                        `
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* Active Indicator */}

                          {isActive && (
                            <span
                              className="
                                absolute
                                bottom-0
                                left-1/2
                                h-[2px]
                                w-4
                                -translate-x-1/2
                                rounded-full
                                bg-accent
                              "
                            />
                          )}

                          {Icon && (
                            <Icon
                              size={14}
                              className={`
                                shrink-0
                                transition-transform
                                duration-300
                                group-hover:scale-110
                                ${
                                  isActive
                                    ? "text-accent"
                                    : ""
                                }
                              `}
                            />
                          )}

                          <span>
                            {item.label}
                          </span>
                        </>
                      )}
                    </NavLink>
                  );
                }
              )}
            </div>

            {/* =================================================
                RIGHT CONTROLS
            ================================================= */}

            <div
              className="
                ml-auto
                flex
                items-center
                gap-1
                sm:gap-1.5
              "
            >
              {/* =================================================
                  SEARCH
              ================================================= */}

              <button
                type="button"
                onClick={openSearch}
                aria-label="Search products"
                className="
                  group
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-transparent
                  text-text-secondary
                  transition-all
                  duration-300
                  hover:border-border-subtle
                  hover:bg-surface-elevated
                  hover:text-accent
                  active:scale-95
                  sm:h-10
                  sm:w-10
                "
              >
                <FiSearch
                  size={19}
                  className="
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />
              </button>

              {/* =================================================
                  AUTH
              ================================================= */}

              {isAuthenticated ? (
                <Link
                  to="/profile"
                  aria-label="Open profile"
                  className="
                    group
                    hidden
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-transparent
                    text-text-secondary
                    transition-all
                    duration-300
                    hover:border-border-subtle
                    hover:bg-surface-elevated
                    hover:text-accent
                    active:scale-95
                    sm:flex
                  "
                >
                  <FiUser
                    size={19}
                    className="
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  />
                </Link>
              ) : (
                /* =================================================
                   LOGIN / SIGNUP
                ================================================= */

                <div
                  className="
                    hidden
                    overflow-hidden
                    rounded-xl
                    border
                    border-border-subtle
                    sm:flex
                  "
                >
                  <Link
                    to="/login"
                    className="
                      flex
                      h-10
                      items-center
                      px-3.5
                      text-xs
                      font-medium
                      text-text-secondary
                      transition-all
                      duration-300
                      hover:bg-surface-elevated
                      hover:text-text-primary
                      lg:px-4
                      lg:text-sm
                    "
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="
                      flex
                      h-10
                      items-center
                      bg-accent
                      px-3.5
                      text-xs
                      font-semibold
                      text-brand-bg
                      transition-all
                      duration-300
                      hover:bg-accent-hover
                      lg:px-4
                      lg:text-sm
                    "
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* =================================================
                  WISHLIST
              ================================================= */}

              {isAuthenticated && (
                <>
                  <Link
                    to="/wishlist"
                    aria-label={`Wishlist${
                      totalWishlistItems > 0
                        ? `, ${totalWishlistItems} items`
                        : ""
                    }`}
                    className="
                      group
                      relative
                      hidden
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-transparent
                      text-text-secondary
                      transition-all
                      duration-300
                      hover:border-border-subtle
                      hover:bg-surface-elevated
                      hover:text-red-400
                      active:scale-95
                      md:flex
                    "
                  >
                    <FiHeart
                      size={19}
                      className="
                        transition-all
                        duration-300
                        group-hover:scale-110
                      "
                    />

                    {totalWishlistItems > 0 && (
                      <span
                        className="
                          absolute
                          -right-1
                          -top-1
                          flex
                          h-[18px]
                          min-w-[18px]
                          items-center
                          justify-center
                          rounded-full
                          border-2
                          border-surface
                          bg-red-500
                          px-1
                          text-[9px]
                          font-bold
                          leading-none
                          text-white
                        "
                      >
                        {totalWishlistItems > 99
                          ? "99+"
                          : totalWishlistItems}
                      </span>
                    )}
                  </Link>

                  {/* =============================================
                      CART
                  ============================================= */}

                  <Link
                    to="/cart"
                    aria-label={`Shopping cart${
                      totalItems > 0
                        ? `, ${totalItems} items`
                        : ""
                    }`}
                    className="
                      group
                      relative
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-transparent
                      text-text-secondary
                      transition-all
                      duration-300
                      hover:border-border-subtle
                      hover:bg-surface-elevated
                      hover:text-accent
                      active:scale-95
                    "
                  >
                    <FiShoppingBag
                      size={19}
                      className="
                        transition-transform
                        duration-300
                        group-hover:scale-110
                      "
                    />

                    {totalItems > 0 && (
                      <span
                        className="
                          absolute
                          -right-1
                          -top-1
                          flex
                          h-[18px]
                          min-w-[18px]
                          items-center
                          justify-center
                          rounded-full
                          border-2
                          border-surface
                          bg-accent
                          px-1
                          text-[9px]
                          font-bold
                          leading-none
                          text-brand-bg
                        "
                      >
                        {totalItems > 99
                          ? "99+"
                          : totalItems}
                      </span>
                    )}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* ==================================================
              MOBILE QUICK BAR
          ================================================== */}

          <div
            className="
              flex
              border-t
              border-border-subtle
              px-4
              py-2
              lg:hidden
              sm:px-6
            "
          >
            <Link
              to="/shop"
              className="
                flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-lg
                py-1.5
                text-[11px]
                font-medium
                text-text-secondary
                transition-colors
                duration-300
                hover:text-accent
              "
            >
              <FiFilter size={14} />

              <span>Shop</span>
            </Link>

            <div className="my-1 w-px bg-border-subtle" />

            <Link
              to="/new-in"
              className="
                flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-lg
                py-1.5
                text-[11px]
                font-medium
                text-text-secondary
                transition-colors
                duration-300
                hover:text-accent
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />

              <span>New In</span>
            </Link>

            {isAuthenticated && (
              <>
                <div className="my-1 w-px bg-border-subtle" />

                <Link
                  to="/wishlist"
                  className="
                    flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    py-1.5
                    text-[11px]
                    font-medium
                    text-text-secondary
                    transition-colors
                    duration-300
                    hover:text-red-400
                  "
                >
                  <FiHeart size={14} />

                  <span>Wishlist</span>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* ======================================================
          MOBILE MENU
      ====================================================== */}

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        navigationItems={navigationItems}
      />

      {/* ======================================================
          SEARCH OVERLAY
      ====================================================== */}

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={closeSearch}
      />
    </>
  );
}

export default Navbar;