import mongoose from "mongoose";

import Coupon from "../models/Coupon.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// ======================================================
// HELPERS
// ======================================================

const normalizeCode = (code) =>
  String(code || "")
    .trim()
    .toUpperCase();

const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

const toNumber = (value, fallback = 0) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

const roundMoney = (value) =>
  Math.round(
    (Number(value) || 0) * 100
  ) / 100;

const parseDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
};

// ======================================================
// COUPON PAYLOAD VALIDATION
// ======================================================

const validateCouponPayload = ({
  discountType,
  discountValue,
  maxDiscount,
  minOrderAmount,
  startDate,
  expiryDate,
  usageLimit,
  perUserLimit,
}) => {
  if (
    !["percentage", "fixed"].includes(
      discountType
    )
  ) {
    return "Discount type must be percentage or fixed.";
  }

  const discount = toNumber(
    discountValue,
    NaN
  );

  if (
    !Number.isFinite(discount) ||
    discount <= 0
  ) {
    return "Discount value must be greater than 0.";
  }

  if (
    discountType === "percentage" &&
    discount > 100
  ) {
    return "Percentage discount cannot be greater than 100%.";
  }

  const max = toNumber(
    maxDiscount,
    0
  );

  if (max < 0) {
    return "Maximum discount cannot be negative.";
  }

  const minimum = toNumber(
    minOrderAmount,
    0
  );

  if (minimum < 0) {
    return "Minimum order amount cannot be negative.";
  }

  const start = parseDate(startDate);
  const expiry = parseDate(expiryDate);

  if (!start || !expiry) {
    return "Start date and expiry date must be valid dates.";
  }

  if (expiry <= start) {
    return "Expiry date must be after start date.";
  }

  // Empty = unlimited
  if (
    usageLimit !== undefined &&
    usageLimit !== null &&
    usageLimit !== ""
  ) {
    const limit = Number(
      usageLimit
    );

    if (
      !Number.isInteger(limit) ||
      limit < 1
    ) {
      return "Usage limit must be at least 1.";
    }
  }

  // Empty = unlimited
  if (
    perUserLimit !== undefined &&
    perUserLimit !== null &&
    perUserLimit !== ""
  ) {
    const limit = Number(
      perUserLimit
    );

    if (
      !Number.isInteger(limit) ||
      limit < 1
    ) {
      return "Per-user limit must be at least 1.";
    }
  }

  return null;
};

// ======================================================
// VALIDATE ID ARRAY
// ======================================================

const validateIdArray = (
  values,
  fieldName
) => {
  if (
    values === undefined ||
    values === null
  ) {
    return null;
  }

  if (!Array.isArray(values)) {
    return `${fieldName} must be an array.`;
  }

  for (const id of values) {
    if (!isValidObjectId(id)) {
      return `Invalid ID in ${fieldName}.`;
    }
  }

  return null;
};

// ======================================================
// DISCOUNT CALCULATION
// ======================================================

const calculateDiscount = (
  coupon,
  subtotal
) => {
  const amount = Math.max(
    0,
    toNumber(subtotal, 0)
  );

  const minimum = toNumber(
    coupon.minOrderAmount,
    0
  );

  if (amount < minimum) {
    return 0;
  }

  let discount = 0;

  if (
    coupon.discountType ===
    "percentage"
  ) {
    discount =
      (amount *
        toNumber(
          coupon.discountValue,
          0
        )) /
      100;

    const maxDiscount =
      toNumber(
        coupon.maxDiscount,
        0
      );

    if (maxDiscount > 0) {
      discount = Math.min(
        discount,
        maxDiscount
      );
    }
  } else if (
    coupon.discountType ===
    "fixed"
  ) {
    discount = toNumber(
      coupon.discountValue,
      0
    );
  }

  discount = Math.min(
    discount,
    amount
  );

  return roundMoney(discount);
};

// ======================================================
// BASIC COUPON STATUS
// ======================================================

