import { Link } from "react-router-dom";
import { FiCreditCard } from "react-icons/fi";

function EmptyPayment() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] px-6 py-16 text-center">

      {/* Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
        <FiCreditCard size={38} />
      </div>

      {/* Heading */}
      <h2 className="mt-6 text-2xl font-bold text-[var(--color-text-primary)]">
        No Payment Methods Found
      </h2>

      {/* Description */}
      <p className="mt-3 max-w-md text-[15px] leading-7 text-[var(--color-text-secondary)]">
        You haven't added any payment methods yet.
        Add your bank account or UPI details to enjoy faster and secure
        checkout on FashionStore.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">

        <Link
          to="/profile/payments"
          className="rounded-xl bg-[var(--color-accent)] px-6 py-3 font-semibold text-black transition-all duration-300 hover:bg-[var(--color-accent-hover)]"
        >
          Add Payment Method
        </Link>

        <Link
          to="/profile"
          className="rounded-xl border border-[var(--color-border-subtle)] px-6 py-3 font-semibold text-[var(--color-text-primary)] transition-all duration-300 hover:bg-[var(--color-surface)]"
        >
          Back to Profile
        </Link>

      </div>

    </div>
  );
}

export default EmptyPayment;