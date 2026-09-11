import {
  FiHeart,
} from "react-icons/fi";

function AdminFooter() {

  const currentYear =
    new Date().getFullYear();

  return (

    <footer
      className="
        border-t
        border-border-subtle
        bg-surface
        px-6
        py-5
      "
    >

      <div
        className="
          flex
          flex-col
          items-center
          justify-between
          gap-3
          text-center
          md:flex-row
        "
      >

        {/* Left */}

        <p
          className="
            text-sm
            text-text-secondary
          "
        >
          © {currentYear}{" "}
          <span className="font-semibold text-text-primary">
            FashionStore
          </span>

          {" "}Admin Panel.

          All Rights Reserved.

        </p>

        {/* Right */}

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            text-text-secondary
          "
        >

          <span>
            Made with
          </span>

          <FiHeart
            size={15}
            className="text-red-500"
          />

          <span>
            by
          </span>

          <span
            className="
              font-semibold
              text-accent
            "
          >
            FashionStore Team
          </span>

        </div>

      </div>

    </footer>

  );

}

export default AdminFooter;