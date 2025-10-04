import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Bell, Shield, Info, FileText } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function Settings() {
  const { permission, isSupported, requestPermission } = usePushNotifications();
  const [personalizedAds, setPersonalizedAds] = useState(true);

  useEffect(() => {
    setPersonalizedAds(localStorage.getItem('ad_personalization_consent') !== 'no');
  }, []);

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestPermission();
      if (granted) {
        toast.success("Push notifications enabled!");
      } else {
        toast.error("Notification permission denied");
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/profile">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new AI tools in your field
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={permission === 'granted'}
                onCheckedChange={handleNotificationToggle}
                disabled={!isSupported}
              />
            </div>
            {!isSupported && (
              <p className="text-xs text-muted-foreground">
                Push notifications are not supported in your browser
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Personalized Ads</Label>
                <p className="text-sm text-muted-foreground">
                  Allow ads tailored to your interests (helps keep this app free)
                </p>
              </div>
              <Switch
                checked={personalizedAds}
                onCheckedChange={(checked) => {
                  setPersonalizedAds(checked);
                  localStorage.setItem('ad_personalization_consent', checked ? 'yes' : 'no');
                  toast.success(checked ? 'Personalized ads enabled' : 'Personalized ads disabled');
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              You can change this anytime. Disabling personalized ads means you'll still see ads, but they won't be based on your activity.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">AI Tools List</p>
              <p className="text-sm text-muted-foreground">Version 1.0.0</p>
            </div>
            <Separator />
            <p className="text-sm text-muted-foreground">
              Discover free AI tools for your profession with transparent pricing and usage limits.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Legal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/privacy-policy">
                <Shield className="mr-2 h-4 w-4" />
                Privacy Policy
              </Link>
            </Button>
            <Separator />
            <div className="text-sm text-muted-foreground space-y-1">
              <p>© 2025 AI Tools List. All rights reserved.</p>
              <p>This app uses third-party services including AdMob for advertisements.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}