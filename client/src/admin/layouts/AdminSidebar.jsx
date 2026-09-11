import {
  NavLink,
} from "react-router-dom";

import {
  FiHome,
  FiBox,
  FiGrid,
  FiShoppingBag,
  FiUsers,
  FiStar,
  FiTag,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiX,
} from "react-icons/fi";

import {
  useAdmin,
} from "../context/AdminContext";

const sidebarItems = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: FiHome,
  },
  {
    title: "Products",
    path: "/admin/products",
    icon: FiBox,
  },
  {
    title: "Categories",
    path: "/admin/categories",
    icon: FiGrid,
  },
  {
    title: "Orders",
    path: "/admin/orders",
    icon: FiShoppingBag,
  },
  {
    title: "Customers",
    path: "/admin/customers",
    icon: FiUsers,
  },
  {
    title: "Reviews",
    path: "/admin/reviews",
    icon: FiStar,
  },
  {
    title: "Coupons",
    path: "/admin/coupons",
    icon: FiTag,
  },
  {
    title: "Analytics",
    path: "/admin/analytics",
    icon: FiBarChart2,
  },
  {
    title: "Settings",
    path: "/admin/settings",
    icon: FiSettings,
  },
];

function AdminSidebar({
  mobile = false,
  onClose,
}) {

  const {
    sidebarOpen,
  } = useAdmin();

  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";

  };

  return (
        <aside
      className={`
        flex
        h-full
        flex-col
        border-r
        border-border-subtle
        bg-surface
        transition-all
        duration-300
        ${
          mobile
            ? "w-72"
            : sidebarOpen
            ? "w-72"
            : "w-24"
        }
      `}
    >

      {/* ==========================================
          HEADER
      ========================================== */}

      <div
        className="
          flex
          h-20
          items-center
          justify-between
          border-b
          border-border-subtle
          px-6
        "
      >

        {/* Logo */}

        <div
          className={`
            flex
            items-center
            gap-3
            overflow-hidden
            ${
              !sidebarOpen && !mobile
                ? "justify-center"
                : ""
            }
          `}
        >

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-accent
              text-xl
              font-bold
              text-brand-bg
            "
          >
            FS
          </div>

          {(sidebarOpen || mobile) && (
            <div>

              <h2 className="text-lg font-bold text-text-primary">
                FashionStore
              </h2>

              <p className="text-xs text-text-secondary">
                Admin Panel
              </p>

            </div>
          )}

        </div>

        {/* Mobile Close */}

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              p-2
              text-text-secondary
              transition
              hover:bg-surface-elevated
              hover:text-text-primary
            "
          >
            <FiX size={22} />
          </button>
        )}

      </div>

      {/* ==========================================
          NAVIGATION
      ========================================== */}

      <nav className="flex-1 overflow-y-auto py-6">
                {sidebarItems.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `
                  mx-3
                  mb-2
                  flex
                  items-center
                  rounded-xl
                  px-4
                  py-3
                  transition-all
                  duration-300
                  ${
                    isActive
                      ? "bg-accent text-brand-bg shadow-lg"
                      : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                  }
                  ${
                    !sidebarOpen && !mobile
                      ? "justify-center"
                      : ""
                  }
                `
              }
            >

              <Icon
                size={20}
                className="shrink-0"
              />

              {(sidebarOpen || mobile) && (

                <span className="ml-4 text-sm font-medium">

                  {item.title}

                </span>

              )}

            </NavLink>

          );

        })}
              </nav>

      {/* ==========================================
          FOOTER
      ========================================== */}

      <div
        className="
          border-t
          border-border-subtle
          p-4
        "
      >

        <button
          type="button"
          onClick={handleLogout}
          className="
            flex
            w-full
            items-center
            rounded-xl
            px-4
            py-3
            text-red-400
            transition-all
            duration-300
            hover:bg-red-500/10
          "
        >

          <FiLogOut
            size={20}
            className="shrink-0"
          />

          {(sidebarOpen || mobile) && (

            <span className="ml-4 text-sm font-semibold">

              Logout

            </span>

          )}

        </button>

      </div>
          </aside>

  );

}
export default AdminSidebar;
      