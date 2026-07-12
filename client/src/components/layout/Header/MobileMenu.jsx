import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiHeart, FiUser, FiX } from "react-icons/fi";

function MobileMenu({ isOpen, onClose, navigationItems }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="mobile-navigation"
      className="fixed inset-0 z-50 lg:hidden"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/60 backdrop-blur-sm"
        aria-label="Close navigation menu"
      />

      <aside
        className="relative flex h-full w-[85%] max-w-sm flex-col border-r border-border-subtle bg-surface shadow-2xl"
        aria-label="Mobile navigation"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border-subtle px-5">
          <Link
            to="/"
            onClick={onClose}
            className="font-display text-2xl font-semibold tracking-wide text-accent"
            aria-label="Go to home page"
          >
            LOGO
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-full p-2.5 text-text-secondary transition-colors duration-300 hover:bg-surface-elevated hover:text-text-primary"
            aria-label="Close navigation menu"
          >
            <FiX size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-6">
          <div className="flex flex-col">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `border-b border-border-subtle py-4 text-base font-medium transition-colors duration-300 ${
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
        </nav>

        <div className="shrink-0 border-t border-border-subtle p-5">
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/profile"
              onClick={onClose}
              className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border-subtle bg-surface-elevated px-3 py-3 text-sm font-medium text-text-secondary transition-colors duration-300 hover:text-text-primary"
            >
              <FiUser size={18} />

              <span>Account</span>
            </Link>

            <Link
              to="/wishlist"
              onClick={onClose}
              className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border-subtle bg-surface-elevated px-3 py-3 text-sm font-medium text-text-secondary transition-colors duration-300 hover:text-text-primary"
            >
              <FiHeart size={18} />

              <span>Wishlist</span>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default MobileMenu;