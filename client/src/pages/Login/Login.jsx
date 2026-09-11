import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";
import SocialLogin from "../../components/auth/SocialLogin";

function Login() {
  // ====================================================
  // AUTH
  // ====================================================

  const {
    login,
    googleLogin,
    appleLogin,
  } = useAuth();

  const navigate = useNavigate();

  // ====================================================
  // STATES
  // ====================================================

  const [loading, setLoading] =
    useState(false);

  const [socialLoading, setSocialLoading] =
    useState("");

  const [errors, setErrors] =
    useState({});

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
      remember: false,
    });

  // ====================================================
  // REDIRECT AFTER LOGIN
  // ====================================================

  function redirectAfterLogin(user) {
    if (!user) {
      navigate("/");
      return;
    }

    if (user.role === "admin") {
      navigate("/admin");
      return;
    }

    navigate("/");
  }

  // ====================================================
  // INPUT CHANGE
  // ====================================================

  function handleChange(event) {
    const {
      name,
      value,
      checked,
      type,
    } = event.target;

    setFormData((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  // ====================================================
  // FORM VALIDATION
  // ====================================================

  function validateForm() {
    const newErrors = {};

    // --------------------------------------------------
    // Email
    // --------------------------------------------------

    if (!formData.email.trim()) {
      newErrors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email =
        "Please enter a valid email.";
    }

    // --------------------------------------------------
    // Password
    // --------------------------------------------------

    if (!formData.password.trim()) {
      newErrors.password =
        "Password is required.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  }

  // ====================================================
  // NORMAL LOGIN
  // ====================================================

  async function handleSubmit(event) {
    event.preventDefault();

    // --------------------------------------------------
    // Prevent duplicate request
    // --------------------------------------------------

    if (loading || socialLoading) {
      return;
    }

    // --------------------------------------------------
    // Validate
    // --------------------------------------------------

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // ------------------------------------------------
      // Login API
      // ------------------------------------------------

      const response = await login({
        email:
          formData.email.trim(),

        password:
          formData.password,

        remember:
          formData.remember,
      });

      console.log(
        "Login Success:",
        response
      );

      // ------------------------------------------------
      // Reset form
      // ------------------------------------------------

      setFormData({
        email: "",
        password: "",
        remember: false,
      });

      // ------------------------------------------------
      // Redirect
      // ------------------------------------------------

      redirectAfterLogin(
        response?.user
      );

    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please try again.";

      alert(message);

    } finally {
      setLoading(false);
    }
  }

  // ====================================================
  // GOOGLE LOGIN
  // ====================================================
  //
  // IMPORTANT:
  //
  // SocialLogin component ko Google credential
  // callback karna hoga.
  //
  // Example:
  //
  // onGoogleLogin={(credential) =>
  //   handleGoogleLogin(credential)
  // }
  //
  // ====================================================

  async function handleGoogleLogin(
    credential
  ) {
    // --------------------------------------------------
    // Credential missing
    // --------------------------------------------------

    if (!credential) {
      alert(
        "Google authentication failed. No credential received."
      );

      return;
    }

    // --------------------------------------------------
    // Prevent duplicate request
    // --------------------------------------------------

    if (
      loading ||
      socialLoading
    ) {
      return;
    }

    try {
      setSocialLoading(
        "google"
      );

      console.log(
        "========== GOOGLE LOGIN =========="
      );

      console.log(
        "Google credential received:",
        true
      );

      // ------------------------------------------------
      // Call AuthContext
      // ------------------------------------------------

      const response =
        await googleLogin(
          credential
        );

      console.log(
        "Google Login Success:",
        response
      );

      // ------------------------------------------------
      // Redirect
      // ------------------------------------------------

      redirectAfterLogin(
        response?.user
      );

    } catch (error) {
      console.error(
        "Google Login Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Google login failed. Please try again.";

      alert(message);

    } finally {
      setSocialLoading("");
    }
  }

  // ====================================================
  // APPLE LOGIN
  // ====================================================
  //
  // SocialLogin component se Apple identityToken
  // receive hoga.
  //
  // ====================================================

  async function handleAppleLogin(
    identityToken,
    name = ""
  ) {
    // --------------------------------------------------
    // Token missing
    // --------------------------------------------------

    if (!identityToken) {
      alert(
        "Apple authentication failed. No identity token received."
      );

      return;
    }

    // --------------------------------------------------
    // Prevent duplicate request
    // --------------------------------------------------

    if (
      loading ||
      socialLoading
    ) {
      return;
    }

    try {
      setSocialLoading(
        "apple"
      );

      console.log(
        "========== APPLE LOGIN =========="
      );

      console.log(
        "Apple identity token received:",
        true
      );

      // ------------------------------------------------
      // Call AuthContext
      // ------------------------------------------------

      const response =
        await appleLogin(
          identityToken,
          name
        );

      console.log(
        "Apple Login Success:",
        response
      );

      // ------------------------------------------------
      // Redirect
      // ------------------------------------------------

      redirectAfterLogin(
        response?.user
      );

    } catch (error) {
      console.error(
        "Apple Login Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Apple login failed. Please try again.";

      alert(message);

    } finally {
      setSocialLoading("");
    }
  }

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <AuthLayout
      title="Welcome Back"
      description="Sign in to continue shopping premium fashion products, manage your wishlist, track orders and enjoy a seamless shopping experience."
    >
      {/* =================================================
          LOGIN HEADER
      ================================================= */}

      <h2 className="text-3xl font-bold text-text-primary">
        Login
      </h2>

      <p className="mt-2 text-text-secondary">
        Enter your account details.
      </p>

      {/* =================================================
          LOGIN FORM
      ================================================= */}

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-6"
      >
        {/* ===============================================
            EMAIL
        =============================================== */}

        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">
            Email Address
          </label>

          <div
            className="
              flex items-center
              rounded-xl
              border border-border-subtle
              bg-brand-bg
              px-4
              transition-all duration-300
              focus-within:border-accent
              focus-within:ring-2
              focus-within:ring-accent/30
            "
          >
            <FiMail
              className="text-text-muted"
              size={20}
            />

            <input
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="Enter your email"
              autoComplete="email"
              disabled={
                loading ||
                !!socialLoading
              }
              className="
                w-full
                bg-transparent
                px-3 py-4
                text-text-primary
                outline-none
                placeholder:text-text-muted
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />
          </div>

          {errors.email && (
            <p className="mt-2 text-sm text-red-500">
              {errors.email}
            </p>
          )}
        </div>

        {/* ===============================================
            PASSWORD
        =============================================== */}

        <PasswordInput
          label="Password"
          name="password"
          value={
            formData.password
          }
          onChange={
            handleChange
          }
          placeholder="Enter your password"
          autoComplete="current-password"
          error={
            errors.password
          }
          disabled={
            loading ||
            !!socialLoading
          }
        />

        {/* ===============================================
            REMEMBER + FORGOT
        =============================================== */}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              name="remember"
              checked={
                formData.remember
              }
              onChange={
                handleChange
              }
              disabled={
                loading ||
                !!socialLoading
              }
              className="
                h-4 w-4
                accent-accent
              "
            />

            Remember Me
          </label>

          <Link
            to="/forgot-password"
            className="
              text-sm
              font-medium
              text-accent
              transition-colors
              hover:text-accent-hover
            "
          >
            Forgot Password?
          </Link>
        </div>

        {/* ===============================================
            LOGIN BUTTON
        =============================================== */}

        <button
          type="submit"
          disabled={
            loading ||
            !!socialLoading
          }
          className="
            w-full
            rounded-xl
            bg-accent
            px-6 py-4
            text-base
            font-semibold
            text-brand-bg
            transition-all duration-300
            hover:bg-accent-hover
            hover:shadow-lg
            disabled:cursor-not-allowed
            disabled:opacity-70
          "
        >
          {loading
            ? "Logging In..."
            : "Login"}
        </button>

        {/* ===============================================
            SOCIAL LOGIN
        =============================================== */}

        <SocialLogin
          onGoogleLogin={
            handleGoogleLogin
          }

          onAppleLogin={
            handleAppleLogin
          }

          loading={
            socialLoading
          }
        />

        {/* ===============================================
            SIGNUP
        =============================================== */}

        <p className="text-center text-sm text-text-secondary">
          Don't have an account?{" "}

          <Link
            to="/signup"
            className="
              font-semibold
              text-accent
              transition-colors
              hover:text-accent-hover
            "
          >
            Create Account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;