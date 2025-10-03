import { useState, useEffect } from "react";

interface AdFrequencyOptions {
  key: string;
  maxViews: number;
  resetInterval?: number; // in milliseconds
}

export function useAdFrequency({ key, maxViews, resetInterval }: AdFrequencyOptions) {
  const [viewCount, setViewCount] = useState(0);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Load view count from localStorage
    const stored = localStorage.getItem(`ad_${key}`);
    if (stored) {
      const data = JSON.parse(stored);
      const now = Date.now();
      
      // Reset if interval has passed
      if (resetInterval && now - data.timestamp > resetInterval) {
        setViewCount(0);
        localStorage.removeItem(`ad_${key}`);
      } else {
        setViewCount(data.count);
      }
    }
  }, [key, resetInterval]);

  const incrementView = () => {
    const newCount = viewCount + 1;
    setViewCount(newCount);
    
    localStorage.setItem(`ad_${key}`, JSON.stringify({
      count: newCount,
      timestamp: Date.now()
    }));

    // Check if we should show ad
    if (newCount >= maxViews) {
      setShouldShow(true);
      // Reset counter after showing
      setTimeout(() => {
        setViewCount(0);
        localStorage.setItem(`ad_${key}`, JSON.stringify({
          count: 0,
          timestamp: Date.now()
        }));
      }, 100);
    }
  };

  const resetAd = () => {
    setShouldShow(false);
  };

  return {
    shouldShow,
    viewCount,
    incrementView,
    resetAd
  };
}