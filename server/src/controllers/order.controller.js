import mongoose from "mongoose";

import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import Coupon from "../models/Coupon.js";

// ======================================================
// HELPERS
// ======================================================

// Validate Mongo ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ======================================================
// GENERATE ORDER NUMBER
// ======================================================

const generateOrderNumber = () => {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  const random = Math.floor(
    1000 + Math.random() * 9000
  );

  return `FS${year}${month}${day}${random}`;
};

// ======================================================
// GET PRODUCT SELLING PRICE
// ======================================================

const getSellingPrice = (product) => {
  if (
    product.discountPrice !== null &&
    product.discountPrice !== undefined
  ) {
    return Number(product.discountPrice);
  }

  return Number(product.price);
};

// ======================================================
// NORMALIZE SIZE
// ======================================================

const normalizeSize = (size = "") => {
  return String(size)
    .trim()
    .toUpperCase();
};

// ======================================================
// NORMALIZE COLOR
// ======================================================

const normalizeColor = (color = "") => {
  return String(color).trim();
};

// ======================================================
// CALCULATE SHIPPING
// ======================================================

const calculateShipping = (subtotal) => {
  // Free Delivery Above ₹999
  if (subtotal >= 999) {
    return 0;
  }

  return 99;
};

// ======================================================
// CALCULATE TAX
// ======================================================

const calculateTax = () => {
  // Current project pricing uses no additional tax.
  return 0;
};

// ======================================================
// CREATE ADDRESS SNAPSHOT
// ======================================================

const createAddressSnapshot = (address) => {
  return {
    fullName:
      address.fullName,

    phone:
      address.phone,

    alternatePhone:
      address.alternatePhone,

    label:
      address.label,

    houseNumber:
      address.houseNumber,

    area:
      address.area,

    landmark:
      address.landmark,

    city:
      address.city,

    state:
      address.state,

    country:
      address.country,

    postalCode:
      address.postalCode,

    addressType:
      address.addressType,

    deliveryInstructions:
      address.deliveryInstructions,

    location:
      address.location,
  };
};

// ======================================================
// GET AVAILABLE STOCK
// ======================================================

const getAvailableStock = (
  product,
  selectedSize = ""
) => {
  // Product With Size Variants
  if (product.sizes?.length > 0) {
    const normalizedSize =
      normalizeSize(selectedSize);

    if (!normalizedSize) {
      return {
        success: false,
        message:
          "Please select a size.",
        stock: 0,
      };
    }

    const variant =
      product.sizes.find(
        (item) =>
          normalizeSize(item.size) ===
          normalizedSize
      );

    if (!variant) {
      return {
        success: false,
        message:
          "Selected size is unavailable.",
        stock: 0,
      };
    }

    return {
      success: true,
      stock: Number(variant.stock),
    };
  }

  // Product Without Size
  return {
    success: true,
    stock: Number(product.stock),
  };
};

// ======================================================
// VALIDATE PRODUCT
// ======================================================

const validateProduct = (product) => {
  if (!product) {
    return {
      success: false,
      message:
        "Product not found.",
    };
  }

  if (!product.isActive) {
    return {
      success: false,
      message:
        "Product is unavailable.",
    };
  }

  return {
    success: true,
  };
};

// ======================================================
// VALIDATE STOCK
// ======================================================

const validateStock = (
  product,
  quantity,
  size
) => {
  const stock =
    getAvailableStock(
      product,
      size
    );

  if (!stock.success) {
    return stock;
  }

  if (stock.stock <= 0) {
    return {
      success: false,
      message:
        "Product is out of stock.",
    };
  }

  if (
    Number(quantity) >
    stock.stock
  ) {
    return {
      success: false,
      message: `Only ${stock.stock} item(s) available.`,
    };
  }

  return {
    success: true,
    stock: stock.stock,
  };
};

// ======================================================
// CREATE ORDER ITEM
// ======================================================

