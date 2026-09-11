import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiGift,
  FiUsers,
  FiDollarSign,
  FiCopy,
  FiShare2,
} from "react-icons/fi";

function ReferEarn() {
  const referralCode = "PRINCE2026";

  const [copied, setCopied] = useState(false);

  const referralHistory = [
    {
      id: 1,
      name: "Rahul Sharma",
      joined: "15 June 2026",
      reward: "₹200",
      status: "Completed",
    },
    {
      id: 2,
      name: "Aman Verma",
      joined: "21 June 2026",
      reward: "₹200",
      status: "Completed",
    },
    {
      id: 3,
      name: "Priya Singh",
      joined: "28 June 2026",
      reward: "Pending",
      status: "Pending",
    },
  ];

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

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

        <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 p-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="inline-flex rounded-full bg-yellow-500/20 p-4">

                <FiGift
                  size={40}
                  className="text-yellow-400"
                />

              </div>

              <h1 className="mt-5 text-4xl font-bold text-[var(--color-text-primary)]">
                Refer & Earn
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-[var(--color-text-secondary)]">
                Invite your friends to FashionStore and earn exciting cashback
                rewards every time someone signs up using your referral code.
              </p>

            </div>

            <div className="rounded-2xl bg-[var(--color-surface)] p-6">

              <p className="text-sm text-[var(--color-text-secondary)]">
                Total Earnings
              </p>

              <h2 className="mt-2 text-4xl font-bold text-[var(--color-accent)]">
                ₹400
              </h2>

            </div>

          </div>

        </div>

        {/* Stats */}

        <div className="mt-8 grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6">

            <FiUsers
              size={35}
              className="text-blue-400"
            />

            <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
              Total Referrals
            </h3>

            <p className="mt-2 text-3xl font-bold text-[var(--color-accent)]">
              3
            </p>

          </div>

          <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6">

            <FiDollarSign
              size={35}
              className="text-green-400"
            />

            <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
              Completed Rewards
            </h3>

            <p className="mt-2 text-3xl font-bold text-green-400">
              2
            </p>

          </div>

          <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6">

            <FiShare2
              size={35}
              className="text-purple-400"
            />

            <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
              Pending Rewards
            </h3>

            <p className="mt-2 text-3xl font-bold text-yellow-400">
              1
            </p>

          </div>

        </div>

        {/* Referral Code Section Starts */}

        <div className="mt-8">
                      <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-8">

            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Your Referral Code
            </h2>

            <p className="mt-2 text-[var(--color-text-secondary)]">
              Share this referral code with your friends. When they sign up and
              place their first order, both of you will receive exciting rewards.
            </p>

            <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-dashed border-[var(--color-accent)] bg-[var(--color-surface)] p-6 md:flex-row md:items-center md:justify-between">

              <div>

                <p className="text-sm text-[var(--color-text-secondary)]">
                  Referral Code
                </p>

                <h2 className="mt-2 text-4xl font-bold tracking-widest text-[var(--color-accent)]">
                  {referralCode}
                </h2>

              </div>

              <button
                type="button"
                onClick={copyReferralCode}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3 font-semibold text-black transition hover:bg-[var(--color-accent-hover)]"
              >
                <FiCopy />

                {copied ? "Copied!" : "Copy Code"}

              </button>

            </div>

            {/* Share Buttons */}

            <div className="mt-10">

              <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Share With Friends
              </h3>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <button
                  type="button"
                  className="rounded-2xl bg-green-600 px-5 py-4 font-semibold text-white transition hover:bg-green-700"
                >
                  WhatsApp
                </button>

                <button
                  type="button"
                  className="rounded-2xl bg-blue-500 px-5 py-4 font-semibold text-white transition hover:bg-blue-600"
                >
                  Telegram
                </button>

                <button
                  type="button"
                  className="rounded-2xl bg-blue-700 px-5 py-4 font-semibold text-white transition hover:bg-blue-800"
                >
                  Facebook
                </button>

                <button
                  type="button"
                  className="rounded-2xl bg-black px-5 py-4 font-semibold text-white transition hover:bg-neutral-800"
                >
                  X (Twitter)
                </button>

              </div>

            </div>

          </div>

          {/* Rewards & History Section Starts */}

          <div className="mt-8">
                      <div className="grid gap-8 lg:grid-cols-2">

            {/* Rewards Section */}

            <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-8">

              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Referral Rewards
              </h2>

              <div className="mt-6 space-y-5">

                <div className="rounded-2xl bg-[var(--color-surface)] p-5">
                  <h3 className="font-semibold text-[var(--color-text-primary)]">
                    🎉 Invite One Friend
                  </h3>

                  <p className="mt-2 text-[var(--color-text-secondary)]">
                    Earn <span className="font-bold text-[var(--color-accent)]">₹200</span> when your friend places their first successful order.
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--color-surface)] p-5">
                  <h3 className="font-semibold text-[var(--color-text-primary)]">
                    🛍️ Friend Reward
                  </h3>

                  <p className="mt-2 text-[var(--color-text-secondary)]">
                    Your friend also receives a welcome reward after using your referral code.
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--color-surface)] p-5">
                  <h3 className="font-semibold text-[var(--color-text-primary)]">
                    🚀 Unlimited Referrals
                  </h3>

                  <p className="mt-2 text-[var(--color-text-secondary)]">
                    Invite unlimited friends and keep earning exciting cashback rewards.
                  </p>
                </div>

              </div>

            </div>

            {/* Referral History */}

            <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-8">

              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Referral History
              </h2>

              <div className="mt-6 space-y-4">

                {referralHistory.map((user) => (

                  <div
                    key={user.id}
                    className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5"
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <h3 className="font-semibold text-[var(--color-text-primary)]">
                          {user.name}
                        </h3>

                        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                          Joined: {user.joined}
                        </p>

                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          user.status === "Completed"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {user.status}
                      </span>

                    </div>

                    <div className="mt-4 flex items-center justify-between">

                      <p className="text-[var(--color-text-secondary)]">
                        Reward
                      </p>

                      <h4 className="font-bold text-[var(--color-accent)]">
                        {user.reward}
                      </h4>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* How It Works */}

          <div className="mt-10 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-8">

            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              How It Works
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-3">

              <div className="rounded-2xl bg-[var(--color-surface)] p-6">

                <div className="text-4xl">1️⃣</div>

                <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
                  Share Your Code
                </h3>

                <p className="mt-2 text-[var(--color-text-secondary)]">
                  Send your referral code to friends using WhatsApp, Telegram, Facebook or X.
                </p>

              </div>

              <div className="rounded-2xl bg-[var(--color-surface)] p-6">

                <div className="text-4xl">2️⃣</div>

                <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
                  Friend Signs Up
                </h3>

                <p className="mt-2 text-[var(--color-text-secondary)]">
                  Your friend creates an account and places the first successful order.
                </p>

              </div>

              <div className="rounded-2xl bg-[var(--color-surface)] p-6">

                <div className="text-4xl">3️⃣</div>

                <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
                  Earn Rewards
                </h3>

                <p className="mt-2 text-[var(--color-text-secondary)]">
                  Cashback is automatically credited to your account after verification.
                </p>

              </div>

            </div>

          </div>

          {/* FAQ Section Starts */}

          <div className="mt-8">
                      <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-8">

            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Frequently Asked Questions
            </h2>

            <div className="mt-6 space-y-6">

              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)]">
                  How many friends can I invite?
                </h3>

                <p className="mt-2 text-[var(--color-text-secondary)]">
                  You can invite unlimited friends and earn rewards for every
                  successful referral.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)]">
                  When will I receive my reward?
                </h3>

                <p className="mt-2 text-[var(--color-text-secondary)]">
                  Rewards are credited after your friend completes their first
                  successful order and the order is verified.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)]">
                  Where can I use my rewards?
                </h3>

                <p className="mt-2 text-[var(--color-text-secondary)]">
                  Rewards can be used during checkout on eligible purchases or
                  as wallet cashback, depending on the offer.
                </p>
              </div>

            </div>

            {/* Action Buttons */}

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

              <button
                type="button"
                className="rounded-2xl bg-[var(--color-accent)] px-8 py-4 text-lg font-semibold text-black transition hover:bg-[var(--color-accent-hover)]"
              >
                Invite Friends
              </button>

              <Link
                to="/"
                className="rounded-2xl border border-[var(--color-border-subtle)] px-8 py-4 text-center text-lg font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                Continue Shopping
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
     </div>
          </div>
  );
}

export default ReferEarn;
         
        