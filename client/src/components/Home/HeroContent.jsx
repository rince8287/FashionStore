import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheck,
  FiChevronRight,
} from "react-icons/fi";

function HeroContent() {
  return (
    <div
      className="
        w-full
        max-w-[620px]
        animate-[heroContentIn_0.8s_cubic-bezier(0.22,1,0.36,1)_both]
      "
    >
      {/* =====================================================
          PREMIUM BADGE
      ===================================================== */}

      <div
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-accent/20
          bg-accent-soft
          px-3
          py-1.5
          shadow-sm
          transition-all
          duration-300
          hover:border-accent/40
        "
      >
        {/* Small live indicator */}

        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />

          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>

        <span
          className="
            text-[9px]
            font-bold
            uppercase
            tracking-[0.2em]
            text-accent
            sm:text-[10px]
          "
        >
          New Season 2026
        </span>
      </div>

      {/* =====================================================
          MAIN HEADING
      ===================================================== */}

      <h1
        className="
          mt-5
          max-w-[600px]
          font-display
          text-[2.25rem]
          font-semibold
          leading-[1.05]
          tracking-[-0.03em]
          text-text-primary
          sm:mt-6
          sm:text-5xl
          lg:text-[4.2rem]
          lg:leading-[1.02]
          xl:text-[4.6rem]
        "
      >
        Elevate Your

        <span
          className="
            relative
            mt-1
            block
            w-fit
            text-accent
          "
        >
          Everyday Style

          {/* Small decorative line */}

          <span
            className="
              absolute
              -bottom-2
              left-0
              h-[1px]
              w-12
              bg-accent/50
              transition-all
              duration-500
              sm:w-16
            "
          />
        </span>
      </h1>

      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <p
        className="
          mt-6
          max-w-[510px]
          text-[13px]
          leading-6
          text-text-secondary
          sm:mt-7
          sm:text-sm
          sm:leading-7
          lg:text-[15px]
        "
      >
        Discover premium fashion crafted for modern lifestyles.
        Timeless collections, luxurious fabrics and exceptional
        quality designed to make every day extraordinary.
      </p>

      {/* =====================================================
          ACTION BUTTONS
      ===================================================== */}

      <div
        className="
          mt-7
          flex
          w-full
          flex-col
          gap-3
          sm:mt-8
          sm:w-auto
          sm:flex-row
        "
      >
        {/* SHOP NOW */}

        <Link
          to="/new-in"
          className="
            group
            inline-flex
            min-h-[46px]
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-accent
            px-6
            py-3
            text-xs
            font-bold
            tracking-wide
            text-brand-bg
            shadow-lg
            shadow-accent/10
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-accent-hover
            hover:shadow-xl
            hover:shadow-accent/15
            active:translate-y-0
            sm:min-h-[48px]
            sm:px-7
          "
        >
          <span>Shop Now</span>

          <FiArrowRight
            size={16}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />
        </Link>

        {/* EXPLORE */}

        <Link
          to="/men"
          className="
            group
            inline-flex
            min-h-[46px]
            items-center
            justify-center
            gap-1.5
            rounded-xl
            border
            border-border-subtle
            bg-surface/70
            px-6
            py-3
            text-xs
            font-bold
            tracking-wide
            text-text-primary
            backdrop-blur-sm
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:border-accent/50
            hover:text-accent
            active:translate-y-0
            sm:min-h-[48px]
            sm:px-7
          "
        >
          <span>Explore Collection</span>

          <FiChevronRight
            size={15}
            className="
              text-text-muted
              transition-all
              duration-300
              group-hover:translate-x-0.5
              group-hover:text-accent
            "
          />
        </Link>
      </div>

      {/* =====================================================
          TRUST POINTS
      ===================================================== */}

      <div
        className="
          mt-7
          flex
          flex-wrap
          items-center
          gap-x-5
          gap-y-2.5
          border-t
          border-border-subtle/60
          pt-5
          sm:mt-8
          sm:gap-x-6
          sm:pt-6
        "
      >
        {/* Quality */}

        <div className="flex items-center gap-1.5">
          <span
            className="
              flex
              h-4
              w-4
              items-center
              justify-center
              rounded-full
              bg-green-500/10
            "
          >
            <FiCheck
              size={10}
              className="text-green-500"
            />
          </span>

          <span className="text-[10px] font-medium text-text-muted sm:text-[11px]">
            Premium Quality
          </span>
        </div>

        {/* Secure */}

        <div className="flex items-center gap-1.5">
          <span
            className="
              flex
              h-4
              w-4
              items-center
              justify-center
              rounded-full
              bg-green-500/10
            "
          >
            <FiCheck
              size={10}
              className="text-green-500"
            />
          </span>

          <span className="text-[10px] font-medium text-text-muted sm:text-[11px]">
            Secure Checkout
          </span>
        </div>

        {/* Delivery */}

        <div className="flex items-center gap-1.5">
          <span
            className="
              flex
              h-4
              w-4
              items-center
              justify-center
              rounded-full
              bg-green-500/10
            "
          >
            <FiCheck
              size={10}
              className="text-green-500"
            />
          </span>

          <span className="text-[10px] font-medium text-text-muted sm:text-[11px]">
            Fast Delivery
          </span>
        </div>
      </div>

      {/* =====================================================
          LOCAL ANIMATION
      ===================================================== */}

      <style>{`
        @keyframes heroContentIn {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
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

export default HeroContent;