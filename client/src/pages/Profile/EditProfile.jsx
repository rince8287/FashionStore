import {
  FiArrowLeft,
} from "react-icons/fi";

import {
  Link,
} from "react-router-dom";

import EditProfileForm from "../../components/profile/EditProfileForm";

function EditProfile() {
  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] px-4 py-10">

      <div className="mx-auto max-w-5xl">

        {/* =============================================
            BACK BUTTON
        ============================================= */}

        <Link
          to="/profile"
          className="mb-6 inline-flex items-center gap-2 text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent)]"
        >
          <FiArrowLeft size={18} />

          Back to Profile
        </Link>

        {/* =============================================
            PAGE HEADER
        ============================================= */}

        <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 sm:p-8">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]">
              My Account
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl">
              Edit Profile
            </h1>

            <p className="mt-3 max-w-2xl text-[var(--color-text-secondary)]">
              Update your personal information,
              profile photo and address details.
            </p>
          </div>

        </div>

        {/* =============================================
            EDIT PROFILE FORM
        ============================================= */}

        <div className="mt-8">

          <EditProfileForm />

        </div>

      </div>

    </div>
  );
}

export default EditProfile;