const createOrderItem = (
  product,
  cartItem
) => {
  const sellingPrice =
    getSellingPrice(product);

  return {
    product: product._id,

    name: product.name,

    slug: product.slug,

    brand:
      product.brand,

    image:
      product.images?.[0]?.url ||
      "",

    sku:
      product.sku || "",

    size:
      cartItem.size || "",

    color:
      normalizeColor(
        cartItem.color || ""
      ),

    quantity:
      Number(cartItem.quantity),

    price:
      sellingPrice,

    originalPrice:
      Number(product.price),

    discount:
      Math.max(
        0,
        Number(product.price) -
          sellingPrice
      ),

    total:
      sellingPrice *
      Number(cartItem.quantity),
  };
};

// ======================================================
// SERVER-SIDE COUPON VALIDATION
// ======================================================

const validateAndCalculateCoupon = async ({
  code = "",
  userId,
  subtotal,
  session,
}) => {
  const normalizedCode = String(code || "")
    .trim()
    .toUpperCase();

  // No coupon
  if (!normalizedCode) {
    return {
      success: true,
      coupon: null,
      code: "",
      discountAmount: 0,
    };
  }

  // ----------------------------------------------------
  // FIND REAL COUPON FROM DATABASE
  // ----------------------------------------------------

  const coupon =
    await Coupon.findOne({
      code: normalizedCode,
    }).session(session);

  if (!coupon) {
    return {
      success: false,
      message:
        "Invalid coupon code.",
    };
  }

  // ----------------------------------------------------
  // ACTIVE CHECK
  // ----------------------------------------------------

  if (!coupon.isActive) {
    return {
      success: false,
      message:
        "This coupon is inactive.",
    };
  }

  const now = new Date();

  // ----------------------------------------------------
  // START DATE
  // ----------------------------------------------------

  if (
    coupon.startDate &&
    now <
      new Date(
        coupon.startDate
      )
  ) {
    return {
      success: false,
      message:
        "This coupon is not active yet.",
    };
  }

  // ----------------------------------------------------
  // EXPIRY DATE
  // ----------------------------------------------------

  if (
    coupon.expiryDate &&
    now >
      new Date(
        coupon.expiryDate
      )
  ) {
    return {
      success: false,
      message:
        "This coupon has expired.",
    };
  }

  // ----------------------------------------------------
  // TOTAL USAGE LIMIT
  // ----------------------------------------------------

  if (
    coupon.usageLimit !== null &&
    coupon.usageLimit !== undefined &&
    Number(coupon.usageLimit) > 0 &&
    Number(coupon.usedCount || 0) >=
      Number(coupon.usageLimit)
  ) {
    return {
      success: false,
      message:
        "This coupon usage limit has been reached.",
    };
  }

  // ----------------------------------------------------
  // MINIMUM ORDER AMOUNT
  // ----------------------------------------------------

  if (
    Number(subtotal) <
    Number(
      coupon.minOrderAmount || 0
    )
  ) {
    return {
      success: false,
      message: `Minimum order amount for this coupon is ₹${Number(
        coupon.minOrderAmount || 0
      ).toFixed(2)}.`,
    };
  }

  // ----------------------------------------------------
  // ALLOWED USERS
  // ----------------------------------------------------

  if (
    Array.isArray(
      coupon.allowedUsers
    ) &&
    coupon.allowedUsers.length > 0
  ) {
    const isAllowed =
      coupon.allowedUsers.some(
        (allowedUser) => {
          const id =
            allowedUser?._id ||
            allowedUser;

          return (
            String(id) ===
            String(userId)
          );
        }
      );

    if (!isAllowed) {
      return {
        success: false,
        message:
          "This coupon is not available for your account.",
      };
    }
  }

  // ----------------------------------------------------
  // FIRST ORDER ONLY
  // ----------------------------------------------------

  if (coupon.firstOrderOnly) {
    const previousOrder =
      await Order.exists({
        user: userId,
      }).session(session);

    if (previousOrder) {
      return {
        success: false,
        message:
          "This coupon is valid only for your first order.",
      };
    }
  }

  // ----------------------------------------------------
  // PER USER LIMIT
  // ----------------------------------------------------

  const perUserLimit =
    Number(
      coupon.perUserLimit || 0
    );

  if (perUserLimit > 0) {
    const usedByUser =
      await Order.countDocuments({
        user: userId,

        "coupon.code":
          normalizedCode,

        "payment.status": {
          $ne: "Failed",
        },
      }).session(session);

    if (
      usedByUser >=
      perUserLimit
    ) {
      return {
        success: false,
        message:
          "You have already used this coupon the maximum allowed times.",
      };
    }
  }

  // ----------------------------------------------------
  // CALCULATE DISCOUNT
  // ----------------------------------------------------

  let discountAmount = 0;

  // Percentage
  if (
    coupon.discountType ===
    "percentage"
  ) {
    discountAmount =
      (
        Number(subtotal) *
        Number(
          coupon.discountValue || 0
        )
      ) /
      100;

    // Maximum discount
    if (
      Number(
        coupon.maxDiscount || 0
      ) > 0
    ) {
      discountAmount =
        Math.min(
          discountAmount,
          Number(
            coupon.maxDiscount
          )
        );
    }
  }

  // Fixed
  else if (
    coupon.discountType ===
    "fixed"
  ) {
    discountAmount =
      Number(
        coupon.discountValue || 0
      );
  }

  // Safety
  discountAmount =
    Math.max(
      0,
      Math.min(
        discountAmount,
        Number(subtotal)
      )
    );

  discountAmount =
    Number(
      discountAmount.toFixed(2)
    );

  // ----------------------------------------------------
  // FINAL RESULT
  // ----------------------------------------------------

  return {
    success: true,

    coupon,

    code:
      coupon.code,

    discountAmount,
  };
};