const getCouponStatusError = (
  coupon
) => {
  const now = new Date();

  if (!coupon.isActive) {
    return "Coupon is inactive.";
  }

  if (
    coupon.startDate &&
    now < coupon.startDate
  ) {
    return "Coupon is not active yet.";
  }

  if (
    coupon.expiryDate &&
    now > coupon.expiryDate
  ) {
    return "Coupon has expired.";
  }

  // null/undefined = unlimited
  if (
    coupon.usageLimit !== null &&
    coupon.usageLimit !== undefined &&
    coupon.usedCount >=
      coupon.usageLimit
  ) {
    return "Coupon usage limit has been reached.";
  }

  return null;
};

// ======================================================
// USER ELIGIBILITY
//
// IMPORTANT PERFORMANCE FIX
// ======================================================
//
// Previous code used:
//
// Order.exists()
// Order.countDocuments()
//
// sequentially.
//
// Now:
// - first-order check + per-user check run together
// - perUserLimit=1 uses exists()
// - higher limits only count when necessary
//
// ======================================================

const checkUserEligibility = async (
  coupon,
  userId
) => {
  // ----------------------------------------------------
  // Specific users
  // ----------------------------------------------------

  if (
    Array.isArray(
      coupon.allowedUsers
    ) &&
    coupon.allowedUsers.length > 0
  ) {
    const allowed =
      coupon.allowedUsers.some(
        (id) =>
          id.toString() ===
          userId.toString()
      );

    if (!allowed) {
      return "You are not eligible to use this coupon.";
    }
  }

  // ----------------------------------------------------
  // Build required queries
  // ----------------------------------------------------

  const checks = [];

  // First order only
  if (coupon.firstOrderOnly) {
    checks.push(
      Order.exists({
        user: userId,
        status: {
          $nin: [
            "Cancelled",
            "Returned",
          ],
        },
      }).then((existingOrder) => {
        if (existingOrder) {
          return "This coupon is valid only for your first order.";
        }

        return null;
      })
    );
  }

  // Per-user usage
  const perUserLimit = Number(
    coupon.perUserLimit
  );

  if (
    Number.isFinite(
      perUserLimit
    ) &&
    perUserLimit > 0
  ) {
    // Most coupons use limit 1.
    // exists() is much cheaper than countDocuments().
    if (perUserLimit === 1) {
      checks.push(
        Order.exists({
          user: userId,
          "coupon.code":
            coupon.code,
          status: {
            $nin: [
              "Cancelled",
              "Returned",
            ],
          },
        }).then((used) => {
          if (used) {
            return "You have already reached the usage limit for this coupon.";
          }

          return null;
        })
      );
    } else {
      checks.push(
        Order.countDocuments({
          user: userId,
          "coupon.code":
            coupon.code,
          status: {
            $nin: [
              "Cancelled",
              "Returned",
            ],
          },
        }).then((usedByUser) => {
          if (
            usedByUser >=
            perUserLimit
          ) {
            return "You have already reached the usage limit for this coupon.";
          }

          return null;
        })
      );
    }
  }

  if (checks.length === 0) {
    return null;
  }

  // Run checks simultaneously
  const results =
    await Promise.all(checks);

  return (
    results.find(Boolean) ||
    null
  );
};

// ======================================================
// CART PRODUCT / CATEGORY ELIGIBILITY
// ======================================================

const checkCartEligibility = async (
  coupon,
  cart
) => {
  const hasProductRestriction =
    Array.isArray(
      coupon.applicableProducts
    ) &&
    coupon.applicableProducts.length >
      0;

  const hasCategoryRestriction =
    Array.isArray(
      coupon.applicableCategories
    ) &&
    coupon.applicableCategories.length >
      0;

  // No restrictions
  if (
    !hasProductRestriction &&
    !hasCategoryRestriction
  ) {
    return {
      valid: true,
      eligibleSubtotal:
        roundMoney(
          cart.subtotal
        ),
    };
  }

  const cartItems =
    Array.isArray(cart.items)
      ? cart.items
      : [];

  if (cartItems.length === 0) {
    return {
      valid: false,
      message: "Cart is empty.",
    };
  }

  // ----------------------------------------------------
  // Product IDs
  // ----------------------------------------------------

  const productIds =
    cartItems
      .map((item) => {
        const product =
          item.product ||
          item.productId;

        if (
          product &&
          typeof product ===
            "object" &&
          product._id
        ) {
          return product._id;
        }

        return product;
      })
      .filter(Boolean);

  if (productIds.length === 0) {
    return {
      valid: false,
      message:
        "Unable to determine products in your cart.",
    };
  }

  // ----------------------------------------------------
  // Fetch only fields we need
  // ----------------------------------------------------

  const products =
    await Product.find({
      _id: {
        $in: productIds,
      },
    })
      .select(
        "_id category categories price salePrice"
      )
      .lean();

  const productMap =
    new Map(
      products.map((product) => [
        product._id.toString(),
        product,
      ])
    );

  const applicableProductIds =
    new Set(
      (
        coupon.applicableProducts ||
        []
      ).map((id) =>
        id.toString()
      )
    );

  const applicableCategoryIds =
    new Set(
      (
        coupon.applicableCategories ||
        []
      ).map((id) =>
        id.toString()
      )
    );

  let eligibleSubtotal = 0;

  for (const item of cartItems) {
    const rawProduct =
      item.product ||
      item.productId;

    const productId =
      rawProduct &&
      typeof rawProduct ===
        "object"
        ? rawProduct._id
        : rawProduct;

    if (!productId) continue;

    const product =
      productMap.get(
        productId.toString()
      );

    if (!product) continue;

    let eligible = false;

    // Product restriction
    if (
      hasProductRestriction &&
      applicableProductIds.has(
        product._id.toString()
      )
    ) {
      eligible = true;
    }

    // Category restriction
    if (
      hasCategoryRestriction
    ) {
      const categories = [];

      if (product.category) {
        categories.push(
          product.category.toString()
        );
      }

      if (
        Array.isArray(
          product.categories
        )
      ) {
        for (const category of
          product.categories) {
          categories.push(
            category.toString()
          );
        }
      }

      if (
        categories.some(
          (categoryId) =>
            applicableCategoryIds.has(
              categoryId
            )
        )
      ) {
        eligible = true;
      }
    }

    if (!eligible) continue;

    const price = Number(
      item.price ??
        product.salePrice ??
        product.price ??
        0
    );

    const quantity = Number(
      item.quantity || 0
    );

    eligibleSubtotal +=
      price * quantity;
  }

  eligibleSubtotal =
    roundMoney(
      eligibleSubtotal
    );

  if (
    eligibleSubtotal <= 0
  ) {
    return {
      valid: false,
      message:
        "This coupon is not applicable to the products in your cart.",
    };
  }

  return {
    valid: true,
    eligibleSubtotal,
  };
};

// ======================================================
// CREATE COUPON
// ======================================================

