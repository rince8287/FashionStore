import { FiShoppingBag, FiStar, FiTruck } from "react-icons/fi";

function HeroImage() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute h-72 w-72 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96" />

      {/* Main Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border-subtle bg-surface shadow-2xl">
        {/* Image Placeholder */}
        <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-surface-elevated to-brand-bg">
          <div className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-accent/15">
              <FiShoppingBag
                size={42}
                className="text-accent"
              />
            </div>

            <h3 className="mt-6 font-display text-2xl font-semibold text-text-primary">
              Premium Fashion
            </h3>

            <p className="mt-2 px-6 text-sm leading-6 text-text-secondary">
              Hero model image will be added here later.
            </p>
          </div>
        </div>

        {/* Floating Badge 1 */}
        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-border-subtle bg-brand-bg/90 px-4 py-2 backdrop-blur">
          <FiStar
            size={16}
            className="text-accent"
          />

          <span className="text-xs font-medium text-text-primary">
            Premium Collection
          </span>
        </div>

        {/* Floating Badge 2 */}
        <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full border border-border-subtle bg-brand-bg/90 px-4 py-2 backdrop-blur">
          <FiTruck
            size={16}
            className="text-accent"
          />

          <span className="text-xs font-medium text-text-primary">
            Fast Delivery
          </span>
        </div>
      </div>
    </div>
  );
}

export default HeroImage;