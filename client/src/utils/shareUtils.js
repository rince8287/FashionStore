const APP_NAME = "FashionStore";

const APP_URL = "https://fashionstore.com";

const DEFAULT_MESSAGE = `🛍️ Shop the latest fashion on ${APP_NAME}!

Discover amazing collections for Men, Women, Kids, Beauty & Accessories.

Visit: ${APP_URL}`;

export const isShareSupported = () => {
  return typeof navigator !== "undefined" && !!navigator.share;
};

export const shareApp = async ({
  title = APP_NAME,
  text = DEFAULT_MESSAGE,
  url = APP_URL,
} = {}) => {
  if (!isShareSupported()) {
    return {
      success: false,
      message: "Web Share API is not supported.",
    };
  }

  try {
    await navigator.share({
      title,
      text,
      url,
    });

    return {
      success: true,
      message: "Shared successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Sharing cancelled.",
    };
  }
};

export const copyToClipboard = async (text = APP_URL) => {
  try {
    await navigator.clipboard.writeText(text);

    return {
      success: true,
      message: "Copied to clipboard.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to copy.",
    };
  }
};

export const getShareMessage = () => {
  return DEFAULT_MESSAGE;
};

export const shareOnWhatsApp = () => {
  const message = encodeURIComponent(DEFAULT_MESSAGE);

  window.open(
    `https://wa.me/?text=${message}`,
    "_blank"
  );
};

export const shareOnTelegram = () => {
  const message = encodeURIComponent(DEFAULT_MESSAGE);

  window.open(
    `https://t.me/share/url?url=${encodeURIComponent(
      APP_URL
    )}&text=${message}`,
    "_blank"
  );
};

export const shareOnFacebook = () => {
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      APP_URL
    )}`,
    "_blank"
  );
};

export const shareOnTwitter = () => {
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      DEFAULT_MESSAGE
    )}`,
    "_blank"
  );
};

export const shareByEmail = () => {
  window.location.href = `mailto:?subject=${encodeURIComponent(
    APP_NAME
  )}&body=${encodeURIComponent(DEFAULT_MESSAGE)}`;
};

const shareUtils = {
  APP_NAME,
  APP_URL,
  DEFAULT_MESSAGE,
  isShareSupported,
  shareApp,
  copyToClipboard,
  getShareMessage,
  shareOnWhatsApp,
  shareOnTelegram,
  shareOnFacebook,
  shareOnTwitter,
  shareByEmail,
};

export default shareUtils;