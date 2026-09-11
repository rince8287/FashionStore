import {
  FiCheck,
  FiChevronDown,
  FiDollarSign,
  FiPackage,
  FiPercent,
  FiTruck,
} from "react-icons/fi";

function PriceDetails({
  subtotal = 0,
  deliveryCharge = 0,
  platformFee = 0,
  couponDiscount = 0,
  gst = 0,
}) {
  // =========================================================
  // SAFE VALUES
  // =========================================================

  const safeSubtotal =
    Number(subtotal) || 0;

  const safeDelivery =
    Number(deliveryCharge) || 0;

  const safePlatformFee =
    Number(platformFee) || 0;

  const safeCoupon =
    Number(couponDiscount) || 0;

  const safeGST =
    Number(gst) || 0;

  // =========================================================
  // TOTAL
  // =========================================================

  const total =
    safeSubtotal +
    safeDelivery +
    safePlatformFee +
    safeGST -
    safeCoupon;

  // =========================================================
  // FORMAT
  // =========================================================

  const formatPrice = (value) =>
    Number(value).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
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

      <div className="p-4 sm:p-5">

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
              <FiDollarSign
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
                Price Details
              </h2>

              <p
                className="
                  mt-0.5
                  text-[9px]
                  text-text-muted
                  sm:text-[10px]
                "
              >
                Complete breakdown of your order
              </p>
            </div>
          </div>

          {/* SUMMARY ICON */}

          <div
            className="
              hidden
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              bg-brand-bg
              text-text-muted
              sm:flex
            "
          >
            <FiChevronDown
              size={13}
            />
          </div>
        </div>

        {/* ===================================================
            PRICE BREAKDOWN
        =================================================== */}

        <div
          className="
            mt-4
            overflow-hidden
            rounded-lg
            border
            border-border-subtle
            bg-brand-bg/30
          "
        >
          {/* SUBTOTAL */}

          <PriceRow
            icon={
              <FiPackage size={12} />
            }
            label="Subtotal"
            value={`₹${formatPrice(
              safeSubtotal
            )}`}
          />

          {/* DELIVERY */}

          <PriceRow
            icon={
              <FiTruck size={12} />
            }
            label="Delivery"
            value={
              safeDelivery === 0
                ? "FREE"
                : `₹${formatPrice(
                    safeDelivery
                  )}`
            }
            valueClass={
              safeDelivery === 0
                ? "text-green-400"
                : "text-text-primary"
            }
          />

          {/* PLATFORM FEE */}

          <PriceRow
            label="Platform Fee"
            value={`₹${formatPrice(
              safePlatformFee
            )}`}
          />

          {/* GST */}

          <PriceRow
            icon={
              <FiPercent size={11} />
            }
            label="GST"
            value={`₹${formatPrice(
              safeGST
            )}`}
          />

          {/* COUPON */}

          {safeCoupon > 0 && (
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                border-t
                border-border-subtle
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
                    h-5
                    w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-green-500/10
                    text-green-400
                  "
                >
                  <FiCheck
                    size={10}
                    strokeWidth={3}
                  />
                </div>

                <span
                  className="
                    text-[9px]
                    font-semibold
                    text-green-400
                    sm:text-[10px]
                  "
                >
                  Coupon Discount
                </span>
              </div>

              <span
                className="
                  shrink-0
                  text-[10px]
                  font-bold
                  text-green-400
                "
              >
                -₹
                {formatPrice(
                  safeCoupon
                )}
              </span>
            </div>
          )}
        </div>

        {/* ===================================================
            SAVINGS
        =================================================== */}

        {safeCoupon > 0 && (
          <div
            className="
              mt-2.5
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
                items-center
                gap-1.5
              "
            >
              <FiCheck
                size={10}
                className="text-green-400"
                strokeWidth={3}
              />

              <span
                className="
                  text-[9px]
                  font-semibold
                  text-green-400
                "
              >
                You save
              </span>
            </div>

            <span
              className="
                text-[10px]
                font-bold
                text-green-400
              "
            >
              ₹
              {formatPrice(
                safeCoupon
              )}
            </span>
          </div>
        )}

        {/* ===================================================
            TOTAL
        =================================================== */}

        <div
          className="
            mt-3
            rounded-lg
            border
            border-accent/15
            bg-accent/[0.035]
            p-3.5
          "
        >
          <div
            className="
              flex
              items-end
              justify-between
              gap-3
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-bold
                  text-text-primary
                  sm:text-xs
                "
              >
                Total Amount
              </p>

              <p
                className="
                  mt-0.5
                  text-[8px]
                  text-text-muted
                "
              >
                Inclusive of applicable charges
              </p>
            </div>

            <span
              className="
                shrink-0
                text-xl
                font-extrabold
                tracking-tight
                text-accent
                sm:text-2xl
              "
            >
              ₹
              {formatPrice(total)}
            </span>
          </div>
        </div>

        {/* ===================================================
            QUICK TRUST
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
          <TrustItem text="Transparent pricing" />
          <TrustItem text="No hidden charges" />
        </div>
      </div>
    </section>
  );
}

// =============================================================
// PRICE ROW
// =============================================================

function PriceRow({
  icon,
  label,
  value,
  valueClass = "text-text-primary",
}) {
  return (
    <div
      className="
        flex
        min-h-[38px]
        items-center
        justify-between
        gap-3
        border-b
        border-border-subtle
        px-3
        py-2
        last:border-b-0
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
        {icon && (
          <span
            className="
              flex
              h-5
              w-5
              shrink-0
              items-center
              justify-center
              rounded-md
              bg-surface
              text-text-muted
            "
          >
            {icon}
          </span>
        )}

        <span
          className="
            truncate
            text-[9px]
            text-text-secondary
            sm:text-[10px]
          "
        >
          {label}
        </span>
      </div>

      <span
        className={`
          shrink-0
          text-[10px]
          font-semibold
          ${valueClass}
        `}
      >
        {value}
      </span>
    </div>
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
        strokeWidth={3}
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

export default PriceDetails;