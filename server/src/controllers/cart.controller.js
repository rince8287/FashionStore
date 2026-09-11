import mongoose from "mongoose";

import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// ======================================================
// HELPERS
// ======================================================

const normalizeSize = (size = "") => {
  return String(size).trim().toUpperCase();
};

const normalizeColor = (color = "") => {
  return String(color).trim();
};

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
// CHECK VALID MONGODB ID
// ======================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ======================================================
// GET PRODUCT AVAILABLE STOCK
// ======================================================

const getAvailableStock = (
  product,
  selectedSize = ""
) => {
  // Product has size variants
  if (product.sizes?.length > 0) {
    const normalizedSize =
      normalizeSize(selectedSize);

    if (!normalizedSize) {
      return {
        success: false,
        message:
          "Please select a size for this product.",
        stock: 0,
      };
    }

    const sizeVariant =
      product.sizes.find(
        (item) =>
          normalizeSize(item.size) ===
          normalizedSize
      );

    if (!sizeVariant) {
      return {
        success: false,
        message:
          "Selected size is not available.",
        stock: 0,
      };
    }

    return {
      success: true,
      stock: Number(sizeVariant.stock) || 0,
    };
  }

  // Product without size variants
  return {
    success: true,
    stock: Number(product.stock) || 0,
  };
};

// ======================================================
// VALIDATE PRODUCT COLOR
// ======================================================

const validateProductColor = (
  product,
  selectedColor = ""
) => {
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

  const existingColor =
    product.colors.find(
      (item) =>
        String(item.name || "")
          .trim()
          .toLowerCase() ===
        color.toLowerCase()
    );

  if (!existingColor) {
    return {
      success: false,
      message:
        "Selected color is not available.",
    };
  }

  return {
    success: true,
    color: existingColor.name,
  };
};

// ======================================================
// POPULATE CART
// ======================================================

const populateCart = async (cart) => {
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

  return cart;
};

// ======================================================
// SYNC CART WITH CURRENT PRODUCT DATA
//
// Price may change after product was added.
// Product may become inactive.
// Stock may change.
//
// This helper keeps cart price synchronized.
// ======================================================

const syncCart = async (cart) => {
  let changed = false;

  const validItems = [];

  for (const item of cart.items) {
    const product =
      await Product.findById(
        item.product
      );

    // Product deleted / unavailable
    if (!product || !product.isActive) {
      changed = true;
      continue;
    }

    const sellingPrice =
      getSellingPrice(product);

    if (
      Number(item.price) !==
      sellingPrice
    ) {
      item.price = sellingPrice;
      changed = true;
    }

    if (
      Number(item.originalPrice) !==
      Number(product.price)
    ) {
      item.originalPrice =
        Number(product.price);

      changed = true;
    }

    // Check current stock
    const stockResult =
      getAvailableStock(
        product,
        item.size
      );

    // Size no longer available
    if (!stockResult.success) {
      changed = true;
      continue;
    }

    // Product out of stock
    if (stockResult.stock <= 0) {
      changed = true;
      continue;
    }

    // Reduce quantity if stock became lower
    if (
      item.quantity >
      stockResult.stock
    ) {
      item.quantity =
        stockResult.stock;

      changed = true;
    }

    validItems.push(item);
  }

  if (
    validItems.length !==
    cart.items.length
  ) {
    cart.items = validItems;
    changed = true;
  }

  if (changed) {
    await cart.save();
  }

  return cart;
};

// ======================================================
// GET MY CART
// GET /api/v1/cart
// PROTECTED
// ======================================================

export const getCart = async (
  req,
  res
) => {
  try {
    let cart = await Cart.findOne({
      user: req.user._id,
    });

    // Create empty cart automatically
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    // Sync prices / stock
    await syncCart(cart);

    // Populate products
    await populateCart(cart);

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error(
      "Get Cart Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get cart.",
    });
  }
};

// ======================================================
// ADD PRODUCT TO CART
// POST /api/v1/cart
//
// Body:
// {
//   "productId": "...",
//   "quantity": 1,
//   "size": "M",
//   "color": "Black"
// }
// ======================================================

