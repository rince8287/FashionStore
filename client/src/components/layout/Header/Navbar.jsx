import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FiHeart,
  FiMenu,
  FiSearch,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";

import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";

import MobileMenu from "./MobileMenu";
import SearchOverlay from "./SearchOverlay";

const navigationItems = [
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

function Navbar() {
  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  function openMobileMenu() {
    setIsMobileMenuOpen(true);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  function openSearch() {
    setIsSearchOpen(true);
  }

  function closeSearch() {
    setIsSearchOpen(false);
  }

  return (
    <>
      <nav
        className="bg-surface"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center px-4 sm:h-18 sm:px-6 lg:h-20 lg:px-8">

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={openMobileMenu}
            className="mr-1 flex shrink-0 items-center justify-center rounded-full p-2.5 text-text-secondary transition-colors duration-300 hover:bg-surface-elevated hover:text-text-primary sm:mr-2 lg:hidden"
            aria-label="Open navigation menu"
          >
            <FiMenu size={22} />
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 font-display text-xl font-semibold tracking-wide text-accent sm:text-2xl"
          >
            LOGO
          </Link>

          {/* Desktop Navigation */}
          <div className="ml-8 hidden items-center gap-5 lg:flex xl:ml-12 xl:gap-8">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative whitespace-nowrap text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-accent"
                      : "text-text-secondary hover:text-text-primary"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right Icons */}
          <div className="ml-auto flex shrink-0 items-center gap-1">

            {/* Search */}
            <button
              type="button"
              onClick={openSearch}
              className="flex items-center justify-center rounded-full p-3 text-text-secondary transition-colors duration-300 hover:bg-surface-elevated hover:text-text-primary"
            >
              <FiSearch size={20} />
            </button>

            {/* Profile */}
            <Link
              to="/profile"
              className="hidden items-center justify-center rounded-full p-3 text-text-secondary transition-colors duration-300 hover:bg-surface-elevated hover:text-text-primary sm:flex"
            >
              <FiUser size={20} />
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative hidden items-center justify-center rounded-full p-3 text-text-secondary transition-colors duration-300 hover:bg-surface-elevated hover:text-text-primary md:flex"
            >
              <FiHeart size={20} />

              {totalWishlistItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center rounded-full p-3 text-text-secondary transition-colors duration-300 hover:bg-surface-elevated hover:text-text-primary"
            >
              <FiShoppingBag size={20} />

              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-black">
                  {totalItems}
                </span>
              )}
            </Link>

          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        navigationItems={navigationItems}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={closeSearch}
      />
    </>
  );
}

export default Navbar;