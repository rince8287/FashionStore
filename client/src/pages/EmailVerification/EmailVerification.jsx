import { Link } from "react-router-dom";
import { FiMail, FiCheckCircle } from "react-icons/fi";

import AuthLayout from "../../components/auth/AuthLayout";

function EmailVerification() {
  return (
    <AuthLayout
      title="Verify Your Email"
      description="We've sent a verification link to your email address."
    >
      <div className="mt-6 text-center">

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-accent-soft">
          <FiMail
            size={45}
            className="text-accent"
          />
        </div>

        <h2 className="mt-8 text-3xl font-bold text-text-primary">
          Check Your Inbox
        </h2>

        <p className="mt-4 leading-7 text-text-secondary">
          A verification email has been sent to your registered email
          address.
          <br />
          Click the verification link to activate your account.
        </p>

        <div className="mt-8 rounded-2xl border border-border-subtle bg-surface p-5">

          <div className="flex items-center justify-center gap-3">

            <FiCheckCircle
              size={24}
              className="text-green-500"
            />

            <span className="text-text-primary font-medium">
              Verification email sent successfully.
            </span>

          </div>

        </div>

        <button
          className="mt-8 w-full rounded-xl bg-accent px-6 py-4 font-semibold text-brand-bg transition hover:bg-accent-hover"
        >
          Resend Verification Email
        </button>

        <Link
          to="/login"
          className="mt-5 inline-block text-accent transition hover:text-accent-hover"
        >
          Back to Login
        </Link>

      </div>
    </AuthLayout>
  );
}

export default EmailVerification;