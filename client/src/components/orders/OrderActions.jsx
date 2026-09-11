// src/components/orders/OrderActions.jsx

import {
  FiArrowUpRight,
  FiEye,
  FiMapPin,
  FiRotateCcw,
  FiXCircle,
} from "react-icons/fi";


// ==========================================================
// ORDER ACTIONS
// ==========================================================

function OrderActions({
  orderStatus,
  onViewDetails,
  onTrackOrder,
  onCancelOrder,
  onReturnOrder,
}) {

  // ========================================================
  // NORMALIZE STATUS
  // ========================================================

  const status = String(
    orderStatus || ""
  )
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");


  // ========================================================
  // ACTION PERMISSIONS
  // ========================================================

  const canCancel = [
    "pending",
    "confirmed",
  ].includes(status);


  const canTrack = [
    "confirmed",
    "packed",
    "processing",
    "shipped",
    "out_for_delivery",
    "delivered",
  ].includes(status);


  const canReturn = [
    "delivered",
  ].includes(status);


  // ========================================================
  // UI
  // ========================================================

  return (
    <div
      className="
        flex
        w-full
        flex-wrap
        items-center
        gap-2.5
      "
    >

      {/* ==================================================
          VIEW DETAILS
      ================================================== */}

      <button
        type="button"
        onClick={() =>
          onViewDetails?.()
        }
        className="
          group
          inline-flex
          min-h-10
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-border-subtle
          bg-surface-elevated
          px-4
          py-2.5
          text-sm
          font-medium
          text-text-primary
          outline-none
          transition-all
          duration-300

          hover:-translate-y-0.5
          hover:border-accent/50
          hover:bg-accent-soft
          hover:text-accent

          focus-visible:border-accent
          focus-visible:ring-2
          focus-visible:ring-accent/20

          active:translate-y-0
        "
      >
        <FiEye
          size={16}
          className="
            shrink-0
            transition-transform
            duration-300
            group-hover:scale-110
          "
        />

        <span>
          View Details
        </span>

        <FiArrowUpRight
          size={14}
          className="
            text-text-muted
            transition-all
            duration-300
            group-hover:-translate-y-0.5
            group-hover:translate-x-0.5
            group-hover:text-accent
          "
        />
      </button>


      {/* ==================================================
          TRACK ORDER
      ================================================== */}

      {canTrack && (
        <button
          type="button"
          onClick={() =>
            onTrackOrder?.()
          }
          className="
            group
            relative
            inline-flex
            min-h-10
            items-center
            justify-center
            gap-2
            overflow-hidden
            rounded-xl
            border
            border-accent
            bg-accent
            px-4
            py-2.5
            text-sm
            font-semibold
            text-brand-bg
            shadow-sm
            shadow-accent/10
            outline-none
            transition-all
            duration-300

            hover:-translate-y-0.5
            hover:bg-accent-hover
            hover:shadow-md
            hover:shadow-accent/15

            focus-visible:ring-2
            focus-visible:ring-accent/30
            focus-visible:ring-offset-2
            focus-visible:ring-offset-brand-bg

            active:translate-y-0
          "
        >

          {/* Subtle shine */}

          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-0
              -left-16
              w-12
              rotate-12
              bg-white/20
              blur-md
              transition-all
              duration-700
              group-hover:left-[120%]
            "
          />


          <FiMapPin
            size={16}
            className="
              relative
              z-10
              shrink-0
              transition-transform
              duration-300
              group-hover:-translate-y-0.5
            "
          />

          <span className="relative z-10">
            Track Order
          </span>

        </button>
      )}


      {/* ==================================================
          RETURN ORDER
      ================================================== */}

      {canReturn && (
        <button
          type="button"
          onClick={() =>
            onReturnOrder?.()
          }
          className="
            group
            inline-flex
            min-h-10
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-blue-400/20
            bg-blue-400/[0.06]
            px-4
            py-2.5
            text-sm
            font-medium
            text-blue-300
            outline-none
            transition-all
            duration-300

            hover:-translate-y-0.5
            hover:border-blue-400/40
            hover:bg-blue-400/10
            hover:text-blue-200

            focus-visible:ring-2
            focus-visible:ring-blue-400/20

            active:translate-y-0
          "
        >
          <FiRotateCcw
            size={16}
            className="
              shrink-0
              transition-transform
              duration-500
              group-hover:-rotate-45
            "
          />

          <span>
            Return Order
          </span>
        </button>
      )}


      {/* ==================================================
          CANCEL ORDER
      ================================================== */}

      {canCancel && (
        <button
          type="button"
          onClick={() =>
            onCancelOrder?.()
          }
          className="
            group
            inline-flex
            min-h-10
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-red-400/20
            bg-red-400/[0.05]
            px-4
            py-2.5
            text-sm
            font-medium
            text-red-400
            outline-none
            transition-all
            duration-300

            hover:-translate-y-0.5
            hover:border-red-400/40
            hover:bg-red-400/10
            hover:text-red-300

            focus-visible:ring-2
            focus-visible:ring-red-400/20

            active:translate-y-0
          "
        >
          <FiXCircle
            size={16}
            className="
              shrink-0
              transition-transform
              duration-300
              group-hover:rotate-90
            "
          />

          <span>
            Cancel Order
          </span>
        </button>
      )}

    </div>
  );
}


export default OrderActions;