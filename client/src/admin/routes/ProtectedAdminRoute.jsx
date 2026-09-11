import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function ProtectedAdminRoute({
  children,
}) {

  const {
    user,
    isAuthenticated,
    loading,
  } = useAuth();

  // ==========================================
  // AUTH LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-brand-bg">

        <div className="flex flex-col items-center gap-4">

          <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />

          <p className="text-text-secondary">
            Verifying Admin...
          </p>

        </div>

      </div>

    );

  }

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!isAuthenticated) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  // ==========================================
  // NOT ADMIN
  // ==========================================

  if (
    user?.role !== "admin"
  ) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }

  // ==========================================
  // ALLOW ACCESS
  // ==========================================

  return children;

}

export default ProtectedAdminRoute;