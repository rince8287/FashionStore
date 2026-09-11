import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

const initialFormData = {
  profileImage: "",
  fullName: "",
  email: "",
  phone: "",
  gender: "",
  language: "",
  occupation: "",
  dateOfBirth: "",

  houseNo: "",
  area: "",
  landmark: "",
  pincode: "",
  city: "",
  state: "",
  country: "",
};

function EditProfileForm() {
  const [formData, setFormData] =
    useState(initialFormData);

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ====================================================
  // GET TOKEN
  // ====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ====================================================
  // LOAD PROFILE
  // ====================================================

  useEffect(() => {
    const controller =
      new AbortController();

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          setError(
            "Please login to view your profile."
          );

          return;
        }

        /*
          IMPORTANT:

          Agar tumhare backend ka profile endpoint
          /auth/me nahi hai, to sirf is URL ko
          tumhare actual endpoint se replace karna.
        */

        const response = await fetch(
          `${API_URL}/auth/me`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            credentials: "include",

            signal:
              controller.signal,
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch profile."
          );
        }

        // Backend response compatibility
        const user =
          data.user ||
          data.data ||
          data;

        const address =
          user.address || {};

        setFormData({
          profileImage:
            user.profileImage?.url ||
            user.profileImage ||
            user.avatar?.url ||
            user.avatar ||
            "",

          fullName:
            user.fullName ||
            user.name ||
            "",

          email:
            user.email || "",

          phone:
            user.phone || "",

          gender:
            user.gender || "",

          language:
            user.language || "",

          occupation:
            user.occupation || "",

          dateOfBirth:
            user.dateOfBirth
              ? String(
                  user.dateOfBirth
                ).slice(0, 10)
              : "",

          houseNo:
            address.houseNo || "",

          area:
            address.area || "",

          landmark:
            address.landmark || "",

          pincode:
            address.pincode || "",

          city:
            address.city || "",

          state:
            address.state || "",

          country:
            address.country || "",
        });
      } catch (error) {
        if (
          error.name ===
          "AbortError"
        ) {
          return;
        }

        console.error(
          "Fetch Profile Error:",
          error
        );

        setError(
          error.message ||
            "Failed to load profile."
        );
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      controller.abort();
    };
  }, []);

  // ====================================================
  // INPUT CHANGE
  // ====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ====================================================
  // IMAGE CHANGE
  // ====================================================

  const handleImageChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setSelectedImage(file);

    const imageURL =
      URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      profileImage: imageURL,
    }));
  };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Please login first."
        );
      }

      /*
        IMPORTANT:

        Is URL ko backend ke actual
        update-profile route se match karna hoga.

        Example:
        PUT /api/v1/auth/profile
      */

      const response = await fetch(
        `${API_URL}/auth/profile`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          credentials: "include",

          body: JSON.stringify({
            name:
              formData.fullName,

            phone:
              formData.phone,

            gender:
              formData.gender,

            language:
              formData.language,

            occupation:
              formData.occupation,

            dateOfBirth:
              formData.dateOfBirth,

            address: {
              houseNo:
                formData.houseNo,

              area:
                formData.area,

              landmark:
                formData.landmark,

              pincode:
                formData.pincode,

              city:
                formData.city,

              state:
                formData.state,

              country:
                formData.country,
            },
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update profile."
        );
      }

      setSuccess(
        "Profile updated successfully."
      );

      /*
        Image upload ko hum Upload API
        integration ke time connect karenge.
      */

      if (selectedImage) {
        console.log(
          "Profile image ready for upload:",
          selectedImage
        );
      }
    } catch (error) {
      console.error(
        "Update Profile Error:",
        error
      );

      setError(
        error.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // CANCEL
  // ====================================================

  const handleCancel = () => {
    window.history.back();
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="py-16 text-center text-[var(--color-text-secondary)]">
        Loading profile...
      </div>
    );
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-10"
    >
      {/* ===============================================
          STATUS
      =============================================== */}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">
          {success}
        </div>
      )}

      {/* ===============================================
          PERSONAL INFORMATION
      =============================================== */}

      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6">
        <h2 className="mb-6 text-2xl font-bold text-[var(--color-text-primary)]">
          Personal Information
        </h2>

        {/* Profile Image */}

        <div className="mb-8 flex flex-col items-center">
          {formData.profileImage ? (
            <img
              src={
                formData.profileImage
              }
              alt={
                formData.fullName ||
                "Profile"
              }
              className="h-32 w-32 rounded-full border-4 border-[var(--color-border-subtle)] object-cover"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-4xl font-bold text-[var(--color-accent)]">
              {formData.fullName
                ?.charAt(0)
                ?.toUpperCase() ||
                "U"}
            </div>
          )}

          <label className="mt-4 cursor-pointer rounded-xl bg-[var(--color-accent)] px-5 py-2 font-medium text-black transition hover:bg-[var(--color-accent-hover)]">
            Change Photo

            <input
              type="file"
              accept="image/*"
              onChange={
                handleImageChange
              }
              className="hidden"
            />
          </label>
        </div>

        {/* Fields */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={
                formData.fullName
              }
              onChange={
                handleChange
              }
              required
              className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full cursor-not-allowed rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-muted)] opacity-70"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={
                handleChange
              }
              className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
              Gender
            </label>

            <select
              name="gender"
              value={formData.gender}
              onChange={
                handleChange
              }
              className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            >
              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
              Language
            </label>

            <input
              type="text"
              name="language"
              value={
                formData.language
              }
              onChange={
                handleChange
              }
              className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
              Occupation
            </label>

            <input
              type="text"
              name="occupation"
              value={
                formData.occupation
              }
              onChange={
                handleChange
              }
              className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
              Date of Birth
            </label>

            <input
              type="date"
              name="dateOfBirth"
              value={
                formData.dateOfBirth
              }
              onChange={
                handleChange
              }
              className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            />
          </div>
        </div>
      </div>

      {/* ===============================================
          ADDRESS INFORMATION
      =============================================== */}

      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6">
        <h2 className="mb-6 text-2xl font-bold text-[var(--color-text-primary)]">
          Address Information
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            [
              "houseNo",
              "House No.",
              "Enter House No.",
            ],

            [
              "area",
              "Area",
              "Enter Area",
            ],

            [
              "landmark",
              "Landmark",
              "Enter Landmark",
            ],

            [
              "pincode",
              "Pincode",
              "Enter Pincode",
            ],

            [
              "city",
              "City",
              "Enter City",
            ],

            [
              "state",
              "State",
              "Enter State",
            ],
          ].map(
            ([
              name,
              label,
              placeholder,
            ]) => (
              <div key={name}>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
                  {label}
                </label>

                <input
                  type="text"
                  name={name}
                  value={
                    formData[name]
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    placeholder
                  }
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>
            )
          )}

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
              Country
            </label>

            <input
              type="text"
              name="country"
              value={
                formData.country
              }
              onChange={
                handleChange
              }
              placeholder="Enter Country"
              className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            />
          </div>
        </div>
      </div>

      {/* ===============================================
          ACTION BUTTONS
      =============================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={
            handleCancel
          }
          disabled={saving}
          className="rounded-xl border border-[var(--color-border-subtle)] px-6 py-3 font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-elevated)] disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[var(--color-accent)] px-6 py-3 font-semibold text-black transition hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default EditProfileForm;