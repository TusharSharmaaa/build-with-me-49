import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CONSENT_KEY = 'ad_personalization_consent';

export function ConsentModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem(CONSENT_KEY);
    if (!hasConsent) {
      setOpen(true);
    }
  }, []);

  const handleConsent = (personalized: boolean) => {
    localStorage.setItem(CONSENT_KEY, personalized ? 'yes' : 'no');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Personalized Ads</DialogTitle>
          <DialogDescription className="space-y-3 pt-2">
            <p>
              We show ads to keep AI Tools List free. Would you like to see
              personalized ads based on your interests?
            </p>
            <p className="text-xs text-muted-foreground">
              You can change this anytime in Settings.{" "}
              <Link to="/privacy-policy" className="underline">
                Privacy Policy
              </Link>
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => handleConsent(false)}
            className="w-full sm:w-auto"
          >
            No, show non-personalized
          </Button>
          <Button
            onClick={() => handleConsent(true)}
            className="w-full sm:w-auto"
          >
            Yes, personalize
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
