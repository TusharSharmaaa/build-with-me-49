import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { ToolCard } from "@/components/ToolCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { BannerAd } from "@/components/ads/BannerAd";
import { RewardedAd } from "@/components/ads/RewardedAd";
import { useAdFrequency } from "@/hooks/useAdFrequency";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { useDebounce } from "@/hooks/useDebounce";
import { EmptyState } from "@/components/EmptyState";
import { ToolCardSkeleton } from "@/components/skeletons/ToolCardSkeleton";
import { Badge } from "@/components/ui/badge";
import { withRetry } from "@/lib/network";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const debouncedSearch = useDebounce(searchQuery, 250);
  const { toast } = useToast();
  
  const {
    shouldShow: shouldShowRewardedAd,
    viewCount: searchCount,
    incrementView: incrementSearch,
    resetAd: resetRewardedAd
  } = useAdFrequency({
    key: "search",
    maxViews: 10,
    resetInterval: 3600000
  });

  const [showBonusTools, setShowBonusTools] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  const addRecentSearch = (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const { data: tools, isLoading } = useQuery({
    queryKey: ["search-tools", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 3) return [];
      
      trackEvent("search_query", { query: debouncedSearch });
      incrementSearch();
      addRecentSearch(debouncedSearch);
      
      return withRetry(async () => {
        const { data, error } = await supabase
          .from("ai_tools")
          .select("*")
          .or(`name.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%`)
          .order("rating", { ascending: false })
          .limit(20);
        
        if (error) throw error;
        return data;
      });
    },
    enabled: debouncedSearch.length >= 3,
  });

  const handleRewardEarned = () => {
    setShowBonusTools(true);
    toast({
      title: "Bonus tools unlocked!",
      description: "Premium tools are now visible in results.",
    });
  };

  return (
    <Layout title="Search" showSearch={false}>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search AI tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
            autoFocus
          />
        </div>

        {recentSearches.length > 0 && !searchQuery && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Recent searches</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <Badge
                  key={term}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setSearchQuery(term)}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {searchCount >= 8 && !showBonusTools && (
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4 text-center space-y-2">
            <p className="font-semibold text-sm">🎁 Unlock Premium Tools</p>
            <Button size="sm" onClick={() => resetRewardedAd()}>
              Watch Video
            </Button>
          </div>
        )}

        {debouncedSearch.length >= 3 && (
          <>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => <ToolCardSkeleton key={i} />)}
              </div>
            ) : tools && tools.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {tools.length} result{tools.length !== 1 ? "s" : ""}
                </p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tools.map((tool) => (
                    <ToolCard key={tool.id} {...tool} />
                  ))}
                </div>
                <BannerAd placement="search" />
              </>
            ) : (
              <EmptyState
                icon={Search}
                title="No results found"
                description={`No tools match "${debouncedSearch}". Try different keywords.`}
              />
            )}
          </>
        )}

        {debouncedSearch.length > 0 && debouncedSearch.length < 3 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Type at least 3 characters to search
          </p>
        )}
      </div>

      <RewardedAd
        isOpen={shouldShowRewardedAd}
        onClose={resetRewardedAd}
        onRewardEarned={handleRewardEarned}
        rewardDescription="premium tools"
      />
    </Layout>
  );
}
