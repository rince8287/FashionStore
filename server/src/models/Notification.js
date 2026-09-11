import mongoose from "mongoose";

// ======================================================
// NOTIFICATION SCHEMA
// ======================================================

const notificationSchema = new mongoose.Schema(
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
    // TITLE
    // ==================================================

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    // ==================================================
    // MESSAGE
    // ==================================================

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // ==================================================
    // TYPE
    // ==================================================

    type: {
      type: String,
      enum: [
        "Order",
        "Payment",
        "Refund",
        "Review",
        "Coupon",
        "Offer",
        "System",
        "Account",
      ],
      default: "System",
      index: true,
    },

    // ==================================================
    // PRIORITY
    // ==================================================

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
      ],
      default: "Medium",
    },

    // ==================================================
    // STATUS
    // ==================================================

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    // ==================================================
    // ACTION URL
    // ==================================================

    actionUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // ==================================================
    // RELATED MODELS
    // ==================================================

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      default: null,
    },

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      default: null,
    },

    // ==================================================
    // ICON
    // ==================================================

    icon: {
      type: String,
      default: "bell",
    },

    // ==================================================
    // ACTIVE
    // ==================================================

    isActive: {
      type: Boolean,
      default: true,
    },

    // ==================================================
    // EXTRA DATA
    // ==================================================

    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// INDEXES
// ======================================================

notificationSchema.index({
  user: 1,
  createdAt: -1,
});

notificationSchema.index({
  isRead: 1,
});

notificationSchema.index({
  type: 1,
});

// ======================================================
// VIRTUAL
// ======================================================

notificationSchema.virtual("isUnread").get(
  function () {
    return !this.isRead;
  }
);

// ======================================================
// METHOD
// ======================================================

notificationSchema.methods.markAsRead =
  async function () {
    this.isRead = true;
    this.readAt = new Date();

    return this.save();
  };

// ======================================================
// JSON SETTINGS
// ======================================================

notificationSchema.set("toJSON", {
  virtuals: true,

  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

notificationSchema.set("toObject", {
  virtuals: true,
});

// ======================================================
// MODEL
// ======================================================

const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

export default Notification;