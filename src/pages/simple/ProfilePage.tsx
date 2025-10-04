import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/system/AppLayout";
import { supabase } from "@/lib/supabase-service";
import { setTestMode, getTestMode } from "@/lib/simple-ads";

export function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [locale, setLocale] = useState<"en" | "hi">("en");
  const [darkMode, setDarkMode] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);
  const [testAds, setTestAds] = useState(getTestMode());

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    
    const savedLocale = localStorage.getItem("locale") as "en" | "hi";
    if (savedLocale) setLocale(savedLocale);
    
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
    
    const savedDataSaver = localStorage.getItem("dataSaver") === "true";
    setDataSaver(savedDataSaver);
  }, []);

  const handleLocaleChange = (newLocale: "en" | "hi") => {
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const handleDarkModeToggle = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem("darkMode", newValue.toString());
    document.documentElement.classList.toggle("dark", newValue);
  };

  const handleDataSaverToggle = () => {
    const newValue = !dataSaver;
    setDataSaver(newValue);
    localStorage.setItem("dataSaver", newValue.toString());
  };

  const handleTestAdsToggle = () => {
    const newValue = !testAds;
    setTestAds(newValue);
    setTestMode(newValue);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
            {user?.email?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <h2 className="text-xl font-bold">Profile</h2>
            <p className="text-sm text-muted-foreground">
              {user?.email || "Not signed in"}
            </p>
          </div>
        </div>

        {/* Settings */}
        <div className="border border-border rounded-2xl divide-y divide-border">
          <div className="p-4 flex items-center justify-between">
            <span className="font-medium">Dark Mode</span>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={handleDarkModeToggle}
                className="sr-only peer"
              />
              <div className="w-full h-full bg-muted rounded-full peer-checked:bg-primary transition-colors cursor-pointer" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
            </label>
          </div>

          <div className="p-4 flex items-center justify-between">
            <span className="font-medium">Language</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleLocaleChange("en")}
                className={`px-3 py-1 rounded-lg text-sm ${
                  locale === "en" ? "bg-primary text-primary-foreground" : "border border-border"
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleLocaleChange("hi")}
                className={`px-3 py-1 rounded-lg text-sm ${
                  locale === "hi" ? "bg-primary text-primary-foreground" : "border border-border"
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between">
            <span className="font-medium">Data Saver</span>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={dataSaver}
                onChange={handleDataSaverToggle}
                className="sr-only peer"
              />
              <div className="w-full h-full bg-muted rounded-full peer-checked:bg-primary transition-colors cursor-pointer" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
            </label>
          </div>

          <div className="p-4 flex items-center justify-between">
            <span className="font-medium">Use Test Ads</span>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={testAds}
                onChange={handleTestAdsToggle}
                className="sr-only peer"
              />
              <div className="w-full h-full bg-muted rounded-full peer-checked:bg-primary transition-colors cursor-pointer" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
            </label>
          </div>
        </div>

        {/* Links */}
        <div className="border border-border rounded-2xl divide-y divide-border">
          <Link to="/about" className="block p-4 hover:bg-accent transition-colors">
            Privacy Policy
          </Link>
          <a
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 hover:bg-accent transition-colors"
          >
            Rate App
          </a>
        </div>
      </div>
    </AppLayout>
  );
}
