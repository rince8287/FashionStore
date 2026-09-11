import axios from "axios";

// ======================================================
// API CONFIG
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

const API = axios.create({
  baseURL: `${API_URL}/settings`,
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// AUTH CONFIG
// ======================================================

const getAuthConfig = () => {
  const token =
    localStorage.getItem(
      "fashionstore-token"
    );

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// ======================================================
// GET SETTINGS
// ======================================================
//
// GET /api/v1/settings
//
// Admin ke current store settings fetch karta hai.
//
// ======================================================

export const getSettings = async () => {
  try {
    const { data } =
      await API.get(
        "/",
        getAuthConfig()
      );

    return data;
  } catch (error) {
    console.error(
      "❌ Get Settings Service Error:",
      error
    );

    throw (
      error?.response?.data || {
        success: false,
        message:
          "Failed to fetch settings.",
      }
    );
  }
};

// ======================================================
// UPDATE SETTINGS
// ======================================================
//
// PUT /api/v1/settings
//
// Admin settings ko MongoDB mein save/update karta hai.
//
// ======================================================

export const updateSettings = async (
  settings
) => {
  try {
    const { data } =
      await API.put(
        "/",
        settings,
        getAuthConfig()
      );

    return data;
  } catch (error) {
    console.error(
      "❌ Update Settings Service Error:",
      error
    );

    throw (
      error?.response?.data || {
        success: false,
        message:
          "Failed to update settings.",
      }
    );
  }
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

const settingsService = {
  getSettings,
  updateSettings,
};

export default settingsService;