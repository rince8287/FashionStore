import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

function ProfileMenuItem({
  icon: Icon,
  title,
  subtitle,
  to = "#",
  danger = false,
  badge,
  onClick,
}) {
  const content = (
    <div
      className={`group flex items-center justify-between rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
        danger
          ? "border-red-500/20 bg-red-500/5 hover:bg-red-500/10"
          : "border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-accent)]"
      }`}
    >
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            danger
              ? "bg-red-500/10 text-red-500"
              : "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
          }`}
        >
          {Icon && <Icon size={22} />}
        </div>

        {/* Text */}
        <div>
          <h3
            className={`font-semibold ${
              danger
                ? "text-red-500"
                : "text-[var(--color-text-primary)]"
            }`}
          >
            {title}
          </h3>

          {subtitle && (
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {badge && (
          <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
            {badge}
          </span>
        )}

        <FiChevronRight
          size={20}
          className={`transition-transform duration-300 group-hover:translate-x-1 ${
            danger
              ? "text-red-500"
              : "text-[var(--color-text-secondary)]"
          }`}
        />
      </div>
    </div>
  );

  if (to && to !== "#") {
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full border-0 bg-transparent p-0 text-left"
    >
      {content}
    </button>
  );
}

export default ProfileMenuItem;