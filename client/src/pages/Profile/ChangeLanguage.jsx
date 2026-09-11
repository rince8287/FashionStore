import { useState } from "react";
import { FiGlobe, FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
  LANGUAGES,
  changeLanguage,
  getSavedLanguage,
} from "../../utils/languageUtils";

function ChangeLanguage() {
  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] = useState(
    getSavedLanguage()
  );

  const handleSave = () => {
    changeLanguage(selectedLanguage);

    alert("Language updated successfully.");

    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] px-4 py-8">

      <div className="mx-auto max-w-3xl">

        {/* Header */}

        <div className="mb-8 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <FiGlobe size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                Change Language
              </h1>

              <p className="mt-1 text-[var(--color-text-secondary)]">
                Select your preferred application language.
              </p>
            </div>

          </div>

        </div>

        {/* Language List */}

        <div className="space-y-4">

          {LANGUAGES.map((language) => (

            <button
              key={language.code}
              type="button"
              onClick={() => setSelectedLanguage(language.code)}
              className={`flex w-full items-center justify-between rounded-2xl border p-5 text-left transition-all duration-300 ${
                selectedLanguage === language.code
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                  : "border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-accent)]"
              }`}
            >

              <div>

                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  {language.name}
                </h2>

                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  {language.nativeName}
                </p>

              </div>

              {selectedLanguage === language.code && (
                <FiCheck
                  size={24}
                  className="text-[var(--color-accent)]"
                />
              )}

            </button>

          ))}

        </div>

        {/* Save Button */}

        <button
          type="button"
          onClick={handleSave}
          className="mt-8 w-full rounded-xl bg-[var(--color-accent)] py-4 text-lg font-semibold text-black transition-all duration-300 hover:bg-[var(--color-accent-hover)]"
        >
          Save Language
        </button>

      </div>

    </div>
  );
}

export default ChangeLanguage;