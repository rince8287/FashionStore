import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
} from "react-icons/fi";

import { Link } from "react-router-dom";

function UserInfoCard({ profile }) {
  if (!profile) return null;

  const {
    fullName,
    email,
    phone,
    address,
  } = profile;

  return (
    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 shadow-sm">

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
            User Information
          </h2>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Manage your personal information.
          </p>
        </div>

        <Link
          to="/profile/edit"
          className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[var(--color-accent-hover)]"
        >
          <FiEdit2 size={16} />
          Edit
        </Link>

      </div>

      {/* Information */}

      <div className="space-y-5">

        {/* Name */}

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
            <FiUser size={22} />
          </div>

          <div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Full Name
            </p>

            <h3 className="mt-1 text-lg font-semibold text-[var(--color-text-primary)]">
              {fullName || "Not Added"}
            </h3>
          </div>

        </div>

        {/* Email */}

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
            <FiMail size={22} />
          </div>

          <div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Email Address
            </p>

            <h3 className="mt-1 break-all text-lg font-semibold text-[var(--color-text-primary)]">
              {email || "Not Added"}
            </h3>
          </div>

        </div>

        {/* Phone */}

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
            <FiPhone size={22} />
          </div>

          <div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Phone Number
            </p>

            <h3 className="mt-1 text-lg font-semibold text-[var(--color-text-primary)]">
              {phone || "Not Added"}
            </h3>
          </div>

        </div>

        {/* Address */}

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
            <FiMapPin size={22} />
          </div>

          <div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Address
            </p>

            <h3 className="mt-1 leading-7 text-[var(--color-text-primary)]">
              {address
                ? `${address.houseNo}, ${address.area}, ${address.city}, ${address.state} - ${address.pincode}, ${address.country}`
                : "Not Added"}
            </h3>
          </div>

        </div>

      </div>

    </div>
  );
}

export default UserInfoCard;