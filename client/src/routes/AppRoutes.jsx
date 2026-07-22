import { Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/Home";
import NewIn from "../pages/NewIn/NewIn";
import Men from "../pages/Men/Men";
import Women from "../pages/Women/Women";
import Kids from "../pages/Kids/Kids";
import Beauty from "../pages/Beauty/Beauty";
import Accessories from "../pages/Accessories/Accessories";

import Product from "../pages/Product/Product";

import Profile from "../pages/Profile/Profile";
import Wishlist from "../pages/Wishlist/Wishlist";
import Cart from "../pages/Cart/Cart";

import NotFound from "../pages/NotFound/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Categories */}
        <Route path="/new-in" element={<NewIn />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/beauty" element={<Beauty />} />
        <Route path="/accessories" element={<Accessories />} />

        {/* Product */}
        <Route path="/product/:id" element={<Product />} />

        {/* User */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;