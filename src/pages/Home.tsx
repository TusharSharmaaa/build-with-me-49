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
import { ValueProposition } from "@/components/ValueProposition";

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
      <div className="space-y-6 md:space-y-8 pb-6">
        {/* Mobile-Optimized Hero */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-2xl md:rounded-3xl blur-2xl md:blur-3xl" />
          <div className="relative space-y-3 md:space-y-4">
            <div className="space-y-1 md:space-y-2">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
                Discover Free AI Tools
              </h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Comprehensive directory with usage limits, tutorials, and expert insights
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-5 md:h-6 w-5 md:w-6 text-primary" />
              <Input
                placeholder="Search AI tools, guides, tutorials..."
                className="pl-12 md:pl-14 h-12 md:h-14 text-sm md:text-base rounded-xl md:rounded-2xl shadow-premium-lg border-2 hover:border-primary transition-smooth"
                onFocus={handleSearchFocus}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Category Chips */}
        {categories && categories.length > 0 && (
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-3 scrollbar-hide -mx-3 md:mx-0 px-3 md:px-0">
            {categories.map((category) => (
              <Badge
                key={category.id}
                className="cursor-pointer whitespace-nowrap px-4 md:px-5 py-2 md:py-3 text-xs md:text-sm font-medium bg-gradient-card hover:bg-gradient-primary hover:text-primary-foreground transition-smooth shadow-premium hover:shadow-primary active:scale-95 border-2 flex-shrink-0"
                onClick={() => handleCategoryClick(category.slug)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Mobile-Optimized Trending Section */}
        {showTrending && (
          <section className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-primary flex items-center justify-center shadow-primary flex-shrink-0">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg md:text-2xl font-bold leading-tight">Trending Tools</h2>
                <p className="text-xs md:text-sm text-muted-foreground truncate">Most popular this week</p>
              </div>
            </div>
            {trendingLoading ? (
              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-3 md:mx-0 px-3 md:px-0">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="min-w-[85vw] md:min-w-[320px] flex-shrink-0">
                    <ToolCardSkeleton />
                  </div>
                ))}
              </div>
            ) : trendingTools && trendingTools.length > 0 ? (
              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-3 md:mx-0 px-3 md:px-0">
                {trendingTools.map((tool) => (
                  <div key={tool.id} className="min-w-[85vw] md:min-w-[320px] flex-shrink-0">
                    <ToolCard {...tool} />
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        )}

        {/* Mobile-Optimized Recent Updates */}
        <section className="space-y-3 md:space-y-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-accent flex items-center justify-center shadow-accent flex-shrink-0">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-accent-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg md:text-2xl font-bold leading-tight">Recently Updated</h2>
              <p className="text-xs md:text-sm text-muted-foreground truncate">Fresh free tier updates</p>
            </div>
          </div>
          {recentLoading ? (
            <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <ToolCardSkeleton key={i} />
              ))}
            </div>
          ) : recentTools && recentTools.length > 0 ? (
            <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
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

        {/* Mobile-Optimized Quick Actions */}
        <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 pt-4">
          <Button asChild size="lg" className="h-14 md:h-16 text-base md:text-lg bg-gradient-primary hover:shadow-primary transition-smooth">
            <Link to="/categories">
              Browse All Categories
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14 md:h-16 text-base md:text-lg hover-lift">
            <Link to="/submit">
              Submit a Tool
            </Link>
          </Button>
        </div>

        {/* Value Proposition Section */}
        <ValueProposition />
      </div>
    </Layout>
  );
}