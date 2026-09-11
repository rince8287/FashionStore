import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiLock,
} from "react-icons/fi";

import AuthLayout from "../../components/auth/AuthLayout";

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  function getPasswordStrength(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return {
        text: "Weak",
        width: "33%",
        color: "bg-red-500",
      };
    }

    if (score <= 4) {
      return {
        text: "Medium",
        width: "66%",
        color: "bg-yellow-500",
      };
    }

    return {
      text: "Strong",
      width: "100%",
      color: "bg-green-500",
    };
  }

  const strength = getPasswordStrength(password);

  function validateForm() {
    if (!password.trim()) {
      setError("Password is required.");
      return false;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return false;
    }

    if (!confirmPassword.trim()) {
      setError("Confirm Password is required.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    setError("");

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      /*
        Backend API

        POST
        /api/auth/reset-password

        {
          password
        }
      */

      console.log("Password Reset Successfully");

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2500);

    } catch (err) {
      console.log(err);

      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }
    return (
    <AuthLayout
      title="Reset Password"
      description="Create a new password for your account."
    >
      <div className="mt-6 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-accent-soft">
          <FiLock
            size={45}
            className="text-accent"
          />
        </div>

        <h2 className="mt-8 text-3xl font-bold text-text-primary">
          Reset Password
        </h2>

        <p className="mt-3 text-text-secondary">
          Your new password must be different from your previous password.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >

          {/* New Password */}

          <div>
            <label className="mb-2 block text-left text-sm font-medium text-text-secondary">
              New Password
            </label>

            <div className="flex items-center rounded-xl border border-border-subtle bg-brand-bg px-4 focus-within:border-accent">

              <FiLock
                className="text-text-muted"
                size={20}
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full bg-transparent px-3 py-4 text-text-primary outline-none placeholder:text-text-muted"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="text-text-muted transition hover:text-accent"
              >
                {showPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>

            </div>
          </div>

          {/* Confirm Password */}

          <div>
            <label className="mb-2 block text-left text-sm font-medium text-text-secondary">
              Confirm Password
            </label>

            <div className="flex items-center rounded-xl border border-border-subtle bg-brand-bg px-4 focus-within:border-accent">

              <FiLock
                className="text-text-muted"
                size={20}
              />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                className="w-full bg-transparent px-3 py-4 text-text-primary outline-none placeholder:text-text-muted"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="text-text-muted transition hover:text-accent"
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>

            </div>
          </div>
                    {/* Password Strength */}

          {password && (
            <div>

              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-text-secondary">
                  Password Strength
                </span>

                <span className="text-sm font-medium text-text-primary">
                  {strength.text}
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-border-subtle">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                  style={{ width: strength.width }}
                />
              </div>

            </div>
          )}

          {/* Error Message */}

          {error && (
            <p className="text-left text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Success Message */}

          {success && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <p className="text-sm text-green-400">
                Password reset successfully! Redirecting to login...
              </p>
            </div>
          )}

          {/* Reset Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-6 py-4 text-lg font-semibold text-brand-bg transition-all duration-300 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Updating Password..." : "Reset Password"}
          </button>

          {/* Back to Login */}

          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-text-secondary transition hover:text-accent"
          >
            <FiArrowLeft size={18} />
            Back to Login
          </Link>

        </form>

      </div>
    </AuthLayout>
  );
  }

export default ResetPassword;