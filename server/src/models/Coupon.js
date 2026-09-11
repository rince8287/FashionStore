import mongoose from "mongoose";

// ======================================================
// COUPON SCHEMA
// ======================================================

const couponSchema = new mongoose.Schema(
  {
    // ==================================================
    // COUPON CODE
    // ==================================================

    code: {
      type: String,
      required: [
        true,
        "Coupon code is required.",
      ],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [
        3,
        "Coupon code must be at least 3 characters.",
      ],
      maxlength: [
        30,
        "Coupon code cannot exceed 30 characters.",
      ],
      match: [
        /^[A-Z0-9_-]+$/,
        "Coupon code can only contain letters, numbers, hyphens and underscores.",
      ],
    },

    // ==================================================
    // TITLE
    // ==================================================

    title: {
      type: String,
      required: [
        true,
        "Coupon title is required.",
      ],
      trim: true,
      minlength: [
        2,
        "Coupon title must be at least 2 characters.",
      ],
      maxlength: [
        100,
        "Coupon title cannot exceed 100 characters.",
      ],
    },

    // ==================================================
    // DESCRIPTION
    // ==================================================

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [
        500,
        "Coupon description cannot exceed 500 characters.",
      ],
    },

    // ==================================================
    // DISCOUNT TYPE
    // ==================================================

    discountType: {
      type: String,
      enum: {
        values: [
          "percentage",
          "fixed",
        ],
        message:
          "Discount type must be percentage or fixed.",
      },
      required: [
        true,
        "Discount type is required.",
      ],
    },

    // ==================================================
    // DISCOUNT VALUE
    // ==================================================

    discountValue: {
      type: Number,
      required: [
        true,
        "Discount value is required.",
      ],
      min: [
        1,
        "Discount value must be at least 1.",
      ],
    },

    // ==================================================
    // MAXIMUM DISCOUNT
    // ==================================================

    maxDiscount: {
      type: Number,
      default: 0,
      min: [
        0,
        "Maximum discount cannot be negative.",
      ],
    },

    // ==================================================
    // MINIMUM ORDER VALUE
    // ==================================================

    minOrderAmount: {
      type: Number,
      default: 0,
      min: [
        0,
        "Minimum order amount cannot be negative.",
      ],
    },

    // ==================================================
    // START DATE
    // ==================================================

    startDate: {
      type: Date,
      required: [
        true,
        "Coupon start date is required.",
      ],
    },

    // ==================================================
    // EXPIRY DATE
    // ==================================================

    expiryDate: {
      type: Date,
      required: [
        true,
        "Coupon expiry date is required.",
      ],
    },

    // ==================================================
    // TOTAL USAGE LIMIT
    // ==================================================

    usageLimit: {
      type: Number,
      default: 1,
      min: [
        1,
        "Usage limit must be at least 1.",
      ],
    },

    // ==================================================
    // USED COUNT
    // ==================================================

    usedCount: {
      type: Number,
      default: 0,
      min: [
        0,
        "Used count cannot be negative.",
      ],
    },

    // ==================================================
    // PER USER USAGE LIMIT
    // ==================================================

    perUserLimit: {
      type: Number,
      default: 1,
      min: [
        1,
        "Per-user limit must be at least 1.",
      ],
    },

    // ==================================================
    // ALLOWED USERS
    // ==================================================

    allowedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ==================================================
    // APPLICABLE CATEGORIES
    // ==================================================

    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    // ==================================================
    // APPLICABLE PRODUCTS
    // ==================================================

    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // ==================================================
    // FIRST ORDER ONLY
    // ==================================================

    firstOrderOnly: {
      type: Boolean,
      default: false,
    },

    // ==================================================
    // ACTIVE STATUS
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

// Coupon code lookup
couponSchema.index({
  code: 1,
});

// Expiry lookup
couponSchema.index({
  expiryDate: 1,
});

// Active coupons lookup
couponSchema.index({
  isActive: 1,
});

// Active + expiry lookup
couponSchema.index({
  isActive: 1,
  expiryDate: 1,
});

// ======================================================
// VALIDATION MIDDLEWARE
// ======================================================
//
// IMPORTANT:
//
// Yahan `next()` use NAHI karna hai.
//
// Tumhare current Mongoose execution mein callback-style
// `next` available nahi tha, jiski wajah se:
//
// TypeError: next is not a function
//
// aa raha tha.
//
// Validation fail hone par Error throw karna hai.
//

couponSchema.pre(
  "validate",
  async function () {
    // ==================================================
    // START DATE / EXPIRY DATE
    // ==================================================

    if (
      this.startDate &&
      this.expiryDate &&
      this.startDate >=
        this.expiryDate
    ) {
      throw new Error(
        "Coupon expiry date must be after the start date."
      );
    }

    // ==================================================
    // DISCOUNT VALUE
    // ==================================================

    if (
      this.discountType ===
        "percentage" &&
      this.discountValue > 100
    ) {
      throw new Error(
        "Percentage discount cannot be greater than 100%."
      );
    }

    // ==================================================
    // FIXED DISCOUNT
    // ==================================================

    if (
      this.discountType ===
        "fixed" &&
      this.discountValue <= 0
    ) {
      throw new Error(
        "Fixed discount must be greater than 0."
      );
    }

    // ==================================================
    // MAX DISCOUNT
    // ==================================================
    //
    // Fixed discount ke liye maxDiscount ki zarurat nahi.
    //

    if (
      this.discountType ===
        "fixed" &&
      this.maxDiscount > 0
    ) {
      this.maxDiscount = 0;
    }

    // ==================================================
    // USED COUNT
    // ==================================================

    if (
      this.usageLimit !==
        null &&
      this.usageLimit !==
        undefined &&
      this.usedCount >
        this.usageLimit
    ) {
      throw new Error(
        "Used coupon count cannot exceed usage limit."
      );
    }

    // ==================================================
    // PER USER LIMIT
    // ==================================================

    if (
      this.perUserLimit !==
        null &&
      this.perUserLimit !==
        undefined &&
      this.perUserLimit < 1
    ) {
      throw new Error(
        "Per-user limit must be at least 1."
      );
    }

    // ==================================================
    // NORMALIZE COUPON CODE
    // ==================================================

    if (this.code) {
      this.code =
        this.code
          .trim()
          .toUpperCase();
    }

    // ==================================================
    // NORMALIZE DISCOUNT VALUE
    // ==================================================

    if (
      this.discountValue !==
        null &&
      this.discountValue !==
        undefined
    ) {
      this.discountValue =
        Math.round(
          Number(
            this.discountValue
          ) * 100
        ) / 100;
    }

    // ==================================================
    // NORMALIZE MAX DISCOUNT
    // ==================================================

    if (
      this.maxDiscount !==
        null &&
      this.maxDiscount !==
        undefined
    ) {
      this.maxDiscount =
        Math.round(
          Number(
            this.maxDiscount
          ) * 100
        ) / 100;
    }

    // ==================================================
    // NORMALIZE MINIMUM ORDER
    // ==================================================

    if (
      this.minOrderAmount !==
        null &&
      this.minOrderAmount !==
        undefined
    ) {
      this.minOrderAmount =
        Math.round(
          Number(
            this.minOrderAmount
          ) * 100
        ) / 100;
    }
  }
);

// ======================================================
// VIRTUAL: IS EXPIRED
// ======================================================

couponSchema.virtual(
  "isExpired"
).get(
  function () {
    if (!this.expiryDate) {
      return false;
    }

    return (
      new Date() >
      this.expiryDate
    );
  }
);

// ======================================================
// VIRTUAL: IS UPCOMING
// ======================================================

couponSchema.virtual(
  "isUpcoming"
).get(
  function () {
    if (!this.startDate) {
      return false;
    }

    return (
      new Date() <
      this.startDate
    );
  }
);

// ======================================================
// VIRTUAL: USAGE LIMIT REACHED
// ======================================================

couponSchema.virtual(
  "isUsageLimitReached"
).get(
  function () {
    if (
      this.usageLimit ===
        null ||
      this.usageLimit ===
        undefined
    ) {
      return false;
    }

    return (
      this.usedCount >=
      this.usageLimit
    );
  }
);

// ======================================================
// VIRTUAL: STATUS
// ======================================================

couponSchema.virtual(
  "status"
).get(
  function () {
    const now =
      new Date();

    // --------------------------------------------------
    // INACTIVE
    // --------------------------------------------------

    if (!this.isActive) {
      return "inactive";
    }

    // --------------------------------------------------
    // UPCOMING
    // --------------------------------------------------

    if (
      this.startDate &&
      now <
        this.startDate
    ) {
      return "upcoming";
    }

    // --------------------------------------------------
    // EXPIRED
    // --------------------------------------------------

    if (
      this.expiryDate &&
      now >
        this.expiryDate
    ) {
      return "expired";
    }

    // --------------------------------------------------
    // USED UP
    // --------------------------------------------------

    if (
      this.usageLimit !==
        null &&
      this.usageLimit !==
        undefined &&
      this.usedCount >=
        this.usageLimit
    ) {
      return "used-up";
    }

    // --------------------------------------------------
    // ACTIVE
    // --------------------------------------------------

    return "active";
  }
);

// ======================================================
// METHOD: CAN BE USED
// ======================================================

couponSchema.methods.canBeUsed =
  function () {
    const now =
      new Date();

    // --------------------------------------------------
    // ACTIVE CHECK
    // --------------------------------------------------

    if (!this.isActive) {
      return false;
    }

    // --------------------------------------------------
    // START DATE CHECK
    // --------------------------------------------------

    if (
      this.startDate &&
      now <
        this.startDate
    ) {
      return false;
    }

    // --------------------------------------------------
    // EXPIRY DATE CHECK
    // --------------------------------------------------

    if (
      this.expiryDate &&
      now >
        this.expiryDate
    ) {
      return false;
    }

    // --------------------------------------------------
    // USAGE LIMIT CHECK
    // --------------------------------------------------

    if (
      this.usageLimit !==
        null &&
      this.usageLimit !==
        undefined &&
      this.usedCount >=
        this.usageLimit
    ) {
      return false;
    }

    return true;
  };

// ======================================================
// METHOD: CHECK USER ELIGIBILITY
// ======================================================

couponSchema.methods.isUserEligible =
  function (userId) {
    // --------------------------------------------------
    // No restrictions = everyone allowed
    // --------------------------------------------------

    if (
      !this.allowedUsers ||
      this.allowedUsers.length ===
        0
    ) {
      return true;
    }

    // --------------------------------------------------
    // Restricted coupon requires user
    // --------------------------------------------------

    if (!userId) {
      return false;
    }

    return this.allowedUsers.some(
      (id) =>
        id.toString() ===
        userId.toString()
    );
  };

// ======================================================
// METHOD: CALCULATE DISCOUNT
// ======================================================

couponSchema.methods.calculateDiscount =
  function (
    orderAmount
  ) {
    const amount =
      Number(
        orderAmount
      );

    // --------------------------------------------------
    // INVALID ORDER AMOUNT
    // --------------------------------------------------

    if (
      !Number.isFinite(
        amount
      ) ||
      amount <= 0
    ) {
      return 0;
    }

    // --------------------------------------------------
    // MINIMUM ORDER CHECK
    // --------------------------------------------------

    if (
      amount <
      Number(
        this.minOrderAmount ||
          0
      )
    ) {
      return 0;
    }

    let discount = 0;

    // ==================================================
    // PERCENTAGE DISCOUNT
    // ==================================================

    if (
      this.discountType ===
      "percentage"
    ) {
      discount =
        (
          amount *
          Number(
            this.discountValue
          )
        ) /
        100;

      // ------------------------------------------------
      // MAXIMUM DISCOUNT
      // ------------------------------------------------

      if (
        Number(
          this.maxDiscount
        ) > 0
      ) {
        discount =
          Math.min(
            discount,
            Number(
              this.maxDiscount
            )
          );
      }
    }

    // ==================================================
    // FIXED DISCOUNT
    // ==================================================

    if (
      this.discountType ===
      "fixed"
    ) {
      discount =
        Number(
          this.discountValue
        );
    }

    // ==================================================
    // NEVER EXCEED ORDER AMOUNT
    // ==================================================

    discount =
      Math.min(
        discount,
        amount
      );

    // ==================================================
    // ROUND TO 2 DECIMALS
    // ==================================================

    return (
      Math.round(
        discount * 100
      ) / 100
    );
  };

// ======================================================
// METHOD: GET REMAINING USAGE
// ======================================================

couponSchema.methods.getRemainingUsage =
  function () {
    // --------------------------------------------------
    // Unlimited
    // --------------------------------------------------

    if (
      this.usageLimit ===
        null ||
      this.usageLimit ===
        undefined
    ) {
      return null;
    }

    return Math.max(
      Number(
        this.usageLimit
      ) -
        Number(
          this.usedCount ||
            0
        ),
      0
    );
  };

// ======================================================
// JSON TRANSFORM
// ======================================================

couponSchema.set(
  "toJSON",
  {
    virtuals: true,

    transform(
      doc,
      ret
    ) {
      delete ret.__v;

      return ret;
    },
  }
);

// ======================================================
// OBJECT TRANSFORM
// ======================================================

couponSchema.set(
  "toObject",
  {
    virtuals: true,
  }
);

// ======================================================
// MODEL
// ======================================================
//
// Prevents OverwriteModelError during development
// / nodemon reload.
//

const Coupon =
  mongoose.models.Coupon ||
  mongoose.model(
    "Coupon",
    couponSchema
  );

// ======================================================
// EXPORT
// ======================================================

export default Coupon;