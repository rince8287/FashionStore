import mongoose from "mongoose";
import Category from "../models/Category.js";

// ======================================================
// HELPER - CREATE SLUG
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
// HELPER - VALIDATE OBJECT ID
// ======================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ======================================================
// CREATE CATEGORY
// POST /api/v1/categories
// ADMIN
// ======================================================

export const createCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      image,
      parent,
      isActive,
      isFeatured,
      sortOrder,
    } = req.body;

    // ==================================================
    // NAME VALIDATION
    // ==================================================

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    // ==================================================
    // GENERATE SLUG
    // ==================================================

    const generatedSlug =
      slug?.trim()
        ? createSlug(slug)
        : createSlug(name);

    if (!generatedSlug) {
      return res.status(400).json({
        success: false,
        message: "Unable to generate category slug.",
      });
    }

    // ==================================================
    // CHECK DUPLICATE SLUG
    // ==================================================

    const existingCategory =
      await Category.findOne({
        slug: generatedSlug,
      });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message:
          existingCategory.isActive
            ? "Category already exists."
            : "This category already exists but is inactive. Restore it instead of creating a duplicate.",
      });
    }

    // ==================================================
    // PARENT VALIDATION
    // ==================================================

    let parentId = null;

    if (parent) {
      if (!isValidObjectId(parent)) {
        return res.status(400).json({
          success: false,
          message: "Invalid parent category ID.",
        });
      }

      const parentCategory =
        await Category.findById(parent);

      if (!parentCategory) {
        return res.status(404).json({
          success: false,
          message: "Parent category not found.",
        });
      }

      if (!parentCategory.isActive) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot create a subcategory under an inactive category.",
        });
      }

      parentId = parentCategory._id;
    }

    // ==================================================
    // CREATE CATEGORY
    // ==================================================

    const category =
      await Category.create({
        name: name.trim(),

        slug: generatedSlug,

        description:
          typeof description === "string"
            ? description.trim()
            : "",

        image:
          typeof image === "string"
            ? image.trim()
            : "",

        parent: parentId,

        isActive:
          typeof isActive === "boolean"
            ? isActive
            : true,

        isFeatured:
          typeof isFeatured === "boolean"
            ? isFeatured
            : false,

        sortOrder:
          Number.isFinite(
            Number(sortOrder)
          )
            ? Number(sortOrder)
            : 0,
      });

    // ==================================================
    // POPULATE PARENT
    // ==================================================

    await category.populate(
      "parent",
      "name slug"
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(201).json({
      success: true,
      message:
        "Category created successfully.",
      category,
    });
  } catch (error) {
    console.error(
      "Create Category Error:",
      error
    );

    // ==================================================
    // DUPLICATE KEY
    // ==================================================

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Category slug already exists.",
      });
    }

    // ==================================================
    // CAST ERROR
    // ==================================================

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message:
          "Invalid category ID.",
      });
    }

    // ==================================================
    // VALIDATION ERROR
    // ==================================================

    if (
      error.name ===
      "ValidationError"
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

    // ==================================================
    // SERVER ERROR
    // ==================================================

    return res.status(500).json({
      success: false,
      message:
        "Internal Server Error",
    });
  }
};

// ======================================================
// GET ALL CATEGORIES
// GET /api/v1/categories
// PUBLIC / ADMIN
//
// Supported:
//
// /categories
// /categories?active=true
// /categories?active=false
// /categories?featured=true
// /categories?parent=root
// /categories?search=men
// ======================================================

export const getCategories = async (
  req,
  res
) => {
  try {
    const {
      active,
      featured,
      parent,
      search,
    } = req.query;

    const filter = {};

    // ==================================================
    // ACTIVE FILTER
    // ==================================================

    if (active === "true") {
      filter.isActive = true;
    }

    if (active === "false") {
      filter.isActive = false;
    }

    // ==================================================
    // FEATURED FILTER
    // ==================================================

    if (featured === "true") {
      filter.isFeatured = true;
    }

    if (featured === "false") {
      filter.isFeatured = false;
    }

    // ==================================================
    // PARENT FILTER
    // ==================================================

    if (parent === "root") {
      filter.parent = null;
    } else if (parent) {
      if (!isValidObjectId(parent)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid parent category ID.",
        });
      }

      filter.parent = parent;
    }

    // ==================================================
    // SEARCH
    // ==================================================

    if (search?.trim()) {
      filter.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // ==================================================
    // FETCH
    // ==================================================

    const categories =
      await Category.find(filter)
        .populate(
          "parent",
          "name slug"
        )
        .sort({
          sortOrder: 1,
          name: 1,
        });

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error(
      "Get Categories Error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message:
          "Invalid category ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Internal Server Error",
    });
  }
};

