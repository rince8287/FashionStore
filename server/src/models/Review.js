import mongoose from "mongoose";

// ======================================================
// REVIEW SCHEMA
// ======================================================

const reviewSchema = new mongoose.Schema(
  {
    // ==================================================
    // USER
    // ==================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ==================================================
    // PRODUCT
    // ==================================================

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    // ==================================================
    // ORDER
    // Used to verify purchase
    // ==================================================

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    // ==================================================
    // RATING
    // ==================================================

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // ==================================================
    // REVIEW TITLE
    // ==================================================

    title: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },

    // ==================================================
    // REVIEW MESSAGE
    // ==================================================

    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 2000,
    },

    // ==================================================
    // REVIEW IMAGES
    // ==================================================

    images: [
      {
        url: {
          type: String,
          default: "",
        },

        publicId: {
          type: String,
          default: "",
        },
      },
    ],

    // ==================================================
    // VERIFIED PURCHASE
    // ==================================================

    verifiedPurchase: {
      type: Boolean,
      default: false,
    },

    // ==================================================
    // HELPFUL COUNT
    // ==================================================

    helpfulCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==================================================
    // USERS WHO MARKED HELPFUL
    // ==================================================

    helpfulBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ==================================================
    // ADMIN REPLY
    // ==================================================

    adminReply: {
      message: {
        type: String,
        default: "",
      },

      repliedAt: {
        type: Date,
        default: null,
      },
    },

    // ==================================================
    // REPORTS
    // ==================================================

    reports: {
      type: Number,
      default: 0,
    },

    // ==================================================
    // STATUS
    // ==================================================

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
      ],
      default: "Approved",
      index: true,
    },

    // ==================================================
    // ACTIVE
    // ==================================================

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// COMPOUND INDEX
// One review per user per product
// ======================================================

reviewSchema.index(
  {
    user: 1,
    product: 1,
  },
  {
    unique: true,
  }
);

// ======================================================
// INDEXES
// ======================================================

reviewSchema.index({
  product: 1,
  rating: 1,
});

reviewSchema.index({
  createdAt: -1,
});

reviewSchema.index({
  verifiedPurchase: 1,
});

// ======================================================
// VIRTUAL
// ======================================================

reviewSchema.virtual(
  "imageCount"
).get(function () {
  return this.images.length;
});

// ======================================================
// METHODS
// ======================================================

reviewSchema.methods.markHelpful =
  function (userId) {
    const alreadyMarked =
      this.helpfulBy.some(
        (id) =>
          id.toString() ===
          userId.toString()
      );

    if (!alreadyMarked) {
      this.helpfulBy.push(userId);
      this.helpfulCount += 1;
    }

    return this.save();
  };

// ======================================================
// JSON SETTINGS
// ======================================================

reviewSchema.set("toJSON", {
  virtuals: true,

  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

reviewSchema.set("toObject", {
  virtuals: true,
});

// ======================================================
// MODEL
// ======================================================

const Review = mongoose.model(
  "Review",
  reviewSchema
);

export default Review;