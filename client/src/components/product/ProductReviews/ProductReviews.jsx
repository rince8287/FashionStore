import { FaStar } from "react-icons/fa";

const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    rating: 5,
    date: "12 July 2026",
    comment:
      "Amazing quality! Fabric is premium and fitting is perfect. Highly recommended.",
  },
  {
    id: 2,
    name: "Priya Verma",
    rating: 4,
    date: "09 July 2026",
    comment:
      "Very comfortable and stylish. Delivery was also fast.",
  },
  {
    id: 3,
    name: "Aman Singh",
    rating: 5,
    date: "04 July 2026",
    comment:
      "Excellent product. Worth every rupee. Will definitely buy again.",
  },
];

function ProductReviews() {
  return (
    <section className="bg-brand-bg py-12 md:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-10 text-center md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent sm:text-sm">
            Customer Feedback
          </p>

          <h2 className="mt-3 text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            Customer Reviews
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-text-secondary sm:text-base">
            See what our customers are saying about this product.
          </p>
        </div>

        {/* Reviews */}
        <div className="space-y-5 md:space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-border-subtle bg-surface p-5 transition-all duration-300 hover:border-accent hover:shadow-xl sm:p-6 md:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {review.name}
                  </h3>

                  <p className="mt-1 text-sm text-text-muted">
                    {review.date}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(review.rating)].map((_, index) => (
                    <FaStar key={index} className="text-sm sm:text-base" />
                  ))}
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-text-secondary sm:text-base">
                {review.comment}
              </p>

              <div className="mt-5">
                <span className="inline-flex items-center rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                  ✓ Verified Purchase
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductReviews;