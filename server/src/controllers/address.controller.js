import mongoose from "mongoose";

import Address from "../models/Address.js";

// ======================================================
// HELPERS
// ======================================================

// Check MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ======================================================
// GET ALL ADDRESSES
//
// GET /api/v1/address
//
// Logged-in user ke saare active addresses
// Default address sabse upar aayega.
// ======================================================

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.user._id,
      isActive: true,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    console.error(
      "Get Addresses Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get addresses.",
    });
  }
};

// ======================================================
// GET SINGLE ADDRESS
//
// GET /api/v1/address/:id
// ======================================================

export const getAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Address ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID.",
      });
    }

    const address = await Address.findOne({
      _id: id,
      user: req.user._id,
      isActive: true,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    return res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    console.error(
      "Get Address Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get address.",
    });
  }
};
// ======================================================
// CREATE ADDRESS
//
// POST /api/v1/address
// ======================================================

export const createAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      alternatePhone,
      label,
      houseNumber,
      area,
      landmark,
      city,
      state,
      country,
      postalCode,
      location,
      addressType,
      deliveryInstructions,
      isDefault,
    } = req.body;

    // ==================================================
    // REQUIRED VALIDATION
    // ==================================================

    if (
      !fullName ||
      !phone ||
      !houseNumber ||
      !area ||
      !city ||
      !state ||
      !postalCode
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please fill all required fields.",
      });
    }

    // ==================================================
    // CHECK EXISTING ADDRESSES
    // ==================================================

    const totalAddresses =
      await Address.countDocuments({
        user: req.user._id,
        isActive: true,
      });

    // ==================================================
    // FIRST ADDRESS ALWAYS DEFAULT
    // ==================================================

    let makeDefault = false;

    if (totalAddresses === 0) {
      makeDefault = true;
    } else if (isDefault) {
      makeDefault = true;

      await Address.updateMany(
        {
          user: req.user._id,
        },
        {
          isDefault: false,
        }
      );
    }

    // ==================================================
    // CREATE ADDRESS
    // ==================================================

    const address = await Address.create({
      user: req.user._id,

      fullName,

      phone,

      alternatePhone:
        alternatePhone || "",

      label:
        label || "Home",

      houseNumber,

      area,

      landmark:
        landmark || "",

      city,

      state,

      country:
        country || "India",

      postalCode,

      location: {
        latitude:
          location?.latitude ??
          null,

        longitude:
          location?.longitude ??
          null,
      },

      addressType:
        addressType || "House",

      deliveryInstructions:
        deliveryInstructions || "",

      isDefault: makeDefault,
    });

    return res.status(201).json({
      success: true,
      message:
        "Address added successfully.",

      address,
    });
  } catch (error) {
    console.error(
      "Create Address Error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,

        message: Object.values(
          error.errors
        )
          .map(
            (item) =>
              item.message
          )
          .join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to create address.",
    });
  }
};
// ======================================================
// UPDATE ADDRESS
//
// PUT /api/v1/address/:id
// ======================================================

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID.",
      });
    }

    const address = await Address.findOne({
      _id: id,
      user: req.user._id,
      isActive: true,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    const {
      fullName,
      phone,
      alternatePhone,
      label,
      houseNumber,
      area,
      landmark,
      city,
      state,
      country,
      postalCode,
      location,
      addressType,
      deliveryInstructions,
      isDefault,
    } = req.body;

    // ==================================================
    // UPDATE FIELDS
    // ==================================================

    if (fullName !== undefined)
      address.fullName = fullName;

    if (phone !== undefined)
      address.phone = phone;

    if (alternatePhone !== undefined)
      address.alternatePhone =
        alternatePhone;

    if (label !== undefined)
      address.label = label;

    if (houseNumber !== undefined)
      address.houseNumber =
        houseNumber;

    if (area !== undefined)
      address.area = area;

    if (landmark !== undefined)
      address.landmark = landmark;

    if (city !== undefined)
      address.city = city;

    if (state !== undefined)
      address.state = state;

    if (country !== undefined)
      address.country = country;

    if (postalCode !== undefined)
      address.postalCode =
        postalCode;

    if (addressType !== undefined)
      address.addressType =
        addressType;

    if (
      deliveryInstructions !==
      undefined
    ) {
      address.deliveryInstructions =
        deliveryInstructions;
    }

    if (location) {
      address.location = {
        latitude:
          location.latitude ?? null,

        longitude:
          location.longitude ?? null,
      };
    }

    // ==================================================
    // DEFAULT ADDRESS
    // ==================================================

    if (isDefault === true) {
      await Address.updateMany(
        {
          user: req.user._id,
        },
        {
          isDefault: false,
        }
      );

      address.isDefault = true;
    }

    await address.save();

    return res.status(200).json({
      success: true,
      message:
        "Address updated successfully.",
      address,
    });
  } catch (error) {
    console.error(
      "Update Address Error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,

        message: Object.values(
          error.errors
        )
          .map(
            (item) =>
              item.message
          )
          .join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to update address.",
    });
  }
};

// ======================================================
// SET DEFAULT ADDRESS
//
// PATCH /api/v1/address/:id/default
// ======================================================

export const setDefaultAddress =
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid address ID.",
        });
      }

      const address =
        await Address.findOne({
          _id: id,
          user: req.user._id,
          isActive: true,
        });

      if (!address) {
        return res.status(404).json({
          success: false,
          message:
            "Address not found.",
        });
      }

      // Remove previous default
      await Address.updateMany(
        {
          user: req.user._id,
        },
        {
          isDefault: false,
        }
      );

      // Make selected address default
      address.isDefault = true;

      await address.save();

      return res.status(200).json({
        success: true,
        message:
          "Default address updated successfully.",
        address,
      });
    } catch (error) {
      console.error(
        "Set Default Address Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update default address.",
      });
    }
  };
  // ======================================================
// DELETE ADDRESS
//
// DELETE /api/v1/address/:id
// ======================================================

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID.",
      });
    }

    const address = await Address.findOne({
      _id: id,
      user: req.user._id,
      isActive: true,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    const wasDefault = address.isDefault;

    // ============================================
    // SOFT DELETE
    // ============================================

    address.isActive = false;
    address.isDefault = false;

    await address.save();

    // ============================================
    // IF DEFAULT ADDRESS WAS DELETED
    // MAKE ANOTHER ADDRESS DEFAULT
    // ============================================

    if (wasDefault) {
      const anotherAddress =
        await Address.findOne({
          user: req.user._id,
          isActive: true,
        }).sort({
          createdAt: -1,
        });

      if (anotherAddress) {
        anotherAddress.isDefault = true;
        await anotherAddress.save();
      }
    }

    return res.status(200).json({
      success: true,
      message:
        "Address deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Address Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete address.",
    });
  }
};

// ======================================================
// GET DEFAULT ADDRESS
//
// GET /api/v1/address/default
// ======================================================

export const getDefaultAddress =
  async (req, res) => {
    try {
      const address =
        await Address.findOne({
          user: req.user._id,
          isActive: true,
          isDefault: true,
        });

      if (!address) {
        return res.status(404).json({
          success: false,
          message:
            "Default address not found.",
        });
      }

      return res.status(200).json({
        success: true,
        address,
      });
    } catch (error) {
      console.error(
        "Get Default Address Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to get default address.",
      });
    }
  };