import {
  FiCreditCard,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiClock,
} from "react-icons/fi";

function WalletCard({
  title,
  amount,
  date,
  status = "Completed",
  type = "credit",
  onClick,
}) {
  const isCredit = type === "credit";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-lg"
    >
      {/* Left Section */}

      <div className="flex items-center gap-4">

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl ${
            isCredit
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {isCredit ? (
            <FiArrowDownLeft size={24} />
          ) : (
            <FiArrowUpRight size={24} />
          )}
        </div>

        <div>

          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {title}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <FiClock size={15} />
            <span>{date}</span>
          </div>

          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--color-accent)]">
            <FiCreditCard size={14} />
            {status}
          </div>

        </div>

      </div>

      {/* Amount */}

      <div className="text-right">

        <p
          className={`text-2xl font-bold ${
            isCredit ? "text-green-500" : "text-red-500"
          }`}
        >
          {isCredit ? "+" : "-"}₹{amount}
        </p>

        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          {isCredit ? "Wallet Credit" : "Wallet Debit"}
        </p>

      </div>

    </button>
  );
}

export default WalletCard;