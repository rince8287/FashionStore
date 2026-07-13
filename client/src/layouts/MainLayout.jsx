import { Outlet } from "react-router-dom";

import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg text-text-primary">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;