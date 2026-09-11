import {
  FiCheck,
  FiClock,
  FiPackage,
  FiTruck,
} from "react-icons/fi";

function DeliveryOptions() {
  return (
    <section
      className="
        w-full
        overflow-hidden
        rounded-xl
        border
        border-border-subtle
        bg-surface
        transition-all
        duration-300
        hover:border-accent/20
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          px-4
          py-3.5
          sm:px-4.5
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-2.5
          "
        >
          {/* ICON */}

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-accent/20
              bg-accent-soft
              text-accent
            "
          >
            <FiTruck size={16} />
          </div>

          {/* TEXT */}

          <div className="min-w-0">
            <h2
              className="
                text-sm
                font-bold
                text-text-primary
                sm:text-[15px]
              "
            >
              Delivery
            </h2>

            <p
              className="
                mt-0.5
                truncate
                text-[9px]
                text-text-muted
                sm:text-[10px]
              "
            >
              Standard delivery included
            </p>
          </div>
        </div>

        {/* DELIVERY STATUS */}

        <span
          className="
            shrink-0
            rounded-full
            border
            border-green-500/20
            bg-green-500/[0.07]
            px-2
            py-1
            text-[8px]
            font-bold
            uppercase
            tracking-wide
            text-green-400
          "
        >
          Free
        </span>
      </div>

      {/* =====================================================
          DELIVERY OPTION
      ===================================================== */}

      <div
        className="
          mx-3
          mb-3
          rounded-lg
          border
          border-accent/50
          bg-accent-soft
          p-3
          transition-all
          duration-300
          sm:mx-3.5
          sm:mb-3.5
          sm:p-3.5
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          {/* PACKAGE ICON */}

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-accent
              text-black
              shadow-[0_5px_15px_rgba(212,175,55,0.12)]
            "
          >
            <FiPackage size={16} />
          </div>

          {/* DELIVERY INFO */}

          <div className="min-w-0 flex-1">
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <h3
                className="
                  text-xs
                  font-bold
                  text-text-primary
                  sm:text-sm
                "
              >
                Standard Delivery
              </h3>

              <span
                className="
                  rounded-full
                  bg-green-500/10
                  px-1.5
                  py-0.5
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-wide
                  text-green-400
                "
              >
                Selected
              </span>
            </div>

            <div
              className="
                mt-1.5
                flex
                items-center
                gap-1.5
                text-[9px]
                text-text-muted
                sm:text-[10px]
              "
            >
              <FiClock
                size={11}
                className="shrink-0"
              />

              <span>
                Delivery in 3–5 business days
              </span>
            </div>
          </div>

          {/* RIGHT */}

          <div
            className="
              flex
              shrink-0
              flex-col
              items-end
              gap-1.5
            "
          >
            <span
              className="
                text-xs
                font-extrabold
                text-green-400
                sm:text-sm
              "
            >
              FREE
            </span>

            <div
              className="
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                bg-green-500
                text-black
              "
            >
              <FiCheck
                size={11}
                strokeWidth={3}
              />
            </div>
          </div>
        </div>

        {/* =================================================
            DELIVERY NOTE
        ================================================= */}

        <div
          className="
            mt-3
            flex
            items-center
            gap-2
            border-t
            border-accent/10
            pt-2.5
          "
        >
          <FiTruck
            size={11}
            className="
              shrink-0
              text-accent
            "
          />

          <p
            className="
              text-[8px]
              leading-4
              text-text-muted
              sm:text-[9px]
            "
          >
            Your order will be carefully packed
            and delivered to your selected address.
          </p>
        </div>
      </div>
    </section>
  );
}

export default DeliveryOptions;