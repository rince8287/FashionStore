import { useState } from "react";

import {
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiGift,
  FiLoader,
  FiTag,
  FiX,
} from "react-icons/fi";

function CouponBox({
  onApplyCoupon,
  loading = false,
}) {
  // =========================================================
  // STATE
  // =========================================================

  const [couponCode, setCouponCode] =
    useState("");

  const [showCouponBox, setShowCouponBox] =
    useState(false);

  const [appliedCoupon, setAppliedCoupon] =
    useState("");

  // =========================================================
  // APPLY COUPON
  // =========================================================

  const handleApply = () => {
    const code =
      couponCode.trim().toUpperCase();

    if (!code || loading) {
      return;
    }

    setAppliedCoupon(code);

    if (
      typeof onApplyCoupon ===
      "function"
    ) {
      onApplyCoupon(code);
    }
  };

  // =========================================================
  // REMOVE COUPON
  // =========================================================

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon("");

    if (
      typeof onApplyCoupon ===
      "function"
    ) {
      onApplyCoupon("");
    }
  };

  // =========================================================
  // TOGGLE
  // =========================================================

  const toggleCouponBox = () => {
    setShowCouponBox(
      (previous) => !previous
    );
  };

  // =========================================================
  // COMPONENT
  // =========================================================

  return (
    <section
      className="
        w-full
        overflow-hidden
        rounded-xl
        border
        border-border-subtle
        bg-surface
        transition-all
        duration-300
        hover:border-accent/20
      "
    >
      {/* =====================================================
          COMPACT HEADER
      ===================================================== */}

      <button
        type="button"
        onClick={toggleCouponBox}
        aria-expanded={showCouponBox}
        className="
          group
          flex
          w-full
          items-center
          justify-between
          gap-3
          px-4
          py-3.5
          text-left
          outline-none
          transition-all
          duration-200
          hover:bg-accent/[0.025]
          focus-visible:ring-2
          focus-visible:ring-accent/30
          sm:px-4.5
        "
      >
        {/* LEFT */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >
          {/* ICON */}

          <div
            className={`
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              transition-all
              duration-300
              ${
                appliedCoupon
                  ? `
                    border-green-500/20
                    bg-green-500/10
                    text-green-400
                  `
                  : `
                    border-accent/20
                    bg-accent-soft
                    text-accent
                    group-hover:border-accent/35
                  `
              }
            `}
          >
            {appliedCoupon ? (
              <FiCheck
                size={16}
                strokeWidth={2.5}
              />
            ) : (
              <FiGift size={16} />
            )}
          </div>

          {/* TEXT */}

          <div className="min-w-0">
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <h2
                className="
                  text-sm
                  font-bold
                  text-text-primary
                "
              >
                {appliedCoupon
                  ? "Coupon Applied"
                  : "Have a coupon?"}
              </h2>

              {appliedCoupon && (
                <span
                  className="
                    max-w-[130px]
                    truncate
                    rounded-full
                    bg-green-500/10
                    px-2
                    py-0.5
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-green-400
                  "
                >
                  {appliedCoupon}
                </span>
              )}
            </div>

            <p
              className="
                mt-0.5
                truncate
                text-[9px]
                text-text-muted
                sm:text-[10px]
              "
            >
              {appliedCoupon
                ? "Your discount has been added."
                : "Unlock available savings on your order."}
            </p>
          </div>
        </div>

        {/* RIGHT */}

        <div
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-border-subtle
            text-text-muted
            transition-all
            duration-300
            group-hover:border-accent/30
            group-hover:text-accent
          "
        >
          {showCouponBox ? (
            <FiChevronUp size={13} />
          ) : (
            <FiChevronDown size={13} />
          )}
        </div>
      </button>

      {/* =====================================================
          EXPANDABLE BODY
      ===================================================== */}

      <div
        className={`
          grid
          transition-all
          duration-300
          ease-out
          ${
            showCouponBox
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className="
              border-t
              border-border-subtle
              px-4
              pb-4
              pt-3.5
              sm:px-4.5
            "
          >
            {/* =================================================
                APPLIED STATE
            ================================================= */}

            {appliedCoupon ? (
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  rounded-lg
                  border
                  border-green-500/20
                  bg-green-500/[0.06]
                  px-3
                  py-2.5
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-2.5
                  "
                >
                  <div
                    className="
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-green-500/10
                      text-green-400
                    "
                  >
                    <FiCheck
                      size={13}
                      strokeWidth={3}
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        text-[10px]
                        font-bold
                        text-green-400
                      "
                    >
                      Coupon applied
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-[9px]
                        text-text-muted
                      "
                    >
                      {appliedCoupon}
                    </p>
                  </div>
                </div>

                {/* REMOVE */}

                <button
                  type="button"
                  onClick={
                    handleRemoveCoupon
                  }
                  disabled={loading}
                  className="
                    flex
                    h-7
                    shrink-0
                    items-center
                    gap-1
                    rounded-md
                    border
                    border-red-500/20
                    px-2
                    text-[9px]
                    font-semibold
                    text-red-400
                    transition-all
                    duration-200
                    hover:bg-red-500/10
                    active:scale-95
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <FiX size={11} />

                  Remove
                </button>
              </div>
            ) : (
              /* =================================================
                  INPUT STATE
              ================================================= */

              <div
                className="
                  flex
                  flex-col
                  gap-2
                  sm:flex-row
                "
              >
                {/* INPUT */}

                <div
                  className="
                    relative
                    min-w-0
                    flex-1
                  "
                >
                  <FiTag
                    size={14}
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-text-muted
                    "
                  />

                  <input
                    type="text"
                    value={
                      couponCode
                    }
                    placeholder="Enter coupon code"
                    aria-label="Coupon code"
                    autoComplete="off"
                    spellCheck="false"
                    onChange={(event) =>
                      setCouponCode(
                        event.target.value.toUpperCase()
                      )
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key ===
                        "Enter"
                      ) {
                        handleApply();
                      }
                    }}
                    className="
                      h-10
                      w-full
                      rounded-lg
                      border
                      border-border-subtle
                      bg-brand-bg
                      pl-9
                      pr-3
                      text-xs
                      font-medium
                      tracking-wide
                      text-text-primary
                      outline-none
                      transition-all
                      duration-200
                      placeholder:font-normal
                      placeholder:tracking-normal
                      placeholder:text-text-muted/60
                      focus:border-accent/60
                      focus:bg-surface
                      focus:ring-2
                      focus:ring-accent/10
                    "
                  />
                </div>

                {/* APPLY */}

                <button
                  type="button"
                  onClick={
                    handleApply
                  }
                  disabled={
                    loading ||
                    !couponCode.trim()
                  }
                  className={`
                    flex
                    h-10
                    shrink-0
                    items-center
                    justify-center
                    gap-1.5
                    rounded-lg
                    px-5
                    text-[10px]
                    font-bold
                    transition-all
                    duration-300
                    active:scale-[0.98]
                    sm:min-w-[92px]
                    ${
                      loading ||
                      !couponCode.trim()
                        ? `
                          cursor-not-allowed
                          bg-surface-elevated
                          text-text-muted
                        `
                        : `
                          bg-accent
                          text-black
                          hover:bg-accent-hover
                          hover:shadow-[0_7px_18px_rgba(212,175,55,0.12)]
                        `
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <FiLoader
                        size={13}
                        className="animate-spin"
                      />

                      Applying
                    </>
                  ) : (
                    <>
                      <FiTag
                        size={13}
                      />

                      Apply
                    </>
                  )}
                </button>
              </div>
            )}

            {/* SMALL HELPER */}

            {!appliedCoupon && (
              <p
                className="
                  mt-2
                  px-0.5
                  text-[8px]
                  text-text-muted
                  sm:text-[9px]
                "
              >
                Enter a valid promotional code
                to apply your discount.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CouponBox;