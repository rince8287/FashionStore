import {
  FiBell,
  FiChevronDown,
  FiSearch,
  FiUser,
} from "react-icons/fi";

function AdminTopbar({

  children,

}) {

  return (

    <header
      className="
        sticky
        top-0
        z-30
        border-b
        border-border-subtle
        bg-surface
        px-4
        py-4
        shadow-sm
        backdrop-blur-md
        sm:px-6
        lg:px-8
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
        "
      >

        {/* ==========================
            LEFT SECTION
        ========================== */}

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          {/* Sidebar Toggle Button */}

          {children}

          {/* Page Title */}

          <div>

            <h1
              className="
                text-xl
                font-bold
                text-text-primary
              "
            >
              Admin Dashboard
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-text-secondary
              "
            >
              Welcome back, Admin
            </p>

          </div>

        </div>
                {/* ==========================
            RIGHT SECTION
        ========================== */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          {/* Search */}

          <button
            type="button"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-border-subtle
              text-text-secondary
              transition-all
              duration-300
              hover:border-accent
              hover:text-accent
            "
          >
            <FiSearch size={20} />
          </button>

          {/* Notifications */}

          <button
            type="button"
            className="
              relative
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-border-subtle
              text-text-secondary
              transition-all
              duration-300
              hover:border-accent
              hover:text-accent
            "
          >
            <FiBell size={20} />

            <span
              className="
                absolute
                right-2
                top-2
                h-2.5
                w-2.5
                rounded-full
                bg-red-500
              "
            />
          </button>

          {/* Admin Profile */}

          <button
            type="button"
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-border-subtle
              px-3
              py-2
              transition-all
              duration-300
              hover:border-accent
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-accent
                text-brand-bg
              "
            >
              <FiUser size={18} />
            </div>

            <div className="hidden text-left md:block">

              <h3 className="text-sm font-semibold text-text-primary">
                Admin
              </h3>

              <p className="text-xs text-text-secondary">
                Super Admin
              </p>

            </div>

            <FiChevronDown
              size={18}
              className="hidden text-text-secondary md:block"
            />

          </button>

        </div>

      </div>
          </header>

  );

}

export default AdminTopbar;