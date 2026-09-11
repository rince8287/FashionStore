import Setting from "../models/Setting.js";

// ======================================================
// GET SETTINGS
// ======================================================
//
// GET /api/v1/settings
//
// Admin current store settings fetch kar sakta hai.
//
// Agar settings document pehli baar request par exist nahi
// karta, to default settings automatically create ho jayengi.
//
// ======================================================

export const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    // ==================================================
    // CREATE DEFAULT SETTINGS IF NOT EXISTS
    // ==================================================

    if (!settings) {
      settings = await Setting.create({
        updatedBy: req.user?._id || null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Settings fetched successfully.",
      settings,
    });
  } catch (error) {
    console.error(
      "❌ Get Settings Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch settings.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// ======================================================
// UPDATE SETTINGS
// ======================================================
//
// PUT /api/v1/settings
//
// Admin store settings update kar sakta hai.
//
// ======================================================

export const updateSettings = async (req, res) => {
  try {
    // ==================================================
    // REQUEST BODY
    // ==================================================

    const body = req.body || {};

    // ==================================================
    // ALLOWED FIELDS
    // ==================================================
    //
    // Sirf ye fields update hongi.
    // Isse unwanted fields MongoDB mein save nahi hongi.
    //
    // ==================================================

    const allowedFields = [
      "storeName",
      "storeEmail",
      "storePhone",
      "currency",
      "timezone",
      "language",

      "emailNotifications",
      "orderNotifications",
      "customerNotifications",
      "reviewNotifications",
      "lowStockNotifications",

      "maintenanceMode",
      "customerRegistration",
      "guestCheckout",
      "showOutOfStockProducts",

      "twoFactorAuthentication",
      "loginAlerts",
    ];

    const updates = {};

    // ==================================================
    // COPY ONLY ALLOWED FIELDS
    // ==================================================

    for (const field of allowedFields) {
      if (
        Object.prototype.hasOwnProperty.call(
          body,
          field
        )
      ) {
        updates[field] = body[field];
      }
    }

    // ==================================================
    // STORE NAME VALIDATION
    // ==================================================

    if (
      updates.storeName !== undefined
    ) {
      if (
        typeof updates.storeName !==
        "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Store name must be a string.",
        });
      }

      updates.storeName =
        updates.storeName.trim();

      if (!updates.storeName) {
        return res.status(400).json({
          success: false,
          message:
            "Store name cannot be empty.",
        });
      }

      if (
        updates.storeName.length > 100
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Store name cannot exceed 100 characters.",
        });
      }
    }

    // ==================================================
    // EMAIL VALIDATION
    // ==================================================

    if (
      updates.storeEmail !== undefined
    ) {
      if (
        typeof updates.storeEmail !==
        "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Store email must be a string.",
        });
      }

      updates.storeEmail =
        updates.storeEmail
          .trim()
          .toLowerCase();

      if (
        updates.storeEmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          updates.storeEmail
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide a valid store email.",
        });
      }
    }

    // ==================================================
    // PHONE VALIDATION
    // ==================================================

    if (
      updates.storePhone !== undefined
    ) {
      if (
        typeof updates.storePhone !==
        "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Store phone must be a string.",
        });
      }

      updates.storePhone =
        updates.storePhone.trim();

      if (
        updates.storePhone.length > 30
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Store phone cannot exceed 30 characters.",
        });
      }
    }

    // ==================================================
    // CURRENCY VALIDATION
    // ==================================================

    const allowedCurrencies = [
      "INR",
      "USD",
      "EUR",
      "GBP",
      "AED",
      "AUD",
      "CAD",
    ];

    if (
      updates.currency !== undefined
    ) {
      if (
        !allowedCurrencies.includes(
          updates.currency
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid currency selected.",
        });
      }
    }

    // ==================================================
    // LANGUAGE VALIDATION
    // ==================================================

    const allowedLanguages = [
      "en",
      "hi",
    ];

    if (
      updates.language !== undefined
    ) {
      if (
        !allowedLanguages.includes(
          updates.language
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid language selected.",
        });
      }
    }

    // ==================================================
    // BOOLEAN FIELDS VALIDATION
    // ==================================================

    const booleanFields = [
      "emailNotifications",
      "orderNotifications",
      "customerNotifications",
      "reviewNotifications",
      "lowStockNotifications",

      "maintenanceMode",
      "customerRegistration",
      "guestCheckout",
      "showOutOfStockProducts",

      "twoFactorAuthentication",
      "loginAlerts",
    ];

    for (const field of booleanFields) {
      if (
        updates[field] !== undefined &&
        typeof updates[field] !==
          "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message:
            `${field} must be true or false.`,
        });
      }
    }

    // ==================================================
    // CHECK UNKNOWN / EMPTY UPDATE
    // ==================================================

    if (
      Object.keys(updates).length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No valid settings were provided for update.",
      });
    }

    // ==================================================
    // UPDATE / CREATE SETTINGS
    // ==================================================

    const settings =
      await Setting.findOneAndUpdate(
        {},
        {
          $set: {
            ...updates,
            updatedBy:
              req.user?._id || null,
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

    // ==================================================
    // SUCCESS RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,
      message:
        "Settings updated successfully.",
      settings,
    });
  } catch (error) {
    console.error(
      "❌ Update Settings Error:",
      error
    );

    // ==================================================
    // MONGOOSE VALIDATION ERROR
    // ==================================================

    if (
      error.name ===
      "ValidationError"
    ) {
      const validationErrors =
        Object.values(
          error.errors || {}
        ).map(
          (err) => err.message
        );

      return res.status(400).json({
        success: false,
        message:
          "Invalid settings data.",
        errors:
          validationErrors,
      });
    }

    // ==================================================
    // GENERAL ERROR
    // ==================================================

    return res.status(500).json({
      success: false,
      message:
        "Failed to update settings.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};