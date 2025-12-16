import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import zhCN from "./locales/zh-CN.json";
import es from "./locales/es.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";

// Define supported languages
export const languages = {
  en: { nativeName: "English", translation: en },
  "zh-CN": { nativeName: "简体中文", translation: zhCN },
  es: { nativeName: "Español", translation: es },
  de: { nativeName: "Deutsch", translation: de },
  fr: { nativeName: "Français", translation: fr },
  ja: { nativeName: "日本語", translation: ja },
  ko: { nativeName: "한국어", translation: ko },
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
  resources: Object.fromEntries(
    Object.entries(languages).map(([key, { translation }]) => [key, { translation }]),
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
