import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getProducts,
} from "../services/productservice";

const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  // ====================================================
  // PRODUCTS
  // ====================================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ====================================================
  // FILTER STATES
  // ====================================================

  const [
    selectedCategories,
    setSelectedCategories,
  ] = useState([]);

  const [
    selectedRating,
    setSelectedRatingState,
  ] = useState(null);

  const [
    priceRange,
    setPriceRangeState,
  ] = useState([0, 100000]);

  const [
    sortBy,
    setSortByState,
  ] = useState("featured");

  const [
    searchQuery,
    setSearchQueryState,
  ] = useState("");

  // ====================================================
  // PAGINATION
  // ====================================================

  const [page, setPage] =
    useState(1);

  const [
    totalPages,
    setTotalPages,
  ] = useState(1);

  const [
    totalProducts,
    setTotalProducts,
  ] = useState(0);

  // ====================================================
  // CATEGORY
  // ====================================================

  const toggleCategory =
    useCallback((categoryId) => {
      setSelectedCategories(
        (previous) => {
          /*
            Backend currently accepts one category ID.

            Isliye category filter ko single-select
            behavior de rahe hain.

            Same category dobara click karoge
            to deselect ho jayegi.
          */

          if (
            previous.includes(
              categoryId
            )
          ) {
            return [];
          }

          return [categoryId];
        }
      );

      setPage(1);
    }, []);

  // ====================================================
  // RATING SETTER
  // ====================================================

  const setSelectedRating =
    useCallback((rating) => {
      setSelectedRatingState(
        rating
      );

      setPage(1);
    }, []);

  // ====================================================
  // PRICE SETTER
  // ====================================================

  const setPriceRange =
    useCallback((range) => {
      setPriceRangeState(range);

      setPage(1);
    }, []);

  // ====================================================
  // SORT SETTER
  // ====================================================

  const setSortBy =
    useCallback((value) => {
      setSortByState(value);

      setPage(1);
    }, []);

  // ====================================================
  // SEARCH SETTER
  // ====================================================

  const setSearchQuery =
    useCallback((value) => {
      setSearchQueryState(value);

      setPage(1);
    }, []);

  // ====================================================
  // FRONTEND SORT → BACKEND SORT
  // ====================================================

  const backendSort = useMemo(
    () => {
      switch (sortBy) {
        case "price-low":
          return "price-low-high";

        case "price-high":
          return "price-high-low";

        case "rating":
          return "rating";

        case "popular":
          return "popular";

        case "newest":
          return "newest";

        case "oldest":
          return "oldest";

        case "name-a-z":
          return "name-a-z";

        case "name-z-a":
          return "name-z-a";

        case "featured":
        default:
          return "newest";
      }
    },
    [sortBy]
  );

  // ====================================================
  // FETCH PRODUCTS
  // ====================================================

  const fetchProducts =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        // ==============================================
        // BUILD QUERY PARAMS
        // ==============================================

        const params = {
          page,
          limit: 20,
          sort: backendSort,
        };

        // ==============================================
        // SEARCH
        // ==============================================

        const cleanSearch =
          searchQuery.trim();

        if (cleanSearch) {
          params.search =
            cleanSearch;
        }

        // ==============================================
        // CATEGORY
        //
        // Backend expects MongoDB category ID.
        // ==============================================

        if (
          selectedCategories.length >
          0
        ) {
          params.category =
            selectedCategories[0];
        }

        // ==============================================
        // RATING
        // ==============================================

        if (
          selectedRating !== null
        ) {
          params.minRating =
            selectedRating;
        }

        // ==============================================
        // PRICE
        // ==============================================

        if (priceRange[0] > 0) {
          params.minPrice =
            priceRange[0];
        }

        if (
          priceRange[1] < 100000
        ) {
          params.maxPrice =
            priceRange[1];
        }

        // ==============================================
        // API REQUEST
        // ==============================================

        const response =
          await getProducts(params);

        // ==============================================
        // PRODUCTS
        // ==============================================

        const productList =
          Array.isArray(
            response?.products
          )
            ? response.products
            : [];

        setProducts(productList);

        // ==============================================
        // TOTAL PRODUCTS
        // ==============================================

        setTotalProducts(
          Number(
            response?.totalProducts
          ) || 0
        );

        // ==============================================
        // PAGINATION
        // ==============================================

        setTotalPages(
          Number(
            response?.pagination
              ?.totalPages
          ) || 1
        );
      } catch (error) {
        console.error(
          "Fetch Products Error:",
          error
        );

        const message =
          error?.response?.data
            ?.message ||
          error?.message ||
          "Failed to fetch products.";

        setError(message);

        setProducts([]);

        setTotalProducts(0);

        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }, [
      page,
      backendSort,
      searchQuery,
      selectedCategories,
      selectedRating,
      priceRange,
    ]);

  // ====================================================
  // FETCH PRODUCTS WHEN FILTER/PAGE CHANGES
  // ====================================================

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ====================================================
  // CLEAR FILTERS
  // ====================================================

  const clearFilters =
    useCallback(() => {
      setSelectedCategories([]);

      setSelectedRatingState(null);

      setPriceRangeState([
        0,
        100000,
      ]);

      setSortByState(
        "featured"
      );

      setSearchQueryState("");

      setPage(1);
    }, []);

  // ====================================================
  // REFRESH PRODUCTS
  // ====================================================

  const refreshProducts =
    useCallback(async () => {
      await fetchProducts();
    }, [fetchProducts]);

  // ====================================================
  // ACTIVE FILTER CHECK
  // ====================================================

  const hasActiveFilters =
    useMemo(() => {
      return (
        selectedCategories.length >
          0 ||
        selectedRating !== null ||
        priceRange[0] !== 0 ||
        priceRange[1] !==
          100000 ||
        searchQuery.trim() !== ""
      );
    }, [
      selectedCategories,
      selectedRating,
      priceRange,
      searchQuery,
    ]);

  // ====================================================
  // CONTEXT VALUE
  // ====================================================

  const value = useMemo(
    () => ({
      // ================================================
      // PRODUCTS
      // ================================================

      products,

      /*
        Old components agar filteredProducts
        use kar rahe hain to unko break nahi karega.
      */

      filteredProducts:
        products,

      loading,
      error,

      totalProducts,
      totalPages,

      // ================================================
      // PAGINATION
      // ================================================

      page,
      setPage,

      // ================================================
      // FILTERS
      // ================================================

      selectedCategories,

      selectedRating,

      priceRange,

      sortBy,

      searchQuery,

      hasActiveFilters,

      // ================================================
      // ACTIONS
      // ================================================

      toggleCategory,

      setSelectedRating,

      setPriceRange,

      setSortBy,

      setSearchQuery,

      clearFilters,

      refreshProducts,
    }),
    [
      products,
      loading,
      error,
      totalProducts,
      totalPages,
      page,
      selectedCategories,
      selectedRating,
      priceRange,
      sortBy,
      searchQuery,
      hasActiveFilters,
      toggleCategory,
      setSelectedRating,
      setPriceRange,
      setSortBy,
      setSearchQuery,
      clearFilters,
      refreshProducts,
    ]
  );

  // ====================================================
  // PROVIDER
  // ====================================================

  return (
    <FilterContext.Provider
      value={value}
    >
      {children}
    </FilterContext.Provider>
  );
}

// ======================================================
// USE FILTER HOOK
// ======================================================

export function useFilter() {
  const context =
    useContext(FilterContext);

  if (!context) {
    throw new Error(
      "useFilter must be used inside FilterProvider"
    );
  }

  return context;
}