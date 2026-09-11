import {
  useEffect,
  useState,
} from "react";

import {
  FiAlertCircle,
  FiCheckCircle,
  FiHome,
  FiMapPin,
  FiRefreshCw,
} from "react-icons/fi";

import profileService from "../../services/profileService";


// ==========================================================
// DEFAULT ADDRESS
// ==========================================================

const DEFAULT_ADDRESS = {
  houseNo: "",
  area: "",
  landmark: "",
  pincode: "",
  city: "",
  state: "",
  country: "",
};


// ==========================================================
// SAFE VALUE HELPER
// ==========================================================

function getSafeValue(value) {
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


// ==========================================================
// EXTRACT ADDRESS
// ==========================================================

function extractAddress(response) {
  /*
    Supported API structures:

    {
      user: {
        address: {...}
      }
    }

    {
      profile: {
        address: {...}
      }
    }

    {
      data: {
        address: {...}
      }
    }

    {
      address: {...}
    }

    {
      shippingAddress: {...}
    }
  */

  const profileData =
    response?.user ||
    response?.profile ||
    response?.data ||
    response ||
    {};


  const addressData =
    profileData?.address ||
    profileData?.shippingAddress ||
    response?.address ||
    response?.shippingAddress ||
    {};


  return {
    houseNo: getSafeValue(
      addressData?.houseNo ??
      addressData?.house ??
      addressData?.houseNumber ??
      addressData?.addressLine1
    ),

    area: getSafeValue(
      addressData?.area ??
      addressData?.street ??
      addressData?.streetAddress ??
      addressData?.addressLine2
    ),

    landmark: getSafeValue(
      addressData?.landmark
    ),

    pincode: getSafeValue(
      addressData?.pincode ??
      addressData?.pinCode ??
      addressData?.postalCode ??
      addressData?.zipCode
    ),

    city: getSafeValue(
      addressData?.city ??
      addressData?.town
    ),

    state: getSafeValue(
      addressData?.state ??
      addressData?.stateName
    ),

    country: getSafeValue(
      addressData?.country ??
      addressData?.countryName
    ),
  };
}


// ==========================================================
// ADDRESS FIELDS
// ==========================================================

const ADDRESS_FIELDS = [
  {
    id: "houseNo",
    label: "House / Flat",
    icon: FiHome,
  },
  {
    id: "area",
    label: "Area / Street",
    icon: FiMapPin,
  },
  {
    id: "landmark",
    label: "Landmark",
    icon: FiMapPin,
  },
  {
    id: "pincode",
    label: "Pincode",
    icon: FiMapPin,
  },
  {
    id: "city",
    label: "City",
    icon: FiMapPin,
  },
  {
    id: "state",
    label: "State",
    icon: FiMapPin,
  },
];


// ==========================================================
// COMPONENT
// ==========================================================

function AddressInfo() {

  // ========================================================
  // STATE
  // ========================================================

  const [address, setAddress] =
    useState(DEFAULT_ADDRESS);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");


  // ========================================================
  // FETCH ADDRESS
  // ========================================================

  const fetchAddress = async (
    showRefresh = false
  ) => {

    try {

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");


      const response =
        await profileService.getProfile();


      const normalizedAddress =
        extractAddress(response);


      setAddress(
        normalizedAddress
      );

    } catch (err) {

      console.error(
        "Address Fetch Error:",
        err
      );


      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load address information."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  // ========================================================
  // INITIAL LOAD
  // ========================================================

  useEffect(() => {

    let mounted = true;


    const load = async () => {

      try {

        setLoading(true);
        setError("");


        const response =
          await profileService.getProfile();


        if (!mounted) {
          return;
        }


        const normalizedAddress =
          extractAddress(response);


        setAddress(
          normalizedAddress
        );

      } catch (err) {

        console.error(
          "Address Fetch Error:",
          err
        );


        if (!mounted) {
          return;
        }


        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load address information."
        );

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }
    };


    load();


    return () => {
      mounted = false;
    };

  }, []);


  // ========================================================
  // CHECK ADDRESS
  // ========================================================

  const hasAddress = Object.values(
    address
  ).some(
    (value) =>
      String(value || "").trim()
  );


  // ========================================================
  // LOADING STATE
  // ========================================================

  if (loading) {

    return (
      <section className="rounded-3xl border border-border-subtle bg-surface p-5 shadow-sm sm:p-6 lg:p-7">

        {/* Header Skeleton */}

        <div className="flex items-center gap-4">

          <div className="h-12 w-12 animate-pulse rounded-2xl bg-surface-elevated" />

          <div className="flex-1">

            <div className="h-5 w-44 animate-pulse rounded bg-surface-elevated" />

            <div className="mt-2 h-4 w-64 max-w-full animate-pulse rounded bg-surface-elevated" />

          </div>

        </div>


        {/* Fields Skeleton */}

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

          {Array.from({
            length: 6,
          }).map((_, index) => (

            <div
              key={index}
              className="rounded-2xl border border-border-subtle bg-brand-bg p-4"
            >

              <div className="h-3 w-24 animate-pulse rounded bg-surface-elevated" />

              <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-surface-elevated" />

            </div>

          ))}

        </div>


        {/* Country Skeleton */}

        <div className="mt-4 rounded-2xl border border-border-subtle bg-brand-bg p-4">

          <div className="h-3 w-20 animate-pulse rounded bg-surface-elevated" />

          <div className="mt-3 h-5 w-32 animate-pulse rounded bg-surface-elevated" />

        </div>

      </section>
    );
  }


  // ========================================================
  // ERROR STATE
  // ========================================================

  if (error) {

    return (
      <section className="rounded-3xl border border-border-subtle bg-surface p-5 shadow-sm sm:p-6 lg:p-7">

        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">

            <FiAlertCircle
              size={26}
              className="text-red-400"
            />

          </div>


          <div className="flex-1">

            <h2 className="text-xl font-bold text-text-primary">
              Address Information
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              We couldn't load your saved address.
            </p>

          </div>

        </div>


        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">

          <p className="text-sm leading-6 text-red-400">
            {error}
          </p>

        </div>


        <button
          type="button"
          onClick={() =>
            fetchAddress(true)
          }
          disabled={refreshing}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-brand-bg transition-all duration-300 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >

          <FiRefreshCw
            size={16}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Retrying..."
            : "Try Again"}

        </button>

      </section>
    );
  }


  // ========================================================
  // MAIN UI
  // ========================================================

  return (
    <section className="rounded-3xl border border-border-subtle bg-surface p-5 shadow-sm transition-all duration-300 sm:p-6 lg:p-7">


      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft">

            <FiMapPin
              size={23}
              className="text-accent"
            />

          </div>


          <div>

            <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
              Address Information
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Your saved delivery address
            </p>

          </div>

        </div>


        {/* Refresh Button */}

        <button
          type="button"
          onClick={() =>
            fetchAddress(true)
          }
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-border-subtle bg-surface-elevated px-4 py-2.5 text-sm font-medium text-text-secondary transition-all duration-300 hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
        >

          <FiRefreshCw
            size={15}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>


      {/* ==================================================
          STATUS
      ================================================== */}

      <div className="mt-6">

        {hasAddress ? (

          <div className="flex items-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/5 px-4 py-3">

            <FiCheckCircle
              size={17}
              className="shrink-0 text-green-400"
            />

            <p className="text-sm text-green-400">
              Your delivery address is saved.
            </p>

          </div>

        ) : (

          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">

            <p className="text-sm text-yellow-400">
              No delivery address has been added yet.
            </p>

          </div>

        )}

      </div>


      {/* ==================================================
          ADDRESS FIELDS
      ================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

        {ADDRESS_FIELDS.map(
          (field) => {

            const Icon =
              field.icon;

            const value =
              address[field.id];


            return (
              <div
                key={field.id}
                className="group rounded-2xl border border-border-subtle bg-brand-bg p-4 transition-all duration-300 hover:border-accent/40"
              >

                <div className="flex items-center gap-2">

                  <Icon
                    size={15}
                    className="text-accent"
                  />

                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                    {field.label}
                  </span>

                </div>


                <p className="mt-3 min-h-[24px] break-words text-sm font-medium text-text-primary sm:text-base">

                  {value || (
                    <span className="font-normal text-text-muted">
                      Not Added
                    </span>
                  )}

                </p>

              </div>
            );
          }
        )}

      </div>


      {/* ==================================================
          COUNTRY
      ================================================== */}

      <div className="mt-4 rounded-2xl border border-border-subtle bg-brand-bg p-4 transition-all duration-300 hover:border-accent/40">

        <div className="flex items-center gap-2">

          <FiMapPin
            size={15}
            className="text-accent"
          />

          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
            Country
          </span>

        </div>


        <p className="mt-3 text-sm font-medium text-text-primary sm:text-base">

          {address.country || (
            <span className="font-normal text-text-muted">
              Not Added
            </span>
          )}

        </p>

      </div>


      {/* ==================================================
          COMPLETE ADDRESS PREVIEW
      ================================================== */}

      {hasAddress && (
        <div className="mt-6 rounded-2xl border border-accent/10 bg-accent-soft/40 p-5">

          <div className="flex items-start gap-3">

            <FiHome
              size={19}
              className="mt-0.5 shrink-0 text-accent"
            />

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                Delivery Address
              </p>


              <p className="mt-2 text-sm leading-7 text-text-secondary">

                {[
                  address.houseNo,
                  address.area,
                  address.landmark,
                  address.city,
                  address.state,
                  address.pincode,
                  address.country,
                ]
                  .filter(Boolean)
                  .join(", ")}

              </p>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}


export default AddressInfo;