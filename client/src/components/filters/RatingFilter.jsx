import { FaStar } from "react-icons/fa";
import { useFilter } from "../../context/FilterContext";

const ratings = [4, 3, 2, 1];

function RatingFilter() {
  const { selectedRating, setSelectedRating } = useFilter();

  return (
    <div>
      <h3 className="mb-5 text-lg font-semibold text-text-primary">
        Customer Rating
      </h3>

      <div className="space-y-3">
        {ratings.map((rating) => (
          <label
            key={rating}
            className="group flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition hover:bg-surface-elevated"
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="rating"
                checked={selectedRating === rating}
                onChange={() => setSelectedRating(rating)}
                className="h-4 w-4 cursor-pointer accent-accent"
              />

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <FaStar
                    key={index}
                    className={`text-sm ${
                      index < rating
                        ? "text-yellow-400"
                        : "text-gray-500"
                    }`}
                  />
                ))}

                <span className="ml-2 text-sm font-medium text-text-secondary">
                  & Up
                </span>
              </div>
            </div>
          </label>
        ))}

        {/* Clear Rating */}
        <button
          type="button"
          onClick={() => setSelectedRating(null)}
          className="mt-4 w-full rounded-lg border border-border-subtle py-2 text-sm font-medium text-text-secondary transition hover:border-accent hover:text-accent"
        >
          Clear Rating
        </button>
      </div>
    </div>
  );
}

export default RatingFilter;