import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
  useEffect(() => {
    if (isOpen) {
      // TODO: Load AdSense/AdMob interstitial ad
      console.log("Interstitial ad displayed");
      
      // Auto close after delay
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoCloseDelay]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Advertisement</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center bg-muted/50 rounded-lg p-8" style={{ minHeight: "300px" }}>
          <div className="text-center">
            <p className="text-muted-foreground">Interstitial Ad Placeholder</p>
            <p className="text-xs text-muted-foreground mt-2">
              Ad closes in {Math.ceil(autoCloseDelay / 1000)}s
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InterstitialAd;