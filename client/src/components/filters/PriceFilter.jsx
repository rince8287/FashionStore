import { useFilter } from "../../context/FilterContext";

function PriceFilter() {
  const { priceRange, setPriceRange } = useFilter();

  const handleMinPrice = (e) => {
    const value = Number(e.target.value);

    setPriceRange([
      value,
      Math.max(value, priceRange[1]),
    ]);
  };

  const handleMaxPrice = (e) => {
    const value = Number(e.target.value);

    setPriceRange([
      Math.min(priceRange[0], value),
      value,
    ]);
  };

  return (
    <div>
      <h3 className="mb-5 text-lg font-semibold text-text-primary">
        Price Range
      </h3>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">
            Minimum Price
          </label>

          <input
            type="number"
            min="0"
            value={priceRange[0]}
            onChange={handleMinPrice}
            className="w-full rounded-lg border border-border-subtle bg-brand-bg px-4 py-2 text-text-primary outline-none transition focus:border-accent"
            placeholder="₹0"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">
            Maximum Price
          </label>

          <input
            type="number"
            min={priceRange[0]}
            value={priceRange[1]}
            onChange={handleMaxPrice}
            className="w-full rounded-lg border border-border-subtle bg-brand-bg px-4 py-2 text-text-primary outline-none transition focus:border-accent"
            placeholder="₹100000"
          />
        </div>

        <div className="rounded-lg bg-surface-elevated p-3 text-center">
          <span className="text-sm text-text-secondary">
            Selected Range
          </span>

          <p className="mt-1 font-semibold text-accent">
            ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PriceFilter;