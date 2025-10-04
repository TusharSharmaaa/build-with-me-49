import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { ExternalLink, Bell, Palette, Wifi, Shield, Info, Globe, Star } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/contexts/LocaleContext";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useLocale();
  const { isSupported, permission, requestPermission } = usePushNotifications();
  const [dataSaver, setDataSaver] = useState(false);
  const [personalizedAds, setPersonalizedAds] = useState(true);
  const [testAds, setTestAds] = useState(true);

  useEffect(() => {
    setDataSaver(localStorage.getItem("dataSaver") === "true");
    setPersonalizedAds(localStorage.getItem("personalizedAds") !== "false");
    setTestAds(localStorage.getItem("testAds") !== "false");
  }, []);

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled && permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        toast.error("Failed to enable notifications");
      }
    }
  };

  const handleDataSaverToggle = (enabled: boolean) => {
    setDataSaver(enabled);
    localStorage.setItem("dataSaver", String(enabled));
    toast.success(enabled ? "Data saver enabled" : "Data saver disabled");
  };

  const handlePersonalizedAdsToggle = (enabled: boolean) => {
    setPersonalizedAds(enabled);
    localStorage.setItem("personalizedAds", String(enabled));
    toast.success(enabled ? "Personalized ads enabled" : "Using generic ads");
  };

  const handleTestAdsToggle = (enabled: boolean) => {
    setTestAds(enabled);
    localStorage.setItem("testAds", String(enabled));
    toast.success(enabled ? "Using test ads" : "Using production ads");
  };

  const handleRateApp = () => {
    window.open("https://play.google.com/store/apps/details?id=app.lovable.6d6ef95b79434044814ce44ec5423c6d", "_blank");
  };

  return (
    <Layout title="Settings">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSupported ? (
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="text-sm">
                  Push notifications
                </Label>
                <Switch
                  id="notifications"
                  checked={permission === 'granted'}
                  onCheckedChange={handleNotificationToggle}
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Push notifications not supported in this browser
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-5 w-5" />
              Language
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="language">Language</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose your preferred language
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={locale === "en" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLocale("en")}
                >
                  EN
                </Button>
                <Button
                  variant={locale === "hi" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLocale("hi")}
                >
                  हिन्दी
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-sm">
                Dark mode
              </Label>
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wifi className="h-5 w-5" />
              Data & Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="data-saver" className="text-sm">
                  Data saver mode
                </Label>
                <p className="text-xs text-muted-foreground">
                  Load lower resolution images
                </p>
              </div>
              <Switch
                id="data-saver"
                checked={dataSaver}
                onCheckedChange={handleDataSaverToggle}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-5 w-5" />
              Privacy & Ads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="personalized-ads" className="text-sm">
                  Personalized ads
                </Label>
                <p className="text-xs text-muted-foreground">
                  See ads relevant to you
                </p>
              </div>
              <Switch
                id="personalized-ads"
                checked={personalizedAds}
                onCheckedChange={handlePersonalizedAdsToggle}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="test-ads" className="text-sm">
                  Test ads (Dev only)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Use AdMob test IDs
                </p>
              </div>
              <Switch
                id="test-ads"
                checked={testAds}
                onCheckedChange={handleTestAdsToggle}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="h-5 w-5" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <p className="font-medium">AI Tools List v1.0.0</p>
              <p className="text-muted-foreground text-xs">
                Discover free AI tools by profession with transparent usage limits
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link to="/privacy-policy">
                  Privacy Policy
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={handleRateApp}
              >
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Rate on Play Store
                </div>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground pt-4">
              © 2025 AI Tools List. All rights reserved.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}