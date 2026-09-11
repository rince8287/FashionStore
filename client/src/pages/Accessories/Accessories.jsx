import { Link } from "react-router-dom";

function Accessories() {
  const accessoryCategories = [
    {
      title: "Bags",
      description:
        "Everyday bags and statement pieces for every look.",
      icon: "▱",
    },
    {
      title: "Watches",
      description:
        "Refined timepieces that complete your style.",
      icon: "◷",
    },
    {
      title: "Jewellery",
      description:
        "Elegant details designed to elevate your outfit.",
      icon: "◇",
    },
    {
      title: "Sunglasses",
      description:
        "Modern frames with effortless everyday appeal.",
      icon: "⌁",
    },
  ];

  return (
    <main
      className="
        min-h-screen
        overflow-x-hidden
        bg-brand-bg
        text-text-primary
      "
    >
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          border-b
          border-border-subtle
        "
      >
        {/* Decorative glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-32
            h-72
            w-72
            rounded-full
            bg-accent/[0.06]
            blur-[100px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-40
            left-1/3
            h-72
            w-72
            rounded-full
            bg-accent/[0.025]
            blur-[100px]
          "
        />

        <div
          className="
            relative
            mx-auto
            w-full
            max-w-[1180px]
            px-4
            pb-12
            pt-7
            sm:px-6
            sm:pb-14
            sm:pt-9
            lg:px-8
            lg:pb-16
            lg:pt-10
          "
        >
          {/* =================================================
              BREADCRUMB
          ================================================= */}

          <nav
            aria-label="Breadcrumb"
            className="
              flex
              items-center
              gap-2
              text-[10px]
              font-medium
              text-text-muted
              sm:text-xs
            "
          >
            <Link
              to="/"
              className="
                transition-colors
                duration-200
                hover:text-accent
              "
            >
              Home
            </Link>

            <span className="opacity-40">
              /
            </span>

            <span className="text-text-secondary">
              Accessories
            </span>
          </nav>

          {/* =================================================
              HERO CONTENT
          ================================================= */}

          <div
            className="
              mt-10
              max-w-3xl
              animate-[accessoriesReveal_.55s_ease-out_both]
              sm:mt-12
              lg:mt-14
            "
          >
            {/* EYEBROW */}

            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-accent
                  shadow-[0_0_12px_rgba(212,175,55,0.5)]
                "
              />

              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.3em]
                  text-accent
                  sm:text-xs
                "
              >
                Accessories Collection
              </p>
            </div>

            {/* HEADING */}

            <h1
              className="
                mt-4
                font-display
                text-4xl
                font-semibold
                leading-[1.05]
                tracking-tight
                text-text-primary
                sm:text-5xl
                lg:text-6xl
              "
            >
              The details
              <span className="text-accent">
                {" "}matter.
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mt-5
                max-w-2xl
                text-sm
                leading-6
                text-text-secondary
                sm:text-base
                sm:leading-7
              "
            >
              Complete your look with carefully
              selected accessories designed to
              bring personality, balance and
              effortless style to every outfit.
            </p>

            {/* CTA */}

            <div
              className="
                mt-7
                flex
                flex-wrap
                gap-3
              "
            >
              <Link
                to="/products"
                className="
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  rounded-lg
                  bg-accent
                  px-5
                  text-xs
                  font-bold
                  text-black
                  transition-all
                  duration-300
                  hover:bg-accent-hover
                  hover:shadow-[0_10px_25px_rgba(212,175,55,0.14)]
                  active:scale-95
                  sm:h-11
                  sm:px-6
                  sm:text-sm
                "
              >
                Explore Accessories
              </Link>

              <Link
                to="/products"
                className="
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-border-subtle
                  bg-surface
                  px-5
                  text-xs
                  font-semibold
                  text-text-secondary
                  transition-all
                  duration-300
                  hover:border-accent
                  hover:text-accent
                  active:scale-95
                  sm:h-11
                  sm:px-6
                  sm:text-sm
                "
              >
                Shop Collection
              </Link>
            </div>
          </div>

          {/* =================================================
              QUICK STATS
          ================================================= */}

          <div
            className="
              mt-10
              grid
              max-w-2xl
              grid-cols-3
              overflow-hidden
              rounded-xl
              border
              border-border-subtle
              bg-surface/70
              backdrop-blur-md
              sm:mt-12
            "
          >
            <AccessoryStat
              value="04"
              label="Collections"
            />

            <AccessoryStat
              value="24/7"
              label="Easy Shopping"
            />

            <AccessoryStat
              value="01"
              label="Complete Look"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORY EXPLORER
      ===================================================== */}

      <section
        className="
          py-10
          sm:py-12
          lg:py-14
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1180px]
            px-4
            sm:px-6
            lg:px-8
          "
        >
          {/* SECTION HEADER */}

          <div
            className="
              mb-7
              flex
              flex-col
              gap-2
              sm:mb-8
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.25em]
                  text-accent
                  sm:text-xs
                "
              >
                Discover
              </p>

              <h2
                className="
                  mt-1.5
                  text-2xl
                  font-bold
                  tracking-tight
                  text-text-primary
                  sm:text-3xl
                "
              >
                Complete your look
              </h2>
            </div>

            <p
              className="
                max-w-md
                text-xs
                leading-5
                text-text-muted
                sm:text-sm
              "
            >
              Find the finishing touches that
              turn a good outfit into a complete
              look.
            </p>
          </div>

          {/* =================================================
              CATEGORY CARDS
          ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              gap-3
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {accessoryCategories.map(
              (
                category,
                index
              ) => (
                <Link
                  key={
                    category.title
                  }
                  to="/products"
                  className="
                    group
                    relative
                    min-w-0
                    overflow-hidden
                    rounded-xl
                    border
                    border-border-subtle
                    bg-surface
                    p-5
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-accent/40
                    hover:shadow-[0_14px_35px_rgba(0,0,0,0.18)]
                    animate-[accessoryCardReveal_.45s_ease-out_both]
                    sm:p-6
                  "
                  style={{
                    animationDelay: `${
                      index * 70
                    }ms`,
                  }}
                >
                  {/* CARD GLOW */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-8
                      -top-8
                      h-24
                      w-24
                      rounded-full
                      bg-accent/[0.035]
                      blur-2xl
                      transition-all
                      duration-500
                      group-hover:bg-accent/[0.08]
                    "
                  />

                  {/* ICON */}

                  <div
                    className="
                      relative
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-accent/20
                      bg-accent-soft
                      text-lg
                      text-accent
                      transition-all
                      duration-300
                      group-hover:scale-105
                      group-hover:border-accent/40
                    "
                  >
                    {category.icon}
                  </div>

                  {/* CONTENT */}

                  <div className="relative mt-5">
                    <h3
                      className="
                        text-sm
                        font-bold
                        text-text-primary
                        sm:text-base
                      "
                    >
                      {category.title}
                    </h3>

                    <p
                      className="
                        mt-1.5
                        text-[11px]
                        leading-5
                        text-text-muted
                        sm:text-xs
                      "
                    >
                      {
                        category.description
                      }
                    </p>
                  </div>

                  {/* EXPLORE */}

                  <div
                    className="
                      relative
                      mt-5
                      flex
                      items-center
                      gap-1
                      text-[10px]
                      font-semibold
                      text-text-muted
                      transition-colors
                      duration-300
                      group-hover:text-accent
                    "
                  >
                    Explore

                    <span
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    >
                      →
                    </span>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          STYLE BANNER
      ===================================================== */}

      <section
        className="
          pb-12
          sm:pb-14
          lg:pb-16
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1180px]
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-accent/15
              bg-surface
              px-5
              py-7
              sm:px-8
              sm:py-9
              lg:px-10
            "
          >
            {/* GLOW */}

            <div
              className="
                pointer-events-none
                absolute
                -right-20
                top-1/2
                h-48
                w-48
                -translate-y-1/2
                rounded-full
                bg-accent/[0.06]
                blur-[70px]
              "
            />

            <div
              className="
                relative
                flex
                flex-col
                gap-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.25em]
                    text-accent
                  "
                >
                  Finish the look
                </p>

                <h2
                  className="
                    mt-2
                    text-xl
                    font-bold
                    tracking-tight
                    text-text-primary
                    sm:text-2xl
                  "
                >
                  Small details.
                  <br className="sm:hidden" />
                  {" "}Big difference.
                </h2>
              </div>

              <Link
                to="/products"
                className="
                  inline-flex
                  h-10
                  w-fit
                  items-center
                  justify-center
                  rounded-lg
                  bg-accent
                  px-5
                  text-xs
                  font-bold
                  text-black
                  transition-all
                  duration-300
                  hover:bg-accent-hover
                  active:scale-95
                  sm:h-11
                  sm:px-6
                  sm:text-sm
                "
              >
                Start Exploring

                <span className="ml-2">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// =============================================================
// STAT
// =============================================================

function AccessoryStat({
  value,
  label,
}) {
  return (
    <div
      className="
        px-3
        py-3
        text-center
        sm:px-5
        sm:py-4
      "
    >
      <p
        className="
          text-sm
          font-bold
          text-accent
          sm:text-base
        "
      >
        {value}
      </p>

      <p
        className="
          mt-0.5
          text-[8px]
          font-medium
          uppercase
          tracking-wider
          text-text-muted
          sm:text-[9px]
        "
      >
        {label}
      </p>
    </div>
  );
}

export default Accessories;