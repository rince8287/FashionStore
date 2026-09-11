import { useCallback, useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Filter,
  MessageCircle,
  MoreVertical,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  ThumbsUp,
  Trash2,
  X,
  XCircle,
} from "lucide-react";

import reviewService from "../services/reviewservice";

const {
  adminReplyToReview,
  deleteReview,
  getAllReviewsForAdmin,
  getReviewStatistics,
  updateReviewStatus,
} = reviewService;

/* ============================================================
   HELPERS
============================================================ */

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (name = "User") => {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("") || "U"
  );
};

const getUserName = (review) => {
  return (
    review?.user?.name ||
    review?.user?.fullName ||
    "Anonymous Customer"
  );
};

const getProductName = (review) => {
  return review?.product?.name || "Product unavailable";
};

const getReviewId = (review) => {
  return review?._id || review?.id;
};

const getProductImage = (review) => {
  const images = review?.product?.images;

  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }

  const firstImage = images[0];

  if (typeof firstImage === "string") {
    return firstImage;
  }

  return firstImage?.url || firstImage?.secure_url || null;
};

const getStatusClasses = (status) => {
  switch (status) {
    case "Approved":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

    case "Pending":
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";

    case "Rejected":
      return "border-red-500/20 bg-red-500/10 text-red-400";

    default:
      return "border-border-subtle bg-brand-bg text-text-secondary";
  }
};

const getStatusDot = (status) => {
  switch (status) {
    case "Approved":
      return "bg-emerald-400";

    case "Pending":
      return "bg-amber-400";

    case "Rejected":
      return "bg-red-400";

    default:
      return "bg-text-muted";
  }
};

/* ============================================================
   STAR RATING
============================================================ */

