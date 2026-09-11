import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiAlertCircle,
  FiCheckCircle,
  FiCreditCard,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiMapPin,
  FiPlus,
  FiRefreshCw,
  FiShield,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

import profileService from "../../services/profileService";

const DEFAULT_BANK_DETAILS = {
  accountHolder: "",
  bankName: "",
  accountNumber: "",
  ifsc: "",
  branch: "",
};

function safeValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return String(value);
  }

  return "";
}

function extractBankDetails(response) {
  const root =
    response?.data ||
    response ||
    {};

  const data =
    root?.bankDetails ||
    root?.data ||
    root ||
    {};

  return {
    accountHolder: safeValue(
      data?.accountHolder ??
        data?.accountHolderName ??
        data?.holderName ??
        data?.name
    ),

    bankName: safeValue(
      data?.bankName ??
        data?.bank ??
        data?.nameOfBank
    ),

    accountNumber: safeValue(
      data?.accountNumber ??
        data?.accountNo ??
        data?.account_number
    ),

    ifsc: safeValue(
      data?.ifsc ??
        data?.ifscCode ??
        data?.IFSC ??
        data?.IFSCCode
    ).toUpperCase(),

    branch: safeValue(
      data?.branch ??
        data?.branchName ??
        data?.branch_name
    ),
  };
}

function maskAccountNumber(
  accountNumber,
  showFull = false
) {
  if (!accountNumber) {
    return "Not Added";
  }

  const value = String(accountNumber);

  if (showFull) {
    return value;
  }

  if (value.length <= 4) {
    return value;
  }

  return `${"*".repeat(
    Math.max(value.length - 4, 4)
  )}${value.slice(-4)}`;
}

