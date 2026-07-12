function Home() {
  return (
    <section className="flex min-h-[75vh] items-center justify-center px-6">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-accent">
          New Luxury Experience
        </p>

        <h1 className="mt-5 font-display text-5xl font-semibold text-text-primary md:text-6xl">
          Premium Fashion Store
        </h1>

        <p className="mt-4 text-lg text-text-secondary">
          Our premium design system is ready.
        </p>

        <button
          type="button"
          className="mt-8 rounded-lg bg-accent px-6 py-3 font-semibold text-brand-bg transition-colors duration-300 hover:bg-accent-hover"
        >
          Explore Collection
        </button>
      </div>
    </section>
  );
}

export default Home;