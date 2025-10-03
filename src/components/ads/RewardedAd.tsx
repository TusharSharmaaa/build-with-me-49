import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, Loader2 } from "lucide-react";

interface RewardedAdProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardEarned: () => void;
  rewardDescription?: string;
}

export function RewardedAd({ 
  isOpen, 
  onClose, 
  onRewardEarned,
  rewardDescription = "bonus features"
}: RewardedAdProps) {
  const [isWatching, setIsWatching] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isWatching) {
      // Simulate video ad progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onRewardEarned();
              onClose();
              setIsWatching(false);
              setProgress(0);
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isWatching, onRewardEarned, onClose]);

  const handleWatchAd = () => {
    setIsWatching(true);
    // TODO: Load AdSense/AdMob rewarded video ad
    console.log("Rewarded video ad started");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isWatching) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Unlock {rewardDescription}
          </DialogTitle>
          <DialogDescription>
            Watch a short video to unlock {rewardDescription}
          </DialogDescription>
        </DialogHeader>
        
        {!isWatching ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center bg-muted/50 rounded-lg p-8" style={{ minHeight: "200px" }}>
              <div className="text-center space-y-4">
                <Gift className="h-12 w-12 mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">
                  Watch a 30-second video to unlock {rewardDescription}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Maybe Later
              </Button>
              <Button onClick={handleWatchAd} className="flex-1">
                Watch Video
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center bg-muted/50 rounded-lg p-8" style={{ minHeight: "200px" }}>
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Playing video ad... {progress}%
                </p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Please wait for the video to complete
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default RewardedAd;