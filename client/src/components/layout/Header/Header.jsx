import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";

function Header() {
  return (
    <header
      className="
        relative
        z-50
        w-full
        border-b
        border-border-subtle
        bg-surface
      "
    >
      {/* =====================================================
          ANNOUNCEMENT
      ===================================================== */}

      <AnnouncementBar />

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <div
        className="
          relative
          bg-surface
          transition-colors
          duration-300
        "
      >
        <Navbar />
      </div>
    </header>
  );
}

export default Header;