import React from "react";

function ProfileSection({ title, children, className = "" }) {
  return (
    <section className={`mb-8 ${className}`}>
      {title && (
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)]">
            {title}
          </h2>

          <div className="mt-2 h-[2px] w-20 rounded-full bg-[var(--color-accent)]"></div>
        </div>
      )}

      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}

export default ProfileSection;