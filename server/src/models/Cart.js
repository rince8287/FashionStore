import mongoose from "mongoose";

// ======================================================
// CART ITEM SCHEMA
// ======================================================

const cartItemSchema = new mongoose.Schema(
  {
    // ==================================================
    // PRODUCT
    // ==================================================

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [
        true,
        "Product is required.",
      ],
    },

    // ==================================================
    // QUANTITY
    // ==================================================

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: [
        1,
        "Quantity must be at least 1.",
      ],
      max: [
        99,
        "Quantity cannot exceed 99.",
      ],
    },

    // ==================================================
    // SELECTED SIZE
    // Example: S, M, L, XL, 8, 9 etc.
    // Optional because Beauty / Bags / Watches
    // may not have sizes.
    // ==================================================

    size: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },

    // ==================================================
    // SELECTED COLOR
    // ==================================================

    color: {
      type: String,
      trim: true,
      default: "",
    },

    // ==================================================
    // PRICE SNAPSHOT
    //
    // Current selling price when cart was updated.
    // Controller will keep this synchronized with Product.
    // ==================================================

    price: {
      type: Number,
      required: true,
      min: [
        0,
        "Price cannot be negative.",
      ],
    },

    // ==================================================
    // ORIGINAL PRICE SNAPSHOT
    // Useful for showing discount in cart.
    // ==================================================

    originalPrice: {
      type: Number,
      required: true,
      min: [
        0,
        "Original price cannot be negative.",
      ],
    },

    // ==================================================
    // ADDED AT
    // ==================================================

    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  }
);

// ======================================================
// CART SCHEMA
// ======================================================

const cartSchema = new mongoose.Schema(
  {
    // ==================================================
    // USER
    //
    // One cart belongs to one logged-in user.
    // ==================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [
        true,
        "User is required.",
      ],
      unique: true,
      index: true,
    },

    // ==================================================
    // CART ITEMS
    // ==================================================

    items: {
      type: [cartItemSchema],
      default: [],
    },

    // ==================================================
    // COUPON
    //
    // Future Coupon backend ke liye ready.
    // ==================================================

    coupon: {
      code: {
        type: String,
        trim: true,
        uppercase: true,
        default: "",
      },

      discountAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// VIRTUAL — TOTAL CART QUANTITY
//
// Example:
// Shirt quantity = 2
// Shoes quantity = 1
//
// itemCount = 3
// ======================================================

cartSchema.virtual("itemCount").get(
  function () {
    if (!this.items?.length) {
      return 0;
    }

    return this.items.reduce(
      (total, item) =>
        total + (item.quantity || 0),
      0
    );
  }
);

// ======================================================
// VIRTUAL — SUBTOTAL
//
// price × quantity
// ======================================================

cartSchema.virtual("subtotal").get(
  function () {
    if (!this.items?.length) {
      return 0;
    }

    return this.items.reduce(
      (total, item) => {
        const price =
          Number(item.price) || 0;

        const quantity =
          Number(item.quantity) || 0;

        return total + price * quantity;
      },
      0
    );
  }
);

// ======================================================
// VIRTUAL — ORIGINAL TOTAL
//
// Original price before product discounts.
// ======================================================

cartSchema.virtual("originalTotal").get(
  function () {
    if (!this.items?.length) {
      return 0;
    }

    return this.items.reduce(
      (total, item) => {
        const price =
          Number(item.originalPrice) || 0;

        const quantity =
          Number(item.quantity) || 0;

        return total + price * quantity;
      },
      0
    );
  }
);

// ======================================================
// VIRTUAL — PRODUCT DISCOUNT SAVINGS
//
// originalTotal - subtotal
// ======================================================

cartSchema.virtual(
  "productDiscount",
  function () {
    const originalTotal =
      this.originalTotal || 0;

    const subtotal =
      this.subtotal || 0;

    return Math.max(
      0,
      originalTotal - subtotal
    );
  }
);

// ======================================================
// VIRTUAL — COUPON DISCOUNT
// ======================================================

cartSchema.virtual(
  "couponDiscount",
  function () {
    return Math.max(
      0,
      Number(
        this.coupon?.discountAmount
      ) || 0
    );
  }
);

// ======================================================
// VIRTUAL — CART TOTAL
//
// subtotal - coupon discount
//
// Delivery/payment charges checkout backend me
// calculate karenge.
// ======================================================

cartSchema.virtual("total").get(
  function () {
    const subtotal =
      this.subtotal || 0;

    const couponDiscount =
      this.couponDiscount || 0;

    return Math.max(
      0,
      subtotal - couponDiscount
    );
  }
);

// ======================================================
// METHOD — FIND CART ITEM
//
// Same product + same size + same color
// ko same cart item maana jayega.
//
// Example:
//
// Black T-Shirt M
// Black T-Shirt L
//
// dono separate cart items rahenge.
// ======================================================

cartSchema.methods.findCartItem =
  function (
    productId,
    size = "",
    color = ""
  ) {
    const normalizedSize = String(
      size || ""
    )
      .trim()
      .toUpperCase();

    const normalizedColor = String(
      color || ""
    )
      .trim()
      .toLowerCase();

    return this.items.find((item) => {
      const sameProduct =
        item.product.toString() ===
        productId.toString();

      const sameSize =
        String(item.size || "")
          .trim()
          .toUpperCase() ===
        normalizedSize;

      const sameColor =
        String(item.color || "")
          .trim()
          .toLowerCase() ===
        normalizedColor;

      return (
        sameProduct &&
        sameSize &&
        sameColor
      );
    });
  };

// ======================================================
// METHOD — CLEAR CART
// ======================================================

cartSchema.methods.clearCart =
  function () {
    this.items = [];

    this.coupon = {
      code: "",
      discountAmount: 0,
    };

    return this;
  };

// ======================================================
// INDEXES
// ======================================================

// Useful for cart/product queries
cartSchema.index({
  "items.product": 1,
});

// ======================================================
// JSON SETTINGS
// ======================================================

cartSchema.set("toJSON", {
  virtuals: true,

  transform: function (doc, ret) {
    delete ret.__v;

    return ret;
  },
});

cartSchema.set("toObject", {
  virtuals: true,
});

// ======================================================
// CART MODEL
// ======================================================

const Cart = mongoose.model(
  "Cart",
  cartSchema
);

export default Cart;