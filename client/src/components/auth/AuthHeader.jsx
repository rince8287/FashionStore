import PropTypes from "prop-types";

function AuthHeader({
  icon,
  title,
  description,
  badge,
  className = "",
}) {
  return (
    <div className={`mb-8 text-center ${className}`}>
      {/* Badge */}
      {badge && (
        <span className="mb-4 inline-flex items-center rounded-full border border-accent/30 bg-accent-soft px-4 py-1 text-sm font-medium text-accent">
          {badge}
        </span>
      )}

      {/* Icon */}
      {icon && (
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent-soft">
          {icon}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
        {title}
      </h1>

      {/* Description */}
      {description && (
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-secondary sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

AuthHeader.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  badge: PropTypes.string,
  className: PropTypes.string,
};

AuthHeader.defaultProps = {
  icon: null,
  description: "",
  badge: "",
  className: "",
};

export default AuthHeader;