import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";
import HeroStats from "./HeroStats";

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-bg">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 xl:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <HeroContent />

          {/* Right Image */}
          <HeroImage />
        </div>

        {/* Bottom Statistics */}
        <div className="mt-16">
          <HeroStats />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;