// ======================================================
// CALCULATE ORDER TOTALS
// ======================================================

const calculatePriceDetails = (
  orderItems,
  couponDiscount = 0
) => {
  const subtotal =
    orderItems.reduce(
      (total, item) =>
        total +
        Number(item.total || 0),
      0
    );

  const productDiscount =
    orderItems.reduce(
      (total, item) =>
        total +
        Number(
          item.discount || 0
        ) *
          Number(
            item.quantity || 0
          ),
      0
    );

  const shippingCharge =
    calculateShipping(
      subtotal
    );

  const tax =
    calculateTax();

  const safeCouponDiscount =
    Math.max(
      0,
      Math.min(
        Number(
          couponDiscount || 0
        ),
        subtotal
      )
    );

  const total =
    Math.max(
      0,
      subtotal +
        shippingCharge +
        tax -
        safeCouponDiscount
    );

  return {
    subtotal,

    productDiscount,

    couponDiscount:
      Number(
        safeCouponDiscount.toFixed(
          2
        )
      ),

    shippingCharge,

    tax,

    total:
      Number(
        total.toFixed(2)
      ),
  };
};

// ======================================================
// PLACE ORDER
// ======================================================

export const placeOrder = async (
  req,
  res
) => {
  const session =
    await mongoose.startSession();

  session.startTransaction();

  try {
    const userId =
      req.user.id;

    const {
      addressId,
      paymentMethod = "COD",
      customerNote = "",
      couponCode = "",
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !isValidObjectId(
        addressId
      )
    ) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message:
          "Invalid address.",
      });
    }

    // ==================================================
    // GET USER CART
    // ==================================================

    const cart =
      await Cart.findOne({
        user: userId,
      })
        .populate(
          "items.product"
        )
        .session(session);

    if (
      !cart ||
      cart.items.length === 0
    ) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message:
          "Your cart is empty.",
      });
    }

    // ==================================================
    // GET ADDRESS
    // ==================================================

    const address =
      await Address.findOne({
        _id: addressId,
        user: userId,
        isActive: true,
      }).session(session);

    if (!address) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message:
          "Address not found.",
      });
    }

    // ==================================================
    // PREPARE ORDER ITEMS
    // ==================================================

    const orderItems = [];

    for (
      const cartItem of cart.items
    ) {
      const product =
        await Product.findById(
          cartItem.product._id
        ).session(session);

      // Product Validation
      const validation =
        validateProduct(
          product
        );

      if (
        !validation.success
      ) {
        await session.abortTransaction();
        session.endSession();

        return res.status(400).json({
          success: false,
          message:
            validation.message,
        });
      }

      // Stock Validation
      const stockValidation =
        validateStock(
          product,
          cartItem.quantity,
          cartItem.size
        );

      if (
        !stockValidation.success
      ) {
        await session.abortTransaction();
        session.endSession();

        return res.status(400).json({
          success: false,
          message:
            stockValidation.message,
        });
      }

      // Create Snapshot
      const orderItem =
        createOrderItem(
          product,
          cartItem
        );

      orderItems.push(
        orderItem
      );
    }

    // ==================================================
    // CALCULATE SUBTOTAL
    // ==================================================

    const orderSubtotal =
      orderItems.reduce(
        (total, item) =>
          total +
          Number(
            item.total || 0
          ),
        0
      );

    // ==================================================
    // SERVER-SIDE COUPON VALIDATION
    // ==================================================

    const couponResult =
      await validateAndCalculateCoupon({
        code:
          couponCode ||
          cart.coupon?.code ||
          "",

        userId,

        subtotal:
          orderSubtotal,

        session,
      });

    if (
      !couponResult.success
    ) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message:
          couponResult.message,
      });
    }

    // ==================================================
    // PRICE DETAILS
    // ==================================================

    const priceDetails =
      calculatePriceDetails(
        orderItems,
        couponResult.discountAmount
      );

    // ==================================================
    // UPDATE PRODUCT STOCK
    // ==================================================

    for (
      const cartItem of cart.items
    ) {
      const product =
        await Product.findById(
          cartItem.product._id
        ).session(session);

      // Product with Size Variants
      if (
        product.sizes?.length > 0
      ) {
        const index =
          product.sizes.findIndex(
            (item) =>
              normalizeSize(
                item.size
              ) ===
              normalizeSize(
                cartItem.size
              )
          );

        if (
          index !== -1
        ) {
          product.sizes[
            index
          ].stock -=
            Number(
              cartItem.quantity
            );
        }
      }

      // Product without Size
      else {
        product.stock -=
          Number(
            cartItem.quantity
          );
      }

      await product.save({
        session,
      });
    }

    // ==================================================
    // CREATE ORDER
    // ==================================================

    const order =
      await Order.create(
        [
          {
            orderNumber:
              generateOrderNumber(),

            user:
              userId,

            items:
              orderItems,

            shippingAddress:
              createAddressSnapshot(
                address
              ),

            payment: {
              method:
                paymentMethod,

              status:
                "Pending",
            },

            shipping: {},

            coupon: {
              code:
                couponResult.code ||
                "",

              discountAmount:
                couponResult.discountAmount ||
                0,
            },

            priceDetails,

            customerNote,

            status:
              "Pending",
          },
        ],
        {
          session,
        }
      );

    // ==================================================
    // INCREMENT COUPON USAGE
    // ==================================================

    if (
      couponResult.coupon
    ) {
      await Coupon.findByIdAndUpdate(
        couponResult.coupon._id,
        {
          $inc: {
            usedCount: 1,
          },
        },
        {
          session,
        }
      );
    }

    // ==================================================
    // CLEAR CART
    // ==================================================

    cart.items = [];

    cart.coupon = {
      code: "",
      discountAmount: 0,
    };

    await cart.save({
      session,
    });

    // ==================================================
    // COMMIT
    // ==================================================

    await session.commitTransaction();

    session.endSession();

    return res.status(201).json({
      success: true,

      message:
        "Order placed successfully.",

      order:
        order[0],
    });
  } catch (error) {
    await session.abortTransaction();

    session.endSession();

    console.error(
      "Place Order Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to place order.",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};

// ======================================================
// BUY NOW
// ======================================================

export const buyNow = async (
  req,
  res
) => {
  const session =
    await mongoose.startSession();

  session.startTransaction();

  try {
    const userId =
      req.user.id;

    const {
      productId,
      quantity = 1,
      size = "",
      color = "",
      addressId,
      paymentMethod = "COD",
      customerNote = "",
      couponCode = "",
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !isValidObjectId(
        productId
      )
    ) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message:
          "Invalid product.",
      });
    }

    if (
      !isValidObjectId(
        addressId
      )
    ) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message:
          "Invalid address.",
      });
    }

    // ==================================================
    // PRODUCT
    // ==================================================

    const product =
      await Product.findById(
        productId
      ).session(session);

    const validation =
      validateProduct(
        product
      );

    if (
      !validation.success
    ) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message:
          validation.message,
      });
    }

    // ==================================================
    // STOCK
    // ==================================================

    const stockValidation =
      validateStock(
        product,
        quantity,
        size
      );

    if (
      !stockValidation.success
    ) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message:
          stockValidation.message,
      });
    }

    // ==================================================
    // ADDRESS
    // ==================================================

    const address =
      await Address.findOne({
        _id: addressId,
        user: userId,
        isActive: true,
      }).session(session);

    if (!address) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message:
          "Address not found.",
      });
    }

    // ==================================================
    // ORDER ITEM
    // ==================================================

    const orderItem =
      createOrderItem(
        product,
        {
          quantity,
          size,
          color,
        }
      );

    const orderItems = [
      orderItem,
    ];

    // ==================================================
    // BUY NOW SUBTOTAL
    // ==================================================

    const buyNowSubtotal =
      orderItems.reduce(
        (total, item) =>
          total +
          Number(
            item.total || 0
          ),
        0
      );

    // ==================================================
    // BUY NOW COUPON
    // ==================================================

    const couponResult =
      await validateAndCalculateCoupon({
        code: couponCode,

        userId,

        subtotal:
          buyNowSubtotal,

        session,
      });

    if (
      !couponResult.success
    ) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message:
          couponResult.message,
      });
    }

    // ==================================================
    // PRICE
    // ==================================================

    const priceDetails =
      calculatePriceDetails(
        orderItems,
        couponResult.discountAmount
      );

    // ==================================================
    // UPDATE STOCK
    // ==================================================

    if (
      product.sizes?.length > 0
    ) {
      const index =
        product.sizes.findIndex(
          (item) =>
            normalizeSize(
              item.size
            ) ===
            normalizeSize(
              size
            )
        );

      if (
        index !== -1
      ) {
        product.sizes[
          index
        ].stock -=
          Number(quantity);
      }
    } else {
      product.stock -=
        Number(quantity);
    }

    await product.save({
      session,
    });

    // ==================================================
    // CREATE ORDER
    // ==================================================

    const order =
      await Order.create(
        [
          {
            orderNumber:
              generateOrderNumber(),

            user:
              userId,

            items:
              orderItems,

            shippingAddress:
              createAddressSnapshot(
                address
              ),

            payment: {
              method:
                paymentMethod,

              status:
                "Pending",
            },

            shipping: {},

            coupon: {
              code:
                couponResult.code ||
                "",

              discountAmount:
                couponResult.discountAmount ||
                0,
            },

            priceDetails,

            customerNote,

            status:
              "Pending",
          },
        ],
        {
          session,
        }
      );

    // ==================================================
    // INCREMENT COUPON USAGE
    // ==================================================

    if (
      couponResult.coupon
    ) {
      await Coupon.findByIdAndUpdate(
        couponResult.coupon._id,
        {
          $inc: {
            usedCount: 1,
          },
        },
        {
          session,
        }
      );
    }

    // ==================================================
    // COMMIT
    // ==================================================

    await session.commitTransaction();

    session.endSession();

    return res.status(201).json({
      success: true,

      message:
        "Buy Now order placed successfully.",

      order:
        order[0],
    });
  } catch (error) {
    await session.abortTransaction();

    session.endSession();

    console.error(
      "Buy Now Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to place Buy Now order.",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};

// ======================================================
// GET MY ORDERS
// GET /api/v1/orders
// ======================================================

export const getMyOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find({
        user: req.user._id,
      })
        .sort({
          createdAt: -1,
        })
        .select("-__v");

    return res.status(200).json({
      success: true,
      count:
        orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get My Orders Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch orders.",
    });
  }
};

