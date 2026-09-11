import {
  useMemo,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

// ======================================================
// DATA TABLE
// ======================================================

function DataTable({
  title = "Data Table",
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No data available.",
  searchable = true,
  pageSize = 5,
  showViewAll = false,
  onViewAll,
}) {
  // ====================================================
  // SEARCH
  // ====================================================

  const [searchTerm, setSearchTerm] =
    useState("");

  // ====================================================
  // PAGE
  // ====================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  // ====================================================
  // NORMALIZE COLUMNS
  //
  // Supports BOTH:
  //
  // {
  //   Header: "Order",
  //   accessor: "order"
  // }
  //
  // and:
  //
  // {
  //   label: "Order",
  //   key: "order"
  // }
  // ====================================================

  const normalizedColumns =
    useMemo(() => {
      return columns.map(
        (column) => ({
          key:
            column.key ||
            column.accessor,

          label:
            column.label ||
            column.Header,
        })
      );
    }, [columns]);

  // ====================================================
  // SEARCH DATA
  // ====================================================

  const filteredData =
    useMemo(() => {
      if (!searchTerm.trim()) {
        return data;
      }

      const search =
        searchTerm
          .trim()
          .toLowerCase();

      return data.filter(
        (row) => {
          return normalizedColumns.some(
            (column) => {
              const value =
                row[column.key];

              if (
                value === null ||
                value === undefined
              ) {
                return false;
              }

              // React element / component
              // ko safely search nahi karna
              if (
                typeof value ===
                "object"
              ) {
                return false;
              }

              return String(value)
                .toLowerCase()
                .includes(search);
            }
          );
        }
      );
    }, [
      data,
      searchTerm,
      normalizedColumns,
    ]);

  // ====================================================
  // RESET PAGE AFTER SEARCH
  // ====================================================

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // ====================================================
  // PAGINATION
  // ====================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredData.length /
          pageSize
      )
    );

  const safeCurrentPage =
    Math.min(
      currentPage,
      totalPages
    );

  const startIndex =
    (safeCurrentPage - 1) *
    pageSize;

  const endIndex =
    startIndex + pageSize;

  const paginatedData =
    filteredData.slice(
      startIndex,
      endIndex
    );

  // ====================================================
  // PAGE CHANGE
  // ====================================================

  const goToPreviousPage = () => {
    setCurrentPage(
      (page) =>
        Math.max(1, page - 1)
    );
  };

  const goToNextPage = () => {
    setCurrentPage(
      (page) =>
        Math.min(
          totalPages,
          page + 1
        )
    );
  };

  // ====================================================
  // DISPLAY RANGE
  // ====================================================

  const showingStart =
    filteredData.length === 0
      ? 0
      : startIndex + 1;

  const showingEnd =
    Math.min(
      endIndex,
      filteredData.length
    );

  // ====================================================
  // RENDER CELL
  // ====================================================

  const renderCell = (
    value
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return (
        <span className="text-text-muted">
          —
        </span>
      );
    }

    return value;
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-border-subtle
        bg-surface
      "
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-border-subtle
          p-6
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        {/* =================================================
            TITLE
        ================================================= */}

        <div>

          <h2
            className="
              text-xl
              font-bold
              text-text-primary
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-text-secondary
            "
          >
            {searchTerm
              ? `${filteredData.length} matching records`
              : `Total Records: ${data.length}`}
          </p>

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        {searchable && (
          <div
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              border
              border-border-subtle
              bg-brand-bg
              px-4
              py-3
              transition
              focus-within:border-accent
              md:w-80
            "
          >

            <FiSearch
              className="shrink-0 text-text-muted"
              size={18}
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                handleSearch(
                  event.target.value
                )
              }
              placeholder="Search..."
              className="
                w-full
                bg-transparent
                text-sm
                text-text-primary
                outline-none
                placeholder:text-text-muted
              "
            />

          </div>
        )}

      </div>

      {/* ==================================================
          TABLE
      ================================================== */}

      <div className="overflow-x-auto">

        <table className="min-w-full">

          {/* =================================================
              HEAD
          ================================================= */}

          <thead
            className="
              bg-brand-bg
            "
          >

            <tr>

              {normalizedColumns.map(
                (column) => (

                  <th
                    key={column.key}
                    className="
                      whitespace-nowrap
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-text-secondary
                    "
                  >
                    {column.label}
                  </th>

                )
              )}

            </tr>

          </thead>

          {/* =================================================
              BODY
          ================================================= */}

          <tbody>

            {/* ===============================================
                LOADING
            =============================================== */}

            {loading && (
              <tr>

                <td
                  colSpan={
                    normalizedColumns.length ||
                    1
                  }
                  className="px-6 py-20"
                >

                  <div className="flex flex-col items-center justify-center">

                    <div
                      className="
                        h-8
                        w-8
                        animate-spin
                        rounded-full
                        border-2
                        border-border-subtle
                        border-t-accent
                      "
                    />

                    <p
                      className="
                        mt-4
                        text-sm
                        text-text-secondary
                      "
                    >
                      Loading...
                    </p>

                  </div>

                </td>

              </tr>
            )}

            {/* ===============================================
                EMPTY
            =============================================== */}

            {!loading &&
              paginatedData.length ===
                0 && (

                <tr>

                  <td
                    colSpan={
                      normalizedColumns.length ||
                      1
                    }
                    className="
                      px-6
                      py-20
                      text-center
                    "
                  >

                    <div>

                      <p
                        className="
                          text-base
                          font-medium
                          text-text-primary
                        "
                      >
                        {searchTerm
                          ? "No matching records"
                          : emptyMessage}
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-text-secondary
                        "
                      >
                        {searchTerm
                          ? "Try a different search term."
                          : "There is nothing to display right now."}
                      </p>

                    </div>

                  </td>

                </tr>
              )}

            {/* ===============================================
                DATA
            =============================================== */}

            {!loading &&
              paginatedData.map(
                (row, rowIndex) => (

                  <tr
                    key={
                      row._id ||
                      row.id ||
                      rowIndex
                    }
                    className="
                      border-t
                      border-border-subtle
                      transition-colors
                      hover:bg-brand-bg
                    "
                  >

                    {normalizedColumns.map(
                      (column) => (

                        <td
                          key={
                            column.key
                          }
                          className="
                            whitespace-nowrap
                            px-6
                            py-5
                            text-sm
                            text-text-primary
                          "
                        >
                          {renderCell(
                            row[
                              column.key
                            ]
                          )}
                        </td>

                      )
                    )}

                  </tr>

                )
              )}

          </tbody>

        </table>

      </div>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          border-t
          border-border-subtle
          p-5
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        {/* =================================================
            RECORD INFO
        ================================================= */}

        <p
          className="
            text-sm
            text-text-secondary
          "
        >
          {filteredData.length > 0
            ? `Showing ${showingStart}-${showingEnd} of ${filteredData.length}`
            : "Showing 0 records"}
        </p>

        <div className="flex items-center gap-3">

          {/* ===============================================
              VIEW ALL
          =============================================== */}

          {showViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="
                rounded-lg
                bg-accent
                px-5
                py-2
                text-sm
                font-semibold
                text-brand-bg
                transition
                hover:bg-accent-hover
              "
            >
              View All
            </button>
          )}

          {/* ===============================================
              PREVIOUS
          =============================================== */}

          <button
            type="button"
            onClick={
              goToPreviousPage
            }
            disabled={
              safeCurrentPage <= 1
            }
            aria-label="Previous page"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-border-subtle
              bg-surface
              text-text-secondary
              transition
              hover:border-accent
              hover:text-text-primary
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <FiChevronLeft
              size={18}
            />
          </button>

          {/* ===============================================
              PAGE
          =============================================== */}

          <span
            className="
              min-w-[80px]
              text-center
              text-sm
              font-medium
              text-text-secondary
            "
          >
            Page{" "}
            {safeCurrentPage} of{" "}
            {totalPages}
          </span>

          {/* ===============================================
              NEXT
          =============================================== */}

          <button
            type="button"
            onClick={
              goToNextPage
            }
            disabled={
              safeCurrentPage >=
              totalPages
            }
            aria-label="Next page"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-border-subtle
              bg-surface
              text-text-secondary
              transition
              hover:border-accent
              hover:text-text-primary
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <FiChevronRight
              size={18}
            />
          </button>

        </div>

      </div>

    </div>
  );
}

// ======================================================
// PROP TYPES
// ======================================================

DataTable.propTypes = {
  title: PropTypes.string,

  loading: PropTypes.bool,

  emptyMessage:
    PropTypes.string,

  searchable:
    PropTypes.bool,

  pageSize:
    PropTypes.number,

  showViewAll:
    PropTypes.bool,

  onViewAll:
    PropTypes.func,

  columns: PropTypes.arrayOf(
    PropTypes.shape({
      // New format
      key: PropTypes.string,
      label: PropTypes.string,

      // Existing Dashboard format
      accessor: PropTypes.string,
      Header: PropTypes.string,
    })
  ).isRequired,

  data: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,
};

// ======================================================
// EXPORT
// ======================================================

export default DataTable;