import {
  FiArrowDownLeft,
  FiArrowUpRight,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

function WalletTransaction({
  title,
  description,
  amount,
  date,
  status = "Completed",
  type = "credit",
  onClick,
}) {
  const isCredit = type === "credit";

  const getStatusColor = () => {
    switch (status) {
      case "Completed":
        return "text-green-500";

      case "Pending":
        return "text-yellow-500";

      case "Failed":
        return "text-red-500";

      default:
        return "text-[var(--color-text-secondary)]";
    }
  };

  const StatusIcon =
    status === "Completed"
      ? FiCheckCircle
      : status === "Pending"
      ? FiClock
      : FiAlertCircle;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-lg"
    >
      {/* Left */}

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

          {description && (
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {description}
            </p>
          )}

          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
            {date}
          </p>

          <div
            className={`mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)] px-3 py-1 text-xs font-medium ${getStatusColor()}`}
          >
            <StatusIcon size={14} />
            {status}
          </div>

        </div>

      </div>

      {/* Right */}

      <div className="text-right">

        <h4
          className={`text-2xl font-bold ${
            isCredit ? "text-green-500" : "text-red-500"
          }`}
        >
          {isCredit ? "+" : "-"}₹{amount}
        </h4>

        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
          {isCredit ? "Wallet Credit" : "Wallet Debit"}
        </p>

      </div>

    </button>
  );
}

export default WalletTransaction;