// Simple i18n for English and Hindi

export const translations = {
  en: {
    // Home
    searchPlaceholder: "Search AI tools, free limits...",
    trending: "Trending",
    recentlyUpdated: "Recently Updated",
    // Categories
    categories: "Categories",
    // Tool detail
    openWebsite: "Open Website",
    addToFavorites: "Add to Favorites",
    removeFromFavorites: "Remove from Favorites",
    share: "Share",
    writeReview: "Write Review",
    // Pricing
    free: "Free",
    freemium: "Freemium",
    paid: "Paid",
    // Profile
    profile: "Profile",
    darkMode: "Dark Mode",
    language: "Language",
    dataSaver: "Data Saver",
    rateApp: "Rate App",
    privacyPolicy: "Privacy Policy",
    // Submit
    submitTool: "Submit Tool",
    toolName: "Tool Name",
    websiteUrl: "Website URL",
    description: "Description",
    submit: "Submit",
  },
  hi: {
    // Home
    searchPlaceholder: "AI टूल्स खोजें, मुफ्त सीमाएं...",
    trending: "ट्रेंडिंग",
    recentlyUpdated: "हाल ही में अपडेट किया गया",
    // Categories
    categories: "श्रेणियाँ",
    // Tool detail
    openWebsite: "वेबसाइट खोलें",
    addToFavorites: "पसंदीदा में जोड़ें",
    removeFromFavorites: "पसंदीदा से हटाएं",
    share: "शेयर करें",
    writeReview: "समीक्षा लिखें",
    // Pricing
    free: "मुफ्त",
    freemium: "फ्रीमियम",
    paid: "सशुल्क",
    // Profile
    profile: "प्रोफ़ाइल",
    darkMode: "डार्क मोड",
    language: "भाषा",
    dataSaver: "डेटा सेवर",
    rateApp: "ऐप रेट करें",
    privacyPolicy: "गोपनीयता नीति",
    // Submit
    submitTool: "टूल सबमिट करें",
    toolName: "टूल का नाम",
    websiteUrl: "वेबसाइट URL",
    description: "विवरण",
    submit: "सबमिट करें",
  },
};

export type Locale = keyof typeof translations;

export function useTranslations(locale: Locale = "en") {
  return translations[locale];
}
