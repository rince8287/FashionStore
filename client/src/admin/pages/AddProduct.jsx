import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const AddProduct = () => {
  // =========================================================
  // BASIC FORM
  // =========================================================

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",

    category: "",
    subcategory: "",

    gender: "unisex",

    price: "",
    salePrice: "",

    stock: "",
    sku: "",

    isFeatured: false,
    isTrending: false,
    isNewArrival: true,
    isActive: true,

    freeDelivery: false,
    returnable: true,
    returnDays: "7",
  });

  // =========================================================
  // CATEGORIES
  // =========================================================

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [loadingCategories, setLoadingCategories] =
    useState(false);

  // =========================================================
  // SIZES
  // =========================================================

  const [sizes, setSizes] = useState([]);

  const [sizeForm, setSizeForm] = useState({
    size: "",
    stock: "",
    sku: "",
  });

  // =========================================================
  // COLORS
  // =========================================================

  const [colors, setColors] = useState([]);

  const [colorForm, setColorForm] = useState({
    name: "",
    hex: "#000000",
  });

  // =========================================================
  // IMAGES
  // =========================================================

  const [images, setImages] = useState([]);

  // =========================================================
  // UI STATES
  // =========================================================

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const response = await axios.get(
        `${API_URL}/categories`
      );

      if (response.data?.success) {
        setCategories(
          response.data.categories || []
        );
      }
    } catch (error) {
      console.error(
        "Category fetch error:",
        error
      );

      setMessage({
        type: "error",
        text: "Unable to load categories.",
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  // =========================================================
  // CATEGORY CHANGE
  // =========================================================

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      category: value,
      subcategory: "",
    }));

    const selectedCategory = categories.find(
      (category) =>
        category._id === value ||
        category.slug === value
    );

    if (selectedCategory) {
      const children =
        selectedCategory.subcategories ||
        selectedCategory.children ||
        [];

      setSubcategories(children);
    } else {
      // If API gives all categories flat
      const children = categories.filter(
        (category) =>
          category.parent &&
          category.parent.toString() ===
            value.toString()
      );

      setSubcategories(children);
    }
  };

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =========================================================
  // SIZE FORM CHANGE
  // =========================================================

  const handleSizeFormChange = (e) => {
    const { name, value } = e.target;

    setSizeForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // ADD SIZE
  // =========================================================

  const addSize = () => {
    const size = sizeForm.size.trim();

    if (!size) {
      setMessage({
        type: "error",
        text: "Please enter a size.",
      });

      return;
    }

    const alreadyExists = sizes.some(
      (item) =>
        item.size.toLowerCase() ===
        size.toLowerCase()
    );

    if (alreadyExists) {
      setMessage({
        type: "error",
        text: "This size already exists.",
      });

      return;
    }

    setSizes((prev) => [
      ...prev,
      {
        size,
        stock:
          sizeForm.stock === ""
            ? 0
            : Number(sizeForm.stock),
        sku: sizeForm.sku
          .trim()
          .toUpperCase(),
      },
    ]);

    setSizeForm({
      size: "",
      stock: "",
      sku: "",
    });

    setMessage({
      type: "",
      text: "",
    });
  };

  // =========================================================
  // REMOVE SIZE
  // =========================================================

  const removeSize = (index) => {
    setSizes((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  // =========================================================
  // COLOR FORM CHANGE
  // =========================================================

  const handleColorFormChange = (e) => {
    const { name, value } = e.target;

    setColorForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // ADD COLOR
  // =========================================================

  const addColor = () => {
    const name =
      colorForm.name.trim();

    if (!name) {
      setMessage({
        type: "error",
        text: "Please enter a color name.",
      });

      return;
    }

    const alreadyExists = colors.some(
      (item) =>
        item.name.toLowerCase() ===
        name.toLowerCase()
    );

    if (alreadyExists) {
      setMessage({
        type: "error",
        text: "This color already exists.",
      });

      return;
    }

    setColors((prev) => [
      ...prev,
      {
        name,
        hex: colorForm.hex,
      },
    ]);

    setColorForm({
      name: "",
      hex: "#000000",
    });

    setMessage({
      type: "",
      text: "",
    });
  };

  // =========================================================
  // REMOVE COLOR
  // =========================================================

  const removeColor = (index) => {
    setColors((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  // =========================================================
  // IMAGE SELECT
  // =========================================================

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(
      e.target.files || []
    );

    if (!selectedFiles.length) {
      return;
    }

    if (
      images.length +
        selectedFiles.length >
      10
    ) {
      setMessage({
        type: "error",
        text: "You can upload maximum 10 images.",
      });

      return;
    }

    const validFiles = selectedFiles.filter(
      (file) => {
        if (!file.type.startsWith("image/")) {
          return false;
        }

        if (file.size > 5 * 1024 * 1024) {
          return false;
        }

        return true;
      }
    );

    if (
      validFiles.length !==
      selectedFiles.length
    ) {
      setMessage({
        type: "error",
        text: "Only image files up to 5MB are allowed.",
      });
    }

    const newImages = validFiles.map(
      (file) => ({
        file,
        preview:
          URL.createObjectURL(file),
      })
    );

    setImages((prev) => [
      ...prev,
      ...newImages,
    ]);

    e.target.value = "";
  };

  // =========================================================
  // REMOVE IMAGE
  // =========================================================

  const removeImage = (index) => {
    setImages((prev) => {
      const item = prev[index];

      if (item?.preview) {
        URL.revokeObjectURL(
          item.preview
        );
      }

      return prev.filter(
        (_, i) => i !== index
      );
    });
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Product name is required.";
    }

    if (!formData.description.trim()) {
      return "Product description is required.";
    }

    if (!formData.category) {
      return "Product category is required.";
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      return "Please enter a valid product price.";
    }

    if (
      formData.salePrice !== "" &&
      Number(formData.salePrice) < 0
    ) {
      return "Please enter a valid sale price.";
    }

    if (
      formData.salePrice !== "" &&
      Number(formData.salePrice) >
        Number(formData.price)
    ) {
      return "Sale price cannot be greater than original price.";
    }

    if (
      formData.stock !== "" &&
      Number(formData.stock) < 0
    ) {
      return "Stock cannot be negative.";
    }

    if (images.length < 4) {
      return "Please upload at least 4 product images.";
    }

    if (images.length > 10) {
      return "You can upload maximum 10 product images.";
    }

    if (
      formData.returnDays !== "" &&
      Number(formData.returnDays) < 0
    ) {
      return "Return days cannot be negative.";
    }

    return "";
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    const validationError =
      validateForm();

    if (validationError) {
      setMessage({
        type: "error",
        text: validationError,
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      // =====================================================
      // BASIC DATA
      // =====================================================

      data.append(
        "name",
        formData.name.trim()
      );

      data.append(
        "shortDescription",
        formData.shortDescription.trim()
      );

      data.append(
        "description",
        formData.description.trim()
      );

      data.append(
        "category",
        formData.category
      );

      if (formData.subcategory) {
        data.append(
          "subcategory",
          formData.subcategory
        );
      }

      data.append(
        "gender",
        formData.gender
      );

      // =====================================================
      // PRICE
      // =====================================================

      data.append(
        "price",
        formData.price
      );

      if (formData.salePrice !== "") {
        data.append(
          "salePrice",
          formData.salePrice
        );
      }

      // =====================================================
      // INVENTORY
      // =====================================================

      data.append(
        "stock",
        formData.stock === ""
          ? "0"
          : formData.stock
      );

      if (formData.sku.trim()) {
        data.append(
          "sku",
          formData.sku
            .trim()
            .toUpperCase()
        );
      }

      // =====================================================
      // SIZES
      // =====================================================

      data.append(
        "sizes",
        JSON.stringify(sizes)
      );

      // =====================================================
      // COLORS
      // =====================================================

      data.append(
        "colors",
        JSON.stringify(colors)
      );

      // =====================================================
      // BOOLEAN SETTINGS
      // =====================================================

      data.append(
        "isFeatured",
        String(formData.isFeatured)
      );

      data.append(
        "isTrending",
        String(formData.isTrending)
      );

      data.append(
        "isNewArrival",
        String(formData.isNewArrival)
      );

      data.append(
        "isActive",
        String(formData.isActive)
      );

      data.append(
        "freeDelivery",
        String(formData.freeDelivery)
      );

      data.append(
        "returnable",
        String(formData.returnable)
      );

      data.append(
        "returnDays",
        formData.returnDays === ""
          ? "7"
          : formData.returnDays
      );

      // =====================================================
      // IMAGES
      // =====================================================

      images.forEach((image) => {
        data.append(
          "images",
          image.file
        );
      });

      // =====================================================
      // API REQUEST
      // =====================================================

      const token = localStorage.getItem(
        "fashionstore-token"
      );

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response =
        await axios.post(
          `${API_URL}/products`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      if (response.data?.success) {
        setMessage({
          type: "success",
          text:
            response.data.message ||
            "Product created successfully.",
        });

        // ===================================================
        // RESET FORM
        // ===================================================

        images.forEach((image) => {
          if (image.preview) {
            URL.revokeObjectURL(
              image.preview
            );
          }
        });

        setFormData({
          name: "",
          shortDescription: "",
          description: "",

          category: "",
          subcategory: "",

          gender: "unisex",

          price: "",
          salePrice: "",

          stock: "",
          sku: "",

          isFeatured: false,
          isTrending: false,
          isNewArrival: true,
          isActive: true,

          freeDelivery: false,
          returnable: true,
          returnDays: "7",
        });

        setSizes([]);
        setColors([]);
        setImages([]);
        setSubcategories([]);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } catch (error) {
      console.error(
        "Create product error:",
        error
      );

      const backendMessage =
        error.response?.data?.message;

      setMessage({
        type: "error",
        text:
          backendMessage ||
          "Something went wrong while creating the product.",
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="min-h-screen bg-[#050816] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Add Product
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Create a new product for your
            FashionStore.
          </p>
        </div>

        {/* =====================================================
            MESSAGE
        ====================================================== */}

        {message.text && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-green-500/30 bg-green-500/10 text-green-400"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* =====================================================
            FORM
        ====================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* ===================================================
              BASIC INFORMATION
          ==================================================== */}

          <section className="rounded-2xl border border-[#20283a] bg-[#0b1020] p-5 sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the basic product details.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* NAME */}

              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Product Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Premium Oversized T-Shirt"
                  className="w-full rounded-xl border border-[#20283a] bg-[#050816] px-4 py-3 text-sm text-white outline-none transition focus:border-[#d4af37]"
                />
              </div>

              {/* SHORT DESCRIPTION */}

              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Short Description
                </label>

                <input
                  type="text"
                  name="shortDescription"
                  value={
                    formData.shortDescription
                  }
                  onChange={handleChange}
                  placeholder="Short product summary"
                  className="w-full rounded-xl border border-[#20283a] bg-[#050816] px-4 py-3 text-sm text-white outline-none transition focus:border-[#d4af37]"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  rows={6}
                  placeholder="Write complete product description..."
                  className="w-full resize-none rounded-xl border border-[#20283a] bg-[#050816] px-4 py-3 text-sm text-white outline-none transition focus:border-[#d4af37]"
                />
              </div>
            </div>
          </section>

          {/* ===================================================
              CATEGORY
          ==================================================== */}

          <section className="rounded-2xl border border-[#20283a] bg-[#0b1020] p-5 sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Category
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select product category and gender.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* CATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={
                    handleCategoryChange
                  }
                  disabled={
                    loadingCategories
                  }
                  className="w-full rounded-xl border border-[#20283a] bg-[#050816] px-4 py-3 text-sm text-white outline-none focus:border-[#d4af37]"
                >
                  <option value="">
                    {loadingCategories
                      ? "Loading..."
                      : "Select Category"}
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category._id}
                        value={category._id}
                      >
                        {category.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* SUBCATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Subcategory
                </label>

                <select
                  name="subcategory"
                  value={
                    formData.subcategory
                  }
                  onChange={handleChange}
                  disabled={
                    !formData.category
                  }
                  className="w-full rounded-xl border border-[#20283a] bg-[#050816] px-4 py-3 text-sm text-white outline-none focus:border-[#d4af37]"
                >
                  <option value="">
                    Select Subcategory
                  </option>

                  {subcategories.map(
                    (subcategory) => (
                      <option
                        key={
                          subcategory._id
                        }
                        value={
                          subcategory._id
                        }
                      >
                        {subcategory.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* GENDER */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#20283a] bg-[#050816] px-4 py-3 text-sm text-white outline-none focus:border-[#d4af37]"
                >
                  <option value="unisex">
                    Unisex
                  </option>

                  <option value="men">
                    Men
                  </option>

                  <option value="women">
                    Women
                  </option>

                  <option value="kids">
                    Kids
                  </option>
                </select>
              </div>
            </div>
          </section>

          {/* ===================================================
              PRICING
          ==================================================== */}

          <section className="rounded-2xl border border-[#20283a] bg-[#0b1020] p-5 sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Pricing & Inventory
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* PRICE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Original Price *
                </label>

                <input
                  type="number"
                  min="0"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="1999"
                  className="w-full rounded-xl border border-[#20283a] bg-[#050816] px-4 py-3 text-sm text-white outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* SALE PRICE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Sale Price
                </label>

                <input
                  type="number"
                  min="0"
                  name="salePrice"
                  value={
                    formData.salePrice
                  }
                  onChange={handleChange}
                  placeholder="1499"
                  className="w-full rounded-xl border border-[#20283a] bg-[#050816] px-4 py-3 text-sm text-white outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* STOCK */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Stock
                </label>

                <input
                  type="number"
                  min="0"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="100"
                  className="w-full rounded-xl border border-[#20283a] bg-[#050816] px-4 py-3 text-sm text-white outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* SKU */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  SKU
                </label>

                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="FS-TSHIRT-001"
                  className="w-full rounded-xl border border-[#20283a] bg-[#050816] px-4 py-3 text-sm uppercase text-white outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          </section>

          {/* ===================================================
              SIZES
          ==================================================== */}

          <section className="rounded-2xl border border-[#20283a] bg-[#0b1020] p-5 sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Sizes
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <input
                type="text"
                name="size"
                value={sizeForm.size}
                onChange={
                  handleSizeFormChange
                }
                placeholder="Size e.g. M"
                className="rounded-xl border border-[#20283a] bg-[#050816] px-4 py-3 text-sm text-white outline-none focus:border-[#d4af37]"
              />

              <input
                type="number"
                min="0"
                name="stock"
                value={sizeForm.stock}
                onChange={
                  handleSizeFormChange
                }
                placeholder="Stock"
                className="rounded-xl border border-[#20283a] bg-[#050816] px-4 py-3 text-sm text-white outline-none focus:border-[#d4af37]"
              />

              <input
                type="text"
                name="sku"
                value={sizeForm.sku}
                onChange={
                  handleSizeFormChange
                }
                placeholder="Size SKU"
                className="rounded-xl border border-[#20283a] bg-[#050816] px-4 py-3 text-sm uppercase text-white outline-none focus:border-[#d4af37]"
              />

              <button
                type="button"
                onClick={addSize}
                className="rounded-xl bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#e5c158]"
              >
                + Add Size
              </button>
            </div>

            {sizes.length > 0 && (
              <div className="mt-5 space-y-3">
                {sizes.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#20283a] bg-[#050816] p-4"
                    >
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span>
                          Size:{" "}
                          <strong>
                            {item.size}
                          </strong>
                        </span>

                        <span className="text-slate-400">
                          Stock:{" "}
                          {item.stock}
                        </span>

                        {item.sku && (
                          <span className="text-slate-400">
                            SKU:{" "}
                            {item.sku}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeSize(index)
                        }
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </section>

          {/* ===================================================
              COLORS
          ==================================================== */}

          <section className="rounded-2xl border border-[#20283a] bg-[#0b1020] p-5 sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Colors
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_100px_150px]">
              <input
                type="text"
                name="name"
                value={colorForm.name}
                onChange={
                  handleColorFormChange
                }
                placeholder="Color name e.g. Black"
                className="rounded-xl border border-[#20283a] bg-[#050816] px-4 py-3 text-sm text-white outline-none focus:border-[#d4af37]"
              />

              <input
                type="color"
                name="hex"
                value={colorForm.hex}
                onChange={
                  handleColorFormChange
                }
                className="h-[46px] w-full cursor-pointer rounded-xl border border-[#20283a] bg-[#050816] p-1"
              />

              <button
                type="button"
                onClick={addColor}
                className="rounded-xl bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black hover:bg-[#e5c158]"
              >
                + Add Color
              </button>
            </div>

            {colors.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3">
                {colors.map(
                  (color, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-xl border border-[#20283a] bg-[#050816] px-4 py-3"
                    >
                      <span
                        className="h-5 w-5 rounded-full border border-white/20"
                        style={{
                          backgroundColor:
                            color.hex,
                        }}
                      />

                      <span className="text-sm">
                        {color.name}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeColor(index)
                        }
                        className="ml-2 text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </section>

          {/* ===================================================
              IMAGES
          ==================================================== */}

          <section className="rounded-2xl border border-[#20283a] bg-[#0b1020] p-5 sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Product Images *
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload minimum 4 and maximum
                10 images.
              </p>
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#3a4358] bg-[#050816] px-5 py-10 text-center transition hover:border-[#d4af37]">
              <div className="mb-3 text-3xl">
                📷
              </div>

              <div className="text-sm font-medium">
                Click to upload images
              </div>

              <div className="mt-1 text-xs text-slate-500">
                JPG, JPEG, PNG, WEBP — Max
                5MB each
              </div>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={
                  handleImageChange
                }
                className="hidden"
              />
            </label>

            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {images.map(
                  (image, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-xl border border-[#20283a] bg-[#050816]"
                    >
                      <img
                        src={image.preview}
                        alt={`Product ${
                          index + 1
                        }`}
                        className="aspect-square w-full object-cover"
                      />

                      <div className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs">
                        {index === 0
                          ? "Primary"
                          : `Image ${
                              index + 1
                            }`}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(index)
                        }
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white opacity-0 transition group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

            <div className="mt-4 text-xs text-slate-500">
              {images.length}/10 images
            </div>
          </section>

          {/* ===================================================
              PRODUCT SETTINGS
          ==================================================== */}

          <section className="rounded-2xl border border-[#20283a] bg-[#0b1020] p-5 sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Product Settings
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* FEATURED */}

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#20283a] bg-[#050816] p-4">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={
                    formData.isFeatured
                  }
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#d4af37]"
                />

                <span className="text-sm">
                  Featured Product
                </span>
              </label>

              {/* TRENDING */}

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#20283a] bg-[#050816] p-4">
                <input
                  type="checkbox"
                  name="isTrending"
                  checked={
                    formData.isTrending
                  }
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#d4af37]"
                />

                <span className="text-sm">
                  Trending Product
                </span>
              </label>

              {/* NEW ARRIVAL */}

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#20283a] bg-[#050816] p-4">
                <input
                  type="checkbox"
                  name="isNewArrival"
                  checked={
                    formData.isNewArrival
                  }
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#d4af37]"
                />

                <span className="text-sm">
                  New Arrival
                </span>
              </label>

              {/* ACTIVE */}

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#20283a] bg-[#050816] p-4">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={
                    formData.isActive
                  }
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#d4af37]"
                />

                <span className="text-sm">
                  Active Product
                </span>
              </label>
            </div>
          </section>

          {/* ===================================================
              DELIVERY & RETURN
          ==================================================== */}

          <section className="rounded-2xl border border-[#20283a] bg-[#0b1020] p-5 sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Delivery & Returns
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* FREE DELIVERY */}

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#20283a] bg-[#050816] p-4">
                <input
                  type="checkbox"
                  name="freeDelivery"
                  checked={
                    formData.freeDelivery
                  }
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#d4af37]"
                />

                <span className="text-sm">
                  Free Delivery
                </span>
              </label>

              {/* RETURNABLE */}

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#20283a] bg-[#050816] p-4">
                <input
                  type="checkbox"
                  name="returnable"
                  checked={
                    formData.returnable
                  }
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#d4af37]"
                />

                <span className="text-sm">
                  Returnable
                </span>
              </label>

              {/* RETURN DAYS */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Return Days
                </label>

                <input
                  type="number"
                  min="0"
                  name="returnDays"
                  value={
                    formData.returnDays
                  }
                  onChange={handleChange}
                  disabled={
                    !formData.returnable
                  }
                  className="w-full rounded-xl border border-[#20283a] bg-[#050816] px-4 py-3 text-sm text-white outline-none focus:border-[#d4af37] disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </section>

          {/* ===================================================
              SUBMIT
          ==================================================== */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                window.history.back()
              }
              className="rounded-xl border border-[#20283a] bg-[#0b1020] px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#d4af37] px-8 py-3 text-sm font-bold text-black transition hover:bg-[#e5c158] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Creating Product..."
                : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;