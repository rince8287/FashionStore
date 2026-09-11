import mongoose from "mongoose";

import Product from "../models/Product.js";
import Category from "../models/Category.js";

// ======================================================
// HELPER — CREATE SLUG
// ======================================================

const createSlug = (value = "") => {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// ======================================================
// HELPER — ESCAPE REGEX
// ======================================================

const escapeRegex = (value = "") => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ======================================================
// HELPER — VALID OBJECT ID
// ======================================================

const isValidObjectId = (value) => {
  return (
    value &&
    mongoose.Types.ObjectId.isValid(value)
  );
};

// ======================================================
// HELPER — RESOLVE CATEGORY
// ======================================================

const resolveCategory = async (value) => {
  if (!value) {
    return null;
  }

  // --------------------------------------------
  // Already MongoDB ObjectId
  // --------------------------------------------

  if (isValidObjectId(value)) {
    return Category.findById(value);
  }

  // --------------------------------------------
  // Category name / slug
  // --------------------------------------------

  const cleanValue = value.toString().trim();

  if (!cleanValue) {
    return null;
  }

  return Category.findOne({
    $or: [
      {
        slug: cleanValue
          .toLowerCase()
          .trim(),
      },
      {
        name: {
          $regex: `^${escapeRegex(
            cleanValue
          )}$`,
          $options: "i",
        },
      },
    ],
  });
};

// ======================================================
// HELPER — VALIDATE CATEGORY
// ======================================================

const validateCategories = async (
  categoryValue,
  subcategoryValue = null
) => {
  const category =
    await resolveCategory(categoryValue);

  if (!category) {
    return {
      success: false,
      status: 404,
      message:
        "Selected category was not found.",
    };
  }

  if (!category.isActive) {
    return {
      success: false,
      status: 400,
      message:
        "Selected category is inactive.",
    };
  }

  let subcategory = null;

  if (subcategoryValue) {
    subcategory =
      await resolveCategory(
        subcategoryValue
      );

    if (!subcategory) {
      return {
        success: false,
        status: 404,
        message:
          "Selected subcategory was not found.",
      };
    }

    if (!subcategory.isActive) {
      return {
        success: false,
        status: 400,
        message:
          "Selected subcategory is inactive.",
      };
    }

    // ------------------------------------------
    // Subcategory must belong to category
    // ------------------------------------------

    if (
      !subcategory.parent ||
      subcategory.parent.toString() !==
        category._id.toString()
    ) {
      return {
        success: false,
        status: 400,
        message:
          "Selected subcategory does not belong to selected category.",
      };
    }
  }

  return {
    success: true,
    category,
    subcategory,
  };
};

// ======================================================
// HELPER — PARSE ARRAY
// ======================================================

const parseArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Continue below
    }

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

// ======================================================
// HELPER — PARSE BOOLEAN
// ======================================================

const parseBoolean = (
  value,
  defaultValue = false
) => {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return Boolean(value);
};

// ======================================================
// HELPER — IMAGE NORMALIZER
// ======================================================

const normalizeImages = (
  bodyImages = [],
  files = []
) => {
  const images = [];

  // --------------------------------------------
  // Images coming from JSON
  // --------------------------------------------

  const parsedBodyImages =
    parseArray(bodyImages);

  parsedBodyImages.forEach(
    (image, index) => {
      if (typeof image === "string") {
        images.push({
          url: image,
          publicId: "",
          alt: "",
          isPrimary: index === 0,
        });
      } else if (
        image &&
        typeof image === "object" &&
        image.url
      ) {
        images.push({
          url: image.url,
          publicId:
            image.publicId || "",
          alt: image.alt || "",
          isPrimary:
            image.isPrimary === true ||
            index === 0,
        });
      }
    }
  );

  // --------------------------------------------
  // Images uploaded through multer/cloudinary
  // --------------------------------------------

  if (Array.isArray(files)) {
    files.forEach((file, index) => {
      const url =
        file.path ||
        file.secure_url ||
        file.url;

      if (!url) {
        return;
      }

      images.push({
        url,
        publicId:
          file.filename ||
          file.public_id ||
          "",
        alt: "",
        isPrimary:
          images.length === 0 &&
          index === 0,
      });
    });
  }

  // --------------------------------------------
  // Make first image primary
  // --------------------------------------------

  if (images.length > 0) {
    images.forEach(
      (image, index) => {
        image.isPrimary =
          index === 0;
      }
    );
  }

  return images;
};

// ======================================================
// HELPER — ERROR HANDLER
// ======================================================

