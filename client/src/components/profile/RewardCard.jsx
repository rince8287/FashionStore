import {
  FiGift,
  FiAward,
  FiTrendingUp,
} from "react-icons/fi";

function RewardCard({
  title,
  points,
  description,
  expiry,
  type = "reward",
  onClick,
}) {
  const getIcon = () => {
    switch (type) {
      case "cashback":
        return FiTrendingUp;

      case "bonus":
        return FiAward;

      default:
        return FiGift;
    }
  };

  const Icon = getIcon();

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-lg"
    >
      <div className="flex items-start justify-between">

        {/* Left */}

        <div className="flex items-start gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
            <Icon size={24} />
          </div>

          <div>

            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              {description}
            </p>

            {expiry && (
              <p className="mt-3 text-xs font-medium text-orange-400">
                Expires: {expiry}
              </p>
            )}

          </div>

        </div>

        {/* Points */}

        <div className="rounded-xl bg-[var(--color-accent-soft)] px-4 py-2">

          <p className="text-center text-xs font-medium text-[var(--color-text-secondary)]">
            Points
          </p>

          <h4 className="mt-1 text-center text-xl font-bold text-[var(--color-accent)]">
            {points}
          </h4>

        </div>

      </div>
    </button>
  );
}

export default RewardCard;