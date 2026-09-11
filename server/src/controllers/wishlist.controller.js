import mongoose from "mongoose";

import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

// ======================================================
// HELPERS
// ======================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ======================================================
// NORMALIZE SIZE
// ======================================================

const normalizeSize = (size = "") => {
  return String(size).trim().toUpperCase();
};

// ======================================================
// NORMALIZE COLOR
// ======================================================

const normalizeColor = (color = "") => {
  return String(color).trim();
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
// GET PRODUCT STOCK
// ======================================================

const getAvailableStock = (
  product,
  selectedSize = ""
) => {
  // Product has size variants
  if (product.sizes?.length > 0) {
    const size = normalizeSize(
      selectedSize
    );

    if (!size) {
      return {
        success: false,
        stock: 0,
        message:
          "Please select a size for this product.",
      };
    }

    const sizeVariant =
      product.sizes.find(
        (item) =>
          normalizeSize(item.size) ===
          size
      );

    if (!sizeVariant) {
      return {
        success: false,
        stock: 0,
        message:
          "Selected size is not available.",
      };
    }

    return {
      success: true,
      stock:
        Number(sizeVariant.stock) || 0,
    };
  }

  // Products without sizes
  return {
    success: true,
    stock:
      Number(product.stock) || 0,
  };
};

// ======================================================
// VALIDATE COLOR
// ======================================================

const validateProductColor = (
  product,
  selectedColor = ""
) => {
  // Product has no colors
  if (!product.colors?.length) {
    return {
      success: true,
      color: "",
    };
  }

  const color = normalizeColor(
    selectedColor
  );

  if (!color) {
    return {
      success: false,
      message:
        "Please select a color for this product.",
    };
  }

  const productColor =
    product.colors.find(
      (item) =>
        String(item.name || "")
          .trim()
          .toLowerCase() ===
        color.toLowerCase()
    );

  if (!productColor) {
    return {
      success: false,
      message:
        "Selected color is not available.",
    };
  }

  return {
    success: true,
    color: productColor.name,
  };
};

// ======================================================
// POPULATE WISHLIST
// ======================================================

const populateWishlist = async (
  wishlist
) => {
  await wishlist.populate({
    path: "items.product",

    select: [
      "name",
      "slug",
      "brand",
      "price",
      "discountPrice",
      "images",
      "colors",
      "sizes",
      "stock",
      "rating",
      "ratingsCount",
      "reviewsCount",
      "isActive",
      "isFeatured",
      "isTrending",
      "isNewArrival",
      "category",
      "subcategory",
    ].join(" "),

    populate: [
      {
        path: "category",
        select: "name slug",
      },
      {
        path: "subcategory",
        select: "name slug",
      },
    ],
  });

  return wishlist;
};

// ======================================================
// CLEAN INVALID WISHLIST ITEMS
//
// Product permanently removed ho gaya ho to
// wishlist se automatically clean kar denge.
// ======================================================

const cleanWishlist = async (
  wishlist
) => {
  if (!wishlist.items.length) {
    return wishlist;
  }

  const productIds =
    wishlist.items.map(
      (item) => item.product
    );

  const products =
    await Product.find({
      _id: {
        $in: productIds,
      },
    }).select("_id");

  const validProductIds =
    new Set(
      products.map((product) =>
        product._id.toString()
      )
    );

  const originalLength =
    wishlist.items.length;

  wishlist.items =
    wishlist.items.filter((item) =>
      validProductIds.has(
        item.product.toString()
      )
    );

  if (
    originalLength !==
    wishlist.items.length
  ) {
    await wishlist.save();
  }

  return wishlist;
};

// ======================================================
// GET MY WISHLIST
//
// GET /api/v1/wishlist
//
// PROTECTED
// ======================================================

export const getWishlist = async (
  req,
  res
) => {
  try {
    let wishlist =
      await Wishlist.findOne({
        user: req.user._id,
      });

    // Create wishlist automatically
    if (!wishlist) {
      wishlist =
        await Wishlist.create({
          user: req.user._id,
          items: [],
        });
    }

    // Remove deleted product references
    await cleanWishlist(wishlist);

    // Populate products
    await populateWishlist(
      wishlist
    );

    return res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error(
      "Get Wishlist Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get wishlist.",
    });
  }
};

