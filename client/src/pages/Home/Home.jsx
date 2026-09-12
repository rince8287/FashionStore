import HeroSection from "../../components/Home/HeroSection";
import FeaturedCategories from "../../components/FeaturedCategories/FeaturedCategories";
import NewArrivals from "../../components/product/NewArrivals/NewArrivals";
import TrendingProducts from "../../components/product/TrendingProducts/TrendingProducts";

function Home() {
  return (
    <main
      className="
        min-h-screen
        w-full
        overflow-x-hidden
        bg-brand-bg
        text-text-primary
      "
    >
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          relative
          w-full
        "
      >
        <HeroSection />
      </section>

      {/* =====================================================
          FEATURED CATEGORIES
      ===================================================== */}

      <section
        className="
          relative
          w-full
          border-t
          border-border-subtle/60
        "
      >
        <FeaturedCategories />
      </section>

      {/* =====================================================
          NEW ARRIVALS
      ===================================================== */}

      <section
        className="
          relative
          w-full
          border-t
          border-border-subtle/60
        "
      >
        <NewArrivals />
      </section>

      {/* =====================================================
          TRENDING PRODUCTS
      ===================================================== */}

      <section
        className="
          relative
          w-full
          border-t
          border-border-subtle/60
        "
      >
        <TrendingProducts />
      </section>
    </main>
  );
}

export default Home;