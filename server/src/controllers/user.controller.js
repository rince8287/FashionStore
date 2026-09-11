// ======================================================
// USER CONTROLLER
// ======================================================

import mongoose from "mongoose";

import User from "../models/User.js";
import BankAccount from "../models/BankAccount.js";
import UpiAccount from "../models/UpiAccount.js";

// ======================================================
// HELPERS
// ======================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Prevent browser / Express 304 caching
const disableCache = (res) => {
  res.set({
    "Cache-Control":
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "Surrogate-Control": "no-store",
  });
};

// ======================================================
// GET ALL CUSTOMERS - ADMIN
// GET /api/v1/users/admin/all
// ======================================================

export const adminGetAllUsers = async (req, res) => {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 20,
        1
      ),
      100
    );

    const skip = (page - 1) * limit;

    const search = String(
      req.query.search || ""
    ).trim();

    const status = String(
      req.query.status || "all"
    ).toLowerCase();

    const filter = {
      role: "user",
    };

    // SEARCH
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // STATUS
    if (status === "active") {
      filter.isActive = true;
    }

    if (status === "blocked") {
      filter.isActive = false;
    }

    if (status === "verified") {
      filter.isVerified = true;
    }

    if (status === "unverified") {
      filter.isVerified = false;
    }

    const total =
      await User.countDocuments(filter);

    const users =
      await User.find(filter)
        .select("-password")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean();

    const totalPages =
      Math.ceil(total / limit);

    disableCache(res);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage:
          page < totalPages,
        hasPrevPage:
          page > 1,
      },
    });
  } catch (error) {
    console.error(
      "Admin Get All Users Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch customers.",
    });
  }
};

// ======================================================
// GET SINGLE CUSTOMER - ADMIN
// GET /api/v1/users/admin/:id
// ======================================================

export const adminGetSingleUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid customer ID.",
      });
    }

    const user =
      await User.findOne({
        _id: id,
        role: "user",
      })
        .select("-password")
        .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Customer not found.",
      });
    }

    disableCache(res);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "Admin Get Single User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch customer.",
    });
  }
};

// ======================================================
// GET CUSTOMER STATISTICS - ADMIN
// GET /api/v1/users/admin/statistics
// ======================================================

export const adminGetUserStatistics =
  async (req, res) => {
    try {
      const thirtyDaysAgo =
        new Date(
          Date.now() -
            30 *
              24 *
              60 *
              60 *
              1000
        );

      const [
        totalCustomers,
        activeCustomers,
        blockedCustomers,
        verifiedCustomers,
        unverifiedCustomers,
        recentCustomers,
      ] = await Promise.all([
        User.countDocuments({
          role: "user",
        }),

        User.countDocuments({
          role: "user",
          isActive: true,
        }),

        User.countDocuments({
          role: "user",
          isActive: false,
        }),

        User.countDocuments({
          role: "user",
          isVerified: true,
        }),

        User.countDocuments({
          role: "user",
          isVerified: false,
        }),

        User.countDocuments({
          role: "user",
          createdAt: {
            $gte: thirtyDaysAgo,
          },
        }),
      ]);

      disableCache(res);

      return res.status(200).json({
        success: true,

        statistics: {
          totalCustomers,
          activeCustomers,
          blockedCustomers,
          verifiedCustomers,
          unverifiedCustomers,
          recentCustomers,
        },
      });
    } catch (error) {
      console.error(
        "Admin User Statistics Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch customer statistics.",
      });
    }
  };

// ======================================================
// VERIFY CUSTOMER
// PATCH /api/v1/users/admin/:id/verify
// ======================================================

export const adminVerifyUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid customer ID.",
      });
    }

    const user =
      await User.findOne({
        _id: id,
        role: "user",
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Customer not found.",
      });
    }

    user.isVerified = true;

    await user.save();

    disableCache(res);

    return res.status(200).json({
      success: true,
      message:
        "Customer verified successfully.",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isVerified:
          user.isVerified,
        isActive:
          user.isActive,
        createdAt:
          user.createdAt,
        updatedAt:
          user.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Admin Verify User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to verify customer.",
    });
  }
};

// ======================================================
// BLOCK CUSTOMER
// PATCH /api/v1/users/admin/:id/block
// ======================================================

