import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { ToolCard, ToolCardSkeleton } from "@/components/ToolCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Clock } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { initAds } from "@/lib/ads";
import { useRemoteConfig } from "@/hooks/useRemoteConfig";

export default function Home() {
  const navigate = useNavigate();
  const remoteConfig = useRemoteConfig();

  useEffect(() => {
    trackEvent('open_app');
    initAds({ appId: 'ca-app-pub-TEST-APP-ID', testMode: true });
  }, []);

  // Trending tools (top rated)
  const { data: trendingTools, isLoading: trendingLoading } = useQuery({
    queryKey: ["trending-tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_tools")
        .select("*")
        .order("rating", { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  // Recently updated tools
  const { data: recentTools, isLoading: recentLoading } = useQuery({
    queryKey: ["recent-tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_tools")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data;
    },
  });

  // Categories
  const { data: categories } = useQuery({
    queryKey: ["professions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professions")
        .select("*")
        .limit(8);
      
      if (error) throw error;
      return data;
    },
  });

  const handleSearchFocus = () => {
    navigate('/search');
  };

  const handleCategoryClick = (slug: string) => {
    trackEvent('view_category', { category: slug });
    navigate(`/category/${slug}`);
  };

  const showTrending = remoteConfig?.ui?.showTrending ?? true;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search AI tools, free limits..."
            className="pl-12 h-12 text-base rounded-2xl"
            onFocus={handleSearchFocus}
            readOnly
          />
        </div>

        {/* Category Chips */}
        {categories && categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant="secondary"
                className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleCategoryClick(category.slug)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Trending Tools Carousel */}
        {showTrending && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Trending Tools</h2>
            </div>
            {trendingLoading ? (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="min-w-[280px]">
                    <ToolCardSkeleton />
                  </div>
                ))}
              </div>
            ) : trendingTools && trendingTools.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {trendingTools.map((tool) => (
                  <div key={tool.id} className="min-w-[280px]">
                    <ToolCard {...tool} />
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        )}

        {/* Recently Updated Tools */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Recently Updated Free Limits</h2>
          </div>
          {recentLoading ? (
            <div className="grid gap-3 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <ToolCardSkeleton key={i} />
              ))}
            </div>
          ) : recentTools && recentTools.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {recentTools.slice(0, 8).map((tool) => (
                <ToolCard key={tool.id} {...tool} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No tools available yet. Check back soon!
              </CardContent>
            </Card>
          )}
        </section>

        {/* Quick Actions */}
        <div className="grid gap-3 md:grid-cols-2">
          <Button asChild size="lg" className="h-14">
            <Link to="/categories">
              Browse All Categories
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14">
            <Link to="/submit">
              Submit a Tool
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}