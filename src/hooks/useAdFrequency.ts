import { useState, useEffect, useCallback, useRef } from "react";

interface AdFrequencyOptions {
  key: string;
  maxViews: number;
  resetInterval?: number; // in milliseconds
}

export function useAdFrequency({ key, maxViews, resetInterval }: AdFrequencyOptions) {
  const [viewCount, setViewCount] = useState(0);
  const [shouldShow, setShouldShow] = useState(false);
  const hasShownRef = useRef(false);

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

  const incrementView = useCallback(() => {
    // Prevent multiple increments in quick succession
    const newCount = viewCount + 1;
    setViewCount(newCount);
    
    localStorage.setItem(`ad_${key}`, JSON.stringify({
      count: newCount,
      timestamp: Date.now()
    }));

    // Check if we should show ad (but only once per session)
    if (newCount >= maxViews && !hasShownRef.current) {
      hasShownRef.current = true;
      setShouldShow(true);
      // Reset counter after a delay
      setTimeout(() => {
        setViewCount(0);
        localStorage.setItem(`ad_${key}`, JSON.stringify({
          count: 0,
          timestamp: Date.now()
        }));
      }, 1000);
    }
  }, [viewCount, key, maxViews]);

  const resetAd = useCallback(() => {
    setShouldShow(false);
    // Reset the flag so ad can show again after more views
    setTimeout(() => {
      hasShownRef.current = false;
    }, 5000); // 5 second cooldown before allowing another ad
  }, []);

  return {
    shouldShow,
    viewCount,
    incrementView,
    resetAd
  };
}