const handleProductError = (
  error,
  res,
  label = "Product"
) => {
  console.error(
    `${label} Error:`,
    error
  );

  // Duplicate key
  if (error.code === 11000) {
    const field =
      Object.keys(
        error.keyPattern || {}
      )[0];

    return res.status(400).json({
      success: false,
      message: field
        ? `${field} already exists.`
        : "Duplicate value already exists.",
    });
  }

  // Invalid MongoDB ObjectId
  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ${error.path || "ID"}.`,
    });
  }

  // Mongoose validation
  if (
    error.name === "ValidationError"
  ) {
    const message =
      Object.values(error.errors)
        .map(
          (item) => item.message
        )
        .join(", ");

    return res.status(400).json({
      success: false,
      message,
    });
  }

  return res.status(500).json({
    success: false,
    message:
      "Internal Server Error.",
  });
};

// ======================================================
// CREATE PRODUCT
// POST /api/v1/products
// ADMIN
// ======================================================

export const createProduct = async (
  req,
  res
) => {
  try {
    const {
      name,
      slug,
      shortDescription,
      description,

      category,
      subcategory,

      gender,

      price,
      salePrice,
      discountPrice,

      stock,
      sku,

      sizes,
      colors,

      isFeatured,
      isTrending,
      isNewArrival,
      isActive,

      freeDelivery,
      returnable,
      returnDays,
    } = req.body;

    // ==================================================
    // REQUIRED — NAME
    // ==================================================

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Product name is required.",
      });
    }

    // ==================================================
    // REQUIRED — DESCRIPTION
    // ==================================================

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Product description is required.",
      });
    }

    // ==================================================
    // REQUIRED — CATEGORY
    // ==================================================

    if (!category) {
      return res.status(400).json({
        success: false,
        message:
          "Product category is required.",
      });
    }

    // ==================================================
    // CATEGORY VALIDATION
    // ==================================================

    const categoryCheck =
      await validateCategories(
        category,
        subcategory || null
      );

    if (!categoryCheck.success) {
      return res
        .status(
          categoryCheck.status
        )
        .json({
          success: false,
          message:
            categoryCheck.message,
        });
    }

    // ==================================================
    // PRICE
    // ==================================================

    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product price is required.",
      });
    }

    const numericPrice =
      Number(price);

    if (
      Number.isNaN(numericPrice) ||
      numericPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product price must be a valid number.",
      });
    }

    // ==================================================
    // SALE PRICE
    // ==================================================

    // Accept both salePrice and old discountPrice.
    // Product schema uses salePrice.

    const rawSalePrice =
      salePrice !== undefined
        ? salePrice
        : discountPrice;

    let finalSalePrice = null;

    if (
      rawSalePrice !== undefined &&
      rawSalePrice !== null &&
      rawSalePrice !== ""
    ) {
      finalSalePrice =
        Number(rawSalePrice);

      if (
        Number.isNaN(finalSalePrice) ||
        finalSalePrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Sale price must be a valid number.",
        });
      }

      if (
        finalSalePrice >
        numericPrice
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Sale price cannot be greater than original price.",
        });
      }
    }

    // ==================================================
    // STOCK
    // ==================================================

    const numericStock =
      stock === undefined ||
      stock === ""
        ? 0
        : Number(stock);

    if (
      Number.isNaN(numericStock) ||
      numericStock < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Stock must be a valid number.",
      });
    }

    // ==================================================
    // SLUG
    // ==================================================

    const generatedSlug =
      createSlug(
        slug?.trim() || name
      );

    if (!generatedSlug) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to generate product slug.",
      });
    }

    // ==================================================
    // CHECK DUPLICATE SLUG
    // ==================================================

    const slugExists =
      await Product.findOne({
        slug: generatedSlug,
      });

    if (slugExists) {
      return res.status(400).json({
        success: false,
        message:
          "A product with this name already exists.",
      });
    }
        // ==================================================
    // IMAGES
    // ==================================================

    const productImages =
      normalizeImages(
        req.body.images,
        req.files
      );

    // Product schema requires minimum 4 images.
    if (productImages.length < 4) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload at least 4 product images.",
      });
    }

    if (productImages.length > 10) {
      return res.status(400).json({
        success: false,
        message:
          "You can upload maximum 10 product images.",
      });
    }

    // ==================================================
    // SIZES
    // ==================================================

    const productSizes =
      parseArray(sizes);

    // ==================================================
    // COLORS
    // ==================================================

    const productColors =
      parseArray(colors);

    // ==================================================
    // NORMALIZE SIZES
    // ==================================================

    const normalizedSizes =
      productSizes
        .filter(Boolean)
        .map((item) => {
          // ------------------------------------------
          // If frontend sends:
          // "M"
          // ------------------------------------------

          if (
            typeof item === "string"
          ) {
            return {
              size: item.trim(),
              stock: 0,
              sku: "",
            };
          }

          // ------------------------------------------
          // If frontend sends:
          // { size: "M", stock: 10, sku: "ABC-M" }
          // ------------------------------------------

          return {
            size:
              item?.size
                ?.toString()
                .trim() || "",

            stock:
              Number(item?.stock) >= 0
                ? Number(item.stock)
                : 0,

            sku:
              item?.sku
                ?.toString()
                .trim()
                .toUpperCase() || "",
          };
        })
        .filter(
          (item) => item.size
        );

    // ==================================================
    // NORMALIZE COLORS
    // ==================================================

    const normalizedColors =
      productColors
        .filter(Boolean)
        .map((item) => {
          // ------------------------------------------
          // If frontend sends:
          // "Black"
          // ------------------------------------------

          if (
            typeof item === "string"
          ) {
            return {
              name: item.trim(),
              hex: "",
            };
          }

          // ------------------------------------------
          // If frontend sends:
          // { name: "Black", hex: "#000000" }
          // ------------------------------------------

          return {
            name:
              item?.name
                ?.toString()
                .trim() || "",

            hex:
              item?.hex
                ?.toString()
                .trim() || "",
          };
        })
        .filter(
          (item) => item.name
        );

    // ==================================================
    // GENDER
    // ==================================================

    const allowedGenders = [
      "men",
      "women",
      "kids",
      "unisex",
    ];

    const finalGender =
      gender
        ?.toString()
        .trim()
        .toLowerCase() || "unisex";

    if (
      !allowedGenders.includes(
        finalGender
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid product gender.",
      });
    }

    // ==================================================
    // SKU
    // ==================================================

    const finalSku =
      sku?.toString().trim()
        ? sku
            .toString()
            .trim()
            .toUpperCase()
        : undefined;

    // ==================================================
    // CHECK SKU DUPLICATE
    // ==================================================

    if (finalSku) {
      const existingSku =
        await Product.findOne({
          sku: finalSku,
        });

      if (existingSku) {
        return res.status(400).json({
          success: false,
          message:
            "This SKU already exists.",
        });
      }
    }

    // ==================================================
    // RETURN DAYS
    // ==================================================

    let finalReturnDays = 7;

    if (
      returnDays !== undefined &&
      returnDays !== ""
    ) {
      finalReturnDays =
        Number(returnDays);

      if (
        Number.isNaN(
          finalReturnDays
        ) ||
        finalReturnDays < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Return days must be a valid number.",
        });
      }
    }

    // ==================================================
    // CREATE PRODUCT
    // ==================================================

    const product =
      await Product.create({
        // --------------------------------------------
        // BASIC INFORMATION
        // --------------------------------------------

        name: name.trim(),

        slug: generatedSlug,

        shortDescription:
          shortDescription
            ?.toString()
            .trim() || "",

        description:
          description.trim(),

        // --------------------------------------------
        // CATEGORY
        // --------------------------------------------

        category:
          categoryCheck
            .category._id,

        subcategory:
          categoryCheck
            .subcategory?._id || null,

        // --------------------------------------------
        // GENDER
        // --------------------------------------------

        gender: finalGender,

        // --------------------------------------------
        // PRICING
        // --------------------------------------------

        price:
          numericPrice,

        salePrice:
          finalSalePrice,

        // --------------------------------------------
        // INVENTORY
        // --------------------------------------------

        stock:
          numericStock,

        sku:
          finalSku,

        // --------------------------------------------
        // SIZE / COLOR
        // --------------------------------------------

        sizes:
          normalizedSizes,

        colors:
          normalizedColors,

        // --------------------------------------------
        // IMAGES
        // --------------------------------------------

        images:
          productImages,

        // --------------------------------------------
        // PRODUCT SETTINGS
        // --------------------------------------------

        isFeatured:
          parseBoolean(
            isFeatured,
            false
          ),

        isTrending:
          parseBoolean(
            isTrending,
            false
          ),

        isNewArrival:
          parseBoolean(
            isNewArrival,
            true
          ),

        isActive:
          parseBoolean(
            isActive,
            true
          ),

        // --------------------------------------------
        // DELIVERY
        // --------------------------------------------

        freeDelivery:
          parseBoolean(
            freeDelivery,
            false
          ),

        // --------------------------------------------
        // RETURN
        // --------------------------------------------

        returnable:
          parseBoolean(
            returnable,
            true
          ),

        returnDays:
          finalReturnDays,
      });

    // ==================================================
    // POPULATE CATEGORY
    // ==================================================

    await product.populate([
      {
        path: "category",
        select:
          "name slug image",
      },
      {
        path: "subcategory",
        select:
          "name slug image parent",
      },
    ]);

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(201).json({
      success: true,
      message:
        "Product created successfully.",
      product,
    });

  } catch (error) {
    return handleProductError(
      error,
      res,
      "Create Product"
    );
  }
};
// ======================================================
// GET ALL PRODUCTS
// GET /api/v1/products
// ======================================================

export const getProducts = async (
  req,
  res
) => {
  try {
    const {
      search = "",
      category,
      subcategory,
      gender,
      minPrice,
      maxPrice,
      size,
      color,
      sort = "newest",
      page = 1,
      limit = 20,
    } = req.query;

    // ==================================================
    // QUERY
    // ==================================================

    const query = {
      isActive: true,
    };

    // ==================================================
    // SEARCH
    // ==================================================

    if (search.trim()) {
      query.$text = {
        $search: search.trim(),
      };
    }

    // ==================================================
    // CATEGORY
    // ==================================================

    if (category) {
      const categoryDoc =
        await resolveCategory(
          category
        );

      if (!categoryDoc) {
        return res.status(200).json({
          success: true,
          products: [],
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: 0,
            pages: 0,
          },
        });
      }

      query.category =
        categoryDoc._id;
    }

    // ==================================================
    // SUBCATEGORY
    // ==================================================

    if (subcategory) {
      const subcategoryDoc =
        await resolveCategory(
          subcategory
        );

      if (!subcategoryDoc) {
        return res.status(200).json({
          success: true,
          products: [],
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: 0,
            pages: 0,
          },
        });
      }

      query.subcategory =
        subcategoryDoc._id;
    }

    // ==================================================
    // GENDER
    // ==================================================

    if (gender) {
      const normalizedGender =
        gender
          .toString()
          .trim()
          .toLowerCase();

      if (
        [
          "men",
          "women",
          "kids",
          "unisex",
        ].includes(normalizedGender)
      ) {
        query.gender =
          normalizedGender;
      }
    }

    // ==================================================
    // PRICE RANGE
    // ==================================================

    if (
      minPrice !== undefined ||
      maxPrice !== undefined
    ) {
      query.price = {};

      if (
        minPrice !== undefined &&
        minPrice !== ""
      ) {
        query.price.$gte =
          Number(minPrice);
      }

      if (
        maxPrice !== undefined &&
        maxPrice !== ""
      ) {
        query.price.$lte =
          Number(maxPrice);
      }
    }

    // ==================================================
    // SIZE
    // ==================================================

    if (size?.trim()) {
      query["sizes.size"] = {
        $regex:
          `^${escapeRegex(
            size.trim()
          )}$`,
        $options: "i",
      };
    }

    // ==================================================
    // COLOR
    // ==================================================

    if (color?.trim()) {
      query["colors.name"] = {
        $regex:
          escapeRegex(
            color.trim()
          ),
        $options: "i",
      };
    }

    // ==================================================
    // PAGINATION
    // ==================================================

    const currentPage =
      Math.max(
        Number(page) || 1,
        1
      );

    const perPage =
      Math.min(
        Math.max(
          Number(limit) || 20,
          1
        ),
        100
      );

    const skip =
      (currentPage - 1) *
      perPage;

    // ==================================================
    // SORT
    // ==================================================

    let sortOption = {
      createdAt: -1,
    };

    switch (
      sort.toString().toLowerCase()
    ) {
      case "oldest":
        sortOption = {
          createdAt: 1,
        };
        break;

      case "price-low-high":
        sortOption = {
          price: 1,
        };
        break;

      case "price-high-low":
        sortOption = {
          price: -1,
        };
        break;

      case "name-a-z":
        sortOption = {
          name: 1,
        };
        break;

      case "name-z-a":
        sortOption = {
          name: -1,
        };
        break;

      case "newest":
      default:
        sortOption = {
          createdAt: -1,
        };
        break;
    }

    // ==================================================
    // FETCH
    // ==================================================

    const [
      products,
      total,
    ] = await Promise.all([
      Product.find(query)
        .populate(
          "category",
          "name slug image"
        )
        .populate(
          "subcategory",
          "name slug image parent"
        )
        .sort(sortOption)
        .skip(skip)
        .limit(perPage)
        .lean(),

      Product.countDocuments(query),
    ]);

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      products,

      pagination: {
        page: currentPage,
        limit: perPage,
        total,
        pages:
          Math.ceil(
            total / perPage
          ),
      },
    });

  } catch (error) {
    return handleProductError(
      error,
      res,
      "Get Products"
    );
  }
};

// ======================================================
// GET SINGLE PRODUCT
// GET /api/v1/products/:id
// ======================================================

export const getProductById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid product ID.",
      });
    }

    const product =
      await Product.findOne({
        _id: id,
        isActive: true,
      })
        .populate(
          "category",
          "name slug image"
        )
        .populate(
          "subcategory",
          "name slug image parent"
        );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    return handleProductError(
      error,
      res,
      "Get Product"
    );
  }
};

// ======================================================
// GET PRODUCT BY SLUG
// GET /api/v1/products/slug/:slug
// ======================================================

export const getProductBySlug =
  async (req, res) => {
    try {
      const { slug } =
        req.params;

      if (!slug?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Product slug is required.",
        });
      }

      const product =
        await Product.findOne({
          slug:
            slug
              .trim()
              .toLowerCase(),
          isActive: true,
        })
          .populate(
            "category",
            "name slug image"
          )
          .populate(
            "subcategory",
            "name slug image parent"
          );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found.",
        });
      }

      return res.status(200).json({
        success: true,
        product,
      });

    } catch (error) {
      return handleProductError(
        error,
        res,
        "Get Product By Slug"
      );
    }
  };

// ======================================================
// FEATURED PRODUCTS
// GET /api/v1/products/featured
// ======================================================

export const getFeaturedProducts =
  async (req, res) => {
    try {
      const products =
        await Product.find({
          isActive: true,
          isFeatured: true,
        })
          .populate(
            "category",
            "name slug image"
          )
          .sort({
            createdAt: -1,
          })
          .limit(20)
          .lean();

      return res.status(200).json({
        success: true,
        products,
      });

    } catch (error) {
      return handleProductError(
        error,
        res,
        "Get Featured Products"
      );
    }
  };

// ======================================================
// TRENDING PRODUCTS
// GET /api/v1/products/trending
// ======================================================

export const getTrendingProducts =
  async (req, res) => {
    try {
      const products =
        await Product.find({
          isActive: true,
          isTrending: true,
        })
          .populate(
            "category",
            "name slug image"
          )
          .sort({
            createdAt: -1,
          })
          .limit(20)
          .lean();

      return res.status(200).json({
        success: true,
        products,
      });

    } catch (error) {
      return handleProductError(
        error,
        res,
        "Get Trending Products"
      );
    }
  };

// ======================================================
// NEW ARRIVALS
// GET /api/v1/products/new-arrivals
// ======================================================

export const getNewArrivals =
  async (req, res) => {
    try {
      const products =
        await Product.find({
          isActive: true,
          isNewArrival: true,
        })
          .populate(
            "category",
            "name slug image"
          )
          .sort({
            createdAt: -1,
          })
          .limit(20)
          .lean();

      return res.status(200).json({
        success: true,
        products,
      });

    } catch (error) {
      return handleProductError(
        error,
        res,
        "Get New Arrivals"
      );
    }
  };
  // ======================================================
// RELATED PRODUCTS
// GET /api/v1/products/:id/related
// ======================================================

export const getRelatedProducts =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      // ==================================================
      // VALIDATE ID
      // ==================================================

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid product ID.",
        });
      }

      // ==================================================
      // CURRENT PRODUCT
      // ==================================================

      const currentProduct =
        await Product.findOne({
          _id: id,
          isActive: true,
        }).select(
          "category subcategory gender"
        );

      if (!currentProduct) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found.",
        });
      }

      // ==================================================
      // RELATED QUERY
      // ==================================================

      const relatedQuery = {
        _id: {
          $ne: id,
        },

        isActive: true,

        $or: [
          {
            category:
              currentProduct.category,
          },
          {
            subcategory:
              currentProduct.subcategory,
          },
          {
            gender:
              currentProduct.gender,
          },
        ],
      };

      // ==================================================
      // GET RELATED PRODUCTS
      // ==================================================

      const products =
        await Product.find(
          relatedQuery
        )
          .populate(
            "category",
            "name slug image"
          )
          .populate(
            "subcategory",
            "name slug image parent"
          )
          .sort({
            createdAt: -1,
          })
          .limit(12)
          .lean();

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({
        success: true,
        products,
      });

    } catch (error) {
      return handleProductError(
        error,
        res,
        "Get Related Products"
      );
    }
  };

// ======================================================
// UPDATE PRODUCT
// PUT /api/v1/products/:id
// ADMIN
// ======================================================

export const updateProduct = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    // ==================================================
    // VALIDATE PRODUCT ID
    // ==================================================

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid product ID.",
      });
    }

    // ==================================================
    // FIND PRODUCT
    // ==================================================

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found.",
      });
    }

    // ==================================================
    // REQUEST DATA
    // ==================================================

    const {
      name,
      slug,
      shortDescription,
      description,

      category,
      subcategory,

      gender,

      price,
      salePrice,
      discountPrice,

      stock,
      sku,

      sizes,
      colors,

      isFeatured,
      isTrending,
      isNewArrival,
      isActive,

      freeDelivery,
      returnable,
      returnDays,
    } = req.body;

    // ==================================================
    // NAME
    // ==================================================

    if (
      name !== undefined &&
      !name?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product name cannot be empty.",
      });
    }

    // ==================================================
    // DESCRIPTION
    // ==================================================

    if (
      description !== undefined &&
      !description?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product description cannot be empty.",
      });
    }

    // ==================================================
    // CATEGORY
    // ==================================================

    let finalCategory =
      product.category;

    let finalSubcategory =
      product.subcategory;

    if (
      category !== undefined ||
      subcategory !== undefined
    ) {
      const categoryCheck =
        await validateCategories(
          category !== undefined
            ? category
            : product.category,

          subcategory !== undefined
            ? subcategory
            : product.subcategory
        );

      if (!categoryCheck.success) {
        return res
          .status(
            categoryCheck.status
          )
          .json({
            success: false,
            message:
              categoryCheck.message,
          });
      }

      finalCategory =
        categoryCheck
          .category._id;

      finalSubcategory =
        categoryCheck
          .subcategory?._id ||
        null;
    }

    // ==================================================
    // PRICE
    // ==================================================

    let finalPrice =
      product.price;

    if (
      price !== undefined &&
      price !== ""
    ) {
      finalPrice =
        Number(price);

      if (
        Number.isNaN(finalPrice) ||
        finalPrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Product price must be a valid number.",
        });
      }
    }

    // ==================================================
    // SALE PRICE
    // ==================================================

    const rawSalePrice =
      salePrice !== undefined
        ? salePrice
        : discountPrice !== undefined
          ? discountPrice
          : undefined;

    let finalSalePrice =
      product.salePrice;

    if (
      rawSalePrice !== undefined
    ) {
      if (
        rawSalePrice === "" ||
        rawSalePrice === null
      ) {
        finalSalePrice =
          null;
      } else {
        finalSalePrice =
          Number(rawSalePrice);

        if (
          Number.isNaN(
            finalSalePrice
          ) ||
          finalSalePrice < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Sale price must be a valid number.",
          });
        }

        if (
          finalSalePrice >
          finalPrice
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Sale price cannot be greater than original price.",
          });
        }
      }
    }

    // ==================================================
    // STOCK
    // ==================================================

    let finalStock =
      product.stock;

    if (
      stock !== undefined &&
      stock !== ""
    ) {
      finalStock =
        Number(stock);

      if (
        Number.isNaN(
          finalStock
        ) ||
        finalStock < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Stock must be a valid number.",
        });
      }
    }

    // ==================================================
    // SLUG
    // ==================================================

    let finalSlug =
      product.slug;

    if (
      slug !== undefined ||
      name !== undefined
    ) {
      finalSlug =
        createSlug(
          slug?.trim() ||
            name?.trim() ||
            product.name
        );
    }

    // ==================================================
    // DUPLICATE SLUG
    // ==================================================

    const slugExists =
      await Product.findOne({
        slug: finalSlug,
        _id: {
          $ne: id,
        },
      });

    if (slugExists) {
      return res.status(400).json({
        success: false,
        message:
          "A product with this name already exists.",
      });
    }

    // ==================================================
    // SKU
    // ==================================================

    let finalSku =
      product.sku;

    if (sku !== undefined) {
      finalSku =
        sku?.trim()
          ? sku
              .trim()
              .toUpperCase()
          : undefined;
    }

    // ==================================================
    // DUPLICATE SKU
    // ==================================================

    if (finalSku) {
      const skuExists =
        await Product.findOne({
          sku: finalSku,
          _id: {
            $ne: id,
          },
        });

      if (skuExists) {
        return res.status(400).json({
          success: false,
          message:
            "This SKU already exists.",
        });
      }
    }

    // ==================================================
    // SIZES
    // ==================================================

    let finalSizes =
      product.sizes || [];

    if (sizes !== undefined) {
      const parsedSizes =
        parseArray(sizes);

      finalSizes =
        parsedSizes
          .filter(Boolean)
          .map((item) => {
            if (
              typeof item ===
              "string"
            ) {
              return {
                size:
                  item.trim(),
                stock: 0,
                sku: "",
              };
            }

            return {
              size:
                item?.size
                  ?.toString()
                  .trim() || "",

              stock:
                Number(item?.stock) >= 0
                  ? Number(item.stock)
                  : 0,

              sku:
                item?.sku
                  ?.toString()
                  .trim()
                  .toUpperCase() || "",
            };
          })
          .filter(
            (item) =>
              item.size
          );
    }

    // ==================================================
    // COLORS
    // ==================================================

    let finalColors =
      product.colors || [];

    if (colors !== undefined) {
      const parsedColors =
        parseArray(colors);

      finalColors =
        parsedColors
          .filter(Boolean)
          .map((item) => {
            if (
              typeof item ===
              "string"
            ) {
              return {
                name:
                  item.trim(),
                hex: "",
              };
            }

            return {
              name:
                item?.name
                  ?.toString()
                  .trim() || "",

              hex:
                item?.hex
                  ?.toString()
                  .trim() || "",
            };
          })
          .filter(
            (item) =>
              item.name
          );
    }

    // ==================================================
    // IMAGES
    // ==================================================

    let finalImages =
      product.images || [];

    const newImages =
      normalizeImages(
        req.body.images,
        req.files
      );

    if (newImages.length > 0) {
      finalImages = [
        ...finalImages,
        ...newImages,
      ];

      finalImages =
        finalImages
          .slice(0, 10)
          .map(
            (image, index) => ({
              ...image,
              isPrimary:
                index === 0,
            })
          );
    }

    // ==================================================
    // IMAGE VALIDATION
    // ==================================================

    if (
      finalImages.length < 4
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product must have at least 4 images.",
      });
    }

    if (
      finalImages.length > 10
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product can have maximum 10 images.",
      });
    }

    // ==================================================
    // RETURN DAYS
    // ==================================================

    let finalReturnDays =
      product.returnDays;

    if (
      returnDays !== undefined &&
      returnDays !== ""
    ) {
      finalReturnDays =
        Number(returnDays);

      if (
        Number.isNaN(
          finalReturnDays
        ) ||
        finalReturnDays < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Return days must be a valid number.",
        });
      }
    }

    // ==================================================
    // UPDATE FIELDS
    // ==================================================

    product.name =
      name !== undefined
        ? name.trim()
        : product.name;

    product.slug =
      finalSlug;

    product.shortDescription =
      shortDescription !== undefined
        ? shortDescription
            .toString()
            .trim()
        : product.shortDescription;

    product.description =
      description !== undefined
        ? description.trim()
        : product.description;

    product.category =
      finalCategory;

    product.subcategory =
      finalSubcategory;

    product.gender =
      gender !== undefined
        ? gender
            .toString()
            .trim()
            .toLowerCase()
        : product.gender;

    product.price =
      finalPrice;

    product.salePrice =
      finalSalePrice;

    product.stock =
      finalStock;

    product.sku =
      finalSku;

    product.sizes =
      finalSizes;

    product.colors =
      finalColors;

    product.images =
      finalImages;

    product.isFeatured =
      isFeatured !== undefined
        ? parseBoolean(
            isFeatured,
            false
          )
        : product.isFeatured;

    product.isTrending =
      isTrending !== undefined
        ? parseBoolean(
            isTrending,
            false
          )
        : product.isTrending;

    product.isNewArrival =
      isNewArrival !== undefined
        ? parseBoolean(
            isNewArrival,
            true
          )
        : product.isNewArrival;

    product.isActive =
      isActive !== undefined
        ? parseBoolean(
            isActive,
            true
          )
        : product.isActive;

    product.freeDelivery =
      freeDelivery !== undefined
        ? parseBoolean(
            freeDelivery,
            false
          )
        : product.freeDelivery;

    product.returnable =
      returnable !== undefined
        ? parseBoolean(
            returnable,
            true
          )
        : product.returnable;

    product.returnDays =
      finalReturnDays;

    // ==================================================
    // SAVE
    // ==================================================

    await product.save();

    // ==================================================
    // POPULATE
    // ==================================================

    await product.populate([
      {
        path: "category",
        select:
          "name slug image",
      },
      {
        path: "subcategory",
        select:
          "name slug image parent",
      },
    ]);

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,
      message:
        "Product updated successfully.",
      product,
    });

  } catch (error) {
    return handleProductError(
      error,
      res,
      "Update Product"
    );
  }
};
// ======================================================
// DELETE PRODUCT
// DELETE /api/v1/products/:id
// ADMIN
//
// SOFT DELETE
// ======================================================

export const deleteProduct = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    // ==================================================
    // VALIDATE ID
    // ==================================================

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid product ID.",
      });
    }

    // ==================================================
    // FIND PRODUCT
    // ==================================================

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found.",
      });
    }

    // ==================================================
    // ALREADY DELETED
    // ==================================================

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message:
          "Product is already inactive.",
      });
    }

    // ==================================================
    // SOFT DELETE
    // ==================================================

    product.isActive = false;

    await product.save();

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,
      message:
        "Product deleted successfully.",
      product,
    });

  } catch (error) {
    return handleProductError(
      error,
      res,
      "Delete Product"
    );
  }
};


// ======================================================
// RESTORE PRODUCT
// PATCH /api/v1/products/:id/restore
// ADMIN
// ======================================================

export const restoreProduct = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    // ==================================================
    // VALIDATE ID
    // ==================================================

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid product ID.",
      });
    }

    // ==================================================
    // FIND PRODUCT
    // ==================================================

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found.",
      });
    }

    // ==================================================
    // ALREADY ACTIVE
    // ==================================================

    if (product.isActive) {
      return res.status(400).json({
        success: false,
        message:
          "Product is already active.",
      });
    }

    // ==================================================
    // RESTORE
    // ==================================================

    product.isActive = true;

    await product.save();

    // ==================================================
    // POPULATE
    // ==================================================

    await product.populate([
      {
        path: "category",
        select:
          "name slug image",
      },
      {
        path: "subcategory",
        select:
          "name slug image parent",
      },
    ]);

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,
      message:
        "Product restored successfully.",
      product,
    });

  } catch (error) {
    return handleProductError(
      error,
      res,
      "Restore Product"
    );
  }
};


// ======================================================
// GET ADMIN PRODUCTS
// GET /api/v1/products/admin/all
// ADMIN
//
// Includes:
// - Active products
// - Inactive products
// - Soft deleted products
// ======================================================

export const getAdminProducts =
  async (req, res) => {
    try {
      const {
        search = "",
        category,
        gender,
        status = "all",
        sort = "newest",
        page = 1,
        limit = 20,
      } = req.query;

      // ==================================================
      // QUERY
      // ==================================================

      const query = {};

      // ==================================================
      // STATUS FILTER
      // ==================================================

      if (
        status === "active"
      ) {
        query.isActive = true;
      }

      if (
        status === "inactive" ||
        status === "deleted"
      ) {
        query.isActive = false;
      }

      // ==================================================
      // SEARCH
      // ==================================================

      if (search.trim()) {
        query.$text = {
          $search:
            search.trim(),
        };
      }

      // ==================================================
      // CATEGORY FILTER
      // ==================================================

      if (category) {
        const categoryDoc =
          await resolveCategory(
            category
          );

        if (!categoryDoc) {
          return res.status(200).json({
            success: true,
            products: [],
            pagination: {
              page:
                Number(page),
              limit:
                Number(limit),
              total: 0,
              pages: 0,
            },
          });
        }

        query.category =
          categoryDoc._id;
      }

      // ==================================================
      // GENDER FILTER
      // ==================================================

      if (gender) {
        const normalizedGender =
          gender
            .toString()
            .trim()
            .toLowerCase();

        if (
          [
            "men",
            "women",
            "kids",
            "unisex",
          ].includes(
            normalizedGender
          )
        ) {
          query.gender =
            normalizedGender;
        }
      }

      // ==================================================
      // PAGINATION
      // ==================================================

      const currentPage =
        Math.max(
          Number(page) || 1,
          1
        );

      const perPage =
        Math.min(
          Math.max(
            Number(limit) || 20,
            1
          ),
          100
        );

      const skip =
        (currentPage - 1) *
        perPage;

      // ==================================================
      // SORT
      // ==================================================

      let sortOption = {
        createdAt: -1,
      };

      switch (
        sort
          .toString()
          .toLowerCase()
      ) {
        case "oldest":
          sortOption = {
            createdAt: 1,
          };
          break;

        case "price-low-high":
          sortOption = {
            price: 1,
          };
          break;

        case "price-high-low":
          sortOption = {
            price: -1,
          };
          break;

        case "name-a-z":
          sortOption = {
            name: 1,
          };
          break;

        case "name-z-a":
          sortOption = {
            name: -1,
          };
          break;

        case "newest":
        default:
          sortOption = {
            createdAt: -1,
          };
          break;
      }

      // ==================================================
      // FETCH
      // ==================================================

      const [
        products,
        total,
      ] = await Promise.all([
        Product.find(query)
          .populate(
            "category",
            "name slug image"
          )
          .populate(
            "subcategory",
            "name slug image parent"
          )
          .sort(sortOption)
          .skip(skip)
          .limit(perPage)
          .lean(),

        Product.countDocuments(
          query
        ),
      ]);

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({
        success: true,

        products,

        pagination: {
          page: currentPage,
          limit: perPage,
          total,
          pages:
            Math.ceil(
              total / perPage
            ),
        },
      });

    } catch (error) {
      return handleProductError(
        error,
        res,
        "Get Admin Products"
      );
    }
  };
  