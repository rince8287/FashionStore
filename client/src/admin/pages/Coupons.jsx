import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Edit3,
  Loader2,
  Percent,
  Plus,
  RefreshCw,
  Search,
  Tag,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import couponService from "../services/couponService";

// ============================================================
// HELPERS
// ============================================================

const EMPTY_FORM = {
  code: "",
  title: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  maxDiscount: "",
  minOrderAmount: "",
  startDate: "",
  expiryDate: "",
  usageLimit: 1,
  perUserLimit: 1,
  firstOrderOnly: false,
};

const getDateInputValue = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getCouponStatus = (coupon) => {
  if (!coupon?.isActive) return "Inactive";

  const now = new Date();
  const start = coupon.startDate ? new Date(coupon.startDate) : null;
  const expiry = coupon.expiryDate ? new Date(coupon.expiryDate) : null;

  if (expiry && now > expiry) return "Expired";
  if (start && now < start) return "Scheduled";

  return "Active";
};

const getStatusClasses = (status) => {
  switch (status) {
    case "Active":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    case "Inactive":
      return "border-red-500/20 bg-red-500/10 text-red-400";
    case "Expired":
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";
    case "Scheduled":
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";
    default:
      return "border-border-subtle bg-surface text-text-secondary";
  }
};

const extractCoupons = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.coupons)) return response.coupons;
  if (Array.isArray(response?.data?.coupons)) return response.data.coupons;
  if (Array.isArray(response?.data)) return response.data;
  if (response?.coupon) return [response.coupon];
  if (response?.data?.coupon) return [response.data.coupon];
  return [];
};

const extractPagination = (response) => {
  const source = response?.data && !Array.isArray(response.data)
    ? response.data
    : response;

  return {
    total: Number(source?.totalCoupons ?? source?.total ?? 0),
    currentPage: Number(source?.currentPage ?? source?.page ?? 1),
    totalPages: Number(source?.totalPages ?? 1),
  };
};

const getErrorMessage = (error) =>
  couponService.getErrorMessage?.(error) ||
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeCouponForForm = (coupon) => ({
  code: coupon?.code || "",
  title: coupon?.title || "",
  description: coupon?.description || "",
  discountType: coupon?.discountType || "percentage",
  discountValue: coupon?.discountValue ?? "",
  maxDiscount: coupon?.maxDiscount ?? "",
  minOrderAmount: coupon?.minOrderAmount ?? "",
  startDate: getDateInputValue(coupon?.startDate),
  expiryDate: getDateInputValue(coupon?.expiryDate),
  usageLimit: coupon?.usageLimit ?? 1,
  perUserLimit: coupon?.perUserLimit ?? 1,
  firstOrderOnly: Boolean(coupon?.firstOrderOnly),
});

// ============================================================
// FORM INPUT
// ============================================================

function FormInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  min,
  max,
  step,
  required = false,
  disabled = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-semibold text-text-primary"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        required={required}
        disabled={disabled}
        className="w-full rounded-xl border border-border-subtle bg-brand-bg px-4 py-3 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-accent focus:ring-4 focus:ring-accent/5 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

// ============================================================
// FORM SELECT
// ============================================================

function FormSelect({ label, name, value, onChange, options, disabled = false }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-semibold text-text-primary"
      >
        {label}
      </label>

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full appearance-none rounded-xl border border-border-subtle bg-brand-bg px-4 py-3 pr-10 text-sm text-text-primary outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted"
        />
      </div>
    </div>
  );
}

// ============================================================
// COUPON MODAL
// ============================================================

