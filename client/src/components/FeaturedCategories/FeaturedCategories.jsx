import categories from "../../data/categories";
import CategoryCard from "./CategoryCard";

function FeaturedCategories() {
  return (
    <section className="bg-brand-bg py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Shop by Category
          </p>

          <h2 className="mt-4 font-display text-3xl font-semibold text-text-primary sm:text-4xl lg:text-5xl">
            Find Your Perfect Style
          </h2>

          <p className="mt-5 text-base leading-7 text-text-secondary sm:text-lg">
            Discover carefully curated collections designed for every occasion.
            Explore premium fashion with timeless elegance and modern trends.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCategories;