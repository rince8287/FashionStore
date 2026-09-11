import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

import productService from "../services/productService";
import PageHeader from "../components/common/PageHeader";

// ======================================================
// API URL
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

// ======================================================
// GET TOKEN
// ======================================================

const getToken = () => {
  return localStorage.getItem(
    "fashionstore-token"
  );
};

// ======================================================
// FETCH CATEGORIES
// ======================================================

const fetchCategories = async () => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/categories`,
    {
      method: "GET",

      headers: {
        "Content-Type":
          "application/json",

        ...(token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : {}),
      },
    }
  );

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Failed to load categories."
    );
  }

  return data;
};

// ======================================================
// NORMALIZE CATEGORY RESPONSE
// ======================================================

const normalizeCategories = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.categories)) {
    return response.categories;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.categories)) {
    return response.data.categories;
  }

  return [];
};

// ======================================================
// NORMALIZE SIZES
// ======================================================

const normalizeSizes = (sizes) => {
  if (!Array.isArray(sizes)) {
    return [];
  }

  return sizes
    .map((item) => {
      // Old/simple format
      if (typeof item === "string") {
        return {
          size: item,
          stock: 0,
          sku: "",
        };
      }

      return {
        size: item?.size || "",
        stock:
          Number(item?.stock) || 0,
        sku: item?.sku || "",
      };
    })
    .filter((item) => item.size);
};

// ======================================================
// NORMALIZE COLORS
// ======================================================

const normalizeColors = (colors) => {
  if (!Array.isArray(colors)) {
    return [];
  }

  return colors
    .map((item) => {
      // Old/simple format
      if (typeof item === "string") {
        return {
          name: item,
          hex: "",
        };
      }

      return {
        name: item?.name || "",
        hex: item?.hex || "",
      };
    })
    .filter((item) => item.name);
};

// ======================================================
// NORMALIZE IMAGES
// ======================================================

const normalizeImages = (images) => {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .map((image, index) => ({
      url:
        image?.url ||
        image?.secure_url ||
        "",

      publicId:
        image?.publicId ||
        image?.public_id ||
        "",

      alt:
        image?.alt ||
        "",

      isPrimary:
        image?.isPrimary ??
        index === 0,
    }))
    .filter((image) => image.url);
};

// ======================================================
// INITIAL FORM
// ======================================================

const initialFormData = {
  name: "",

  slug: "",

  shortDescription: "",

  description: "",

  category: "",

  subcategory: "",

  gender: "unisex",

  price: "",

  salePrice: "",

  stock: "",

  sku: "",

  sizes: [],

  colors: [],

  isFeatured: false,

  isTrending: false,

  isNewArrival: true,

  isActive: true,

  freeDelivery: false,

  returnable: true,

  returnDays: 7,

  images: [],
};

// ======================================================
// EDIT PRODUCT
// ======================================================

function EditProduct() {
  const navigate = useNavigate();

  const { id } = useParams();

  // ====================================================
  // STATES
  // ====================================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [categories, setCategories] =
    useState([]);

  const [error, setError] =
    useState("");

  const [newImages, setNewImages] =
    useState([]);

  const [formData, setFormData] =
    useState(initialFormData);

  // ====================================================
  // LOAD CATEGORIES
  // ====================================================

  const loadCategories =
    async () => {
      try {
        const response =
          await fetchCategories();

        const categoryList =
          normalizeCategories(
            response
          );

        setCategories(
          categoryList
        );
      } catch (error) {
        console.error(
          "Category Load Error:",
          error
        );
      }
    };

  // ====================================================
  // LOAD PRODUCT
  // ====================================================

  const loadProduct =
    async () => {
      if (!id) {
        setError(
          "Product ID is missing."
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);

        setError("");

        // ==============================================
        // LOAD PRODUCT
        // ==============================================

        const response =
          await productService.getProductById(
            id
          );

        const product =
          response?.product;

        if (!product) {
          throw new Error(
            "Product not found."
          );
        }

        // ==============================================
        // CATEGORY ID
        // ==============================================

        const categoryId =
          typeof product.category ===
          "object"
            ? product.category?._id
            : product.category;

        // ==============================================
        // SUBCATEGORY ID
        // ==============================================

        const subcategoryId =
          typeof product.subcategory ===
          "object"
            ? product.subcategory?._id
            : product.subcategory;

        // ==============================================
        // SET FORM
        // ==============================================

        setFormData({
          name:
            product.name || "",

          slug:
            product.slug || "",

          shortDescription:
            product.shortDescription ||
            "",

          description:
            product.description || "",

          category:
            categoryId || "",

          subcategory:
            subcategoryId || "",

          gender:
            product.gender ||
            "unisex",

          price:
            product.price ??
            "",

          salePrice:
            product.salePrice ??
            "",

          stock:
            product.stock ??
            "",

          sku:
            product.sku || "",

          sizes:
            normalizeSizes(
              product.sizes
            ),

          colors:
            normalizeColors(
              product.colors
            ),

          isFeatured:
            Boolean(
              product.isFeatured
            ),

          isTrending:
            Boolean(
              product.isTrending
            ),

          isNewArrival:
            product.isNewArrival ??
            true,

          isActive:
            product.isActive ??
            true,

          freeDelivery:
            Boolean(
              product.freeDelivery
            ),

          returnable:
            product.returnable ??
            true,

          returnDays:
            product.returnDays ??
            7,

          images:
            normalizeImages(
              product.images
            ),
        });

        // ==============================================
        // LOAD CATEGORIES
        // ==============================================

        await loadCategories();
      } catch (error) {
        console.error(
          "Load Product Error:",
          error
        );

        setError(
          error?.message ||
            "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    };

  // ====================================================
  // USE EFFECT
  // ====================================================

  useEffect(() => {
    loadProduct();
  }, [id]);

  // ====================================================
  // HANDLE INPUT
  // ====================================================

  const handleChange =
    (event) => {
      const {
        name,
        value,
        type,
        checked,
      } = event.target;

      setFormData(
        (previous) => ({
          ...previous,

          [name]:
            type === "checkbox"
              ? checked
              : value,
        })
      );
    };

  // ====================================================
  // AUTO SLUG
  // ====================================================

  const generateSlug =
    (value) => {
      return value
        .toLowerCase()
        .trim()
        .replace(
          /['’]/g,
          ""
        )
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-+|-+$/g,
          "");
    };

  // ====================================================
  // PRODUCT NAME
  // ====================================================

  const handleNameChange =
    (event) => {
      const value =
        event.target.value;

      setFormData(
        (previous) => ({
          ...previous,

          name: value,

          slug:
            generateSlug(
              value
            ),
        })
      );
    };

  // ====================================================
  // ADD SIZE
  // ====================================================

  const addSize = () => {
    setFormData(
      (previous) => ({
        ...previous,

        sizes: [
          ...previous.sizes,

          {
            size: "",
            stock: 0,
            sku: "",
          },
        ],
      })
    );
  };

  // ====================================================
  // UPDATE SIZE
  // ====================================================

  const updateSize = (
    index,
    field,
    value
  ) => {
    setFormData(
      (previous) => {
        const sizes = [
          ...previous.sizes,
        ];

        sizes[index] = {
          ...sizes[index],

          [field]:
            field === "stock"
              ? Number(value) || 0
              : value,
        };

        return {
          ...previous,
          sizes,
        };
      }
    );
  };

  // ====================================================
  // REMOVE SIZE
  // ====================================================

  const removeSize = (
    index
  ) => {
    setFormData(
      (previous) => ({
        ...previous,

        sizes:
          previous.sizes.filter(
            (_, sizeIndex) =>
              sizeIndex !== index
          ),
      })
    );
  };

  // ====================================================
  // ADD COLOR
  // ====================================================

  const addColor = () => {
    setFormData(
      (previous) => ({
        ...previous,

        colors: [
          ...previous.colors,

          {
            name: "",
            hex: "",
          },
        ],
      })
    );
  };

  // ====================================================
  // UPDATE COLOR
  // ====================================================

  const updateColor = (
    index,
    field,
    value
  ) => {
    setFormData(
      (previous) => {
        const colors = [
          ...previous.colors,
        ];

        colors[index] = {
          ...colors[index],

          [field]: value,
        };

        return {
          ...previous,
          colors,
        };
      }
    );
  };

  // ====================================================
  // REMOVE COLOR
  // ====================================================

  const removeColor = (
    index
  ) => {
    setFormData(
      (previous) => ({
        ...previous,

        colors:
          previous.colors.filter(
            (_, colorIndex) =>
              colorIndex !== index
          ),
      })
    );
  };

  // ====================================================
  // REMOVE EXISTING IMAGE
  // ====================================================

  const removeExistingImage =
    (index) => {
      setFormData(
        (previous) => ({
          ...previous,

          images:
            previous.images.filter(
              (_, imageIndex) =>
                imageIndex !== index
            ),
        })
      );
    };

  // ====================================================
  // NEW IMAGE SELECT
  // ====================================================

  const handleNewImages =
    (event) => {
      const selectedFiles =
        Array.from(
          event.target.files ||
            []
        );

      if (
        selectedFiles.length ===
        0
      ) {
        return;
      }

      const combined = [
        ...newImages,
        ...selectedFiles,
      ];

      // ==============================================
      // MAXIMUM 10 TOTAL IMAGES
      // ==============================================

      const total =
        formData.images.length +
        combined.length;

      if (total > 10) {
        alert(
          "Maximum 10 images are allowed."
        );

        return;
      }

      // ==============================================
      // MAX 5MB EACH
      // ==============================================

      const invalidFile =
        selectedFiles.find(
          (file) =>
            file.size >
            5 * 1024 * 1024
        );

      if (invalidFile) {
        alert(
          "Each image must be 5MB or smaller."
        );

        return;
      }

      setNewImages(
        combined
      );

      // Reset input so same file
      // can be selected again
      event.target.value = "";
    };

  // ====================================================
  // REMOVE NEW IMAGE
  // ====================================================

  const removeNewImage =
    (index) => {
      setNewImages(
        (previous) =>
          previous.filter(
            (_, fileIndex) =>
              fileIndex !== index
          )
      );
    };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      // ==============================================
      // BASIC VALIDATION
      // ==============================================

      if (!formData.name.trim()) {
        alert(
          "Product name is required."
        );

        return;
      }

      if (!formData.category) {
        alert(
          "Please select a category."
        );

        return;
      }

      if (
        formData.price === "" ||
        Number(formData.price) < 0
      ) {
        alert(
          "Please enter a valid price."
        );

        return;
      }

      if (
        formData.salePrice !== "" &&
        Number(formData.salePrice) >
          Number(formData.price)
      ) {
        alert(
          "Sale price cannot be greater than product price."
        );

        return;
      }

      if (
        formData.stock === "" ||
        Number(formData.stock) < 0
      ) {
        alert(
          "Please enter valid stock."
        );

        return;
      }

      // ==============================================
      // IMAGE VALIDATION
      // ==============================================

      const totalImages =
        formData.images.length +
        newImages.length;

      if (totalImages < 4) {
        alert(
          "Product must have at least 4 images."
        );

        return;
      }

      if (totalImages > 10) {
        alert(
          "Product can have maximum 10 images."
        );

        return;
      }

      // ==============================================
      // SIZE VALIDATION
      // ==============================================

      const invalidSize =
        formData.sizes.find(
          (item) =>
            !item.size?.trim()
        );

      if (invalidSize) {
        alert(
          "Please enter all size names or remove empty sizes."
        );

        return;
      }

      // ==============================================
      // COLOR VALIDATION
      // ==============================================

      const invalidColor =
        formData.colors.find(
          (item) =>
            !item.name?.trim()
        );

      if (invalidColor) {
        alert(
          "Please enter all color names or remove empty colors."
        );

        return;
      }

      try {
        setSaving(true);

        // ============================================
        // FORM DATA
        // ============================================

        const data =
          new FormData();

        // ============================================
        // BASIC INFORMATION
        // ============================================

        data.append(
          "name",
          formData.name.trim()
        );

        data.append(
          "slug",
          formData.slug.trim()
        );

        data.append(
          "shortDescription",
          formData.shortDescription.trim()
        );

        data.append(
          "description",
          formData.description.trim()
        );

        // ============================================
        // CATEGORY
        // ============================================

        data.append(
          "category",
          formData.category
        );

        if (
          formData.subcategory
        ) {
          data.append(
            "subcategory",
            formData.subcategory
          );
        }

        // ============================================
        // GENDER
        // ============================================

        data.append(
          "gender",
          formData.gender
        );

        // ============================================
        // PRICING
        // ============================================

        data.append(
          "price",
          String(
            Number(formData.price)
          )
        );

        data.append(
          "salePrice",
          formData.salePrice ===
            ""
            ? ""
            : String(
                Number(
                  formData.salePrice
                )
              )
        );

        // ============================================
        // INVENTORY
        // ============================================

        data.append(
          "stock",
          String(
            Number(formData.stock)
          )
        );

        if (
          formData.sku.trim()
        ) {
          data.append(
            "sku",
            formData.sku
              .trim()
              .toUpperCase()
          );
        }

        // ============================================
        // SIZES
        // ============================================

        data.append(
          "sizes",
          JSON.stringify(
            formData.sizes.map(
              (item) => ({
                size:
                  item.size.trim(),

                stock:
                  Number(
                    item.stock
                  ) || 0,

                sku:
                  item.sku
                    ?.trim()
                    .toUpperCase() ||
                  "",
              })
            )
          )
        );

        // ============================================
        // COLORS
        // ============================================

        data.append(
          "colors",
          JSON.stringify(
            formData.colors.map(
              (item) => ({
                name:
                  item.name.trim(),

                hex:
                  item.hex?.trim() ||
                  "",
              })
            )
          )
        );

        // ============================================
        // PRODUCT SETTINGS
        // ============================================

        data.append(
          "isFeatured",
          String(
            formData.isFeatured
          )
        );

        data.append(
          "isTrending",
          String(
            formData.isTrending
          )
        );

        data.append(
          "isNewArrival",
          String(
            formData.isNewArrival
          )
        );

        data.append(
          "isActive",
          String(
            formData.isActive
          )
        );

        // ============================================
        // DELIVERY
        // ============================================

        data.append(
          "freeDelivery",
          String(
            formData.freeDelivery
          )
        );

        // ============================================
        // RETURN
        // ============================================

        data.append(
          "returnable",
          String(
            formData.returnable
          )
        );

        data.append(
          "returnDays",
          String(
            Number(
              formData.returnDays
            ) || 0
          )
        );

        // ============================================
        // EXISTING IMAGES
        //
        // Backend can use these to keep existing
        // Cloudinary images while adding new ones.
        // ============================================

        data.append(
          "existingImages",
          JSON.stringify(
            formData.images
          )
        );

        // ============================================
        // NEW IMAGES
        //
        // IMPORTANT:
        // field name = "images"
        // ============================================

        newImages.forEach(
          (file) => {
            data.append(
              "images",
              file
            );
          }
        );

        // ============================================
        // UPDATE PRODUCT
        // ============================================

        await productService.updateProduct(
          id,
          data
        );

        alert(
          "Product updated successfully."
        );

        navigate(
          "/admin/products"
        );
      } catch (error) {
        console.error(
          "Update Product Error:",
          error
        );

        alert(
          error?.message ||
            "Failed to update product."
        );
      } finally {
        setSaving(false);
      }
    };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
          text-text-primary
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              h-10
              w-10
              animate-spin
              rounded-full
              border-4
              border-border-subtle
              border-t-accent
            "
          />

          <p className="mt-4 text-text-secondary">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Edit Product"
          subtitle="Unable to load this product."
          breadcrumbs={[
            "Admin",
            "Products",
            "Edit Product",
          ]}
        />

        <div
          className="
            rounded-2xl
            border
            border-red-500/30
            bg-surface
            p-8
          "
        >
          <p className="text-red-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/products"
              )
            }
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-accent
              px-5
              py-3
              font-semibold
              text-brand-bg
            "
          >
            <FiArrowLeft />

            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <div className="space-y-8">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <PageHeader
        title="Edit Product"
        subtitle="Update your product details, inventory and images."
        breadcrumbs={[
          "Admin",
          "Products",
          "Edit Product",
        ]}
        action={
          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/products"
              )
            }
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-border-subtle
              bg-surface
              px-5
              py-3
              text-text-primary
              transition
              hover:border-accent
            "
          >
            <FiArrowLeft
              size={18}
            />

            Back
          </button>
        }
      />

      {/* ==================================================
          FORM
      ================================================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >

        {/* ==================================================
            BASIC INFORMATION
        ================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-border-subtle
            bg-surface
            p-6
          "
        >
          <h2
            className="
              mb-6
              text-xl
              font-bold
              text-text-primary
            "
          >
            Basic Information
          </h2>

          <div className="grid gap-6 lg:grid-cols-2">

            {/* PRODUCT NAME */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                Product Name *
              </label>

              <input
                type="text"
                name="name"
                required
                value={
                  formData.name
                }
                onChange={
                  handleNameChange
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-border-subtle
                  bg-brand-bg
                  px-4
                  py-3
                  text-text-primary
                  outline-none
                  focus:border-accent
                "
                placeholder="Premium Oversized T-Shirt"
              />
            </div>

            {/* SLUG */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                Slug *
              </label>

              <input
                type="text"
                name="slug"
                required
                value={
                  formData.slug
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-border-subtle
                  bg-brand-bg
                  px-4
                  py-3
                  text-text-primary
                  outline-none
                  focus:border-accent
                "
              />
            </div>

            {/* CATEGORY */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                Category *
              </label>

              <select
                name="category"
                value={
                  formData.category
                }
                onChange={
                  handleChange
                }
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-border-subtle
                  bg-brand-bg
                  px-4
                  py-3
                  text-text-primary
                  outline-none
                  focus:border-accent
                "
              >
                <option value="">
                  Select Category
                </option>

                {categories
                  .filter(
                    (category) =>
                      category?.isActive !==
                      false &&
                      !category?.parent
                  )
                  .map(
                    (category) => (
                      <option
                        key={
                          category._id
                        }
                        value={
                          category._id
                        }
                      >
                        {
                          category.name
                        }
                      </option>
                    )
                  )}
              </select>

              {categories.length ===
                0 && (
                <p className="mt-2 text-xs text-text-muted">
                  No categories found.
                </p>
              )}
            </div>

            {/* SUBCATEGORY */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                Subcategory
              </label>

              <select
                name="subcategory"
                value={
                  formData.subcategory
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-border-subtle
                  bg-brand-bg
                  px-4
                  py-3
                  text-text-primary
                  outline-none
                  focus:border-accent
                "
              >
                <option value="">
                  No Subcategory
                </option>

                {categories
                  .filter(
                    (category) => {
                      const parentId =
                        typeof category.parent ===
                        "object"
                          ? category.parent?._id
                          : category.parent;

                      return (
                        category?.isActive !==
                          false &&
                        parentId ===
                          formData.category
                      );
                    }
                  )
                  .map(
                    (category) => (
                      <option
                        key={
                          category._id
                        }
                        value={
                          category._id
                        }
                      >
                        {
                          category.name
                        }
                      </option>
                    )
                  )}
              </select>
            </div>

            {/* GENDER */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                Gender
              </label>

              <select
                name="gender"
                value={
                  formData.gender
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-border-subtle
                  bg-brand-bg
                  px-4
                  py-3
                  text-text-primary
                  outline-none
                  focus:border-accent
                "
              >
                <option value="men">
                  Men
                </option>

                <option value="women">
                  Women
                </option>

                <option value="kids">
                  Kids
                </option>

                <option value="unisex">
                  Unisex
                </option>
              </select>
            </div>

          </div>

          {/* SHORT DESCRIPTION */}

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-text-secondary">
              Short Description
            </label>

            <textarea
              name="shortDescription"
              rows={3}
              maxLength={500}
              value={
                formData.shortDescription
              }
              onChange={
                handleChange
              }
              className="
                w-full
                rounded-xl
                border
                border-border-subtle
                bg-brand-bg
                px-4
                py-3
                text-text-primary
                outline-none
                focus:border-accent
              "
            />
          </div>

          {/* DESCRIPTION */}

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-text-secondary">
              Full Description *
            </label>

            <textarea
              name="description"
              rows={8}
              required
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              className="
                w-full
                rounded-xl
                border
                border-border-subtle
                bg-brand-bg
                px-4
                py-3
                text-text-primary
                outline-none
                focus:border-accent
              "
            />
          </div>
        </section>

        {/* ==================================================
            PRICING & INVENTORY
        ================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-border-subtle
            bg-surface
            p-6
          "
        >
          <h2
            className="
              mb-6
              text-xl
              font-bold
              text-text-primary
            "
          >
            Pricing & Inventory
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            {/* PRICE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                Price (₹) *
              </label>

              <input
                type="number"
                name="price"
                min="0"
                required
                value={
                  formData.price
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-border-subtle
                  bg-brand-bg
                  px-4
                  py-3
                  text-text-primary
                  outline-none
                  focus:border-accent
                "
              />
            </div>

            {/* SALE PRICE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                Sale Price (₹)
              </label>

              <input
                type="number"
                name="salePrice"
                min="0"
                value={
                  formData.salePrice
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-border-subtle
                  bg-brand-bg
                  px-4
                  py-3
                  text-text-primary
                  outline-none
                  focus:border-accent
                "
              />

              <p className="mt-2 text-xs text-text-muted">
                Leave empty if there is no sale price.
              </p>
            </div>

            {/* STOCK */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                Stock Quantity *
              </label>

              <input
                type="number"
                name="stock"
                min="0"
                required
                value={
                  formData.stock
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-border-subtle
                  bg-brand-bg
                  px-4
                  py-3
                  text-text-primary
                  outline-none
                  focus:border-accent
                "
              />
            </div>

            {/* SKU */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                SKU
              </label>

              <input
                type="text"
                name="sku"
                value={
                  formData.sku
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-border-subtle
                  bg-brand-bg
                  px-4
                  py-3
                  text-text-primary
                  outline-none
                  focus:border-accent
                "
                placeholder="FS-TSHIRT-001"
              />
            </div>

          </div>
        </section>

        {/* ==================================================
            SIZES
        ================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-border-subtle
            bg-surface
            p-6
          "
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Sizes
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                Add size-wise stock and SKU.
              </p>
            </div>

            <button
              type="button"
              onClick={addSize}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-accent
                px-4
                py-2.5
                font-semibold
                text-brand-bg
              "
            >
              <FiPlus />

              Add Size
            </button>
          </div>

          {formData.sizes.length ===
          0 ? (
            <p className="text-text-muted">
              No size variants added.
            </p>
          ) : (
            <div className="space-y-4">
              {formData.sizes.map(
                (item, index) => (
                  <div
                    key={index}
                    className="
                      grid
                      gap-4
                      rounded-xl
                      border
                      border-border-subtle
                      bg-brand-bg
                      p-4
                      md:grid-cols-[1fr_1fr_1fr_auto]
                    "
                  >
                    <input
                      type="text"
                      placeholder="Size e.g. M"
                      value={
                        item.size
                      }
                      onChange={(event) =>
                        updateSize(
                          index,
                          "size",
                          event.target.value
                        )
                      }
                      className="
                        rounded-xl
                        border
                        border-border-subtle
                        bg-surface
                        px-4
                        py-3
                        text-text-primary
                        outline-none
                        focus:border-accent
                      "
                    />

                    <input
                      type="number"
                      min="0"
                      placeholder="Stock"
                      value={
                        item.stock
                      }
                      onChange={(event) =>
                        updateSize(
                          index,
                          "stock",
                          event.target.value
                        )
                      }
                      className="
                        rounded-xl
                        border
                        border-border-subtle
                        bg-surface
                        px-4
                        py-3
                        text-text-primary
                        outline-none
                        focus:border-accent
                      "
                    />

                    <input
                      type="text"
                      placeholder="SKU"
                      value={
                        item.sku
                      }
                      onChange={(event) =>
                        updateSize(
                          index,
                          "sku",
                          event.target.value
                        )
                      }
                      className="
                        rounded-xl
                        border
                        border-border-subtle
                        bg-surface
                        px-4
                        py-3
                        text-text-primary
                        outline-none
                        focus:border-accent
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeSize(
                          index
                        )
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-red-500/30
                        px-4
                        text-red-400
                        hover:bg-red-500/10
                      "
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* ==================================================
            COLORS
        ================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-border-subtle
            bg-surface
            p-6
          "
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Colors
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                Add available product colors.
              </p>
            </div>

            <button
              type="button"
              onClick={addColor}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-accent
                px-4
                py-2.5
                font-semibold
                text-brand-bg
              "
            >
              <FiPlus />

              Add Color
            </button>
          </div>

          {formData.colors.length ===
          0 ? (
            <p className="text-text-muted">
              No colors added.
            </p>
          ) : (
            <div className="space-y-4">
              {formData.colors.map(
                (item, index) => (
                  <div
                    key={index}
                    className="
                      grid
                      gap-4
                      rounded-xl
                      border
                      border-border-subtle
                      bg-brand-bg
                      p-4
                      md:grid-cols-[1fr_160px_auto]
                    "
                  >
                    <input
                      type="text"
                      placeholder="Color name e.g. Black"
                      value={
                        item.name
                      }
                      onChange={(event) =>
                        updateColor(
                          index,
                          "name",
                          event.target.value
                        )
                      }
                      className="
                        rounded-xl
                        border
                        border-border-subtle
                        bg-surface
                        px-4
                        py-3
                        text-text-primary
                        outline-none
                        focus:border-accent
                      "
                    />

                    <input
                      type="text"
                      placeholder="#000000"
                      value={
                        item.hex
                      }
                      onChange={(event) =>
                        updateColor(
                          index,
                          "hex",
                          event.target.value
                        )
                      }
                      className="
                        rounded-xl
                        border
                        border-border-subtle
                        bg-surface
                        px-4
                        py-3
                        text-text-primary
                        outline-none
                        focus:border-accent
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeColor(
                          index
                        )
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-red-500/30
                        px-4
                        text-red-400
                        hover:bg-red-500/10
                      "
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* ==================================================
            EXISTING IMAGES
        ================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-border-subtle
            bg-surface
            p-6
          "
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-text-primary">
              Existing Product Images
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Keep at least 4 images for this product.
            </p>
          </div>

          {formData.images.length ===
          0 ? (
            <p className="text-text-muted">
              No existing images.
            </p>
          ) : (
            <div
              className="
                grid
                grid-cols-2
                gap-4
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
              "
            >
              {formData.images.map(
                (image, index) => (
                  <div
                    key={`${image.url}-${index}`}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-xl
                      border
                      border-border-subtle
                      bg-brand-bg
                    "
                  >
                    <img
                      src={image.url}
                      alt={
                        image.alt ||
                        `Product image ${
                          index + 1
                        }`
                      }
                      className="
                        aspect-square
                        w-full
                        object-cover
                      "
                    />

                    {index === 0 && (
                      <span
                        className="
                          absolute
                          left-2
                          top-2
                          rounded-lg
                          bg-accent
                          px-2
                          py-1
                          text-xs
                          font-semibold
                          text-brand-bg
                        "
                      >
                        Primary
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        removeExistingImage(
                          index
                        )
                      }
                      className="
                        absolute
                        right-2
                        top-2
                        inline-flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        bg-black/70
                        text-white
                        opacity-0
                        transition
                        group-hover:opacity-100
                      "
                      title="Remove image"
                    >
                      <FiX />
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* ==================================================
            NEW IMAGES
        ================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-border-subtle
            bg-surface
            p-6
          "
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-text-primary">
              Add New Images
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              JPG, PNG, WEBP or AVIF. Maximum 5MB per image. Total maximum 10 images.
            </p>
          </div>

          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
            onChange={
              handleNewImages
            }
            className="
              block
              w-full
              cursor-pointer
              rounded-xl
              border
              border-border-subtle
              bg-brand-bg
              p-3
              text-text-primary
            "
          />

          {newImages.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-4 font-semibold text-text-primary">
                New Images
              </h3>

              <div
                className="
                  grid
                  grid-cols-2
                  gap-4
                  sm:grid-cols-3
                  md:grid-cols-4
                  lg:grid-cols-5
                "
              >
                {newImages.map(
                  (file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="
                        relative
                        overflow-hidden
                        rounded-xl
                        border
                        border-border-subtle
                        bg-brand-bg
                      "
                    >
                      <img
                        src={URL.createObjectURL(
                          file
                        )}
                        alt={file.name}
                        className="
                          aspect-square
                          w-full
                          object-cover
                        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeNewImage(
                            index
                          )
                        }
                        className="
                          absolute
                          right-2
                          top-2
                          inline-flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          bg-black/70
                          text-white
                        "
                      >
                        <FiX />
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div className="mt-5 rounded-xl border border-border-subtle bg-brand-bg p-4">
            <p className="text-sm text-text-secondary">
              Current images:{" "}
              <span className="font-semibold text-text-primary">
                {formData.images.length}
              </span>
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              New images:{" "}
              <span className="font-semibold text-text-primary">
                {newImages.length}
              </span>
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              Total:{" "}
              <span className="font-semibold text-accent">
                {formData.images.length +
                  newImages.length}
              </span>
              {" / 10"}
            </p>
          </div>
        </section>

        {/* ==================================================
            DELIVERY & RETURN
        ================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-border-subtle
            bg-surface
            p-6
          "
        >
          <h2 className="mb-6 text-xl font-bold text-text-primary">
            Delivery & Returns
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            {/* FREE DELIVERY */}

            <label
              className="
                flex
                cursor-pointer
                items-center
                gap-3
                rounded-xl
                border
                border-border-subtle
                bg-brand-bg
                p-4
              "
            >
              <input
                type="checkbox"
                name="freeDelivery"
                checked={
                  formData.freeDelivery
                }
                onChange={
                  handleChange
                }
                className="h-5 w-5 accent-accent"
              />

              <span className="text-text-primary">
                Free Delivery
              </span>
            </label>

            {/* RETURNABLE */}

            <label
              className="
                flex
                cursor-pointer
                items-center
                gap-3
                rounded-xl
                border
                border-border-subtle
                bg-brand-bg
                p-4
              "
            >
              <input
                type="checkbox"
                name="returnable"
                checked={
                  formData.returnable
                }
                onChange={
                  handleChange
                }
                className="h-5 w-5 accent-accent"
              />

              <span className="text-text-primary">
                Returnable Product
              </span>
            </label>

            {/* RETURN DAYS */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                Return Period (Days)
              </label>

              <input
                type="number"
                name="returnDays"
                min="0"
                value={
                  formData.returnDays
                }
                onChange={
                  handleChange
                }
                disabled={
                  !formData.returnable
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-border-subtle
                  bg-brand-bg
                  px-4
                  py-3
                  text-text-primary
                  outline-none
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  focus:border-accent
                "
              />
            </div>

          </div>
        </section>

        {/* ==================================================
            PRODUCT SETTINGS
        ================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-border-subtle
            bg-surface
            p-6
          "
        >
          <h2 className="mb-6 text-xl font-bold text-text-primary">
            Product Settings
          </h2>

          <div className="grid gap-4 md:grid-cols-2">

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border-subtle bg-brand-bg p-4">
              <input
                type="checkbox"
                name="isFeatured"
                checked={
                  formData.isFeatured
                }
                onChange={
                  handleChange
                }
                className="h-5 w-5 accent-accent"
              />

              <span className="text-text-primary">
                Featured Product
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border-subtle bg-brand-bg p-4">
              <input
                type="checkbox"
                name="isTrending"
                checked={
                  formData.isTrending
                }
                onChange={
                  handleChange
                }
                className="h-5 w-5 accent-accent"
              />

              <span className="text-text-primary">
                Trending Product
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border-subtle bg-brand-bg p-4">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={
                  formData.isNewArrival
                }
                onChange={
                  handleChange
                }
                className="h-5 w-5 accent-accent"
              />

              <span className="text-text-primary">
                New Arrival
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border-subtle bg-brand-bg p-4">
              <input
                type="checkbox"
                name="isActive"
                checked={
                  formData.isActive
                }
                onChange={
                  handleChange
                }
                className="h-5 w-5 accent-accent"
              />

              <span className="text-text-primary">
                Product Active
              </span>
            </label>

          </div>
        </section>

        {/* ==================================================
            ACTION BUTTONS
        ================================================== */}

        <div
          className="
            flex
            flex-wrap
            justify-end
            gap-4
            pb-8
          "
        >
          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/products"
              )
            }
            disabled={saving}
            className="
              rounded-xl
              border
              border-border-subtle
              px-6
              py-3
              text-text-primary
              transition
              hover:border-accent
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-accent
              px-8
              py-3
              font-semibold
              text-brand-bg
              transition
              hover:bg-accent-hover
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <FiSave
              size={18}
            />

            {saving
              ? "Updating..."
              : "Update Product"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default EditProduct;