// ======================================================
// ADD PRODUCT TO WISHLIST
//
// POST /api/v1/wishlist/:productId
//
// PROTECTED
// ======================================================

export const addToWishlist = async (
  req,
  res
) => {
  try {
    const { productId } =
      req.params;

    // ==================================================
    // VALIDATE PRODUCT ID
    // ==================================================

    if (
      !isValidObjectId(productId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid product ID.",
      });
    }

    // ==================================================
    // GET PRODUCT
    // ==================================================

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found.",
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message:
          "This product is currently unavailable.",
      });
    }

    // ==================================================
    // GET / CREATE WISHLIST
    // ==================================================

    let wishlist =
      await Wishlist.findOne({
        user: req.user._id,
      });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        items: [],
      });
    }

    // ==================================================
    // DUPLICATE CHECK
    // ==================================================

    if (
      wishlist.hasProduct(
        productId
      )
    ) {
      await populateWishlist(
        wishlist
      );

      return res.status(200).json({
        success: true,

        message:
          "Product is already in your wishlist.",

        alreadyExists: true,

        wishlist,
      });
    }

    // ==================================================
    // ADD PRODUCT
    // ==================================================

    wishlist.addProduct(
      productId
    );

    await wishlist.save();

    await populateWishlist(
      wishlist
    );

    return res.status(200).json({
      success: true,

      message:
        "Product added to wishlist successfully.",

      alreadyExists: false,

      wishlist,
    });
  } catch (error) {
    console.error(
      "Add To Wishlist Error:",
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
        "Failed to add product to wishlist.",
    });
  }
};

// ======================================================
// REMOVE PRODUCT FROM WISHLIST
//
// DELETE /api/v1/wishlist/:productId
//
// PROTECTED
// ======================================================

export const removeFromWishlist =
  async (req, res) => {
    try {
      const { productId } =
        req.params;

      if (
        !isValidObjectId(productId)
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid product ID.",
          });
      }

      const wishlist =
        await Wishlist.findOne({
          user: req.user._id,
        });

      if (!wishlist) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Wishlist not found.",
          });
      }

      // ==================================================
      // CHECK PRODUCT EXISTS
      // ==================================================

      if (
        !wishlist.hasProduct(
          productId
        )
      ) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Product is not in your wishlist.",
          });
      }

      // ==================================================
      // REMOVE
      // ==================================================

      wishlist.removeProduct(
        productId
      );

      await wishlist.save();

      await populateWishlist(
        wishlist
      );

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Product removed from wishlist successfully.",

          wishlist,
        });
    } catch (error) {
      console.error(
        "Remove Wishlist Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to remove product from wishlist.",
        });
    }
  };

// ======================================================
// TOGGLE WISHLIST
//
// POST /api/v1/wishlist/:productId/toggle
//
// Product present:
//     remove
//
// Product absent:
//     add
//
// Frontend heart button ke liye useful.
// ======================================================

export const toggleWishlist = async (
  req,
  res
) => {
  try {
    const { productId } =
      req.params;

    if (
      !isValidObjectId(productId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid product ID.",
      });
    }

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found.",
      });
    }

    let wishlist =
      await Wishlist.findOne({
        user: req.user._id,
      });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        items: [],
      });
    }

    // ==================================================
    // PRODUCT ALREADY EXISTS → REMOVE
    // ==================================================

    if (
      wishlist.hasProduct(
        productId
      )
    ) {
      wishlist.removeProduct(
        productId
      );

      await wishlist.save();

      await populateWishlist(
        wishlist
      );

      return res.status(200).json({
        success: true,

        message:
          "Product removed from wishlist.",

        inWishlist: false,

        wishlist,
      });
    }

    // ==================================================
    // PRODUCT INACTIVE
    // ==================================================

    if (!product.isActive) {
      return res.status(400).json({
        success: false,

        message:
          "This product is currently unavailable.",
      });
    }

    // ==================================================
    // ADD PRODUCT
    // ==================================================

    wishlist.addProduct(
      productId
    );

    await wishlist.save();

    await populateWishlist(
      wishlist
    );

    return res.status(200).json({
      success: true,

      message:
        "Product added to wishlist.",

      inWishlist: true,

      wishlist,
    });
  } catch (error) {
    console.error(
      "Toggle Wishlist Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update wishlist.",
    });
  }
};

