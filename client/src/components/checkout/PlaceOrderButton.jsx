import { useState } from "react";
import {
  FiAlertCircle,
  FiCheck,
  FiChevronRight,
  FiLock,
  FiLoader,
  FiShield,
} from "react-icons/fi";

function PlaceOrderButton({
  onPlaceOrder,
  loading = false,
  disabled = false,
}) {
  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  const [showError, setShowError] =
    useState(false);

  // =========================================================
  // PLACE ORDER
  // =========================================================

  const handlePlaceOrder = () => {
    if (loading || disabled) {
      return;
    }

    if (!acceptedTerms) {
      setShowError(true);
      return;
    }

    setShowError(false);

    if (
      typeof onPlaceOrder ===
      "function"
    ) {
      onPlaceOrder();
    }
  };

  const buttonDisabled =
    loading || disabled;

  // =========================================================
  // COMPONENT
  // =========================================================

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        rounded-xl
        border
        border-border-subtle
        bg-surface
        shadow-[0_14px_40px_rgba(0,0,0,0.08)]
        transition-all
        duration-300
        hover:border-accent/20
      "
    >
      {/* =====================================================
          TOP ACCENT
      ===================================================== */}

      <div
        className="
          absolute
          left-0
          right-0
          top-0
          h-[2px]
          bg-accent
        "
      />

      <div
        className="
          p-4
          sm:p-5
        "
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-3
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
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-accent/20
                bg-accent-soft
                text-accent
              "
            >
              <FiLock size={16} />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  text-sm
                  font-bold
                  text-text-primary
                  sm:text-[15px]
                "
              >
                Complete Your Order
              </h2>

              <p
                className="
                  mt-0.5
                  truncate
                  text-[9px]
                  text-text-muted
                  sm:text-[10px]
                "
              >
                One final step to place your order
              </p>
            </div>
          </div>

          {/* SECURE BADGE */}

          <div
            className="
              hidden
              shrink-0
              items-center
              gap-1.5
              rounded-full
              border
              border-green-500/15
              bg-green-500/[0.05]
              px-2.5
              py-1.5
              sm:flex
            "
          >
            <FiShield
              size={10}
              className="text-green-400"
            />

            <span
              className="
                text-[8px]
                font-semibold
                text-green-400
              "
            >
              Secure
            </span>
          </div>
        </div>

        {/* ===================================================
            TERMS
        =================================================== */}

        <div
          className={`
            mt-4
            rounded-lg
            border
            p-3
            transition-all
            duration-300
            ${
              showError
                ? `
                  border-red-500/40
                  bg-red-500/[0.04]
                `
                : `
                  border-border-subtle
                  bg-brand-bg/40
                  hover:border-accent/20
                `
            }
          `}
        >
          <label
            className="
              flex
              cursor-pointer
              items-start
              gap-2.5
            "
          >
            {/* CUSTOM CHECKBOX */}

            <span
              className={`
                relative
                mt-0.5
                flex
                h-4
                w-4
                shrink-0
                items-center
                justify-center
                rounded-[4px]
                border
                transition-all
                duration-200
                ${
                  acceptedTerms
                    ? `
                      border-accent
                      bg-accent
                      text-black
                    `
                    : `
                      border-border-subtle
                      bg-surface
                    `
                }
              `}
            >
              {acceptedTerms && (
                <FiCheck
                  size={10}
                  strokeWidth={3}
                />
              )}

              <input
                type="checkbox"
                checked={
                  acceptedTerms
                }
                onChange={(event) => {
                  const checked =
                    event.target
                      .checked;

                  setAcceptedTerms(
                    checked
                  );

                  if (checked) {
                    setShowError(
                      false
                    );
                  }
                }}
                className="
                  absolute
                  inset-0
                  cursor-pointer
                  opacity-0
                "
                aria-label="Accept terms and privacy policy"
              />
            </span>

            {/* TERMS TEXT */}

            <span
              className="
                text-[9px]
                leading-4
                text-text-muted
                sm:text-[10px]
                sm:leading-5
              "
            >
              I agree to the{" "}
              <button
                type="button"
                onClick={(event) =>
                  event.preventDefault()
                }
                className="
                  font-semibold
                  text-accent
                  transition-colors
                  hover:text-accent-hover
                "
              >
                Terms & Conditions
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={(event) =>
                  event.preventDefault()
                }
                className="
                  font-semibold
                  text-accent
                  transition-colors
                  hover:text-accent-hover
                "
              >
                Privacy Policy
              </button>
              .
            </span>
          </label>

          {/* ERROR */}

          {showError && (
            <div
              className="
                mt-2.5
                flex
                items-center
                gap-1.5
                rounded-md
                bg-red-500/[0.06]
                px-2
                py-1.5
              "
            >
              <FiAlertCircle
                size={11}
                className="
                  shrink-0
                  text-red-400
                "
              />

              <span
                className="
                  text-[8px]
                  font-medium
                  text-red-400
                "
              >
                Please accept the Terms &
                Conditions to continue.
              </span>
            </div>
          )}
        </div>

        {/* ===================================================
            PLACE ORDER BUTTON
        =================================================== */}

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={buttonDisabled}
          className={`
            group
            relative
            mt-3
            flex
            min-h-[48px]
            w-full
            items-center
            justify-center
            gap-2
            overflow-hidden
            rounded-lg
            px-4
            py-3
            text-sm
            font-bold
            outline-none
            transition-all
            duration-300
            focus-visible:ring-2
            focus-visible:ring-accent/40
            active:scale-[0.99]
            ${
              buttonDisabled
                ? `
                  cursor-not-allowed
                  bg-gray-600/70
                  text-gray-300
                `
                : `
                  bg-accent
                  text-brand-bg
                  shadow-[0_8px_25px_rgba(212,175,55,0.16)]
                  hover:-translate-y-0.5
                  hover:bg-accent-hover
                  hover:shadow-[0_12px_30px_rgba(212,175,55,0.22)]
                `
            }
          `}
        >
          {/* SHINE */}

          {!buttonDisabled && (
            <span
              className="
                pointer-events-none
                absolute
                inset-y-0
                -left-1/2
                w-1/3
                -skew-x-12
                bg-white/20
                opacity-0
                transition-all
                duration-700
                group-hover:left-[120%]
                group-hover:opacity-100
              "
            />
          )}

          {loading ? (
            <>
              <FiLoader
                size={16}
                className="animate-spin"
              />

              <span>
                Processing Order...
              </span>
            </>
          ) : disabled ? (
            <>
              <FiLock size={15} />

              <span>
                Checkout Unavailable
              </span>
            </>
          ) : (
            <>
              <FiLock size={15} />

              <span>
                Place Order Securely
              </span>

              <FiChevronRight
                size={15}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </>
          )}
        </button>

        {/* ===================================================
            HELPER TEXT
        =================================================== */}

        <p
          className="
            mt-2
            text-center
            text-[8px]
            leading-4
            text-text-muted
            sm:text-[9px]
          "
        >
          {disabled
            ? "Your cart is empty."
            : loading
              ? "Please wait while we securely process your order."
              : "Your payment will be securely processed after confirmation."}
        </p>

        {/* ===================================================
            SECURITY STRIP
        =================================================== */}

        <div
          className="
            mt-3
            flex
            items-center
            gap-2.5
            rounded-lg
            border
            border-green-500/15
            bg-green-500/[0.035]
            px-3
            py-2.5
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
            <FiShield size={13} />
          </div>

          <div className="min-w-0">
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-x-2
                gap-y-0.5
              "
            >
              <span
                className="
                  text-[9px]
                  font-bold
                  text-green-400
                "
              >
                Secure Checkout
              </span>

              <span
                className="
                  hidden
                  text-[8px]
                  text-text-muted
                  sm:inline
                "
              >
                •
              </span>

              <span
                className="
                  text-[8px]
                  text-text-muted
                "
              >
                SSL encrypted
              </span>
            </div>

            <p
              className="
                mt-0.5
                text-[7px]
                leading-3.5
                text-text-muted
                sm:text-[8px]
              "
            >
              Your checkout information is
              protected using secure encryption.
            </p>
          </div>
        </div>

        {/* ===================================================
            TRUST POINTS
        =================================================== */}

        <div
          className="
            mt-3
            flex
            flex-wrap
            items-center
            justify-center
            gap-x-4
            gap-y-1.5
          "
        >
          <TrustItem text="Encrypted" />
          <TrustItem text="Secure payment" />
          <TrustItem text="Privacy protected" />
        </div>
      </div>
    </section>
  );
}

// =============================================================
// TRUST ITEM
// =============================================================

function TrustItem({ text }) {
  return (
    <div
      className="
        flex
        items-center
        gap-1
      "
    >
      <FiCheck
        size={9}
        className="text-green-400"
      />

      <span
        className="
          text-[7px]
          text-text-muted
          sm:text-[8px]
        "
      >
        {text}
      </span>
    </div>
  );
}

export default PlaceOrderButton;