// ======================================================
// GET ORDER DETAILS
// GET /api/v1/orders/:orderId
// ======================================================

export const getOrderDetails =
  async (req, res) => {
    try {
      const {
        orderId,
      } = req.params;

      if (
        !isValidObjectId(
          orderId
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid order ID.",
          });
      }

      const order =
        await Order.findOne({
          _id: orderId,
          user:
            req.user._id,
        });

      if (!order) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Order not found.",
          });
      }

      return res
        .status(200)
        .json({
          success: true,
          order,
        });
    } catch (error) {
      console.error(
        "Get Order Details Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to fetch order details.",
        });
    }
  };

// ======================================================
// CANCEL ORDER
// PATCH /api/v1/orders/:orderId/cancel
// ======================================================

export const cancelOrder =
  async (req, res) => {
    try {
      const {
        orderId,
      } = req.params;

      const {
        cancelReason = "",
      } = req.body;

      if (
        !isValidObjectId(
          orderId
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid order ID.",
          });
      }

      const order =
        await Order.findOne({
          _id: orderId,
          user:
            req.user._id,
        });

      if (!order) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Order not found.",
          });
      }

      if (
        order.status ===
        "Cancelled"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Order is already cancelled.",
          });
      }

      if (
        order.status ===
        "Delivered"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Delivered order cannot be cancelled.",
          });
      }

      if (
        order.status ===
        "Returned"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Returned order cannot be cancelled.",
          });
      }

      // Update Stock
      for (
        const item of order.items
      ) {
        const product =
          await Product.findById(
            item.product
          );

        if (!product) continue;

        if (
          product.sizes?.length > 0
        ) {
          const index =
            product.sizes.findIndex(
              (size) =>
                normalizeSize(
                  size.size
                ) ===
                normalizeSize(
                  item.size
                )
            );

          if (
            index !== -1
          ) {
            product.sizes[
              index
            ].stock +=
              item.quantity;
          }
        } else {
          product.stock +=
            item.quantity;
        }

        await product.save();
      }

      order.status =
        "Cancelled";

      order.cancelReason =
        cancelReason;

      order.cancelledBy =
        "Customer";

      order.shipping.cancelledAt =
        new Date();

      await order.save();

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Order cancelled successfully.",
          order,
        });
    } catch (error) {
      console.error(
        "Cancel Order Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to cancel order.",
        });
    }
  };