// ======================================================
// CLEAR COMPLETE WISHLIST
//
// DELETE /api/v1/wishlist
//
// PROTECTED
// ======================================================

export const clearWishlist = async (
  req,
  res
) => {
  try {
    let wishlist =
      await Wishlist.findOne({
        user: req.user._id,
      });

    if (!wishlist) {
      wishlist =
        await Wishlist.create({
          user: req.user._id,
          items: [],
        });
    }

    wishlist.clearWishlist();

    await wishlist.save();

    return res.status(200).json({
      success: true,

      message:
        "Wishlist cleared successfully.",

      wishlist,
    });
  } catch (error) {
    console.error(
      "Clear Wishlist Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to clear wishlist.",
    });
  }
};

// ======================================================
// GET WISHLIST COUNT
//
// GET /api/v1/wishlist/count
//
// Header heart badge ke liye.
// ======================================================

export const getWishlistCount =
  async (req, res) => {
    try {
      const wishlist =
        await Wishlist.findOne({
          user: req.user._id,
        });

      if (!wishlist) {
        return res
          .status(200)
          .json({
            success: true,
            itemCount: 0,
          });
      }

      return res
        .status(200)
        .json({
          success: true,

          itemCount:
            wishlist.items.length,
        });
    } catch (error) {
      console.error(
        "Wishlist Count Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to get wishlist count.",
        });
    }
  };

// ======================================================
// CHECK PRODUCT IN WISHLIST
//
// GET /api/v1/wishlist/check/:productId
//
// Product card/detail page par heart state
// check karne ke liye.
// ======================================================

export const checkWishlist = async (
  req,
  res
) => {
  try {
    const { productId } =
      req.params;

    if (
      !isValidObjectId(productId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid product ID.",
      });
    }

    const wishlist =
      await Wishlist.findOne({
        user: req.user._id,
      });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        inWishlist: false,
      });
    }

    const inWishlist =
      wishlist.hasProduct(
        productId
      );

    return res.status(200).json({
      success: true,
      inWishlist,
    });
  } catch (error) {
    console.error(
      "Check Wishlist Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to check wishlist.",
    });
  }
};

// ======================================================
// MOVE WISHLIST PRODUCT TO CART
//
// POST /api/v1/wishlist/:productId/move-to-cart
//
// Body:
//
// {
//   "quantity": 1,
//   "size": "M",
//   "color": "Black"
// }
//
// Product cart me add hoga aur wishlist se remove.
//
// PROTECTED
// ======================================================

