// src/components/orders/OrderSearch.jsx

import { FiSearch, FiX } from "react-icons/fi";


function OrderSearch({
  searchQuery = "",
  onSearchChange,
  placeholder = "Search by Order ID, Product or Brand...",
}) {

  // ==========================================================
  // SEARCH CHANGE
  // ==========================================================

  const handleChange = (event) => {
    onSearchChange?.(event.target.value);
  };


  // ==========================================================
  // CLEAR SEARCH
  // ==========================================================

  const clearSearch = () => {
    onSearchChange?.("");
  };


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="group relative w-full">

      {/* ====================================================
          SEARCH CONTAINER
      ==================================================== */}

      <div
        className="
          relative
          flex
          min-h-12
          w-full
          items-center
          overflow-hidden
          rounded-xl
          border
          border-border-subtle
          bg-surface
          transition-all
          duration-300

          hover:border-accent/30

          focus-within:border-accent/70
          focus-within:bg-surface-elevated
          focus-within:shadow-[0_0_0_3px_rgba(212,175,55,0.07)]

          sm:min-h-[52px]
        "
      >

        {/* ==================================================
            SEARCH ICON
        ================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            left-4
            flex
            items-center
            justify-center
            text-text-muted
            transition-all
            duration-300

            group-focus-within:scale-110
            group-focus-within:text-accent
          "
        >
          <FiSearch size={18} />
        </div>


        {/* ==================================================
            INPUT
        ================================================== */}

        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
          aria-label="Search orders"
          className="
            h-full
            min-w-0
            flex-1
            bg-transparent
            px-12
            py-3
            pr-12
            text-sm
            font-medium
            text-text-primary
            outline-none

            placeholder:text-text-muted
            placeholder:transition-opacity
            placeholder:duration-300

            focus:placeholder:opacity-50

            sm:text-[15px]
          "
        />


        {/* ==================================================
            CLEAR BUTTON
        ================================================== */}

        {searchQuery.trim() && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            title="Clear search"
            className="
              absolute
              right-3
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              text-text-muted
              transition-all
              duration-300

              hover:bg-red-500/10
              hover:text-red-400

              active:scale-90
            "
          >
            <FiX size={17} />
          </button>
        )}


        {/* ==================================================
            ACTIVE INDICATOR
        ================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-0
            left-1/2
            h-px
            w-0
            -translate-x-1/2
            bg-accent
            transition-all
            duration-500

            group-focus-within:w-full
          "
        />

      </div>


      {/* ====================================================
          SEARCH HINT
      ==================================================== */}

      <div
        className="
          mt-2
          flex
          items-center
          justify-between
          px-1
        "
      >

        <p
          className="
            hidden
            text-[11px]
            text-text-muted
            sm:block
          "
        >
          Search your previous orders quickly
        </p>


        {searchQuery.trim() && (
          <p
            className="
              ml-auto
              text-[11px]
              font-medium
              text-accent
            "
          >
            Searching...
          </p>
        )}

      </div>

    </div>
  );
}


export default OrderSearch;