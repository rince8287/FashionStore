import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";

function Header() {
  return (
    <header className="border-b border-border-subtle bg-surface">
      <AnnouncementBar />
      <Navbar />
    </header>
  );
}

export default Header;