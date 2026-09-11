import { useState } from "react";

import {
  FiAlertCircle,
  FiCheck,
  FiCrosshair,
  FiLoader,
  FiMapPin,
  FiNavigation,
  FiRefreshCw,
  FiShield,
} from "react-icons/fi";

function GoogleLocation({
  onSelectAddress,
}) {
  // =========================================================
  // STATE
  // =========================================================

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [location, setLocation] =
    useState({
      lat: null,
      lng: null,
    });

  // =========================================================
  // LOCATION AVAILABLE
  // =========================================================

  const hasLocation =
    Number.isFinite(location.lat) &&
    Number.isFinite(location.lng);

  // =========================================================
  // FORMAT COORDINATES
  // =========================================================

  const formatCoordinate = (
    value
  ) => {
    if (!Number.isFinite(value)) {
      return "--";
    }

    return value.toFixed(6);
  };

  // =========================================================
  // GET CURRENT LOCATION
  // =========================================================

  const getCurrentLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setError(
        "Location services are not supported by your browser."
      );
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        setLocation({
          lat: latitude,
          lng: longitude,
        });

        setLoading(false);
      },

      (err) => {
        setLoading(false);

        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(
              "Location permission was denied. Please allow location access and try again."
            );
            break;

          case err.POSITION_UNAVAILABLE:
            setError(
              "Your current location could not be detected."
            );
            break;

          case err.TIMEOUT:
            setError(
              "Location detection took too long. Please try again."
            );
            break;

          default:
            setError(
              "Unable to detect your location. Please try again."
            );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // =========================================================
  // CONFIRM LOCATION
  // =========================================================

  const handleConfirm = () => {
    if (!hasLocation) {
      return;
    }

    if (
      typeof onSelectAddress ===
      "function"
    ) {
      onSelectAddress({
        id: Date.now(),

        type: "Current Location",

        fullName: "",

        phone: "",

        house: "",

        street: "",

        landmark: "",

        city: "",

        state: "",

        pincode: "",

        latitude: location.lat,

        longitude: location.lng,

        isDefault: false,
      });
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
        shadow-[0_14px_40px_rgba(0,0,0,0.1)]
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
            {/* ICON */}

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
              <FiCrosshair
                size={16}
              />
            </div>

            {/* TITLE */}

            <div className="min-w-0">
              <h2
                className="
                  text-sm
                  font-bold
                  text-text-primary
                  sm:text-[15px]
                "
              >
                Use Current Location
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
                Detect your location automatically
              </p>
            </div>
          </div>

          {/* PRIVACY */}

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
              Private
            </span>
          </div>
        </div>

        {/* ===================================================
            MAIN ACTION
        =================================================== */}

        {!hasLocation && (
          <div
            className="
              mt-4
              rounded-lg
              border
              border-border-subtle
              bg-brand-bg/50
              p-3
            "
          >
            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
              "
            >
              {/* INFO */}

              <div
                className="
                  flex
                  min-w-0
                  flex-1
                  items-center
                  gap-2.5
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-accent/10
                    text-accent
                  "
                >
                  <FiMapPin
                    size={14}
                  />
                </div>

                <p
                  className="
                    text-[9px]
                    leading-4
                    text-text-muted
                    sm:text-[10px]
                  "
                >
                  Allow location access to
                  quickly find your current
                  position.
                </p>
              </div>

              {/* BUTTON */}

              <button
                type="button"
                onClick={
                  getCurrentLocation
                }
                disabled={loading}
                className="
                  group
                  flex
                  h-10
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-accent
                  px-4
                  text-[10px]
                  font-bold
                  text-black
                  outline-none
                  transition-all
                  duration-300
                  hover:bg-accent-hover
                  hover:shadow-[0_8px_20px_rgba(212,175,55,0.12)]
                  active:scale-[0.98]
                  focus-visible:ring-2
                  focus-visible:ring-accent
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:px-5
                "
              >
                {loading ? (
                  <>
                    <FiLoader
                      size={13}
                      className="animate-spin"
                    />

                    Detecting...
                  </>
                ) : (
                  <>
                    <FiNavigation
                      size={13}
                      className="
                        transition-transform
                        duration-300
                        group-hover:-translate-y-0.5
                      "
                    />

                    Detect Location
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div
            className="
              mt-3
              flex
              items-start
              gap-2.5
              rounded-lg
              border
              border-red-500/20
              bg-red-500/[0.06]
              px-3
              py-2.5
            "
          >
            <FiAlertCircle
              size={14}
              className="
                mt-0.5
                shrink-0
                text-red-400
              "
            />

            <p
              className="
                text-[9px]
                leading-4
                text-red-400
                sm:text-[10px]
              "
            >
              {error}
            </p>
          </div>
        )}

        {/* ===================================================
            LOCATION DETECTED
        =================================================== */}

        {hasLocation && (
          <div
            className="
              mt-4
              overflow-hidden
              rounded-lg
              border
              border-accent/40
              bg-accent-soft
            "
          >
            {/* STATUS */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                border-b
                border-accent/10
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
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-green-500
                    text-black
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
                      text-text-primary
                    "
                  >
                    Location detected
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[8px]
                      text-text-muted
                    "
                  >
                    Your current coordinates are ready.
                  </p>
                </div>
              </div>

              {/* REFRESH */}

              <button
                type="button"
                onClick={
                  getCurrentLocation
                }
                disabled={loading}
                aria-label="Refresh current location"
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
                  bg-surface
                  text-text-muted
                  transition-all
                  duration-200
                  hover:border-accent/40
                  hover:text-accent
                  active:scale-90
                  disabled:opacity-50
                "
              >
                <FiRefreshCw
                  size={12}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>
            </div>

            {/* COORDINATES */}

            <div
              className="
                grid
                grid-cols-2
                gap-2
                p-3
              "
            >
              <Coordinate
                label="Latitude"
                value={formatCoordinate(
                  location.lat
                )}
              />

              <Coordinate
                label="Longitude"
                value={formatCoordinate(
                  location.lng
                )}
              />
            </div>

            {/* ACTIONS */}

            <div
              className="
                flex
                gap-2
                border-t
                border-accent/10
                p-3
              "
            >
              <button
                type="button"
                onClick={
                  getCurrentLocation
                }
                disabled={loading}
                className="
                  flex
                  h-9
                  flex-1
                  items-center
                  justify-center
                  gap-1.5
                  rounded-lg
                  border
                  border-border-subtle
                  bg-brand-bg
                  text-[9px]
                  font-semibold
                  text-text-secondary
                  transition-all
                  duration-200
                  hover:border-accent/40
                  hover:text-accent
                  active:scale-[0.98]
                  disabled:opacity-50
                  sm:text-[10px]
                "
              >
                <FiRefreshCw
                  size={12}
                />

                Refresh
              </button>

              <button
                type="button"
                onClick={
                  handleConfirm
                }
                className="
                  flex
                  h-9
                  flex-[1.5]
                  items-center
                  justify-center
                  gap-1.5
                  rounded-lg
                  bg-accent
                  text-[9px]
                  font-bold
                  text-black
                  transition-all
                  duration-300
                  hover:bg-accent-hover
                  hover:shadow-[0_7px_18px_rgba(212,175,55,0.12)]
                  active:scale-[0.98]
                  sm:text-[10px]
                "
              >
                <FiCheck
                  size={12}
                  strokeWidth={3}
                />

                Confirm Location
              </button>
            </div>
          </div>
        )}

        {/* ===================================================
            MAP PLACEHOLDER
        =================================================== */}

        {hasLocation && (
          <div
            className="
              mt-3
              flex
              min-h-[90px]
              items-center
              justify-between
              gap-3
              overflow-hidden
              rounded-lg
              border
              border-dashed
              border-border-subtle
              bg-brand-bg/40
              px-3
              py-3
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
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-accent/10
                  text-accent
                "
              >
                <FiMapPin
                  size={14}
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[10px]
                    font-semibold
                    text-text-primary
                  "
                >
                  Map preview
                </p>

                <p
                  className="
                    mt-0.5
                    text-[8px]
                    leading-4
                    text-text-muted
                  "
                >
                  Google Maps integration can
                  be connected here later.
                </p>
              </div>
            </div>

            <span
              className="
                shrink-0
                rounded-full
                border
                border-border-subtle
                px-2
                py-1
                text-[7px]
                font-semibold
                uppercase
                tracking-wide
                text-text-muted
              "
            >
              Coming soon
            </span>
          </div>
        )}

        {/* ===================================================
            PRIVACY NOTE
        =================================================== */}

        <div
          className="
            mt-3
            flex
            items-center
            gap-1.5
            px-0.5
          "
        >
          <FiShield
            size={10}
            className="
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
            Your location is used only to
            help determine your delivery position.
          </p>
        </div>
      </div>
    </section>
  );
}

// =============================================================
// COORDINATE
// =============================================================

function Coordinate({
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-lg
        border
        border-border-subtle
        bg-brand-bg/50
        px-3
        py-2
      "
    >
      <p
        className="
          text-[7px]
          font-semibold
          uppercase
          tracking-wider
          text-text-muted
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          truncate
          font-mono
          text-[10px]
          font-medium
          text-text-secondary
          sm:text-xs
        "
      >
        {value}
      </p>
    </div>
  );
}

export default GoogleLocation;