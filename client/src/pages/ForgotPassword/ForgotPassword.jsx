import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiMail } from "react-icons/fi";

import AuthLayout from "../../components/auth/AuthLayout";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  function validateEmail() {
    if (!email.trim()) {
      setError("Email is required.");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return false;
    }

    setError("");

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateEmail()) return;

    try {
      setLoading(true);

      /*
      Backend API

      POST
      /api/auth/forgot-password

      {
         email
      }

      */

      console.log("Reset Link Sent");

      setSuccess(true);

    } catch (err) {

      console.log(err);

      setError("Something went wrong.");

    } finally {

      setLoading(false);

    }
  }
    return (
    <AuthLayout
      title="Forgot Password"
      description="Enter your registered email address and we'll send you a password reset link."
    >
      <div className="mt-6 text-center">

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-accent-soft">
          <FiMail
            size={45}
            className="text-accent"
          />
        </div>

        <h2 className="mt-8 text-3xl font-bold text-text-primary">
          Forgot Password
        </h2>

        <p className="mt-3 text-text-secondary">
          Enter your registered email to receive a password reset link.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >

          {/* Email */}

          <div>

            <label className="mb-2 block text-left text-sm font-medium text-text-secondary">
              Email Address
            </label>

            <div className="flex items-center rounded-xl border border-border-subtle bg-brand-bg px-4 focus-within:border-accent">

              <FiMail
                size={20}
                className="text-text-muted"
              />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="w-full bg-transparent px-3 py-4 text-text-primary outline-none placeholder:text-text-muted"
              />

            </div>

            {error && (
              <p className="mt-2 text-left text-sm text-red-500">
                {error}
              </p>
            )}

          </div>

          {/* Success */}

          {success && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">

              <p className="text-sm text-green-400">
                Password reset link has been sent successfully.
                Please check your email inbox.
              </p>

            </div>
          )}

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-6 py-4 text-lg font-semibold text-brand-bg transition-all duration-300 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>

          {/* Back */}

          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-text-secondary transition hover:text-accent"
          >
            <FiArrowLeft />

            Back to Login
          </Link>

        </form>

      </div>
    </AuthLayout>
  );
  }

export default ForgotPassword;