import { useEffect, useState } from "react";

function ResendOTP({
  initialTime = 600,
  onResend,
  loading = false,
}) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  function handleResend() {
    if (loading || timeLeft > 0) return;

    setTimeLeft(initialTime);

    if (onResend) {
      onResend();
    }
  }
    return (
    <div className="flex flex-col items-center gap-4">
      {/* Timer */}
      {timeLeft > 0 ? (
        <p className="text-sm text-text-secondary">
          Resend OTP in{" "}
          <span className="font-semibold text-accent">
            {formatTime(timeLeft)}
          </span>
        </p>
      ) : (
        <p className="text-sm text-green-400">
          OTP has expired. You can request a new one.
        </p>
      )}

      {/* Resend Button */}
      <button
        type="button"
        onClick={handleResend}
        disabled={loading || timeLeft > 0}
        className="rounded-lg border border-accent px-5 py-2 text-sm font-medium text-accent transition-all duration-300 hover:bg-accent hover:text-brand-bg disabled:cursor-not-allowed disabled:border-border-subtle disabled:text-text-muted"
      >
        {loading
          ? "Sending..."
          : timeLeft > 0
          ? "Resend OTP"
          : "Resend OTP Now"}
      </button>
    </div>
  );
}

export default ResendOTP;