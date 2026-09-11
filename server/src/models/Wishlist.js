import mongoose from "mongoose";

// ======================================================
// WISHLIST ITEM SCHEMA
// ======================================================

const wishlistItemSchema = new mongoose.Schema(
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
    // ADDED DATE
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
// WISHLIST SCHEMA
// ======================================================

const wishlistSchema = new mongoose.Schema(
  {
    // ==================================================
    // USER
    //
    // Har user ki ek wishlist hogi.
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
    // WISHLIST PRODUCTS
    // ==================================================

    items: {
      type: [wishlistItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// VIRTUAL — WISHLIST ITEM COUNT
// ======================================================

wishlistSchema.virtual("itemCount").get(
  function () {
    return this.items?.length || 0;
  }
);

// ======================================================
// METHOD — CHECK PRODUCT EXISTS
//
// Check karega product wishlist me already hai ya nahi.
// ======================================================

wishlistSchema.methods.hasProduct =
  function (productId) {
    if (!productId) {
      return false;
    }

    return this.items.some((item) => {
      return (
        item.product.toString() ===
        productId.toString()
      );
    });
  };

// ======================================================
// METHOD — FIND WISHLIST ITEM
// ======================================================

wishlistSchema.methods.findProduct =
  function (productId) {
    if (!productId) {
      return null;
    }

    return this.items.find((item) => {
      return (
        item.product.toString() ===
        productId.toString()
      );
    });
  };

// ======================================================
// METHOD — ADD PRODUCT
//
// Duplicate product add nahi hone dega.
// ======================================================

wishlistSchema.methods.addProduct =
  function (productId) {
    if (!productId) {
      return false;
    }

    const alreadyExists =
      this.hasProduct(productId);

    if (alreadyExists) {
      return false;
    }

    this.items.push({
      product: productId,
      addedAt: new Date(),
    });

    return true;
  };

// ======================================================
// METHOD — REMOVE PRODUCT
// ======================================================

wishlistSchema.methods.removeProduct =
  function (productId) {
    if (!productId) {
      return false;
    }

    const previousLength =
      this.items.length;

    this.items = this.items.filter(
      (item) =>
        item.product.toString() !==
        productId.toString()
    );

    return (
      previousLength !==
      this.items.length
    );
  };

// ======================================================
// METHOD — CLEAR WISHLIST
// ======================================================

wishlistSchema.methods.clearWishlist =
  function () {
    this.items = [];

    return this;
  };

// ======================================================
// INDEXES
// ======================================================

// Product based lookup ke liye
wishlistSchema.index({
  "items.product": 1,
});

// ======================================================
// JSON SETTINGS
// ======================================================

wishlistSchema.set("toJSON", {
  virtuals: true,

  transform: function (doc, ret) {
    delete ret.__v;

    return ret;
  },
});

wishlistSchema.set("toObject", {
  virtuals: true,
});

// ======================================================
// MODEL
// ======================================================

const Wishlist = mongoose.model(
  "Wishlist",
  wishlistSchema
);

export default Wishlist;