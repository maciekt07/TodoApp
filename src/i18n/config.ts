import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import zhCN from "./locales/zh-CN.json";
import zhTW from "./locales/zh-TW.json";

// Define supported languages
export const languages = {
  en: { nativeName: "English", translation: en },
  "zh-CN": { nativeName: "简体中文", translation: zhCN },
  "zh-TW": { nativeName: "繁體中文", translation: zhTW },
};

// Get browser language with fallback
const getBrowserLanguage = (): string => {
  const browserLang = navigator.language || navigator.languages?.[0];

  // Check if browser language matches our supported languages
  if (browserLang in languages) {
    return browserLang;
  }

  // Check for language without region (e.g., 'zh' -> 'zh-CN')
  const langCode = browserLang.split("-")[0];
  if (langCode === "zh") {
    // Default to Simplified Chinese for Chinese users
    return "zh-CN";
  }

  // Check if any supported language starts with the browser language code
  const matchingLang = Object.keys(languages).find((lang) => lang.startsWith(langCode));
  if (matchingLang) {
    return matchingLang;
  }

  // Default to English
  return "en";
};

i18n.use(initReactI18next).init({
  resources: Object.entries(languages).reduce(
    (acc, [key, { translation }]) => {
      acc[key] = { translation };
      return acc;
    },
    {} as Record<string, { translation: typeof en }>,
  ),
  lng: getBrowserLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