// ======================================================
// GET CATEGORY TREE
// GET /api/v1/categories/tree
// PUBLIC
//
// ONLY ACTIVE CATEGORIES
// ======================================================

export const getCategoryTree = async (
  req,
  res
) => {
  try {
    const categories =
      await Category.find({
        isActive: true,
      })
        .select(
          "name slug description image parent isFeatured sortOrder isActive"
        )
        .sort({
          sortOrder: 1,
          name: 1,
        })
        .lean();

    // ==================================================
    // CATEGORY MAP
    // ==================================================

    const categoryMap = {};

    categories.forEach(
      (category) => {
        categoryMap[
          category._id.toString()
        ] = {
          ...category,
          children: [],
        };
      }
    );

    // ==================================================
    // BUILD TREE
    // ==================================================

    const tree = [];

    categories.forEach(
      (category) => {
        const categoryId =
          category._id.toString();

        if (category.parent) {
          const parentId =
            category.parent.toString();

          if (categoryMap[parentId]) {
            categoryMap[
              parentId
            ].children.push(
              categoryMap[categoryId]
            );
          } else {
            tree.push(
              categoryMap[categoryId]
            );
          }
        } else {
          tree.push(
            categoryMap[categoryId]
          );
        }
      }
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,
      count: tree.length,
      categories: tree,
    });
  } catch (error) {
    console.error(
      "Get Category Tree Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal Server Error",
    });
  }
};

// ======================================================
// GET CATEGORY BY ID
// GET /api/v1/categories/:id
// PUBLIC
// ======================================================

export const getCategoryById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // ==================================================
    // ID VALIDATION
    // ==================================================

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid category ID.",
      });
    }

    // ==================================================
    // FIND CATEGORY
    // ==================================================

    const category =
      await Category.findById(id)
        .populate(
          "parent",
          "name slug description image"
        );

    if (!category) {
      return res.status(404).json({
        success: false,
        message:
          "Category not found.",
      });
    }

    // ==================================================
    // FIND ACTIVE CHILDREN
    // ==================================================

    const children =
      await Category.find({
        parent: category._id,
        isActive: true,
      }).sort({
        sortOrder: 1,
        name: 1,
      });

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,
      category,
      children,
    });
  } catch (error) {
    console.error(
      "Get Category Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal Server Error",
    });
  }
};

// ======================================================
// GET CATEGORY BY SLUG
// GET /api/v1/categories/slug/:slug
// PUBLIC
//
// ONLY ACTIVE CATEGORY
// ======================================================

export const getCategoryBySlug =
  async (req, res) => {
    try {
      const slug =
        req.params.slug
          ?.toLowerCase()
          .trim();

      if (!slug) {
        return res.status(400).json({
          success: false,
          message:
            "Category slug is required.",
        });
      }

      // ==================================================
      // FIND ACTIVE CATEGORY
      // ==================================================

      const category =
        await Category.findOne({
          slug,
          isActive: true,
        }).populate(
          "parent",
          "name slug description image"
        );

      if (!category) {
        return res.status(404).json({
          success: false,
          message:
            "Category not found.",
        });
      }

      // ==================================================
      // CHILDREN
      // ==================================================

      const children =
        await Category.find({
          parent: category._id,
          isActive: true,
        }).sort({
          sortOrder: 1,
          name: 1,
        });

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({
        success: true,
        category,
        children,
      });
    } catch (error) {
      console.error(
        "Get Category By Slug Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Internal Server Error",
      });
    }
  };

// ======================================================
// GET SUBCATEGORIES
// GET /api/v1/categories/:id/subcategories
// PUBLIC
//
// ONLY ACTIVE SUBCATEGORIES
// ======================================================

export const getSubcategories =
  async (req, res) => {
    try {
      const { id } = req.params;

      // ==================================================
      // ID VALIDATION
      // ==================================================

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid category ID.",
        });
      }

      // ==================================================
      // FIND PARENT
      // ==================================================

      const parentCategory =
        await Category.findById(id);

      if (!parentCategory) {
        return res.status(404).json({
          success: false,
          message:
            "Parent category not found.",
        });
      }

      // ==================================================
      // FIND CHILDREN
      // ==================================================

      const subcategories =
        await Category.find({
          parent: parentCategory._id,
          isActive: true,
        }).sort({
          sortOrder: 1,
          name: 1,
        });

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({
        success: true,

        parent: {
          id: parentCategory._id,
          name: parentCategory.name,
          slug: parentCategory.slug,
        },

        count:
          subcategories.length,

        subcategories,
      });
    } catch (error) {
      console.error(
        "Get Subcategories Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Internal Server Error",
      });
    }
  };

