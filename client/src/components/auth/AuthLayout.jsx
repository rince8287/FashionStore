import AuthBanner from "./AuthBanner";

function AuthLayout({
  title,
  description,
  children,
}) {
  return (
    <main className="min-h-screen bg-brand-bg px-4 py-10">
      <div className="mx-auto grid min-h-[700px] w-full max-w-6xl overflow-hidden rounded-3xl border border-border-subtle bg-surface shadow-2xl lg:grid-cols-2">

        {/* Left Side */}

        <AuthBanner
          title={title}
          description={description}
        />

        {/* Right Side */}

        <div className="flex items-center justify-center p-8 sm:p-10 lg:p-14">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

      </div>
    </main>
  );
}

export default AuthLayout;