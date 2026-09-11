// ======================================================
// AUTH SERVICE
// ======================================================

import axios from "axios";

// ======================================================
// API URL
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

// ======================================================
// AUTH API
// ======================================================

const API = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ======================================================
// TOKEN STORAGE KEY
// ======================================================

const TOKEN_KEY = "fashionstore-token";
const USER_KEY = "fashionstore-user";

// ======================================================
// GET TOKEN
// ======================================================

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// ======================================================
// SAVE AUTH DATA
// ======================================================

const saveAuthData = (data) => {
  if (!data) {
    return;
  }

  if (data.token) {
    localStorage.setItem(
      TOKEN_KEY,
      data.token
    );
  }

  if (data.user) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(data.user)
    );
  }
};

// ======================================================
// CLEAR AUTH DATA
// ======================================================

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// ======================================================
// GET STORED USER
// ======================================================

export const getStoredUser = () => {
  try {
    const user =
      localStorage.getItem(USER_KEY);

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  } catch (error) {
    console.error(
      "Get Stored User Error:",
      error
    );

    return null;
  }
};

// ======================================================
// REGISTER
// ======================================================
//
// POST /api/v1/auth/register
//
// ======================================================

export const register = async (
  userData
) => {
  try {
    const { data } =
      await API.post(
        "/register",
        userData
      );

    saveAuthData(data);

    return data;
  } catch (error) {
    console.error(
      "Register API Error:",
      error
    );

    throw error;
  }
};

// ======================================================
// EMAIL / PASSWORD LOGIN
// ======================================================
//
// POST /api/v1/auth/login
//
// ======================================================

export const login = async (
  userData
) => {
  try {
    const { data } =
      await API.post(
        "/login",
        userData
      );

    saveAuthData(data);

    return data;
  } catch (error) {
    console.error(
      "Login API Error:",
      error
    );

    throw error;
  }
};

// ======================================================
// GOOGLE LOGIN
// ======================================================
//
// POST /api/v1/auth/google
//
// Google frontend SDK se milne wala credential
// backend ko bheja jayega.
//
// Expected:
//
// {
//   credential: "GOOGLE_ID_TOKEN"
// }
//
// ======================================================

export const googleLogin = async (
  credential
) => {
  try {
    // -----------------------------------------------
    // Validate credential
    // -----------------------------------------------

    if (!credential) {
      throw new Error(
        "Google credential is required."
      );
    }

    console.log(
      "========== GOOGLE LOGIN =========="
    );

    console.log(
      "Google Credential Available:",
      true
    );

    // -----------------------------------------------
    // Backend request
    // -----------------------------------------------

    const { data } =
      await API.post(
        "/google",
        {
          credential,
        }
      );

    // -----------------------------------------------
    // Save FashionStore JWT
    // -----------------------------------------------

    saveAuthData(data);

    console.log(
      "Google Login Success:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "Google Login API Error:",
      error
    );

    throw error;
  }
};

// ======================================================
// APPLE LOGIN
// ======================================================
//
// POST /api/v1/auth/apple
//
// Expected:
//
// {
//   identityToken: "...",
//   name: "Optional Name"
// }
//
// ======================================================

export const appleLogin = async (
  identityToken,
  name = ""
) => {
  try {
    // -----------------------------------------------
    // Validate token
    // -----------------------------------------------

    if (!identityToken) {
      throw new Error(
        "Apple identity token is required."
      );
    }

    console.log(
      "========== APPLE LOGIN =========="
    );

    console.log(
      "Apple Identity Token Available:",
      true
    );

    // -----------------------------------------------
    // Backend request
    // -----------------------------------------------

    const { data } =
      await API.post(
        "/apple",
        {
          identityToken,
          name,
        }
      );

    // -----------------------------------------------
    // Save FashionStore JWT
    // -----------------------------------------------

    saveAuthData(data);

    console.log(
      "Apple Login Success:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "Apple Login API Error:",
      error
    );

    throw error;
  }
};

// ======================================================
// GET CURRENT USER
// ======================================================
//
// GET /api/v1/auth/me
//
// ======================================================

export const getCurrentUser =
  async () => {
    try {
      const token =
        getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const { data } =
        await API.get(
          "/me",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      // ---------------------------------------------
      // Keep local user updated
      // ---------------------------------------------

      if (data?.user) {
        localStorage.setItem(
          USER_KEY,
          JSON.stringify(
            data.user
          )
        );
      }

      return data;
    } catch (error) {
      console.error(
        "Get Current User Error:",
        error
      );

      throw error;
    }
  };

// ======================================================
// UPDATE PROFILE
// ======================================================
//
// PUT /api/v1/auth/profile
//
// ======================================================

export const updateProfile =
  async (userData) => {
    try {
      const token =
        getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const { data } =
        await API.put(
          "/profile",
          userData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      // ---------------------------------------------
      // Update stored user
      // ---------------------------------------------

      if (data?.user) {
        localStorage.setItem(
          USER_KEY,
          JSON.stringify(
            data.user
          )
        );
      }

      return data;
    } catch (error) {
      console.error(
        "Update Profile Error:",
        error
      );

      throw error;
    }
  };

// ======================================================
// CHANGE PASSWORD
// ======================================================
//
// PUT /api/v1/auth/password
//
// ======================================================

export const changePassword =
  async (passwordData) => {
    try {
      const token =
        getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const { data } =
        await API.put(
          "/password",
          passwordData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      return data;
    } catch (error) {
      console.error(
        "Change Password Error:",
        error
      );

      throw error;
    }
  };

// ======================================================
// LOGOUT
// ======================================================
//
// POST /api/v1/auth/logout
//
// ======================================================

export const logout = async () => {
  try {
    const token =
      getToken();

    // -----------------------------------------------
    // Backend logout
    // -----------------------------------------------

    if (token) {
      try {
        await API.post(
          "/logout",
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        // ---------------------------------------------
        // Local logout should still happen even if
        // backend logout request fails.
        // ---------------------------------------------

        console.warn(
          "Backend logout request failed:",
          error
        );
      }
    }
  } finally {
    // -----------------------------------------------
    // Always clear local authentication
    // -----------------------------------------------

    clearAuthData();
  }

  return {
    success: true,
    message:
      "Logout successful.",
  };
};

// ======================================================
// GET BANK DETAILS
// ======================================================
//
// GET /api/v1/auth/bank-details
//
// ======================================================

export const getBankDetails =
  async () => {
    try {
      const token =
        getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const { data } =
        await API.get(
          "/bank-details",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      return data;
    } catch (error) {
      console.error(
        "Get Bank Details Error:",
        error
      );

      throw error;
    }
  };

// ======================================================
// GET UPI DETAILS
// ======================================================
//
// GET /api/v1/auth/upi-details
//
// ======================================================

export const getUpiDetails =
  async () => {
    try {
      const token =
        getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const { data } =
        await API.get(
          "/upi-details",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      return data;
    } catch (error) {
      console.error(
        "Get UPI Details Error:",
        error
      );

      throw error;
    }
  };

// ======================================================
// DEFAULT EXPORT
// ======================================================

const authService = {
  register,
  login,
  googleLogin,
  appleLogin,
  getCurrentUser,
  updateProfile,
  changePassword,
  logout,
  getBankDetails,
  getUpiDetails,
  getToken,
  getStoredUser,
  clearAuthData,
};

export default authService;