function BankDetailsCard({
  onAddBank,
  onEditBank,
  onRemoveBank,
}) {
  const [bankDetails, setBankDetails] =
    useState(DEFAULT_BANK_DETAILS);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showAccountNumber, setShowAccountNumber] =
    useState(false);

  const fetchBankDetails = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response =
          await profileService.getBankDetails();

        setBankDetails(
          extractBankDetails(response)
        );
      } catch (err) {
        console.error(
          "Bank Details Fetch Error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load bank details."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchBankDetails();
  }, [fetchBankDetails]);

  const hasBankDetails = useMemo(() => {
    return Boolean(
      bankDetails.accountHolder ||
        bankDetails.bankName ||
        bankDetails.accountNumber ||
        bankDetails.ifsc ||
        bankDetails.branch
    );
  }, [bankDetails]);

  const details = [
    {
      id: "accountHolder",
      label: "Account Holder",
      value: bankDetails.accountHolder,
      icon: FiUser,
    },
    {
      id: "bankName",
      label: "Bank Name",
      value: bankDetails.bankName,
      icon: FiCreditCard,
    },
    {
      id: "accountNumber",
      label: "Account Number",
      value: maskAccountNumber(
        bankDetails.accountNumber,
        showAccountNumber
      ),
      icon: FiCreditCard,
      mono: true,
    },
    {
      id: "ifsc",
      label: "IFSC Code",
      value: bankDetails.ifsc,
      icon: FiShield,
      mono: true,
    },
    {
      id: "branch",
      label: "Branch",
      value: bankDetails.branch,
      icon: FiMapPin,
      fullWidth: true,
    },
  ];

  if (loading) {
    return (
      <section className="rounded-3xl border border-border-subtle bg-surface p-5 shadow-sm sm:p-6 lg:p-7">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 animate-pulse rounded-2xl bg-surface-elevated" />

          <div className="flex-1">
            <div className="h-6 w-40 animate-pulse rounded bg-surface-elevated" />

            <div className="mt-3 h-4 w-64 max-w-full animate-pulse rounded bg-surface-elevated" />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className={`rounded-2xl border border-border-subtle bg-brand-bg p-5 ${
                item === 5
                  ? "sm:col-span-2"
                  : ""
              }`}
            >
              <div className="h-3 w-28 animate-pulse rounded bg-surface-elevated" />

              <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-surface-elevated" />
            </div>
          ))}
        </div>

        <div className="mt-6 h-20 animate-pulse rounded-2xl bg-surface-elevated" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-border-subtle bg-surface p-5 shadow-sm sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">
            <FiAlertCircle
              size={27}
              className="text-red-400"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
              Bank Details
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              We couldn't load your registered bank information.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm leading-6 text-red-400">
            {error}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              fetchBankDetails(true)
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-brand-bg transition-all duration-300 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Retrying..."
              : "Try Again"}
          </button>

          {onAddBank && (
            <button
              type="button"
              onClick={onAddBank}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface-elevated px-5 py-3 text-sm font-semibold text-text-primary transition-all duration-300 hover:border-accent hover:text-accent"
            >
              <FiPlus size={17} />
              Add Bank Account
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border-subtle bg-surface p-5 shadow-sm transition-all duration-300 sm:p-6 lg:p-7">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

      {/* Header */}

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent/20 bg-accent-soft text-accent shadow-inner">
            <FiCreditCard size={25} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
                Bank Details
              </h2>

              {hasBankDetails && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-[11px] font-semibold text-green-400">
                  <FiCheckCircle size={12} />
                  Added
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-text-secondary">
              Your registered bank account information.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              fetchBankDetails(true)
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface-elevated px-4 py-2.5 text-sm font-medium text-text-secondary transition-all duration-300 hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiRefreshCw
              size={15}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          {!hasBankDetails && onAddBank && (
            <button
              type="button"
              onClick={onAddBank}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-brand-bg transition-all duration-300 hover:bg-accent-hover"
            >
              <FiPlus size={16} />
              Add Bank
            </button>
          )}

          {hasBankDetails && onEditBank && (
            <button
              type="button"
              onClick={() =>
                onEditBank(bankDetails)
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface-elevated px-4 py-2.5 text-sm font-medium text-text-secondary transition-all duration-300 hover:border-accent hover:text-accent"
            >
              <FiEdit3 size={15} />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Status */}

      <div className="relative mt-6">
        {hasBankDetails ? (
          <div className="flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
            <FiCheckCircle
              size={19}
              className="mt-0.5 shrink-0 text-green-400"
            />

            <div>
              <p className="text-sm font-semibold text-green-400">
                Bank details available
              </p>

              <p className="mt-1 text-xs leading-5 text-text-secondary">
                Your bank account is saved securely. Sensitive information is masked by default.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <FiAlertCircle
                size={19}
                className="mt-0.5 shrink-0 text-yellow-400"
              />

              <div>
                <p className="text-sm font-semibold text-yellow-400">
                  Bank details not added
                </p>

                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  Add your bank account to use it for eligible payments, refunds or other supported transactions.
                </p>
              </div>
            </div>

            {onAddBank && (
              <button
                type="button"
                onClick={onAddBank}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-brand-bg transition hover:bg-accent-hover"
              >
                <FiPlus size={16} />
                Add Account
              </button>
            )}
          </div>
        )}
      </div>

      {/* Details */}

      <div className="relative mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {details.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={`group rounded-2xl border border-border-subtle bg-brand-bg p-4 transition-all duration-300 hover:border-accent/40 hover:shadow-sm ${
                item.fullWidth
                  ? "sm:col-span-2"
                  : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  size={15}
                  className="text-accent"
                />

                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                  {item.label}
                </span>
              </div>

              <div className="mt-3 flex min-h-[25px] items-center justify-between gap-3">
                <p
                  className={`break-all text-sm font-medium text-text-primary sm:text-base ${
                    item.mono
                      ? "font-mono tracking-wider"
                      : ""
                  }`}
                >
                  {item.value || (
                    <span className="font-normal text-text-muted">
                      Not Added
                    </span>
                  )}
                </p>

                {item.id ===
                  "accountNumber" &&
                  bankDetails.accountNumber && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowAccountNumber(
                          (previous) =>
                            !previous
                        )
                      }
                      className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border-subtle px-2.5 py-1.5 text-xs font-medium text-text-secondary transition hover:border-accent hover:text-accent"
                    >
                      {showAccountNumber ? (
                        <>
                          <FiEyeOff size={14} />
                          Hide
                        </>
                      ) : (
                        <>
                          <FiEye size={14} />
                          Show
                        </>
                      )}
                    </button>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Security */}

      <div className="relative mt-6 rounded-2xl border border-accent/10 bg-accent-soft/30 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
            <FiShield
              size={19}
              className="text-accent"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              Your banking information is private
            </h3>

            <p className="mt-1 text-xs leading-6 text-text-secondary">
              Your account number is masked by default. Only the last four digits are displayed for security.
            </p>
          </div>
        </div>
      </div>

      {/* Remove */}

      {hasBankDetails && onRemoveBank && (
        <div className="relative mt-5 flex justify-end">
          <button
            type="button"
            onClick={() =>
              onRemoveBank(bankDetails)
            }
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-400 transition-all duration-300 hover:border-red-500/40 hover:bg-red-500/10"
          >
            <FiTrash2 size={15} />
            Remove Bank
          </button>
        </div>
      )}
    </section>
  );
}

export default BankDetailsCard;