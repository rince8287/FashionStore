import {
  useEffect,
  useState,
} from "react";

import {
  Outlet,
} from "react-router-dom";

import {
  FiMenu,
  FiX,
} from "react-icons/fi";

import {
  useAdmin,
} from "../context/AdminContext";

import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

function AdminLayout() {

  // ==========================================
  // ADMIN CONTEXT
  // ==========================================

  const {
    sidebarOpen,
    toggleSidebar,
  } = useAdmin();

  // ==========================================
  // STATES
  // ==========================================

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  const [
    isDesktop,
    setIsDesktop,
  ] = useState(
    window.innerWidth >= 1024
  );

  // ==========================================
  // RESPONSIVE
  // ==========================================

  useEffect(() => {

    const handleResize = () => {

      const desktop =
        window.innerWidth >= 1024;

      setIsDesktop(desktop);

      if (desktop) {

        setMobileSidebarOpen(false);

      }

    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

    };

  }, []);

  // ==========================================
  // MOBILE SIDEBAR
  // ==========================================

  const openMobileSidebar =
    () => {

      setMobileSidebarOpen(true);

    };

  const closeMobileSidebar =
    () => {

      setMobileSidebarOpen(false);

    };

  // ==========================================
  // ESC KEY
  // ==========================================

  useEffect(() => {

    const handleEscape = (
      event
    ) => {

      if (
        event.key === "Escape"
      ) {

        closeMobileSidebar();

      }

    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {

      window.removeEventListener(
        "keydown",
        handleEscape
      );

    };

  }, []);

  // ==========================================
  // JSX
  // ==========================================

  return (
        <div className="flex min-h-screen bg-brand-bg">

      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}

      {mobileSidebarOpen && (
        <div
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ==========================================
          MOBILE SIDEBAR
      ========================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          w-72
          bg-surface
          shadow-2xl
          transition-transform
          duration-300
          lg:hidden
          ${
            mobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <AdminSidebar
          mobile
          onClose={closeMobileSidebar}
        />
      </aside>

      {/* ==========================================
          DESKTOP SIDEBAR
      ========================================== */}

      <aside
        className={`
          hidden
          border-r
          border-border-subtle
          bg-surface
          transition-all
          duration-300
          lg:block
          ${
            sidebarOpen
              ? "w-72"
              : "w-24"
          }
        `}
      >
        <AdminSidebar />
      </aside>

      {/* ==========================================
          MAIN WRAPPER
      ========================================== */}

      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
                {/* ==========================================
            ADMIN TOPBAR
        ========================================== */}

        <AdminTopbar>

          {/* Mobile Menu Button */}

          <button
            type="button"
            onClick={openMobileSidebar}
            className="
              rounded-xl
              p-2
              text-text-secondary
              transition-all
              duration-300
              hover:bg-surface-elevated
              hover:text-text-primary
              lg:hidden
            "
          >
            <FiMenu size={24} />
          </button>

          {/* Desktop Sidebar Toggle */}

          <button
            type="button"
            onClick={toggleSidebar}
            className="
              hidden
              rounded-xl
              p-2
              text-text-secondary
              transition-all
              duration-300
              hover:bg-surface-elevated
              hover:text-text-primary
              lg:flex
            "
          >
            {sidebarOpen ? (
              <FiX size={22} />
            ) : (
              <FiMenu size={22} />
            )}
          </button>

        </AdminTopbar>

        {/* ==========================================
            MAIN CONTENT
        ========================================== */}

        <main
          className="
            flex-1
            overflow-y-auto
            bg-brand-bg
            p-4
            sm:p-6
            lg:p-8
          "
        >
                      {/* ==========================================
              PAGE CONTAINER
          ========================================== */}

          <div
            className="
              mx-auto
              w-full
              max-w-[1800px]
            "
          >

            {/* ==========================================
                ROUTE CONTENT
            ========================================== */}

            <Outlet />

          </div>

        </main>
              </div>

    </div>
      );

}

export default AdminLayout;
       
    