// ======================================================
// UPDATE CATEGORY
// PUT /api/v1/categories/:id
// ADMIN
// ======================================================

export const updateCategory =
  async (req, res) => {
    try {
      const { id } = req.params;

      // ==================================================
      // ID VALIDATION
      // ==================================================

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid category ID.",
        });
      }

      // ==================================================
      // FIND CATEGORY
      // ==================================================

      const category =
        await Category.findById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message:
            "Category not found.",
        });
      }

      const {
        name,
        slug,
        description,
        image,
        parent,
        isActive,
        isFeatured,
        sortOrder,
      } = req.body;

      // ==================================================
      // NAME
      // ==================================================

      if (name !== undefined) {
        if (
          typeof name !== "string" ||
          !name.trim()
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Category name cannot be empty.",
          });
        }

        category.name =
          name.trim();
      }

      // ==================================================
      // SLUG
      // ==================================================

      if (slug !== undefined) {
        const cleanSlug =
          createSlug(slug);

        if (!cleanSlug) {
          return res.status(400).json({
            success: false,
            message:
              "Category slug cannot be empty.",
          });
        }

        const slugExists =
          await Category.findOne({
            slug: cleanSlug,
            _id: {
              $ne: category._id,
            },
          });

        if (slugExists) {
          return res.status(400).json({
            success: false,
            message:
              "Category slug already exists.",
          });
        }

        category.slug =
          cleanSlug;
      }

      // ==================================================
      // PARENT
      // ==================================================

      if (parent !== undefined) {
        // Main category
        if (
          parent === null ||
          parent === ""
        ) {
          category.parent = null;
        } else {
          if (
            !isValidObjectId(parent)
          ) {
            return res.status(400).json({
              success: false,
              message:
                "Invalid parent category ID.",
            });
          }

          // Cannot be own parent
          if (
            parent.toString() ===
            category._id.toString()
          ) {
            return res.status(400).json({
              success: false,
              message:
                "Category cannot be its own parent.",
            });
          }

          const parentCategory =
            await Category.findById(
              parent
            );

          if (!parentCategory) {
            return res.status(404).json({
              success: false,
              message:
                "Parent category not found.",
            });
          }

          if (
            !parentCategory.isActive
          ) {
            return res.status(400).json({
              success: false,
              message:
                "Cannot assign an inactive category as parent.",
            });
          }

          category.parent =
            parentCategory._id;
        }
      }

      // ==================================================
      // DESCRIPTION
      // ==================================================

      if (
        description !== undefined
      ) {
        category.description =
          typeof description ===
          "string"
            ? description.trim()
            : "";
      }

      // ==================================================
      // IMAGE
      // ==================================================

      if (image !== undefined) {
        category.image =
          typeof image === "string"
            ? image.trim()
            : "";
      }

      // ==================================================
      // ACTIVE STATUS
      // ==================================================

      if (
        typeof isActive ===
        "boolean"
      ) {
        // ----------------------------------------------
        // ACTIVATING CATEGORY
        // ----------------------------------------------

        if (
          isActive === true &&
          category.parent
        ) {
          const parentCategory =
            await Category.findById(
              category.parent
            );

          if (
            !parentCategory ||
            !parentCategory.isActive
          ) {
            return res.status(400).json({
              success: false,
              message:
                "Cannot activate this category because its parent category is inactive.",
            });
          }
        }

        category.isActive =
          isActive;
      }

      // ==================================================
      // FEATURED
      // ==================================================

      if (
        typeof isFeatured ===
        "boolean"
      ) {
        category.isFeatured =
          isFeatured;
      }

      // ==================================================
      // SORT ORDER
      // ==================================================

      if (
        sortOrder !== undefined
      ) {
        const numericSortOrder =
          Number(sortOrder);

        if (
          !Number.isFinite(
            numericSortOrder
          ) ||
          numericSortOrder < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Sort order must be a valid non-negative number.",
          });
        }

        category.sortOrder =
          numericSortOrder;
      }

      // ==================================================
      // SAVE
      // ==================================================

      await category.save();

      // ==================================================
      // POPULATE PARENT
      // ==================================================

      await category.populate(
        "parent",
        "name slug"
      );

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({
        success: true,
        message:
          "Category updated successfully.",
        category,
      });
    } catch (error) {
      console.error(
        "Update Category Error:",
        error
      );

      // ==================================================
      // DUPLICATE KEY
      // ==================================================

      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message:
            "Category slug already exists.",
        });
      }

      // ==================================================
      // CAST ERROR
      // ==================================================

      if (
        error.name ===
        "CastError"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid category ID.",
        });
      }

      // ==================================================
      // VALIDATION ERROR
      // ==================================================

      if (
        error.name ===
        "ValidationError"
      ) {
        const message =
          Object.values(
            error.errors
          )
            .map(
              (item) =>
                item.message
            )
            .join(", ");

        return res.status(400).json({
          success: false,
          message,
        });
      }

      // ==================================================
      // SERVER ERROR
      // ==================================================

      return res.status(500).json({
        success: false,
        message:
          "Internal Server Error",
      });
    }
  };

