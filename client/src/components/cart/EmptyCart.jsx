import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiArrowRight,
  FiSearch,
} from "react-icons/fi";

function EmptyCart() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-brand-bg">
      <section
        className="
          flex
          min-h-[70vh]
          items-center
          justify-center
          px-4
          py-12
          sm:px-6
          sm:py-16
          lg:px-8
        "
      >
        {/* =================================================
            EMPTY CART CARD
        ================================================= */}

        <div
          className="
            group
            relative
            w-full
            max-w-[460px]
            overflow-hidden
            rounded-2xl
            border
            border-border-subtle
            bg-surface
            px-5
            py-8
            text-center
            shadow-[0_20px_60px_rgba(0,0,0,0.18)]
            transition-all
            duration-500
            hover:-translate-y-1
            hover:border-accent/30
            sm:px-8
            sm:py-10
          "
        >
          {/* =================================================
              DECORATIVE GLOW
          ================================================= */}

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-0
              h-32
              w-32
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-accent/10
              blur-3xl
              transition-all
              duration-700
              group-hover:bg-accent/15
            "
          />

          {/* =================================================
              ICON
          ================================================= */}

          <div className="relative mx-auto">
            <div
              className="
                mx-auto
                flex
                h-[76px]
                w-[76px]
                items-center
                justify-center
                rounded-2xl
                border
                border-border-subtle
                bg-brand-bg
                text-accent
                shadow-inner
                transition-all
                duration-500
                group-hover:rotate-[-3deg]
                group-hover:scale-105
                group-hover:border-accent/40
              "
            >
              <FiShoppingBag
                size={30}
                strokeWidth={1.5}
                className="
                  transition-transform
                  duration-500
                  group-hover:scale-110
                "
              />
            </div>

            {/* Small decorative dot */}

            <span
              className="
                absolute
                -right-1
                -top-1
                h-3
                w-3
                rounded-full
                bg-accent
                shadow-[0_0_15px_rgba(212,175,55,0.5)]
              "
            />
          </div>

          {/* =================================================
              LABEL
          ================================================= */}

          <p
            className="
              mt-7
              text-[10px]
              font-bold
              uppercase
              tracking-[0.25em]
              text-accent
            "
          >
            Shopping Bag
          </p>

          {/* =================================================
              HEADING
          ================================================= */}

          <h1
            className="
              mt-2.5
              text-2xl
              font-bold
              tracking-tight
              text-text-primary
              sm:text-3xl
            "
          >
            Your cart is empty
          </h1>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <p
            className="
              mx-auto
              mt-3
              max-w-[340px]
              text-sm
              leading-6
              text-text-secondary
            "
          >
            Nothing here yet. Explore our
            latest collection and discover
            something you'll love.
          </p>

          {/* =================================================
              CTA
          ================================================= */}

          <Link
            to="/"
            className="
              group/button
              mx-auto
              mt-7
              flex
              w-full
              max-w-[250px]
              items-center
              justify-center
              gap-2.5
              rounded-xl
              bg-accent
              px-6
              py-3.5
              text-sm
              font-bold
              text-black
              shadow-[0_8px_25px_rgba(0,0,0,0.15)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-accent-hover
              hover:shadow-[0_12px_30px_rgba(0,0,0,0.22)]
              active:translate-y-0
              active:scale-[0.98]
            "
          >
            <FiSearch
              size={16}
              className="
                transition-transform
                duration-300
                group-hover/button:scale-110
              "
            />

            <span>
              Continue Shopping
            </span>

            <FiArrowRight
              size={15}
              className="
                transition-transform
                duration-300
                group-hover/button:translate-x-1
              "
            />
          </Link>

          {/* =================================================
              TRUST MESSAGE
          ================================================= */}

          <div
            className="
              mx-auto
              mt-6
              flex
              max-w-[300px]
              items-center
              justify-center
              gap-2
              text-[10px]
              text-text-muted
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-green-500
              "
            />

            <span>
              Your saved items will appear here
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default EmptyCart;