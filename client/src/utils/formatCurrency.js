// src/utils/formatCurrency.js

/**
 * Format amount into Indian Currency
 * Example:
 * 4999 -> ₹4,999
 * 250000 -> ₹2,50,000
 */

export const formatCurrency = (
  amount = 0,
  options = {}
) => {
  const {
    currency = "INR",
    locale = "en-IN",
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options;

  const value = Number(amount);

  if (Number.isNaN(value)) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(0);
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
};

/**
 * Format number only
 * Example:
 * 250000 -> 2,50,000
 */

export const formatNumber = (
  value = 0,
  locale = "en-IN"
) => {
  return new Intl.NumberFormat(locale).format(
    Number(value)
  );
};

/**
 * Convert paise to rupees
 * Example:
 * 499900 -> ₹4,999
 */

export const formatPaiseToRupees = (
  paise = 0
) => {
  return formatCurrency(paise / 100);
};

/**
 * Remove currency formatting
 * Example:
 * "₹4,999" -> 4999
 */

export const parseCurrency = (
  value = ""
) => {
  return Number(
    value.toString().replace(/[₹,\s]/g, "")
  );
};

export default formatCurrency;