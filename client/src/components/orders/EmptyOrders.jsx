// src/components/orders/EmptyOrders.jsx

import {
  FiArrowRight,
  FiPackage,
  FiShoppingBag,
} from "react-icons/fi";

import { Link } from "react-router-dom";


function EmptyOrders({
  title = "No Orders Yet",
  description = "Looks like you haven't placed any orders yet. Start shopping and your orders will appear here.",
  buttonText = "Continue Shopping",
  buttonLink = "/",
}) {
  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-border-subtle
        bg-surface
        px-5
        py-10
        shadow-sm
        transition-all
        duration-500
        hover:border-accent/20
        hover:shadow-xl

        sm:px-8
        sm:py-12
      "
    >

      {/* ================================================
          DECORATIVE BACKGROUND
      ================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-40
          w-40
          -translate-x-1/2
          rounded-full
          bg-accent/10
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-20
          -right-20
          h-40
          w-40
          rounded-full
          bg-accent/5
          blur-3xl
        "
      />


      {/* ================================================
          CONTENT
      ================================================= */}

      <div className="relative mx-auto max-w-xl text-center">


        {/* Icon */}

        <div className="relative mx-auto h-24 w-24">

          {/* Outer Ring */}

          <div
            className="
              absolute
              inset-0
              animate-pulse
              rounded-full
              bg-accent/5
            "
          />


          {/* Icon Container */}

          <div
            className="
              absolute
              inset-2
              flex
              items-center
              justify-center
              rounded-full
              border
              border-accent/20
              bg-accent-soft
              text-accent
              shadow-lg
              shadow-accent/5
              transition-all
              duration-500
              hover:scale-105
            "
          >
            <FiShoppingBag size={36} />
          </div>


          {/* Small Package Badge */}

          <div
            className="
              absolute
              -right-1
              bottom-1
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-border-subtle
              bg-surface
              text-accent
              shadow-md
            "
          >
            <FiPackage size={15} />
          </div>

        </div>


        {/* Eyebrow */}

        <p
          className="
            mt-7
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.3em]
            text-accent
          "
        >
          Your Orders
        </p>


        {/* Title */}

        <h2
          className="
            mt-3
            text-2xl
            font-bold
            tracking-tight
            text-text-primary

            sm:text-3xl
          "
        >
          {title}
        </h2>


        {/* Description */}

        <p
          className="
            mx-auto
            mt-3
            max-w-md
            text-sm
            leading-7
            text-text-secondary

            sm:text-base
          "
        >
          {description}
        </p>


        {/* CTA */}

        <Link
          to={buttonLink}
          className="
            group
            mt-7
            inline-flex
            min-h-12
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-accent
            px-7
            py-3
            text-sm
            font-semibold
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
          "
        >
          <span>{buttonText}</span>

          <FiArrowRight
            size={17}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />
        </Link>


        {/* Trust Text */}

        <div
          className="
            mt-7
            flex
            flex-wrap
            items-center
            justify-center
            gap-x-5
            gap-y-2
            text-[11px]
            text-text-muted
          "
        >
          <span>Secure Shopping</span>

          <span
            className="
              h-1
              w-1
              rounded-full
              bg-accent/50
            "
          />

          <span>Fast Delivery</span>

          <span
            className="
              h-1
              w-1
              rounded-full
              bg-accent/50
            "
          />

          <span>Easy Returns</span>
        </div>

      </div>

    </section>
  );
}


export default EmptyOrders;