// ======================================================
// RETURN ORDER
// PATCH /api/v1/orders/:orderId/return
// ======================================================

export const returnOrder =
  async (req, res) => {
    try {
      const {
        orderId,
      } = req.params;

      const {
        returnReason = "",
      } = req.body;

      if (
        !isValidObjectId(
          orderId
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid order ID.",
          });
      }

      const order =
        await Order.findOne({
          _id: orderId,
          user:
            req.user._id,
        });

      if (!order) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Order not found.",
          });
      }

      if (
        order.status !==
        "Delivered"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Only delivered orders can be returned.",
          });
      }

      if (
        order.returnStatus ===
        "Requested"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Return request already submitted.",
          });
      }

      order.returnReason =
        returnReason;

      order.returnStatus =
        "Requested";

      order.shipping.returnedAt =
        new Date();

      await order.save();

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Return request submitted successfully.",
          order,
        });
    } catch (error) {
      console.error(
        "Return Order Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to submit return request.",
        });
    }
  };

// ======================================================
// TRACK ORDER
// GET /api/v1/orders/:orderId/track
// ======================================================

export const trackOrder = async (
  req,
  res
) => {
  try {
    const {
      orderId,
    } = req.params;

    if (
      !isValidObjectId(
        orderId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order ID.",
      });
    }

    const order =
      await Order.findOne({
        _id: orderId,
        user:
          req.user._id,
      }).select(
        "orderNumber status shipping payment createdAt updatedAt"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,

      tracking: {
        orderNumber:
          order.orderNumber,

        orderStatus:
          order.status,

        shippingStatus:
          order.shipping.status,

        courier:
          order.shipping.courierName,

        trackingNumber:
          order.shipping.trackingNumber,

        trackingUrl:
          order.shipping.trackingUrl,

        estimatedDelivery:
          order.shipping
            .estimatedDelivery,

        shippedAt:
          order.shipping
            .shippedAt,

        deliveredAt:
          order.shipping
            .deliveredAt,

        paymentStatus:
          order.payment.status,

        paymentMethod:
          order.payment.method,

        createdAt:
          order.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Track Order Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to track order.",
    });
  }
};