function StarRating({ rating = 0, size = 15 }) {
  const numericRating = Number(rating) || 0;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= numericRating
              ? "fill-accent text-accent"
              : "text-text-muted"
          }
        />
      ))}
    </div>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  title,
  value,
  icon: Icon,
  iconClass = "text-accent",
  iconBg = "bg-accent/10",
  subtitle,
  loading = false,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg">
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/5 blur-2xl transition-all duration-500 group-hover:bg-accent/10" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
            {title}
          </p>

          {loading ? (
            <div className="mt-3 h-9 w-20 animate-pulse rounded-lg bg-brand-bg" />
          ) : (
            <p className="mt-2 text-3xl font-black tracking-tight text-text-primary">
              {value}
            </p>
          )}

          {subtitle && (
            <p className="mt-1 text-xs text-text-muted">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon size={21} className={iconClass} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusClasses(
        status
      )}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${getStatusDot(status)}`}
      />

      {status || "Unknown"}
    </span>
  );
}

/* ============================================================
   REVIEW DETAILS MODAL
============================================================ */

function ReviewDetailsModal({
  review,
  onClose,
  onStatusChange,
  onReply,
  onDelete,
  actionLoading,
}) {
  const [reply, setReply] = useState(
    review?.adminReply?.message || ""
  );

  useEffect(() => {
    setReply(review?.adminReply?.message || "");
  }, [review]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!review) return null;

  const userName = getUserName(review);
  const productName = getProductName(review);
  const reviewId = getReviewId(review);
  const productImage = getProductImage(review);

  const handleReply = async () => {
    const trimmedReply = reply.trim();

    if (!trimmedReply) return;

    await onReply(reviewId, trimmedReply);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="review-modal-enter flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border-subtle bg-surface shadow-2xl">
        {/* Header */}
        <div className="relative overflow-hidden border-b border-border-subtle px-5 py-4 sm:px-6">
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10">
                  <MessageCircle
                    size={15}
                    className="text-accent"
                  />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
                  Customer Feedback
                </span>
              </div>

              <h2 className="text-xl font-black text-text-primary">
                Review Details
              </h2>

              <p className="mt-0.5 text-xs text-text-muted">
                Submitted on {formatDateTime(review.createdAt)}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-subtle text-text-secondary transition-all duration-200 hover:border-accent/30 hover:bg-accent/10 hover:text-accent"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 sm:p-6">
          {/* Customer + Product */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="group rounded-2xl border border-border-subtle bg-brand-bg p-4 transition-all hover:border-accent/20">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
                Customer
              </p>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-sm font-black text-accent">
                  {getInitials(userName)}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-bold text-text-primary">
                    {userName}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-text-secondary">
                    {review?.user?.email || "No email"}
                  </p>
                </div>
              </div>
            </div>

            <div className="group rounded-2xl border border-border-subtle bg-brand-bg p-4 transition-all hover:border-accent/20">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
                Product
              </p>

              <div className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-border-subtle bg-surface">
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={productName}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-text-muted">
                      <Star size={18} />
                    </div>
                  )}
                </div>

                <p className="line-clamp-2 text-sm font-bold text-text-primary">
                  {productName}
                </p>
              </div>
            </div>
          </div>

          {/* Review */}
          <div className="mt-5 rounded-2xl border border-border-subtle bg-brand-bg p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <StarRating
                    rating={review.rating}
                    size={18}
                  />

                  <span className="rounded-lg bg-accent/10 px-2 py-1 text-xs font-bold text-accent">
                    {review.rating || 0}/5
                  </span>
                </div>

                {review.title && (
                  <h3 className="mt-4 text-lg font-black text-text-primary">
                    {review.title}
                  </h3>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {review.verifiedPurchase && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                    <ShieldCheck size={13} />
                    Verified Purchase
                  </span>
                )}

                <StatusBadge status={review.status} />
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-border-subtle bg-surface p-4">
              <p className="whitespace-pre-wrap text-sm leading-7 text-text-secondary">
                {review.comment || "No comment provided."}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border-subtle pt-4 text-xs text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                <ThumbsUp size={14} />
                {review.helpfulCount || 0} helpful
              </span>

              <span>{formatDateTime(review.createdAt)}</span>
            </div>
          </div>

          {/* Admin Reply */}
          <div className="mt-5 rounded-2xl border border-border-subtle bg-brand-bg p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10">
                <MessageCircle
                  size={16}
                  className="text-accent"
                />
              </div>

              <div>
                <h3 className="text-sm font-black text-text-primary">
                  Admin Reply
                </h3>

                <p className="text-[10px] text-text-muted">
                  Respond professionally to this customer
                </p>
              </div>
            </div>

            <textarea
              value={reply}
              onChange={(event) =>
                setReply(event.target.value)
              }
              rows={4}
              placeholder="Write a professional reply to this customer..."
              className="w-full resize-none rounded-2xl border border-border-subtle bg-surface px-4 py-3 text-sm leading-6 text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-accent/50 focus:ring-4 focus:ring-accent/5"
            />

            {review?.adminReply?.repliedAt && (
              <p className="mt-2 text-[10px] text-text-muted">
                Last replied:{" "}
                {formatDateTime(
                  review.adminReply.repliedAt
                )}
              </p>
            )}

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                disabled={
                  actionLoading || !reply.trim()
                }
                onClick={handleReply}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-brand-bg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading ? (
                  <RefreshCw
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <MessageCircle size={15} />
                )}

                Save Reply
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-border-subtle px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => onDelete(reviewId)}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-bold text-red-400 transition-all hover:bg-red-500/10 disabled:opacity-50"
          >
            <Trash2 size={15} />
            Delete
          </button>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={
                actionLoading ||
                review.status === "Rejected"
              }
              onClick={() =>
                onStatusChange(
                  reviewId,
                  "Rejected"
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-bold text-red-400 transition-all hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <XCircle size={15} />
              Reject
            </button>

            <button
              type="button"
              disabled={
                actionLoading ||
                review.status === "Approved"
              }
              onClick={() =>
                onStatusChange(
                  reviewId,
                  "Approved"
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-brand-bg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check size={15} />
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN
============================================================ */

function Reviews() {
  const [reviews, setReviews] = useState([]);

  const [statistics, setStatistics] = useState({
    totalReviews: 0,
    approvedReviews: 0,
    pendingReviews: 0,
    rejectedReviews: 0,
    averageRating: 0,
  });

  const [ratingDistribution, setRatingDistribution] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [searchInput, setSearchInput] =
    useState("");
  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [verifiedPurchase, setVerifiedPurchase] =
    useState("");

  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    limit: 10,
  });

  const [selectedReview, setSelectedReview] =
    useState(null);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [openMenu, setOpenMenu] = useState(null);
  const [showFilters, setShowFilters] =
    useState(false);

  /* ==========================================================
     FETCH STATISTICS
  ========================================================== */

  const fetchStatistics = useCallback(
    async () => {
      try {
        setStatsLoading(true);

        const response =
          await getReviewStatistics();

        if (response?.success === false) {
          throw new Error(
            response.message ||
              "Failed to load review statistics."
          );
        }

        setStatistics(
          response?.statistics || {}
        );

        setRatingDistribution(
          Array.isArray(
            response?.ratingDistribution
          )
            ? response.ratingDistribution
            : []
        );
      } catch (err) {
        console.error(
          "Review statistics error:",
          err
        );
      } finally {
        setStatsLoading(false);
      }
    },
    []
  );

  /* ==========================================================
     FETCH REVIEWS
  ========================================================== */

  const fetchReviews = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getAllReviewsForAdmin({
            page,
            limit: 10,
            search,
            status,
            rating,
            verifiedPurchase,
            sort,
          });

        if (response?.success === false) {
          throw new Error(
            response.message ||
              "Failed to load reviews."
          );
        }

        const receivedReviews =
          Array.isArray(response?.reviews)
            ? response.reviews
            : [];

        setReviews(receivedReviews);

        const totalReviews = Number(
          response?.totalReviews ??
            response?.pagination?.total ??
            0
        );

        const totalPages = Math.max(
          Number(
            response?.totalPages ??
              response?.pagination?.totalPages ??
              Math.ceil(totalReviews / 10)
          ) || 1,
          1
        );

        const currentPage = Number(
          response?.currentPage ??
            response?.pagination?.page ??
            page
        );

        setPagination({
          currentPage,
          totalPages,
          totalReviews,
          limit: Number(
            response?.limit ??
              response?.pagination?.limit ??
              10
          ),
        });
      } catch (err) {
        console.error(
          "Admin reviews error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load reviews."
        );

        setReviews([]);
      } finally {
        setLoading(false);
      }
    },
    [
      page,
      search,
      status,
      rating,
      verifiedPurchase,
      sort,
    ]
  );

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  /* ==========================================================
     SEARCH
  ========================================================== */

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  /* ==========================================================
     FILTERS
  ========================================================== */

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleRatingChange = (value) => {
    setRating(value);
    setPage(1);
  };

  const handleVerifiedChange = (value) => {
    setVerifiedPurchase(value);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setRating("");
    setVerifiedPurchase("");
    setSort("newest");
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(status) ||
    Boolean(rating) ||
    Boolean(verifiedPurchase) ||
    sort !== "newest";

  /* ==========================================================
     STATUS
  ========================================================== */

  const handleStatusUpdate = async (
    reviewId,
    newStatus
  ) => {
    try {
      setActionLoading(true);

      const response =
        await updateReviewStatus(
          reviewId,
          newStatus
        );

      if (response?.success === false) {
        throw new Error(
          response.message ||
            "Failed to update review status."
        );
      }

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          getReviewId(review) === reviewId
            ? {
                ...review,
                status: newStatus,
              }
            : review
        )
      );

      setSelectedReview((currentReview) =>
        currentReview &&
        getReviewId(currentReview) === reviewId
          ? {
              ...currentReview,
              status: newStatus,
            }
          : currentReview
      );

      await fetchStatistics();

      setOpenMenu(null);
    } catch (err) {
      console.error(
        "Review status update error:",
        err
      );

      window.alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update review status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* ==========================================================
     ADMIN REPLY
  ========================================================== */

  const handleAdminReply = async (
    reviewId,
    message
  ) => {
    try {
      setActionLoading(true);

      const response =
        await adminReplyToReview(
          reviewId,
          message
        );

      if (response?.success === false) {
        throw new Error(
          response.message ||
            "Failed to save admin reply."
        );
      }

      const updatedReview =
        response?.review;

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          getReviewId(review) === reviewId
            ? {
                ...review,
                ...(updatedReview || {}),
                adminReply:
                  updatedReview?.adminReply || {
                    message,
                    repliedAt:
                      new Date().toISOString(),
                  },
              }
            : review
        )
      );

      setSelectedReview((currentReview) =>
        currentReview &&
        getReviewId(currentReview) === reviewId
          ? {
              ...currentReview,
              ...(updatedReview || {}),
              adminReply:
                updatedReview?.adminReply || {
                  message,
                  repliedAt:
                    new Date().toISOString(),
                },
            }
          : currentReview
      );

      window.alert(
        "Admin reply saved successfully."
      );
    } catch (err) {
      console.error(
        "Admin reply error:",
        err
      );

      window.alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save admin reply."
      );

      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  /* ==========================================================
     DELETE
  ========================================================== */

  const handleDeleteReview = async (
    reviewId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response =
        await deleteReview(reviewId);

      if (response?.success === false) {
        throw new Error(
          response.message ||
            "Failed to delete review."
        );
      }

      setReviews((currentReviews) =>
        currentReviews.filter(
          (review) =>
            getReviewId(review) !== reviewId
        )
      );

      setSelectedReview(null);
      setOpenMenu(null);

      await Promise.all([
        fetchStatistics(),
        fetchReviews(),
      ]);
    } catch (err) {
      console.error(
        "Delete review error:",
        err
      );

      window.alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete review."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* ==========================================================
     PAGINATION
  ========================================================== */

  const goToPage = (nextPage) => {
    if (
      nextPage < 1 ||
      nextPage > pagination.totalPages
    ) {
      return;
    }

    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const pageNumbers = useMemo(() => {
    const total = pagination.totalPages;
    const current = pagination.currentPage;

    if (total <= 5) {
      return Array.from(
        { length: total },
        (_, index) => index + 1
      );
    }

    if (current <= 3) {
      return [1, 2, 3, 4, "...", total];
    }

    if (current >= total - 2) {
      return [
        1,
        "...",
        total - 3,
        total - 2,
        total - 1,
        total,
      ];
    }

    return [
      1,
      "...",
      current - 1,
      current,
      current + 1,
      "...",
      total,
    ];
  }, [
    pagination.currentPage,
    pagination.totalPages,
  ]);

  /* ==========================================================
     RATING DISTRIBUTION
  ========================================================== */

  const distribution = useMemo(() => {
    const normalized = [5, 4, 3, 2, 1].map(
      (star) => {
        const item =
          ratingDistribution.find(
            (entry) =>
              Number(entry?._id) === star
          );

        return {
          rating: star,
          total: Number(item?.total || 0),
        };
      }
    );

    const maxValue = Math.max(
      ...normalized.map(
        (item) => item.total
      ),
      1
    );

    return normalized.map((item) => ({
      ...item,
      percentage:
        (item.total / maxValue) * 100,
    }));
  }, [ratingDistribution]);

  /* ==========================================================
     STATS
  ========================================================== */

  const totalReviews = Number(
    statistics?.totalReviews || 0
  );

  const approvedReviews = Number(
    statistics?.approvedReviews || 0
  );

  const pendingReviews = Number(
    statistics?.pendingReviews || 0
  );

  const rejectedReviews = Number(
    statistics?.rejectedReviews || 0
  );

  const averageRating = Number(
    statistics?.averageRating || 0
  ).toFixed(1);

  const approvalRate =
    totalReviews > 0
      ? Math.round(
          (approvedReviews / totalReviews) * 100
        )
      : 0;

  /* ==========================================================
     REFRESH
  ========================================================== */

  const handleRefresh = async () => {
    await Promise.all([
      fetchReviews(),
      fetchStatistics(),
    ]);
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <>
      <style>{`
        @keyframes reviewsPageIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes reviewsCardIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes reviewsModalIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes reviewsGlow {
          0%, 100% {
            opacity: .35;
            transform: scale(1);
          }
          50% {
            opacity: .65;
            transform: scale(1.08);
          }
        }

        .reviews-page-in {
          animation: reviewsPageIn .55s ease-out both;
        }

        .reviews-card-in {
          animation: reviewsCardIn .55s ease-out both;
        }

        .review-modal-enter {
          animation: reviewsModalIn .25s ease-out both;
        }

        .reviews-glow {
          animation: reviewsGlow 5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .reviews-page-in,
          .reviews-card-in,
          .review-modal-enter,
          .reviews-glow {
            animation: none !important;
          }

          * {
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <main className="min-h-screen overflow-hidden bg-brand-bg">
        {/* Ambient background */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="reviews-glow absolute -left-32 top-20 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
          <div
            className="reviews-glow absolute -right-32 top-[35%] h-96 w-96 rounded-full bg-accent/5 blur-3xl"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="relative mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          {/* ==================================================
              HEADER
          ================================================== */}

          <section className="reviews-page-in mb-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
                  <span>Admin</span>
                  <span className="text-text-muted/50">
                    /
                  </span>
                  <span className="text-accent">
                    Reviews
                  </span>

                  <span className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 normal-case tracking-normal text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Live
                  </span>
                </div>

                <h1 className="text-3xl font-black tracking-tight text-text-primary sm:text-4xl">
                  Reviews
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                  Manage customer feedback, ratings,
                  moderation and responses from one
                  place.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={
                  loading || statsLoading
                }
                className="group inline-flex w-fit items-center gap-2 rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-sm font-bold text-text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={
                    loading || statsLoading
                      ? "animate-spin"
                      : "transition-transform duration-500 group-hover:rotate-180"
                  }
                />

                Refresh
              </button>
            </div>
          </section>

          {/* ==================================================
              STATS
          ================================================== */}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <div
              className="reviews-card-in"
              style={{ animationDelay: "40ms" }}
            >
              <StatCard
                title="Total Reviews"
                value={totalReviews}
                icon={MessageCircle}
                subtitle="All submitted reviews"
                loading={statsLoading}
              />
            </div>

            <div
              className="reviews-card-in"
              style={{ animationDelay: "80ms" }}
            >
              <StatCard
                title="Approved"
                value={approvedReviews}
                icon={CheckCircle2}
                iconClass="text-emerald-400"
                iconBg="bg-emerald-500/10"
                subtitle="Published reviews"
                loading={statsLoading}
              />
            </div>

            <div
              className="reviews-card-in"
              style={{ animationDelay: "120ms" }}
            >
              <StatCard
                title="Pending"
                value={pendingReviews}
                icon={Clock3}
                iconClass="text-amber-400"
                iconBg="bg-amber-500/10"
                subtitle="Needs moderation"
                loading={statsLoading}
              />
            </div>

            <div
              className="reviews-card-in"
              style={{ animationDelay: "160ms" }}
            >
              <StatCard
                title="Rejected"
                value={rejectedReviews}
                icon={XCircle}
                iconClass="text-red-400"
                iconBg="bg-red-500/10"
                subtitle="Rejected reviews"
                loading={statsLoading}
              />
            </div>

            <div
              className="reviews-card-in"
              style={{ animationDelay: "200ms" }}
            >
              <StatCard
                title="Average Rating"
                value={`${averageRating} / 5`}
                icon={Star}
                subtitle="Overall rating"
                loading={statsLoading}
              />
            </div>
          </section>

          {/* ==================================================
              INSIGHTS
          ================================================== */}

          <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.35fr]">
            {/* Rating distribution */}
            <div className="reviews-card-in rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10">
                      <Star
                        size={15}
                        className="fill-accent text-accent"
                      />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
                      Analytics
                    </span>
                  </div>

                  <h2 className="font-black text-text-primary">
                    Rating Distribution
                  </h2>

                  <p className="mt-1 text-xs text-text-muted">
                    Review rating breakdown
                  </p>
                </div>

                <div className="rounded-xl border border-accent/10 bg-accent/10 px-3 py-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star
                      size={12}
                      className="fill-accent text-accent"
                    />
                    <span className="text-sm font-black text-accent">
                      {averageRating}
                    </span>
                  </div>

                  <p className="mt-0.5 text-[9px] text-text-muted">
                    average
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {distribution.map((item) => (
                  <div
                    key={item.rating}
                    className="group flex items-center gap-3"
                  >
                    <div className="flex w-10 items-center gap-1 text-xs font-bold text-text-secondary">
                      {item.rating}

                      <Star
                        size={11}
                        className="fill-accent text-accent"
                      />
                    </div>

                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-brand-bg">
                      <div
                        className="h-full rounded-full bg-accent transition-all duration-700 ease-out"
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />
                    </div>

                    <span className="w-8 text-right text-xs font-semibold text-text-muted">
                      {item.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Moderation overview */}
            <div className="reviews-card-in rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm">
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10">
                    <ShieldCheck
                      size={15}
                      className="text-accent"
                    />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
                    Moderation
                  </span>
                </div>

                <h2 className="font-black text-text-primary">
                  Moderation Overview
                </h2>

                <p className="mt-1 text-xs text-text-muted">
                  Current review workflow
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange("Pending")
                  }
                  className="group rounded-2xl border border-amber-500/15 bg-amber-500/5 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-500/30 hover:bg-amber-500/10"
                >
                  <div className="flex items-center justify-between">
                    <Clock3
                      size={18}
                      className="text-amber-400 transition-transform group-hover:scale-110"
                    />

                    <span className="text-2xl font-black text-text-primary">
                      {pendingReviews}
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-bold text-text-secondary">
                    Pending Reviews
                  </p>

                  <p className="mt-1 text-[10px] text-text-muted">
                    Needs attention
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange("Approved")
                  }
                  className="group rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:bg-emerald-500/10"
                >
                  <div className="flex items-center justify-between">
                    <CheckCircle2
                      size={18}
                      className="text-emerald-400 transition-transform group-hover:scale-110"
                    />

                    <span className="text-2xl font-black text-text-primary">
                      {approvedReviews}
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-bold text-text-secondary">
                    Approved Reviews
                  </p>

                  <p className="mt-1 text-[10px] text-text-muted">
                    {approvalRate}% approval rate
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange("Rejected")
                  }
                  className="group rounded-2xl border border-red-500/15 bg-red-500/5 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-red-500/30 hover:bg-red-500/10"
                >
                  <div className="flex items-center justify-between">
                    <XCircle
                      size={18}
                      className="text-red-400 transition-transform group-hover:scale-110"
                    />

                    <span className="text-2xl font-black text-text-primary">
                      {rejectedReviews}
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-bold text-text-secondary">
                    Rejected Reviews
                  </p>

                  <p className="mt-1 text-[10px] text-text-muted">
                    Moderated content
                  </p>
                </button>
              </div>
            </div>
          </section>

          {/* ==================================================
              SEARCH / FILTERS
          ================================================== */}

          <section className="mt-6 rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 xl:flex-row">
              <form
                onSubmit={handleSearchSubmit}
                className="flex min-w-0 flex-1 gap-2"
              >
                <div className="relative flex-1">
                  <Search
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                  />

                  <input
                    type="text"
                    value={searchInput}
                    onChange={(event) =>
                      setSearchInput(
                        event.target.value
                      )
                    }
                    placeholder="Search reviews by title or comment..."
                    className="h-11 w-full rounded-xl border border-border-subtle bg-brand-bg pl-10 pr-10 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-accent/50 focus:ring-4 focus:ring-accent/5"
                  />

                  {searchInput && (
                    <button
                      type="button"
                      onClick={
                        handleClearSearch
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-text-muted transition hover:bg-surface hover:text-text-primary"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-brand-bg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/10"
                >
                  <Search size={16} />
                  <span className="hidden sm:inline">
                    Search
                  </span>
                </button>
              </form>

              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    (current) => !current
                  )
                }
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition-all ${
                  showFilters || hasActiveFilters
                    ? "border-accent/40 bg-accent/10 text-accent"
                    : "border-border-subtle bg-brand-bg text-text-primary hover:border-accent/30 hover:text-accent"
                }`}
              >
                <Filter size={16} />
                Filters

                {hasActiveFilters && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-black text-brand-bg">
                    !
                  </span>
                )}
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border-subtle pt-4 sm:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Status
                  </label>

                  <select
                    value={status}
                    onChange={(event) =>
                      handleStatusChange(
                        event.target.value
                      )
                    }
                    className="h-10 w-full rounded-xl border border-border-subtle bg-brand-bg px-3 text-sm text-text-primary outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/5"
                  >
                    <option value="">
                      All Statuses
                    </option>
                    <option value="Pending">
                      Pending
                    </option>
                    <option value="Approved">
                      Approved
                    </option>
                    <option value="Rejected">
                      Rejected
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Rating
                  </label>

                  <select
                    value={rating}
                    onChange={(event) =>
                      handleRatingChange(
                        event.target.value
                      )
                    }
                    className="h-10 w-full rounded-xl border border-border-subtle bg-brand-bg px-3 text-sm text-text-primary outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/5"
                  >
                    <option value="">
                      All Ratings
                    </option>
                    <option value="5">
                      5 Stars
                    </option>
                    <option value="4">
                      4 Stars
                    </option>
                    <option value="3">
                      3 Stars
                    </option>
                    <option value="2">
                      2 Stars
                    </option>
                    <option value="1">
                      1 Star
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Purchase
                  </label>

                  <select
                    value={verifiedPurchase}
                    onChange={(event) =>
                      handleVerifiedChange(
                        event.target.value
                      )
                    }
                    className="h-10 w-full rounded-xl border border-border-subtle bg-brand-bg px-3 text-sm text-text-primary outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/5"
                  >
                    <option value="">
                      All Reviews
                    </option>
                    <option value="true">
                      Verified Purchase
                    </option>
                    <option value="false">
                      Not Verified
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Sort By
                  </label>

                  <select
                    value={sort}
                    onChange={(event) =>
                      handleSortChange(
                        event.target.value
                      )
                    }
                    className="h-10 w-full rounded-xl border border-border-subtle bg-brand-bg px-3 text-sm text-text-primary outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/5"
                  >
                    <option value="newest">
                      Newest First
                    </option>
                    <option value="oldest">
                      Oldest First
                    </option>
                    <option value="highest">
                      Highest Rating
                    </option>
                    <option value="lowest">
                      Lowest Rating
                    </option>
                    <option value="helpful">
                      Most Helpful
                    </option>
                  </select>
                </div>

                {hasActiveFilters && (
                  <div className="sm:col-span-2 xl:col-span-4">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-bold text-accent transition hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                <AlertCircle
                  size={18}
                  className="text-red-400"
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-red-400">
                  Unable to load reviews
                </p>

                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={fetchReviews}
                className="ml-auto shrink-0 rounded-lg px-2 py-1 text-xs font-bold text-accent transition hover:bg-accent/10"
              >
                Retry
              </button>
            </div>
          )}

          {/* ==================================================
              REVIEWS
          ================================================== */}

          <section className="mt-5 overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border-subtle px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-black text-text-primary">
                    Customer Reviews
                  </h2>

                  <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold text-accent">
                    {pagination.totalReviews}
                  </span>
                </div>

                <p className="mt-1 text-xs text-text-muted">
                  Customer feedback and moderation
                  activity
                </p>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-fit text-xs font-bold text-accent hover:underline"
                >
                  Reset filters
                </button>
              )}
            </div>

            {/* Loading */}
            {loading ? (
              <div className="space-y-3 p-5">
                {Array.from({
                  length: 6,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-2xl border border-border-subtle bg-brand-bg p-4"
                  >
                    <div className="flex gap-4">
                      <div className="h-11 w-11 shrink-0 rounded-2xl bg-surface" />

                      <div className="flex-1">
                        <div className="h-3 w-32 rounded bg-surface" />
                        <div className="mt-3 h-3 w-2/3 rounded bg-surface" />
                        <div className="mt-2 h-3 w-1/2 rounded bg-surface" />
                      </div>

                      <div className="hidden h-8 w-20 rounded bg-surface sm:block" />
                    </div>
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center px-5 text-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl bg-accent/10 blur-2xl" />

                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/10 bg-accent/10">
                    <MessageCircle
                      size={27}
                      className="text-accent"
                    />
                  </div>
                </div>

                <h3 className="mt-5 text-lg font-black text-text-primary">
                  No reviews found
                </h3>

                <p className="mt-1 max-w-md text-sm leading-6 text-text-secondary">
                  {hasActiveFilters
                    ? "Try changing your search or filters to find more reviews."
                    : "Customer reviews will appear here once they are submitted."}
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-brand-bg transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/10"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[1100px]">
                    <thead>
                      <tr className="border-b border-border-subtle bg-brand-bg/60">
                        {[
                          "Customer",
                          "Product",
                          "Review",
                          "Rating",
                          "Status",
                          "Date",
                          "Action",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className={`px-5 py-3.5 text-left text-[10px] font-black uppercase tracking-[0.13em] text-text-muted ${
                              heading === "Action"
                                ? "text-right"
                                : ""
                            }`}
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {reviews.map(
                        (review, index) => {
                          const reviewId =
                            getReviewId(review);

                          const userName =
                            getUserName(review);

                          const productName =
                            getProductName(review);

                          const productImage =
                            getProductImage(
                              review
                            );

                          return (
                            <tr
                              key={reviewId}
                              className="group border-b border-border-subtle transition-all duration-200 last:border-b-0 hover:bg-brand-bg/50"
                              style={{
                                animation:
                                  "reviewsCardIn .4s ease-out both",
                                animationDelay: `${
                                  index * 35
                                }ms`,
                              }}
                            >
                              {/* Customer */}
                              <td className="px-5 py-4">
                                <div className="flex min-w-[200px] items-center gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-xs font-black text-accent transition-transform duration-200 group-hover:scale-105">
                                    {getInitials(
                                      userName
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-bold text-text-primary">
                                      {userName}
                                    </p>

                                    <p className="mt-0.5 max-w-[160px] truncate text-[10px] text-text-muted">
                                      {review?.user
                                        ?.email ||
                                        "No email"}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Product */}
                              <td className="px-5 py-4">
                                <div className="flex min-w-[190px] items-center gap-3">
                                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-border-subtle bg-brand-bg">
                                    {productImage ? (
                                      <img
                                        src={
                                          productImage
                                        }
                                        alt={
                                          productName
                                        }
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center text-text-muted">
                                        <Star
                                          size={15}
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <p className="line-clamp-2 text-xs font-bold text-text-primary">
                                    {productName}
                                  </p>
                                </div>
                              </td>

                              {/* Review */}
                              <td className="max-w-[360px] px-5 py-4">
                                <div>
                                  {review.title && (
                                    <p className="truncate text-sm font-bold text-text-primary">
                                      {
                                        review.title
                                      }
                                    </p>
                                  )}

                                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-secondary">
                                    {review.comment ||
                                      "No comment"}
                                  </p>

                                  <div className="mt-2 flex flex-wrap items-center gap-3">
                                    {review.verifiedPurchase && (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                                        <ShieldCheck
                                          size={12}
                                        />
                                        Verified
                                      </span>
                                    )}

                                    <span className="inline-flex items-center gap-1 text-[10px] text-text-muted">
                                      <ThumbsUp
                                        size={11}
                                      />
                                      {review.helpfulCount ||
                                        0}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Rating */}
                              <td className="px-5 py-4">
                                <div className="min-w-[100px]">
                                  <StarRating
                                    rating={
                                      review.rating
                                    }
                                    size={14}
                                  />

                                  <p className="mt-1 text-xs font-bold text-text-secondary">
                                    {review.rating ||
                                      0}
                                    /5
                                  </p>
                                </div>
                              </td>

                              {/* Status */}
                              <td className="px-5 py-4">
                                <StatusBadge
                                  status={
                                    review.status
                                  }
                                />
                              </td>

                              {/* Date */}
                              <td className="whitespace-nowrap px-5 py-4">
                                <p className="text-xs font-semibold text-text-secondary">
                                  {formatDate(
                                    review.createdAt
                                  )}
                                </p>
                              </td>

                              {/* Actions */}
                              <td className="px-5 py-4">
                                <div className="relative flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setOpenMenu(
                                        openMenu ===
                                          reviewId
                                          ? null
                                          : reviewId
                                      )
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-text-secondary transition-all hover:border-border-subtle hover:bg-brand-bg hover:text-accent"
                                  >
                                    <MoreVertical
                                      size={17}
                                    />
                                  </button>

                                  {openMenu ===
                                    reviewId && (
                                    <div className="absolute right-0 top-11 z-30 w-48 overflow-hidden rounded-2xl border border-border-subtle bg-surface p-1.5 shadow-2xl">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedReview(
                                            review
                                          );
                                          setOpenMenu(
                                            null
                                          );
                                        }}
                                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-text-secondary transition hover:bg-brand-bg hover:text-text-primary"
                                      >
                                        <Eye
                                          size={14}
                                        />
                                        View Details
                                      </button>

                                      {review.status !==
                                        "Approved" && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleStatusUpdate(
                                              reviewId,
                                              "Approved"
                                            )
                                          }
                                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/10"
                                        >
                                          <Check
                                            size={14}
                                          />
                                          Approve
                                        </button>
                                      )}

                                      {review.status !==
                                        "Rejected" && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleStatusUpdate(
                                              reviewId,
                                              "Rejected"
                                            )
                                          }
                                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-red-400 transition hover:bg-red-500/10"
                                        >
                                          <XCircle
                                            size={14}
                                          />
                                          Reject
                                        </button>
                                      )}

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedReview(
                                            review
                                          );
                                          setOpenMenu(
                                            null
                                          );
                                        }}
                                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-accent transition hover:bg-accent/10"
                                      >
                                        <MessageCircle
                                          size={14}
                                        />
                                        Reply
                                      </button>

                                      <div className="my-1 border-t border-border-subtle" />

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteReview(
                                            reviewId
                                          )
                                        }
                                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-red-400 transition hover:bg-red-500/10"
                                      >
                                        <Trash2
                                          size={14}
                                        />
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="divide-y divide-border-subtle lg:hidden">
                  {reviews.map(
                    (review, index) => {
                      const reviewId =
                        getReviewId(review);

                      const userName =
                        getUserName(review);

                      const productName =
                        getProductName(review);

                      const productImage =
                        getProductImage(review);

                      return (
                        <div
                          key={reviewId}
                          className="p-4 sm:p-5"
                          style={{
                            animation:
                              "reviewsCardIn .4s ease-out both",
                            animationDelay: `${
                              index * 35
                            }ms`,
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-xs font-black text-accent">
                                {getInitials(
                                  userName
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-text-primary">
                                  {userName}
                                </p>

                                <p className="truncate text-[10px] text-text-muted">
                                  {review?.user
                                    ?.email ||
                                    "No email"}
                                </p>
                              </div>
                            </div>

                            <StatusBadge
                              status={review.status}
                            />
                          </div>

                          {/* Product */}
                          <div className="mt-4 flex items-center gap-3">
                            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-border-subtle bg-brand-bg">
                              {productImage ? (
                                <img
                                  src={
                                    productImage
                                  }
                                  alt={
                                    productName
                                  }
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-text-muted">
                                  <Star
                                    size={15}
                                  />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-text-primary">
                                {productName}
                              </p>

                              <div className="mt-1 flex items-center gap-2">
                                <StarRating
                                  rating={
                                    review.rating
                                  }
                                  size={13}
                                />

                                <span className="text-[10px] font-semibold text-text-muted">
                                  {
                                    review.rating
                                  }
                                  /5
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Comment */}
                          <div className="mt-4 rounded-2xl border border-border-subtle bg-brand-bg p-3.5">
                            {review.title && (
                              <p className="text-sm font-bold text-text-primary">
                                {
                                  review.title
                                }
                              </p>
                            )}

                            <p className="mt-1 line-clamp-3 text-xs leading-5 text-text-secondary">
                              {review.comment ||
                                "No comment"}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              {review.verifiedPurchase && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                                  <ShieldCheck
                                    size={12}
                                  />
                                  Verified Purchase
                                </span>
                              )}

                              <span className="inline-flex items-center gap-1 text-[10px] text-text-muted">
                                <ThumbsUp
                                  size={11}
                                />
                                {review.helpfulCount ||
                                  0}{" "}
                                helpful
                              </span>

                              <span className="text-[10px] text-text-muted">
                                {formatDate(
                                  review.createdAt
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedReview(
                                  review
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-xl border border-border-subtle px-3 py-2 text-xs font-bold text-text-secondary transition hover:border-accent/30 hover:text-accent"
                            >
                              <Eye size={13} />
                              View
                            </button>

                            {review.status !==
                              "Approved" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusUpdate(
                                    reviewId,
                                    "Approved"
                                  )
                                }
                                disabled={
                                  actionLoading
                                }
                                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 px-3 py-2 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/10 disabled:opacity-50"
                              >
                                <Check
                                  size={13}
                                />
                                Approve
                              </button>
                            )}

                            {review.status !==
                              "Rejected" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusUpdate(
                                    reviewId,
                                    "Rejected"
                                  )
                                }
                                disabled={
                                  actionLoading
                                }
                                className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 px-3 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                              >
                                <X
                                  size={13}
                                />
                                Reject
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteReview(
                                  reviewId
                                )
                              }
                              disabled={
                                actionLoading
                              }
                              className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 px-3 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                            >
                              <Trash2
                                size={13}
                              />
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* ==================================================
                    PAGINATION
                ================================================== */}

                {pagination.totalPages > 1 && (
                  <div className="flex flex-col gap-3 border-t border-border-subtle px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <p className="text-xs text-text-muted">
                      Showing page{" "}
                      <span className="font-bold text-text-secondary">
                        {pagination.currentPage}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-text-secondary">
                        {pagination.totalPages}
                      </span>
                    </p>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={
                          pagination.currentPage <=
                          1
                        }
                        onClick={() =>
                          goToPage(
                            pagination.currentPage -
                              1
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-subtle text-text-secondary transition hover:border-accent/30 hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {pageNumbers.map(
                        (pageNumber, index) =>
                          pageNumber === "..." ? (
                            <span
                              key={`dots-${index}`}
                              className="flex h-9 w-8 items-center justify-center text-xs text-text-muted"
                            >
                              ...
                            </span>
                          ) : (
                            <button
                              key={pageNumber}
                              type="button"
                              onClick={() =>
                                goToPage(
                                  pageNumber
                                )
                              }
                              className={`h-9 min-w-9 rounded-xl border px-2 text-xs font-bold transition-all ${
                                pagination.currentPage ===
                                pageNumber
                                  ? "border-accent bg-accent text-brand-bg shadow-md shadow-accent/10"
                                  : "border-border-subtle text-text-secondary hover:border-accent/30 hover:text-accent"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          )
                      )}

                      <button
                        type="button"
                        disabled={
                          pagination.currentPage >=
                          pagination.totalPages
                        }
                        onClick={() =>
                          goToPage(
                            pagination.currentPage +
                              1
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-subtle text-text-secondary transition hover:border-accent/30 hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      {/* ========================================================
          MODAL
      ======================================================== */}

      {selectedReview && (
        <ReviewDetailsModal
          review={selectedReview}
          onClose={() =>
            setSelectedReview(null)
          }
          onStatusChange={
            handleStatusUpdate
          }
          onReply={handleAdminReply}
          onDelete={handleDeleteReview}
          actionLoading={actionLoading}
        />
      )}

      {/* ========================================================
          CLICK OUTSIDE MENU
      ======================================================== */}

      {openMenu && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpenMenu(null)}
          className="fixed inset-0 z-20 cursor-default"
        />
      )}
    </>
  );
}

export default Reviews;