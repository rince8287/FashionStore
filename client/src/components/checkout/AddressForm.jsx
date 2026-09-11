import {
  useState,
} from "react";

import {
  FiHome,
  FiMapPin,
  FiPhone,
  FiSave,
  FiUser,
  FiBriefcase,
  FiCheck,
  FiLoader,
} from "react-icons/fi";

import addressService from "../../services/addressService";

function AddressForm({
  onSave,
  editAddress = null,
}) {
  // =========================================================
  // LOADING
  // =========================================================

  const [loading, setLoading] =
    useState(false);

  // =========================================================
  // ERRORS
  // =========================================================

  const [errors, setErrors] =
    useState({});

  // =========================================================
  // FORM DATA
  // =========================================================

  const [formData, setFormData] =
    useState({
      fullName:
        editAddress?.fullName || "",

      phone:
        editAddress?.phone || "",

      house:
        editAddress?.houseNumber ||
        editAddress?.house ||
        "",

      street:
        editAddress?.area ||
        editAddress?.street ||
        "",

      landmark:
        editAddress?.landmark || "",

      city:
        editAddress?.city || "",

      state:
        editAddress?.state || "",

      pincode:
        editAddress?.postalCode ||
        editAddress?.pincode ||
        "",

      type:
        editAddress?.addressType ||
        editAddress?.type ||
        "Home",
    });

  // =========================================================
  // STATES
  // =========================================================

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Tamil Nadu",
    "Telangana",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (errors.submit) {
      setErrors((prev) => ({
        ...prev,
        submit: "",
      }));
    }
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName =
        "Full name is required";
    }

    if (
      !/^[6-9]\d{9}$/.test(
        formData.phone.trim()
      )
    ) {
      newErrors.phone =
        "Enter a valid 10-digit mobile number";
    }

    if (!formData.house.trim()) {
      newErrors.house =
        "House / Flat No is required";
    }

    if (!formData.street.trim()) {
      newErrors.street =
        "Street / Area is required";
    }

    if (!formData.city.trim()) {
      newErrors.city =
        "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state =
        "State is required";
    }

    if (
      !/^\d{6}$/.test(
        formData.pincode.trim()
      )
    ) {
      newErrors.pincode =
        "Enter a valid 6-digit pincode";
    }

    if (
      ![
        "Home",
        "Office",
        "Other",
      ].includes(formData.type)
    ) {
      newErrors.type =
        "Please select address type";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // =========================================================
  // SAVE ADDRESS
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // =====================================================
      // BACKEND PAYLOAD
      // =====================================================

      const addressData = {
        fullName:
          formData.fullName.trim(),

        phone:
          formData.phone.trim(),

        houseNumber:
          formData.house.trim(),

        area:
          formData.street.trim(),

        landmark:
          formData.landmark.trim(),

        city:
          formData.city.trim(),

        state:
          formData.state.trim(),

        country: "India",

        postalCode:
          formData.pincode.trim(),

        addressType:
          formData.type,

        label:
          formData.type === "Office"
            ? "Work"
            : formData.type,

        alternatePhone: "",

        deliveryInstructions: "",

        location: {
          latitude: null,
          longitude: null,
        },

        isDefault:
          !editAddress,
      };

      // =====================================================
      // CREATE / UPDATE
      // =====================================================

      let response;

      if (editAddress?._id) {
        response =
          await addressService.updateAddress(
            editAddress._id,
            addressData
          );
      } else {
        response =
          await addressService.createAddress(
            addressData
          );
      }

      // =====================================================
      // RESPONSE
      // =====================================================

      const savedAddress =
        response?.address ||
        response?.data ||
        response;

      if (onSave) {
        onSave(savedAddress);
      }
    } catch (error) {
      console.error(
        "SAVE ADDRESS ERROR:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save address.";

      setErrors((prev) => ({
        ...prev,
        submit: message,
      }));
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INPUT CLASS
  // =========================================================

  const getInputClass = (field) => `
    w-full
    rounded-lg
    border
    bg-brand-bg
    px-3.5
    py-2.5
    text-xs
    text-text-primary
    outline-none
    placeholder:text-text-muted/60
    transition-all
    duration-200
    focus:bg-surface
    focus:ring-2
    focus:ring-accent/10
    ${
      errors[field]
        ? `
          border-red-500/60
          focus:border-red-500
        `
        : `
          border-border-subtle
          focus:border-accent/60
        `
    }
  `;

  // =========================================================
  // COMPONENT
  // =========================================================

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-border-subtle
        bg-surface
        shadow-[0_18px_50px_rgba(0,0,0,0.14)]
      "
    >
      {/* =====================================================
          TOP ACCENT LINE
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
            HEADER
        =================================================== */}

        <div
          className="
            flex
            items-start
            gap-3
            border-b
            border-border-subtle
            pb-4
          "
        >
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
              bg-accent-soft
              text-accent
            "
          >
            <FiMapPin size={18} />
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
              <h2
                className="
                  text-lg
                  font-bold
                  tracking-tight
                  text-text-primary
                  sm:text-xl
                "
              >
                {editAddress
                  ? "Edit Address"
                  : "Add New Address"}
              </h2>

              <span
                className="
                  rounded-full
                  bg-accent/10
                  px-2
                  py-0.5
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-accent
                "
              >
                {editAddress
                  ? "Update"
                  : "Delivery"}
              </span>
            </div>

            <p
              className="
                mt-1
                text-[10px]
                leading-4
                text-text-muted
                sm:text-xs
              "
            >
              Enter your details for a smooth
              delivery experience.
            </p>
          </div>
        </div>

        {/* ===================================================
            SERVER ERROR
        =================================================== */}

        {errors.submit && (
          <div
            className="
              mt-4
              flex
              items-start
              gap-2.5
              rounded-lg
              border
              border-red-500/20
              bg-red-500/[0.07]
              px-3
              py-2.5
            "
          >
            <span
              className="
                mt-0.5
                h-1.5
                w-1.5
                shrink-0
                rounded-full
                bg-red-400
              "
            />

            <p
              className="
                text-[10px]
                leading-4
                text-red-400
                sm:text-xs
              "
            >
              {errors.submit}
            </p>
          </div>
        )}

        {/* ===================================================
            FORM
        =================================================== */}

        <form
          onSubmit={handleSubmit}
          className="
            mt-5
            space-y-4
          "
        >
          {/* =================================================
              PERSONAL DETAILS
          ================================================= */}

          <FormSectionTitle
            number="01"
            title="Personal Details"
          />

          <div
            className="
              grid
              gap-3
              sm:grid-cols-2
            "
          >
            {/* FULL NAME */}

            <FormField
              label="Full Name"
              required
              error={errors.fullName}
            >
              <div className="relative">
                <FiUser
                  size={15}
                  className="
                    pointer-events-none
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-text-muted
                  "
                />

                <input
                  type="text"
                  name="fullName"
                  value={
                    formData.fullName
                  }
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  className={`${getInputClass(
                    "fullName"
                  )} pl-10`}
                />
              </div>
            </FormField>

            {/* PHONE */}

            <FormField
              label="Mobile Number"
              required
              error={errors.phone}
            >
              <div className="relative">
                <FiPhone
                  size={15}
                  className="
                    pointer-events-none
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-text-muted
                  "
                />

                <input
                  type="tel"
                  name="phone"
                  value={
                    formData.phone
                  }
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  inputMode="numeric"
                  autoComplete="tel"
                  className={`${getInputClass(
                    "phone"
                  )} pl-10`}
                />
              </div>
            </FormField>
          </div>

          {/* =================================================
              ADDRESS DETAILS
          ================================================= */}

          <div className="pt-2">
            <FormSectionTitle
              number="02"
              title="Delivery Address"
            />
          </div>

          <div
            className="
              grid
              gap-3
              sm:grid-cols-2
            "
          >
            {/* HOUSE */}

            <FormField
              label="House / Flat No."
              required
              error={errors.house}
            >
              <div className="relative">
                <FiHome
                  size={15}
                  className="
                    pointer-events-none
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-text-muted
                  "
                />

                <input
                  type="text"
                  name="house"
                  value={
                    formData.house
                  }
                  onChange={handleChange}
                  placeholder="House / Flat No."
                  autoComplete="address-line1"
                  className={`${getInputClass(
                    "house"
                  )} pl-10`}
                />
              </div>
            </FormField>

            {/* LANDMARK */}

            <FormField
              label="Landmark"
              optional
            >
              <input
                type="text"
                name="landmark"
                value={
                  formData.landmark
                }
                onChange={handleChange}
                placeholder="Nearby landmark"
                autoComplete="off"
                className={getInputClass(
                  "landmark"
                )}
              />
            </FormField>
          </div>

          {/* STREET */}

          <FormField
            label="Street / Area"
            required
            error={errors.street}
          >
            <div className="relative">
              <FiMapPin
                size={15}
                className="
                  pointer-events-none
                  absolute
                  left-3.5
                  top-3.5
                  text-text-muted
                "
              />

              <textarea
                rows={2}
                name="street"
                value={
                  formData.street
                }
                onChange={handleChange}
                placeholder="Street, Area, Colony"
                autoComplete="street-address"
                className={`${getInputClass(
                  "street"
                )} resize-none pl-10`}
              />
            </div>
          </FormField>

          {/* CITY / STATE / PINCODE */}

          <div
            className="
              grid
              gap-3
              sm:grid-cols-3
            "
          >
            {/* CITY */}

            <FormField
              label="City"
              required
              error={errors.city}
            >
              <input
                type="text"
                name="city"
                value={
                  formData.city
                }
                onChange={handleChange}
                placeholder="City"
                autoComplete="address-level2"
                className={getInputClass(
                  "city"
                )}
              />
            </FormField>

            {/* STATE */}

            <FormField
              label="State"
              required
              error={errors.state}
            >
              <select
                name="state"
                value={
                  formData.state
                }
                onChange={handleChange}
                className={getInputClass(
                  "state"
                )}
              >
                <option value="">
                  Select state
                </option>

                {states.map(
                  (state) => (
                    <option
                      key={state}
                      value={state}
                    >
                      {state}
                    </option>
                  )
                )}
              </select>
            </FormField>

            {/* PINCODE */}

            <FormField
              label="Pincode"
              required
              error={errors.pincode}
            >
              <input
                type="text"
                name="pincode"
                value={
                  formData.pincode
                }
                onChange={handleChange}
                maxLength={6}
                inputMode="numeric"
                placeholder="110001"
                autoComplete="postal-code"
                className={getInputClass(
                  "pincode"
                )}
              />
            </FormField>
          </div>

          {/* =================================================
              ADDRESS TYPE
          ================================================= */}

          <div className="pt-2">
            <FormSectionTitle
              number="03"
              title="Address Type"
            />

            <div
              className="
                mt-3
                grid
                grid-cols-3
                gap-2
              "
            >
              {[
                {
                  name: "Home",
                  icon: FiHome,
                },
                {
                  name: "Office",
                  icon: FiBriefcase,
                },
                {
                  name: "Other",
                  icon: FiMapPin,
                },
              ].map(
                ({
                  name,
                  icon: Icon,
                }) => {
                  const selected =
                    formData.type ===
                    name;

                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        setFormData(
                          (prev) => ({
                            ...prev,
                            type: name,
                          })
                        );

                        if (errors.type) {
                          setErrors(
                            (prev) => ({
                              ...prev,
                              type: "",
                            })
                          );
                        }
                      }}
                      className={`
                        group
                        relative
                        flex
                        h-10
                        items-center
                        justify-center
                        gap-1.5
                        overflow-hidden
                        rounded-lg
                        border
                        text-[10px]
                        font-semibold
                        transition-all
                        duration-250
                        active:scale-[0.98]
                        sm:h-11
                        sm:text-xs
                        ${
                          selected
                            ? `
                              border-accent
                              bg-accent
                              text-black
                              shadow-[0_6px_18px_rgba(212,175,55,0.12)]
                            `
                            : `
                              border-border-subtle
                              bg-brand-bg
                              text-text-secondary
                              hover:border-accent/40
                              hover:text-accent
                            `
                        }
                      `}
                    >
                      <Icon size={14} />

                      {name}

                      {selected && (
                        <span
                          className="
                            absolute
                            right-2
                            top-2
                          "
                        >
                          <FiCheck
                            size={10}
                            strokeWidth={3}
                          />
                        </span>
                      )}
                    </button>
                  );
                }
              )}
            </div>

            {errors.type && (
              <p
                className="
                  mt-1.5
                  text-[10px]
                  text-red-400
                "
              >
                {errors.type}
              </p>
            )}
          </div>

          {/* =================================================
              SAVE BUTTON
          ================================================= */}

          <div
            className="
              border-t
              border-border-subtle
              pt-4
            "
          >
            <button
              type="submit"
              disabled={loading}
              className={`
                group
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                text-xs
                font-bold
                transition-all
                duration-300
                active:scale-[0.99]
                sm:h-12
                sm:text-sm
                ${
                  loading
                    ? `
                      cursor-not-allowed
                      bg-surface-elevated
                      text-text-muted
                    `
                    : `
                      bg-accent
                      text-black
                      hover:bg-accent-hover
                      hover:shadow-[0_10px_25px_rgba(212,175,55,0.13)]
                    `
                }
              `}
            >
              {loading ? (
                <>
                  <FiLoader
                    size={15}
                    className="animate-spin"
                  />

                  Saving...
                </>
              ) : (
                <>
                  <FiSave
                    size={15}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-y-[-1px]
                    "
                  />

                  {editAddress
                    ? "Update Address"
                    : "Save Address"}
                </>
              )}
            </button>

            <p
              className="
                mt-2
                text-center
                text-[9px]
                text-text-muted
              "
            >
              Your address details are used
              only for delivery.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

