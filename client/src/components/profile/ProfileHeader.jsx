import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  FiEdit2,
  FiUser,
} from "react-icons/fi";

import {
  FaMedal,
} from "react-icons/fa6";

import profileService from "../../services/profileService";

function ProfileHeader() {
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
          Supports:

          {
            success: true,
            user: {...}
          }

          OR

          {
            success: true,
            profile: {...}
          }

          OR

          {
            success: true,
            data: {...}
          }

          OR direct profile object
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
          "Profile Header Fetch Error:",
          error
        );

        if (!mounted) return;

        setError(
          error.message ||
            "Failed to load profile."
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
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <section className="w-full overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-lg">

        {/* Cover Skeleton */}

        <div className="h-32 w-full animate-pulse bg-[var(--color-surface-elevated)] md:h-40" />

        <div className="px-6 pb-8">

          {/* Avatar Skeleton */}

          <div className="-mt-16 flex justify-center">

            <div className="h-32 w-32 animate-pulse rounded-full border-4 border-[var(--color-surface)] bg-[var(--color-surface-elevated)]" />

          </div>

          {/* Text Skeleton */}

          <div className="mt-6 flex flex-col items-center">

            <div className="h-8 w-48 animate-pulse rounded bg-[var(--color-surface-elevated)]" />

            <div className="mt-3 h-4 w-56 animate-pulse rounded bg-[var(--color-surface-elevated)]" />

            <div className="mt-2 h-4 w-36 animate-pulse rounded bg-[var(--color-surface-elevated)]" />

          </div>

        </div>

      </section>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error) {
    return (
      <section className="w-full rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8 shadow-lg">

        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-center">

          <p className="text-sm text-red-400">
            {error}
          </p>

        </div>

      </section>
    );
  }

  // ====================================================
  // SAFE PROFILE VALUES
  // ====================================================

  const fullName =
    profile?.fullName ||
    profile?.name ||
    "User";

  const email =
    profile?.email ||
    "Email not added";

  const phone =
    profile?.phone ||
    profile?.phoneNumber ||
    "Phone not added";

  const profileImage =
    profile?.profileImage ||
    profile?.avatar ||
    profile?.image ||
    "";

  // ====================================================
  // REWARD LEVEL
  // ====================================================

  const rewardLevel =
    profile?.rewards?.level ||
    profile?.rewardLevel ||
    profile?.membershipLevel ||
    null;

  // ====================================================
  // UI
  // ====================================================

  return (
    <section className="w-full overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-lg">

      {/* ===============================================
          COVER BANNER
      =============================================== */}

      <div className="h-32 w-full bg-gradient-to-r from-[var(--color-accent-soft)] via-[var(--color-surface-elevated)] to-[var(--color-brand-bg)] md:h-40" />

      {/* ===============================================
          CONTENT
      =============================================== */}

      <div className="px-4 pb-8 sm:px-6">

        {/* =============================================
            AVATAR
        ============================================= */}

        <div className="-mt-16 flex justify-center">

          <div className="relative">

            {profileImage ? (
              <img
                src={profileImage}
                alt={fullName}
                className="h-32 w-32 rounded-full border-4 border-[var(--color-surface)] object-cover"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-[var(--color-surface)] bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]">

                <FiUser size={48} />

              </div>
            )}

            {/* Online Status */}

            <span className="absolute bottom-2 right-2 h-6 w-6 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-success)]" />

          </div>

        </div>

        {/* =============================================
            USER DETAILS
        ============================================= */}

        <div className="mt-6 text-center">

          <h2 className="break-words text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
            {fullName}
          </h2>

          <p className="mt-2 break-all text-sm text-[var(--color-text-secondary)]">
            {email}
          </p>

          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {phone}
          </p>

        </div>

        {/* =============================================
            MEMBER BADGE
        ============================================= */}

        {rewardLevel && (
          <div className="mt-5 flex justify-center">

            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-soft)] px-5 py-2">

              <FaMedal
                size={18}
                className="text-[var(--color-accent)]"
              />

              <span className="font-semibold text-[var(--color-accent)]">
                {rewardLevel} Member
              </span>

            </div>

          </div>
        )}

        {/* =============================================
            EDIT PROFILE
        ============================================= */}

        <div className="mt-6 flex justify-center">

          <Link
            to="/profile/edit"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3 font-semibold text-black transition-all duration-300 hover:bg-[var(--color-accent-hover)]"
          >

            <FiEdit2 size={18} />

            Edit Profile

          </Link>

        </div>

      </div>

    </section>
  );
}

export default ProfileHeader;