// ======================================================
// UPDATE PAYMENT STATUS
// PATCH /api/v1/orders/:orderId/payment
// ======================================================

export const updatePaymentStatus =
  async (req, res) => {
    try {
      const {
        orderId,
      } = req.params;

      const {
        status,
        transactionId = "",
        paymentId = "",
        orderGatewayId = "",
        signature = "",
      } = req.body;

      if (
        !isValidObjectId(
          orderId
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid order ID.",
          });
      }

      const order =
        await Order.findById(
          orderId
        );

      if (!order) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Order not found.",
          });
      }

      const validStatus = [
        "Pending",
        "Paid",
        "Failed",
        "Refunded",
      ];

      if (
        !validStatus.includes(
          status
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid payment status.",
          });
      }

      order.payment.status =
        status;

      order.payment.transactionId =
        transactionId;

      order.payment.paymentId =
        paymentId;

      order.payment.orderId =
        orderGatewayId;

      order.payment.signature =
        signature;

      if (
        status === "Paid"
      ) {
        order.payment.paidAt =
          new Date();
      }

      if (
        status === "Refunded"
      ) {
        order.payment.refundedAt =
          new Date();
      }

      await order.save();

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Payment updated successfully.",
          payment:
            order.payment,
        });
    } catch (error) {
      console.error(
        "Update Payment Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to update payment.",
        });
    }
  };

