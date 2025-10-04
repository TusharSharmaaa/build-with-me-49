import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { ToolCard } from "@/components/ToolCard";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { BannerAd } from "@/components/ads/BannerAd";
import { RewardedAd } from "@/components/ads/RewardedAd";
import { useAdFrequency } from "@/hooks/useAdFrequency";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  // Track search frequency for rewarded ad
  const {
    shouldShow: shouldShowRewardedAd,
    viewCount: searchCount,
    incrementView: incrementSearch,
    resetAd: resetRewardedAd
  } = useAdFrequency({
    key: "search",
    maxViews: 10,
    resetInterval: 3600000 // 1 hour
  });

  const [showBonusTools, setShowBonusTools] = useState(false);

  const { data: tools, isLoading } = useQuery({
    queryKey: ["search-tools", searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      
      incrementSearch(); // Track search for rewarded ad
      
      const { data, error } = await supabase
        .from("ai_tools")
        .select("*")
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .order("rating", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: searchQuery.length > 2,
  });

  const handleRewardEarned = () => {
    setShowBonusTools(true);
    toast({
      title: "Bonus tools unlocked!",
      description: "You can now see premium tools in your search results.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Search AI Tools</h1>
          <p className="text-muted-foreground">
            Find the perfect tool for your needs
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>

        {searchCount >= 8 && !showBonusTools && (
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="py-6 text-center space-y-3">
              <p className="font-semibold">🎁 Unlock Bonus Premium Tools!</p>
              <p className="text-sm text-muted-foreground">
                Watch a short video to unlock premium tools in your results
              </p>
              <Button onClick={() => resetRewardedAd()}>
                Unlock Now
              </Button>
            </CardContent>
          </Card>
        )}

        {searchQuery.length > 2 && (
          <>
            {isLoading ? (
              <p className="text-center text-muted-foreground">Searching...</p>
            ) : tools && tools.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Found {tools.length} tool{tools.length !== 1 ? "s" : ""}
                  </p>
                  {showBonusTools && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Premium tools unlocked ✨
                    </span>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tools.map((tool) => (
                    <ToolCard key={tool.id} {...tool} />
                  ))}
                </div>
                
                {/* Banner Ad at bottom of search results */}
                <BannerAd placement="search" className="mt-4" />
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No tools found matching "{searchQuery}"
                </CardContent>
              </Card>
            )}
          </>
        )}

        {searchQuery.length <= 2 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Enter at least 3 characters to search
            </CardContent>
          </Card>
        )}
      </div>

      {/* Rewarded Ad Modal */}
      <RewardedAd
        isOpen={shouldShowRewardedAd}
        onClose={resetRewardedAd}
        onRewardEarned={handleRewardEarned}
        rewardDescription="premium tools"
      />
    </Layout>
  );
}