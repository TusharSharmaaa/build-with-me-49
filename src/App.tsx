import useHardwareBack from './hooks/useHardwareBack';

import ToolDetail from './pages/ToolDetail';
import SubmitTool from './pages/SubmitTool';

import ScrollToTop from './components/ScrollToTop';

import { bootSessionClock } from './hooks/useInterstitialPolicy';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { initAds, showBanner, attachBannerListener } from './lib/ads';

import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Eager load critical pages
import { HomePage } from "./pages/simple/HomePage";

// Lazy load secondary pages
const CategoriesPage = lazy(() => import("./pages/simple/CategoriesPage").then(m => ({ default: m.CategoriesPage })));
const CategoryToolsPage = lazy(() => import("./pages/simple/CategoryToolsPage").then(m => ({ default: m.CategoryToolsPage })));
const ToolDetailPage = lazy(() => import("./pages/simple/ToolDetailPage").then(m => ({ default: m.ToolDetailPage })));
const SearchPage = lazy(() => import("./pages/simple/SearchPage").then(m => ({ default: m.SearchPage })));
const FavoritesPage = lazy(() => import("./pages/simple/FavoritesPage").then(m => ({ default: m.FavoritesPage })));
const ProfilePage = lazy(() => import("./pages/simple/ProfilePage").then(m => ({ default: m.ProfilePage })));
const SubmitPage = lazy(() => import("./pages/simple/SubmitPage").then(m => ({ default: m.SubmitPage })));
const AboutPage = lazy(() => import("./pages/simple/AboutPage").then(m => ({ default: m.AboutPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
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
    useHardwareBack();  // 👈 HERE — top of function body

  useEffect(() => {
    bootSessionClock();

  if (Capacitor.getPlatform() !== 'web') {
    attachBannerListener();
    (async () => {
      try {
        const info: any = await initAds();
      } catch (e) {
        console.error('Ad init error', e);
      }
    })();
  }
}, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/category/:slug" element={<CategoryToolsPage />} />
            <Route path="/tool/:id" element={<ToolDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/tool/:id" element={<ToolDetail />} />
<Route path="/submit" element={<SubmitTool />} />

            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/about" element={<AboutPage />} />
<ScrollToTop />

          </Routes>
        </Suspense>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
