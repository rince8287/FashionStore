export const LANGUAGES = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
  },
  {
    code: "pa",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
  },
  {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
  },
];

export const getLanguages = () => {
  return LANGUAGES;
};

export const getLanguageByCode = (code) => {
  return LANGUAGES.find(
    (language) => language.code === code
  );
};

export const getLanguageName = (code) => {
  const language = getLanguageByCode(code);

  return language ? language.name : "English";
};

export const getNativeLanguageName = (code) => {
  const language = getLanguageByCode(code);

  return language ? language.nativeName : "English";
};

export const isLanguageSupported = (code) => {
  return LANGUAGES.some(
    (language) => language.code === code
  );
};

export const getDefaultLanguage = () => {
  return "en";
};

export const saveLanguage = (code) => {
  localStorage.setItem("fashionstore-language", code);
};

export const getSavedLanguage = () => {
  return (
    localStorage.getItem("fashionstore-language") ||
    getDefaultLanguage()
  );
};

export const changeLanguage = (code) => {
  if (!isLanguageSupported(code)) {
    return false;
  }

  saveLanguage(code);

  document.documentElement.lang = code;

  return true;
};

export const resetLanguage = () => {
  localStorage.removeItem("fashionstore-language");

  document.documentElement.lang = getDefaultLanguage();
};

const languageUtils = {
  LANGUAGES,
  getLanguages,
  getLanguageByCode,
  getLanguageName,
  getNativeLanguageName,
  isLanguageSupported,
  getDefaultLanguage,
  saveLanguage,
  getSavedLanguage,
  changeLanguage,
  resetLanguage,
};

export default languageUtils;