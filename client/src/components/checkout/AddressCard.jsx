import {
  FiCheck,
  FiCheckCircle,
  FiEdit2,
  FiHome,
  FiMapPin,
  FiPhone,
  FiTrash2,
} from "react-icons/fi";

function AddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) {
  // =========================================================
  // ADDRESS ID
  // =========================================================

  const addressId =
    address?._id ||
    address?.id;

  // =========================================================
  // SAFE VALUES
  // =========================================================

  const addressType =
    address?.type || "Home";

  const fullName =
    address?.fullName || "Customer";

  const phone =
    address?.phone || "";

  const house =
    address?.house || "";

  const street =
    address?.street || "";

  const landmark =
    address?.landmark || "";

  const city =
    address?.city || "";

  const state =
    address?.state || "";

  const pincode =
    address?.pincode || "";

  // =========================================================
  // SELECT
  // =========================================================

  const handleSelect = () => {
    onSelect?.();
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      onSelect?.();
    }
  };

  // =========================================================
  // COMPONENT
  // =========================================================

  return (
    <article
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      className={`
        group
        relative
        w-full
        cursor-pointer
        overflow-hidden
        rounded-xl
        border
        p-4
        outline-none
        transition-all
        duration-300
        ease-out
        active:scale-[0.995]
        focus-visible:ring-2
        focus-visible:ring-accent
        focus-visible:ring-offset-2
        focus-visible:ring-offset-brand-bg
        sm:p-4.5
        ${
          isSelected
            ? `
              border-accent/70
              bg-accent-soft
              shadow-[0_10px_30px_rgba(212,175,55,0.07)]
            `
            : `
              border-border-subtle
              bg-surface
              hover:-translate-y-0.5
              hover:border-accent/35
              hover:shadow-[0_10px_28px_rgba(0,0,0,0.16)]
            `
        }
      `}
    >
      {/* =====================================================
          SELECTED INDICATOR
      ===================================================== */}

      <div
        className={`
          absolute
          left-0
          top-0
          h-full
          w-[3px]
          rounded-l-xl
          bg-accent
          transition-all
          duration-300
          ${
            isSelected
              ? "opacity-100"
              : "opacity-0"
          }
        `}
      />

      {/* =====================================================
          TOP ROW
      ===================================================== */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        {/* ADDRESS TYPE */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-2.5
          "
        >
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
                isSelected
                  ? `
                    border-accent/30
                    bg-accent
                    text-black
                  `
                  : `
                    border-border-subtle
                    bg-brand-bg
                    text-accent
                    group-hover:border-accent/30
                  `
              }
            `}
          >
            <FiHome size={16} />
          </div>

          <div className="min-w-0">
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <h3
                className="
                  truncate
                  text-sm
                  font-bold
                  text-text-primary
                  sm:text-[15px]
                "
              >
                {addressType}
              </h3>

              {/* DEFAULT */}

              {address?.isDefault && (
                <span
                  className="
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
                  Default
                </span>
              )}
            </div>

            <p
              className="
                mt-0.5
                text-[10px]
                text-text-muted
              "
            >
              Delivery address
            </p>
          </div>
        </div>

        {/* SELECTED */}

        <div
          className={`
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            transition-all
            duration-300
            ${
              isSelected
                ? `
                  scale-100
                  border-accent
                  bg-accent
                  text-black
                  opacity-100
                `
                : `
                  scale-90
                  border-border-subtle
                  bg-brand-bg
                  text-transparent
                  opacity-70
                  group-hover:border-accent/40
                `
            }
          `}
        >
          {isSelected ? (
            <FiCheck
              size={14}
              strokeWidth={3}
            />
          ) : (
            <FiCheckCircle
              size={14}
            />
          )}
        </div>
      </div>

      {/* =====================================================
          CUSTOMER
      ===================================================== */}

      <div
        className="
          mt-4
          flex
          min-w-0
          items-center
          justify-between
          gap-3
        "
      >
        <p
          className="
            min-w-0
            truncate
            text-xs
            font-semibold
            text-text-primary
          "
        >
          {fullName}
        </p>

        {phone && (
          <div
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              text-[10px]
              text-text-muted
            "
          >
            <FiPhone size={11} />

            <span>
              {phone}
            </span>
          </div>
        )}
      </div>

      {/* =====================================================
          ADDRESS
      ===================================================== */}

      <div
        className="
          mt-3
          flex
          items-start
          gap-2.5
          rounded-lg
          bg-brand-bg/45
          px-3
          py-2.5
        "
      >
        <FiMapPin
          size={15}
          className="
            mt-0.5
            shrink-0
            text-accent
          "
        />

        <div
          className="
            min-w-0
            text-[10px]
            leading-5
            text-text-secondary
            sm:text-[11px]
          "
        >
          <p>
            {house}
            {house && street
              ? ", "
              : ""}
            {street}
          </p>

          {landmark && (
            <p className="text-text-muted">
              Near {landmark}
            </p>
          )}

          <p>
            {city}
            {city && state
              ? ", "
              : ""}
            {state}

            {pincode && (
              <>
                {" "}
                —{" "}
                <span className="font-medium text-text-secondary">
                  {pincode}
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* =====================================================
          ACTIONS
      ===================================================== */}

      <div
        className="
          mt-3
          flex
          items-center
          justify-between
          gap-2
          border-t
          border-border-subtle/70
          pt-3
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* EDIT */}

        <button
          type="button"
          onClick={() =>
            onEdit?.(address)
          }
          className="
            group/edit
            flex
            h-8
            items-center
            gap-1.5
            rounded-lg
            px-2.5
            text-[10px]
            font-semibold
            text-text-muted
            transition-all
            duration-200
            hover:bg-accent/10
            hover:text-accent
            active:scale-95
            sm:h-9
            sm:px-3
            sm:text-xs
          "
        >
          <FiEdit2
            size={13}
            className="
              transition-transform
              duration-200
              group-hover/edit:-translate-y-0.5
            "
          />

          Edit
        </button>

        {/* DELETE */}

        <button
          type="button"
          onClick={() =>
            onDelete?.(addressId)
          }
          className="
            group/delete
            flex
            h-8
            items-center
            gap-1.5
            rounded-lg
            px-2.5
            text-[10px]
            font-semibold
            text-text-muted
            transition-all
            duration-200
            hover:bg-red-500/10
            hover:text-red-400
            active:scale-95
            sm:h-9
            sm:px-3
            sm:text-xs
          "
        >
          <FiTrash2
            size={13}
            className="
              transition-transform
              duration-200
              group-hover/delete:scale-105
            "
          />

          Delete
        </button>

        {/* SELECT LABEL */}

        <span
          className={`
            ml-auto
            text-[9px]
            font-semibold
            transition-all
            duration-300
            ${
              isSelected
                ? "text-accent"
                : "text-text-muted opacity-0 group-hover:opacity-100"
            }
          `}
        >
          {isSelected
            ? "Selected"
            : "Select address"}
        </span>
      </div>
    </article>
  );
}

export default AddressCard;