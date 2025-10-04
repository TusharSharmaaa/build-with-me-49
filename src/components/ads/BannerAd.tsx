import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

interface BannerAdProps {
  placement: "listing" | "search";
  className?: string;
}

export function BannerAd({ placement, className = "" }: BannerAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackEvent('ad_banner_impression', { placement });
    
    // In native app with Capacitor, this would initialize AdMob banner
    if (typeof window !== 'undefined' && (window as any).admob) {
      (window as any).admob.createBanner({
        adId: 'ca-app-pub-3940256099942544/6300978111', // Test ID
        position: 'BOTTOM_CENTER',
        autoShow: true,
      });
    }
  }, [placement]);

  // Web fallback: show placeholder
  const isTestMode = localStorage.getItem('ad_test_mode') === 'true';
  
  return (
    <div 
      ref={adRef}
      className={`w-full bg-muted/30 border border-border/50 rounded-lg flex items-center justify-center ${className}`}
      style={{ minHeight: "60px" }}
    >
      <div className="text-center p-3">
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wide">
          Advertisement {isTestMode && '(Test)'}
        </p>
      </div>
    </div>
  );
}

export default BannerAd;