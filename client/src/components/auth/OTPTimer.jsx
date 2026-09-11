import { useEffect, useState } from "react";

function OTPTimer({
  initialTime = 600,
  onResend,
  disabled = false,
}) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

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
    if (timeLeft > 0 || disabled) return;

    setTimeLeft(initialTime);

    if (onResend) {
      onResend();
    }
  }
    return (
    <div className="flex flex-col items-center gap-4">
      {/* Timer */}
      <div className="text-center">
        <p className="text-sm text-text-secondary">
          OTP expires in
        </p>

        <h3 className="mt-2 text-3xl font-bold text-accent">
          {formatTime(timeLeft)}
        </h3>
      </div>

      {/* Resend Button */}
      <button
        type="button"
        onClick={handleResend}
        disabled={timeLeft > 0 || disabled}
        className="rounded-lg px-4 py-2 text-sm font-medium text-accent transition-all duration-300 hover:text-accent-hover disabled:cursor-not-allowed disabled:text-text-muted"
      >
        {timeLeft > 0 ? "Resend OTP" : "Resend OTP Now"}
      </button>

      {/* Status Message */}
      {timeLeft > 0 ? (
        <p className="text-center text-sm text-text-secondary">
          You can request a new OTP after the timer expires.
        </p>
      ) : (
        <p className="text-center text-sm text-green-400">
          OTP expired. You can request a new one.
        </p>
      )}
    </div>
  );
}

export default OTPTimer;