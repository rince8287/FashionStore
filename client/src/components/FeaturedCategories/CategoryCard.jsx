import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiImage,
} from "react-icons/fi";

function CategoryCard({ category }) {
  if (!category) {
    return null;
  }

  const slug =
    category?.slug ||
    category?.name
      ?.toLowerCase()
      ?.replace(/\s+/g, "-");

  const image =
    category?.image ||
    category?.imageUrl ||
    category?.thumbnail ||
    "";

  return (
    <Link
      to={`/${slug}`}
      aria-label={`Explore ${
        category?.name ||
        "category"
      }`}
      className="
        group
        relative
        block
        overflow-hidden
        rounded-2xl
        border
        border-border-subtle
        bg-surface
        transition-all
        duration-500
        ease-out
        hover:-translate-y-1
        hover:border-accent/50
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.18)]
      "
    >
      {/* =================================================
          IMAGE
      ================================================= */}

      <div
        className="
          relative
          aspect-[1/1.05]
          overflow-hidden
          bg-surface-elevated
        "
      >
        {image ? (
          <img
            src={image}
            alt={
              category?.name ||
              "Category"
            }
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display =
                "none";
            }}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-[1.045]
            "
          />
        ) : (
          /* Image fallback */
          <div
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              bg-gradient-to-br
              from-surface-elevated
              to-brand-bg
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-xl
                border
                border-border-subtle
                bg-accent/10
                text-accent
                transition-all
                duration-500
                group-hover:scale-105
                group-hover:border-accent/30
              "
            >
              <FiImage
                size={25}
                strokeWidth={1.5}
              />
            </div>
          </div>
        )}

        {/* =================================================
            IMAGE OVERLAY
        ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/45
            via-black/5
            to-transparent
            opacity-80
            transition-opacity
            duration-500
            group-hover:opacity-60
          "
        />

        {/* =================================================
            TOP CATEGORY LABEL
        ================================================= */}

        <div
          className="
            absolute
            left-3
            top-3
            rounded-full
            border
            border-white/10
            bg-black/30
            px-2.5
            py-1
            backdrop-blur-md
          "
        >
          <span
            className="
              text-[8px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-white/90
              sm:text-[9px]
            "
          >
            Collection
          </span>
        </div>

        {/* =================================================
            FLOATING ARROW
        ================================================= */}

        <div
          className="
            absolute
            right-3
            top-3
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-black/30
            text-white
            backdrop-blur-md
            transition-all
            duration-400
            group-hover:rotate-[-8deg]
            group-hover:bg-accent
            group-hover:text-black
          "
        >
          <FiArrowUpRight
            size={15}
            strokeWidth={2}
          />
        </div>

        {/* =================================================
            IMAGE BOTTOM TITLE
        ================================================= */}

        <div
          className="
            absolute
            bottom-3
            left-3
            right-3
          "
        >
          <h3
            className="
              line-clamp-1
              text-lg
              font-bold
              tracking-tight
              text-white
              transition-transform
              duration-500
              group-hover:translate-x-0.5
              sm:text-xl
            "
          >
            {category?.name ||
              "Category"}
          </h3>
        </div>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          px-4
          py-4
          sm:px-5
          sm:py-5
        "
      >
        {/* Description */}

        {category?.description && (
          <p
            className="
              line-clamp-2
              min-h-[40px]
              text-[11px]
              leading-5
              text-text-secondary
              sm:text-xs
            "
          >
            {category.description}
          </p>
        )}

        {/* =================================================
            SHOP LINK
        ================================================= */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-between
          "
        >
          <span
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-accent
              sm:text-[11px]
            "
          >
            Shop Collection
          </span>

          <span
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              border
              border-border-subtle
              text-text-muted
              transition-all
              duration-300
              group-hover:border-accent
              group-hover:bg-accent
              group-hover:text-black
            "
          >
            <FiArrowUpRight
              size={13}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CategoryCard;