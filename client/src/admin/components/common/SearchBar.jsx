import {
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  FiSearch,
  FiX,
} from "react-icons/fi";

// ======================================================
// SEARCH BAR
// ======================================================

function SearchBar({
  placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  onClear,
  disabled = false,
  loading = false,
  autoFocus = false,
  showSearchButton = true,
  className = "",
}) {
  // ====================================================
  // FOCUS STATE
  // ====================================================

  const [
    focused,
    setFocused,
  ] = useState(false);

  // ====================================================
  // INPUT CHANGE
  // ====================================================

  const handleChange = (event) => {
    const newValue =
      event.target.value;

    if (typeof onChange === "function") {
      onChange(newValue);
    }
  };

  // ====================================================
  // SEARCH
  // ====================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      disabled ||
      loading
    ) {
      return;
    }

    if (typeof onSearch === "function") {
      onSearch(value);
    }
  };

  // ====================================================
  // CLEAR
  // ====================================================

  const handleClear = () => {
    if (
      disabled ||
      loading
    ) {
      return;
    }

    if (typeof onClear === "function") {
      onClear();
      return;
    }

    // Fallback:
    // agar parent ne onClear nahi diya
    if (typeof onChange === "function") {
      onChange("");
    }
  };

  // ====================================================
  // KEYBOARD
  // ====================================================

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      handleClear();
    }
  };

  // ====================================================
  // DISABLED STATE
  // ====================================================

  const isDisabled =
    disabled || loading;

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <form
      onSubmit={handleSubmit}
      className={`
        w-full
        ${className}
      `}
    >
      <div
        className={`
          flex
          min-h-[52px]
          items-center
          rounded-2xl
          border
          bg-brand-bg
          px-3
          transition-all
          duration-300

          ${
            focused
              ? `
                border-accent
                ring-2
                ring-accent/20
              `
              : `
                border-border-subtle
              `
          }

          ${
            isDisabled
              ? `
                cursor-not-allowed
                opacity-60
              `
              : ""
          }
        `}
      >
        {/* =================================================
            SEARCH ICON
        ================================================= */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-center
            px-2
          "
        >
          <FiSearch
            size={20}
            className="
              text-text-muted
            "
          />
        </div>

        {/* =================================================
            INPUT
        ================================================= */}

        <input
          type="text"
          value={value}
          disabled={isDisabled}
          autoFocus={autoFocus}
          placeholder={placeholder}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            setFocused(true)
          }
          onBlur={() =>
            setFocused(false)
          }
          className="
            min-w-0
            flex-1
            bg-transparent
            px-3
            py-2
            text-sm
            text-text-primary
            outline-none
            placeholder:text-text-muted
            disabled:cursor-not-allowed
          "
          aria-label={placeholder}
        />

        {/* =================================================
            CLEAR BUTTON
        ================================================= */}

        {value && !isDisabled && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="
              mr-1
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-text-muted
              transition
              hover:bg-surface-elevated
              hover:text-text-primary
              focus:outline-none
              focus:ring-2
              focus:ring-accent/30
            "
          >
            <FiX
              size={18}
            />
          </button>
        )}

        {/* =================================================
            SEARCH BUTTON
        ================================================= */}

        {showSearchButton && (
          <button
            type="submit"
            disabled={isDisabled}
            className="
              ml-2
              shrink-0
              rounded-xl
              bg-accent
              px-5
              py-2.5
              text-sm
              font-semibold
              text-brand-bg
              transition-all
              duration-300
              hover:bg-accent-hover
              focus:outline-none
              focus:ring-2
              focus:ring-accent
              focus:ring-offset-2
              focus:ring-offset-brand-bg
              disabled:cursor-not-allowed
              disabled:opacity-50
              active:scale-[0.98]
            "
          >
            {loading
              ? "Searching..."
              : "Search"}
          </button>
        )}
      </div>
    </form>
  );
}

// ======================================================
// PROP TYPES
// ======================================================

SearchBar.propTypes = {
  placeholder:
    PropTypes.string,

  value:
    PropTypes.string,

  onChange:
    PropTypes.func,

  onSearch:
    PropTypes.func,

  onClear:
    PropTypes.func,

  disabled:
    PropTypes.bool,

  loading:
    PropTypes.bool,

  autoFocus:
    PropTypes.bool,

  showSearchButton:
    PropTypes.bool,

  className:
    PropTypes.string,
};

// ======================================================
// DEFAULT PROPS
// ======================================================

SearchBar.defaultProps = {
  placeholder: "Search...",

  value: "",

  onChange:
    undefined,

  onSearch:
    undefined,

  onClear:
    undefined,

  disabled: false,

  loading: false,

  autoFocus: false,

  showSearchButton: true,

  className: "",
};

// ======================================================
// EXPORT
// ======================================================

export default SearchBar;