export const addToCart = async (
  req,
  res
) => {
  try {
    const {
      productId,
      quantity = 1,
      size = "",
      color = "",
    } = req.body;

    // ==================================================
    // PRODUCT ID
    // ==================================================

    if (!productId) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID is required.",
      });
    }

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
    // SIZE
    // ==================================================

    const normalizedSize =
      normalizeSize(size);

    const stockResult =
      getAvailableStock(
        product,
        normalizedSize
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
    // CART
    // ==================================================

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    // ==================================================
    // CHECK SAME VARIANT
    //
    // Same product + size + color
    // ==================================================

    const existingItem =
      cart.findCartItem(
        product._id,
        normalizedSize,
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
    // ACTUAL BACKEND PRICE
    // ==================================================

    const sellingPrice =
      getSellingPrice(product);

    // ==================================================
    // UPDATE EXISTING ITEM
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
    // ADD NEW ITEM
    // ==================================================

    else {
      cart.items.push({
        product: product._id,

        quantity:
          requestedQuantity,

        size: normalizedSize,

        color: selectedColor,

        price: sellingPrice,

        originalPrice:
          Number(product.price),

        addedAt: new Date(),
      });
    }

    // Coupon should generally be recalculated
    // when cart contents change.
    if (cart.coupon?.code) {
      cart.coupon = {
        code: "",
        discountAmount: 0,
      };
    }

    await cart.save();

    await populateCart(cart);

    return res.status(200).json({
      success: true,

      message:
        existingItem
          ? "Cart quantity updated successfully."
          : "Product added to cart successfully.",

      cart,
    });
  } catch (error) {
    console.error(
      "Add To Cart Error:",
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
        "Failed to add product to cart.",
    });
  }
};

// ======================================================
// UPDATE CART ITEM QUANTITY
// PUT /api/v1/cart/:itemId
//
// Body:
// {
//   "quantity": 3
// }
// ======================================================

export const updateCartItem = async (
  req,
  res
) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (
      !isValidObjectId(itemId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid cart item ID.",
      });
    }

    const newQuantity =
      Number(quantity);

    if (
      !Number.isInteger(
        newQuantity
      ) ||
      newQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be a positive integer.",
      });
    }

    if (newQuantity > 99) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum quantity allowed is 99.",
      });
    }

    // ==================================================
    // CART
    // ==================================================

    const cart =
      await Cart.findOne({
        user: req.user._id,
      });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message:
          "Cart not found.",
      });
    }

    const item =
      cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message:
          "Cart item not found.",
      });
    }

    // ==================================================
    // PRODUCT
    // ==================================================

    const product =
      await Product.findById(
        item.product
      );

    if (
      !product ||
      !product.isActive
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product is no longer available.",
      });
    }

    // ==================================================
    // STOCK
    // ==================================================

    const stockResult =
      getAvailableStock(
        product,
        item.size
      );

    if (!stockResult.success) {
      return res.status(400).json({
        success: false,
        message:
          stockResult.message,
      });
    }

    if (
      newQuantity >
      stockResult.stock
    ) {
      return res.status(400).json({
        success: false,

        message: `Only ${stockResult.stock} item(s) available in stock.`,

        availableStock:
          stockResult.stock,
      });
    }

    // ==================================================
    // UPDATE
    // ==================================================

    item.quantity = newQuantity;

    item.price =
      getSellingPrice(product);

    item.originalPrice =
      Number(product.price);

    // Remove coupon because totals changed
    if (cart.coupon?.code) {
      cart.coupon = {
        code: "",
        discountAmount: 0,
      };
    }

    await cart.save();

    await populateCart(cart);

    return res.status(200).json({
      success: true,
      message:
        "Cart item updated successfully.",
      cart,
    });
  } catch (error) {
    console.error(
      "Update Cart Item Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update cart item.",
    });
  }
};

// ======================================================
// UPDATE CART ITEM VARIANT
//
// PATCH /api/v1/cart/:itemId/variant
//
// Body:
// {
//    "size": "XL",
//    "color": "Black"
// }
//
// Useful if user changes size/color directly in cart.
// ======================================================

