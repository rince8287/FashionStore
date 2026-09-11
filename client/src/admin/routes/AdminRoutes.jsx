import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedAdminRoute from "./ProtectedAdminRoute";
import AdminLayout from "../layouts/AdminLayout";

// ============================================================
// ADMIN PAGES
// ============================================================

import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import AddProduct from "../pages/AddProduct";
import EditProduct from "../pages/EditProduct";
import Categories from "../pages/Categories";
import Orders from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";
import Users from "../pages/Users";
import Reviews from "../pages/Reviews";
import Coupons from "../pages/Coupons";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";

// ============================================================
// ADMIN ROUTES
// ============================================================

function AdminRoutes() {
  return (
    <Routes>
      {/* ======================================================
          PROTECTED ADMIN AREA
          ====================================================== */}

      <Route
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        {/* ====================================================
            DASHBOARD
            /admin
            ==================================================== */}

        <Route
          index
          element={<Dashboard />}
        />

        {/* ====================================================
            PRODUCTS
            /admin/products
            ==================================================== */}

        <Route
          path="products"
          element={<Products />}
        />

        {/* ====================================================
            ADD PRODUCT
            /admin/products/add
            ==================================================== */}

        <Route
          path="products/add"
          element={<AddProduct />}
        />

        {/* ====================================================
            EDIT PRODUCT
            /admin/products/edit/:id
            ==================================================== */}

        <Route
          path="products/edit/:id"
          element={<EditProduct />}
        />

        {/* ====================================================
            CATEGORIES
            /admin/categories
            ==================================================== */}

        <Route
          path="categories"
          element={<Categories />}
        />

        {/* ====================================================
            ORDERS
            /admin/orders
            ==================================================== */}

        <Route
          path="orders"
          element={<Orders />}
        />

        {/* ====================================================
            ORDER DETAILS
            /admin/orders/:id
            ==================================================== */}

        <Route
          path="orders/:id"
          element={<OrderDetails />}
        />

        {/* ====================================================
            CUSTOMERS
            /admin/customers
            ==================================================== */}

        <Route
          path="customers"
          element={<Users />}
        />

        {/* ====================================================
            USERS
            /admin/users
            ==================================================== */}

        <Route
          path="users"
          element={<Users />}
        />

        {/* ====================================================
            REVIEWS
            /admin/reviews
            ==================================================== */}

        <Route
          path="reviews"
          element={<Reviews />}
        />

        {/* ====================================================
            COUPONS
            /admin/coupons
            ==================================================== */}

        <Route
          path="coupons"
          element={<Coupons />}
        />

        {/* ====================================================
            ANALYTICS
            /admin/analytics
            ==================================================== */}

        <Route
          path="analytics"
          element={<Analytics />}
        />

        {/* ====================================================
            SETTINGS
            /admin/settings
            ==================================================== */}

        <Route
          path="settings"
          element={<Settings />}
        />

        {/* ====================================================
            ADMIN NOT FOUND
            /admin/not-found
            ==================================================== */}

        <Route
          path="not-found"
          element={<NotFound />}
        />
      </Route>

      {/* ======================================================
          INVALID ADMIN ROUTES
          ====================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/admin"
            replace
          />
        }
      />
    </Routes>
  );
}

export default AdminRoutes;