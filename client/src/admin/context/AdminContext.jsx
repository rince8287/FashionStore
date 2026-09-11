import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const AdminContext =
  createContext(null);

function AdminProvider({
  children,
}) {

  const navigate =
    useNavigate();

  const {
    user,
    isAuthenticated,
    loading: authLoading,
    logout,
  } = useAuth();

  /* ==========================================
      STATES
  ========================================== */

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [dashboardLoading, setDashboardLoading] =
    useState(true);

  const [dashboardStats, setDashboardStats] =
    useState(null);

  const [notifications, setNotifications] =
    useState([]);

  const [selectedMenu, setSelectedMenu] =
    useState("dashboard");

  const [adminProfile, setAdminProfile] =
    useState(null);

  const [error, setError] =
    useState("");

  const [refreshKey, setRefreshKey] =
    useState(0);

  /* ==========================================
      ADMIN CHECK
  ========================================== */

  const isAdmin =
    isAuthenticated &&
    user?.role === "admin";
      /* ==========================================
      CHECK ADMIN ACCESS
  ========================================== */

  useEffect(() => {

    if (authLoading) return;

    if (!isAuthenticated) {

      navigate("/login", {
        replace: true,
      });

      return;

    }

    if (!isAdmin) {

      navigate("/", {
        replace: true,
      });

      return;

    }

    setAdminProfile(user);

    setDashboardLoading(false);

  }, [
    authLoading,
    isAuthenticated,
    isAdmin,
    navigate,
    user,
  ]);

  /* ==========================================
      SIDEBAR
  ========================================== */

  const openSidebar = () => {

    setSidebarOpen(true);

  };

  const closeSidebar = () => {

    setSidebarOpen(false);

  };

  const toggleSidebar = () => {

    setSidebarOpen((prev) => !prev);

  };

  /* ==========================================
      MENU
  ========================================== */

  const changeMenu = (
    menu
  ) => {

    setSelectedMenu(menu);

  };

  /* ==========================================
      DASHBOARD REFRESH
  ========================================== */

  const refreshDashboard =
    () => {

      setRefreshKey(
        (prev) => prev + 1
      );

    };
      /* ==========================================
      DASHBOARD STATS
  ========================================== */

  const updateDashboardStats = (
    stats
  ) => {

    setDashboardStats(stats);

  };

  const clearDashboardStats =
    () => {

      setDashboardStats(null);

    };

  /* ==========================================
      NOTIFICATIONS
  ========================================== */

  const addNotification = (
    notification
  ) => {

    setNotifications(
      (prev) => [
        {
          id:
            Date.now(),
          ...notification,
        },
        ...prev,
      ]
    );

  };

  const removeNotification =
    (id) => {

      setNotifications(
        (prev) =>
          prev.filter(
            (item) =>
              item.id !== id
          )
      );

    };

  const clearNotifications =
    () => {

      setNotifications([]);

    };

  /* ==========================================
      ERROR
  ========================================== */

  const showError = (
    message
  ) => {

    setError(message);

  };

  const clearError = () => {

    setError("");

  };

  /* ==========================================
      LOGOUT
  ========================================== */

  const handleLogout =
    async () => {

      try {

        await logout();

        navigate(
          "/login",
          {
            replace: true,
          }
        );

      } catch (err) {

        console.error(err);

      }

    };

  /* ==========================================
      HELPERS
  ========================================== */

  const isSidebarCollapsed =
    !sidebarOpen;

  const hasNotifications =
    notifications.length > 0;
      /* ==========================================
      CONTEXT VALUE
  ========================================== */

  const value = {

    // Admin

    isAdmin,
    adminProfile,

    // Dashboard

    dashboardStats,
    dashboardLoading,
    refreshKey,

    // Sidebar

    sidebarOpen,
    isSidebarCollapsed,
    openSidebar,
    closeSidebar,
    toggleSidebar,

    // Menu

    selectedMenu,
    changeMenu,

    // Notifications

    notifications,
    hasNotifications,
    addNotification,
    removeNotification,
    clearNotifications,

    // Error

    error,
    showError,
    clearError,

    // Dashboard

    refreshDashboard,
    updateDashboardStats,
    clearDashboardStats,

    // Logout

    handleLogout,

  };

  return (

    <AdminContext.Provider
      value={value}
    >

      {children}

    </AdminContext.Provider>

  );

}

/* ==========================================
    CUSTOM HOOK
========================================== */

export const useAdmin = () => {

  const context =
    useContext(AdminContext);

  if (!context) {

    throw new Error(
      "useAdmin must be used inside AdminProvider."
    );

  }

  return context;

};

export default AdminProvider;