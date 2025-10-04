import React, { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { trackEvent } from "@/lib/analytics";
import { initAds } from "@/lib/ads";

// Eager load critical routes
import Home from "./pages/Home";
import Auth from "./pages/Auth";

// Lazy load secondary routes for code splitting
const Categories = lazy(() => import("./pages/Categories"));
const CategoryTools = lazy(() => import("./pages/CategoryTools"));
const ToolDetail = lazy(() => import("./pages/ToolDetail"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const SubmitTool = lazy(() => import("./pages/SubmitTool"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Admin = lazy(() => import("./pages/Admin"));
const PremiumTools = lazy(() => import("./pages/PremiumTools"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );
}

function App() {
  useEffect(() => {
    trackEvent("open_app");
    initAds({ 
      appId: import.meta.env.VITE_ADMOB_APP_ID || "",
      testMode: true 
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:fieldId" element={<CategoryTools />} />
            <Route path="/tool/:toolId" element={<ToolDetail />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/submit" element={<SubmitTool />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/premium" element={<PremiumTools />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