export const createCoupon =
  async (req, res) => {
    try {
      const {
        code,
        title,
        description,
        discountType,
        discountValue,
        maxDiscount,
        minOrderAmount,
        startDate,
        expiryDate,
        usageLimit,
        perUserLimit,
        applicableCategories,
        applicableProducts,
        allowedUsers,
        firstOrderOnly,
      } = req.body;

      if (!code?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Coupon code is required.",
        });
      }

      if (!title?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Coupon title is required.",
        });
      }

      if (!discountType) {
        return res.status(400).json({
          success: false,
          message:
            "Discount type is required.",
        });
      }

      if (
        discountValue ===
          undefined ||
        discountValue === null ||
        discountValue === ""
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Discount value is required.",
        });
      }

      if (
        !startDate ||
        !expiryDate
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Start date and expiry date are required.",
        });
      }

      const validationError =
        validateCouponPayload({
          discountType,
          discountValue,
          maxDiscount,
          minOrderAmount,
          startDate,
          expiryDate,
          usageLimit,
          perUserLimit,
        });

      if (validationError) {
        return res.status(400).json({
          success: false,
          message:
            validationError,
        });
      }

      const categoryError =
        validateIdArray(
          applicableCategories,
          "applicableCategories"
        );

      if (categoryError) {
        return res.status(400).json({
          success: false,
          message: categoryError,
        });
      }

      const productError =
        validateIdArray(
          applicableProducts,
          "applicableProducts"
        );

      if (productError) {
        return res.status(400).json({
          success: false,
          message: productError,
        });
      }

      const userError =
        validateIdArray(
          allowedUsers,
          "allowedUsers"
        );

      if (userError) {
        return res.status(400).json({
          success: false,
          message: userError,
        });
      }

      const normalizedCode =
        normalizeCode(code);

      const existingCoupon =
        await Coupon.findOne({
          code: normalizedCode,
        })
          .select("_id")
          .lean();

      if (existingCoupon) {
        return res.status(409).json({
          success: false,
          message:
            "Coupon code already exists.",
        });
      }

      const coupon =
        await Coupon.create({
          code: normalizedCode,

          title: title.trim(),

          description:
            String(
              description || ""
            ).trim(),

          discountType,

          discountValue:
            toNumber(
              discountValue
            ),

          maxDiscount:
            discountType ===
            "percentage"
              ? toNumber(
                  maxDiscount,
                  0
                )
              : 0,

          minOrderAmount:
            toNumber(
              minOrderAmount,
              0
            ),

          startDate:
            parseDate(
              startDate
            ),

          expiryDate:
            parseDate(
              expiryDate
            ),

          // Empty = unlimited
          usageLimit:
            usageLimit ===
                null ||
            usageLimit ===
                undefined ||
            usageLimit === ""
              ? null
              : Number(
                  usageLimit
                ),

          usedCount: 0,

          // Empty = unlimited
          perUserLimit:
            perUserLimit ===
                null ||
            perUserLimit ===
                undefined ||
            perUserLimit === ""
              ? null
              : Number(
                  perUserLimit
                ),

          applicableCategories:
            Array.isArray(
              applicableCategories
            )
              ? applicableCategories
              : [],

          applicableProducts:
            Array.isArray(
              applicableProducts
            )
              ? applicableProducts
              : [],

          allowedUsers:
            Array.isArray(
              allowedUsers
            )
              ? allowedUsers
              : [],

          firstOrderOnly:
            Boolean(
              firstOrderOnly
            ),

          isActive: true,
        });

      return res.status(201).json({
        success: true,
        message:
          "Coupon created successfully.",
        coupon,
      });
    } catch (error) {
      console.error(
        "Create Coupon Error:",
        error
      );

      if (
        error?.code === 11000
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Coupon code already exists.",
        });
      }

      if (
        error?.name ===
        "ValidationError"
      ) {
        return res.status(400).json({
          success: false,
          message:
            Object.values(
              error.errors
            )
              .map(
                (err) =>
                  err.message
              )
              .join(" "),
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to create coupon.",
        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

// ======================================================
// UPDATE COUPON
// ======================================================

export const updateCoupon =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid coupon ID.",
        });
      }

      const coupon =
        await Coupon.findById(id);

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message:
            "Coupon not found.",
        });
      }

      const {
        code,
        title,
        description,
        discountType,
        discountValue,
        maxDiscount,
        minOrderAmount,
        startDate,
        expiryDate,
        usageLimit,
        perUserLimit,
        applicableCategories,
        applicableProducts,
        allowedUsers,
        firstOrderOnly,
        isActive,
      } = req.body;

      const finalDiscountType =
        discountType !==
        undefined
          ? discountType
          : coupon.discountType;

      const finalDiscountValue =
        discountValue !==
        undefined
          ? discountValue
          : coupon.discountValue;

      const finalMaxDiscount =
        maxDiscount !==
        undefined
          ? maxDiscount
          : coupon.maxDiscount;

      const finalMinOrderAmount =
        minOrderAmount !==
        undefined
          ? minOrderAmount
          : coupon.minOrderAmount;

      const finalStartDate =
        startDate !==
        undefined
          ? startDate
          : coupon.startDate;

      const finalExpiryDate =
        expiryDate !==
        undefined
          ? expiryDate
          : coupon.expiryDate;

      const finalUsageLimit =
        usageLimit !==
        undefined
          ? usageLimit
          : coupon.usageLimit;

      const finalPerUserLimit =
        perUserLimit !==
        undefined
          ? perUserLimit
          : coupon.perUserLimit;

      const validationError =
        validateCouponPayload({
          discountType:
            finalDiscountType,
          discountValue:
            finalDiscountValue,
          maxDiscount:
            finalMaxDiscount,
          minOrderAmount:
            finalMinOrderAmount,
          startDate:
            finalStartDate,
          expiryDate:
            finalExpiryDate,
          usageLimit:
            finalUsageLimit,
          perUserLimit:
            finalPerUserLimit,
        });

      if (validationError) {
        return res.status(400).json({
          success: false,
          message:
            validationError,
        });
      }

      const categoryError =
        validateIdArray(
          applicableCategories,
          "applicableCategories"
        );

      if (categoryError) {
        return res.status(400).json({
          success: false,
          message: categoryError,
        });
      }

      const productError =
        validateIdArray(
          applicableProducts,
          "applicableProducts"
        );

      if (productError) {
        return res.status(400).json({
          success: false,
          message: productError,
        });
      }

      const userError =
        validateIdArray(
          allowedUsers,
          "allowedUsers"
        );

      if (userError) {
        return res.status(400).json({
          success: false,
          message: userError,
        });
      }

      if (
        code !== undefined
      ) {
        const normalizedCode =
          normalizeCode(code);

        if (!normalizedCode) {
          return res.status(400).json({
            success: false,
            message:
              "Coupon code cannot be empty.",
          });
        }

        if (
          normalizedCode !==
          coupon.code
        ) {
          const existing =
            await Coupon.findOne({
              code: normalizedCode,
              _id: {
                $ne: id,
              },
            })
              .select("_id")
              .lean();

          if (existing) {
            return res.status(409).json({
              success: false,
              message:
                "Coupon code already exists.",
            });
          }

          coupon.code =
            normalizedCode;
        }
      }

      if (
        title !== undefined
      ) {
        if (
          !String(title).trim()
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Coupon title cannot be empty.",
          });
        }

        coupon.title =
          String(title).trim();
      }

      if (
        description !==
        undefined
      ) {
        coupon.description =
          String(
            description || ""
          ).trim();
      }

      coupon.discountType =
        finalDiscountType;

      coupon.discountValue =
        toNumber(
          finalDiscountValue
        );

      coupon.maxDiscount =
        finalDiscountType ===
        "percentage"
          ? toNumber(
              finalMaxDiscount,
              0
            )
          : 0;

      coupon.minOrderAmount =
        toNumber(
          finalMinOrderAmount,
          0
        );

      coupon.startDate =
        parseDate(
          finalStartDate
        );

      coupon.expiryDate =
        parseDate(
          finalExpiryDate
        );

      coupon.usageLimit =
        finalUsageLimit ===
            null ||
        finalUsageLimit ===
            undefined ||
        finalUsageLimit === ""
          ? null
          : Number(
              finalUsageLimit
            );

      coupon.perUserLimit =
        finalPerUserLimit ===
            null ||
        finalPerUserLimit ===
            undefined ||
        finalPerUserLimit === ""
          ? null
          : Number(
              finalPerUserLimit
            );

      if (
        applicableCategories !==
        undefined
      ) {
        coupon.applicableCategories =
          applicableCategories;
      }

      if (
        applicableProducts !==
        undefined
      ) {
        coupon.applicableProducts =
          applicableProducts;
      }

      if (
        allowedUsers !==
        undefined
      ) {
        coupon.allowedUsers =
          allowedUsers;
      }

      if (
        firstOrderOnly !==
        undefined
      ) {
        coupon.firstOrderOnly =
          Boolean(
            firstOrderOnly
          );
      }

      if (
        isActive !==
        undefined
      ) {
        coupon.isActive =
          Boolean(isActive);
      }

      if (
        coupon.usageLimit !==
          null &&
        coupon.usedCount >
          coupon.usageLimit
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Usage limit cannot be less than the number of times this coupon has already been used.",
        });
      }

      await coupon.save();

      return res.status(200).json({
        success: true,
        message:
          "Coupon updated successfully.",
        coupon,
      });
    } catch (error) {
      console.error(
        "Update Coupon Error:",
        error
      );

      if (
        error?.code === 11000
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Coupon code already exists.",
        });
      }

      if (
        error?.name ===
        "ValidationError"
      ) {
        return res.status(400).json({
          success: false,
          message:
            Object.values(
              error.errors
            )
              .map(
                (err) =>
                  err.message
              )
              .join(" "),
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to update coupon.",
        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

// ======================================================
// DELETE COUPON
// ======================================================

export const deleteCoupon =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid coupon ID.",
        });
      }

      const coupon =
        await Coupon.findById(id);

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message:
            "Coupon not found.",
        });
      }

      await coupon.deleteOne();

      return res.status(200).json({
        success: true,
        message:
          "Coupon deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete Coupon Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete coupon.",
        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

// ======================================================
// GET ALL COUPONS
// ======================================================

export const getAllCoupons =
  async (req, res) => {
    try {
      let page =
        Number(req.query.page) || 1;

      let limit =
        Number(req.query.limit) || 10;

      page = Math.max(
        1,
        Math.floor(page)
      );

      limit = Math.min(
        100,
        Math.max(
          1,
          Math.floor(limit)
        )
      );

      const skip =
        (page - 1) * limit;

      const search =
        String(
          req.query.search || ""
        ).trim();

      const isActive =
        req.query.isActive;

      const status =
        req.query.status;

      const sort =
        String(
          req.query.sort ||
            "-createdAt"
        );

      const filter = {};

      if (search) {
        filter.$or = [
          {
            code: {
              $regex: search,
              $options: "i",
            },
          },
          {
            title: {
              $regex: search,
              $options: "i",
            },
          },
          {
            description: {
              $regex: search,
              $options: "i",
            },
          },
        ];
      }

      if (
        isActive !==
        undefined
      ) {
        filter.isActive =
          isActive === "true";
      }

      const now = new Date();

      if (status === "active") {
        filter.isActive = true;

        filter.startDate = {
          $lte: now,
        };

        filter.expiryDate = {
          $gte: now,
        };

        filter.$expr = {
          $or: [
            {
              $eq: [
                "$usageLimit",
                null,
              ],
            },
            {
              $lt: [
                "$usedCount",
                "$usageLimit",
              ],
            },
          ],
        };
      }

      if (status === "expired") {
        filter.expiryDate = {
          $lt: now,
        };
      }

      if (status === "upcoming") {
        filter.startDate = {
          $gt: now,
        };
      }

      if (status === "inactive") {
        filter.isActive = false;
      }

      if (status === "used-up") {
        filter.usageLimit = {
          $ne: null,
        };

        filter.$expr = {
          $gte: [
            "$usedCount",
            "$usageLimit",
          ],
        };
      }

      const allowedSortFields = [
        "createdAt",
        "updatedAt",
        "code",
        "title",
        "startDate",
        "expiryDate",
        "usedCount",
        "usageLimit",
      ];

      let sortField =
        "createdAt";

      let sortDirection = -1;

      if (sort.startsWith("-")) {
        const field =
          sort.slice(1);

        if (
          allowedSortFields.includes(
            field
          )
        ) {
          sortField = field;
          sortDirection = -1;
        }
      } else if (
        allowedSortFields.includes(
          sort
        )
      ) {
        sortField = sort;
        sortDirection = 1;
      }

      const [
        coupons,
        total,
      ] = await Promise.all([
        Coupon.find(filter)
          .sort({
            [sortField]:
              sortDirection,
          })
          .skip(skip)
          .limit(limit),

        Coupon.countDocuments(
          filter
        ),
      ]);

      const totalPages =
        Math.ceil(
          total / limit
        );

      return res.status(200).json({
        success: true,
        totalCoupons: total,
        currentPage: page,
        totalPages,
        coupons,
        pagination: {
          currentPage: page,
          totalPages,
          totalCoupons: total,
          hasNextPage:
            page < totalPages,
          hasPrevPage:
            page > 1,
        },
      });
    } catch (error) {
      console.error(
        "Get All Coupons Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch coupons.",
        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

// ======================================================
// GET COUPON BY ID
// ======================================================

export const getCouponById =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid coupon ID.",
        });
      }

      const coupon =
        await Coupon.findById(id);

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message:
            "Coupon not found.",
        });
      }

      return res.status(200).json({
        success: true,
        coupon,
      });
    } catch (error) {
      console.error(
        "Get Coupon By ID Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch coupon.",
        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

// ======================================================
// APPLY COUPON
// ======================================================

export const applyCoupon =
  async (req, res) => {
    try {
      const code =
        normalizeCode(
          req.body?.code
        );

      if (!code) {
        return res.status(400).json({
          success: false,
          message:
            "Coupon code is required.",
        });
      }

      const userId =
        req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }

      // ------------------------------------------------
      // Find coupon
      // ------------------------------------------------

      const coupon =
        await Coupon.findOne({
          code,
        });

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message:
            "Invalid coupon code.",
        });
      }

      // ------------------------------------------------
      // Basic status
      // ------------------------------------------------

      const statusError =
        getCouponStatusError(
          coupon
        );

      if (statusError) {
        return res.status(400).json({
          success: false,
          message: statusError,
        });
      }

      // ------------------------------------------------
      // Cart can be loaded together with user checks
      // ------------------------------------------------

      const [
        userError,
        cart,
      ] = await Promise.all([
        checkUserEligibility(
          coupon,
          userId
        ),

        Cart.findOne({
          user: userId,
        }),
      ]);

      if (userError) {
        return res.status(400).json({
          success: false,
          message: userError,
        });
      }

      if (
        !cart ||
        !Array.isArray(
          cart.items
        ) ||
        cart.items.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Cart is empty.",
        });
      }

      // ------------------------------------------------
      // Subtotal
      // ------------------------------------------------

      const subtotal =
        roundMoney(
          cart.subtotal
        );

      if (subtotal <= 0) {
        return res.status(400).json({
          success: false,
          message:
            "Cart subtotal must be greater than 0.",
        });
      }

      // ------------------------------------------------
      // Product/category eligibility
      // ------------------------------------------------

      const eligibility =
        await checkCartEligibility(
          coupon,
          cart
        );

      if (!eligibility.valid) {
        return res.status(400).json({
          success: false,
          message:
            eligibility.message,
        });
      }

      const eligibleSubtotal =
        roundMoney(
          eligibility.eligibleSubtotal
        );

      // ------------------------------------------------
      // Minimum order
      // ------------------------------------------------

      const minOrderAmount =
        toNumber(
          coupon.minOrderAmount,
          0
        );

      if (
        eligibleSubtotal <
        minOrderAmount
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Minimum eligible order amount should be ₹${minOrderAmount}.`,
        });
      }

      // ------------------------------------------------
      // Calculate discount
      // ------------------------------------------------

      const discount =
        calculateDiscount(
          coupon,
          eligibleSubtotal
        );

      if (discount <= 0) {
        return res.status(400).json({
          success: false,
          message:
            "Coupon does not provide a valid discount for this cart.",
        });
      }

      // ------------------------------------------------
      // Save coupon
      // ------------------------------------------------

      cart.coupon = {
        code: coupon.code,
        discountAmount:
          discount,
      };

      await cart.save();

      const totalBeforeOtherCharges =
        roundMoney(
          subtotal - discount
        );

      return res.status(200).json({
        success: true,

        message:
          "Coupon applied successfully.",

        coupon: {
          id: coupon._id,
          code: coupon.code,
          title: coupon.title,
          description:
            coupon.description,

          discountType:
            coupon.discountType,

          discountValue:
            coupon.discountValue,

          discountAmount:
            discount,

          maxDiscount:
            coupon.maxDiscount,

          minOrderAmount:
            coupon.minOrderAmount,

          eligibleSubtotal,

          expiryDate:
            coupon.expiryDate,
        },

        cartSummary: {
          subtotal,

          eligibleSubtotal,

          discount,

          totalBeforeOtherCharges,
        },
      });
    } catch (error) {
      console.error(
        "Apply Coupon Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to apply coupon.",
        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

// ======================================================
// REMOVE COUPON
// ======================================================

export const removeCoupon =
  async (req, res) => {
    try {
      const userId =
        req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }

      const cart =
        await Cart.findOne({
          user: userId,
        });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message:
            "Cart not found.",
        });
      }

      // ------------------------------------------------
      // IMPORTANT:
      // Removing an already removed coupon is NOT an error.
      // ------------------------------------------------

      if (!cart.coupon?.code) {
        const subtotal =
          roundMoney(
            cart.subtotal
          );

        return res.status(200).json({
          success: true,
          message:
            "No coupon was applied.",
          alreadyRemoved: true,
          cartSummary: {
            subtotal,
            discount: 0,
            totalBeforeOtherCharges:
              subtotal,
          },
        });
      }

      cart.coupon = {
        code: "",
        discountAmount: 0,
      };

      await cart.save();

      const subtotal =
        roundMoney(
          cart.subtotal
        );

      return res.status(200).json({
        success: true,

        message:
          "Coupon removed successfully.",

        cartSummary: {
          subtotal,
          discount: 0,
          totalBeforeOtherCharges:
            subtotal,
        },
      });
    } catch (error) {
      console.error(
        "Remove Coupon Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to remove coupon.",
        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

// ======================================================
// TOGGLE COUPON STATUS
// ======================================================

export const toggleCouponStatus =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid coupon ID.",
        });
      }

      const coupon =
        await Coupon.findById(id);

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message:
            "Coupon not found.",
        });
      }

      coupon.isActive =
        !coupon.isActive;

      await coupon.save();

      return res.status(200).json({
        success: true,

        message:
          coupon.isActive
            ? "Coupon activated successfully."
            : "Coupon deactivated successfully.",

        coupon,
      });
    } catch (error) {
      console.error(
        "Toggle Coupon Status Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update coupon status.",
        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

// ======================================================
// GET ACTIVE COUPONS
// ======================================================

export const getActiveCoupons =
  async (req, res) => {
    try {
      const now = new Date();

      const coupons =
        await Coupon.find({
          isActive: true,

          startDate: {
            $lte: now,
          },

          expiryDate: {
            $gte: now,
          },

          $or: [
            {
              usageLimit: null,
            },
            {
              $expr: {
                $lt: [
                  "$usedCount",
                  "$usageLimit",
                ],
              },
            },
          ],
        })
          .select(
            "-allowedUsers -applicableProducts -applicableCategories"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,

        totalCoupons:
          coupons.length,

        coupons,
      });
    } catch (error) {
      console.error(
        "Get Active Coupons Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch active coupons.",
        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

// ======================================================
// VALIDATE COUPON
// ======================================================

export const validateCoupon =
  async (req, res) => {
    try {
      const code =
        normalizeCode(
          req.body?.code
        );

      if (!code) {
        return res.status(400).json({
          success: false,
          message:
            "Coupon code is required.",
        });
      }

      const userId =
        req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }

      const coupon =
        await Coupon.findOne({
          code,
        });

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message:
            "Coupon not found.",
        });
      }

      const statusError =
        getCouponStatusError(
          coupon
        );

      if (statusError) {
        return res.status(400).json({
          success: false,
          message: statusError,
        });
      }

      const userError =
        await checkUserEligibility(
          coupon,
          userId
        );

      if (userError) {
        return res.status(400).json({
          success: false,
          message: userError,
        });
      }

      const remainingUsage =
        coupon.usageLimit ===
          null ||
        coupon.usageLimit ===
          undefined
          ? null
          : Math.max(
              0,
              coupon.usageLimit -
                coupon.usedCount
            );

      return res.status(200).json({
        success: true,

        message:
          "Coupon is valid.",

        coupon: {
          id: coupon._id,

          code: coupon.code,

          title: coupon.title,

          description:
            coupon.description,

          discountType:
            coupon.discountType,

          discountValue:
            coupon.discountValue,

          maxDiscount:
            coupon.maxDiscount,

          minOrderAmount:
            coupon.minOrderAmount,

          expiryDate:
            coupon.expiryDate,

          firstOrderOnly:
            coupon.firstOrderOnly,

          perUserLimit:
            coupon.perUserLimit,

          remainingUsage,
        },
      });
    } catch (error) {
      console.error(
        "Validate Coupon Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to validate coupon.",
        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };