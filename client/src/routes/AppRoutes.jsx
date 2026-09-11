import { Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/Home";
import Shop from "../pages/Shop/Shop";

import NewIn from "../pages/NewIn/NewIn";
import Men from "../pages/Men/Men";
import Women from "../pages/Women/Women";
import Kids from "../pages/Kids/Kids";
import Beauty from "../pages/Beauty/Beauty";
import Accessories from "../pages/Accessories/Accessories";

import Product from "../pages/Product/Product";

import Cart from "../pages/Cart/Cart";
import Wishlist from "../pages/Wishlist/Wishlist";
import Checkout from "../pages/Checkout/Checkout";

import Orders from "../pages/Orders/Orders";
import OrderDetails from "../pages/OrderDetails/OrderDetails";
import TrackOrder from "../pages/TrackOrder/TrackOrder";

import Profile from "../pages/Profile/Profile";
import EditProfile from "../pages/Profile/EditProfile";
import Wallet from "../pages/Profile/Wallet";
import MyPayments from "../pages/Profile/MyPayments";
import PaymentRefund from "../pages/Profile/PaymentRefund";
import ReferEarn from "../pages/Profile/ReferEarn";
import HelpCenter from "../pages/Profile/HelpCenter";
import ChangeLanguage from "../pages/Profile/ChangeLanguage";
import ShareApp from "../pages/Profile/ShareApp";
import RateUs from "../pages/Profile/RateUs";
import LegalPolicies from "../pages/Profile/LegalPolicies";

import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import VerifyOTP from "../pages/VerifyOTP/VerifyOTP";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import EmailVerification from "../pages/EmailVerification/EmailVerification";

import AdminRoutes from "../admin/routes/AdminRoutes";
import AdminProvider from "../admin/context/AdminContext";

import NotFound from "../pages/NotFound/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop />} />

        <Route path="/new-in" element={<NewIn />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/beauty" element={<Beauty />} />
        <Route
          path="/accessories"
          element={<Accessories />}
        />

        <Route
          path="/product/:id"
          element={<Product />}
        />

        <Route path="/cart" element={<Cart />} />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/orders/:id"
          element={<OrderDetails />}
        />

        <Route
          path="/track-order/:id"
          element={<TrackOrder />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/profile/edit"
          element={<EditProfile />}
        />

        <Route
          path="/profile/orders"
          element={<Orders />}
        />

        <Route
          path="/profile/wallet"
          element={<Wallet />}
        />

        <Route
          path="/profile/payments"
          element={<MyPayments />}
        />

        <Route
          path="/profile/payment-refund"
          element={<PaymentRefund />}
        />

        <Route
          path="/profile/refer-earn"
          element={<ReferEarn />}
        />

        <Route
          path="/profile/help-center"
          element={<HelpCenter />}
        />

        <Route
          path="/profile/change-language"
          element={<ChangeLanguage />}
        />

        <Route
          path="/profile/share-app"
          element={<ShareApp />}
        />

        <Route
          path="/profile/rate-us"
          element={<RateUs />}
        />

        <Route
          path="/profile/legal"
          element={<LegalPolicies />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/email-verification"
          element={<EmailVerification />}
        />
      </Route>

      <Route
        path="/admin/*"
        element={
          <AdminProvider>
            <AdminRoutes />
          </AdminProvider>
        }
      />

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default AppRoutes;