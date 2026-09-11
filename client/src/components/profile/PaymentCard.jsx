import { FiChevronRight } from "react-icons/fi";

function PaymentCard({
  icon: Icon,
  title,
  subtitle,
  value,
  badge,
  primary = false,
  onClick,
  disabled = false,
}) {
  const handleClick = () => {
    if (disabled) return;

    if (typeof onClick === "function") {
      onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={title || "Payment method"}
      className={`group flex w-full items-center justify-between rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-5 text-left transition-all duration-300 ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-lg"
      }`}
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
          {Icon ? <Icon size={24} /> : null}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-[var(--color-text-primary)] sm:text-lg">
              {title}
            </h3>

            {primary && (
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                Primary
              </span>
            )}

            {badge && (
              <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
                {badge}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="mt-1 text-sm leading-5 text-[var(--color-text-secondary)]">
              {subtitle}
            </p>
          )}

          {value && (
            <p className="mt-2 break-all text-sm font-medium text-[var(--color-text-primary)]">
              {value}
            </p>
          )}
        </div>
      </div>

      <div
        className={`ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-300 ${
          disabled
            ? ""
            : "group-hover:bg-[var(--color-accent-soft)] group-hover:text-[var(--color-accent)]"
        }`}
      >
        <FiChevronRight
          size={21}
          className={
            disabled
              ? ""
              : "transition-transform duration-300 group-hover:translate-x-1"
          }
        />
      </div>
    </button>
  );
}

export default PaymentCard;