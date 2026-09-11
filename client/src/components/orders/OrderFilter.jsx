// src/components/orders/OrderFilter.jsx

import {
  FiCheck,
  FiChevronDown,
  FiFilter,
  FiRotateCcw,
  FiSliders,
} from "react-icons/fi";


// ==========================================================
// FILTER OPTIONS
// ==========================================================

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Packed", value: "packed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Returned", value: "returned" },
  { label: "Refunded", value: "refunded" },
];


const PAYMENT_OPTIONS = [
  { label: "All Payments", value: "all" },
  { label: "Online Payment", value: "online" },
  { label: "Cash On Delivery", value: "cod" },
];


const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Highest Amount", value: "amount-high" },
  { label: "Lowest Amount", value: "amount-low" },
];


// ==========================================================
// SELECT FIELD
// ==========================================================

function FilterSelect({
  label,
  value,
  options,
  onChange,
}) {
  return (
    <div className="group">

      {/* Label */}

      <label
        className="
          mb-2.5
          flex
          items-center
          justify-between
          text-xs
          font-semibold
          uppercase
          tracking-[0.12em]
          text-text-muted
        "
      >
        <span>{label}</span>

        {value !== "all" && (
          <span
            className="
              inline-flex
              h-1.5
              w-1.5
              rounded-full
              bg-accent
              shadow-[0_0_8px_rgba(212,175,55,0.6)]
            "
            aria-label="Filter active"
          />
        )}
      </label>


      {/* Select Wrapper */}

      <div
        className="
          relative
          overflow-hidden
          rounded-xl
          border
          border-border-subtle
          bg-brand-bg
          transition-all
          duration-300

          group-focus-within:border-accent/70
          group-focus-within:shadow-[0_0_0_3px_rgba(212,175,55,0.06)]

          hover:border-border-subtle
        "
      >

        <select
          value={value}
          onChange={(event) =>
            onChange?.(event.target.value)
          }
          className="
            h-12
            w-full
            cursor-pointer
            appearance-none
            bg-transparent
            px-4
            pr-11
            text-sm
            font-medium
            text-text-primary
            outline-none

            [&>option]:bg-brand-bg
            [&>option]:text-text-primary
          "
        >
          {options.map((item) => (
            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          ))}
        </select>


        {/* Custom Arrow */}

        <div
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            flex
            -translate-y-1/2
            items-center
            justify-center
            text-text-muted
            transition-transform
            duration-300

            group-focus-within:rotate-180
            group-focus-within:text-accent
          "
        >
          <FiChevronDown size={17} />
        </div>

      </div>

    </div>
  );
}


// ==========================================================
// ORDER FILTER
// ==========================================================

function OrderFilter({
  status = "all",
  payment = "all",
  sort = "newest",

  onStatusChange,
  onPaymentChange,
  onSortChange,

  onReset,
}) {

  // ========================================================
  // ACTIVE FILTER COUNT
  // ========================================================

  const activeFilterCount = [
    status !== "all",
    payment !== "all",
    sort !== "newest",
  ].filter(Boolean).length;


  // ========================================================
  // RESET
  // ========================================================

  const handleReset = () => {
    onReset?.();
  };


  // ========================================================
  // UI
  // ========================================================

  return (
    <section
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-border-subtle
        bg-surface
        p-5
        shadow-sm
        transition-all
        duration-500

        hover:border-accent/20
        hover:shadow-lg

        sm:p-6
      "
    >

      {/* ====================================================
          PREMIUM TOP GLOW
      ==================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-px
          w-2/3
          -translate-x-1/2
          bg-gradient-to-r
          from-transparent
          via-accent/50
          to-transparent
          opacity-60
        "
      />


      {/* ====================================================
          HEADER
      ==================================================== */}

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

        {/* Title */}

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-accent/20
              bg-accent/10
              text-accent
              transition-transform
              duration-300
              group-hover:scale-105
            "
          >
            <FiSliders size={18} />
          </div>


          <div>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <h2
                className="
                  text-base
                  font-bold
                  text-text-primary
                  sm:text-lg
                "
              >
                Order Filters
              </h2>


              {activeFilterCount > 0 && (
                <span
                  className="
                    inline-flex
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-accent
                    px-1.5
                    py-0.5
                    text-[10px]
                    font-bold
                    text-brand-bg
                    animate-pulse
                  "
                >
                  {activeFilterCount}
                </span>
              )}

            </div>


            <p
              className="
                mt-0.5
                text-xs
                text-text-muted
                sm:text-sm
              "
            >
              Refine and organize your orders
            </p>

          </div>

        </div>


        {/* Reset */}

        <button
          type="button"
          onClick={handleReset}
          disabled={activeFilterCount === 0}
          className="
            inline-flex
            min-h-10
            items-center
            justify-center
            gap-2
            self-start
            rounded-xl
            border
            border-border-subtle
            bg-brand-bg
            px-4
            py-2
            text-xs
            font-semibold
            text-text-secondary
            transition-all
            duration-300

            hover:border-accent/50
            hover:bg-accent/5
            hover:text-accent

            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:hover:border-border-subtle
            disabled:hover:bg-brand-bg
            disabled:hover:text-text-secondary

            sm:self-auto
          "
        >
          <FiRotateCcw
            size={14}
            className="
              transition-transform
              duration-500
              group-hover:rotate-[-45deg]
            "
          />

          Reset Filters
        </button>

      </div>


      {/* ====================================================
          ACTIVE FILTER SUMMARY
      ==================================================== */}

      {activeFilterCount > 0 && (
        <div
          className="
            mt-5
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-accent/10
            bg-accent/5
            px-3
            py-2.5
          "
        >

          <FiCheck
            size={15}
            className="shrink-0 text-accent"
          />

          <p className="text-xs text-text-secondary">
            {activeFilterCount}{" "}
            {activeFilterCount === 1
              ? "filter"
              : "filters"}{" "}
            currently applied
          </p>

        </div>
      )}


      {/* ====================================================
          FILTER CONTROLS
      ==================================================== */}

      <div
        className="
          mt-6
          grid
          gap-4
          md:grid-cols-3
        "
      >

        {/* Status */}

        <FilterSelect
          label="Order Status"
          value={status}
          options={STATUS_OPTIONS}
          onChange={onStatusChange}
        />


        {/* Payment */}

        <FilterSelect
          label="Payment Method"
          value={payment}
          options={PAYMENT_OPTIONS}
          onChange={onPaymentChange}
        />


        {/* Sort */}

        <FilterSelect
          label="Sort Orders"
          value={sort}
          options={SORT_OPTIONS}
          onChange={onSortChange}
        />

      </div>


      {/* ====================================================
          BOTTOM HINT
      ==================================================== */}

      <div
        className="
          mt-5
          hidden
          items-center
          gap-2
          border-t
          border-border-subtle
          pt-4
          text-[11px]
          text-text-muted
          sm:flex
        "
      >

        <FiFilter
          size={13}
          className="text-accent/70"
        />

        <span>
          Filters update your order list instantly.
        </span>

      </div>

    </section>
  );
}


export default OrderFilter;