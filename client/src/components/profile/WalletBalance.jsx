import {
  useEffect,
  useState,
} from "react";

import {
  FiCreditCard,
  FiTrendingUp,
  FiGift,
  FiArrowRight,
} from "react-icons/fi";

import {
  Link,
} from "react-router-dom";

import profileService from "../../services/profileService";

function WalletBalance() {
  // ====================================================
  // STATE
  // ====================================================

  const [wallet, setWallet] =
    useState({
      balance: 0,
      cashback: 0,
      referralBonus: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ====================================================
  // FETCH WALLET
  // ====================================================

  useEffect(() => {
    let mounted = true;

    const fetchWallet = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await profileService.getWallet();

        if (!mounted) return;

        /*
          Supports responses like:

          {
            success: true,
            wallet: {...}
          }

          OR

          {
            success: true,
            data: {...}
          }

          OR direct wallet object.
        */

        const walletData =
          response?.wallet ||
          response?.data ||
          response ||
          {};

        setWallet({
          balance:
            Number(
              walletData.balance
            ) || 0,

          cashback:
            Number(
              walletData.cashback
            ) || 0,

          referralBonus:
            Number(
              walletData.referralBonus
            ) || 0,
        });
      } catch (error) {
        console.error(
          "Wallet Fetch Error:",
          error
        );

        if (!mounted) return;

        setError(
          error.message ||
            "Failed to load wallet."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchWallet();

    return () => {
      mounted = false;
    };
  }, []);

  // ====================================================
  // VALUES
  // ====================================================

  const {
    balance,
    cashback,
    referralBonus,
  } = wallet;

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 shadow-sm">

      {/* ===============================================
          HEADER
      =============================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
            <FiCreditCard
              size={26}
            />
          </div>

          <div>

            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              Wallet Balance
            </h2>

            <p className="text-sm text-[var(--color-text-secondary)]">
              Available balance for your
              next purchase.
            </p>

          </div>

        </div>

        <Link
          to="/profile/wallet"
          className="flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] transition hover:text-[var(--color-accent-hover)]"
        >
          View Wallet

          <FiArrowRight
            size={16}
          />
        </Link>

      </div>

      {/* ===============================================
          LOADING
      =============================================== */}

      {loading ? (
        <div className="mt-6">

          <div className="h-24 animate-pulse rounded-xl bg-[var(--color-surface)]" />

        </div>
      ) : error ? (

        /* =============================================
           ERROR
        ============================================= */

        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4">

          <p className="text-sm text-red-400">
            {error}
          </p>

        </div>

      ) : (
        <>
          {/* ===========================================
              BALANCE
          =========================================== */}

          <div className="mt-6 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">

            <p className="text-sm text-[var(--color-text-secondary)]">
              Available Balance
            </p>

            <h3 className="mt-2 text-3xl font-bold text-[var(--color-accent)] sm:text-4xl">
              ₹
              {balance.toLocaleString(
                "en-IN"
              )}
            </h3>

          </div>

          {/* ===========================================
              STATS
          =========================================== */}

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* CASHBACK */}

            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-500/10 text-green-500">

                  <FiTrendingUp
                    size={20}
                  />

                </div>

                <div>

                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Cashback
                  </p>

                  <h4 className="mt-1 text-lg font-semibold text-[var(--color-text-primary)]">
                    ₹
                    {cashback.toLocaleString(
                      "en-IN"
                    )}
                  </h4>

                </div>

              </div>

            </div>

            {/* REFERRAL BONUS */}

            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">

                  <FiGift
                    size={20}
                  />

                </div>

                <div>

                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Referral Bonus
                  </p>

                  <h4 className="mt-1 text-lg font-semibold text-[var(--color-text-primary)]">
                    ₹
                    {referralBonus.toLocaleString(
                      "en-IN"
                    )}
                  </h4>

                </div>

              </div>

            </div>

          </div>
        </>
      )}

    </div>
  );
}

export default WalletBalance;