// =============================================================
// FORM SECTION TITLE
// =============================================================

function FormSectionTitle({
  number,
  title,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-2
      "
    >
      <span
        className="
          text-[9px]
          font-bold
          tracking-[0.12em]
          text-accent
        "
      >
        {number}
      </span>

      <span
        className="
          h-px
          w-5
          bg-border-subtle
        "
      />

      <h3
        className="
          text-[10px]
          font-bold
          uppercase
          tracking-[0.16em]
          text-text-secondary
        "
      >
        {title}
      </h3>
    </div>
  );
}

// =============================================================
// FORM FIELD
// =============================================================

function FormField({
  label,
  required = false,
  optional = false,
  error,
  children,
}) {
  return (
    <div className="min-w-0">
      <div
        className="
          mb-1.5
          flex
          items-center
          justify-between
          gap-2
        "
      >
        <label
          className="
            text-[10px]
            font-semibold
            text-text-primary
            sm:text-[11px]
          "
        >
          {label}

          {required && (
            <span className="ml-1 text-accent">
              *
            </span>
          )}
        </label>

        {optional && (
          <span
            className="
              text-[8px]
              text-text-muted
            "
          >
            Optional
          </span>
        )}
      </div>

      {children}

      {error && (
        <p
          className="
            mt-1
            text-[9px]
            leading-4
            text-red-400
          "
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default AddressForm;