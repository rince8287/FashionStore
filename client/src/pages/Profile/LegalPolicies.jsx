import { useState } from "react";
import {
  FiArrowLeft,
  FiFileText,
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiCreditCard,
} from "react-icons/fi";
import { Link } from "react-router-dom";

function LegalPolicies() {
  const [activePolicy, setActivePolicy] = useState("privacy");

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] px-4 py-8">

      <div className="mx-auto max-w-6xl">

        {/* Back Button */}

        <Link
          to="/profile"
          className="mb-6 inline-flex items-center gap-2 text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent)]"
        >
          <FiArrowLeft size={18} />
          Back to Profile
        </Link>

        {/* Header */}

        <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-8">

          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Legal Policies
          </h1>

          <p className="mt-3 text-[var(--color-text-secondary)] leading-7">
            Please read our legal policies carefully before using
            FashionStore services.
          </p>

        </div>

        {/* Policy Navigation */}

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">

          <button
            onClick={() => setActivePolicy("privacy")}
            className={`rounded-2xl p-5 transition ${
              activePolicy === "privacy"
                ? "bg-[var(--color-accent)] text-black"
                : "bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]"
            }`}
          >
            <FiShield className="mx-auto mb-2" size={24} />
            <p className="font-semibold">Privacy</p>
          </button>

          <button
            onClick={() => setActivePolicy("terms")}
            className={`rounded-2xl p-5 transition ${
              activePolicy === "terms"
                ? "bg-[var(--color-accent)] text-black"
                : "bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]"
            }`}
          >
            <FiFileText className="mx-auto mb-2" size={24} />
            <p className="font-semibold">Terms</p>
          </button>

          <button
            onClick={() => setActivePolicy("shipping")}
            className={`rounded-2xl p-5 transition ${
              activePolicy === "shipping"
                ? "bg-[var(--color-accent)] text-black"
                : "bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]"
            }`}
          >
            <FiTruck className="mx-auto mb-2" size={24} />
            <p className="font-semibold">Shipping</p>
          </button>

          <button
            onClick={() => setActivePolicy("returns")}
            className={`rounded-2xl p-5 transition ${
              activePolicy === "returns"
                ? "bg-[var(--color-accent)] text-black"
                : "bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]"
            }`}
          >
            <FiRefreshCw className="mx-auto mb-2" size={24} />
            <p className="font-semibold">Returns</p>
          </button>

          <button
            onClick={() => setActivePolicy("refund")}
            className={`rounded-2xl p-5 transition ${
              activePolicy === "refund"
                ? "bg-[var(--color-accent)] text-black"
                : "bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]"
            }`}
          >
            <FiCreditCard className="mx-auto mb-2" size={24} />
            <p className="font-semibold">Refunds</p>
          </button>

        </div>

        {/* Policy Content */}

        <div className="mt-8 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-8">
                      {/* Privacy Policy */}

          {activePolicy === "privacy" && (
            <div className="space-y-6">

              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Privacy Policy
              </h2>

              <p className="leading-8 text-[var(--color-text-secondary)]">
                We respect your privacy and are committed to protecting your
                personal information. The information you provide is used only
                to process your orders, improve our services and provide better
                customer support.
              </p>

              <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Information We Collect
              </h3>

              <ul className="list-disc space-y-3 pl-6 text-[var(--color-text-secondary)]">
                <li>Name, email address and mobile number.</li>
                <li>Shipping and billing addresses.</li>
                <li>Order history and payment preferences.</li>
                <li>Device and browser information for security.</li>
              </ul>

              <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                How We Use Your Information
              </h3>

              <ul className="list-disc space-y-3 pl-6 text-[var(--color-text-secondary)]">
                <li>To process and deliver your orders.</li>
                <li>To improve website performance.</li>
                <li>To send order updates and promotional offers.</li>
                <li>To prevent fraud and unauthorized access.</li>
              </ul>

            </div>
          )}

          {/* Terms & Conditions */}

          {activePolicy === "terms" && (
            <div className="space-y-6">

              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Terms & Conditions
              </h2>

              <p className="leading-8 text-[var(--color-text-secondary)]">
                By accessing or using FashionStore, you agree to comply with
                these terms and conditions.
              </p>

              <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                User Responsibilities
              </h3>

              <ul className="list-disc space-y-3 pl-6 text-[var(--color-text-secondary)]">
                <li>Provide accurate personal information.</li>
                <li>Maintain the confidentiality of your account.</li>
                <li>Do not misuse or attempt to hack the platform.</li>
                <li>Follow all applicable laws while using our services.</li>
              </ul>

              <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Orders
              </h3>

              <p className="leading-8 text-[var(--color-text-secondary)]">
                FashionStore reserves the right to cancel or refuse any order
                due to stock availability, pricing errors, suspicious activity,
                or payment verification issues.
              </p>

            </div>
          )}

          {/* Shipping Policy */}

          {activePolicy === "shipping" && (
            <div className="space-y-6">

              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Shipping Policy
              </h2>

              <p className="leading-8 text-[var(--color-text-secondary)]">
                We strive to deliver your products safely and on time across
                India.
              </p>

              <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Delivery Timeline
              </h3>

              <ul className="list-disc space-y-3 pl-6 text-[var(--color-text-secondary)]">
                <li>Metro Cities: 2–4 Business Days</li>
                <li>Other Cities: 3–7 Business Days</li>
                <li>Remote Areas: 5–10 Business Days</li>
              </ul>

              <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Important Notes
              </h3>

              <ul className="list-disc space-y-3 pl-6 text-[var(--color-text-secondary)]">
                <li>Delivery time may increase during festivals.</li>
                <li>Tracking details will be shared after dispatch.</li>
                <li>Delivery depends on courier availability.</li>
              </ul>

            </div>
          )}
                    {/* Return Policy */}

          {activePolicy === "returns" && (
            <div className="space-y-6">

              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Return Policy
              </h2>

              <p className="leading-8 text-[var(--color-text-secondary)]">
                Customer satisfaction is our priority. If you receive a damaged,
                defective, or incorrect product, you may request a return within
                7 days of delivery.
              </p>

              <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Eligible Returns
              </h3>

              <ul className="list-disc space-y-3 pl-6 text-[var(--color-text-secondary)]">
                <li>Damaged or defective products.</li>
                <li>Wrong product delivered.</li>
                <li>Missing accessories or parts.</li>
                <li>Unused items returned in original packaging.</li>
              </ul>

              <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Non-Returnable Items
              </h3>

              <ul className="list-disc space-y-3 pl-6 text-[var(--color-text-secondary)]">
                <li>Personal care products.</li>
                <li>Gift cards and digital products.</li>
                <li>Products damaged due to customer misuse.</li>
                <li>Items returned after the return window expires.</li>
              </ul>

            </div>
          )}

          {/* Refund Policy */}

          {activePolicy === "refund" && (
            <div className="space-y-6">

              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Refund Policy
              </h2>

              <p className="leading-8 text-[var(--color-text-secondary)]">
                Once your returned product passes our quality inspection,
                refunds will be processed to the original payment method.
              </p>

              <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Refund Timeline
              </h3>

              <ul className="list-disc space-y-3 pl-6 text-[var(--color-text-secondary)]">
                <li>UPI & Wallet: 1–3 Business Days</li>
                <li>Debit/Credit Card: 3–7 Business Days</li>
                <li>Net Banking: 3–5 Business Days</li>
                <li>Cash on Delivery: Bank Transfer within 5–7 Business Days</li>
              </ul>

              <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Important Information
              </h3>

              <ul className="list-disc space-y-3 pl-6 text-[var(--color-text-secondary)]">
                <li>Shipping charges are generally non-refundable.</li>
                <li>Refund processing may be delayed during holidays.</li>
                <li>You will receive an email once your refund is initiated.</li>
                <li>For refund issues, contact our support team.</li>
              </ul>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default LegalPolicies;
      