// src/components/product/ProductReviews/ProductReviews.jsx

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaStar,
  FaRegStar,
} from "react-icons/fa";

import {
  FiThumbsUp,
  FiCheckCircle,
  FiMessageCircle,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";

import {
  getProductReviews,
  markReviewHelpful,
} from "../../../services/reviewservice";

// =========================================================
// DATE FORMAT
// =========================================================

const formatReviewDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

// =========================================================
// STAR COMPONENT
// =========================================================

function ReviewStars({
  rating = 0,
  size = 14,
}) {
  const safeRating = Math.max(
    0,
    Math.min(
      5,
      Number(rating) || 0
    )
  );

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${safeRating} out of 5 stars`}
    >
      {[0, 1, 2, 3, 4].map(
        (index) =>
          index < safeRating ? (
            <FaStar
              key={index}
              size={size}
              className="text-accent"
            />
          ) : (
            <FaRegStar
              key={index}
              size={size}
              className="text-text-muted/40"
            />
          )
      )}
    </div>
  );
}

// =========================================================
// INITIALS
// =========================================================

function getInitials(name = "") {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return "F";
  }

  if (words.length === 1) {
    return words[0]
      .slice(0, 1)
      .toUpperCase();
  }

  return (
    words[0].slice(0, 1) +
    words[words.length - 1].slice(0, 1)
  ).toUpperCase();
}

// =========================================================
// PRODUCT REVIEWS
// =========================================================

function ProductReviews({ product }) {
  // =======================================================
  // PRODUCT ID
  // =======================================================

  const productId =
    product?._id ||
    product?.id;

  // =======================================================
  // STATE
  // =======================================================

  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [helpfulLoading, setHelpfulLoading] =
    useState(null);

  const [activeImage, setActiveImage] =
    useState(null);

  // =======================================================
  // FETCH REVIEWS
  // =======================================================

  const fetchReviews = useCallback(
    async (signal) => {
      if (!productId) {
        setReviews([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getProductReviews(
            productId,
            {
              page: 1,
              limit: 20,
              sort: "newest",
            }
          );

        if (signal?.aborted) {
          return;
        }

        const reviewData =
          Array.isArray(
            response?.reviews
          )
            ? response.reviews
            : Array.isArray(
                response?.data
              )
            ? response.data
            : Array.isArray(response)
            ? response
            : [];

        setReviews(reviewData);
      } catch (error) {
        if (
          signal?.aborted ||
          error?.name ===
            "AbortError"
        ) {
          return;
        }

        console.error(
          "Product Reviews Error:",
          error
        );

        setReviews([]);

        setError(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Failed to load reviews."
        );
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [productId]
  );

  // =======================================================
  // LOAD
  // =======================================================

  useEffect(() => {
    const controller =
      new AbortController();

    fetchReviews(
      controller.signal
    );

    return () => {
      controller.abort();
    };
  }, [fetchReviews]);

  // =======================================================
  // REVIEW SUMMARY
  // =======================================================

  const reviewSummary =
    useMemo(() => {
      if (!reviews.length) {
        return {
          average: 0,
          total: 0,
          distribution: [
            0, 0, 0, 0, 0,
          ],
        };
      }

      const distribution = [
        0, 0, 0, 0, 0,
      ];

      let totalRating = 0;

      reviews.forEach((review) => {
        const rating = Math.max(
          1,
          Math.min(
            5,
            Math.round(
              Number(
                review?.rating
              ) || 0
            )
          )
        );

        if (rating >= 1) {
          distribution[
            5 - rating
          ] += 1;
        }

        totalRating +=
          Number(
            review?.rating
          ) || 0;
      });

      return {
        average:
          totalRating /
          reviews.length,
        total: reviews.length,
        distribution,
      };
    }, [reviews]);

  // =======================================================
  // HELPFUL
  // =======================================================

  const handleHelpful = async (
    reviewId
  ) => {
    const token =
      localStorage.getItem(
        "fashionstore-token"
      );

    if (!token) {
      alert(
        "Please login to mark a review as helpful."
      );

      return;
    }

    try {
      setHelpfulLoading(reviewId);

      const response =
        await markReviewHelpful(
          reviewId
        );

      if (response?.review) {
        setReviews((prev) =>
          prev.map((review) =>
            (review._id ||
              review.id) ===
            reviewId
              ? response.review
              : review
          )
        );
      } else {
        await fetchReviews();
      }
    } catch (error) {
      console.error(
        "Mark Helpful Error:",
        error
      );

      alert(
        error?.response?.data
          ?.message ||
          "Unable to mark review as helpful."
      );
    } finally {
      setHelpfulLoading(null);
    }
  };

  // =======================================================
  // RATING DISTRIBUTION
  // =======================================================

  const getRatingCount = (
    star
  ) => {
    return (
      reviewSummary.distribution[
        5 - star
      ] || 0
    );
  };

  const getRatingPercentage = (
    star
  ) => {
    if (!reviewSummary.total) {
      return 0;
    }

    return Math.round(
      (getRatingCount(star) /
        reviewSummary.total) *
        100
    );
  };

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <section className="border-t border-border-subtle bg-brand-bg py-14 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-10">
            <div className="h-3 w-28 animate-pulse rounded-full bg-surface-elevated" />

            <div className="mt-4 h-9 w-64 animate-pulse rounded-lg bg-surface-elevated" />

            <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded-full bg-surface-elevated" />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="h-48 animate-pulse rounded-2xl bg-surface" />

            <div className="h-48 animate-pulse rounded-2xl bg-surface lg:col-span-2" />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-2xl bg-surface"
                />
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  // =======================================================
  // MAIN UI
  // =======================================================

  return (
    <>
      <section
        className="
          border-t
          border-border-subtle
          bg-brand-bg
          py-14
          sm:py-16
          lg:py-20
        "
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8 sm:mb-10">

            <div className="flex items-end justify-between gap-4">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent sm:text-xs">
                  Customer Experience
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
                  Reviews
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
                  Real experiences from
                  customers who purchased
                  this product.
                </p>
              </div>

              {reviews.length > 0 && (
                <div className="hidden items-center gap-2 text-xs text-text-muted sm:flex">
                  <FiMessageCircle size={15} />

                  {reviews.length}{" "}
                  {reviews.length === 1
                    ? "review"
                    : "reviews"}
                </div>
              )}
            </div>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-semibold text-red-400">
                  Couldn't load reviews
                </p>

                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  fetchReviews()
                }
                className="
                  shrink-0
                  rounded-lg
                  bg-accent
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  text-black
                  transition
                  hover:bg-accent-hover
                  active:scale-95
                "
              >
                Try Again
              </button>
            </div>
          )}

          {/* =================================================
              REVIEW SUMMARY
          ================================================= */}

          {!error &&
            reviews.length > 0 && (
              <div className="mb-8 grid overflow-hidden rounded-2xl border border-border-subtle bg-surface lg:grid-cols-[240px_1fr]">

                {/* BIG RATING */}

                <div className="flex flex-col items-center justify-center border-b border-border-subtle p-6 text-center lg:border-b-0 lg:border-r">

                  <p className="text-5xl font-bold tracking-tight text-text-primary">
                    {reviewSummary.average.toFixed(
                      1
                    )}
                  </p>

                  <div className="mt-2">
                    <ReviewStars
                      rating={
                        reviewSummary.average
                      }
                      size={15}
                    />
                  </div>

                  <p className="mt-2 text-xs text-text-muted">
                    Based on{" "}
                    {reviewSummary.total}{" "}
                    reviews
                  </p>
                </div>

                {/* DISTRIBUTION */}

                <div className="p-5 sm:p-6">

                  <div className="space-y-2.5">

                    {[5, 4, 3, 2, 1].map(
                      (star) => (
                        <div
                          key={star}
                          className="flex items-center gap-3"
                        >
                          <span className="w-7 text-xs font-medium text-text-secondary">
                            {star}
                          </span>

                          <FaStar
                            size={11}
                            className="shrink-0 text-accent"
                          />

                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-elevated">
                            <div
                              className="h-full rounded-full bg-accent transition-all duration-700"
                              style={{
                                width: `${getRatingPercentage(
                                  star
                                )}%`,
                              }}
                            />
                          </div>

                          <span className="w-7 text-right text-[10px] text-text-muted">
                            {getRatingCount(
                              star
                            )}
                          </span>
                        </div>
                      )
                    )}

                  </div>
                </div>
              </div>
            )}

          {/* =================================================
              REVIEWS
          ================================================= */}

          {!error &&
            reviews.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">

                {reviews.map(
                  (review) => {
                    const reviewId =
                      review?._id ||
                      review?.id;

                    const reviewerName =
                      review?.user?.name ||
                      review?.userName ||
                      review?.name ||
                      "FashionStore Customer";

                    const helpfulCount =
                      review?.helpfulCount ??
                      review?.helpful
                        ?.length ??
                      0;

                    const reviewImages =
                      Array.isArray(
                        review?.images
                      )
                        ? review.images
                        : [];

                    const initials =
                      getInitials(
                        reviewerName
                      );

                    return (
                      <article
                        key={reviewId}
                        className="
                          group
                          flex
                          flex-col
                          rounded-2xl
                          border
                          border-border-subtle
                          bg-surface
                          p-5
                          transition-all
                          duration-300
                          hover:-translate-y-0.5
                          hover:border-accent/30
                          hover:shadow-[0_18px_45px_rgba(0,0,0,0.16)]
                          sm:p-6
                        "
                      >

                        {/* =================================
                            REVIEWER
                        ================================= */}

                        <div className="flex items-start justify-between gap-4">

                          <div className="flex min-w-0 items-center gap-3">

                            {/* AVATAR */}

                            <div className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-accent-soft
                              text-xs
                              font-bold
                              text-accent
                            ">
                              {initials}
                            </div>

                            <div className="min-w-0">

                              <div className="flex flex-wrap items-center gap-2">

                                <h3 className="truncate text-sm font-semibold text-text-primary">
                                  {reviewerName}
                                </h3>

                                {review?.isVerifiedPurchase && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[9px] font-bold text-green-400">
                                    <FiCheckCircle
                                      size={10}
                                    />
                                    Verified
                                  </span>
                                )}

                              </div>

                              <p className="mt-1 text-[10px] text-text-muted">
                                {formatReviewDate(
                                  review?.createdAt ||
                                    review?.date
                                )}
                              </p>

                            </div>
                          </div>

                          {/* RATING */}

                          <div className="shrink-0 rounded-lg bg-surface-elevated px-2.5 py-1.5">
                            <ReviewStars
                              rating={
                                review?.rating
                              }
                              size={11}
                            />
                          </div>
                        </div>

                        {/* =================================
                            TITLE
                        ================================= */}

                        {review?.title && (
                          <h4 className="mt-5 text-sm font-bold text-text-primary sm:text-base">
                            {review.title}
                          </h4>
                        )}

                        {/* =================================
                            COMMENT
                        ================================= */}

                        <p className="mt-3 flex-1 whitespace-pre-line text-sm leading-6 text-text-secondary">
                          {review?.comment ||
                            review?.review ||
                            "No review comment provided."}
                        </p>

                        {/* =================================
                            IMAGES
                        ================================= */}

                        {reviewImages.length >
                          0 && (
                          <div className="mt-5 flex gap-2.5 overflow-x-auto pb-1">

                            {reviewImages.map(
                              (
                                image,
                                index
                              ) => {
                                const imageUrl =
                                  typeof image ===
                                  "string"
                                    ? image
                                    : image?.url;

                                if (
                                  !imageUrl
                                ) {
                                  return null;
                                }

                                return (
                                  <button
                                    key={`${reviewId}-${index}`}
                                    type="button"
                                    onClick={() =>
                                      setActiveImage(
                                        imageUrl
                                      )
                                    }
                                    className="
                                      group/image
                                      relative
                                      h-16
                                      w-16
                                      shrink-0
                                      overflow-hidden
                                      rounded-lg
                                      border
                                      border-border-subtle
                                      bg-surface-elevated
                                      sm:h-20
                                      sm:w-20
                                    "
                                    aria-label="View review image"
                                  >
                                    <img
                                      src={
                                        imageUrl
                                      }
                                      alt="Customer review"
                                      loading="lazy"
                                      className="
                                        h-full
                                        w-full
                                        object-cover
                                        transition-transform
                                        duration-500
                                        group-hover/image:scale-110
                                      "
                                    />

                                    <span className="absolute inset-0 bg-black/0 transition group-hover/image:bg-black/10" />
                                  </button>
                                );
                              }
                            )}

                          </div>
                        )}

                        {/* =================================
                            FOOTER
                        ================================= */}

                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border-subtle pt-4">

                          <div className="min-w-0">
                            {review?.isVerifiedPurchase && (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-green-400">
                                <FiCheckCircle
                                  size={12}
                                />
                                Verified purchase
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            disabled={
                              helpfulLoading ===
                              reviewId
                            }
                            onClick={() =>
                              handleHelpful(
                                reviewId
                              )
                            }
                            className="
                              inline-flex
                              shrink-0
                              items-center
                              gap-1.5
                              rounded-lg
                              border
                              border-border-subtle
                              px-3
                              py-2
                              text-[10px]
                              font-semibold
                              text-text-secondary
                              transition-all
                              duration-200
                              hover:border-accent
                              hover:bg-accent-soft
                              hover:text-accent
                              active:scale-95
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                              sm:text-xs
                            "
                          >
                            <FiThumbsUp
                              size={13}
                            />

                            {helpfulLoading ===
                            reviewId
                              ? "Saving..."
                              : `Helpful ${helpfulCount}`}
                          </button>

                        </div>

                        {/* =================================
                            ADMIN RESPONSE
                        ================================= */}

                        {review?.adminReply && (
                          <div className="mt-4 rounded-xl border border-accent/15 bg-accent/5 p-4">

                            <div className="flex items-center gap-2">

                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-black">
                                <span className="text-[9px] font-black">
                                  FS
                                </span>
                              </div>

                              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
                                FashionStore
                                Response
                              </p>

                            </div>

                            <p className="mt-2 text-xs leading-5 text-text-secondary">
                              {typeof review.adminReply ===
                              "string"
                                ? review.adminReply
                                : review
                                    .adminReply
                                    ?.message}
                            </p>

                          </div>
                        )}

                      </article>
                    );
                  }
                )}

              </div>
            )}

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {!error &&
            reviews.length === 0 && (
              <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface">

                <div className="mx-auto flex max-w-md flex-col items-center px-6 py-14 text-center sm:py-16">

                  <div className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-accent-soft
                    text-accent
                  ">
                    <FaRegStar size={22} />
                  </div>

                  <h3 className="mt-5 text-xl font-bold tracking-tight text-text-primary">
                    No Reviews Yet
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Be the first customer to
                    share your experience with
                    this product.
                  </p>

                </div>
              </div>
            )}

        </div>
      </section>

      {/* =====================================================
          IMAGE LIGHTBOX
      ===================================================== */}

      {activeImage && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/90
            p-4
            backdrop-blur-xl
          "
          onClick={() =>
            setActiveImage(null)
          }
        >

          <button
            type="button"
            onClick={() =>
              setActiveImage(null)
            }
            className="
              absolute
              right-4
              top-4
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-white/10
              text-white
              transition
              hover:rotate-90
              hover:bg-white/20
            "
            aria-label="Close image"
          >
            <FiX size={20} />
          </button>

          <img
            src={activeImage}
            alt="Customer review"
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              max-h-[88vh]
              max-w-[92vw]
              rounded-2xl
              object-contain
              shadow-2xl
            "
          />
        </div>
      )}
    </>
  );
}

export default ProductReviews;