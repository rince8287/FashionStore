import {
  FiAward,
  FiPackage,
  FiShield,
  FiUsers,
} from "react-icons/fi";

const stats = [
  {
    id: 1,
    icon: FiUsers,
    value: "15K+",
    title: "Happy Customers",
  },
  {
    id: 2,
    icon: FiPackage,
    value: "500+",
    title: "Premium Products",
  },
  {
    id: 3,
    icon: FiAward,
    value: "4.9★",
    title: "Customer Rating",
  },
  {
    id: 4,
    icon: FiShield,
    value: "100%",
    title: "Secure Shopping",
  },
];

function HeroStats() {
  return (
    <section
      aria-label="FashionStore highlights"
      className="w-full"
    >
      <div
        className="
          grid
          grid-cols-2
          overflow-hidden
          rounded-2xl
          border
          border-border-subtle
          bg-surface/70
          backdrop-blur-sm
          lg:grid-cols-4
        "
      >
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={`
                group
                relative
                flex
                min-w-0
                items-center
                gap-3
                px-4
                py-4
                transition-all
                duration-300
                hover:bg-surface-elevated
                sm:gap-4
                sm:px-5
                sm:py-5
                lg:px-6

                ${
                  index % 2 !== 1
                    ? "border-r border-border-subtle"
                    : ""
                }

                ${
                  index < 2
                    ? "border-b border-border-subtle lg:border-b-0"
                    : ""
                }

                ${
                  index === 1
                    ? "lg:border-r border-border-subtle"
                    : ""
                }

                ${
                  index === 2
                    ? "lg:border-r border-border-subtle"
                    : ""
                }
              `}
            >
              {/* Accent hover indicator */}

              <span
                className="
                  absolute
                  left-0
                  top-1/2
                  h-0
                  w-[2px]
                  -translate-y-1/2
                  bg-accent
                  transition-all
                  duration-300
                  group-hover:h-8
                "
              />

              {/* Icon */}

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-accent/10
                  bg-accent/10
                  text-accent
                  transition-all
                  duration-300
                  group-hover:scale-105
                  group-hover:border-accent/30
                  group-hover:bg-accent
                  group-hover:text-brand-bg
                  sm:h-11
                  sm:w-11
                "
              >
                <Icon
                  size={19}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Content */}

              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-lg
                    font-bold
                    leading-tight
                    text-text-primary
                    sm:text-xl
                  "
                >
                  {item.value}
                </p>

                <p
                  className="
                    mt-1
                    truncate
                    text-[11px]
                    font-medium
                    leading-tight
                    text-text-muted
                    sm:text-xs
                  "
                >
                  {item.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default HeroStats;