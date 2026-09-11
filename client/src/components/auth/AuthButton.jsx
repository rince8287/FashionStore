import PropTypes from "prop-types";

function AuthButton({
  type = "button",
  children,
  loading = false,
  disabled = false,
  fullWidth = true,
  variant = "primary",
  onClick,
  className = "",
}) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl px-6 py-4 text-base font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-accent text-brand-bg hover:bg-accent-hover focus:ring-accent",

    secondary:
      "border border-border-subtle bg-surface text-text-primary hover:border-accent hover:text-accent focus:ring-accent",

    danger:
      "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center gap-3">
          <svg
            className="h-5 w-5 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              opacity="0.25"
            />

            <path
              d="M22 12a10 10 0 0 1-10 10"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>

          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

AuthButton.propTypes = {
  type: PropTypes.oneOf([
    "button",
    "submit",
    "reset",
  ]),
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
  ]),
  onClick: PropTypes.func,
  className: PropTypes.string,
};

AuthButton.defaultProps = {
  type: "button",
  loading: false,
  disabled: false,
  fullWidth: true,
  variant: "primary",
  onClick: undefined,
  className: "",
};

export default AuthButton;