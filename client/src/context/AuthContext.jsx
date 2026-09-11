import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  register,
  login as loginService,

  // ==================================================
  // SOCIAL LOGIN
  // ==================================================

  googleLogin as googleLoginService,
  appleLogin as appleLoginService,

  logout as logoutService,
  getCurrentUser,
  updateProfile as updateProfileService,
  changePassword as changePasswordService,
} from "../services/authService";

// ======================================================
// AUTH CONTEXT
// ======================================================

const AuthContext = createContext({
  user: null,
  currentUser: null,
  isAuthenticated: false,
  loading: true,

  login: async () => {},
  signup: async () => {},

  googleLogin: async () => {},
  appleLogin: async () => {},

  logout: async () => {},
  refreshUser: async () => {},
  updateProfile: async () => {},
  changePassword: async () => {},
});

// ======================================================
// AUTH PROVIDER
// ======================================================

export function AuthProvider({
  children,
}) {
  // ====================================================
  // USER STATE
  // ====================================================

  const [user, setUser] =
    useState(null);

  // ====================================================
  // GLOBAL AUTH LOADING
  // ====================================================

  const [loading, setLoading] =
    useState(true);

  // ====================================================
  // AUTHENTICATED
  // ====================================================

  const isAuthenticated =
    !!user;

  // ====================================================
  // LOAD USER ON APP START
  // ====================================================

  useEffect(() => {
    loadUser();
  }, []);

  // ====================================================
  // LOAD CURRENT USER
  // ====================================================

  async function loadUser() {
    const token =
      localStorage.getItem(
        "fashionstore-token"
      );

    // --------------------------------------------------
    // No token
    // --------------------------------------------------

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // --------------------------------------------------
    // Token exists
    // --------------------------------------------------

    try {
      const response =
        await getCurrentUser();

      if (
        response?.user
      ) {
        setUser(
          response.user
        );

        localStorage.setItem(
          "fashionstore-user",
          JSON.stringify(
            response.user
          )
        );
      } else {
        throw new Error(
          "Invalid user response."
        );
      }
    } catch (error) {
      console.error(
        "Load User Error:",
        error
      );

      // ------------------------------------------------
      // Invalid / expired token
      // ------------------------------------------------

      localStorage.removeItem(
        "fashionstore-token"
      );

      localStorage.removeItem(
        "fashionstore-user"
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // ====================================================
  // SIGNUP
  // ====================================================

  async function signup(
    userData
  ) {
    setLoading(true);

    try {
      const response =
        await register(
          userData
        );

      if (
        response?.user
      ) {
        setUser(
          response.user
        );
      }

      return response;
    } catch (error) {
      console.error(
        "Signup Error:",
        error
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }

  // ====================================================
  // EMAIL / PASSWORD LOGIN
  // ====================================================

  async function login(
    userData
  ) {
    setLoading(true);

    try {
      const response =
        await loginService(
          userData
        );

      if (
        response?.user
      ) {
        setUser(
          response.user
        );
      }

      return response;
    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }

  // ====================================================
  // GOOGLE LOGIN
  // ====================================================
  //
  // Login.jsx se Google credential receive hoga.
  //
  // credential
  //      ↓
  // authService
  //      ↓
  // POST /auth/google
  //      ↓
  // backend verification
  //      ↓
  // FashionStore JWT
  //
  // ====================================================

  async function googleLogin(
    credential
  ) {
    setLoading(true);

    try {
      // ------------------------------------------------
      // Validate
      // ------------------------------------------------

      if (!credential) {
        throw new Error(
          "Google credential is required."
        );
      }

      console.log(
        "========== AUTH CONTEXT GOOGLE LOGIN =========="
      );

      // ------------------------------------------------
      // Backend Google login
      // ------------------------------------------------

      const response =
        await googleLoginService(
          credential
        );

      // ------------------------------------------------
      // Set user
      // ------------------------------------------------

      if (
        response?.user
      ) {
        setUser(
          response.user
        );

        localStorage.setItem(
          "fashionstore-user",
          JSON.stringify(
            response.user
          )
        );
      }

      console.log(
        "Google Authentication Success:",
        response
      );

      return response;
    } catch (error) {
      console.error(
        "Google Authentication Error:",
        error
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }

  // ====================================================
  // APPLE LOGIN
  // ====================================================
  //
  // identityToken
  //      ↓
  // authService
  //      ↓
  // POST /auth/apple
  //      ↓
  // backend verification
  //      ↓
  // FashionStore JWT
  //
  // ====================================================

  async function appleLogin(
    identityToken,
    name = ""
  ) {
    setLoading(true);

    try {
      // ------------------------------------------------
      // Validate
      // ------------------------------------------------

      if (!identityToken) {
        throw new Error(
          "Apple identity token is required."
        );
      }

      console.log(
        "========== AUTH CONTEXT APPLE LOGIN =========="
      );

      // ------------------------------------------------
      // Backend Apple login
      // ------------------------------------------------

      const response =
        await appleLoginService(
          identityToken,
          name
        );

      // ------------------------------------------------
      // Set user
      // ------------------------------------------------

      if (
        response?.user
      ) {
        setUser(
          response.user
        );

        localStorage.setItem(
          "fashionstore-user",
          JSON.stringify(
            response.user
          )
        );
      }

      console.log(
        "Apple Authentication Success:",
        response
      );

      return response;
    } catch (error) {
      console.error(
        "Apple Authentication Error:",
        error
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }

  // ====================================================
  // LOGOUT
  // ====================================================

  async function logout() {
    try {
      await logoutService();
    } catch (error) {
      console.error(
        "Logout Error:",
        error
      );
    } finally {
      // ------------------------------------------------
      // Always clear local auth
      // ------------------------------------------------

      localStorage.removeItem(
        "fashionstore-token"
      );

      localStorage.removeItem(
        "fashionstore-user"
      );

      setUser(null);
    }
  }

  // ====================================================
  // REFRESH USER
  // ====================================================

  async function refreshUser() {
    try {
      const response =
        await getCurrentUser();

      if (
        response?.user
      ) {
        setUser(
          response.user
        );

        localStorage.setItem(
          "fashionstore-user",
          JSON.stringify(
            response.user
          )
        );
      }

      return response?.user;
    } catch (error) {
      console.error(
        "Refresh User Error:",
        error
      );

      // ------------------------------------------------
      // Token invalid
      // ------------------------------------------------

      localStorage.removeItem(
        "fashionstore-token"
      );

      localStorage.removeItem(
        "fashionstore-user"
      );

      setUser(null);

      throw error;
    }
  }

  // ====================================================
  // UPDATE PROFILE
  // ====================================================

  async function updateProfile(
    userData
  ) {
    try {
      const response =
        await updateProfileService(
          userData
        );

      if (
        response?.user
      ) {
        setUser(
          response.user
        );

        localStorage.setItem(
          "fashionstore-user",
          JSON.stringify(
            response.user
          )
        );
      }

      return response;
    } catch (error) {
      console.error(
        "Update Profile Error:",
        error
      );

      throw error;
    }
  }

  // ====================================================
  // CHANGE PASSWORD
  // ====================================================

  async function changePassword(
    passwordData
  ) {
    try {
      return await changePasswordService(
        passwordData
      );
    } catch (error) {
      console.error(
        "Change Password Error:",
        error
      );

      throw error;
    }
  }

  // ====================================================
  // CONTEXT VALUE
  // ====================================================

  const value = useMemo(
    () => ({
      // ----------------------------------------------
      // User
      // ----------------------------------------------

      user,

      currentUser:
        user,

      isAuthenticated,

      loading,

      // ----------------------------------------------
      // Normal authentication
      // ----------------------------------------------

      login,

      signup,

      // ----------------------------------------------
      // Social authentication
      // ----------------------------------------------

      googleLogin,

      appleLogin,

      // ----------------------------------------------
      // Other auth functions
      // ----------------------------------------------

      logout,

      refreshUser,

      updateProfile,

      changePassword,
    }),

    [
      user,
      loading,
      isAuthenticated,
    ]
  );

  // ====================================================
  // PROVIDER
  // ====================================================

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ======================================================
// USE AUTH HOOK
// ======================================================

export const useAuth = () =>
  useContext(
    AuthContext
  );

export default AuthContext;