import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";

function PaymentRefund() {
  const [activeTab, setActiveTab] = useState("all");

  const refundRequests = [
    {
      id: "RF-100245",
      product: "Premium Denim Jacket",
      orderId: "ORD-458921",
      amount: "₹2,499",
      paymentMethod: "UPI",
      status: "Completed",
      requestDate: "12 June 2026",
      refundDate: "15 June 2026",
      reason: "Product was damaged during delivery.",
    },
    {
      id: "RF-100246",
      product: "Nike Running Shoes",
      orderId: "ORD-458955",
      amount: "₹4,999",
      paymentMethod: "Visa Card",
      status: "Pending",
      requestDate: "18 June 2026",
      refundDate: "Expected in 2 Days",
      reason: "Wrong size delivered.",
    },
    {
      id: "RF-100247",
      product: "Wireless Earbuds",
      orderId: "ORD-459011",
      amount: "₹1,799",
      paymentMethod: "PhonePe",
      status: "Rejected",
      requestDate: "22 June 2026",
      refundDate: "--",
      reason: "Return request submitted after return period.",
    },
  ];

  const filteredRefunds = useMemo(() => {
    if (activeTab === "all") return refundRequests;

    return refundRequests.filter(
      (refund) =>
        refund.status.toLowerCase() === activeTab.toLowerCase()
    );
  }, [activeTab]);

  const totalRefund = refundRequests.reduce((sum, refund) => {
    return sum + Number(refund.amount.replace(/[₹,]/g, ""));
  }, 0);

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] px-4 py-8">

      <div className="mx-auto max-w-7xl">

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

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                Payment & Refunds
              </h1>

              <p className="mt-3 text-[var(--color-text-secondary)]">
                Track all your refund requests, payment history,
                and refund status in one place.
              </p>

            </div>

            <div className="rounded-2xl bg-[var(--color-surface)] p-6 text-center">

              <p className="text-sm text-[var(--color-text-secondary)]">
                Total Refund Amount
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[var(--color-accent)]">
                ₹{totalRefund.toLocaleString()}
              </h2>

            </div>

          </div>

        </div>

        {/* Filter Tabs */}

        <div className="mt-8 flex flex-wrap gap-4">

          {[
            "all",
            "pending",
            "completed",
            "rejected",
          ].map((tab) => (

            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-5 py-3 font-semibold capitalize transition ${
                activeTab === tab
                  ? "bg-[var(--color-accent)] text-black"
                  : "bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]"
              }`}
            >
              {tab}
            </button>

          ))}

        </div>

        {/* Refund Cards Start */}

        <div className="mt-8 space-y-6">
                      {filteredRefunds.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-12 text-center">

              <FiRefreshCw
                size={50}
                className="mx-auto text-[var(--color-text-secondary)]"
              />

              <h2 className="mt-5 text-2xl font-bold text-[var(--color-text-primary)]">
                No Refund Requests Found
              </h2>

              <p className="mt-2 text-[var(--color-text-secondary)]">
                There are no refund requests available for this filter.
              </p>

            </div>

          ) : (

            filteredRefunds.map((refund) => (

              <div
                key={refund.id}
                className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6"
              >

                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                  {/* Left Section */}

                  <div className="space-y-4">

                    <div>

                      <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                        {refund.product}
                      </h2>

                      <p className="mt-2 text-[var(--color-text-secondary)]">
                        Refund ID : {refund.id}
                      </p>

                      <p className="text-[var(--color-text-secondary)]">
                        Order ID : {refund.orderId}
                      </p>

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <div>

                        <p className="text-sm text-[var(--color-text-secondary)]">
                          Refund Amount
                        </p>

                        <h3 className="mt-1 text-xl font-bold text-[var(--color-accent)]">
                          {refund.amount}
                        </h3>

                      </div>

                      <div>

                        <p className="text-sm text-[var(--color-text-secondary)]">
                          Payment Method
                        </p>

                        <h3 className="mt-1 font-semibold text-[var(--color-text-primary)]">
                          {refund.paymentMethod}
                        </h3>

                      </div>

                    </div>

                  </div>

                  {/* Status */}

                  <div>

                    {refund.status === "Completed" && (

                      <span className="inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 font-semibold text-green-400">

                        <FiCheckCircle />
                        Completed

                      </span>

                    )}

                    {refund.status === "Pending" && (

                      <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500/20 px-4 py-2 font-semibold text-yellow-400">

                        <FiClock />
                        Pending

                      </span>

                    )}

                    {refund.status === "Rejected" && (

                      <span className="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-2 font-semibold text-red-400">

                        <FiXCircle />
                        Rejected

                      </span>

                    )}

                  </div>

                </div>

                <div className="mt-8 border-t border-[var(--color-border-subtle)] pt-6">

                                      <div className="grid gap-6 lg:grid-cols-2">

                    {/* Refund Timeline */}

                    <div className="space-y-5">

                      <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                        Refund Timeline
                      </h3>

                      <div className="rounded-2xl bg-[var(--color-surface)] p-5">

                        <div className="flex items-start gap-3">

                          <FiClock
                            className="mt-1 text-[var(--color-accent)]"
                            size={20}
                          />

                          <div>

                            <p className="font-semibold text-[var(--color-text-primary)]">
                              Request Submitted
                            </p>

                            <p className="text-sm text-[var(--color-text-secondary)]">
                              {refund.requestDate}
                            </p>

                          </div>

                        </div>

                        <div className="my-4 ml-2 h-10 w-px bg-[var(--color-border-subtle)]" />

                        <div className="flex items-start gap-3">

                          <FiDollarSign
                            className="mt-1 text-[var(--color-accent)]"
                            size={20}
                          />

                          <div>

                            <p className="font-semibold text-[var(--color-text-primary)]">
                              Refund Status
                            </p>

                            <p className="text-sm text-[var(--color-text-secondary)]">
                              {refund.status}
                            </p>

                          </div>

                        </div>

                        <div className="my-4 ml-2 h-10 w-px bg-[var(--color-border-subtle)]" />

                        <div className="flex items-start gap-3">

                          <FiCheckCircle
                            className="mt-1 text-[var(--color-accent)]"
                            size={20}
                          />

                          <div>

                            <p className="font-semibold text-[var(--color-text-primary)]">
                              Refund Date
                            </p>

                            <p className="text-sm text-[var(--color-text-secondary)]">
                              {refund.refundDate}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* Refund Details */}

                    <div className="space-y-5">

                      <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                        Refund Details
                      </h3>

                      <div className="rounded-2xl bg-[var(--color-surface)] p-5">

                        <div className="mb-5">

                          <p className="text-sm text-[var(--color-text-secondary)]">
                            Refund Reason
                          </p>

                          <p className="mt-2 leading-7 text-[var(--color-text-primary)]">
                            {refund.reason}
                          </p>

                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">

                          <div>

                            <p className="text-sm text-[var(--color-text-secondary)]">
                              Payment Method
                            </p>

                            <p className="mt-1 font-semibold text-[var(--color-text-primary)]">
                              {refund.paymentMethod}
                            </p>

                          </div>

                          <div>

                            <p className="text-sm text-[var(--color-text-secondary)]">
                              Refund Amount
                            </p>

                            <p className="mt-1 font-semibold text-[var(--color-accent)]">
                              {refund.amount}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* Actions */}

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">

                    <button
                      type="button"
                      className="rounded-xl bg-[var(--color-accent)] px-6 py-3 font-semibold text-black transition hover:bg-[var(--color-accent-hover)]"
                    >
                      View Order
                    </button>

                    <button
                      type="button"
                      className="rounded-xl border border-[var(--color-border-subtle)] px-6 py-3 font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                    >
                      Contact Support
                    </button>

                  </div>

                </div>

              </div>

            ))

          )}
                  {/* Refund Information */}

        <div className="mt-10 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-8">

          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Refund Information
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div className="rounded-2xl bg-[var(--color-surface)] p-5">

              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Refund Processing Time
              </h3>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--color-text-secondary)]">
                <li>UPI & Wallet: 1–3 Business Days</li>
                <li>Debit/Credit Cards: 3–7 Business Days</li>
                <li>Net Banking: 3–5 Business Days</li>
                <li>Cash on Delivery: 5–7 Business Days</li>
              </ul>

            </div>

            <div className="rounded-2xl bg-[var(--color-surface)] p-5">

              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Important Notes
              </h3>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--color-text-secondary)]">
                <li>Refunds begin only after the returned item passes quality inspection.</li>
                <li>Shipping charges are generally non-refundable.</li>
                <li>Bank processing times may vary.</li>
                <li>You'll receive email and SMS updates for every refund status change.</li>
              </ul>

            </div>

          </div>

        </div>

      </div>

    </div>
        </div>
        
  );
}

export default PaymentRefund;
            