// ======================================================
// DELETE CATEGORY
// DELETE /api/v1/categories/:id
// ADMIN
//
// IMPORTANT:
// SOFT DELETE ONLY
//
// MongoDB se category DELETE nahi hogi.
// Sirf:
// isActive = false
// ======================================================

export const deleteCategory =
  async (req, res) => {
    try {
      const { id } = req.params;

      // ==================================================
      // ID VALIDATION
      // ==================================================

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid category ID.",
        });
      }

      // ==================================================
      // FIND CATEGORY
      // ==================================================

      const category =
        await Category.findById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message:
            "Category not found.",
        });
      }

      // ==================================================
      // ALREADY INACTIVE
      // ==================================================

      if (!category.isActive) {
        return res.status(400).json({
          success: false,
          message:
            "Category is already inactive.",
        });
      }

      // ==================================================
      // CHECK ACTIVE CHILDREN
      // ==================================================

      const childrenCount =
        await Category.countDocuments({
          parent: category._id,
          isActive: true,
        });

      if (childrenCount > 0) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot deactivate this category because it contains active subcategories. Deactivate or move the subcategories first.",
        });
      }

      // ==================================================
      // SOFT DELETE
      // ==================================================

      category.isActive =
        false;

      // Featured category should
      // not remain featured when inactive
      category.isFeatured =
        false;

      await category.save();

      // ==================================================
      // POPULATE PARENT
      // ==================================================

      await category.populate(
        "parent",
        "name slug"
      );

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({
        success: true,
        message:
          "Category deactivated successfully.",
        category,
      });
    } catch (error) {
      console.error(
        "Delete Category Error:",
        error
      );

      if (
        error.name ===
        "CastError"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid category ID.",
        });
      }

      if (
        error.name ===
        "ValidationError"
      ) {
        const message =
          Object.values(
            error.errors
          )
            .map(
              (item) =>
                item.message
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
          "Internal Server Error",
      });
    }
  };

// ======================================================
// RESTORE CATEGORY
// PATCH /api/v1/categories/:id/restore
// ADMIN
// ======================================================

export const restoreCategory =
  async (req, res) => {
    try {
      const { id } = req.params;

      // ==================================================
      // ID VALIDATION
      // ==================================================

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid category ID.",
        });
      }

      // ==================================================
      // FIND CATEGORY
      // ==================================================

      const category =
        await Category.findById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message:
            "Category not found.",
        });
      }

      // ==================================================
      // ALREADY ACTIVE
      // ==================================================

      if (category.isActive) {
        return res.status(400).json({
          success: false,
          message:
            "Category is already active.",
        });
      }

      // ==================================================
      // CHECK PARENT
      // ==================================================

      if (category.parent) {
        const parentCategory =
          await Category.findById(
            category.parent
          );

        if (!parentCategory) {
          return res.status(400).json({
            success: false,
            message:
              "Cannot restore category because its parent category no longer exists.",
          });
        }

        if (
          !parentCategory.isActive
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Cannot restore category because its parent category is inactive. Restore the parent first.",
          });
        }
      }

      // ==================================================
      // RESTORE
      // ==================================================

      category.isActive =
        true;

      await category.save();

      // ==================================================
      // POPULATE PARENT
      // ==================================================

      await category.populate(
        "parent",
        "name slug"
      );

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({
        success: true,
        message:
          "Category restored successfully.",
        category,
      });
    } catch (error) {
      console.error(
        "Restore Category Error:",
        error
      );

      if (
        error.name ===
        "CastError"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid category ID.",
        });
      }

      if (
        error.name ===
        "ValidationError"
      ) {
        const message =
          Object.values(
            error.errors
          )
            .map(
              (item) =>
                item.message
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
          "Internal Server Error",
      });
    }
  };