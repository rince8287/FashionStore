function AnnouncementBar() {
  return (
    <div className="border-b border-border-subtle bg-brand-bg">
      <div className="mx-auto flex min-h-9 max-w-[1440px] items-center justify-center px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary sm:text-xs">
          Complimentary shipping on orders above ₹999
        </p>
      </div>
    </div>
  );
}

export default AnnouncementBar;