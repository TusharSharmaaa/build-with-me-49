import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Locale = "en" | "hi";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const STORAGE_KEY = "ai_tools_locale";

// Basic translations (expandable)
const translations: Record<Locale, Record<string, string>> = {
  en: {
    "home.title": "Discover Free AI Tools",
    "home.subtitle": "Comprehensive directory with usage limits and expert insights",
    "search.placeholder": "Search AI tools...",
    "categories.browse": "Browse All Categories",
    "tool.free": "Free Tier Available",
    "tool.visit": "Visit Website",
    "tool.share": "Share",
    "tool.favorite": "Favorite",
    "featured.title": "Featured Tool",
    "trending.title": "Trending Tools",
    "recent.title": "Recently Updated",
    "submit.title": "Submit a Tool",
  },
  hi: {
    "home.title": "मुफ्त AI टूल्स खोजें",
    "home.subtitle": "उपयोग सीमा और विशेषज्ञ जानकारी के साथ व्यापक निर्देशिका",
    "search.placeholder": "AI टूल्स खोजें...",
    "categories.browse": "सभी श्रेणियां देखें",
    "tool.free": "मुफ्त टियर उपलब्ध",
    "tool.visit": "वेबसाइट देखें",
    "tool.share": "शेयर करें",
    "tool.favorite": "पसंदीदा",
    "featured.title": "फीचर्ड टूल",
    "trending.title": "ट्रेंडिंग टूल्स",
    "recent.title": "हाल ही में अपडेट किया गया",
    "submit.title": "टूल सबमिट करें",
  },
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored === "hi" ? "hi" : "en") as Locale;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const t = (key: string): string => {
    return translations[locale][key] || key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