export const moveToCart = async (
  req,
  res
) => {
  try {
    const { productId } =
      req.params;

    const {
      quantity = 1,
      size = "",
      color = "",
    } = req.body;

    // ==================================================
    // PRODUCT ID
    // ==================================================

    if (
      !isValidObjectId(productId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid product ID.",
      });
    }

    // ==================================================
    // QUANTITY
    // ==================================================

    const requestedQuantity =
      Number(quantity);

    if (
      !Number.isInteger(
        requestedQuantity
      ) ||
      requestedQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be a positive integer.",
      });
    }

    if (requestedQuantity > 99) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum quantity allowed is 99.",
      });
    }

    // ==================================================
    // WISHLIST
    // ==================================================

    const wishlist =
      await Wishlist.findOne({
        user: req.user._id,
      });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message:
          "Wishlist not found.",
      });
    }

    if (
      !wishlist.hasProduct(
        productId
      )
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Product is not in your wishlist.",
      });
    }

    // ==================================================
    // PRODUCT
    // ==================================================

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found.",
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message:
          "This product is currently unavailable.",
      });
    }

    // ==================================================
    // SIZE + STOCK
    // ==================================================

    const selectedSize =
      normalizeSize(size);

    const stockResult =
      getAvailableStock(
        product,
        selectedSize
      );

    if (!stockResult.success) {
      return res.status(400).json({
        success: false,
        message:
          stockResult.message,
      });
    }

    if (stockResult.stock <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Product is out of stock.",
      });
    }

    // ==================================================
    // COLOR
    // ==================================================

    const colorResult =
      validateProductColor(
        product,
        color
      );

    if (!colorResult.success) {
      return res.status(400).json({
        success: false,
        message:
          colorResult.message,
      });
    }

    const selectedColor =
      colorResult.color;

    // ==================================================
    // GET / CREATE CART
    // ==================================================

    let cart =
      await Cart.findOne({
        user: req.user._id,
      });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    // ==================================================
    // CHECK EXISTING CART VARIANT
    // ==================================================

    const existingItem =
      cart.findCartItem(
        product._id,
        selectedSize,
        selectedColor
      );

    let finalQuantity =
      requestedQuantity;

    if (existingItem) {
      finalQuantity =
        existingItem.quantity +
        requestedQuantity;
    }

    // ==================================================
    // STOCK CHECK
    // ==================================================

    if (
      finalQuantity >
      stockResult.stock
    ) {
      return res.status(400).json({
        success: false,

        message: `Only ${stockResult.stock} item(s) available in stock.`,

        availableStock:
          stockResult.stock,
      });
    }

    if (finalQuantity > 99) {
      return res.status(400).json({
        success: false,

        message:
          "Maximum quantity allowed per cart item is 99.",
      });
    }

    // ==================================================
    // PRICE FROM BACKEND
    // ==================================================

    const sellingPrice =
      getSellingPrice(product);

    // ==================================================
    // UPDATE EXISTING CART ITEM
    // ==================================================

    if (existingItem) {
      existingItem.quantity =
        finalQuantity;

      existingItem.price =
        sellingPrice;

      existingItem.originalPrice =
        Number(product.price);
    }

    // ==================================================
    // CREATE NEW CART ITEM
    // ==================================================

    else {
      cart.items.push({
        product: product._id,

        quantity:
          requestedQuantity,

        size: selectedSize,

        color: selectedColor,

        price: sellingPrice,

        originalPrice:
          Number(product.price),

        addedAt: new Date(),
      });
    }

    // Cart changed, so old coupon should
    // not remain blindly applied.
    if (cart.coupon?.code) {
      cart.coupon = {
        code: "",
        discountAmount: 0,
      };
    }

    // Save cart first.
    // Wishlist item tabhi remove hoga jab
    // cart successfully save ho jaye.
    await cart.save();

    // ==================================================
    // REMOVE FROM WISHLIST
    // ==================================================

    wishlist.removeProduct(
      productId
    );

    await wishlist.save();

    // ==================================================
    // POPULATE
    // ==================================================

    await populateWishlist(
      wishlist
    );

    await cart.populate({
      path: "items.product",

      select: [
        "name",
        "slug",
        "brand",
        "price",
        "discountPrice",
        "images",
        "colors",
        "sizes",
        "stock",
        "isActive",
        "category",
        "subcategory",
      ].join(" "),

      populate: [
        {
          path: "category",
          select: "name slug",
        },
        {
          path: "subcategory",
          select: "name slug",
        },
      ],
    });

    return res.status(200).json({
      success: true,

      message:
        "Product moved to cart successfully.",

      wishlist,

      cart,
    });
  } catch (error) {
    console.error(
      "Move Wishlist To Cart Error:",
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
        "Failed to move product to cart.",
    });
  }
};