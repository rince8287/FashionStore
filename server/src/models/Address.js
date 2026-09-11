import mongoose from "mongoose";

// ======================================================
// ADDRESS SCHEMA
// ======================================================

const addressSchema = new mongoose.Schema(
  {
    // ==================================================
    // USER
    // ==================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required."],
      index: true,
    },

    // ==================================================
    // FULL NAME
    // ==================================================

    fullName: {
      type: String,
      required: [true, "Full name is required."],
      trim: true,
      maxlength: [
        100,
        "Full name cannot exceed 100 characters.",
      ],
    },

    // ==================================================
    // PHONE
    // ==================================================

    phone: {
      type: String,
      required: [true, "Phone number is required."],
      trim: true,
    },

    alternatePhone: {
      type: String,
      trim: true,
      default: "",
    },

    // ==================================================
    // ADDRESS LABEL
    // ==================================================

    label: {
      type: String,
      enum: [
        "Home",
        "Work",
        "Other",
      ],
      default: "Home",
    },

    // ==================================================
    // ADDRESS
    // ==================================================

    houseNumber: {
      type: String,
      required: [
        true,
        "House / Flat number is required.",
      ],
      trim: true,
    },

    area: {
      type: String,
      required: [
        true,
        "Area is required.",
      ],
      trim: true,
    },

    landmark: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      required: [
        true,
        "City is required.",
      ],
      trim: true,
    },

    state: {
      type: String,
      required: [
        true,
        "State is required.",
      ],
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    postalCode: {
      type: String,
      required: [
        true,
        "Postal code is required.",
      ],
      trim: true,
    },

    // ==================================================
    // LOCATION
    // ==================================================

    location: {
      latitude: {
        type: Number,
        default: null,
      },

      longitude: {
        type: Number,
        default: null,
      },
    },

    // ==================================================
    // DELIVERY TYPE
    // ==================================================

    addressType: {
      type: String,

      enum: [
        "Home",
        "Office",
        "Other",
      ],

      default: "Home",
    },

    deliveryInstructions: {
      type: String,
      trim: true,
      maxlength: [
        300,
        "Delivery instructions cannot exceed 300 characters.",
      ],
      default: "",
    },

    // ==================================================
    // DEFAULT ADDRESS
    // ==================================================

    isDefault: {
      type: Boolean,
      default: false,
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

addressSchema.index({
  user: 1,
  isDefault: 1,
});

addressSchema.index({
  city: 1,
  state: 1,
});

addressSchema.index({
  postalCode: 1,
});

// ======================================================
// JSON
// ======================================================

addressSchema.set(
  "toJSON",
  {
    virtuals: true,

    transform(doc, ret) {
      delete ret.__v;

      return ret;
    },
  }
);

// ======================================================
// OBJECT
// ======================================================

addressSchema.set(
  "toObject",
  {
    virtuals: true,
  }
);

// ======================================================
// MODEL
// ======================================================

const Address =
  mongoose.model(
    "Address",
    addressSchema
  );

export default Address;