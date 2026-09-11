import mongoose from "mongoose";

// ======================================================
// TRANSACTION SCHEMA
// ======================================================

const transactionSchema = new mongoose.Schema(
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
    // ORDER
    // ==================================================

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    // ==================================================
    // TRANSACTION ID
    // ==================================================

    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    // ==================================================
    // RAZORPAY
    // ==================================================

    razorpayOrderId: {
      type: String,
      default: "",
      trim: true,
    },

    razorpayPaymentId: {
      type: String,
      default: "",
      trim: true,
    },

    razorpaySignature: {
      type: String,
      default: "",
    },

    // ==================================================
    // PAYMENT METHOD
    // ==================================================

    paymentMethod: {
      type: String,
      enum: [
        "COD",
        "Razorpay",
        "UPI",
        "Card",
        "NetBanking",
        "Wallet",
      ],
      default: "Razorpay",
    },

    // ==================================================
    // AMOUNT
    // ==================================================

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    // ==================================================
    // STATUS
    // ==================================================

    status: {
      type: String,
      enum: [
        "Pending",
        "Authorized",
        "Paid",
        "Failed",
        "Cancelled",
        "Refunded",
        "Partially Refunded",
      ],
      default: "Pending",
      index: true,
    },

    // ==================================================
    // REFUND
    // ==================================================

    refund: {
      refundId: {
        type: String,
        default: "",
      },

      refundAmount: {
        type: Number,
        default: 0,
      },

      refundReason: {
        type: String,
        default: "",
      },

      refundedAt: {
        type: Date,
        default: null,
      },
    },

    // ==================================================
    // FAILURE DETAILS
    // ==================================================

    failure: {
      code: {
        type: String,
        default: "",
      },

      description: {
        type: String,
        default: "",
      },

      source: {
        type: String,
        default: "",
      },

      step: {
        type: String,
        default: "",
      },

      reason: {
        type: String,
        default: "",
      },
    },

    // ==================================================
    // NOTES
    // ==================================================

    notes: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    // ==================================================
    // ACTIVE
    // ==================================================

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// INDEXES
// ======================================================

transactionSchema.index({
  user: 1,
  createdAt: -1,
});

transactionSchema.index({
  order: 1,
});

transactionSchema.index({
  razorpayPaymentId: 1,
});

transactionSchema.index({
  razorpayOrderId: 1,
});

// ======================================================
// VIRTUAL
// ======================================================

transactionSchema.virtual(
  "isSuccessful"
).get(function () {
  return (
    this.status === "Paid" ||
    this.status === "Refunded"
  );
});

// ======================================================
// METHOD
// ======================================================

transactionSchema.methods.markFailed =
  function (
    code,
    description
  ) {
    this.status = "Failed";

    this.failure.code = code;

    this.failure.description =
      description;

    return this.save();
  };

// ======================================================
// JSON SETTINGS
// ======================================================

transactionSchema.set("toJSON", {
  virtuals: true,

  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

transactionSchema.set("toObject", {
  virtuals: true,
});

// ======================================================
// MODEL
// ======================================================

const Transaction =
  mongoose.model(
    "Transaction",
    transactionSchema
  );

export default Transaction;