function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-8">

      {/* Profile Header Skeleton */}

      <div className="overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]">

        {/* Cover */}

        <div className="h-40 w-full bg-[var(--color-surface)]"></div>

        {/* Content */}

        <div className="relative px-6 pb-8">

          {/* Avatar */}

          <div className="-mt-16 h-32 w-32 rounded-full border-4 border-[var(--color-surface-elevated)] bg-[var(--color-surface)]"></div>

          {/* Name */}

          <div className="mt-6 h-8 w-64 rounded bg-[var(--color-surface)]"></div>

          {/* Email */}

          <div className="mt-3 h-5 w-56 rounded bg-[var(--color-surface)]"></div>

          {/* Phone */}

          <div className="mt-3 h-5 w-40 rounded bg-[var(--color-surface)]"></div>

          {/* Button */}

          <div className="mt-6 h-11 w-40 rounded-xl bg-[var(--color-surface)]"></div>

        </div>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-5"
          >
            <div className="mx-auto h-10 w-10 rounded-full bg-[var(--color-surface)]"></div>

            <div className="mx-auto mt-4 h-6 w-12 rounded bg-[var(--color-surface)]"></div>

            <div className="mx-auto mt-3 h-4 w-20 rounded bg-[var(--color-surface)]"></div>
          </div>
        ))}

      </div>

      {/* Personal Information */}

      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6">

        <div className="mb-6 h-7 w-56 rounded bg-[var(--color-surface)]"></div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4"
            >
              <div className="flex items-center gap-4">

                <div className="h-12 w-12 rounded-xl bg-[var(--color-surface-elevated)]"></div>

                <div className="flex-1">

                  <div className="h-4 w-24 rounded bg-[var(--color-surface-elevated)]"></div>

                  <div className="mt-3 h-5 w-40 rounded bg-[var(--color-surface-elevated)]"></div>

                </div>

              </div>
            </div>
          ))}

        </div>

      </div>

      {/* Menu Skeleton */}

      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6">

        <div className="mb-6 h-7 w-40 rounded bg-[var(--color-surface)]"></div>

        <div className="space-y-4">

          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4"
            >
              <div className="flex items-center gap-4">

                <div className="h-12 w-12 rounded-xl bg-[var(--color-surface-elevated)]"></div>

                <div>

                  <div className="h-5 w-36 rounded bg-[var(--color-surface-elevated)]"></div>

                  <div className="mt-2 h-4 w-28 rounded bg-[var(--color-surface-elevated)]"></div>

                </div>

              </div>

              <div className="h-5 w-5 rounded bg-[var(--color-surface-elevated)]"></div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default ProfileSkeleton;