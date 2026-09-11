import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";
import SocialLogin from "../../components/auth/SocialLogin";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  const passwordStrength = useMemo(() => {
    const password = formData.password;

    if (!password) {
      return {
        label: "",
        color: "",
      };
    }

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return {
        label: "Weak Password",
        color: "text-red-500",
      };
    }

    if (score <= 4) {
      return {
        label: "Medium Password",
        color: "text-yellow-500",
      };
    }

    return {
      label: "Strong Password",
      color: "text-green-500",
    };
  }, [formData.password]);

  function validateForm() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone =
        "Phone number must contain 10 digits.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms =
        "Please accept Terms & Conditions.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }
    async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      console.log("Signup Response :", response);

      // Form Reset
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
      });

      alert("Account created successfully.");

      // Home Page
      navigate("/");

    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create Account"
      description="Join FashionStore today and explore premium fashion, exclusive offers, faster checkout, wishlist syncing and order tracking."
    >
      <h2 className="text-3xl font-bold text-text-primary">
        Sign Up
      </h2>

      <p className="mt-2 text-text-secondary">
        Create your FashionStore account.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-6"
      >
              {/* Full Name */}

        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">
            Full Name
          </label>

          <div className="flex items-center rounded-xl border border-border-subtle bg-brand-bg px-4 focus-within:border-accent">
            <FiUser
              className="text-text-muted"
              size={20}
            />

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full bg-transparent px-3 py-4 text-text-primary outline-none placeholder:text-text-muted"
            />
          </div>

          {errors.name && (
            <p className="mt-2 text-sm text-red-500">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}

        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">
            Email Address
          </label>

          <div className="flex items-center rounded-xl border border-border-subtle bg-brand-bg px-4 focus-within:border-accent">
            <FiMail
              className="text-text-muted"
              size={20}
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full bg-transparent px-3 py-4 text-text-primary outline-none placeholder:text-text-muted"
            />
          </div>

          {errors.email && (
            <p className="mt-2 text-sm text-red-500">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}

        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">
            Mobile Number
          </label>

          <div className="flex items-center rounded-xl border border-border-subtle bg-brand-bg focus-within:border-accent">
            <div className="flex items-center gap-2 border-r border-border-subtle px-4 text-text-primary">
              🇮🇳 +91
            </div>

            <FiPhone
              className="ml-4 text-text-muted"
              size={20}
            />

            <input
              type="tel"
              maxLength={10}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className="w-full bg-transparent px-3 py-4 text-text-primary outline-none placeholder:text-text-muted"
            />
          </div>

          {errors.phone && (
            <p className="mt-2 text-sm text-red-500">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Password */}

        <PasswordInput
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create Password"
          error={errors.password}
          autoComplete="new-password"
        />

        {passwordStrength.label && (
          <p
            className={`text-sm font-medium ${passwordStrength.color}`}
          >
            {passwordStrength.label}
          </p>
        )}

        {/* Confirm Password */}

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          error={errors.confirmPassword}
          autoComplete="new-password"
        />
                {/* Terms & Conditions */}

        <label className="flex items-start gap-3 text-sm text-text-secondary">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="mt-1 h-4 w-4 accent-accent"
          />

          <span>
            I agree to the{" "}
            <Link
              to="/terms"
              className="font-medium text-accent hover:text-accent-hover"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="font-medium text-accent hover:text-accent-hover"
            >
              Privacy Policy
            </Link>
          </span>
        </label>

        {errors.acceptTerms && (
          <p className="text-sm text-red-500">
            {errors.acceptTerms}
          </p>
        )}

        {/* Submit Button */}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-accent px-6 py-4 text-base font-semibold text-brand-bg transition-all duration-300 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Social Login */}

        <SocialLogin
          onGoogleLogin={() =>
            console.log("Google Signup")
          }
          onAppleLogin={() =>
            console.log("Apple Signup")
          }
        />

        {/* Login Link */}

        <p className="text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-accent hover:text-accent-hover"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Signup;
        