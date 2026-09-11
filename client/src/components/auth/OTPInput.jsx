import { useEffect, useRef } from "react";

function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
}) {
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function handleChange(index, inputValue) {
    if (!/^\d?$/.test(inputValue)) return;

    const newOtp = [...value];
    newOtp[index] = inputValue;

    onChange(newOtp);

    if (
      inputValue &&
      index < length - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (
      e.key === "Backspace" &&
      !value[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      e.key === "ArrowLeft" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      e.key === "ArrowRight" &&
      index < length - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .trim()
      .slice(0, length);

    if (!/^\d+$/.test(pastedData))
      return;

    const newOtp = [...value];

    pastedData
      .split("")
      .forEach((digit, index) => {
        newOtp[index] = digit;
      });

    onChange(newOtp);

    const nextIndex = Math.min(
      pastedData.length,
      length - 1
    );

    inputRefs.current[nextIndex]?.focus();
  }
    return (
    <div
      onPaste={handlePaste}
      className="flex justify-center gap-3"
    >
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(element) => (inputRefs.current[index] = element)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          disabled={disabled}
          onChange={(e) =>
            handleChange(index, e.target.value)
          }
          onKeyDown={(e) =>
            handleKeyDown(index, e)
          }
          className={`
            h-14 w-14
            rounded-xl
            border
            border-border-subtle
            bg-brand-bg
            text-center
            text-2xl
            font-bold
            text-text-primary
            outline-none
            transition-all
            duration-300
            focus:border-accent
            focus:ring-2
            focus:ring-accent/30
            disabled:cursor-not-allowed
            disabled:opacity-50
          `}
        />
      ))}
    </div>
  );
}

export default OTPInput;