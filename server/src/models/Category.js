import mongoose from "mongoose";

// ================= CATEGORY SCHEMA =================

const categorySchema = new mongoose.Schema(
  {
    // ================= NAME =================

    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },

    // ================= SLUG =================

    slug: {
      type: String,
      required: [true, "Category slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ================= DESCRIPTION =================

    description: {
      type: String,
      trim: true,
      maxlength: [
        500,
        "Category description cannot exceed 500 characters",
      ],
      default: "",
    },

    // ================= IMAGE =================

    image: {
      type: String,
      default: "",
      trim: true,
    },

    // ================= PARENT CATEGORY =================
    // Example:
    //
    // Men
    //  ├── Shirts
    //  ├── T-Shirts
    //  └── Jeans
    //
    // If parent = null → Main Category

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    // ================= ACTIVE STATUS =================

    isActive: {
      type: Boolean,
      default: true,
    },

    // ================= FEATURED CATEGORY =================

    isFeatured: {
      type: Boolean,
      default: false,
    },

    // ================= DISPLAY ORDER =================
    // Useful for controlling category order on frontend

    sortOrder: {
      type: Number,
      default: 0,
      min: [0, "Sort order cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// ================= INDEXES =================

// Useful when fetching active categories
categorySchema.index({
  isActive: 1,
  sortOrder: 1,
});

// Useful for parent/subcategory queries
categorySchema.index({
  parent: 1,
});

// ================= PRE VALIDATE =================
// Automatically generate slug from category name
//
// Example:
// "Men's Clothing"
// becomes
// "mens-clothing"

categorySchema.pre("validate", function () {
  if (
    this.name &&
    (!this.slug || this.isModified("name"))
  ) {
    this.slug = this.name
      .toLowerCase()
      .trim()

      // Remove apostrophes
      .replace(/['’]/g, "")

      // Replace non-alphanumeric characters with "-"
      .replace(/[^a-z0-9]+/g, "-")

      // Remove starting/ending "-"
      .replace(/^-+|-+$/g, "");
  }
});

// ================= JSON TRANSFORM =================

categorySchema.set("toJSON", {
  virtuals: true,

  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// ================= CATEGORY MODEL =================

const Category = mongoose.model(
  "Category",
  categorySchema
);

export default Category;