import PropTypes from "prop-types";

import {
  FiChevronRight,
} from "react-icons/fi";

// ======================================================
// PAGE HEADER
// ======================================================

function PageHeader({
  title,
  subtitle = "",
  action = null,
  breadcrumbs = [],
}) {
  return (
    <div
      className="
        w-full
      "
    >
      {/* ==================================================
          HEADER CONTENT
      ================================================== */}

      <div
        className="
          flex
          flex-col
          gap-6
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* =================================================
            LEFT CONTENT
        ================================================= */}

        <div className="min-w-0">

          {/* ===============================================
              BREADCRUMBS
          =============================================== */}

          {breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="
                mb-4
                flex
                flex-wrap
                items-center
                gap-1
                text-sm
                text-text-muted
              "
            >
              {breadcrumbs.map(
                (item, index) => {
                  const isLast =
                    index ===
                    breadcrumbs.length - 1;

                  return (
                    <div
                      key={`${item}-${index}`}
                      className="
                        flex
                        items-center
                        gap-1
                      "
                    >
                      <span
                        className={
                          isLast
                            ? `
                              font-medium
                              text-text-secondary
                            `
                            : `
                              text-text-muted
                            `
                        }
                      >
                        {item}
                      </span>

                      {!isLast && (
                        <FiChevronRight
                          size={14}
                          className="
                            mx-1
                            shrink-0
                            text-text-muted
                          "
                        />
                      )}
                    </div>
                  );
                }
              )}
            </nav>
          )}

          {/* ===============================================
              TITLE
          =============================================== */}

          <h1
            className="
              text-3xl
              font-bold
              leading-tight
              text-text-primary
              sm:text-4xl
            "
          >
            {title}
          </h1>

          {/* ===============================================
              SUBTITLE
          =============================================== */}

          {subtitle && (
            <p
              className="
                mt-3
                max-w-3xl
                text-sm
                leading-6
                text-text-secondary
                sm:text-base
              "
            >
              {subtitle}
            </p>
          )}

        </div>

        {/* =================================================
            RIGHT ACTION
        ================================================= */}

        {action && (
          <div
            className="
              flex
              shrink-0
              flex-wrap
              items-center
              gap-3
            "
          >
            {action}
          </div>
        )}

      </div>
    </div>
  );
}

// ======================================================
// PROP TYPES
// ======================================================

PageHeader.propTypes = {
  title:
    PropTypes.string.isRequired,

  subtitle:
    PropTypes.string,

  action:
    PropTypes.node,

  breadcrumbs:
    PropTypes.arrayOf(
      PropTypes.string
    ),
};

// ======================================================
// DEFAULT PROPS
// ======================================================

PageHeader.defaultProps = {
  subtitle: "",
  action: null,
  breadcrumbs: [],
};

// ======================================================
// EXPORT
// ======================================================

export default PageHeader;