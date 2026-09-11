import {
  useEffect,
  useState,
} from "react";

import {
  FaWallet,
  FaCoins,
  FaGift,
} from "react-icons/fa6";

import profileService from "../../services/profileService";

function CashbackCard() {
  // ====================================================
  // STATE
  // ====================================================

  const [wallet, setWallet] = useState({
    balance: 0,
    cashback: 0,
    referralBonus: 0,
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ====================================================
  // FETCH WALLET DATA
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
          Supports:

          {
            success: true,
            wallet: {...}
          }

          OR

          {
            success: true,
            data: {...}
          }

          OR direct wallet object
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
          "Cashback Wallet Fetch Error:",
          error
        );

        if (!mounted) return;

        setError(
          error.message ||
            "Failed to load cashback and rewards."
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
  // FORMAT MONEY
  // ====================================================

  const formatMoney = (amount) => {
    return Number(
      amount || 0
    ).toLocaleString("en-IN");
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">

          <div className="h-12 w-12 animate-pulse rounded-xl bg-[var(--color-surface)]" />

          <div className="flex-1">
            <div className="h-5 w-48 animate-pulse rounded bg-[var(--color-surface)]" />

            <div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded bg-[var(--color-surface)]" />
          </div>

        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-xl bg-[var(--color-surface)]"
              />
            )
          )}

        </div>

      </div>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error) {
    return (
      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
            <FaWallet size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              Cashback & Rewards
            </h2>

            <p className="text-sm text-[var(--color-text-secondary)]">
              Track your wallet balance,
              cashback and referral earnings.
            </p>
          </div>

        </div>

        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>

      </div>
    );
  }

  // ====================================================
  // CARDS DATA
  // ====================================================

  const cards = [
    {
      id: "wallet",
      label: "Wallet Balance",
      value: wallet.balance,
      icon: FaWallet,
      iconClass:
        "text-[var(--color-accent)]",
    },
    {
      id: "cashback",
      label: "Cashback",
      value: wallet.cashback,
      icon: FaCoins,
      iconClass:
        "text-yellow-500",
    },
    {
      id: "referral",
      label: "Referral Bonus",
      value: wallet.referralBonus,
      icon: FaGift,
      iconClass:
        "text-pink-500",
    },
  ];

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 shadow-sm">

      {/* ===============================================
          HEADER
      =============================================== */}

      <div className="mb-6 flex items-center gap-3">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
          <FaWallet size={22} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            Cashback & Rewards
          </h2>

          <p className="text-sm text-[var(--color-text-secondary)]">
            Track your wallet balance,
            cashback and referral earnings.
          </p>
        </div>

      </div>

      {/* ===============================================
          CARDS
      =============================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5"
            >
              <div className="flex items-center gap-3">

                <Icon
                  className={card.iconClass}
                  size={24}
                />

                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {card.label}
                  </p>

                  <h3 className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
                    ₹{formatMoney(card.value)}
                  </h3>
                </div>

              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}

export default CashbackCard;