export const adminBlockUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid customer ID.",
      });
    }

    const user =
      await User.findOne({
        _id: id,
        role: "user",
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Customer not found.",
      });
    }

    user.isActive = false;

    await user.save();

    disableCache(res);

    return res.status(200).json({
      success: true,
      message:
        "Customer blocked successfully.",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isVerified:
          user.isVerified,
        isActive:
          user.isActive,
      },
    });
  } catch (error) {
    console.error(
      "Admin Block User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to block customer.",
    });
  }
};

// ======================================================
// UNBLOCK CUSTOMER
// PATCH /api/v1/users/admin/:id/unblock
// ======================================================

export const adminUnblockUser =
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid customer ID.",
        });
      }

      const user =
        await User.findOne({
          _id: id,
          role: "user",
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "Customer not found.",
        });
      }

      user.isActive = true;

      await user.save();

      disableCache(res);

      return res.status(200).json({
        success: true,
        message:
          "Customer unblocked successfully.",

        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
          isVerified:
            user.isVerified,
          isActive:
            user.isActive,
        },
      });
    } catch (error) {
      console.error(
        "Admin Unblock User Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to unblock customer.",
      });
    }
  };

// ======================================================
// UPDATE CUSTOMER - ADMIN
// PUT /api/v1/users/admin/:id
// ======================================================

export const adminUpdateUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid customer ID.",
      });
    }

    const user =
      await User.findOne({
        _id: id,
        role: "user",
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Customer not found.",
      });
    }

    // NAME
    if (req.body.name !== undefined) {
      const name =
        String(
          req.body.name
        ).trim();

      if (
        name.length < 2 ||
        name.length > 50
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name must be between 2 and 50 characters.",
        });
      }

      user.name = name;
    }

    // EMAIL
    if (req.body.email !== undefined) {
      const email =
        String(
          req.body.email
        )
          .trim()
          .toLowerCase();

      if (!email) {
        return res.status(400).json({
          success: false,
          message:
            "Email cannot be empty.",
        });
      }

      const existingEmail =
        await User.findOne({
          email,
          _id: {
            $ne: id,
          },
        });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message:
            "Email is already in use.",
        });
      }

      user.email = email;
    }

    // PHONE
    if (req.body.phone !== undefined) {
      const phone =
        String(
          req.body.phone
        ).trim();

      if (!phone) {
        return res.status(400).json({
          success: false,
          message:
            "Phone number cannot be empty.",
        });
      }

      const existingPhone =
        await User.findOne({
          phone,
          _id: {
            $ne: id,
          },
        });

      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message:
            "Phone number is already in use.",
        });
      }

      user.phone = phone;
    }

    // AVATAR
    if (req.body.avatar !== undefined) {
      user.avatar =
        String(
          req.body.avatar || ""
        ).trim();
    }

    // CUSTOMER MUST REMAIN CUSTOMER
    user.role = "user";

    await user.save();

    disableCache(res);

    return res.status(200).json({
      success: true,
      message:
        "Customer updated successfully.",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isVerified:
          user.isVerified,
        isActive:
          user.isActive,
        createdAt:
          user.createdAt,
        updatedAt:
          user.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Admin Update User Error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Email or phone number already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to update customer.",
    });
  }
};

// ======================================================
// DELETE CUSTOMER - ADMIN
// DELETE /api/v1/users/admin/:id
// ======================================================

export const adminDeleteUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid customer ID.",
      });
    }

    const user =
      await User.findOne({
        _id: id,
        role: "user",
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Customer not found.",
      });
    }

    await User.deleteOne({
      _id: id,
      role: "user",
    });

    await BankAccount.deleteOne({
      user: id,
    });

    await UpiAccount.deleteOne({
      user: id,
    });

    disableCache(res);

    return res.status(200).json({
      success: true,
      message:
        "Customer deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Admin Delete User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete customer.",
    });
  }
};

// ======================================================
// GET CURRENT USER
// GET /api/v1/users/me
// ======================================================

export const getMe = async (
  req,
  res
) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const user =
      await User.findById(
        req.user._id
      )
        .select("-password")
        .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    disableCache(res);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "Get Me Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch user.",
    });
  }
};

// ======================================================
// GET MY BANK DETAILS
// GET /api/v1/users/me/bank-details
// ======================================================

export const getMyBankDetails =
  async (req, res) => {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }

      const bankDetails =
        await BankAccount.findOne({
          user: req.user._id,
        }).lean();

      // IMPORTANT:
      // Prevent 304 response
      disableCache(res);

      return res.status(200).json({
        success: true,
        bankDetails:
          bankDetails || null,
      });
    } catch (error) {
      console.error(
        "Get My Bank Details Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch bank details.",
      });
    }
  };

