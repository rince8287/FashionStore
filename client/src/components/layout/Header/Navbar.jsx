import { Link, NavLink } from "react-router-dom";
import { FiHeart, FiSearch, FiShoppingBag, FiUser } from "react-icons/fi";

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
  return (
    <nav className="bg-surface">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="shrink-0 font-display text-2xl font-semibold tracking-wide text-accent"
          aria-label="Go to home page"
        >
          LOGO
        </Link>

        <div className="ml-12 hidden items-center gap-8 lg:flex">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative text-sm font-medium transition-colors duration-300 ${
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

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            className="rounded-full p-3 text-text-secondary transition-colors duration-300 hover:bg-surface-elevated hover:text-text-primary"
            aria-label="Search"
          >
            <FiSearch size={20} />
          </button>

          <Link
            to="/profile"
            className="rounded-full p-3 text-text-secondary transition-colors duration-300 hover:bg-surface-elevated hover:text-text-primary"
            aria-label="Account"
          >
            <FiUser size={20} />
          </Link>

          <Link
            to="/wishlist"
            className="rounded-full p-3 text-text-secondary transition-colors duration-300 hover:bg-surface-elevated hover:text-text-primary"
            aria-label="Wishlist"
          >
            <FiHeart size={20} />
          </Link>

          <Link
            to="/cart"
            className="rounded-full p-3 text-text-secondary transition-colors duration-300 hover:bg-surface-elevated hover:text-text-primary"
            aria-label="Shopping bag"
          >
            <FiShoppingBag size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;