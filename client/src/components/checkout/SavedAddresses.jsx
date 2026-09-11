import {
  useEffect,
  useState,
} from "react";

import {
  FiChevronDown,
  FiChevronUp,
  FiMapPin,
  FiPlus,
  FiRefreshCw,
} from "react-icons/fi";

import AddressCard from "./AddressCard";

import addressService from "../../services/addressService";

function SavedAddresses({
  selectedAddress,
  onSelect,
  showAddressForm,
  onToggleAddressForm,
}) {
  // =========================================================
  // STATE
  // =========================================================

  const [addresses, setAddresses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // FETCH ADDRESSES
  // =========================================================

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await addressService.getAddresses();

      const data =
        Array.isArray(
          response?.addresses
        )
          ? response.addresses
          : Array.isArray(
              response?.data
            )
            ? response.data
            : [];

      setAddresses(data);

      // =====================================================
      // AUTO SELECT DEFAULT
      // =====================================================

      if (
        data.length > 0 &&
        !selectedAddress
      ) {
        const defaultAddress =
          data.find(
            (item) =>
              item?.isDefault
          ) || data[0];

        const defaultId =
          defaultAddress?._id ||
          defaultAddress?.id;

        if (defaultId) {
          onSelect?.(
            defaultId
          );
        }
      }
    } catch (err) {
      console.error(
        "Fetch Addresses Error:",
        err
      );

      setError(
        err?.response?.data
          ?.message ||
          err?.message ||
          "Failed to load addresses."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchAddresses();
  }, []);

  // =========================================================
  // EDIT ADDRESS
  // =========================================================

  const handleEdit = (
    address
  ) => {
    console.log(
      "Edit Address",
      address
    );
  };

  // =========================================================
  // DELETE ADDRESS
  // =========================================================

  const handleDelete =
    async (id) => {
      if (!id) return;

      try {
        await addressService.deleteAddress(
          id
        );

        await fetchAddresses();
      } catch (err) {
        console.error(
          "Delete Address Error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            err?.message ||
            "Failed to delete address."
        );
      }
    };

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
              <FiMapPin size={16} />
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
                Delivery Address
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
                Choose where your order should be delivered
              </p>
            </div>
          </div>

          {/* ADDRESS COUNT */}

          {!loading &&
            addresses.length > 0 && (
              <div
                className="
                  shrink-0
                  rounded-full
                  border
                  border-border-subtle
                  bg-brand-bg
                  px-2.5
                  py-1
                  text-[8px]
                  font-semibold
                  text-text-muted
                "
              >
                {addresses.length}{" "}
                {addresses.length ===
                1
                  ? "Address"
                  : "Addresses"}
              </div>
            )}
        </div>

        {/* ===================================================
            LOADING SKELETON
        =================================================== */}

        {loading && (
          <div
            className="
              mt-4
              grid
              gap-2.5
              sm:grid-cols-2
            "
          >
            {[1, 2].map(
              (item) => (
                <AddressSkeleton
                  key={item}
                />
              )
            )}
          </div>
        )}

        {/* ===================================================
            ERROR
        =================================================== */}

        {!loading &&
          error && (
            <div
              className="
                mt-4
                rounded-lg
                border
                border-red-500/20
                bg-red-500/[0.04]
                p-3
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <div className="min-w-0">
                  <p
                    className="
                      text-[10px]
                      font-semibold
                      text-red-400
                    "
                  >
                    Unable to load addresses
                  </p>

                  <p
                    className="
                      mt-1
                      text-[8px]
                      leading-4
                      text-text-muted
                    "
                  >
                    {error}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    fetchAddresses
                  }
                  className="
                    flex
                    h-7
                    shrink-0
                    items-center
                    gap-1.5
                    rounded-md
                    border
                    border-border-subtle
                    bg-surface
                    px-2.5
                    text-[8px]
                    font-semibold
                    text-text-secondary
                    transition-all
                    hover:border-accent
                    hover:text-accent
                    active:scale-95
                  "
                >
                  <FiRefreshCw
                    size={10}
                  />

                  Retry
                </button>
              </div>
            </div>
          )}

        {/* ===================================================
            ADDRESS LIST
        =================================================== */}

        {!loading &&
          !error &&
          addresses.length >
            0 && (
            <div
              className="
                mt-4
                grid
                gap-3
                sm:grid-cols-2
              "
            >
              {addresses.map(
                (address) => {
                  const addressId =
                    address?._id ||
                    address?.id;

                  return (
                    <div
                      key={addressId}
                      className="
                        min-w-0
                        transition-transform
                        duration-300
                        hover:-translate-y-0.5
                      "
                    >
                      <AddressCard
                        address={
                          address
                        }
                        isSelected={
                          selectedAddress ===
                          addressId
                        }
                        onSelect={() =>
                          onSelect?.(
                            addressId
                          )
                        }
                        onEdit={() =>
                          handleEdit(
                            address
                          )
                        }
                        onDelete={() =>
                          handleDelete(
                            addressId
                          )
                        }
                      />
                    </div>
                  );
                }
              )}
            </div>
          )}

        {/* ===================================================
            EMPTY STATE
        =================================================== */}

        {!loading &&
          !error &&
          addresses.length ===
            0 && (
            <div
              className="
                mt-4
                rounded-lg
                border
                border-dashed
                border-border-subtle
                bg-brand-bg/30
                px-4
                py-7
                text-center
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-accent-soft
                  text-accent
                "
              >
                <FiMapPin
                  size={17}
                />
              </div>

              <h3
                className="
                  mt-3
                  text-xs
                  font-bold
                  text-text-primary
                "
              >
                No saved address
              </h3>

              <p
                className="
                  mx-auto
                  mt-1
                  max-w-xs
                  text-[9px]
                  leading-4
                  text-text-muted
                "
              >
                Add a delivery address to
                continue with your order.
              </p>
            </div>
          )}

        {/* ===================================================
            ADD ADDRESS TOGGLE
        =================================================== */}

        <button
          type="button"
          onClick={
            onToggleAddressForm
          }
          aria-expanded={
            showAddressForm
          }
          className={`
            group
            mt-3
            flex
            w-full
            items-center
            justify-between
            gap-3
            rounded-lg
            border
            px-3
            py-2.5
            text-left
            outline-none
            transition-all
            duration-300
            focus-visible:ring-2
            focus-visible:ring-accent/30
            ${
              showAddressForm
                ? `
                  border-accent
                  bg-accent-soft
                `
                : `
                  border-border-subtle
                  bg-brand-bg/30
                  hover:border-accent/40
                  hover:bg-accent/[0.025]
                `
            }
          `}
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
              className={`
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-md
                transition-all
                duration-300
                ${
                  showAddressForm
                    ? `
                      bg-accent
                      text-black
                    `
                    : `
                      bg-surface
                      text-accent
                      group-hover:bg-accent
                      group-hover:text-black
                    `
                }
              `}
            >
              <FiPlus
                size={13}
                className={`
                  transition-transform
                  duration-300
                  ${
                    showAddressForm
                      ? "rotate-45"
                      : "rotate-0"
                  }
                `}
              />
            </div>

            <div className="min-w-0">
              <p
                className="
                  truncate
                  text-[10px]
                  font-bold
                  text-text-primary
                "
              >
                {showAddressForm
                  ? "Close Address Form"
                  : "Add New Address"}
              </p>

              <p
                className="
                  mt-0.5
                  hidden
                  truncate
                  text-[8px]
                  text-text-muted
                  sm:block
                "
              >
                {showAddressForm
                  ? "Hide address form"
                  : "Add another delivery location"}
              </p>
            </div>
          </div>

          <div
            className="
              flex
              h-6
              w-6
              shrink-0
              items-center
              justify-center
              rounded-full
              text-text-muted
              transition-colors
              group-hover:text-accent
            "
          >
            {showAddressForm ? (
              <FiChevronUp
                size={13}
              />
            ) : (
              <FiChevronDown
                size={13}
              />
            )}
          </div>
        </button>
      </div>
    </section>
  );
}

// =============================================================
// ADDRESS SKELETON
// =============================================================

function AddressSkeleton() {
  return (
    <div
      className="
        animate-pulse
        rounded-lg
        border
        border-border-subtle
        bg-brand-bg/40
        p-3.5
      "
    >
      <div
        className="
          flex
          items-center
          gap-2.5
        "
      >
        <div
          className="
            h-8
            w-8
            rounded-lg
            bg-surface
          "
        />

        <div className="flex-1">
          <div
            className="
              h-2.5
              w-24
              rounded
              bg-surface
            "
          />

          <div
            className="
              mt-1.5
              h-2
              w-16
              rounded
              bg-surface
            "
          />
        </div>
      </div>

      <div
        className="
          mt-4
          h-2
          w-32
          rounded
          bg-surface
        "
      />

      <div
        className="
          mt-2
          h-2
          w-full
          rounded
          bg-surface
        "
      />

      <div
        className="
          mt-2
          h-2
          w-3/4
          rounded
          bg-surface
        "
      />
    </div>
  );
}

export default SavedAddresses;