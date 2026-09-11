import {
  useMemo,
  useState,
} from "react";

import {
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiEdit3,
  FiLoader,
  FiShield,
  FiSmartphone,
  FiTrash2,
  FiXCircle,
} from "react-icons/fi";

function normalizeStatus(status) {
  return String(status || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function getVerificationStatus(status) {
  const value = normalizeStatus(status);

  if (
    value === "verified" ||
    value === "success" ||
    value === "approved" ||
    value === "active"
  ) {
    return {
      key: "verified",
      label: "Verified",
      icon: FiCheckCircle,
      className:
        "border-green-500/20 bg-green-500/10 text-green-400",
    };
  }

  if (
    value === "pending" ||
    value === "verification_pending" ||
    value === "processing" ||
    value === "under_review"
  ) {
    return {
      key: "pending",
      label: "Verification Pending",
      icon: FiClock,
      className:
        "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    };
  }

  if (
    value === "failed" ||
    value === "rejected" ||
    value === "verification_failed" ||
    value === "invalid"
  ) {
    return {
      key: "failed",
      label: "Verification Failed",
      icon: FiXCircle,
      className:
        "border-red-500/20 bg-red-500/10 text-red-400",
    };
  }

  return {
    key: "not_verified",
    label: "Not Verified",
    icon: FiShield,
    className:
      "border-orange-500/20 bg-orange-500/10 text-orange-400",
  };
}

function safeText(value) {
  if (
    value === null ||
    value === undefined
  ) {
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

function UpiDetailsCard({
  app = "UPI",
  upiId = "",
  provider = "",
  verificationStatus = "not_verified",
  isDefault = false,

  onVerify,
  onRemove,
  onEdit,

  verifying = false,
}) {
  const [localStatus, setLocalStatus] =
    useState(verificationStatus);

  const [localVerifying, setLocalVerifying] =
    useState(false);

  const finalVerifying =
    verifying || localVerifying;

  const verification = useMemo(
    () =>
      getVerificationStatus(
        localStatus
      ),
    [localStatus]
  );

  const VerificationIcon =
    verification.icon;

  const cleanUpiId =
    safeText(upiId);

  const cleanProvider =
    safeText(provider || app);

  const hasUpi =
    Boolean(cleanUpiId);

  const isVerified =
    verification.key === "verified";

  const isPending =
    verification.key === "pending";

  const handleVerify = async () => {
    if (!hasUpi) {
      return;
    }

    if (isVerified || finalVerifying) {
      return;
    }

    if (!onVerify) {
      return;
    }

    try {
      setLocalVerifying(true);

      const result =
        await onVerify({
          upiId: cleanUpiId,
          provider: cleanProvider,
          verificationStatus:
            verification.key,
        });

      const returnedStatus =
        result?.verificationStatus ||
        result?.status ||
        result?.data?.verificationStatus ||
        result?.data?.status ||
        result?.upiDetails?.verificationStatus;

      if (returnedStatus) {
        setLocalStatus(
          returnedStatus
        );
      }
    } catch (error) {
      console.error(
        "UPI Verification Error:",
        error
      );
    } finally {
      setLocalVerifying(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border-subtle bg-surface-elevated p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl sm:p-6">
      {/* Background Glow */}

      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl transition-all duration-500 group-hover:bg-accent/20" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 h-40 w-40 rounded-full bg-accent/5 blur-3xl" />

      {/* Header */}

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent/20 bg-accent-soft text-accent shadow-inner">
            <FiSmartphone size={24} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-lg font-bold text-text-primary">
                {cleanProvider || "UPI"}
              </h3>

              {isDefault && (
                <span className="inline-flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-green-400">
                  <FiCheckCircle size={11} />
                  Default
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-text-muted">
              Saved UPI payment account
            </p>
          </div>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-surface text-text-secondary">
          <FiCreditCard size={18} />
        </div>
      </div>

      {/* UPI ID */}

      <div className="relative mt-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">
            UPI ID
          </p>

          {hasUpi && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
              Payment Account
            </span>
          )}
        </div>

        <div className="rounded-2xl border border-border-subtle bg-brand-bg px-4 py-4 transition-colors duration-300 group-hover:border-border-subtle/80">
          {hasUpi ? (
            <p className="break-all font-mono text-sm font-semibold text-text-primary sm:text-base">
              {cleanUpiId}
            </p>
          ) : (
            <div className="flex items-center gap-2">
              <FiAlertCircle
                size={16}
                className="text-orange-400"
              />

              <p className="text-sm font-medium text-text-muted">
                UPI ID not added
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Verification */}

      <div className="relative mt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">
            Verification Status
          </p>

          <FiShield
            size={15}
            className="text-text-muted"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold ${verification.className}`}
          >
            {finalVerifying ? (
              <FiLoader
                size={15}
                className="animate-spin"
              />
            ) : (
              <VerificationIcon
                size={15}
              />
            )}

            {finalVerifying
              ? "Verifying..."
              : verification.label}
          </span>

          {isVerified && (
            <span className="text-xs font-medium text-green-400">
              UPI account verified
            </span>
          )}

          {isPending && !finalVerifying && (
            <span className="text-xs font-medium text-yellow-400">
              Verification is in progress
            </span>
          )}
        </div>
      </div>

      {/* Provider */}

      {cleanProvider && (
        <div className="relative mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">
            Provider
          </p>

          <div className="rounded-2xl border border-border-subtle bg-brand-bg px-4 py-3">
            <p className="text-sm font-medium text-text-primary">
              {cleanProvider}
            </p>
          </div>
        </div>
      )}

      {/* Security */}

      <div className="relative mt-5 flex items-start gap-3 rounded-2xl border border-accent/10 bg-accent-soft/40 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10">
          <FiShield
            size={17}
            className="text-accent"
          />
        </div>

        <div>
          <p className="text-xs font-semibold text-text-primary">
            Secure UPI information
          </p>

          <p className="mt-1 text-xs leading-5 text-text-secondary">
            Your UPI details are securely stored and used only for supported payment transactions.
          </p>
        </div>
      </div>

      {/* Actions */}

      <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Verify */}

        {hasUpi &&
          !isVerified &&
          onVerify && (
            <button
              type="button"
              onClick={handleVerify}
              disabled={
                finalVerifying ||
                isPending
              }
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-semibold text-accent transition-all duration-300 hover:border-accent hover:bg-accent hover:text-brand-bg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {finalVerifying ? (
                <>
                  <FiLoader
                    size={17}
                    className="animate-spin"
                  />
                  Verifying...
                </>
              ) : isPending ? (
                <>
                  <FiClock size={17} />
                  Verification Pending
                </>
              ) : (
                <>
                  <FiCheckCircle size={17} />
                  Verify UPI
                </>
              )}
            </button>
          )}

        {/* Edit */}

        {onEdit && (
          <button
            type="button"
            onClick={() =>
              onEdit({
                upiId: cleanUpiId,
                provider: cleanProvider,
                verificationStatus:
                  localStatus,
                isDefault,
              })
            }
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm font-semibold text-text-secondary transition-all duration-300 hover:border-accent hover:text-accent"
          >
            <FiEdit3 size={17} />
            Edit UPI
          </button>
        )}

        {/* Remove */}

        {onRemove && (
          <button
            type="button"
            onClick={() =>
              onRemove({
                upiId: cleanUpiId,
                provider: cleanProvider,
              })
            }
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-semibold text-red-400 transition-all duration-300 hover:border-red-500/40 hover:bg-red-500/10"
          >
            <FiTrash2 size={17} />
            Remove UPI
          </button>
        )}
      </div>

      {/* Empty State */}

      {!hasUpi && (
        <div className="relative mt-5 rounded-2xl border border-dashed border-orange-500/20 bg-orange-500/5 p-4">
          <div className="flex items-start gap-3">
            <FiShield
              size={18}
              className="mt-0.5 shrink-0 text-orange-400"
            />

            <div>
              <p className="text-sm font-semibold text-orange-400">
                UPI verification unavailable
              </p>

              <p className="mt-1 text-xs leading-5 text-text-secondary">
                Add a UPI ID first. After adding it, you can start the verification process.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpiDetailsCard;