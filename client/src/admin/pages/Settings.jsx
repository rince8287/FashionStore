import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  Globe,
  KeyRound,
  Lock,
  Mail,
  Palette,
  RefreshCw,
  Save,
  Settings as SettingsIcon,
  Shield,
  ShieldCheck,
  Sparkles,
  Store,
  User,
  X,
} from "lucide-react";

import settingsService from "../services/settingsService";
import authService from "../../services/authService";

// ======================================================
// DEFAULT SETTINGS
// ======================================================

const DEFAULT_SETTINGS = {
  storeName: "FashionStore",
  storeEmail: "",
  storePhone: "",
  currency: "INR",
  timezone: "Asia/Kolkata",
  language: "en",

  emailNotifications: true,
  orderNotifications: true,
  customerNotifications: true,
  reviewNotifications: true,
  lowStockNotifications: true,

  maintenanceMode: false,
  customerRegistration: true,
  guestCheckout: true,
  showOutOfStockProducts: true,

  twoFactorAuthentication: false,
  loginAlerts: true,
};

// ======================================================
// SECTIONS
// ======================================================

const sections = [
  {
    id: "general",
    label: "General",
    description: "Store information",
    icon: Store,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Manage alerts",
    icon: Bell,
  },
  {
    id: "security",
    label: "Security",
    description: "Account protection",
    icon: Shield,
  },
  {
    id: "preferences",
    label: "Preferences",
    description: "Store preferences",
    icon: Palette,
  },
];

// ======================================================
// HELPER
// ======================================================

const getErrorMessage = (
  error,
  fallback = "Something went wrong."
) => {
  if (!error) return fallback;

  if (typeof error === "string") {
    return error;
  }

  return (
    error?.message ||
    error?.error ||
    error?.response?.data?.message ||
    fallback
  );
};

// ======================================================
// SETTINGS COMPONENT
// ======================================================

const Settings = () => {
  const [activeSection, setActiveSection] =
    useState("general");

  const [settings, setSettings] =
    useState(DEFAULT_SETTINGS);

  const [originalSettings, setOriginalSettings] =
    useState(DEFAULT_SETTINGS);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [passwordSaving, setPasswordSaving] =
    useState(false);

  const [passwordSaved, setPasswordSaved] =
    useState(false);

  const [passwordError, setPasswordError] =
    useState("");

  const [passwordForm, setPasswordForm] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  // ====================================================
  // ADMIN PROFILE
  // ====================================================

  const [adminProfile, setAdminProfile] =
    useState({
      name: "",
      email: "",
    });

  const [originalAdminProfile, setOriginalAdminProfile] =
    useState({
      name: "",
      email: "",
    });

  const [profileSaving, setProfileSaving] =
    useState(false);

  const [profileSaved, setProfileSaved] =
    useState(false);

  const [profileError, setProfileError] =
    useState("");

  // ====================================================
  // LOAD SETTINGS
  // ====================================================

  const loadSettings = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await settingsService.getSettings();

        const serverSettings =
          response?.settings || {};

        const normalizedSettings = {
          ...DEFAULT_SETTINGS,
          ...serverSettings,
        };

        setSettings(
          normalizedSettings
        );

        setOriginalSettings(
          normalizedSettings
        );

        // ==============================================
        // LOAD CURRENT ADMIN PROFILE
        // ==============================================

        try {
          const userResponse =
            await authService.getCurrentUser();

          const currentUser =
            userResponse?.user ||
            userResponse?.data?.user ||
            userResponse?.data ||
            null;

          if (currentUser) {
            const profile = {
              name:
                currentUser.name || "",
              email:
                currentUser.email || "",
            };

            setAdminProfile(profile);
            setOriginalAdminProfile(profile);
          }
        } catch (profileLoadError) {
          console.warn(
            "Admin profile could not be loaded:",
            profileLoadError
          );
        }
      } catch (err) {
        console.error(
          "Load Settings Error:",
          err
        );

        setError(
          getErrorMessage(
            err,
            "Failed to load settings."
          )
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // ====================================================
  // CHANGE DETECTION
  // ====================================================

  const hasSettingsChanges = useMemo(() => {
    return (
      JSON.stringify(settings) !==
      JSON.stringify(originalSettings)
    );
  }, [
    settings,
    originalSettings,
  ]);

  const hasProfileChanges = useMemo(() => {
    return (
      JSON.stringify(adminProfile) !==
      JSON.stringify(
        originalAdminProfile
      )
    );
  }, [
    adminProfile,
    originalAdminProfile,
  ]);

  const hasChanges =
    hasSettingsChanges ||
    hasProfileChanges;

  // ====================================================
  // UPDATE SETTING
  // ====================================================

  const updateSetting = (
    key,
    value
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    setSaved(false);
    setError("");
  };

  // ====================================================
  // SAVE SETTINGS
  // ====================================================

  const handleSave = async () => {
    if (
      saving ||
      !hasSettingsChanges
    ) {
      return;
    }

    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const payload = {
        storeName:
          settings.storeName,
        storeEmail:
          settings.storeEmail,
        storePhone:
          settings.storePhone,
        currency:
          settings.currency,
        timezone:
          settings.timezone,
        language:
          settings.language,

        emailNotifications:
          settings.emailNotifications,
        orderNotifications:
          settings.orderNotifications,
        customerNotifications:
          settings.customerNotifications,
        reviewNotifications:
          settings.reviewNotifications,
        lowStockNotifications:
          settings.lowStockNotifications,

        maintenanceMode:
          settings.maintenanceMode,
        customerRegistration:
          settings.customerRegistration,
        guestCheckout:
          settings.guestCheckout,
        showOutOfStockProducts:
          settings.showOutOfStockProducts,

        twoFactorAuthentication:
          settings.twoFactorAuthentication,
        loginAlerts:
          settings.loginAlerts,
      };

      const response =
        await settingsService.updateSettings(
          payload
        );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to save settings."
        );
      }

      const savedSettings = {
        ...DEFAULT_SETTINGS,
        ...(response.settings || payload),
      };

      setSettings(
        savedSettings
      );

      setOriginalSettings(
        savedSettings
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      console.error(
        "Save Settings Error:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Failed to save settings."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // RESET SETTINGS
  // ====================================================

  const handleReset = () => {
    if (!hasChanges) {
      return;
    }

    const confirmed =
      window.confirm(
        "Discard all unsaved changes?"
      );

    if (!confirmed) {
      return;
    }

    setSettings({
      ...originalSettings,
    });

    setAdminProfile({
      ...originalAdminProfile,
    });

    setSaved(false);
    setError("");
    setProfileError("");
  };

  // ====================================================
  // REFRESH FROM SERVER
  // ====================================================

  const handleRefresh = async () => {
    await loadSettings();
    setSaved(false);
  };

  // ====================================================
  // ADMIN PROFILE CHANGE
  // ====================================================

  const updateAdminProfile = (
    key,
    value
  ) => {
    setAdminProfile((prev) => ({
      ...prev,
      [key]: value,
    }));

    setProfileSaved(false);
    setProfileError("");
  };

  // ====================================================
  // SAVE ADMIN PROFILE
  // ====================================================

  const handleProfileSave =
    async () => {
      if (
        profileSaving ||
        !hasProfileChanges
      ) {
        return;
      }

      if (
        !adminProfile.name.trim()
      ) {
        setProfileError(
          "Admin name is required."
        );
        return;
      }

      if (
        !adminProfile.email.trim()
      ) {
        setProfileError(
          "Admin email is required."
        );
        return;
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          adminProfile.email.trim()
        )
      ) {
        setProfileError(
          "Please enter a valid admin email."
        );
        return;
      }

      try {
        setProfileSaving(true);
        setProfileSaved(false);
        setProfileError("");

        const response =
          await authService.updateProfile({
            name:
              adminProfile.name.trim(),
            email:
              adminProfile.email
                .trim()
                .toLowerCase(),
          });

        if (
          response?.success === false
        ) {
          throw new Error(
            response?.message ||
              "Failed to update admin profile."
          );
        }

        const updatedProfile = {
          name:
            response?.user?.name ||
            response?.data?.user?.name ||
            adminProfile.name.trim(),

          email:
            response?.user?.email ||
            response?.data?.user?.email ||
            adminProfile.email
              .trim()
              .toLowerCase(),
        };

        setAdminProfile(
          updatedProfile
        );

        setOriginalAdminProfile(
          updatedProfile
        );

        setProfileSaved(true);

        setTimeout(() => {
          setProfileSaved(false);
        }, 3000);
      } catch (err) {
        console.error(
          "Admin Profile Update Error:",
          err
        );

        setProfileError(
          getErrorMessage(
            err,
            "Failed to update admin profile."
          )
        );
      } finally {
        setProfileSaving(false);
      }
    };

  // ====================================================
  // PASSWORD INPUT
  // ====================================================

  const handlePasswordChange = (
    key,
    value
  ) => {
    setPasswordForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setPasswordSaved(false);
    setPasswordError("");
  };

  // ====================================================
  // CLOSE PASSWORD MODAL
  // ====================================================

  const closePasswordModal = () => {
    if (passwordSaving) {
      return;
    }

    setShowPasswordModal(false);

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordSaved(false);
    setPasswordError("");
  };

  // ====================================================
  // SUBMIT PASSWORD CHANGE
  // ====================================================

  const submitPasswordChange =
    async () => {
      if (passwordSaving) {
        return;
      }

      const currentPassword =
        passwordForm.currentPassword.trim();

      const newPassword =
        passwordForm.newPassword;

      const confirmPassword =
        passwordForm.confirmPassword;

      // ================================================
      // REQUIRED
      // ================================================

      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {
        setPasswordError(
          "Please fill in all password fields."
        );
        return;
      }

      // ================================================
      // PASSWORD MATCH
      // ================================================

      if (
        newPassword !==
        confirmPassword
      ) {
        setPasswordError(
          "New password and confirm password do not match."
        );
        return;
      }

      // ================================================
      // MINIMUM PASSWORD
      // ================================================

      if (
        newPassword.length < 8
      ) {
        setPasswordError(
          "Password must contain at least 8 characters."
        );
        return;
      }

      // ================================================
      // SAME PASSWORD
      // ================================================

      if (
        currentPassword ===
        newPassword
      ) {
        setPasswordError(
          "New password must be different from your current password."
        );
        return;
      }

      try {
        setPasswordSaving(true);
        setPasswordSaved(false);
        setPasswordError("");

        const response =
          await authService.changePassword(
            {
              currentPassword,
              newPassword,
            }
          );

        if (
          response?.success === false
        ) {
          throw new Error(
            response?.message ||
              "Failed to change password."
          );
        }

        setPasswordSaved(true);

        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          setShowPasswordModal(
            false
          );

          setPasswordSaved(false);
        }, 1800);
      } catch (err) {
        console.error(
          "Change Password Error:",
          err
        );

        setPasswordError(
          getErrorMessage(
            err,
            "Failed to change password."
          )
        );
      } finally {
        setPasswordSaving(false);
      }
    };

  // ====================================================
  // TOGGLE
  // ====================================================

  const Toggle = ({
    checked,
    onChange,
  }) => {
    return (
      <button
        type="button"
        onClick={() =>
          onChange(!checked)
        }
        aria-pressed={checked}
        className={`group relative h-7 w-12 shrink-0 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 ${
          checked
            ? "border-yellow-400/50 bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.18)]"
            : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
        }`}
      >
        <span
          className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-lg transition-all duration-300 ${
            checked
              ? "left-[25px] shadow-yellow-500/20"
              : "left-[3px]"
          }`}
        />

        {checked && (
          <Check
            size={11}
            strokeWidth={3}
            className="absolute left-[30px] top-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-600"
          />
        )}
      </button>
    );
  };

  // ====================================================
  // INPUT
  // ====================================================

  const InputField = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    icon: Icon,
    helper,
    disabled = false,
  }) => {
    return (
      <div className="group">
        <label className="mb-2.5 block text-[13px] font-medium text-zinc-300">
          {label}
        </label>

        <div className="relative">
          {Icon && (
            <Icon
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors duration-200 group-focus-within:text-yellow-500"
            />
          )}

          <input
            type={type}
            value={value}
            disabled={disabled}
            onChange={(e) =>
              onChange(e.target.value)
            }
            placeholder={placeholder}
            className={`w-full rounded-xl border border-zinc-800/90 bg-zinc-950/80 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-zinc-700 hover:border-zinc-700 focus:border-yellow-500/60 focus:bg-zinc-950 focus:ring-4 focus:ring-yellow-500/[0.06] disabled:cursor-not-allowed disabled:opacity-60 ${
              Icon
                ? "pl-11 pr-4"
                : "px-4"
            }`}
          />
        </div>

        {helper && (
          <p className="mt-1.5 text-[11px] text-zinc-600">
            {helper}
          </p>
        )}
      </div>
    );
  };

  // ====================================================
  // SELECT
  // ====================================================

  const SelectField = ({
    label,
    value,
    onChange,
    options,
    icon: Icon,
  }) => {
    return (
      <div className="group">
        <label className="mb-2.5 block text-[13px] font-medium text-zinc-300">
          {label}
        </label>

        <div className="relative">
          {Icon && (
            <Icon
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors duration-200 group-focus-within:text-yellow-500"
            />
          )}

          <select
            value={value}
            onChange={(e) =>
              onChange(e.target.value)
            }
            className={`w-full cursor-pointer appearance-none rounded-xl border border-zinc-800/90 bg-zinc-950/80 py-3 text-sm text-white outline-none transition-all duration-200 hover:border-zinc-700 focus:border-yellow-500/60 focus:ring-4 focus:ring-yellow-500/[0.06] ${
              Icon
                ? "pl-11 pr-10"
                : "pl-4 pr-10"
            }`}
          >
            {options.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
          </select>

          <ChevronDown
            size={17}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 transition-transform duration-200 group-focus-within:rotate-180 group-focus-within:text-yellow-500"
          />
        </div>
      </div>
    );
  };

  // ====================================================
  // TOGGLE ROW
  // ====================================================

  const ToggleRow = ({
    title,
    description,
    checked,
    onChange,
    danger = false,
    icon: Icon,
  }) => {
    return (
      <div
        className={`group flex items-center justify-between gap-5 rounded-xl border-b py-4.5 transition-all duration-200 last:border-b-0 ${
          danger && checked
            ? "border-red-500/10 bg-red-500/[0.025] px-3"
            : "border-zinc-800/70"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          {Icon && (
            <div
              className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:flex ${
                danger && checked
                  ? "bg-red-500/10 text-red-400"
                  : checked
                  ? "bg-yellow-500/10 text-yellow-500"
                  : "bg-zinc-800/70 text-zinc-600"
              }`}
            >
              <Icon size={16} />
            </div>
          )}

          <div className="min-w-0">
            <h4
              className={`text-sm font-medium ${
                danger && checked
                  ? "text-red-400"
                  : "text-zinc-100"
              }`}
            >
              {title}
            </h4>

            <p className="mt-1 text-xs leading-5 text-zinc-600">
              {description}
            </p>
          </div>
        </div>

        <Toggle
          checked={checked}
          onChange={onChange}
        />
      </div>
    );
  };

  // ====================================================
  // SECTION HEADER
  // ====================================================

  const SectionHeader = ({
    icon: Icon,
    title,
    description,
    badge,
  }) => {
    return (
      <div className="mb-7 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/[0.07] text-yellow-500">
            <div className="absolute inset-0 rounded-xl bg-yellow-500/10 blur-lg" />
            <Icon
              size={19}
              className="relative"
            />
          </div>

          <div>
            <h2 className="text-[15px] font-semibold tracking-tight text-white">
              {title}
            </h2>

            <p className="mt-1 text-xs leading-5 text-zinc-600">
              {description}
            </p>
          </div>
        </div>

        {badge && (
          <span className="hidden rounded-full border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-[10px] font-medium text-zinc-500 sm:block">
            {badge}
          </span>
        )}
      </div>
    );
  };

  // ====================================================
  // CARD
  // ====================================================

  const Card = ({
    children,
    className = "",
  }) => {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/45 p-5 shadow-[0_15px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl transition-all duration-300 hover:border-zinc-700/90 sm:p-6 ${className}`}
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-yellow-500/[0.025] blur-3xl" />

        {children}
      </div>
    );
  };

  // ====================================================
  // GENERAL
  // ====================================================

  const renderGeneral = () => (
    <div className="space-y-5 animate-settings-content">
      <Card>
        <SectionHeader
          icon={Store}
          title="Store Information"
          description="Manage your basic store information and contact details."
          badge="STORE"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <InputField
            label="Store Name"
            value={
              settings.storeName
            }
            onChange={(value) =>
              updateSetting(
                "storeName",
                value
              )
            }
            icon={Store}
            placeholder="Your store name"
          />

          <InputField
            label="Store Email"
            value={
              settings.storeEmail
            }
            onChange={(value) =>
              updateSetting(
                "storeEmail",
                value
              )
            }
            type="email"
            icon={Mail}
            placeholder="support@example.com"
          />

          <InputField
            label="Store Phone"
            value={
              settings.storePhone
            }
            onChange={(value) =>
              updateSetting(
                "storePhone",
                value
              )
            }
            icon={Store}
            placeholder="+91 XXXXX XXXXX"
          />

          <SelectField
            label="Currency"
            value={
              settings.currency
            }
            onChange={(value) =>
              updateSetting(
                "currency",
                value
              )
            }
            icon={Globe}
            options={[
              {
                value: "INR",
                label:
                  "Indian Rupee (₹)",
              },
              {
                value: "USD",
                label:
                  "US Dollar ($)",
              },
              {
                value: "EUR",
                label: "Euro (€)",
              },
              {
                value: "GBP",
                label:
                  "British Pound (£)",
              },
              {
                value: "AED",
                label:
                  "UAE Dirham (د.إ)",
              },
              {
                value: "AUD",
                label:
                  "Australian Dollar (A$)",
              },
              {
                value: "CAD",
                label:
                  "Canadian Dollar (C$)",
              },
            ]}
          />
        </div>
      </Card>

      <Card>
        <SectionHeader
          icon={Globe}
          title="Regional Settings"
          description="Configure language and timezone preferences."
          badge="REGION"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <SelectField
            label="Language"
            value={
              settings.language
            }
            onChange={(value) =>
              updateSetting(
                "language",
                value
              )
            }
            options={[
              {
                value: "en",
                label: "English",
              },
              {
                value: "hi",
                label: "Hindi",
              },
            ]}
          />

          <SelectField
            label="Timezone"
            value={
              settings.timezone
            }
            onChange={(value) =>
              updateSetting(
                "timezone",
                value
              )
            }
            options={[
              {
                value:
                  "Asia/Kolkata",
                label:
                  "India Standard Time (IST)",
              },
              {
                value: "UTC",
                label: "UTC",
              },
              {
                value:
                  "America/New_York",
                label:
                  "Eastern Time (ET)",
              },
              {
                value:
                  "Europe/London",
                label:
                  "London Time",
              },
            ]}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
            Currency
          </p>

          <p className="mt-2 text-lg font-semibold text-white">
            {settings.currency}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
            Language
          </p>

          <p className="mt-2 text-lg font-semibold text-white">
            {settings.language ===
            "hi"
              ? "Hindi"
              : "English"}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
            Timezone
          </p>

          <p className="mt-2 truncate text-sm font-semibold text-white">
            {settings.timezone}
          </p>
        </div>
      </div>
    </div>
  );

  // ====================================================
  // NOTIFICATIONS
  // ====================================================

  const renderNotifications =
    () => (
      <div className="space-y-5 animate-settings-content">
        <Card>
          <SectionHeader
            icon={Bell}
            title="Notification Settings"
            description="Choose which events should trigger admin notifications."
            badge="ALERTS"
          />

          <div>
            <ToggleRow
              icon={Mail}
              title="Email Notifications"
              description="Receive important store notifications through email."
              checked={
                settings.emailNotifications
              }
              onChange={(value) =>
                updateSetting(
                  "emailNotifications",
                  value
                )
              }
            />

            <ToggleRow
              icon={Bell}
              title="New Order Notifications"
              description="Get notified whenever a new order is placed."
              checked={
                settings.orderNotifications
              }
              onChange={(value) =>
                updateSetting(
                  "orderNotifications",
                  value
                )
              }
            />

            <ToggleRow
              icon={User}
              title="Customer Notifications"
              description="Receive alerts for important customer activities."
              checked={
                settings.customerNotifications
              }
              onChange={(value) =>
                updateSetting(
                  "customerNotifications",
                  value
                )
              }
            />

            <ToggleRow
              icon={CheckCircle2}
              title="Review Notifications"
              description="Get notified when customers submit product reviews."
              checked={
                settings.reviewNotifications
              }
              onChange={(value) =>
                updateSetting(
                  "reviewNotifications",
                  value
                )
              }
            />

            <ToggleRow
              icon={AlertTriangle}
              title="Low Stock Alerts"
              description="Receive notifications when products have low inventory."
              checked={
                settings.lowStockNotifications
              }
              onChange={(value) =>
                updateSetting(
                  "lowStockNotifications",
                  value
                )
              }
            />
          </div>
        </Card>

        <div className="flex items-center gap-3 rounded-2xl border border-yellow-500/10 bg-yellow-500/[0.035] p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-500">
            <Bell size={17} />
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-300">
              Notification preferences
            </p>

            <p className="mt-0.5 text-[11px] text-zinc-600">
              Changes will apply after saving your settings.
            </p>
          </div>
        </div>
      </div>
    );

  // ====================================================
  // SECURITY
  // ====================================================

  const renderSecurity = () => (
    <div className="space-y-5 animate-settings-content">
      <Card>
        <SectionHeader
          icon={Shield}
          title="Security"
          description="Protect your administrator account and store."
          badge="PROTECTED"
        />

        <div>
          <ToggleRow
            icon={ShieldCheck}
            title="Two-Factor Authentication"
            description="Store preference for two-factor authentication."
            checked={
              settings.twoFactorAuthentication
            }
            onChange={(value) =>
              updateSetting(
                "twoFactorAuthentication",
                value
              )
            }
          />

          <ToggleRow
            icon={Bell}
            title="Login Alerts"
            description="Enable login alert preference for the administrator account."
            checked={
              settings.loginAlerts
            }
            onChange={(value) =>
              updateSetting(
                "loginAlerts",
                value
              )
            }
          />
        </div>
      </Card>

      <Card>
        <SectionHeader
          icon={User}
          title="Admin Account"
          description="Manage your administrator account information."
          badge="ADMIN"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <InputField
            label="Admin Name"
            value={
              adminProfile.name
            }
            onChange={(value) =>
              updateAdminProfile(
                "name",
                value
              )
            }
            icon={User}
            placeholder="Admin name"
          />

          <InputField
            label="Admin Email"
            value={
              adminProfile.email
            }
            onChange={(value) =>
              updateAdminProfile(
                "email",
                value
              )
            }
            type="email"
            icon={Mail}
            placeholder="admin@example.com"
          />
        </div>

        {profileError && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.05] px-3 py-2.5 text-xs text-red-400">
            <AlertTriangle
              size={15}
            />
            {profileError}
          </div>
        )}

        {profileSaved && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] px-3 py-2.5 text-xs text-emerald-400">
            <CheckCircle2
              size={15}
            />
            Admin profile updated successfully.
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={
              handleProfileSave
            }
            disabled={
              profileSaving ||
              !hasProfileChanges
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-xs font-semibold text-zinc-200 transition-all duration-200 hover:border-yellow-500/30 hover:bg-zinc-800 hover:text-yellow-400 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {profileSaving ? (
              <>
                <RefreshCw
                  size={14}
                  className="animate-spin"
                />
                Updating...
              </>
            ) : profileSaved ? (
              <>
                <Check size={14} />
                Updated
              </>
            ) : (
              <>
                <User size={14} />
                Save Profile
              </>
            )}
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400">
              <KeyRound size={17} />
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-200">
                Password & authentication
              </p>

              <p className="mt-0.5 text-[11px] text-zinc-600">
                Keep your administrator account secure.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setPasswordSaved(
                false
              );
              setPasswordError("");
              setShowPasswordModal(
                true
              );
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-xs font-semibold text-zinc-200 transition-all duration-200 hover:border-yellow-500/30 hover:bg-zinc-800 hover:text-yellow-400 active:scale-[0.97]"
          >
            <Lock size={15} />
            Change Password
          </button>
        </div>
      </Card>

      <div
        className={`rounded-2xl border p-4 transition-all duration-300 ${
          settings.twoFactorAuthentication
            ? "border-emerald-500/20 bg-emerald-500/[0.04]"
            : "border-zinc-800 bg-zinc-900/30"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              settings.twoFactorAuthentication
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-zinc-800 text-zinc-500"
            }`}
          >
            {settings.twoFactorAuthentication ? (
              <ShieldCheck size={18} />
            ) : (
              <Shield size={18} />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-200">
              Security status
            </p>

            <p className="mt-0.5 text-xs text-zinc-600">
              {settings.twoFactorAuthentication
                ? "Two-factor authentication preference is enabled."
                : "Enable two-factor authentication preference for stronger protection."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // ====================================================
  // PREFERENCES
  // ====================================================

  const renderPreferences =
    () => (
      <div className="space-y-5 animate-settings-content">
        <Card>
          <SectionHeader
            icon={SettingsIcon}
            title="Store Preferences"
            description="Control how your store behaves."
            badge="BEHAVIOR"
          />

          <div>
            <ToggleRow
              icon={User}
              title="Allow Customer Registration"
              description="Allow new customers to create accounts."
              checked={
                settings.customerRegistration
              }
              onChange={(value) =>
                updateSetting(
                  "customerRegistration",
                  value
                )
              }
            />

            <ToggleRow
              icon={Store}
              title="Guest Checkout"
              description="Allow customers to place orders without creating an account."
              checked={
                settings.guestCheckout
              }
              onChange={(value) =>
                updateSetting(
                  "guestCheckout",
                  value
                )
              }
            />

            <ToggleRow
              icon={Globe}
              title="Show Out-of-Stock Products"
              description="Keep unavailable products visible in the storefront."
              checked={
                settings.showOutOfStockProducts
              }
              onChange={(value) =>
                updateSetting(
                  "showOutOfStockProducts",
                  value
                )
              }
            />

            <ToggleRow
              icon={AlertTriangle}
              title="Maintenance Mode"
              description="Temporarily disable customer access while performing maintenance."
              checked={
                settings.maintenanceMode
              }
              onChange={(value) =>
                updateSetting(
                  "maintenanceMode",
                  value
                )
              }
              danger={
                settings.maintenanceMode
              }
            />
          </div>
        </Card>

        <div
          className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-500 ${
            settings.maintenanceMode
              ? "border-red-500/30 bg-red-500/[0.045]"
              : "border-yellow-500/20 bg-yellow-500/[0.035]"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                settings.maintenanceMode
                  ? "bg-red-500/10 text-red-400"
                  : "bg-yellow-500/10 text-yellow-500"
              }`}
            >
              {settings.maintenanceMode ? (
                <AlertTriangle size={18} />
              ) : (
                <SettingsIcon size={18} />
              )}
            </div>

            <div>
              <h3
                className={`text-sm font-semibold ${
                  settings.maintenanceMode
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {settings.maintenanceMode
                  ? "Maintenance Mode is Active"
                  : "Configuration Notice"}
              </h3>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                {settings.maintenanceMode
                  ? "The maintenance preference is enabled. Save your settings to persist this configuration."
                  : "Store preferences are connected to the backend settings API and are persisted after saving."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );

  // ====================================================
  // RENDER CONTENT
  // ====================================================

  const renderContent = () => {
    switch (
      activeSection
    ) {
      case "notifications":
        return renderNotifications();

      case "security":
        return renderSecurity();

      case "preferences":
        return renderPreferences();

      case "general":
      default:
        return renderGeneral();
    }
  };

  // ====================================================
  // LOADING SCREEN
  // ====================================================

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes settingsLoading {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-settings-loading {
            animation: settingsLoading .35s ease-out both;
          }
        `}</style>

        <div className="flex min-h-full items-center justify-center bg-zinc-950 p-6 text-white">
          <div className="animate-settings-loading flex flex-col items-center">
            <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.07] text-yellow-500">
              <div className="absolute inset-0 rounded-2xl bg-yellow-500/10 blur-xl" />

              <RefreshCw
                size={22}
                className="relative animate-spin"
              />
            </div>

            <p className="text-sm font-semibold text-zinc-200">
              Loading Settings
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Fetching your store configuration...
            </p>
          </div>
        </div>
      </>
    );
  }

  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <>
      <style>{`
        @keyframes settingsFadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes settingsFadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes settingsGlow {
          0%, 100% {
            opacity: .35;
            transform: scale(1);
          }

          50% {
            opacity: .65;
            transform: scale(1.05);
          }
        }

        @keyframes settingsModal {
          from {
            opacity: 0;
            transform: translateY(12px) scale(.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-settings-content {
          animation: settingsFadeUp .32s ease-out both;
        }

        .animate-settings-page {
          animation: settingsFadeIn .4s ease-out both;
        }

        .animate-settings-modal {
          animation: settingsModal .22s ease-out both;
        }

        .settings-glow {
          animation: settingsGlow 4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-settings-content,
          .animate-settings-page,
          .animate-settings-modal,
          .settings-glow {
            animation: none !important;
          }
        }
      `}</style>

      <div className="animate-settings-page min-h-full overflow-x-hidden bg-zinc-950 p-4 text-white sm:p-6 lg:p-7">
        {/* ==================================================
            AMBIENT BACKGROUND
        ================================================== */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="settings-glow absolute -right-40 -top-40 h-96 w-96 rounded-full bg-yellow-500/[0.025] blur-3xl" />

          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-yellow-500/[0.018] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1450px]">
          {/* ==================================================
              HEADER
          ================================================== */}

          <header className="mb-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/[0.07] text-yellow-500">
                    <SettingsIcon
                      size={18}
                    />
                  </div>

                  <div className="h-1 w-1 rounded-full bg-yellow-500/60" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    Admin Console
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Settings
                  </h1>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/[0.05] px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    System Online
                  </span>
                </div>

                <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
                  Manage your store, notifications, security and administrator preferences from one place.
                </p>
              </div>

              {/* ==================================================
                  DESKTOP ACTIONS
              ================================================== */}

              <div className="hidden items-center gap-2.5 lg:flex">
                <button
                  type="button"
                  onClick={
                    handleRefresh
                  }
                  disabled={loading}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-2.5 text-sm font-medium text-zinc-400 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white active:scale-[0.97] disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className="transition-transform duration-500 group-hover:rotate-180"
                  />
                  Refresh
                </button>

                <button
                  type="button"
                  onClick={
                    handleReset
                  }
                  disabled={
                    !hasChanges
                  }
                  className="group inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-2.5 text-sm font-medium text-zinc-400 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RefreshCw
                    size={15}
                    className="transition-transform duration-500 group-hover:rotate-180"
                  />
                  Reset
                </button>

                <button
                  type="button"
                  onClick={
                    handleSave
                  }
                  disabled={
                    saving ||
                    !hasSettingsChanges
                  }
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-black shadow-[0_8px_30px_rgba(234,179,8,0.12)] transition-all duration-200 hover:bg-yellow-400 hover:shadow-[0_10px_35px_rgba(234,179,8,0.18)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />

                  <span className="relative flex items-center gap-2">
                    {saving ? (
                      <>
                        <RefreshCw
                          size={16}
                          className="animate-spin"
                        />
                        Saving...
                      </>
                    ) : saved ? (
                      <>
                        <Check
                          size={16}
                        />
                        Saved
                      </>
                    ) : (
                      <>
                        <Save
                          size={16}
                        />
                        Save Changes
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </header>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                <AlertTriangle
                  size={17}
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-red-400">
                  Settings Error
                </p>

                <p className="mt-1 text-xs leading-5 text-red-400/70">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setError("")
                }
                className="ml-auto text-zinc-600 transition hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* ==================================================
              MOBILE NAV
          ================================================== */}

          <div className="mb-5 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/45 p-1.5 backdrop-blur-xl lg:hidden">
            <nav className="flex min-w-max gap-1">
              {sections.map(
                (section) => {
                  const Icon =
                    section.icon;

                  const active =
                    activeSection ===
                    section.id;

                  return (
                    <button
                      key={
                        section.id
                      }
                      type="button"
                      onClick={() =>
                        setActiveSection(
                          section.id
                        )
                      }
                      className={`relative flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-300 ${
                        active
                          ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/10"
                          : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                      }`}
                    >
                      <Icon
                        size={14}
                      />

                      {section.label}
                    </button>
                  );
                }
              )}
            </nav>
          </div>

          {/* ==================================================
              MAIN LAYOUT
          ================================================== */}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[245px_minmax(0,1fr)]">
            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <aside className="hidden h-fit rounded-2xl border border-zinc-800/90 bg-zinc-900/35 p-2 backdrop-blur-xl lg:sticky lg:top-5 lg:block">
              <div className="mb-2 flex items-center justify-between px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                  Configuration
                </p>

                <Sparkles
                  size={13}
                  className="text-yellow-500/50"
                />
              </div>

              <nav className="space-y-1">
                {sections.map(
                  (section) => {
                    const Icon =
                      section.icon;

                    const active =
                      activeSection ===
                      section.id;

                    return (
                      <button
                        key={
                          section.id
                        }
                        type="button"
                        onClick={() =>
                          setActiveSection(
                            section.id
                          )
                        }
                        className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-left transition-all duration-300 ${
                          active
                            ? "text-yellow-400"
                            : "text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-200"
                        }`}
                      >
                        {active && (
                          <span className="absolute inset-0 bg-yellow-500/[0.07]" />
                        )}

                        {active && (
                          <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.7)]" />
                        )}

                        <div
                          className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                            active
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-zinc-800/80 text-zinc-600 group-hover:bg-zinc-700/80 group-hover:text-zinc-300"
                          }`}
                        >
                          <Icon
                            size={16}
                            className="transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>

                        <div className="relative min-w-0 flex-1">
                          <p className="text-sm font-medium">
                            {
                              section.label
                            }
                          </p>

                          <p
                            className={`mt-0.5 truncate text-[11px] ${
                              active
                                ? "text-yellow-500/55"
                                : "text-zinc-700"
                            }`}
                          >
                            {
                              section.description
                            }
                          </p>
                        </div>

                        {active && (
                          <ChevronDown
                            size={14}
                            className="relative -rotate-90 text-yellow-500/50"
                          />
                        )}
                      </button>
                    );
                  }
                )}
              </nav>

              <div className="mt-3 border-t border-zinc-800/70 pt-3">
                <div className="rounded-xl bg-zinc-950/50 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${
                        hasChanges
                          ? "bg-yellow-500"
                          : "bg-emerald-400"
                      }`}
                    />

                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                      Status
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500">
                    {hasChanges
                      ? "You have unsaved changes."
                      : "Everything is up to date."}
                  </p>
                </div>
              </div>
            </aside>

            {/* ==================================================
                CONTENT
            ================================================== */}

            <main className="min-w-0">
              {renderContent()}
            </main>
          </div>

          {/* ==================================================
              MOBILE SAVE BAR
          ================================================== */}

          <div className="sticky bottom-3 z-20 mt-5 flex items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl lg:hidden">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    hasChanges
                      ? "bg-yellow-500"
                      : "bg-emerald-400"
                  }`}
                />

                <p className="text-xs font-semibold text-zinc-300">
                  {hasChanges
                    ? "Unsaved changes"
                    : "All changes saved"}
                </p>
              </div>

              <p className="mt-0.5 truncate text-[10px] text-zinc-600">
                {hasChanges
                  ? "Save your latest configuration."
                  : "Your settings are up to date."}
              </p>
            </div>

            <button
              type="button"
              onClick={
                handleSave
              }
              disabled={
                saving ||
                !hasSettingsChanges
              }
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-yellow-500 px-4 py-2.5 text-xs font-semibold text-black transition-all duration-200 hover:bg-yellow-400 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw
                  size={14}
                  className="animate-spin"
                />
              ) : saved ? (
                <Check size={14} />
              ) : (
                <Save size={14} />
              )}

              {saving
                ? "Saving"
                : saved
                ? "Saved"
                : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          CHANGE PASSWORD MODAL
      ================================================== */}

      {showPasswordModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              closePasswordModal();
            }
          }}
        >
          <div className="animate-settings-modal relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl shadow-black/60 sm:p-6">
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-yellow-500/[0.05] blur-3xl" />

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/10 text-yellow-500">
                  <KeyRound
                    size={19}
                  />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-white">
                    Change Password
                  </h2>

                  <p className="mt-1 text-xs text-zinc-600">
                    Update your administrator password securely.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  closePasswordModal
                }
                disabled={
                  passwordSaving
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-zinc-800 hover:text-white disabled:opacity-40"
              >
                <X size={17} />
              </button>
            </div>

            <div className="relative mt-6 space-y-4">
              <InputField
                label="Current Password"
                type="password"
                value={
                  passwordForm.currentPassword
                }
                onChange={(value) =>
                  handlePasswordChange(
                    "currentPassword",
                    value
                  )
                }
                icon={Lock}
                placeholder="Enter current password"
              />

              <InputField
                label="New Password"
                type="password"
                value={
                  passwordForm.newPassword
                }
                onChange={(value) =>
                  handlePasswordChange(
                    "newPassword",
                    value
                  )
                }
                icon={KeyRound}
                placeholder="Minimum 8 characters"
              />

              <InputField
                label="Confirm New Password"
                type="password"
                value={
                  passwordForm.confirmPassword
                }
                onChange={(value) =>
                  handlePasswordChange(
                    "confirmPassword",
                    value
                  )
                }
                icon={CheckCircle2}
                placeholder="Repeat new password"
              />
            </div>

            {passwordError && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.05] px-3 py-2.5 text-xs leading-5 text-red-400">
                <AlertTriangle
                  size={15}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  {passwordError}
                </span>
              </div>
            )}

            {passwordSaved && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] px-3 py-2.5 text-xs text-emerald-400">
                <CheckCircle2
                  size={15}
                />
                Password updated successfully.
              </div>
            )}

            <div className="relative mt-6 flex gap-2">
              <button
                type="button"
                onClick={
                  closePasswordModal
                }
                disabled={
                  passwordSaving
                }
                className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-zinc-700 hover:text-white active:scale-[0.98] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  submitPasswordChange
                }
                disabled={
                  passwordSaving
                }
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-400 active:scale-[0.98] disabled:opacity-60"
              >
                {passwordSaving ? (
                  <>
                    <RefreshCw
                      size={15}
                      className="animate-spin"
                    />
                    Updating...
                  </>
                ) : passwordSaved ? (
                  <>
                    <Check size={15} />
                    Updated
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ======================================================
// EXPORT
// ======================================================

export default Settings;