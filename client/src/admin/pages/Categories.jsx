import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiSearch,
  FiX,
  FiCheck,
  FiImage,
  FiFolder,
  FiStar,
} from "react-icons/fi";

// ======================================================
// API URL
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

// ======================================================
// CONSTANTS
// ======================================================

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  image: "",
  parent: "",
  isActive: true,
  isFeatured: false,
  sortOrder: 0,
};

// ======================================================
// TOKEN
// ======================================================

const getToken = () => {
  return localStorage.getItem(
    "fashionstore-token"
  );
};

// ======================================================
// API REQUEST
// ======================================================

const request = async (
  endpoint,
  options = {}
) => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        ...(token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : {}),

        ...(options.headers || {}),
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
        `Request failed with status ${response.status}.`
    );
  }

  return data;
};

// ======================================================
// CATEGORY RESPONSE NORMALIZER
// ======================================================

const getCategoryArray = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.categories)) {
    return data.categories;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

// ======================================================
// SLUG GENERATOR
// ======================================================

const generateSlug = (value) => {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// ======================================================
// MAIN COMPONENT
// ======================================================

function Categories() {
  // ====================================================
  // STATE
  // ====================================================

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [showModal, setShowModal] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [formData, setFormData] =
    useState(EMPTY_FORM);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ====================================================
  // LOAD CATEGORIES
  // ====================================================

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await request("/categories");

      const categoryList =
        getCategoryArray(data);

      setCategories(categoryList);
    } catch (err) {
      console.error(
        "Category Loading Error:",
        err
      );

      setError(
        err?.message ||
          "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    loadCategories();
  }, []);

  // ====================================================
  // CLEAR MESSAGES
  // ====================================================

  useEffect(() => {
    if (!success) return;

    const timer =
      setTimeout(() => {
        setSuccess("");
      }, 3000);

    return () => clearTimeout(timer);
  }, [success]);

  // ====================================================
  // ROOT CATEGORIES
  // ====================================================

  const rootCategories =
    useMemo(() => {
      return categories.filter(
        (category) =>
          !category.parent
      );
    }, [categories]);

  // ====================================================
  // FILTERED CATEGORIES
  // ====================================================

  const filteredCategories =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return categories
        .filter((category) => {
          if (
            statusFilter === "active"
          ) {
            return (
              category.isActive !== false
            );
          }

          if (
            statusFilter ===
            "inactive"
          ) {
            return (
              category.isActive === false
            );
          }

          return true;
        })
        .filter((category) => {
          if (!query) {
            return true;
          }

          const name =
            category.name
              ?.toLowerCase() || "";

          const slug =
            category.slug
              ?.toLowerCase() || "";

          const description =
            category.description
              ?.toLowerCase() || "";

          return (
            name.includes(query) ||
            slug.includes(query) ||
            description.includes(query)
          );
        })
        .sort(
          (a, b) =>
            Number(
              a.sortOrder || 0
            ) -
            Number(
              b.sortOrder || 0
            )
        );
    }, [
      categories,
      search,
      statusFilter,
    ]);

  // ====================================================
  // COUNTS
  // ====================================================

  const totalCategories =
    categories.length;

  const activeCategories =
    categories.filter(
      (category) =>
        category.isActive !== false
    ).length;

  const inactiveCategories =
    categories.filter(
      (category) =>
        category.isActive === false
    ).length;

  const featuredCategories =
    categories.filter(
      (category) =>
        category.isFeatured === true
    ).length;

  // ====================================================
  // OPEN ADD MODAL
  // ====================================================

  const handleAdd = () => {
    setEditingCategory(null);

    setFormData({
      ...EMPTY_FORM,
    });

    setError("");
    setShowModal(true);
  };

  // ====================================================
  // OPEN EDIT MODAL
  // ====================================================

  const handleEdit = (
    category
  ) => {
    setEditingCategory(category);

    setFormData({
      name:
        category.name || "",

      slug:
        category.slug || "",

      description:
        category.description ||
        "",

      image:
        category.image || "",

      parent:
        category.parent?._id ||
        category.parent ||
        "",

      isActive:
        category.isActive !== false,

      isFeatured:
        category.isFeatured === true,

      sortOrder:
        category.sortOrder ?? 0,
    });

    setError("");
    setShowModal(true);
  };

  // ====================================================
  // CLOSE MODAL
  // ====================================================

  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      ...EMPTY_FORM,
    });
  };

  // ====================================================
  // INPUT CHANGE
  // ====================================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,

      ...(name === "name"
        ? {
            slug:
              generateSlug(
                value
              ),
          }
        : {}),
    }));
  };

  // ====================================================
  // CREATE CATEGORY
  // ====================================================

  const createCategory = async (
    payload
  ) => {
    return request(
      "/categories",
      {
        method: "POST",

        body:
          JSON.stringify(
            payload
          ),
      }
    );
  };

  // ====================================================
  // UPDATE CATEGORY
  // ====================================================

  const updateCategory = async (
    id,
    payload
  ) => {
    return request(
      `/categories/${id}`,
      {
        method: "PUT",

        body:
          JSON.stringify(
            payload
          ),
      }
    );
  };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    const name =
      formData.name.trim();

    if (!name) {
      setError(
        "Category name is required."
      );
      return;
    }

    if (name.length < 2) {
      setError(
        "Category name must be at least 2 characters."
      );
      return;
    }

    if (
      formData.description.length >
      500
    ) {
      setError(
        "Description cannot exceed 500 characters."
      );
      return;
    }

    // --------------------------------------------------
    // PREVENT SELF PARENT
    // --------------------------------------------------

    if (
      editingCategory &&
      formData.parent ===
        editingCategory._id
    ) {
      setError(
        "A category cannot be its own parent."
      );
      return;
    }

    // --------------------------------------------------
    // PAYLOAD
    // --------------------------------------------------

    const payload = {
      name,

      slug:
        generateSlug(
          formData.slug ||
            name
        ),

      description:
        formData.description.trim(),

      image:
        formData.image.trim(),

      parent:
        formData.parent || null,

      isActive:
        Boolean(
          formData.isActive
        ),

      isFeatured:
        Boolean(
          formData.isFeatured
        ),

      sortOrder:
        Math.max(
          Number(
            formData.sortOrder
          ) || 0,
          0
        ),
    };

    try {
      setSaving(true);

      if (editingCategory) {
        await updateCategory(
          editingCategory._id,
          payload
        );

        setSuccess(
          "Category updated successfully."
        );
      } else {
        await createCategory(
          payload
        );

        setSuccess(
          "Category created successfully."
        );
      }

      handleCloseModal();

      await loadCategories();
    } catch (err) {
      console.error(
        "Save Category Error:",
        err
      );

      setError(
        err?.message ||
          "Failed to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // DELETE CATEGORY
  // ====================================================

  const handleDelete = async (
    category
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to deactivate "${category.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await request(
        `/categories/${category._id}`,
        {
          method: "DELETE",
        }
      );

      setSuccess(
        "Category deactivated successfully."
      );

      await loadCategories();
    } catch (err) {
      console.error(
        "Delete Category Error:",
        err
      );

      setError(
        err?.message ||
          "Failed to delete category."
      );
    }
  };

  // ====================================================
  // RESTORE CATEGORY
  // ====================================================

  const handleRestore = async (
    category
  ) => {
    try {
      setError("");
      setSuccess("");

      await request(
        `/categories/${category._id}/restore`,
        {
          method: "PATCH",
        }
      );

      setSuccess(
        "Category restored successfully."
      );

      await loadCategories();
    } catch (err) {
      console.error(
        "Restore Category Error:",
        err
      );

      setError(
        err?.message ||
          "Failed to restore category."
      );
    }
  };

  // ====================================================
  // GET PARENT NAME
  // ====================================================

  const getParentName = (
    category
  ) => {
    if (!category.parent) {
      return "Main Category";
    }

    if (
      typeof category.parent ===
      "object"
    ) {
      return (
        category.parent.name ||
        "Subcategory"
      );
    }

    const parent =
      categories.find(
        (item) =>
          item._id ===
          category.parent
      );

    return (
      parent?.name ||
      "Subcategory"
    );
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] p-4 text-[var(--color-text-primary)] sm:p-6 lg:p-8">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <p className="mb-2 text-sm font-medium text-[var(--color-accent)]">
            Store Management
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Categories
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Manage your product categories
            and subcategories.
          </p>
        </div>

        <div className="flex gap-3">

          <button
            type="button"
            onClick={
              loadCategories
            }
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-sm font-semibold transition hover:bg-[var(--color-surface-elevated)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiRefreshCw
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-bold text-black transition hover:bg-[var(--color-accent-hover)]"
          >
            <FiPlus
              size={18}
            />

            Add Category
          </button>

        </div>
      </div>

      {/* ==================================================
          SUCCESS
      ================================================== */}

      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          <FiCheck />

          <span>
            {success}
          </span>
        </div>
      )}

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && !showModal && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
          >
            <FiX />
          </button>
        </div>
      )}

      {/* ==================================================
          STAT CARDS
      ================================================== */}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Total Categories
              </p>

              <p className="mt-2 text-3xl font-bold">
                {totalCategories}
              </p>
            </div>

            <div className="rounded-xl bg-[var(--color-accent-soft)] p-3 text-[var(--color-accent)]">
              <FiFolder size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Active
              </p>

              <p className="mt-2 text-3xl font-bold">
                {activeCategories}
              </p>
            </div>

            <div className="rounded-xl bg-green-500/10 p-3 text-green-400">
              <FiCheck size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Inactive
              </p>

              <p className="mt-2 text-3xl font-bold">
                {inactiveCategories}
              </p>
            </div>

            <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
              <FiTrash2 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Featured
              </p>

              <p className="mt-2 text-3xl font-bold">
                {featuredCategories}
              </p>
            </div>

            <div className="rounded-xl bg-yellow-500/10 p-3 text-yellow-400">
              <FiStar size={22} />
            </div>
          </div>
        </div>

      </div>

      {/* ==================================================
          FILTER BAR
      ================================================== */}

      <div className="mb-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-md">

            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              size={18}
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search categories..."
              className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-brand-bg)] py-3 pl-11 pr-4 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]"
            />

          </div>

          <div className="flex flex-wrap gap-2">

            {[
              ["all", "All"],
              [
                "active",
                "Active",
              ],
              [
                "inactive",
                "Inactive",
              ],
            ].map(
              ([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setStatusFilter(
                      value
                    )
                  }
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    statusFilter ===
                    value
                      ? "bg-[var(--color-accent)] text-black"
                      : "border border-[var(--color-border-subtle)] bg-[var(--color-brand-bg)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]"
                  }`}
                >
                  {label}
                </button>
              )
            )}

          </div>

        </div>
      </div>

      {/* ==================================================
          TABLE
      ================================================== */}

      <div className="overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">

              <FiRefreshCw
                size={32}
                className="mx-auto animate-spin text-[var(--color-accent)]"
              />

              <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
                Loading categories...
              </p>

            </div>
          </div>
        ) : filteredCategories.length ===
          0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">

            <div className="rounded-2xl bg-[var(--color-brand-bg)] p-5 text-[var(--color-text-muted)]">
              <FiFolder
                size={32}
              />
            </div>

            <h3 className="mt-5 text-lg font-bold">
              No categories found
            </h3>

            <p className="mt-2 max-w-md text-sm text-[var(--color-text-secondary)]">
              {search
                ? "Try a different search term."
                : "Create your first category to start organizing products."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={
                  handleAdd
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-bold text-black"
              >
                <FiPlus />

                Add Category
              </button>
            )}

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead>
                <tr className="border-b border-[var(--color-border-subtle)] text-left">

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Category
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Parent
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Slug
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Order
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Featured
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredCategories.map(
                  (category) => (
                    <tr
                      key={
                        category._id
                      }
                      className="border-b border-[var(--color-border-subtle)] last:border-0 hover:bg-[var(--color-surface-elevated)]/50"
                    >

                      {/* CATEGORY */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          {category.image ? (
                            <img
                              src={
                                category.image
                              }
                              alt={
                                category.name
                              }
                              className="h-14 w-14 rounded-xl object-cover"
                              onError={(
                                event
                              ) => {
                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--color-brand-bg)] text-[var(--color-text-muted)]">
                              <FiImage
                                size={20}
                              />
                            </div>
                          )}

                          <div className="min-w-0">

                            <p className="font-semibold text-[var(--color-text-primary)]">
                              {category.name ||
                                "Unnamed Category"}
                            </p>

                            {category.description && (
                              <p className="mt-1 max-w-xs truncate text-xs text-[var(--color-text-muted)]">
                                {
                                  category.description
                                }
                              </p>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* PARENT */}

                      <td className="px-6 py-5">

                        <span className="text-sm text-[var(--color-text-secondary)]">
                          {getParentName(
                            category
                          )}
                        </span>

                      </td>

                      {/* SLUG */}

                      <td className="px-6 py-5">

                        <code className="rounded-lg bg-[var(--color-brand-bg)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)]">
                          /
                          {category.slug ||
                            "-"}
                        </code>

                      </td>

                      {/* ORDER */}

                      <td className="px-6 py-5">

                        <span className="text-sm font-medium">
                          {category.sortOrder ??
                            0}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            category.isActive !==
                            false
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {category.isActive !==
                          false
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>

                      {/* FEATURED */}

                      <td className="px-6 py-5">

                        {category.isFeatured ? (
                          <span className="inline-flex items-center gap-1.5 text-yellow-400">
                            <FiStar
                              size={15}
                              fill="currentColor"
                            />

                            <span className="text-xs font-semibold">
                              Featured
                            </span>
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--color-text-muted)]">
                            —
                          </span>
                        )}

                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                category
                              )
                            }
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-brand-bg)] text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                            title="Edit category"
                          >
                            <FiEdit2
                              size={16}
                            />
                          </button>

                          {category.isActive !==
                          false ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  category
                                )
                              }
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 transition hover:bg-red-500/10"
                              title="Deactivate category"
                            >
                              <FiTrash2
                                size={16}
                              />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleRestore(
                                  category
                                )
                              }
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/5 text-green-400 transition hover:bg-green-500/10"
                              title="Restore category"
                            >
                              <FiRefreshCw
                                size={16}
                              />
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ==================================================
          ADD / EDIT MODAL
      ================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-2xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-6 py-5">

              <div>
                <h2 className="text-xl font-bold">
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  Create a clean category structure
                  for your store.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleCloseModal
                }
                disabled={saving}
                className="rounded-xl p-2 text-[var(--color-text-muted)] transition hover:bg-[var(--color-brand-bg)] hover:text-[var(--color-text-primary)]"
              >
                <FiX
                  size={20}
                />
              </button>

            </div>

            {/* MODAL ERROR */}

            {error && (
              <div className="mx-6 mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* FORM */}

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-6 p-6"
            >

              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category Name
                  <span className="ml-1 text-red-400">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. Men"
                  maxLength={50}
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-brand-bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]"
                  required
                />
              </div>

              {/* SLUG */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Slug
                </label>

                <input
                  type="text"
                  name="slug"
                  value={
                    formData.slug
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="men"
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-brand-bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]"
                />

                <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                  Generated automatically from
                  the category name.
                </p>
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Short category description..."
                  rows={4}
                  maxLength={500}
                  className="w-full resize-none rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-brand-bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]"
                />

                <p className="mt-1.5 text-right text-xs text-[var(--color-text-muted)]">
                  {
                    formData
                      .description
                      .length
                  }
                  /500
                </p>
              </div>

              {/* IMAGE */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  value={
                    formData.image
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-brand-bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]"
                />

                {formData.image && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-[var(--color-border-subtle)]">
                    <img
                      src={
                        formData.image
                      }
                      alt="Category preview"
                      className="h-40 w-full object-cover"
                      onError={(
                        event
                      ) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* PARENT */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Parent Category
                </label>

                <select
                  name="parent"
                  value={
                    formData.parent
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-brand-bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]"
                >
                  <option value="">
                    None — Main Category
                  </option>

                  {rootCategories
                    .filter(
                      (category) =>
                        !editingCategory ||
                        category._id !==
                          editingCategory._id
                    )
                    .map(
                      (
                        category
                      ) => (
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

                <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                  Select a parent only when this
                  category should be a subcategory.
                </p>
              </div>

              {/* SORT ORDER */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Display Order
                </label>

                <input
                  type="number"
                  name="sortOrder"
                  value={
                    formData.sortOrder
                  }
                  onChange={
                    handleChange
                  }
                  min="0"
                  step="1"
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-brand-bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]"
                />

                <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                  Lower numbers appear first.
                </p>
              </div>

              {/* CHECKBOXES */}

              <div className="grid gap-4 sm:grid-cols-2">

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-brand-bg)] p-4">

                  <div>
                    <p className="text-sm font-semibold">
                      Active
                    </p>

                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      Category is available in the
                      store.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="isActive"
                    checked={
                      formData.isActive
                    }
                    onChange={
                      handleChange
                    }
                    className="h-5 w-5 accent-[var(--color-accent)]"
                  />

                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-brand-bg)] p-4">

                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      Featured
                      <FiStar className="text-yellow-400" />
                    </p>

                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      Show this category in featured
                      sections.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={
                      formData.isFeatured
                    }
                    onChange={
                      handleChange
                    }
                    className="h-5 w-5 accent-[var(--color-accent)]"
                  />

                </label>

              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-border-subtle)] pt-6 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={
                    handleCloseModal
                  }
                  disabled={saving}
                  className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-brand-bg)] px-5 py-3 text-sm font-semibold transition hover:bg-[var(--color-surface-elevated)] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-bold text-black transition hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <FiRefreshCw className="animate-spin" />

                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheck />

                      {editingCategory
                        ? "Update Category"
                        : "Create Category"}
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Categories;