// ======================================================
// ADMIN - GET ALL ORDERS
// GET /api/v1/admin/orders
// ======================================================

export const adminGetAllOrders =
  async (req, res) => {
    try {
      const page =
        Number(
          req.query.page
        ) || 1;

      const limit =
        Number(
          req.query.limit
        ) || 10;

      const skip =
        (page - 1) *
        limit;

      const filter = {};

      // Status Filter
      if (
        req.query.status
      ) {
        filter.status =
          req.query.status;
      }

      // Payment Filter
      if (
        req.query.paymentStatus
      ) {
        filter[
          "payment.status"
        ] =
          req.query.paymentStatus;
      }

      // Search Order Number
      if (
        req.query.search
      ) {
        filter.orderNumber = {
          $regex:
            req.query.search,
          $options: "i",
        };
      }

      const totalOrders =
        await Order.countDocuments(
          filter
        );

      const orders =
        await Order.find(
          filter
        )
          .populate(
            "user",
            "name email phone"
          )
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit);

      return res.status(200).json({
        success: true,

        page,

        limit,

        totalOrders,

        totalPages:
          Math.ceil(
            totalOrders /
              limit
          ),

        orders,
      });
    } catch (error) {
      console.error(
        "Admin Get Orders Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch orders.",
      });
    }
  };

// ======================================================
// ADMIN - GET SINGLE ORDER
// GET /api/v1/admin/orders/:orderId
// ======================================================

export const adminGetSingleOrder =
  async (req, res) => {
    try {
      const {
        orderId,
      } = req.params;

      if (
        !isValidObjectId(
          orderId
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid Order ID.",
          });
      }

      const order =
        await Order.findById(
          orderId
        )
          .populate(
            "user",
            "name email phone"
          )
          .populate(
            "items.product"
          );

      if (!order) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Order not found.",
          });
      }

      return res
        .status(200)
        .json({
          success: true,
          order,
        });
    } catch (error) {
      console.error(
        "Admin Get Order Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to fetch order.",
        });
    }
  };

// ======================================================
// ADMIN UPDATE ORDER STATUS
// PATCH /api/v1/admin/orders/:orderId/status
// ======================================================

