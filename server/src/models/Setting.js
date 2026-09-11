import mongoose from "mongoose";

// ======================================================
// FASHIONSTORE - SETTINGS MODEL
// ======================================================
//
// Store-wide settings ke liye single document use hoga.
// Ye user-specific settings nahi hain.
//
// MongoDB collection:
// settings
//
// ======================================================

const settingSchema = new mongoose.Schema(
  {
    // ====================================================
    // STORE / GENERAL SETTINGS
    // ====================================================

    storeName: {
      type: String,
      trim: true,
      default: "FashionStore",
      maxlength: 100,
    },

    storeEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
      maxlength: 150,
    },

    storePhone: {
      type: String,
      trim: true,
      default: "",
      maxlength: 30,
    },

    currency: {
      type: String,
      trim: true,
      default: "INR",
      enum: [
        "INR",
        "USD",
        "EUR",
        "GBP",
        "AED",
        "AUD",
        "CAD",
      ],
    },

    timezone: {
      type: String,
      trim: true,
      default: "Asia/Kolkata",
    },

    language: {
      type: String,
      trim: true,
      default: "en",
      enum: [
        "en",
        "hi",
      ],
    },

    // ====================================================
    // NOTIFICATION SETTINGS
    // ====================================================

    emailNotifications: {
      type: Boolean,
      default: true,
    },

    orderNotifications: {
      type: Boolean,
      default: true,
    },

    customerNotifications: {
      type: Boolean,
      default: true,
    },

    reviewNotifications: {
      type: Boolean,
      default: true,
    },

    lowStockNotifications: {
      type: Boolean,
      default: true,
    },

    // ====================================================
    // STORE / CHECKOUT PREFERENCES
    // ====================================================

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    customerRegistration: {
      type: Boolean,
      default: true,
    },

    guestCheckout: {
      type: Boolean,
      default: true,
    },

    showOutOfStockProducts: {
      type: Boolean,
      default: true,
    },

    // ====================================================
    // SECURITY SETTINGS
    // ====================================================

    twoFactorAuthentication: {
      type: Boolean,
      default: false,
    },

    loginAlerts: {
      type: Boolean,
      default: true,
    },

    // ====================================================
    // AUDIT INFORMATION
    // ====================================================

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "settings",
  }
);

// ======================================================
// SINGLETON SETTINGS DOCUMENT
// ======================================================
//
// Hum ek hi settings document maintain karenge.
//
// `_id` ko manually force nahi kar rahe.
// Controller `findOne()` / `findOneAndUpdate()` ke
// through single document maintain karega.
//
// ======================================================

// ======================================================
// JSON TRANSFORM
// ======================================================

settingSchema.set(
  "toJSON",
  {
    transform: (doc, ret) => {
      delete ret.__v;

      return ret;
    },
  }
);

// ======================================================
// MODEL
// ======================================================

const Setting =
  mongoose.models.Setting ||
  mongoose.model(
    "Setting",
    settingSchema
  );

export default Setting;