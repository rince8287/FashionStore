import {
  useEffect,
  useState,
} from "react";

import {
  FiGlobe,
} from "react-icons/fi";

import {
  APP_LANGUAGES,
} from "../../constants/profileConstants";

import profileService from "../../services/profileService";

function LanguageSelector() {
  // ====================================================
  // STATE
  // ====================================================

  const [selectedLanguage, setSelectedLanguage] =
    useState("");

  const [savedLanguage, setSavedLanguage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ====================================================
  // LOAD CURRENT LANGUAGE
  // ====================================================

  useEffect(() => {
    let mounted = true;

    const fetchLanguage = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await profileService.getProfile();

        if (!mounted) return;

        const profileData =
          response?.user ||
          response?.profile ||
          response?.data ||
          response ||
          {};

        const language =
          profileData.language ||
          APP_LANGUAGES?.[0]?.value ||
          "";

        setSelectedLanguage(language);
        setSavedLanguage(language);
      } catch (error) {
        console.error(
          "Language Fetch Error:",
          error
        );

        if (!mounted) return;

        setError(
          error.message ||
            "Failed to load language."
        );

        const defaultLanguage =
          APP_LANGUAGES?.[0]?.value ||
          "";

        setSelectedLanguage(
          defaultLanguage
        );

        setSavedLanguage(
          defaultLanguage
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchLanguage();

    return () => {
      mounted = false;
    };
  }, []);

  // ====================================================
  // LANGUAGE CHANGE
  // ====================================================

  const handleLanguageChange = (
    event
  ) => {
    setSelectedLanguage(
      event.target.value
    );

    setSuccess("");
    setError("");
  };

  // ====================================================
  // SAVE LANGUAGE
  // ====================================================

  const handleSaveLanguage =
    async () => {
      if (!selectedLanguage) {
        setError(
          "Please select a language."
        );

        return;
      }

      try {
        setSaving(true);
        setError("");
        setSuccess("");

        await profileService.updateLanguage(
          selectedLanguage
        );

        setSavedLanguage(
          selectedLanguage
        );

        setSuccess(
          "Language updated successfully."
        );
      } catch (error) {
        console.error(
          "Language Update Error:",
          error
        );

        setError(
          error.message ||
            "Failed to update language."
        );
      } finally {
        setSaving(false);
      }
    };

  // ====================================================
  // CURRENT LANGUAGE LABEL
  // ====================================================

  const currentLanguage =
    APP_LANGUAGES.find(
      (language) =>
        language.value ===
        selectedLanguage
    );

  const currentLanguageLabel =
    currentLanguage?.label ||
    selectedLanguage ||
    "Not Selected";

  // ====================================================
  // CHECK CHANGES
  // ====================================================

  const hasChanges =
    selectedLanguage !==
    savedLanguage;

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 shadow-sm">

        <div className="animate-pulse">

          <div className="flex items-center gap-3">

            <div className="h-12 w-12 rounded-xl bg-[var(--color-surface)]" />

            <div className="flex-1">

              <div className="h-5 w-40 rounded bg-[var(--color-surface)]" />

              <div className="mt-3 h-4 w-64 rounded bg-[var(--color-surface)]" />

            </div>

          </div>

          <div className="mt-8 h-12 rounded-xl bg-[var(--color-surface)]" />

          <div className="mt-6 h-20 rounded-xl bg-[var(--color-surface)]" />

        </div>

      </div>
    );
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 shadow-sm">

      {/* ===============================================
          HEADER
      =============================================== */}

      <div className="mb-6 flex items-center gap-3">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">

          <FiGlobe size={22} />

        </div>

        <div>

          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            Change Language
          </h2>

          <p className="text-sm text-[var(--color-text-secondary)]">
            Select your preferred application language.
          </p>

        </div>

      </div>

      {/* ===============================================
          LANGUAGE DROPDOWN
      =============================================== */}

      <div>

        <label
          htmlFor="preferred-language"
          className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]"
        >
          Preferred Language
        </label>

        <select
          id="preferred-language"
          value={selectedLanguage}
          onChange={handleLanguageChange}
          disabled={saving}
          className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {APP_LANGUAGES.map(
            (language) => (
              <option
                key={
                  language.value
                }
                value={
                  language.value
                }
              >
                {language.label}
              </option>
            )
          )}
        </select>

      </div>

      {/* ===============================================
          CURRENT LANGUAGE
      =============================================== */}

      <div className="mt-6 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">

        <p className="text-sm text-[var(--color-text-secondary)]">
          Current Language
        </p>

        <h3 className="mt-1 text-lg font-semibold text-[var(--color-text-primary)]">
          {currentLanguageLabel}
        </h3>

      </div>

      {/* ===============================================
          ERROR
      =============================================== */}

      {error && (
        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4">

          <p className="text-sm text-red-400">
            {error}
          </p>

        </div>
      )}

      {/* ===============================================
          SUCCESS
      =============================================== */}

      {success && (
        <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 p-4">

          <p className="text-sm text-green-400">
            {success}
          </p>

        </div>
      )}

      {/* ===============================================
          SAVE BUTTON
      =============================================== */}

      <div className="mt-8 flex justify-end">

        <button
          type="button"
          onClick={
            handleSaveLanguage
          }
          disabled={
            saving ||
            !hasChanges
          }
          className="rounded-xl bg-[var(--color-accent)] px-6 py-3 font-semibold text-black transition-all duration-300 hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Language"}
        </button>

      </div>

    </div>
  );
}

export default LanguageSelector;