import HeroSection from "../../components/home/HeroSection";
import FeaturedCategories from "../../components/FeaturedCategories/FeaturedCategories";
import NewArrivals from "../../components/product/NewArrivals/NewArrivals";

function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* New Arrivals */}
      <NewArrivals />
    </>
  );
}

export default Home;