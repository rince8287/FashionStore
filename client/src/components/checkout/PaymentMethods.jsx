import {
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiChevronRight,
  FiCreditCard,
  FiLock,
  FiShield,
  FiSmartphone,
} from "react-icons/fi";

const paymentOptions = [
  {
    id: "online",
    title: "Online Payment",
    shortTitle: "Pay Online",
    description:
      "Fast, secure & instant payment",
    icon: FiCreditCard,
    badge:
      "UPI • Cards • Net Banking • Wallets",
    accent: "gold",
  },
  {
    id: "cod",
    title: "Cash On Delivery",
    shortTitle: "Cash on Delivery",
    description:
      "Pay when your order arrives",
    icon: FiSmartphone,
    badge:
      "Available on eligible orders",
    accent: "green",
  },
];

function PaymentMethods({
  selectedMethod = "online",
  onSelect,
}) {
  // =========================================================
  // SELECT PAYMENT
  // =========================================================

  const handleSelect = (method) => {
    if (
      typeof onSelect ===
      "function"
    ) {
      onSelect(method);
    }
  };

  // =========================================================
  // SELECTED OPTION
  // =========================================================

  const selectedOption =
    paymentOptions.find(
      (option) =>
        option.id ===
        selectedMethod
    );

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
          {/* LEFT */}

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
              <FiCreditCard
                size={16}
              />
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
                Payment Method
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
                Choose your preferred way to pay
              </p>
            </div>
          </div>

          {/* SECURE */}

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
            <FiLock
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
            PAYMENT OPTIONS
        =================================================== */}

        <div
          className="
            mt-4
            grid
            gap-2.5
            sm:grid-cols-2
          "
        >
          {paymentOptions.map(
            (option) => {
              const active =
                selectedMethod ===
                option.id;

              const Icon =
                option.icon;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    handleSelect(
                      option.id
                    )
                  }
                  aria-pressed={active}
                  className={`
                    group
                    relative
                    overflow-hidden
                    rounded-lg
                    border
                    p-3
                    text-left
                    outline-none
                    transition-all
                    duration-300
                    active:scale-[0.99]
                    focus-visible:ring-2
                    focus-visible:ring-accent/40
                    ${
                      active
                        ? `
                          border-accent
                          bg-accent-soft
                          shadow-[0_8px_25px_rgba(212,175,55,0.08)]
                        `
                        : `
                          border-border-subtle
                          bg-brand-bg/50
                          hover:border-accent/30
                          hover:bg-accent/[0.025]
                        `
                    }
                  `}
                >
                  {/* ACTIVE INDICATOR */}

                  <div
                    className={`
                      absolute
                      left-0
                      top-0
                      h-full
                      w-[2px]
                      bg-accent
                      transition-all
                      duration-300
                      ${
                        active
                          ? "opacity-100"
                          : "opacity-0"
                      }
                    `}
                  />

                  <div
                    className="
                      flex
                      items-start
                      gap-2.5
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
                        transition-all
                        duration-300
                        ${
                          active
                            ? `
                              bg-accent
                              text-black
                              shadow-[0_5px_15px_rgba(212,175,55,0.12)]
                            `
                            : `
                              bg-surface
                              text-text-muted
                              group-hover:text-accent
                            `
                        }
                      `}
                    >
                      <Icon
                        size={16}
                      />
                    </div>

                    {/* CONTENT */}

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-2
                        "
                      >
                        <h3
                          className={`
                            truncate
                            text-xs
                            font-bold
                            transition-colors
                            duration-200
                            sm:text-sm
                            ${
                              active
                                ? "text-text-primary"
                                : "text-text-secondary"
                            }
                          `}
                        >
                          {option.title}
                        </h3>

                        {/* CHECK */}

                        <span
                          className={`
                            flex
                            h-5
                            w-5
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            transition-all
                            duration-300
                            ${
                              active
                                ? `
                                  border-accent
                                  bg-accent
                                  text-black
                                  scale-100
                                `
                                : `
                                  border-border-subtle
                                  bg-transparent
                                  scale-90
                                `
                            }
                          `}
                        >
                          {active && (
                            <FiCheck
                              size={11}
                              strokeWidth={3}
                            />
                          )}
                        </span>
                      </div>

                      <p
                        className="
                          mt-1
                          text-[9px]
                          leading-4
                          text-text-muted
                          sm:text-[10px]
                        "
                      >
                        {option.description}
                      </p>

                      {/* BADGE */}

                      <div
                        className="
                          mt-2
                          flex
                          items-center
                          gap-1
                        "
                      >
                        <span
                          className="
                            max-w-full
                            truncate
                            rounded-full
                            border
                            border-border-subtle
                            bg-surface
                            px-2
                            py-1
                            text-[7px]
                            font-medium
                            text-text-muted
                            sm:text-[8px]
                          "
                        >
                          {option.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ONLINE MICRO TRUST */}

                  {option.id ===
                    "online" && (
                    <div
                      className="
                        mt-2.5
                        flex
                        items-center
                        gap-1.5
                        pl-[46px]
                      "
                    >
                      <FiShield
                        size={9}
                        className="text-green-400"
                      />

                      <span
                        className="
                          text-[7px]
                          font-medium
                          text-green-400
                          sm:text-[8px]
                        "
                      >
                        Secure payment
                      </span>
                    </div>
                  )}
                </button>
              );
            }
          )}
        </div>

        {/* ===================================================
            SELECTED PAYMENT STRIP
        =================================================== */}

        {selectedOption && (
          <div
            className="
              mt-3
              flex
              items-center
              justify-between
              gap-3
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
                min-w-0
                items-center
                gap-2
              "
            >
              <div
                className="
                  flex
                  h-6
                  w-6
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-green-500/10
                  text-green-400
                "
              >
                <FiCheck
                  size={11}
                  strokeWidth={3}
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[9px]
                    font-bold
                    text-green-400
                  "
                >
                  Payment selected
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-[8px]
                    text-text-muted
                  "
                >
                  {selectedOption.title}
                </p>
              </div>
            </div>

            <FiChevronRight
              size={13}
              className="
                shrink-0
                text-text-muted
              "
            />
          </div>
        )}

        {/* ===================================================
            ONLINE PAYMENT DETAILS
        =================================================== */}

        {selectedMethod ===
          "online" && (
          <div
            className="
              mt-3
              overflow-hidden
              rounded-lg
              border
              border-border-subtle
              bg-brand-bg/40
            "
          >
            {/* HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                border-b
                border-border-subtle
                px-3
                py-2.5
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <div
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-md
                    bg-accent/10
                    text-accent
                  "
                >
                  <FiShield
                    size={13}
                  />
                </div>

                <div>
                  <p
                    className="
                      text-[9px]
                      font-bold
                      text-text-primary
                    "
                  >
                    Secure Online Payment
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[8px]
                      text-text-muted
                    "
                  >
                    Powered by Razorpay
                  </p>
                </div>
              </div>

              <span
                className="
                  rounded-full
                  border
                  border-green-500/15
                  bg-green-500/[0.05]
                  px-2
                  py-1
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-wide
                  text-green-400
                "
              >
                Protected
              </span>
            </div>

            {/* PAYMENT TYPES */}

            <div
              className="
                grid
                grid-cols-2
                gap-1.5
                p-3
                sm:grid-cols-4
              "
            >
              <PaymentType
                icon="UPI"
                label="UPI"
              />

              <PaymentType
                icon="CARD"
                label="Cards"
              />

              <PaymentType
                icon="NET"
                label="Net Banking"
              />

              <PaymentType
                icon="WALLET"
                label="Wallets"
              />
            </div>

            {/* INFO */}

            <div
              className="
                flex
                items-start
                gap-2
                border-t
                border-border-subtle
                px-3
                py-2.5
              "
            >
              <FiLock
                size={10}
                className="
                  mt-0.5
                  shrink-0
                  text-text-muted
                "
              />

              <p
                className="
                  text-[8px]
                  leading-4
                  text-text-muted
                "
              >
                Your payment credentials are
                securely handled by Razorpay.
                Sensitive keys remain on the
                backend.
              </p>
            </div>
          </div>
        )}

        {/* ===================================================
            COD INFORMATION
        =================================================== */}

        {selectedMethod ===
          "cod" && (
          <div
            className="
              mt-3
              flex
              items-start
              gap-2.5
              rounded-lg
              border
              border-green-500/15
              bg-green-500/[0.035]
              px-3
              py-3
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
              <FiCheckCircle
                size={14}
              />
            </div>

            <div>
              <p
                className="
                  text-[9px]
                  font-bold
                  text-green-400
                "
              >
                Cash on Delivery selected
              </p>

              <p
                className="
                  mt-1
                  text-[8px]
                  leading-4
                  text-text-muted
                "
              >
                Pay securely when your order
                arrives at your delivery address.
              </p>
            </div>
          </div>
        )}

        {/* ===================================================
            FOOTER TRUST
        =================================================== */}

        <div
          className="
            mt-3
            flex
            flex-wrap
            items-center
            gap-x-4
            gap-y-2
            px-0.5
          "
        >
          <TrustItem text="Secure payment" />

          <TrustItem text="Encrypted checkout" />

          <TrustItem text="Payment protection" />
        </div>
      </div>
    </section>
  );
}

// =============================================================
// PAYMENT TYPE
// =============================================================

function PaymentType({
  icon,
  label,
}) {
  return (
    <div
      className="
        flex
        min-w-0
        items-center
        gap-1.5
        rounded-md
        border
        border-border-subtle
        bg-surface
        px-2
        py-2
      "
    >
      <span
        className="
          flex
          h-5
          shrink-0
          items-center
          justify-center
          rounded
          bg-accent/10
          px-1
          text-[6px]
          font-bold
          text-accent
        "
      >
        {icon}
      </span>

      <span
        className="
          truncate
          text-[8px]
          font-medium
          text-text-muted
        "
      >
        {label}
      </span>
    </div>
  );
}

// =============================================================
// TRUST ITEM
// =============================================================

function TrustItem({
  text,
}) {
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

export default PaymentMethods;