export const adminUpdateOrderStatus =
  async (req, res) => {
    try {
      const {
        orderId,
      } = req.params;

      const {
        status,
        courierName = "",
        trackingNumber = "",
        trackingUrl = "",
        estimatedDelivery = null,
        adminNote = "",
      } = req.body;

      if (
        !isValidObjectId(
          orderId
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid order ID.",
          });
      }

      const validStatus = [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Out For Delivery",
        "Delivered",
        "Cancelled",
        "Returned",
      ];

      if (
        !validStatus.includes(
          status
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid order status.",
          });
      }

      const order =
        await Order.findById(
          orderId
        );

      if (!order) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Order not found.",
          });
      }

      order.status =
        status;

      order.shipping.status =
        status;

      order.adminNote =
        adminNote;

      // Shipping Details
      if (courierName) {
        order.shipping.courierName =
          courierName;
      }

      if (trackingNumber) {
        order.shipping.trackingNumber =
          trackingNumber;
      }

      if (trackingUrl) {
        order.shipping.trackingUrl =
          trackingUrl;
      }

      if (estimatedDelivery) {
        order.shipping.estimatedDelivery =
          estimatedDelivery;
      }

      // Status Dates
      switch (status) {
        case "Shipped":
          order.shipping.shippedAt =
            new Date();
          break;

        case "Delivered":
          order.shipping.deliveredAt =
            new Date();

          order.deliveredAt =
            new Date();
          break;

        case "Cancelled":
          order.shipping.cancelledAt =
            new Date();
          break;

        case "Returned":
          order.shipping.returnedAt =
            new Date();
          break;

        default:
          break;
      }

      await order.save();

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Order status updated successfully.",
          order,
        });
    } catch (error) {
      console.error(
        "Admin Update Status Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to update order status.",
        });
    }
  };

// ======================================================
// ADMIN DELETE ORDER
// DELETE /api/v1/admin/orders/:orderId
// ======================================================

export const adminDeleteOrder =
  async (req, res) => {
    try {
      const {
        orderId,
      } = req.params;

      if (
        !isValidObjectId(
          orderId
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid order ID.",
          });
      }

      const order =
        await Order.findById(
          orderId
        );

      if (!order) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Order not found.",
          });
      }

      await Order.findByIdAndDelete(
        orderId
      );

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Order deleted successfully.",
        });
    } catch (error) {
      console.error(
        "Admin Delete Order Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to delete order.",
        });
    }
  };

// ======================================================
// ADMIN ORDER STATISTICS
// GET /api/v1/admin/orders/statistics
// ======================================================

export const getOrderStatistics =
  async (req, res) => {
    try {
      const totalOrders =
        await Order.countDocuments();

      const pendingOrders =
        await Order.countDocuments({
          status: "Pending",
        });

      const confirmedOrders =
        await Order.countDocuments({
          status: "Confirmed",
        });

      const packedOrders =
        await Order.countDocuments({
          status: "Packed",
        });

      const shippedOrders =
        await Order.countDocuments({
          status: "Shipped",
        });

      const outForDeliveryOrders =
        await Order.countDocuments({
          status:
            "Out For Delivery",
        });

      const deliveredOrders =
        await Order.countDocuments({
          status: "Delivered",
        });

      const cancelledOrders =
        await Order.countDocuments({
          status: "Cancelled",
        });

      const returnedOrders =
        await Order.countDocuments({
          status: "Returned",
        });

      // Revenue
      const revenueResult =
        await Order.aggregate([
          {
            $match: {
              status:
                "Delivered",
            },
          },
          {
            $group: {
              _id: null,

              totalRevenue: {
                $sum:
                  "$priceDetails.total",
              },
            },
          },
        ]);

      const totalRevenue =
        revenueResult[0]
          ?.totalRevenue || 0;

      return res
        .status(200)
        .json({
          success: true,

          statistics: {
            totalOrders,

            pendingOrders,

            confirmedOrders,

            packedOrders,

            shippedOrders,

            outForDeliveryOrders,

            deliveredOrders,

            cancelledOrders,

            returnedOrders,

            totalRevenue,
          },
        });
    } catch (error) {
      console.error(
        "Order Statistics Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to fetch order statistics.",
        });
    }
  };

// ======================================================
// ADMIN RECENT ORDERS
// GET /api/v1/admin/orders/recent
// ======================================================

export const getRecentOrders =
  async (req, res) => {
    try {
      const orders =
        await Order.find()
          .populate(
            "user",
            "name email"
          )
          .sort({
            createdAt: -1,
          })
          .limit(10);

      return res
        .status(200)
        .json({
          success: true,
          count:
            orders.length,
          orders,
        });
    } catch (error) {
      console.error(
        "Recent Orders Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to fetch recent orders.",
        });
    }
  };