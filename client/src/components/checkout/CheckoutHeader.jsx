import {
  FiCheck,
  FiChevronRight,
  FiLock,
  FiMapPin,
  FiCreditCard,
  FiPackage,
  FiShield,
  FiHeadphones,
} from "react-icons/fi";

function CheckoutHeader({
  currentStep = 1,
}) {
  const steps = [
    {
      step: 1,
      title: "Delivery",
      description: "Address",
      icon: FiMapPin,
    },
    {
      step: 2,
      title: "Payment",
      description: "Method",
      icon: FiCreditCard,
    },
    {
      step: 3,
      title: "Review",
      description: "Confirm",
      icon: FiPackage,
    },
  ];

  // =========================================================
  // SAFE STEP
  // =========================================================

  const activeStep = Math.min(
    Math.max(Number(currentStep) || 1, 1),
    3
  );

  return (
    <header
      className="
        relative
        mb-6
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-border-subtle
        bg-surface
        shadow-[0_16px_45px_rgba(0,0,0,0.12)]
        sm:mb-8
      "
    >
      {/* =====================================================
          PREMIUM TOP LINE
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
          lg:p-6
        "
      >
        {/* ===================================================
            TOP AREA
        =================================================== */}

        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* LEFT */}

          <div className="min-w-0">
            {/* BREADCRUMB */}

            <div
              className="
                mb-2
                flex
                items-center
                gap-1.5
                text-[9px]
                font-medium
                text-text-muted
                sm:text-[10px]
              "
            >
              <span>Home</span>

              <FiChevronRight size={11} />

              <span>Cart</span>

              <FiChevronRight size={11} />

              <span className="font-semibold text-accent">
                Checkout
              </span>
            </div>

            {/* TITLE */}

            <div
              className="
                flex
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
                  rounded-xl
                  border
                  border-accent/20
                  bg-accent-soft
                  text-accent
                  sm:h-10
                  sm:w-10
                "
              >
                <FiLock
                  size={17}
                />
              </div>

              <div className="min-w-0">
                <h1
                  className="
                    truncate
                    text-lg
                    font-bold
                    tracking-tight
                    text-text-primary
                    sm:text-xl
                    lg:text-2xl
                  "
                >
                  Secure Checkout
                </h1>

                <p
                  className="
                    mt-0.5
                    text-[9px]
                    text-text-muted
                    sm:text-[10px]
                  "
                >
                  Complete your order securely.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              SECURITY BADGE
          ================================================= */}

          <div
            className="
              flex
              w-fit
              items-center
              gap-2.5
              rounded-xl
              border
              border-green-500/20
              bg-green-500/[0.06]
              px-3
              py-2
              sm:px-3.5
            "
          >
            <div
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                bg-green-500/10
                text-green-400
              "
            >
              <FiShield size={14} />
            </div>

            <div>
              <p
                className="
                  text-[9px]
                  font-bold
                  text-green-400
                "
              >
                Secure Checkout
              </p>

              <p
                className="
                  mt-0.5
                  text-[8px]
                  text-text-muted
                "
              >
                SSL encrypted
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            CHECKOUT PROGRESS
        =================================================== */}

        <div
          className="
            mt-5
            rounded-xl
            border
            border-border-subtle
            bg-brand-bg/50
            p-3
            sm:mt-6
            sm:p-4
          "
        >
          <div
            className="
              flex
              items-center
            "
          >
            {steps.map(
              (item, index) => {
                const Icon =
                  item.icon;

                const completed =
                  activeStep > item.step;

                const active =
                  activeStep ===
                  item.step;

                const reached =
                  activeStep >=
                  item.step;

                return (
                  <div
                    key={item.step}
                    className="
                      flex
                      min-w-0
                      flex-1
                      items-center
                    "
                  >
                    {/* STEP */}

                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-2
                      "
                    >
                      {/* NUMBER / CHECK */}

                      <div
                        className={`
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          transition-all
                          duration-300
                          sm:h-9
                          sm:w-9
                          ${
                            completed ||
                            active
                              ? `
                                border-accent
                                bg-accent
                                text-black
                                shadow-[0_5px_15px_rgba(212,175,55,0.12)]
                              `
                              : `
                                border-border-subtle
                                bg-surface
                                text-text-muted
                              `
                          }
                        `}
                      >
                        {completed ? (
                          <FiCheck
                            size={14}
                            strokeWidth={3}
                          />
                        ) : (
                          <Icon
                            size={14}
                          />
                        )}
                      </div>

                      {/* TEXT */}

                      <div
                        className="
                          min-w-0
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-1.5
                          "
                        >
                          <p
                            className={`
                              truncate
                              text-[10px]
                              font-bold
                              transition-colors
                              duration-300
                              sm:text-xs
                              ${
                                reached
                                  ? "text-text-primary"
                                  : "text-text-muted"
                              }
                            `}
                          >
                            {item.title}
                          </p>

                          {active && (
                            <span
                              className="
                                hidden
                                rounded-full
                                bg-accent/10
                                px-1.5
                                py-0.5
                                text-[7px]
                                font-bold
                                uppercase
                                tracking-wide
                                text-accent
                                sm:inline-flex
                              "
                            >
                              Current
                            </span>
                          )}
                        </div>

                        <p
                          className="
                            mt-0.5
                            hidden
                            text-[8px]
                            text-text-muted
                            sm:block
                          "
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* CONNECTOR */}

                    {index <
                      steps.length - 1 && (
                      <div
                        className="
                          mx-2
                          h-px
                          min-w-3
                          flex-1
                          overflow-hidden
                          rounded-full
                          bg-border-subtle
                          sm:mx-3
                        "
                      >
                        <div
                          className="
                            h-full
                            rounded-full
                            bg-accent
                            transition-all
                            duration-500
                          "
                          style={{
                            width:
                              activeStep >
                              item.step
                                ? "100%"
                                : "0%",
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* ===================================================
            CURRENT STEP MESSAGE
        =================================================== */}

        <div
          className="
            mt-4
            flex
            items-center
            gap-2
            rounded-lg
            border
            border-accent/10
            bg-accent/[0.035]
            px-3
            py-2.5
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
              bg-accent/10
              text-accent
            "
          >
            {activeStep === 1 && (
              <FiMapPin size={12} />
            )}

            {activeStep === 2 && (
              <FiCreditCard size={12} />
            )}

            {activeStep === 3 && (
              <FiPackage size={12} />
            )}
          </div>

          <p
            className="
              text-[9px]
              leading-4
              text-text-secondary
              sm:text-[10px]
            "
          >
            {activeStep === 1 &&
              "Add or select your delivery address to continue."}

            {activeStep === 2 &&
              "Choose a secure payment method for your order."}

            {activeStep === 3 &&
              "Review your items and confirm your order."}
          </p>
        </div>

        {/* ===================================================
            QUICK TRUST ITEMS
        =================================================== */}

        <div
          className="
            mt-3
            flex
            flex-wrap
            items-center
            gap-x-4
            gap-y-2
            px-1
          "
        >
          <TrustItem
            icon={FiShield}
            text="Secure payment"
          />

          <TrustItem
            icon={FiPackage}
            text="Reliable delivery"
          />

          <TrustItem
            icon={FiHeadphones}
            text="24×7 support"
          />
        </div>
      </div>
    </header>
  );
}

// =============================================================
// TRUST ITEM
// =============================================================

function TrustItem({
  icon: Icon,
  text,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-1.5
        text-[8px]
        text-text-muted
        sm:text-[9px]
      "
    >
      <Icon
        size={11}
        className="text-accent"
      />

      <span>{text}</span>
    </div>
  );
}

export default CheckoutHeader;