import { useState } from "react";
import {
  FiEye,
  FiEyeOff,
  FiLock,
} from "react-icons/fi";

function PasswordInput({
  label = "Password",
  name = "password",
  placeholder = "Enter your password",
  value = "",
  onChange,
  error = "",
  disabled = false,
  autoComplete = "current-password",
}) {
  const [showPassword, setShowPassword] =
    useState(false);

  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  return (
    <div>
      {/* Label */}
      <label
        htmlFor={name}
        className="mb-2 block text-left text-sm font-medium text-text-secondary"
      >
        {label}
      </label>

      {/* Input Container */}
      <div className="flex items-center rounded-xl border border-border-subtle bg-brand-bg px-4 transition-all duration-300 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
        
        {/* Lock Icon */}
        <FiLock
          size={20}
          className="text-text-muted"
        />

        {/* Password Input */}
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
          className="w-full bg-transparent px-3 py-4 text-text-primary outline-none placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-60"
        />

        {/* Show / Hide Password */}
        <button
          type="button"
          onClick={togglePassword}
          disabled={disabled}
          className="text-text-muted transition hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
        >
          {showPassword ? (
            <FiEyeOff size={20} />
          ) : (
            <FiEye size={20} />
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default PasswordInput;