// ======================================================
// UPDATE MY BANK DETAILS
// PUT /api/v1/users/me/bank-details
// ======================================================

export const updateMyBankDetails =
  async (req, res) => {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }

      const {
        accountHolder,
        bankName,
        accountNumber,
        ifsc,
        branch,
      } = req.body;

      if (
        !accountHolder ||
        !bankName ||
        !accountNumber ||
        !ifsc
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Account holder, bank name, account number and IFSC are required.",
        });
      }

      const normalizedAccountHolder =
        String(
          accountHolder
        ).trim();

      const normalizedBankName =
        String(
          bankName
        ).trim();

      const normalizedAccountNumber =
        String(
          accountNumber
        ).trim();

      const normalizedIfsc =
        String(ifsc)
          .trim()
          .toUpperCase();

      const normalizedBranch =
        String(
          branch || ""
        ).trim();

      if (
        normalizedAccountHolder.length <
        2
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid account holder name.",
        });
      }

      if (
        normalizedAccountNumber.length <
        6
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid account number.",
        });
      }

      const ifscRegex =
        /^[A-Z]{4}0[A-Z0-9]{6}$/;

      if (
        !ifscRegex.test(
          normalizedIfsc
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid IFSC code.",
        });
      }

      const bankDetails =
        await BankAccount.findOneAndUpdate(
          {
            user: req.user._id,
          },
          {
            $set: {
              user: req.user._id,
              accountHolder:
                normalizedAccountHolder,
              bankName:
                normalizedBankName,
              accountNumber:
                normalizedAccountNumber,
              ifsc:
                normalizedIfsc,
              branch:
                normalizedBranch,
            },
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
          }
        ).lean();

      disableCache(res);

      return res.status(200).json({
        success: true,
        message:
          "Bank details updated successfully.",
        bankDetails,
      });
    } catch (error) {
      console.error(
        "Update My Bank Details Error:",
        error
      );

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message:
            "Bank details already exist for this user.",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to update bank details.",
      });
    }
  };

// ======================================================
// GET MY UPI DETAILS
// GET /api/v1/users/me/upi-details
// ======================================================

export const getMyUpiDetails =
  async (req, res) => {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }

      const upiDetails =
        await UpiAccount.findOne({
          user: req.user._id,
        }).lean();

      // IMPORTANT:
      // Prevent 304 response
      disableCache(res);

      return res.status(200).json({
        success: true,
        upiDetails:
          upiDetails || null,
      });
    } catch (error) {
      console.error(
        "Get My UPI Details Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch UPI details.",
      });
    }
  };

// ======================================================
// UPDATE MY UPI DETAILS
// PUT /api/v1/users/me/upi-details
// ======================================================

export const updateMyUpiDetails =
  async (req, res) => {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }

      const {
        upiId,
        provider,
      } = req.body;

      if (!upiId) {
        return res.status(400).json({
          success: false,
          message:
            "UPI ID is required.",
        });
      }

      const normalizedUpiId =
        String(upiId)
          .trim()
          .toLowerCase();

      const normalizedProvider =
        String(
          provider || ""
        ).trim();

      const upiRegex =
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;

      if (
        !upiRegex.test(
          normalizedUpiId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid UPI ID.",
        });
      }

      const upiDetails =
        await UpiAccount.findOneAndUpdate(
          {
            user: req.user._id,
          },
          {
            $set: {
              user: req.user._id,
              upiId:
                normalizedUpiId,
              provider:
                normalizedProvider,
            },
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
          }
        ).lean();

      disableCache(res);

      return res.status(200).json({
        success: true,
        message:
          "UPI details updated successfully.",
        upiDetails,
      });
    } catch (error) {
      console.error(
        "Update My UPI Details Error:",
        error
      );

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message:
            "UPI details already exist for this user.",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to update UPI details.",
      });
    }
  };

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default {
  adminGetAllUsers,
  adminGetSingleUser,
  adminGetUserStatistics,

  adminVerifyUser,
  adminBlockUser,
  adminUnblockUser,
  adminUpdateUser,
  adminDeleteUser,

  getMe,

  getMyBankDetails,
  updateMyBankDetails,

  getMyUpiDetails,
  updateMyUpiDetails,
};