import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface InterstitialAdProps {
  isOpen: boolean;
  onClose: () => void;
  autoCloseDelay?: number;
}

export function InterstitialAd({ 
  isOpen, 
  onClose, 
  autoCloseDelay = 5000 
}: InterstitialAdProps) {
  const [countdown, setCountdown] = useState(Math.ceil(autoCloseDelay / 1000));

  useEffect(() => {
    if (isOpen) {
      trackEvent('ad_interstitial_impression');
      setCountdown(Math.ceil(autoCloseDelay / 1000));
      
      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown(prev => Math.max(0, prev - 1));
      }, 1000);
      
      // Auto close after delay
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }
  }, [isOpen, onClose, autoCloseDelay]);

  const isTestMode = localStorage.getItem('ad_test_mode') === 'true';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Advertisement</span>
            {countdown === 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center bg-muted/30 rounded-lg p-12" style={{ minHeight: "300px" }}>
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">Interstitial Ad {isTestMode && '(Test)'}</p>
            <p className="text-xs text-muted-foreground">
              {countdown > 0 ? `Closes in ${countdown}s` : 'Close now'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InterstitialAd;