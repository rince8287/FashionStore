function Profile() {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
          Your Account
        </p>

        <h1 className="mt-3 font-display text-3xl font-semibold text-text-primary sm:text-4xl">
          Profile
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
          Manage your personal information, saved addresses and account
          preferences.
        </p>
      </div>
    </section>
  );
}

export default Profile;