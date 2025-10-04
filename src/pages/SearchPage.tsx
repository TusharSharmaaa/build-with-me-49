import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { ToolCard } from "@/components/ToolCard";
import { Input } from "@/components/ui/input";
import { Search, Clock, XCircle, X } from "lucide-react";
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
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { trackSearch } from "@/lib/ads";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 250);
  const { toast } = useToast();
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();
  
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

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
  };

  const { data: tools, isLoading } = useQuery({
    queryKey: ["search-tools", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 3) return [];
      
      trackEvent("search_query", { query: debouncedSearch });
      trackSearch();
      incrementSearch();
      addToHistory(debouncedSearch);
      
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
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search AI tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-10 h-12 text-base rounded-xl"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {!searchQuery && history.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Recent Searches</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="h-auto py-1 px-2 text-xs"
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.slice(0, 5).map((query) => (
                  <Badge
                    key={query}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent group"
                    onClick={() => handleHistoryClick(query)}
                  >
                    {query}
                    <XCircle
                      className="ml-1.5 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromHistory(query);
                      }}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

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
