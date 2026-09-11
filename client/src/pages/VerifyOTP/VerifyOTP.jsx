import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiShield } from "react-icons/fi";

import AuthLayout from "../../components/auth/AuthLayout";

function VerifyOTP() {
  const OTP_LENGTH = 6;
  const OTP_TIME = 600; // 10 Minutes

  const [otp, setOtp] = useState(
    Array(OTP_LENGTH).fill("")
  );

  const [timeLeft, setTimeLeft] = useState(OTP_TIME);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  // Countdown Timer

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // MM : SS

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  }

  // OTP Change

  function handleChange(index, value) {
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otp];

    updated[index] = value;

    setOtp(updated);

    setError("");

    if (
      value &&
      index < OTP_LENGTH - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  // Backspace

  function handleKeyDown(index, e) {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  // Paste OTP

  function handlePaste(e) {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .trim()
      .slice(0, OTP_LENGTH);

    if (!/^\d+$/.test(pasted)) return;

    const values = pasted.split("");

    while (values.length < OTP_LENGTH) {
      values.push("");
    }

    setOtp(values);

    inputRefs.current[
      Math.min(
        pasted.length - 1,
        OTP_LENGTH - 1
      )
    ]?.focus();
  }

  // Verify

  async function handleSubmit(e) {
    e.preventDefault();

    const enteredOTP = otp.join("");

    if (enteredOTP.length !== OTP_LENGTH) {
      setError("Please enter the complete OTP.");
      return;
    }

    try {
      setLoading(true);

      /*
      Backend Flow

      POST
      /api/auth/verify-otp

      {
         otp:"123456"
      }

      */

      console.log("OTP Verified");

    } catch (err) {

      console.log(err);

      setError("Invalid OTP.");

    } finally {

      setLoading(false);

    }
  }

  // Resend OTP

  function handleResendOTP() {

    if (timeLeft > 0) return;

    setOtp(Array(OTP_LENGTH).fill(""));

    setTimeLeft(OTP_TIME);

    inputRefs.current[0]?.focus();

    console.log("OTP Resent");
  }
    return (
    <AuthLayout
      title="OTP Verification"
      description="Enter the 6-digit verification code sent to your email or mobile number."
    >
      <div className="mt-6 text-center">

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-accent-soft">
          <FiShield
            size={45}
            className="text-accent"
          />
        </div>

        <h2 className="mt-8 text-3xl font-bold text-text-primary">
          Verify OTP
        </h2>

        <p className="mt-3 text-text-secondary">
          Enter the 6-digit OTP to continue.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10"
        >

          {/* OTP Boxes */}

          <div
            onPaste={handlePaste}
            className="flex justify-center gap-3"
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) =>
                  (inputRefs.current[index] = element)
                }
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleChange(index, e.target.value)
                }
                onKeyDown={(e) =>
                  handleKeyDown(index, e)
                }
                className="h-14 w-14 rounded-xl border border-border-subtle bg-brand-bg text-center text-2xl font-bold text-text-primary outline-none transition-all duration-300 focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
            ))}
          </div>

          {/* Error */}

          {error && (
            <p className="mt-4 text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Timer */}

          <div className="mt-8">

            <p className="text-sm text-text-secondary">
              OTP expires in
            </p>

            <h3 className="mt-2 text-3xl font-bold text-accent">
              {formatTime(timeLeft)}
            </h3>

          </div>

          {/* Verify Button */}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-accent px-6 py-4 text-lg font-semibold text-brand-bg transition-all duration-300 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>

          {/* Resend */}

          <button
            type="button"
            disabled={timeLeft > 0}
            onClick={handleResendOTP}
            className="mt-5 text-accent transition hover:text-accent-hover disabled:text-text-muted"
          >
            Resend OTP
          </button>

          {/* Change Email */}

          <div className="mt-8">

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-text-secondary transition hover:text-accent"
            >
              <FiArrowLeft />

              Change Email / Mobile
            </Link>

          </div>

        </form>

      </div>
    </AuthLayout>
  );
  
  // Auto Focus First Input

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Optional:
  // Future Backend Integration
  //
  // 1. Verify Success
  // navigate("/");
  //
  // 2. Wrong OTP
  // setError("Invalid OTP");
  //
  // 3. OTP Expired
  // setError("OTP has expired");
  //
  // 4. Too Many Attempts
  // Disable Verify Button
  //
  // 5. Resend OTP API
  // POST /api/auth/resend-otp
  //
  // 6. Verify API
  // POST /api/auth/verify-otp

}

export default VerifyOTP;
