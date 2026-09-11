import { FiAlertTriangle } from "react-icons/fi";

function LogoutDialog({
  open,
  onClose,
  onConfirm,
  loading = false,
}) {
  // Dialog closed
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      {/* Dialog */}
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-2xl">

        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
          <FiAlertTriangle size={32} />
        </div>

        {/* Heading */}
        <h2 className="mt-6 text-center text-2xl font-bold text-[var(--color-text-primary)]">
          Logout
        </h2>

        {/* Message */}
        <p className="mt-3 text-center text-sm leading-6 text-[var(--color-text-secondary)]">
          Are you sure you want to logout from your FashionStore
          account? You will need to sign in again to access your
          profile, orders, wishlist and wallet.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">

          {/* Cancel Button */}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-[var(--color-border-subtle)] px-5 py-3 font-semibold text-[var(--color-text-primary)] transition-all duration-300 hover:bg-[var(--color-surface-elevated)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging Out..." : "Logout"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default LogoutDialog;