export const updateCartItemVariant =
  async (req, res) => {
    try {
      const { itemId } =
        req.params;

      const {
        size = "",
        color = "",
      } = req.body;

      if (
        !isValidObjectId(itemId)
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid cart item ID.",
          });
      }

      const cart =
        await Cart.findOne({
          user: req.user._id,
        });

      if (!cart) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Cart not found.",
          });
      }

      const item =
        cart.items.id(itemId);

      if (!item) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Cart item not found.",
          });
      }

      const product =
        await Product.findById(
          item.product
        );

      if (
        !product ||
        !product.isActive
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Product is no longer available.",
          });
      }

      // ==================================================
      // SIZE
      // ==================================================

      const normalizedSize =
        normalizeSize(size);

      const stockResult =
        getAvailableStock(
          product,
          normalizedSize
        );

      if (!stockResult.success) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              stockResult.message,
          });
      }

      if (
        item.quantity >
        stockResult.stock
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message: `Only ${stockResult.stock} item(s) available for this size.`,

            availableStock:
              stockResult.stock,
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

      if (
        !colorResult.success
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              colorResult.message,
          });
      }

      const selectedColor =
        colorResult.color;

      // ==================================================
      // DUPLICATE VARIANT CHECK
      //
      // Suppose cart already has:
      // Black / XL
      //
      // and user changes Black / M -> Black / XL.
      // Merge quantities instead of duplicate rows.
      // ==================================================

      const duplicateItem =
        cart.items.find(
          (cartItem) => {
            if (
              cartItem._id.toString() ===
              item._id.toString()
            ) {
              return false;
            }

            return (
              cartItem.product.toString() ===
                item.product.toString() &&
              normalizeSize(
                cartItem.size
              ) ===
                normalizedSize &&
              normalizeColor(
                cartItem.color
              ).toLowerCase() ===
                normalizeColor(
                  selectedColor
                ).toLowerCase()
            );
          }
        );

      if (duplicateItem) {
        const combinedQuantity =
          duplicateItem.quantity +
          item.quantity;

        if (
          combinedQuantity >
          stockResult.stock
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message: `Combined quantity exceeds available stock of ${stockResult.stock}.`,
            });
        }

        duplicateItem.quantity =
          combinedQuantity;

        duplicateItem.price =
          getSellingPrice(
            product
          );

        duplicateItem.originalPrice =
          Number(product.price);

        cart.items.pull(
          item._id
        );
      } else {
        item.size =
          normalizedSize;

        item.color =
          selectedColor;

        item.price =
          getSellingPrice(
            product
          );

        item.originalPrice =
          Number(product.price);
      }

      if (cart.coupon?.code) {
        cart.coupon = {
          code: "",
          discountAmount: 0,
        };
      }

      await cart.save();

      await populateCart(cart);

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Cart item variant updated successfully.",
          cart,
        });
    } catch (error) {
      console.error(
        "Update Cart Variant Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to update cart item variant.",
        });
    }
  };

// ======================================================
// REMOVE CART ITEM
// DELETE /api/v1/cart/:itemId
// ======================================================

export const removeCartItem = async (
  req,
  res
) => {
  try {
    const { itemId } = req.params;

    if (
      !isValidObjectId(itemId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid cart item ID.",
      });
    }

    const cart =
      await Cart.findOne({
        user: req.user._id,
      });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message:
          "Cart not found.",
      });
    }

    const item =
      cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message:
          "Cart item not found.",
      });
    }

    cart.items.pull(itemId);

    // Remove coupon after cart change
    if (cart.coupon?.code) {
      cart.coupon = {
        code: "",
        discountAmount: 0,
      };
    }

    await cart.save();

    await populateCart(cart);

    return res.status(200).json({
      success: true,
      message:
        "Product removed from cart successfully.",
      cart,
    });
  } catch (error) {
    console.error(
      "Remove Cart Item Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to remove product from cart.",
    });
  }
};

// ======================================================
// CLEAR CART
// DELETE /api/v1/cart
// ======================================================

export const clearCart = async (
  req,
  res
) => {
  try {
    let cart =
      await Cart.findOne({
        user: req.user._id,
      });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    cart.clearCart();

    await cart.save();

    return res.status(200).json({
      success: true,
      message:
        "Cart cleared successfully.",
      cart,
    });
  } catch (error) {
    console.error(
      "Clear Cart Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to clear cart.",
    });
  }
};

// ======================================================
// GET CART COUNT
// GET /api/v1/cart/count
//
// Header cart icon ke badge ke liye useful.
// ======================================================

export const getCartCount = async (
  req,
  res
) => {
  try {
    const cart =
      await Cart.findOne({
        user: req.user._id,
      });

    if (!cart) {
      return res.status(200).json({
        success: true,
        itemCount: 0,
      });
    }

    const itemCount =
      cart.items.reduce(
        (total, item) =>
          total +
          (Number(
            item.quantity
          ) || 0),
        0
      );

    return res.status(200).json({
      success: true,
      itemCount,
    });
  } catch (error) {
    console.error(
      "Get Cart Count Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get cart count.",
    });
  }
};