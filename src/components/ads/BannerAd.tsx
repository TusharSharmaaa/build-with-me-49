import { useEffect, useRef } from "react";

interface BannerAdProps {
  position?: "top" | "bottom";
  className?: string;
}

export function BannerAd({ position = "bottom", className = "" }: BannerAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: Initialize AdSense/AdMob banner ad
    // For now, showing placeholder
    console.log("Banner ad initialized at position:", position);
  }, [position]);

  // In production, replace this with actual ad integration
  return (
    <div 
      ref={adRef}
      className={`w-full bg-muted/50 border border-border rounded-lg flex items-center justify-center ${className}`}
      style={{ minHeight: "90px" }}
    >
      <div className="text-center p-4">
        <p className="text-xs text-muted-foreground">Advertisement</p>
        <p className="text-xs text-muted-foreground mt-1">
          Banner Ad Placeholder
        </p>
      </div>
    </div>
  );
}

export default BannerAd;