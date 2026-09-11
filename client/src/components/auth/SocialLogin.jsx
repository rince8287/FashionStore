import { FaApple } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

// ======================================================
// SOCIAL LOGIN
// ======================================================

function SocialLogin({
  onGoogleLogin,
  onAppleLogin,
  loading = "",
}) {
  // ====================================================
  // GOOGLE SUCCESS
  // ====================================================

  function handleGoogleSuccess(response) {
    console.log(
      "========== GOOGLE LOGIN SUCCESS =========="
    );

    console.log(
      "Google Response:",
      response
    );

    // Google credential check
    if (!response?.credential) {
      console.error(
        "Google authentication failed. No credential received."
      );

      if (
        typeof onGoogleLogin === "function"
      ) {
        onGoogleLogin(null);
      }

      return;
    }

    console.log(
      "Google Credential Received:",
      true
    );

    // Send credential to Login.jsx
    if (
      typeof onGoogleLogin === "function"
    ) {
      onGoogleLogin(
        response.credential
      );
    }
  }

  // ====================================================
  // GOOGLE ERROR
  // ====================================================

  function handleGoogleError() {
    console.error(
      "Google Login Failed."
    );

    if (
      typeof onGoogleLogin === "function"
    ) {
      onGoogleLogin(null);
    }
  }

  // ====================================================
  // APPLE CLICK
  // ====================================================

  function handleAppleClick() {
    if (loading) {
      return;
    }

    if (
      typeof onAppleLogin === "function"
    ) {
      onAppleLogin();
    }
  }

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="space-y-6">

      {/* =================================================
          DIVIDER
      ================================================= */}

      <div className="relative">

        <div className="border-t border-border-subtle" />

        <span
          className="
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            whitespace-nowrap
            bg-surface
            px-4
            text-xs
            font-medium
            tracking-wide
            text-text-muted
          "
        >
          OR CONTINUE WITH
        </span>

      </div>

      {/* =================================================
          SOCIAL BUTTONS
      ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-3
          sm:grid-cols-2
        "
      >

        {/* =================================================
            GOOGLE
        ================================================= */}

        <div
          className="
            relative
            flex
            min-h-[52px]
            w-full
            items-center
            justify-center
            overflow-hidden
            rounded-xl
            border
            border-border-subtle
            bg-surface-elevated
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:border-accent
            hover:bg-brand-bg
            hover:shadow-lg
          "
        >

          {/* Google Loading Overlay */}

          {loading === "google" && (
            <div
              className="
                absolute
                inset-0
                z-20
                flex
                items-center
                justify-center
                gap-3
                rounded-xl
                bg-surface-elevated
              "
            >

              <span
                className="
                  h-5
                  w-5
                  animate-spin
                  rounded-full
                  border-2
                  border-text-muted
                  border-t-accent
                "
              />

              <span
                className="
                  text-sm
                  font-medium
                  text-text-primary
                "
              >
                Connecting...
              </span>

            </div>
          )}

          {/* Google Login */}

          <div
            className="
              flex
              w-full
              items-center
              justify-center
            "
          >
            <GoogleLogin
              onSuccess={
                handleGoogleSuccess
              }
              onError={
                handleGoogleError
              }

              useOneTap={false}

              theme="filled_black"

              size="large"

              text="continue_with"

              shape="rectangular"

              width="100%"

              logo_alignment="left"
            />
          </div>

        </div>

        {/* =================================================
            APPLE
        ================================================= */}

        <button
          type="button"
          onClick={
            handleAppleClick
          }
          disabled={
            !!loading
          }
          aria-label="Continue with Apple"
          className="
            group
            flex
            min-h-[52px]
            w-full
            items-center
            justify-center
            gap-3
            rounded-xl
            border
            border-border-subtle
            bg-surface-elevated
            px-5
            py-3
            font-medium
            text-text-primary
            shadow-sm
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:border-accent
            hover:bg-brand-bg
            hover:shadow-lg
            active:translate-y-0
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >

          {loading === "apple" ? (
            <>
              <span
                className="
                  h-5
                  w-5
                  animate-spin
                  rounded-full
                  border-2
                  border-text-muted
                  border-t-accent
                "
              />

              <span>
                Connecting...
              </span>
            </>
          ) : (
            <>
              {/* Apple Icon */}

              <span
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              >
                <FaApple
                  size={22}
                  className="
                    text-text-primary
                  "
                  aria-hidden="true"
                />
              </span>

              <span>
                Apple
              </span>
            </>
          )}

        </button>

      </div>

    </div>
  );
}

export default SocialLogin;