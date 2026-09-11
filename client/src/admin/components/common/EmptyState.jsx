import PropTypes from "prop-types";

import {
  FiInbox,
  FiRefreshCw,
} from "react-icons/fi";

// ======================================================
// EMPTY STATE
// ======================================================

function EmptyState({
  title = "No Data Found",
  description =
    "There is nothing to display at the moment.",
  buttonText = "",
  onButtonClick,
  icon = null,
}) {
  // ====================================================
  // BUTTON HANDLER
  // ====================================================

  const handleButtonClick = () => {
    if (
      typeof onButtonClick ===
      "function"
    ) {
      onButtonClick();
    }
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div
      className="
        flex
        min-h-[320px]
        w-full
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-border-subtle
        bg-surface
        px-6
        py-12
        text-center
        sm:min-h-[360px]
        sm:px-8
      "
    >
      {/* ==================================================
          ICON
      ================================================== */}

      <div
        className="
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-full
          bg-brand-bg
          text-accent
          sm:h-24
          sm:w-24
        "
      >
        {icon || (
          <FiInbox
            size={42}
            strokeWidth={1.7}
          />
        )}
      </div>

      {/* ==================================================
          TITLE
      ================================================== */}

      <h2
        className="
          mt-7
          text-xl
          font-bold
          text-text-primary
          sm:text-2xl
        "
      >
        {title}
      </h2>

      {/* ==================================================
          DESCRIPTION
      ================================================== */}

      {description && (
        <p
          className="
            mt-3
            max-w-lg
            text-sm
            leading-6
            text-text-secondary
            sm:text-base
            sm:leading-7
          "
        >
          {description}
        </p>
      )}

      {/* ==================================================
          ACTION BUTTON
      ================================================== */}

      {buttonText && (
        <button
          type="button"
          onClick={
            handleButtonClick
          }
          className="
            mt-8
            inline-flex
            items-center
            justify-center
            gap-3
            rounded-xl
            bg-accent
            px-6
            py-3
            text-sm
            font-semibold
            text-brand-bg
            transition-all
            duration-300
            hover:bg-accent-hover
            hover:shadow-lg
            focus:outline-none
            focus:ring-2
            focus:ring-accent
            focus:ring-offset-2
            focus:ring-offset-surface
            active:scale-[0.98]
            sm:text-base
          "
        >
          <FiRefreshCw
            size={18}
          />

          {buttonText}
        </button>
      )}
    </div>
  );
}

// ======================================================
// PROP TYPES
// ======================================================

EmptyState.propTypes = {
  title:
    PropTypes.string,

  description:
    PropTypes.string,

  buttonText:
    PropTypes.string,

  onButtonClick:
    PropTypes.func,

  icon:
    PropTypes.node,
};

// ======================================================
// DEFAULT PROPS
// ======================================================

EmptyState.defaultProps = {
  title: "No Data Found",

  description:
    "There is nothing to display at the moment.",

  buttonText: "",

  onButtonClick:
    undefined,

  icon: null,
};

// ======================================================
// EXPORT
// ======================================================

export default EmptyState;