import mongoose from "mongoose";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// ======================================================
// CREATE REVIEW
// POST /api/v1/reviews
// Logged In User
// ======================================================

export const createReview = async (
  req,
  res
) => {
  try {
    const {
      productId,
      rating,
      title,
      comment,
      images,
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required.",
      });
    }

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Review comment is required.",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be between 1 and 5.",
      });
    }

    // ==================================================
    // FIND PRODUCT
    // ==================================================

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found.",
      });
    }

    // ==================================================
    // DUPLICATE REVIEW
    // ==================================================

    const existingReview =
      await Review.findOne({
        user: req.user._id,
        product: productId,
      });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message:
          "You have already reviewed this product.",
      });
    }

    // ==================================================
    // VERIFIED PURCHASE
    // ==================================================

    const verifiedOrder =
      await Order.findOne({
        user: req.user._id,
        status: "Delivered",
        "items.product": productId,
      });

    // ==================================================
    // CREATE REVIEW
    // ==================================================

    const review =
      await Review.create({
        user: req.user._id,

        product: productId,

        order:
          verifiedOrder?._id ||
          null,

        rating,

        title:
          title || "",

        comment,

        images:
          images || [],

        verifiedPurchase:
          !!verifiedOrder,
      });

    // ==================================================
    // UPDATE PRODUCT RATING
    // ==================================================

    const reviews =
      await Review.find({
        product: productId,
        status: "Approved",
        isActive: true,
      });

    const totalReviews =
      reviews.length;

    const averageRating =
      totalReviews > 0
        ? reviews.reduce(
            (sum, review) =>
              sum +
              review.rating,
            0
          ) / totalReviews
        : 0;

    product.averageRating =
      Number(
        averageRating.toFixed(1)
      );

    product.totalReviews =
      totalReviews;

    await product.save();

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(201).json({
      success: true,

      message:
        "Review added successfully.",

      review,
    });

  } catch (error) {
    console.error(
      "Create Review Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to create review.",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};
// ======================================================
// UPDATE REVIEW
// PUT /api/v1/reviews/:id
// Logged In User
// ======================================================

export const updateReview = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      rating,
      title,
      comment,
      images,
    } = req.body;

    const review =
      await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message:
          "Review not found.",
      });
    }

    // ================================================
    // OWNER CHECK
    // ================================================

    if (
      review.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to update this review.",
      });
    }

    // ================================================
    // VALIDATE RATING
    // ================================================

    if (
      rating !== undefined &&
      (rating < 1 || rating > 5)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be between 1 and 5.",
      });
    }

    // ================================================
    // UPDATE FIELDS
    // ================================================

    if (rating !== undefined)
      review.rating = rating;

    if (title !== undefined)
      review.title = title;

    if (comment !== undefined)
      review.comment = comment;

    if (images !== undefined)
      review.images = images;

    await review.save();

    // ================================================
    // UPDATE PRODUCT RATING
    // ================================================

    const reviews =
      await Review.find({
        product: review.product,
        status: "Approved",
        isActive: true,
      });

    const totalReviews =
      reviews.length;

    const averageRating =
      totalReviews > 0
        ? reviews.reduce(
            (sum, item) =>
              sum + item.rating,
            0
          ) / totalReviews
        : 0;

    await Product.findByIdAndUpdate(
      review.product,
      {
        averageRating:
          Number(
            averageRating.toFixed(1)
          ),

        totalReviews,
      }
    );

    // ================================================
    // RESPONSE
    // ================================================

    return res.status(200).json({
      success: true,

      message:
        "Review updated successfully.",

      review,
    });

  } catch (error) {
    console.error(
      "Update Review Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to update review.",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};

// ======================================================
// DELETE REVIEW
// DELETE /api/v1/reviews/:id
// Logged In User / Admin
// ======================================================

export const deleteReview = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const review =
      await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message:
          "Review not found.",
      });
    }

    // ================================================
    // OWNER OR ADMIN
    // ================================================

    const isOwner =
      review.user.toString() ===
      req.user._id.toString();

    const isAdmin =
      req.user.role === "admin";

    if (
      !isOwner &&
      !isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to delete this review.",
      });
    }

    const productId =
      review.product;

    await review.deleteOne();

    // ================================================
    // UPDATE PRODUCT RATING
    // ================================================

    const reviews =
      await Review.find({
        product: productId,
        status: "Approved",
        isActive: true,
      });

    const totalReviews =
      reviews.length;

    const averageRating =
      totalReviews > 0
        ? reviews.reduce(
            (sum, item) =>
              sum + item.rating,
            0
          ) / totalReviews
        : 0;

    await Product.findByIdAndUpdate(
      productId,
      {
        averageRating:
          Number(
            averageRating.toFixed(1)
          ),

        totalReviews,
      }
    );

    // ================================================
    // RESPONSE
    // ================================================

    return res.status(200).json({
      success: true,

      message:
        "Review deleted successfully.",
    });

  } catch (error) {
    console.error(
      "Delete Review Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to delete review.",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};
// ======================================================
// GET PRODUCT REVIEWS
// GET /api/v1/reviews/product/:productId
// Public
// ======================================================

export const getProductReviews =
  async (req, res) => {
    try {
      const { productId } =
        req.params;

      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 10;

      const skip =
        (page - 1) * limit;

      const rating =
        Number(req.query.rating) || 0;

      const sort =
        req.query.sort || "-createdAt";

      // ================================================
      // FILTER
      // ================================================

      const filter = {
        product: productId,
        status: "Approved",
        isActive: true,
      };

      if (rating) {
        filter.rating = rating;
      }

      // ================================================
      // GET REVIEWS
      // ================================================

      const reviews =
        await Review.find(filter)
          .populate(
            "user",
            "name avatar"
          )
          .sort(sort)
          .skip(skip)
          .limit(limit);

      const totalReviews =
        await Review.countDocuments(
          filter
        );

      // ================================================
      // RATING SUMMARY
      // ================================================

      const ratingSummary =
  await Review.aggregate([
    {
      $match: {
        product:
          new mongoose.Types.ObjectId(
            productId
          ),
        status: "Approved",
        isActive: true,
      },
    },

    {
      $group: {
        _id: "$rating",

        count: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        _id: -1,
      },
    },
  ]);

      // ================================================
      // RESPONSE
      // ================================================

      return res.status(200).json({
        success: true,

        currentPage: page,

        totalPages:
          Math.ceil(
            totalReviews /
              limit
          ),

        totalReviews,

        ratingSummary,

        reviews,
      });

    } catch (error) {
      console.error(
        "Get Product Reviews Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch product reviews.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

// ======================================================
// GET REVIEW BY ID
// GET /api/v1/reviews/:id
// Public
// ======================================================

export const getReviewById =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const review =
        await Review.findById(id)
          .populate(
            "user",
            "name avatar"
          )
          .populate(
            "product",
            "name images"
          )
          .populate(
            "order",
            "orderNumber"
          );

      if (!review) {
        return res.status(404).json({
          success: false,
          message:
            "Review not found.",
        });
      }

      return res.status(200).json({
        success: true,
        review,
      });

    } catch (error) {
      console.error(
        "Get Review By ID Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch review.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  }; 
  // ======================================================
// GET MY REVIEWS
// GET /api/v1/reviews/my
// Logged In User
// ======================================================

export const getMyReviews =
  async (req, res) => {
    try {
      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 10;

      const skip =
        (page - 1) * limit;

      const sort =
        req.query.sort || "-createdAt";

      // ==================================================
      // GET REVIEWS
      // ==================================================

      const reviews =
        await Review.find({
          user: req.user._id,
        })
          .populate(
            "product",
            "name images averageRating"
          )
          .populate(
            "order",
            "orderNumber"
          )
          .sort(sort)
          .skip(skip)
          .limit(limit);

      const totalReviews =
        await Review.countDocuments({
          user: req.user._id,
        });

      // ==================================================
      // REVIEW SUMMARY
      // ==================================================

      const summary =
        await Review.aggregate([
          {
            $match: {
              user: req.user._id,
            },
          },
          {
            $group: {
              _id: null,

              totalReviews: {
                $sum: 1,
              },

              averageRating: {
                $avg: "$rating",
              },

              totalHelpful: {
                $sum: "$helpfulCount",
              },
            },
          },
        ]);

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({
        success: true,

        currentPage: page,

        totalPages:
          Math.ceil(
            totalReviews / limit
          ),

        totalReviews,

        summary:
          summary[0] || {
            totalReviews: 0,
            averageRating: 0,
            totalHelpful: 0,
          },

        reviews,
      });

    } catch (error) {
      console.error(
        "Get My Reviews Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch your reviews.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };
  // ======================================================
// MARK REVIEW AS HELPFUL
// POST /api/v1/reviews/:id/helpful
// Logged In User
// ======================================================

export const markHelpful = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // ==================================================
    // FIND REVIEW
    // ==================================================

    const review =
      await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message:
          "Review not found.",
      });
    }

    // ==================================================
    // USER CANNOT MARK OWN REVIEW
    // ==================================================

    if (
      review.user.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot mark your own review as helpful.",
      });
    }

    // ==================================================
    // ALREADY MARKED
    // ==================================================

    const alreadyMarked =
      review.helpfulBy.some(
        (userId) =>
          userId.toString() ===
          req.user._id.toString()
      );

    if (alreadyMarked) {
      return res.status(400).json({
        success: false,
        message:
          "You have already marked this review as helpful.",
      });
    }

    // ==================================================
    // ADD USER
    // ==================================================

    review.helpfulBy.push(
      req.user._id
    );

    review.helpfulCount += 1;

    await review.save();

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "Review marked as helpful.",

      helpfulCount:
        review.helpfulCount,

      review,
    });

  } catch (error) {
    console.error(
      "Mark Helpful Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to mark review as helpful.",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};
// ======================================================
// ADMIN REPLY TO REVIEW
// POST /api/v1/reviews/:id/reply
// Admin Only
// ======================================================

export const adminReply = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message:
          "Reply message is required.",
      });
    }

    // ==================================================
    // FIND REVIEW
    // ==================================================

    const review =
      await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message:
          "Review not found.",
      });
    }

    // ==================================================
    // SAVE ADMIN REPLY
    // ==================================================

    review.adminReply = {
      message,
      repliedAt: new Date(),
    };

    await review.save();

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "Admin reply added successfully.",

      review,
    });

  } catch (error) {
    console.error(
      "Admin Reply Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to add admin reply.",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};

// ======================================================
// UPDATE REVIEW STATUS
// PATCH /api/v1/reviews/:id/status
// Admin Only
// ======================================================

export const updateReviewStatus =
  async (req, res) => {
    try {
      const { id } = req.params;

      const { status } = req.body;

      // ==================================================
      // VALID STATUS
      // ==================================================

      const allowedStatus = [
        "Pending",
        "Approved",
        "Rejected",
      ];

      if (
        !allowedStatus.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid review status.",
        });
      }

      // ==================================================
      // FIND REVIEW
      // ==================================================

      const review =
        await Review.findById(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message:
            "Review not found.",
        });
      }

      // ==================================================
      // UPDATE STATUS
      // ==================================================

      review.status = status;

      await review.save();

      // ==================================================
      // RECALCULATE PRODUCT RATING
      // ==================================================

      const reviews =
        await Review.find({
          product: review.product,
          status: "Approved",
          isActive: true,
        });

      const totalReviews =
        reviews.length;

      const averageRating =
        totalReviews > 0
          ? reviews.reduce(
              (sum, item) =>
                sum +
                item.rating,
              0
            ) / totalReviews
          : 0;

      await Product.findByIdAndUpdate(
        review.product,
        {
          averageRating:
            Number(
              averageRating.toFixed(
                1
              )
            ),

          totalReviews,
        }
      );

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({
        success: true,

        message:
          "Review status updated successfully.",

        review,
      });

    } catch (error) {
      console.error(
        "Update Review Status Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to update review status.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };
  // ======================================================
// GET REVIEW STATISTICS
// GET /api/v1/reviews/statistics
// Admin Only
// ======================================================

export const getReviewStatistics =
  async (req, res) => {
    try {

      // ==================================================
      // TOTAL COUNTS
      // ==================================================

      const [
        totalReviews,
        approvedReviews,
        pendingReviews,
        rejectedReviews,
      ] = await Promise.all([

        Review.countDocuments(),

        Review.countDocuments({
          status: "Approved",
        }),

        Review.countDocuments({
          status: "Pending",
        }),

        Review.countDocuments({
          status: "Rejected",
        }),

      ]);

      // ==================================================
      // AVERAGE RATING
      // ==================================================

      const averageResult =
        await Review.aggregate([
          {
            $match: {
              status: "Approved",
              isActive: true,
            },
          },
          {
            $group: {
              _id: null,
              averageRating: {
                $avg: "$rating",
              },
            },
          },
        ]);

      const averageRating =
        averageResult.length
          ? Number(
              averageResult[0]
                .averageRating.toFixed(1)
            )
          : 0;

      // ==================================================
      // RATING DISTRIBUTION
      // ==================================================

      const ratingDistribution =
        await Review.aggregate([
          {
            $match: {
              status: "Approved",
              isActive: true,
            },
          },
          {
            $group: {
              _id: "$rating",
              total: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              _id: -1,
            },
          },
        ]);

      // ==================================================
      // RECENT REVIEWS
      // ==================================================

      const recentReviews =
        await Review.find()
          .populate(
            "user",
            "name email"
          )
          .populate(
            "product",
            "name"
          )
          .sort({
            createdAt: -1,
          })
          .limit(10);

      // ==================================================
      // TOP RATED PRODUCTS
      // ==================================================

      const topRatedProducts =
        await Review.aggregate([
          {
            $match: {
              status: "Approved",
              isActive: true,
            },
          },
          {
            $group: {
              _id: "$product",

              averageRating: {
                $avg: "$rating",
              },

              totalReviews: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              averageRating: -1,
              totalReviews: -1,
            },
          },
          {
            $limit: 10,
          },
          {
            $lookup: {
              from: "products",
              localField: "_id",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $unwind: "$product",
          },
        ]);

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({
        success: true,

        statistics: {

          totalReviews,

          approvedReviews,

          pendingReviews,

          rejectedReviews,

          averageRating,

        },

        ratingDistribution,

        topRatedProducts,

        recentReviews,

      });

    } catch (error) {

      console.error(
        "Review Statistics Error:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch review statistics.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,

      });
    }
  };
  // ======================================================
// ADMIN — GET ALL REVIEWS
// GET /api/v1/reviews/admin
// Admin Only
// ======================================================

export const getAllReviewsForAdmin = async (
  req,
  res
) => {
  try {
    // ==================================================
    // PAGINATION
    // ==================================================

    const page =
      Math.max(
        Number(req.query.page) || 1,
        1
      );

    const limit =
      Math.min(
        Math.max(
          Number(req.query.limit) || 10,
          1
        ),
        100
      );

    const skip =
      (page - 1) * limit;

    // ==================================================
    // QUERY PARAMETERS
    // ==================================================

    const {
      search = "",
      status = "",
      rating = "",
      verifiedPurchase = "",
      sort = "-createdAt",
    } = req.query;

    // ==================================================
    // FILTER
    // ==================================================

    const filter = {};

    // Status filter
    if (
      status &&
      ["Pending", "Approved", "Rejected"].includes(
        status
      )
    ) {
      filter.status = status;
    }

    // Rating filter
    if (rating) {
      const numericRating = Number(rating);

      if (
        numericRating >= 1 &&
        numericRating <= 5
      ) {
        filter.rating = numericRating;
      }
    }

    // Verified purchase filter
    if (
      verifiedPurchase === "true" ||
      verifiedPurchase === "false"
    ) {
      filter.verifiedPurchase =
        verifiedPurchase === "true";
    }

    // ==================================================
    // SEARCH
    // ==================================================

    if (search.trim()) {
      const searchRegex =
        new RegExp(
          search.trim(),
          "i"
        );

      filter.$or = [
        {
          title: searchRegex,
        },
        {
          comment: searchRegex,
        },
      ];
    }

    // ==================================================
    // SORT
    // ==================================================

    const allowedSorts = {
      newest: {
        createdAt: -1,
      },

      oldest: {
        createdAt: 1,
      },

      highest: {
        rating: -1,
        createdAt: -1,
      },

      lowest: {
        rating: 1,
        createdAt: -1,
      },

      helpful: {
        helpfulCount: -1,
        createdAt: -1,
      },
    };

    let sortOption =
      allowedSorts.newest;

    if (
      typeof sort === "string" &&
      allowedSorts[sort]
    ) {
      sortOption =
        allowedSorts[sort];
    }

    // ==================================================
    // GET REVIEWS
    // ==================================================

    const [
      reviews,
      totalReviews,
    ] = await Promise.all([
      Review.find(filter)
        .populate(
          "user",
          "name email phone avatar role"
        )
        .populate(
          "product",
          "name images price"
        )
        .populate(
          "order",
          "orderNumber"
        )
        .sort(sortOption)
        .skip(skip)
        .limit(limit),

      Review.countDocuments(filter),
    ]);

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      currentPage: page,

      totalPages:
        Math.ceil(
          totalReviews / limit
        ),

      totalReviews,

      limit,

      reviews,
    });
  } catch (error) {
    console.error(
      "Get All Reviews For Admin Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch reviews.",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};