import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ToolCard } from "@/components/ToolCard";
import { Skeleton } from "@/components/ui/skeleton";
import { RewardedAd } from "@/components/ads/RewardedAd";
import { Badge } from "@/components/ui/badge";

export default function PremiumTools() {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem("premiumToolsUnlocked") === "true";
  });
  const [showRewardedAd, setShowRewardedAd] = useState(false);

  const { data: featuredTools, isLoading } = useQuery({
    queryKey: ["featured-tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_tools")
        .select("*")
        .eq("featured", true)
        .order("featured_order", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const handleUnlock = () => {
    setIsUnlocked(true);
    localStorage.setItem("premiumToolsUnlocked", "true");
    // Unlock expires after 24 hours
    setTimeout(() => {
      setIsUnlocked(false);
      localStorage.removeItem("premiumToolsUnlocked");
    }, 24 * 60 * 60 * 1000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Star className="h-8 w-8 text-yellow-500" />
              Premium Curated Tools
            </h1>
            <p className="text-muted-foreground">
              Hand-picked AI tools by our experts
            </p>
          </div>
        </div>

        {!isUnlocked ? (
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Unlock Premium Curated List
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Get access to our carefully curated collection of the best AI tools,
                tested and verified by our team. Watch a short video to unlock 24-hour access!
              </p>
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-2">
                  What's Inside:
                </Badge>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Hand-tested and verified tools</li>
                  <li>Exclusive tools not in the main directory</li>
                  <li>Advanced workflows and use cases</li>
                  <li>Priority updates on new features</li>
                </ul>
              </div>
              <RewardedAd 
                isOpen={showRewardedAd}
                onClose={() => setShowRewardedAd(false)}
                onRewardEarned={handleUnlock}
                rewardDescription="premium curated list for 24 hours"
              />
              <Button 
                className="w-full" 
                onClick={() => setShowRewardedAd(true)}
              >
                <Lock className="mr-2 h-4 w-4" />
                Unlock Premium List
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
              <CardContent className="py-4">
                <p className="text-sm text-center">
                  🎉 Premium list unlocked for 24 hours! Enjoy exploring.
                </p>
              </CardContent>
            </Card>

            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <Skeleton className="h-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : featuredTools && featuredTools.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {featuredTools.map((tool) => (
                  <div key={tool.id} className="relative">
                    <Badge
                      className="absolute top-2 right-2 z-10"
                      variant="default"
                    >
                      <Star className="mr-1 h-3 w-3" />
                      Premium
                    </Badge>
                    <ToolCard {...tool} />
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Premium tools are being curated. Check back soon!
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