function CouponModal({
  open,
  editingCoupon,
  form,
  setForm,
  onClose,
  onSave,
  saving,
}) {
  if (!open) return null;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : name === "code"
            ? value.toUpperCase().replace(/\s+/g, "")
            : value,
    }));
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-2xl shadow-black/60">
        <div className="pointer-events-none absolute -right-24 -top-24 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-subtle bg-surface/95 px-5 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              {editingCoupon ? <Edit3 size={18} /> : <Plus size={19} />}
            </div>

            <div>
              <h2 className="text-base font-bold text-text-primary sm:text-lg">
                {editingCoupon ? "Edit Coupon" : "Create Coupon"}
              </h2>
              <p className="mt-0.5 text-[11px] text-text-muted">
                {editingCoupon
                  ? "Update coupon details and rules."
                  : "Create a real coupon stored in MongoDB."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary transition hover:bg-brand-bg hover:text-text-primary disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={onSave}
          className="max-h-[calc(92vh-75px)] space-y-5 overflow-y-auto p-5 sm:p-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="Coupon Code"
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="WELCOME10"
              max={30}
              required
              disabled={Boolean(editingCoupon)}
            />

            <FormInput
              label="Coupon Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Welcome discount"
              max={100}
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-xs font-semibold text-text-primary"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe this coupon..."
              rows={3}
              maxLength={500}
              className="w-full resize-none rounded-xl border border-border-subtle bg-brand-bg px-4 py-3 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-accent focus:ring-4 focus:ring-accent/5"
            />
          </div>

          <div className="rounded-2xl border border-border-subtle bg-brand-bg/50 p-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Percent size={15} />
              </div>
              <div>
                <p className="text-xs font-semibold text-text-primary">Discount</p>
                <p className="text-[10px] text-text-muted">
                  Configure the offer value.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormSelect
                label="Discount Type"
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
                options={[
                  { value: "percentage", label: "Percentage" },
                  { value: "fixed", label: "Fixed Amount" },
                ]}
              />

              <FormInput
                label="Discount Value"
                name="discountValue"
                type="number"
                min="1"
                max={form.discountType === "percentage" ? "100" : undefined}
                step="0.01"
                value={form.discountValue}
                onChange={handleChange}
                placeholder={form.discountType === "percentage" ? "10" : "500"}
                required
              />

              <FormInput
                label="Maximum Discount"
                name="maxDiscount"
                type="number"
                min="0"
                step="0.01"
                value={form.maxDiscount}
                onChange={handleChange}
                placeholder="500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-brand-bg/50 p-4">
            <div className="mb-4">
              <p className="text-xs font-semibold text-text-primary">Order Rules</p>
              <p className="mt-0.5 text-[10px] text-text-muted">
                Set minimum order and usage limits.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormInput
                label="Minimum Order Amount"
                name="minOrderAmount"
                type="number"
                min="0"
                step="0.01"
                value={form.minOrderAmount}
                onChange={handleChange}
                placeholder="999"
              />

              <FormInput
                label="Total Usage Limit"
                name="usageLimit"
                type="number"
                min="1"
                step="1"
                value={form.usageLimit}
                onChange={handleChange}
                placeholder="1000"
                required
              />

              <FormInput
                label="Per User Limit"
                name="perUserLimit"
                type="number"
                min="1"
                step="1"
                value={form.perUserLimit}
                onChange={handleChange}
                placeholder="1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="Start Date"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Expiry Date"
              name="expiryDate"
              type="date"
              value={form.expiryDate}
              onChange={handleChange}
              required
            />
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border-subtle bg-brand-bg p-4">
            <div>
              <p className="text-sm font-semibold text-text-primary">
                First Order Only
              </p>
              <p className="mt-1 text-[11px] text-text-muted">
                Allow this coupon only for a customer's first order.
              </p>
            </div>

            <input
              type="checkbox"
              name="firstOrderOnly"
              checked={form.firstOrderOnly}
              onChange={handleChange}
              className="h-5 w-5 accent-[var(--accent)]"
            />
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-border-subtle px-5 py-3 text-sm font-semibold text-text-secondary transition hover:bg-brand-bg hover:text-text-primary disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-black shadow-lg shadow-accent/10 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={16} />
                  {editingCoupon ? "Update Coupon" : "Create Coupon"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconClass = "text-accent",
  valueClass = "text-text-primary",
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/20 hover:shadow-xl">
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-text-secondary">{label}</p>
          <p className={`mt-2 text-2xl font-bold tracking-tight ${valueClass}`}>
            {value}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">{description}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 ${iconClass}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState({ onCreate, hasFilters }) {
  return (
    <div className="mx-auto max-w-sm py-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border-subtle bg-brand-bg text-text-muted">
        <Tag size={25} />
      </div>

      <p className="mt-4 text-sm font-semibold text-text-secondary">
        No coupons found
      </p>

      <p className="mt-1 text-xs leading-5 text-text-muted">
        {hasFilters
          ? "Try changing your search or status filter."
          : "Create your first coupon to get started."}
      </p>

      {!hasFilters && (
        <button
          type="button"
          onClick={onCreate}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-black transition hover:opacity-90"
        >
          <Plus size={14} />
          Create Coupon
        </button>
      )}
    </div>
  );
}

// ============================================================
// MOBILE INFO
// ============================================================

function MobileInfo({ label, value, accent = false }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-brand-bg p-3">
      <p className="text-[10px] font-medium text-text-muted">{label}</p>
      <p
        className={`mt-1 text-sm font-bold ${
          accent ? "text-accent" : "text-text-primary"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCoupons, setTotalCoupons] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [copiedCode, setCopiedCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ==========================================================
  // LOAD COUPONS
  // ==========================================================

  const loadCoupons = useCallback(
    async (showRefresh = false) => {
      try {
        setError("");

        if (showRefresh) setRefreshing(true);
        else setLoading(true);

        const params = {
          page,
          limit,
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        if (statusFilter === "Active") {
          params.isActive = true;
        }

        if (statusFilter === "Inactive") {
          params.isActive = false;
        }

        const response = await couponService.getAllCoupons(params);

        if (response?.success === false) {
          throw new Error(response.message || "Failed to fetch coupons.");
        }

        const nextCoupons = extractCoupons(response);
        const pagination = extractPagination(response);

        setCoupons(nextCoupons);
        setTotalCoupons(pagination.total || nextCoupons.length);
        setTotalPages(Math.max(1, pagination.totalPages || 1));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [limit, page, search, statusFilter]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCoupons();
    }, search.trim() ? 350 : 0);

    return () => clearTimeout(timer);
  }, [loadCoupons]);

  // ==========================================================
  // STATS
  // ==========================================================

  const stats = useMemo(() => {
    const active = coupons.filter(
      (coupon) => getCouponStatus(coupon) === "Active"
    ).length;

    const inactive = coupons.filter(
      (coupon) => getCouponStatus(coupon) === "Inactive"
    ).length;

    const totalUsed = coupons.reduce(
      (sum, coupon) => sum + Number(coupon.usedCount || 0),
      0
    );

    return {
      total: totalCoupons,
      active,
      inactive,
      totalUsed,
    };
  }, [coupons, totalCoupons]);

  // ==========================================================
  // FORM MODALS
  // ==========================================================

  const openCreateModal = () => {
    setEditingCoupon(null);
    setForm({ ...EMPTY_FORM });
    setError("");
    setShowModal(true);
  };

  const openEditModal = async (coupon) => {
    setError("");
    setShowModal(true);
    setEditingCoupon(coupon);
    setForm(normalizeCouponForForm(coupon));

    // Fetch the complete record so edit always uses fresh backend data.
    try {
      const response = await couponService.getCouponById(
        coupon._id || coupon.id
      );

      const freshCoupon =
        response?.coupon ||
        response?.data?.coupon ||
        response?.data ||
        coupon;

      setEditingCoupon(freshCoupon);
      setForm(normalizeCouponForForm(freshCoupon));
    } catch {
      // Existing list data is enough to continue editing.
    }
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingCoupon(null);
    setForm({ ...EMPTY_FORM });
  };

  // ==========================================================
  // SAVE
  // ==========================================================

  const handleSaveCoupon = async (event) => {
    event.preventDefault();

    const code = form.code.trim().toUpperCase();
    const title = form.title.trim();
    const discountValue = Number(form.discountValue);
    const maxDiscount = Number(form.maxDiscount || 0);
    const minOrderAmount = Number(form.minOrderAmount || 0);
    const usageLimit = Number(form.usageLimit);
    const perUserLimit = Number(form.perUserLimit);

    if (!code) {
      setError("Coupon code is required.");
      return;
    }

    if (!title) {
      setError("Coupon title is required.");
      return;
    }

    if (!Number.isFinite(discountValue) || discountValue < 1) {
      setError("Discount value must be at least 1.");
      return;
    }

    if (
      form.discountType === "percentage" &&
      discountValue > 100
    ) {
      setError("Percentage discount cannot be greater than 100%.");
      return;
    }

    if (maxDiscount < 0 || minOrderAmount < 0) {
      setError("Amount values cannot be negative.");
      return;
    }

    if (!Number.isInteger(usageLimit) || usageLimit < 1) {
      setError("Usage limit must be at least 1.");
      return;
    }

    if (!Number.isInteger(perUserLimit) || perUserLimit < 1) {
      setError("Per-user limit must be at least 1.");
      return;
    }

    if (!form.startDate || !form.expiryDate) {
      setError("Start date and expiry date are required.");
      return;
    }

    const start = new Date(`${form.startDate}T00:00:00`);
    const expiry = new Date(`${form.expiryDate}T23:59:59`);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(expiry.getTime())
    ) {
      setError("Please enter valid dates.");
      return;
    }

    if (expiry <= start) {
      setError("Expiry date must be after the start date.");
      return;
    }

    const payload = {
      code,
      title,
      description: form.description.trim(),
      discountType: form.discountType,
      discountValue,
      maxDiscount,
      minOrderAmount,
      startDate: start.toISOString(),
      expiryDate: expiry.toISOString(),
      usageLimit,
      perUserLimit,
      firstOrderOnly: Boolean(form.firstOrderOnly),
    };

    try {
      setSaving(true);
      setError("");

      let response;

      if (editingCoupon) {
        response = await couponService.updateCoupon(
          editingCoupon._id || editingCoupon.id,
          payload
        );
      } else {
        response = await couponService.createCoupon(payload);
      }

      if (response?.success === false) {
        throw new Error(
          response.message ||
            "Unable to save coupon."
        );
      }

      setSuccessMessage(
        editingCoupon
          ? "Coupon updated successfully."
          : "Coupon created successfully."
      );

      closeModal();
      await loadCoupons(true);

      setTimeout(() => {
        setSuccessMessage("");
      }, 2500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (coupon) => {
    const confirmed = window.confirm(
      `Delete coupon "${coupon.code}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    const id = coupon._id || coupon.id;

    try {
      setActionId(id);
      setError("");

      const response = await couponService.deleteCoupon(id);

      if (response?.success === false) {
        throw new Error(
          response.message ||
            "Unable to delete coupon."
        );
      }

      setSuccessMessage("Coupon deleted successfully.");

      if (coupons.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadCoupons(true);
      }

      setTimeout(() => setSuccessMessage(""), 2500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionId("");
    }
  };

  // ==========================================================
  // TOGGLE STATUS
  // ==========================================================

  const toggleStatus = async (coupon) => {
    const id = coupon._id || coupon.id;

    try {
      setActionId(id);
      setError("");

      const response =
        await couponService.toggleCouponStatus(id);

      if (response?.success === false) {
        throw new Error(
          response.message ||
            "Unable to update coupon status."
        );
      }

      setSuccessMessage(
        response.message ||
          "Coupon status updated successfully."
      );

      await loadCoupons(true);

      setTimeout(() => setSuccessMessage(""), 2500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionId("");
    }
  };

  // ==========================================================
  // COPY
  // ==========================================================

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);

      setTimeout(() => {
        setCopiedCode("");
      }, 1600);
    } catch {
      setError("Unable to copy coupon code.");
    }
  };

  // ==========================================================
  // FILTERS
  // ==========================================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPage(1);
  };

  const hasFilters =
    Boolean(search.trim()) ||
    statusFilter !== "All";

  // ==========================================================
  // USAGE
  // ==========================================================

  const getUsagePercentage = (coupon) => {
    const limitValue = Number(coupon?.usageLimit || 0);
    const used = Number(coupon?.usedCount || 0);

    if (limitValue <= 0) return 0;

    return Math.min(
      Math.max((used / limitValue) * 100, 0),
      100
    );
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      <style>{`
        @keyframes couponFadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .coupon-card-animation {
          animation: couponFadeUp .4s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .coupon-card-animation {
            animation: none !important;
          }
        }
      `}</style>

      <main className="min-h-screen overflow-x-hidden bg-brand-bg">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/[0.025] blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {/* HEADER */}
          <header className="mb-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-text-muted">
                  <span>Admin</span>
                  <span>/</span>
                  <span className="text-accent">Coupons</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Tag size={18} />
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                    Coupons
                  </h1>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    {stats.active} Active
                  </span>
                </div>

                <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
                  Create, manage and monitor real store coupons.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => loadCoupons(true)}
                  disabled={refreshing || loading}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-subtle bg-surface text-text-secondary transition hover:border-accent/40 hover:text-accent disabled:opacity-50"
                  title="Refresh"
                >
                  <RefreshCw
                    size={17}
                    className={refreshing ? "animate-spin" : ""}
                  />
                </button>

                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-black shadow-lg shadow-accent/10 transition hover:opacity-90 active:scale-[0.97]"
                >
                  <Plus size={17} />
                  <span>Create Coupon</span>
                </button>
              </div>
            </div>
          </header>

          {/* ALERTS */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-semibold">Something went wrong</p>
                <p className="mt-0.5 text-xs text-red-300/80">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-300 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              <CheckCircle2 size={18} />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* STATS */}
          <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <StatCard
              label="Total Coupons"
              value={stats.total}
              description="All coupons"
              icon={Tag}
            />

            <StatCard
              label="Active"
              value={stats.active}
              description="Current page"
              icon={Zap}
              iconClass="text-emerald-400"
              valueClass="text-emerald-400"
            />

            <StatCard
              label="Inactive"
              value={stats.inactive}
              description="Current page"
              icon={AlertTriangle}
              iconClass="text-red-400"
              valueClass="text-red-400"
            />

            <StatCard
              label="Total Usage"
              value={stats.totalUsed}
              description="Current page"
              icon={CheckCircle2}
            />
          </section>

          {/* FILTERS */}
          <section className="mt-5 rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search coupon code or title..."
                  className="w-full rounded-xl border border-border-subtle bg-brand-bg py-3 pl-10 pr-10 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/5"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="relative lg:w-48">
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none rounded-xl border border-border-subtle bg-brand-bg px-4 py-3 pr-9 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/5"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] text-text-muted">
                Showing{" "}
                <span className="font-semibold text-text-secondary">
                  {coupons.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-text-secondary">
                  {totalCoupons}
                </span>{" "}
                coupons
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[11px] font-semibold text-accent hover:opacity-80"
                >
                  Clear filters
                </button>
              )}
            </div>
          </section>

          {/* LIST */}
          <section className="mt-5 overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-sm">
            {loading ? (
              <div className="flex min-h-[360px] items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-text-muted">
                  <Loader2 size={28} className="animate-spin text-accent" />
                  <span className="text-xs">Loading coupons...</span>
                </div>
              </div>
            ) : (
              <>
                {/* DESKTOP */}
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[1100px]">
                    <thead>
                      <tr className="border-b border-border-subtle bg-brand-bg/50 text-left">
                        {[
                          "Coupon",
                          "Discount",
                          "Minimum Order",
                          "Usage",
                          "Validity",
                          "Status",
                          "Actions",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {coupons.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-5 py-16">
                            <EmptyState
                              onCreate={openCreateModal}
                              hasFilters={hasFilters}
                            />
                          </td>
                        </tr>
                      ) : (
                        coupons.map((coupon) => {
                          const status = getCouponStatus(coupon);
                          const id = coupon._id || coupon.id;
                          const busy = actionId === id;

                          return (
                            <tr
                              key={id}
                              className="border-b border-border-subtle transition-colors last:border-0 hover:bg-brand-bg/30"
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                                    <Tag size={17} />
                                  </div>

                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="font-bold tracking-wide text-text-primary">
                                        {coupon.code}
                                      </p>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleCopy(coupon.code)
                                        }
                                        className="flex h-6 w-6 items-center justify-center rounded-md text-text-muted hover:bg-accent/10 hover:text-accent"
                                        title="Copy coupon"
                                      >
                                        {copiedCode === coupon.code ? (
                                          <Check
                                            size={13}
                                            className="text-emerald-400"
                                          />
                                        ) : (
                                          <Copy size={13} />
                                        )}
                                      </button>
                                    </div>

                                    <p className="mt-0.5 max-w-[270px] truncate text-xs text-text-muted">
                                      {coupon.title || coupon.description || "No title"}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-5 py-4">
                                <span className="font-bold text-accent">
                                  {coupon.discountType === "percentage"
                                    ? `${coupon.discountValue}%`
                                    : `₹${coupon.discountValue}`}
                                </span>

                                {Number(coupon.maxDiscount) > 0 && (
                                  <p className="mt-1 text-[10px] text-text-muted">
                                    Max ₹{coupon.maxDiscount}
                                  </p>
                                )}
                              </td>

                              <td className="px-5 py-4">
                                <span className="text-sm text-text-secondary">
                                  {Number(coupon.minOrderAmount) > 0
                                    ? `₹${coupon.minOrderAmount}`
                                    : "No minimum"}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <p className="text-sm font-semibold text-text-primary">
                                  {coupon.usedCount || 0} /{" "}
                                  {coupon.usageLimit || "∞"}
                                </p>

                                {Number(coupon.usageLimit) > 0 && (
                                  <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-brand-bg">
                                    <div
                                      className="h-full rounded-full bg-accent transition-all"
                                      style={{
                                        width: `${getUsagePercentage(coupon)}%`,
                                      }}
                                    />
                                  </div>
                                )}
                              </td>

                              <td className="px-5 py-4">
                                <p className="text-sm text-text-secondary">
                                  {formatDate(coupon.startDate)}
                                </p>
                                <p className="mt-1 text-[10px] text-text-muted">
                                  to {formatDate(coupon.expiryDate)}
                                </p>
                              </td>

                              <td className="px-5 py-4">
                                <button
                                  type="button"
                                  onClick={() => toggleStatus(coupon)}
                                  disabled={busy || status === "Expired"}
                                  className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 ${getStatusClasses(
                                    status
                                  )}`}
                                >
                                  {busy ? (
                                    <Loader2
                                      size={13}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    status
                                  )}
                                </button>
                              </td>

                              <td className="px-5 py-4">
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(coupon)}
                                    disabled={busy}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle text-text-secondary hover:border-accent/40 hover:text-accent disabled:opacity-50"
                                    title="Edit"
                                  >
                                    <Edit3 size={15} />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDelete(coupon)}
                                    disabled={busy}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/15 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                                    title="Delete"
                                  >
                                    {busy ? (
                                      <Loader2
                                        size={15}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Trash2 size={15} />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE */}
                <div className="divide-y divide-border-subtle lg:hidden">
                  {coupons.length === 0 ? (
                    <div className="px-5 py-12">
                      <EmptyState
                        onCreate={openCreateModal}
                        hasFilters={hasFilters}
                      />
                    </div>
                  ) : (
                    coupons.map((coupon) => {
                      const status = getCouponStatus(coupon);
                      const id = coupon._id || coupon.id;
                      const busy = actionId === id;

                      return (
                        <div key={id} className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                                <Tag size={17} />
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="truncate font-bold text-text-primary">
                                    {coupon.code}
                                  </p>

                                  <button
                                    type="button"
                                    onClick={() => handleCopy(coupon.code)}
                                    className="shrink-0 text-text-muted hover:text-accent"
                                  >
                                    {copiedCode === coupon.code ? (
                                      <Check
                                        size={14}
                                        className="text-emerald-400"
                                      />
                                    ) : (
                                      <Copy size={14} />
                                    )}
                                  </button>
                                </div>

                                <p className="mt-1 line-clamp-2 text-xs text-text-muted">
                                  {coupon.title || coupon.description || "No title"}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getStatusClasses(
                                status
                              )}`}
                            >
                              {status}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-2.5">
                            <MobileInfo
                              label="Discount"
                              value={
                                coupon.discountType === "percentage"
                                  ? `${coupon.discountValue}%`
                                  : `₹${coupon.discountValue}`
                              }
                              accent
                            />

                            <MobileInfo
                              label="Min Order"
                              value={
                                Number(coupon.minOrderAmount) > 0
                                  ? `₹${coupon.minOrderAmount}`
                                  : "None"
                              }
                            />

                            <MobileInfo
                              label="Usage"
                              value={`${coupon.usedCount || 0}/${
                                coupon.usageLimit || "∞"
                              }`}
                            />

                            <MobileInfo
                              label="Expiry"
                              value={formatDate(coupon.expiryDate)}
                            />
                          </div>

                          <div className="mt-4 flex gap-2">
                            <button
                              type="button"
                              onClick={() => toggleStatus(coupon)}
                              disabled={busy || status === "Expired"}
                              className="flex-1 rounded-xl border border-border-subtle px-3 py-2.5 text-xs font-semibold text-text-secondary hover:border-accent/40 hover:text-accent disabled:opacity-50"
                            >
                              {busy
                                ? "Updating..."
                                : status === "Active"
                                  ? "Disable"
                                  : "Activate"}
                            </button>

                            <button
                              type="button"
                              onClick={() => openEditModal(coupon)}
                              disabled={busy}
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle text-text-secondary hover:border-accent/40 hover:text-accent disabled:opacity-50"
                            >
                              <Edit3 size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(coupon)}
                              disabled={busy}
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/15 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </section>

          {/* PAGINATION */}
          {!loading && totalPages > 1 && (
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1 || loading}
                className="rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-xs font-semibold text-text-secondary transition hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-xs font-semibold text-text-primary">
                Page {page} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setPage((current) =>
                    Math.min(totalPages, current + 1)
                  )
                }
                disabled={page >= totalPages || loading}
                className="rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-xs font-semibold text-text-secondary transition hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}

          <div className="mt-4 flex flex-col gap-2 text-[11px] text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <span>
              {coupons.length}{" "}
              {coupons.length === 1 ? "coupon" : "coupons"} displayed
            </span>

            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live database management
            </span>
          </div>
        </div>
      </main>

      <CouponModal
        open={showModal}
        editingCoupon={editingCoupon}
        form={form}
        setForm={setForm}
        onClose={closeModal}
        onSave={handleSaveCoupon}
        saving={saving}
      />
    </>
  );
}

export default Coupons;
