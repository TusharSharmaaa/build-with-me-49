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
      <div className="space-y-8">
        {/* Hero Search Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-3xl blur-3xl" />
          <div className="relative">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Discover Free AI Tools
            </h1>
            <p className="text-muted-foreground mb-4">
              Find the best AI tools with transparent free limits and pricing
            </p>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
              <Input
                placeholder="Search AI tools, free limits, categories..."
                className="pl-14 h-14 text-base rounded-2xl shadow-premium-lg border-2 hover:border-primary transition-smooth"
                onFocus={handleSearchFocus}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Enhanced Category Chips */}
        {categories && categories.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {categories.map((category) => (
              <Badge
                key={category.id}
                className="cursor-pointer whitespace-nowrap px-5 py-3 text-sm font-medium bg-gradient-card hover:bg-gradient-primary hover:text-primary-foreground transition-smooth shadow-premium hover:shadow-primary hover-scale border-2"
                onClick={() => handleCategoryClick(category.slug)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Trending Tools Carousel */}
        {showTrending && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-primary">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Trending Tools</h2>
                <p className="text-sm text-muted-foreground">Most popular this week</p>
              </div>
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
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center shadow-accent">
              <Clock className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Recently Updated</h2>
              <p className="text-sm text-muted-foreground">Latest free tier updates</p>
            </div>
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

        {/* Enhanced Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 mt-8">
          <Button asChild size="lg" className="h-16 text-lg bg-gradient-primary hover:shadow-primary transition-smooth">
            <Link to="/categories">
              Browse All Categories
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-16 text-lg hover-lift">
            <Link to="/submit">
              Submit a Tool
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}