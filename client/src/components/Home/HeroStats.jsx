import { FiAward, FiPackage, FiShield, FiUsers } from "react-icons/fi";

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
    <section className="mt-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="group rounded-2xl border border-border-subtle bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-brand-bg">
                <Icon size={26} />
              </div>

              <h3 className="mt-5 text-3xl font-bold text-text-primary">
                {item.value}
              </h3>

              <p className="mt-2 text-sm text-text-secondary">
                {item.title}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default HeroStats;