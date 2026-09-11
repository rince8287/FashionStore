import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";
import HeroStats from "./HeroStats";

function HeroSection() {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-brand-bg
      "
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-32
          top-10
          h-72
          w-72
          rounded-full
          bg-accent/[0.035]
          blur-3xl
          sm:h-96
          sm:w-96
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-40
          bottom-0
          h-80
          w-80
          rounded-full
          bg-accent/[0.025]
          blur-3xl
        "
      />

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1280px]
          px-4
          py-10
          sm:px-6
          sm:py-12
          md:py-14
          lg:px-8
          lg:py-16
          xl:py-20
        "
      >
        {/* ===================================================
            HERO CONTENT
        =================================================== */}

        <div
          className="
            grid
            grid-cols-1
            items-center
            gap-10
            lg:grid-cols-[minmax(0,1.02fr)_minmax(340px,0.78fr)]
            lg:gap-12
            xl:grid-cols-[minmax(0,1fr)_minmax(390px,0.78fr)]
            xl:gap-16
          "
        >
          {/* LEFT — CONTENT */}

          <div className="min-w-0">
            <HeroContent />
          </div>

          {/* RIGHT — VISUAL */}

          <div className="min-w-0 lg:justify-self-end">
            <HeroImage />
          </div>
        </div>

        {/* ===================================================
            HERO STATS
        =================================================== */}

        <div
          className="
            mt-10
            border-t
            border-border-subtle
            pt-7
            sm:mt-12
            sm:pt-8
            lg:mt-14
            lg:pt-9
          "
        >
          <HeroStats />
        </div>
      </div>

      {/* =====================================================
          BOTTOM FADE
      ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-border-subtle
          to-transparent
        "
      />
    </section>
  );
}

export default HeroSection;