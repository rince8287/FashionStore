import { Link } from "react-router-dom";
import { FiArrowRight, FiImage } from "react-icons/fi";

function CategoryCard({ category }) {
  return (
    <Link
      to={`/${category.slug}`}
      className="group overflow-hidden rounded-3xl border border-border-subtle bg-surface transition-all duration-300 hover:-translate-y-2 hover:border-accent hover:shadow-2xl"
    >
      {/* Image Placeholder */}
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-gradient-to-br from-surface-elevated to-brand-bg">
        <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/10" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/15">
            <FiImage
              size={38}
              className="text-accent"
            />
          </div>

          <p className="mt-4 text-sm font-medium text-text-secondary">
            Category Image
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-2xl font-semibold text-text-primary transition-colors duration-300 group-hover:text-accent">
          {category.name}
        </h3>

        <p className="mt-3 text-sm leading-6 text-text-secondary">
          {category.description}
        </p>

        <div className="mt-6 inline-flex items-center gap-2 font-medium text-accent transition-all duration-300 group-hover:gap-3">
          <span>Shop Now</span>

          <FiArrowRight size={18} />
        </div>
      </div>
    </Link>
  );
}

export default CategoryCard;