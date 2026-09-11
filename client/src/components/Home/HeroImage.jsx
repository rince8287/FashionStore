import {
  FiShoppingBag,
  FiStar,
  FiTruck,
  FiArrowUpRight,
} from "react-icons/fi";

function HeroImage() {
  return (
    <div
      className="
        relative
        flex
        w-full
        items-center
        justify-center
        animate-[heroImageIn_0.9s_cubic-bezier(0.22,1,0.36,1)_0.15s_both]
      "
    >
      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          h-56
          w-56
          rounded-full
          bg-accent/10
          blur-3xl
          sm:h-72
          sm:w-72
          lg:h-80
          lg:w-80
          animate-[softGlow_5s_ease-in-out_infinite]
        "
      />

      {/* =====================================================
          MAIN PRODUCT CARD
      ===================================================== */}

      <div
        className="
          group
          relative
          w-full
          max-w-[330px]
          overflow-hidden
          rounded-[22px]
          border
          border-border-subtle
          bg-surface
          shadow-2xl
          shadow-black/20
          transition-all
          duration-500
          hover:-translate-y-1
          hover:border-accent/30
          hover:shadow-accent/5
          sm:max-w-[360px]
          lg:max-w-[390px]
          xl:max-w-[410px]
        "
      >
        {/* =================================================
            IMAGE / PLACEHOLDER
        ================================================= */}

        <div
          className="
            relative
            flex
            aspect-[4/4.8]
            items-center
            justify-center
            overflow-hidden
            bg-gradient-to-br
            from-surface-elevated
            to-brand-bg
          "
        >
          {/* Decorative glow */}

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-40
              w-40
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-accent/5
              blur-2xl
              transition-all
              duration-700
              group-hover:scale-125
              group-hover:bg-accent/10
            "
          />

          {/* Center Content */}

          <div className="relative z-10 px-6 text-center">

            {/* Icon */}

            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                border
                border-accent/15
                bg-accent/10
                transition-all
                duration-500
                group-hover:scale-105
                group-hover:border-accent/30
              "
            >
              <FiShoppingBag
                size={28}
                className="text-accent"
              />
            </div>

            {/* Title */}

            <h3
              className="
                mt-5
                font-display
                text-xl
                font-semibold
                tracking-tight
                text-text-primary
                sm:text-2xl
              "
            >
              Premium Fashion
            </h3>

            {/* Description */}

            <p
              className="
                mx-auto
                mt-2
                max-w-[250px]
                text-[11px]
                leading-5
                text-text-secondary
                sm:text-xs
                sm:leading-6
              "
            >
              Curated styles designed for
              modern everyday elegance.
            </p>

            {/* Small indicator */}

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-brand-bg/70 px-3 py-1.5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                FashionStore
              </span>
            </div>
          </div>

          {/* =================================================
              TOP CORNER DETAIL
          ================================================= */}

          <div
            className="
              absolute
              right-4
              top-4
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-border-subtle
              bg-brand-bg/70
              text-text-muted
              backdrop-blur-md
              transition-all
              duration-300
              group-hover:text-accent
            "
          >
            <FiArrowUpRight size={14} />
          </div>
        </div>

        {/* =================================================
            PREMIUM BADGE
        ================================================= */}

        <div
          className="
            absolute
            left-4
            top-4
            flex
            items-center
            gap-2
            rounded-full
            border
            border-border-subtle
            bg-brand-bg/85
            px-3
            py-1.5
            shadow-lg
            backdrop-blur-md
            transition-all
            duration-300
            group-hover:border-accent/30
          "
        >
          <FiStar
            size={13}
            className="text-accent"
          />

          <span
            className="
              text-[9px]
              font-semibold
              tracking-wide
              text-text-primary
              sm:text-[10px]
            "
          >
            Premium Collection
          </span>
        </div>

        {/* =================================================
            DELIVERY BADGE
        ================================================= */}

        <div
          className="
            absolute
            bottom-4
            right-4
            flex
            items-center
            gap-2
            rounded-full
            border
            border-border-subtle
            bg-brand-bg/85
            px-3
            py-1.5
            shadow-lg
            backdrop-blur-md
            transition-all
            duration-300
            group-hover:border-accent/30
          "
        >
          <FiTruck
            size={13}
            className="text-accent"
          />

          <span
            className="
              text-[9px]
              font-semibold
              tracking-wide
              text-text-primary
              sm:text-[10px]
            "
          >
            Fast Delivery
          </span>
        </div>
      </div>

      {/* =====================================================
          SMALL DECORATIVE FLOATING DOT
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-1
          top-[18%]
          h-2
          w-2
          rounded-full
          bg-accent/60
          shadow-[0_0_16px_rgba(212,175,55,0.35)]
          animate-[floatDot_4s_ease-in-out_infinite]
          sm:right-0
          lg:-right-3
        "
      />

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes heroImageIn {
          from {
            opacity: 0;
            transform: translateY(22px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes softGlow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.7;
          }

          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes floatDot {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.6;
          }

          50% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default HeroImage;