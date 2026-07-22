import HeroSection from "../../components/home/HeroSection";
import FeaturedCategories from "../../components/FeaturedCategories/FeaturedCategories";
import NewArrivals from "../../components/product/NewArrivals/NewArrivals";
import TrendingProducts from "../../components/product/TrendingProducts/TrendingProducts";

function Home() {
  return (
    <main className="bg-brand-bg">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* New Arrivals */}
      <NewArrivals />

      {/* Trending Products */}
      <TrendingProducts />
    </main>
  );
}

export default Home;