import {
  useEffect,
  useState,
} from "react";

import {
  FiUser,
  FiMail,
  FiPhone,
  FiGlobe,
  FiBriefcase,
  FiCalendar,
} from "react-icons/fi";

import profileService from "../../services/profileService";

function PersonalInfo() {
  // ====================================================
  // STATE
  // ====================================================

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ====================================================
  // FETCH PROFILE
  // ====================================================

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await profileService.getProfile();

        if (!mounted) return;

        /*
          Supports responses like:

          {
            success: true,
            user: {...}
          }

          OR

          {
            success: true,
            data: {...}
          }

          OR direct user object
        */

        const profileData =
          response?.user ||
          response?.profile ||
          response?.data ||
          response ||
          {};

        setProfile(profileData);
      } catch (error) {
        console.error(
          "Personal Info Fetch Error:",
          error
        );

        if (!mounted) return;

        setError(
          error.message ||
            "Failed to load personal information."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, []);

  // ====================================================
  // FORMAT DATE
  // ====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not Added";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 shadow-sm">

        <div className="mb-6">
          <div className="h-7 w-56 animate-pulse rounded bg-[var(--color-surface)]" />

          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-[var(--color-surface)]" />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {[1, 2, 3, 4, 5, 6].map(
            (item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-xl bg-[var(--color-surface)]"
              />
            )
          )}

        </div>

      </div>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error) {
    return (
      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 shadow-sm">

        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Personal Information
        </h2>

        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4">

          <p className="text-sm text-red-400">
            {error}
          </p>

        </div>

      </div>
    );
  }

  // ====================================================
  // PROFILE VALUES
  // ====================================================

  const fullName =
    profile?.fullName ||
    profile?.name ||
    "Not Added";

  const email =
    profile?.email ||
    "Not Added";

  const phone =
    profile?.phone ||
    profile?.phoneNumber ||
    "Not Added";

  const gender =
    profile?.gender ||
    "Not Added";

  const language =
    profile?.language ||
    "Not Added";

  const occupation =
    profile?.occupation ||
    "Not Added";

  const dateOfBirth =
    formatDate(
      profile?.dateOfBirth
    );

  // ====================================================
  // INFO
  // ====================================================

  const info = [
    {
      id: "fullName",
      icon: FiUser,
      label: "Full Name",
      value: fullName,
    },
    {
      id: "email",
      icon: FiMail,
      label: "Email Address",
      value: email,
    },
    {
      id: "phone",
      icon: FiPhone,
      label: "Phone Number",
      value: phone,
    },
    {
      id: "gender",
      icon: FiUser,
      label: "Gender",
      value: gender,
    },
    {
      id: "language",
      icon: FiGlobe,
      label: "Language",
      value: language,
    },
    {
      id: "occupation",
      icon: FiBriefcase,
      label: "Occupation",
      value: occupation,
    },
    {
      id: "dateOfBirth",
      icon: FiCalendar,
      label: "Date of Birth",
      value: dateOfBirth,
    },
  ];

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 shadow-sm">

      {/* ===============================================
          HEADER
      =============================================== */}

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Your personal account information.
        </p>

      </div>

      {/* ===============================================
          INFORMATION
      =============================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        {info.map((item) => {
          const Icon =
            item.icon;

          return (
            <div
              key={item.id}
              className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4"
            >

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">

                  <Icon
                    size={20}
                  />

                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {item.label}
                  </p>

                  <h3 className="mt-1 break-words font-semibold text-[var(--color-text-primary)]">
                    {item.value}
                  </h3>

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default PersonalInfo;