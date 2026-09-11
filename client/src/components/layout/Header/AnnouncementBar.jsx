import { FiArrowRight, FiTruck } from "react-icons/fi";

function AnnouncementBar() {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        border-b
        border-border-subtle
        bg-brand-bg
      "
    >
      {/* Subtle moving accent glow */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          h-full
          w-24
          -translate-x-full
          bg-gradient-to-r
          from-transparent
          via-accent/[0.08]
          to-transparent
          transition-transform
          duration-1000
          group-hover:translate-x-[500%]
        "
      />

      <div
        className="
          relative
          mx-auto
          flex
          min-h-8
          w-full
          max-w-[1280px]
          items-center
          justify-center
          px-4
          sm:min-h-9
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            flex
            items-center
            justify-center
            gap-2
            sm:gap-2.5
          "
        >
          {/* Icon */}

          <FiTruck
            size={13}
            strokeWidth={1.8}
            className="
              shrink-0
              text-accent
              transition-transform
              duration-300
              group-hover:translate-x-0.5
            "
          />

          {/* Message */}

          <p
            className="
              text-center
              text-[9px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-text-secondary
              sm:text-[10px]
              sm:tracking-[0.2em]
              md:text-[11px]
            "
          >
            Complimentary shipping on orders above{" "}
            <span className="font-semibold text-accent">
              ₹999
            </span>
          </p>

          {/* Arrow */}

          <FiArrowRight
            size={13}
            strokeWidth={1.8}
            className="
              shrink-0
              text-text-muted
              transition-all
              duration-300
              group-hover:translate-x-1
              group-hover:text-accent
            "
          />
        </div>
      </div>
    </div>
  );
}

export default AnnouncementBar;