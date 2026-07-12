import { Outlet } from "react-router-dom";

import Header from "../components/layout/Header/Header";

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg text-text-primary">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border-subtle bg-surface px-6 py-6">
        <p className="text-center text-sm text-text-muted">
          Premium Fashion Store
        </p>
      </footer>
    </div>
  );
}

export default MainLayout;