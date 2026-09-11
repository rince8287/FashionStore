import mongoose from "mongoose";

// ======================================================
// IMAGE SCHEMA
// ======================================================

const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "Product image URL is required"],
      trim: true,
    },

    publicId: {
      type: String,
      default: "",
      trim: true,
    },

    alt: {
      type: String,
      default: "",
      trim: true,
    },

    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

// ======================================================
// COLOR SCHEMA
// ======================================================

const colorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Color name is required"],
      trim: true,
    },

    hex: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

// ======================================================
// SIZE SCHEMA
// ======================================================

const sizeSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: [true, "Size is required"],
      trim: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: [0, "Size stock cannot be negative"],
    },

    sku: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },
  },
  {
    _id: false,
  }
);

// ======================================================
// PRODUCT SCHEMA
// ======================================================

const productSchema = new mongoose.Schema(
  {
    // ==================================================
    // BASIC INFORMATION
    // ==================================================

    name: {
      type: String,
      required: [
        true,
        "Product name is required",
      ],
      trim: true,
      maxlength: [
        200,
        "Product name cannot exceed 200 characters",
      ],
    },

    slug: {
      type: String,
      required: [
        true,
        "Product slug is required",
      ],
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: [
        500,
        "Short description cannot exceed 500 characters",
      ],
    },

    description: {
      type: String,
      required: [
        true,
        "Product description is required",
      ],
      trim: true,
    },

    // ==================================================
    // CATEGORY
    // ==================================================

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [
        true,
        "Product category is required",
      ],
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    // ==================================================
    // GENDER
    // ==================================================

    gender: {
      type: String,
      enum: [
        "men",
        "women",
        "kids",
        "unisex",
      ],
      default: "unisex",
    },

    // ==================================================
    // PRICING
    // ==================================================

    price: {
      type: Number,
      required: [
        true,
        "Product price is required",
      ],
      min: [
        0,
        "Price cannot be negative",
      ],
    },

    salePrice: {
      type: Number,
      default: null,
      min: [
        0,
        "Sale price cannot be negative",
      ],
    },

    // ==================================================
    // INVENTORY
    // ==================================================

    stock: {
      type: Number,
      required: [
        true,
        "Product stock is required",
      ],
      min: [
        0,
        "Stock cannot be negative",
      ],
      default: 0,
    },

    sku: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true,
    },

    // ==================================================
    // SIZES
    // ==================================================

    sizes: {
      type: [sizeSchema],
      default: [],
    },

    // ==================================================
    // COLORS
    // ==================================================

    colors: {
      type: [colorSchema],
      default: [],
    },

    // ==================================================
    // IMAGES
    // ==================================================

    images: {
      type: [productImageSchema],

      validate: {
        validator: function (images) {
          return (
            Array.isArray(images) &&
            images.length >= 4 &&
            images.length <= 10
          );
        },

        message:
          "Product must have at least 4 images and maximum 10 images.",
      },

      default: [],
    },

    // ==================================================
    // PRODUCT SETTINGS
    // ==================================================

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ==================================================
    // DELIVERY
    // ==================================================

    freeDelivery: {
      type: Boolean,
      default: false,
    },

    // ==================================================
    // RETURN
    // ==================================================

    returnable: {
      type: Boolean,
      default: true,
    },

    returnDays: {
      type: Number,
      default: 7,
      min: [
        0,
        "Return days cannot be negative",
      ],
    },
  },

  {
    timestamps: true,
  }
);

// ======================================================
// INDEXES
// ======================================================

// Product search
productSchema.index({
  name: "text",
  description: "text",
});

// Category filtering
productSchema.index({
  category: 1,
});

// Active products
productSchema.index({
  isActive: 1,
});

// Newest products
productSchema.index({
  createdAt: -1,
});

// Gender filtering
productSchema.index({
  gender: 1,
});

// Featured products
productSchema.index({
  isFeatured: 1,
});

// Trending products
productSchema.index({
  isTrending: 1,
});

// ======================================================
// VALIDATE SALE PRICE
// ======================================================
//
// IMPORTANT:
// Do NOT use next() here.
// Current Mongoose middleware supports
// synchronous validation hooks.
// ======================================================

productSchema.pre(
  "validate",
  function () {
    if (
      this.salePrice !== null &&
      this.salePrice !== undefined &&
      this.price !== null &&
      this.price !== undefined &&
      this.salePrice > this.price
    ) {
      throw new Error(
        "Sale price cannot be greater than product price."
      );
    }
  }
);

// ======================================================
// JSON TRANSFORM
// ======================================================

productSchema.set("toJSON", {
  virtuals: true,

  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// ======================================================
// PRODUCT MODEL
// ======================================================

const Product = mongoose.model(
  "Product",
  productSchema
);

export default Product;