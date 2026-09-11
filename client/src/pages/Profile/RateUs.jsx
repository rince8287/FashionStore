import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiStar,
  FiSmile,
} from "react-icons/fi";

function RateUs() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [experience, setExperience] = useState("");

  const experiences = [
    {
      id: 1,
      emoji: "😍",
      title: "Excellent",
      value: "excellent",
    },
    {
      id: 2,
      emoji: "😊",
      title: "Good",
      value: "good",
    },
    {
      id: 3,
      emoji: "😐",
      title: "Average",
      value: "average",
    },
    {
      id: 4,
      emoji: "😕",
      title: "Poor",
      value: "poor",
    },
    {
      id: 5,
      emoji: "😡",
      title: "Very Bad",
      value: "bad",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] px-4 py-8">

      <div className="mx-auto max-w-4xl">

        {/* Back Button */}

        <Link
          to="/profile"
          className="mb-6 inline-flex items-center gap-2 text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent)]"
        >
          <FiArrowLeft size={18} />
          Back to Profile
        </Link>

        {/* Header */}

        <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-8 text-center">

          <FiSmile
            size={60}
            className="mx-auto text-[var(--color-accent)]"
          />

          <h1 className="mt-5 text-3xl font-bold text-[var(--color-text-primary)]">
            Rate Your Experience
          </h1>

          <p className="mt-3 text-[var(--color-text-secondary)]">
            Your feedback helps us improve FashionStore and deliver a better
            shopping experience.
          </p>

        </div>

        {/* Star Rating */}

        <div className="mt-8 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-8 text-center">

          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            How would you rate us?
          </h2>

          <div className="mt-8 flex justify-center gap-4">

            {[1, 2, 3, 4, 5].map((star) => (

              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform duration-300 hover:scale-125"
              >
                <FiStar
                  size={42}
                  className={
                    (hover || rating) >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-500"
                  }
                />
              </button>

            ))}

          </div>

          <p className="mt-5 text-lg text-[var(--color-text-secondary)]">
            {rating === 0 && "Tap a star to rate"}
            {rating === 1 && "Very Poor 😞"}
            {rating === 2 && "Poor 😕"}
            {rating === 3 && "Average 🙂"}
            {rating === 4 && "Good 😍"}
            {rating === 5 && "Excellent 🤩"}
          </p>

        </div>

        {/* Experience Section Starts */}

        <div className="mt-8">
                      <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-8">

            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              How was your experience?
            </h2>

            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">

              {experiences.map((item) => (

                <button
                  key={item.id}
                  type="button"
                  onClick={() => setExperience(item.value)}
                  className={`rounded-2xl border p-5 transition-all duration-300 ${
                    experience === item.value
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-black"
                      : "border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)]"
                  }`}
                >

                  <div className="text-4xl">
                    {item.emoji}
                  </div>

                  <p className="mt-3 font-semibold">
                    {item.title}
                  </p>

                </button>

              ))}

            </div>

            {/* Review Form */}

            <div className="mt-10">

              <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
                Tell us more about your experience
              </label>

              <textarea
                rows={6}
                placeholder="Write your review here..."
                className="w-full resize-none rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-5 py-4 text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]"
              />

            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
                  Your Name (Optional)
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
                  Email Address (Optional)
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]"
                />

              </div>

            </div>

          </div>

          {/* Features Section Starts */}

          <div className="mt-8">
                      <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-8">

            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              What did you like?
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              {[
                "Fast Delivery",
                "Product Quality",
                "Affordable Prices",
                "Customer Support",
                "Easy Returns",
                "Secure Payments",
                "App Design",
                "Overall Experience",
              ].map((feature) => (

                <label
                  key={feature}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 transition hover:border-[var(--color-accent)]"
                >
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-[var(--color-accent)]"
                  />

                  <span className="text-[var(--color-text-primary)]">
                    {feature}
                  </span>
                </label>

              ))}

            </div>

            {/* Screenshot Upload */}

            <div className="mt-10">

              <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
                Upload Screenshot (Optional)
              </label>

              <input
                type="file"
                accept="image/*"
                className="block w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--color-accent)] file:px-4 file:py-2 file:font-semibold file:text-black"
              />

            </div>

            {/* Recommendation */}

            <div className="mt-10 rounded-2xl bg-[var(--color-surface)] p-5">

              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Would you recommend FashionStore to your friends?
              </h3>

              <div className="mt-5 flex gap-4">

                <button
                  type="button"
                  className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  👍 Yes
                </button>

                <button
                  type="button"
                  className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
                >
                  👎 No
                </button>

              </div>

            </div>

            {/* Submit */}

            <button
              type="submit"
              className="mt-10 w-full rounded-2xl bg-[var(--color-accent)] py-4 text-lg font-bold text-black transition hover:bg-[var(--color-accent-hover)]"
            >
              Submit Review
            </button>

          </div>

          {/* Thank You Section Starts */}

          <div className="mt-8">
                      <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-10 text-center">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20">

              <span className="text-5xl">🎉</span>

            </div>

            <h2 className="mt-6 text-3xl font-bold text-[var(--color-text-primary)]">
              Thank You!
            </h2>

            <p className="mt-4 max-w-2xl mx-auto leading-8 text-[var(--color-text-secondary)]">
              Your feedback is valuable to us. We carefully review every rating
              and suggestion to improve your shopping experience at
              <span className="font-semibold text-[var(--color-accent)]">
                {" "}FashionStore
              </span>.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

              <Link
                to="/"
                className="rounded-2xl bg-[var(--color-accent)] px-8 py-4 text-lg font-semibold text-black transition hover:bg-[var(--color-accent-hover)]"
              >
                Continue Shopping
              </Link>

              <Link
                to="/profile"
                className="rounded-2xl border border-[var(--color-border-subtle)] px-8 py-4 text-lg font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                Back to Profile
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
    </div>
          </div>
  );
}

export default RateUs;
          
       