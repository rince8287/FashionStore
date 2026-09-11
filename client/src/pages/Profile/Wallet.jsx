import { useState } from "react";
import { Link } from "react-router-dom";

import {
  FiArrowLeft,
  FiCreditCard,
  FiPlus,
  FiTrendingUp,
  FiDollarSign,
  FiRefreshCw,
} from "react-icons/fi";

import {
  WalletBalance,
  WalletCard,
  CashbackCard,
  RewardCard,
  WalletTransaction,
} from "../../components/profile";

function Wallet() {

  const [walletBalance] = useState(2450);
  const [cashbackBalance] = useState(650);
  const [rewardPoints] = useState(1825);

  /* ---------------- Transactions ---------------- */

  const transactions = [
    {
      id: 1,
      type: "Credit",
      title: "Cashback Reward",
      amount: "+₹200",
      date: "28 Jun 2026",
      status: "Success",
    },
    {
      id: 2,
      type: "Debit",
      title: "Order Payment",
      amount: "-₹899",
      date: "26 Jun 2026",
      status: "Success",
    },
    {
      id: 3,
      type: "Credit",
      title: "Referral Bonus",
      amount: "+₹300",
      date: "24 Jun 2026",
      status: "Success",
    },
    {
      id: 4,
      type: "Debit",
      title: "Fashion Purchase",
      amount: "-₹599",
      date: "22 Jun 2026",
      status: "Success",
    },
    {
      id: 5,
      type: "Credit",
      title: "Wallet Refund",
      amount: "+₹499",
      date: "20 Jun 2026",
      status: "Completed",
    },
  ];

  /* ---------------- Quick Actions ---------------- */

  const quickActions = [
    {
      title: "Payment Methods",
      subtitle: "Manage Cards & UPI",
      icon: <FiCreditCard />,
      link: "/payments",
    },
    {
      title: "Refund Status",
      subtitle: "Track your refunds",
      icon: <FiRefreshCw />,
      link: "/payment-refund",
    },
    {
      title: "Refer & Earn",
      subtitle: "Invite friends & earn",
      icon: <FiDollarSign />,
      link: "/refer-earn",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] px-3 py-5 sm:px-5 sm:py-6 lg:px-8 lg:py-8">

      <div className="mx-auto w-full max-w-6xl">

        {/* Back Button */}

        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent)]"
        >
          <FiArrowLeft size={18} />
          Back to Profile
        </Link>

        {/* Hero */}

        <div className="mt-5 overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-lime-500/20">

          <div className="flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:p-8">

            {/* Left */}

            <div>

              <div className="inline-flex rounded-2xl bg-green-500/20 p-4">

                <FiCreditCard
                  size={36}
                  className="text-green-400"
                />

              </div>

              <h1 className="mt-5 text-3xl font-bold text-[var(--color-text-primary)] lg:text-4xl">
                My Wallet
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                Manage wallet balance, cashback, rewards and transactions
                from one secure place.
              </p>

            </div>

            {/* Balance */}

            <div className="rounded-3xl bg-[var(--color-surface)] px-8 py-7 text-center shadow-lg">

              <FiDollarSign
                size={40}
                className="mx-auto text-[var(--color-accent)]"
              />

              <h2 className="mt-4 text-4xl font-bold text-[var(--color-accent)]">
                ₹{walletBalance}
              </h2>

              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                Available Balance
              </p>

            </div>

          </div>

        </div>

        {/* Wallet Summary */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <WalletBalance balance={walletBalance} />

          <CashbackCard cashback={cashbackBalance} />

          <RewardCard points={rewardPoints} />

        </div>
                {/* Add Money & Quick Actions */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* Add Money */}

          <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                  Add Money
                </h2>

                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  Instantly top up your wallet balance.
                </p>

              </div>

              <div className="rounded-2xl bg-[var(--color-accent-soft)] p-3">

                <FiPlus
                  size={24}
                  className="text-[var(--color-accent)]"
                />

              </div>

            </div>

            {/* Amount Buttons */}

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

              {[500, 1000, 2000, 5000].map((amount) => (

                <button
                  key={amount}
                  type="button"
                  className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-4 font-semibold text-[var(--color-text-primary)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  ₹{amount}
                </button>

              ))}

            </div>

            <button
              type="button"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent)] px-6 py-4 font-semibold text-black transition hover:bg-[var(--color-accent-hover)]"
            >
              <FiPlus />
              Add Money
            </button>

          </div>

          {/* Quick Actions */}

          <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6">

            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Quick Actions
            </h2>

            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Frequently used wallet features.
            </p>

            <div className="mt-6 space-y-4">

              {quickActions.map((action) => (

                <Link
                  key={action.title}
                  to={action.link}
                  className="group flex items-center justify-between rounded-2xl border border-transparent bg-[var(--color-surface)] p-5 transition-all duration-300 hover:border-[var(--color-accent)]"
                >

                  <div className="flex items-center gap-4">

                    <div className="rounded-xl bg-[var(--color-accent-soft)] p-3 text-[var(--color-accent)]">
                      {action.icon}
                    </div>

                    <div>

                      <h3 className="font-semibold text-[var(--color-text-primary)]">
                        {action.title}
                      </h3>

                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {action.subtitle}
                      </p>

                    </div>

                  </div>

                  <FiTrendingUp
                    size={20}
                    className="text-[var(--color-text-muted)] transition group-hover:text-[var(--color-accent)]"
                  />

                </Link>

              ))}

            </div>

          </div>

        </div>
                {/* Transaction History */}

        <div className="mt-6 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Recent Transactions
              </h2>

              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                Track all credits, debits, cashback and wallet refunds.
              </p>

            </div>

            {/* Filters */}

            <div className="flex flex-wrap gap-3">

              {["All", "Credit", "Debit", "Refund"].map((filter) => (

                <button
                  key={filter}
                  type="button"
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                    filter === "All"
                      ? "bg-[var(--color-accent)] text-black"
                      : "border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  }`}
                >
                  {filter}
                </button>

              ))}

            </div>

          </div>

          {/* Transaction List */}

          <div className="mt-6 space-y-4">

            {transactions.length ? (

              transactions.map((transaction) => (

                <WalletTransaction
                  key={transaction.id}
                  transaction={transaction}
                />

              ))

            ) : (

              <WalletCard
                title="No Transactions Yet"
                description="Your wallet activity will appear here once you start using it."
              />

            )}

          </div>

          {/* Footer */}

          <div className="mt-6 flex flex-col gap-3 border-t border-[var(--color-border-subtle)] pt-6 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-[var(--color-text-secondary)]">
              Showing last {transactions.length} transactions
            </p>

            <button
              type="button"
              className="rounded-2xl border border-[var(--color-border-subtle)] px-5 py-2 text-sm font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              View Full History
            </button>

          </div>

        </div>
                {/* Insights & Benefits */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* Wallet Insights */}

          <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6">

            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Wallet Insights
            </h2>

            <div className="mt-6 space-y-4">

              {[
                {
                  title: "Total Credits",
                  value: "₹999",
                  color: "text-green-400",
                },
                {
                  title: "Total Debits",
                  value: "₹1,498",
                  color: "text-red-400",
                },
                {
                  title: "Cashback Earned",
                  value: "₹650",
                  color: "text-[var(--color-accent)]",
                },
              ].map((item) => (

                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-2xl bg-[var(--color-surface)] p-4"
                >

                  <span className="text-[var(--color-text-secondary)]">
                    {item.title}
                  </span>

                  <span className={`font-bold ${item.color}`}>
                    {item.value}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* Wallet Benefits */}

          <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6">

            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Wallet Benefits
            </h2>

            <div className="mt-6 space-y-4">

              {[
                {
                  emoji: "💰",
                  title: "Instant Cashback",
                  desc: "Earn cashback on eligible purchases and special offers.",
                },
                {
                  emoji: "⚡",
                  title: "Fast Checkout",
                  desc: "Complete payments without entering card details every time.",
                },
                {
                  emoji: "🎁",
                  title: "Exclusive Rewards",
                  desc: "Get bonus rewards during seasonal campaigns.",
                },
              ].map((item) => (

                <div
                  key={item.title}
                  className="rounded-2xl bg-[var(--color-surface)] p-5"
                >

                  <h3 className="font-semibold text-[var(--color-text-primary)]">
                    {item.emoji} {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                    {item.desc}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* FAQ */}

        <div className="mt-6 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6">

          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Frequently Asked Questions
          </h2>

          <div className="mt-6 space-y-5">

            {[
              {
                q: "Can I withdraw wallet money?",
                a: "Wallet withdrawal depends on your account type and platform policy. Cashback is usually non-withdrawable.",
              },
              {
                q: "Does wallet balance expire?",
                a: "Wallet balance normally doesn't expire, but promotional cashback may have an expiry date.",
              },
              {
                q: "Is my wallet secure?",
                a: "Yes. Your wallet is protected with secure authentication and encrypted payment processing.",
              },
            ].map((item) => (

              <div
                key={item.q}
                className="rounded-2xl bg-[var(--color-surface)] p-5"
              >

                <h3 className="font-semibold text-[var(--color-text-primary)]">
                  {item.q}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                  {item.a}
                </p>

              </div>

            ))}

          </div>

        </div>
                {/* Bottom Action Section */}

        <div className="mt-8 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6">

          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">

            <div>

              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Ready to Shop?
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-text-secondary)]">
                Add money to your wallet and enjoy faster checkout,
                instant cashback and exclusive rewards on every purchase.
              </p>

            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent)] px-7 py-3 font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-[var(--color-accent-hover)]"
              >
                <FiPlus />
                Add Money
              </button>

              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-2xl border border-[var(--color-border-subtle)] px-7 py-3 font-semibold text-[var(--color-text-primary)] transition-all duration-300 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                Continue Shopping
              </Link>

            </div>

          </div>

        </div>

        {/* Footer */}

        <footer className="mt-8 border-t border-[var(--color-border-subtle)] py-6">

          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row">

            <p className="text-sm text-[var(--color-text-muted)]">
              © {new Date().getFullYear()} FashionStore. All Rights Reserved.
            </p>

            <div className="flex items-center gap-5">

              <Link
                to="/privacy-policy"
                className="text-sm text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent)]"
              >
                Privacy
              </Link>

              <Link
                to="/terms"
                className="text-sm text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent)]"
              >
                Terms
              </Link>

              <Link
                to="/help-center"
                className="text-sm text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent)]"
              >
                Help
              </Link>

            </div>

          </div>

        </footer>

      </div>

    </div>

  );
}

export default Wallet;