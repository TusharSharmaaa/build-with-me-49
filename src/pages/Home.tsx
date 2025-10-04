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
import { Search, TrendingUp, Clock, FolderOpen, Workflow, ChevronRight } from "lucide-react";
import { WebsiteSchema } from "@/components/JsonLd";
import { trackEvent } from "@/lib/analytics";
import { initAds } from "@/lib/ads";
import { useRemoteConfig } from "@/hooks/useRemoteConfig";
import { ErrorState } from "@/components/ErrorState";
import { withRetry } from "@/lib/network";

export default function Home() {
  const navigate = useNavigate();
  const remoteConfig = useRemoteConfig();

  useEffect(() => {
    trackEvent('open_app');
    initAds({ appId: 'ca-app-pub-TEST-APP-ID', testMode: true });
  }, []);

  // Featured tool (highest featured_order)
  const { data: featuredTool, isLoading: featuredLoading, error: featuredError, refetch: refetchFeatured } = useQuery({
    queryKey: ["featured-tool"],
    queryFn: async () => {
      return withRetry(async () => {
        const { data, error } = await supabase
          .from("ai_tools")
          .select("*")
          .eq("featured", true)
          .order("featured_order", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) throw error;
        return data;
      });
    },
  });

  // Trending tools (top rated, excluding featured)
  const { data: trendingTools, isLoading: trendingLoading, error: trendingError } = useQuery({
    queryKey: ["trending-tools"],
    queryFn: async () => {
      return withRetry(async () => {
        let query = supabase
          .from("ai_tools")
          .select("*")
          .order("rating", { ascending: false })
          .limit(6);
        
        if (featuredTool) {
          query = query.neq("id", featuredTool.id);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data;
      });
    },
    enabled: featuredLoading === false,
  });

  // Recently updated tools
  const { data: recentTools, isLoading: recentLoading, error: recentError, refetch: refetchRecent } = useQuery({
    queryKey: ["recent-tools"],
    queryFn: async () => {
      return withRetry(async () => {
        const { data, error } = await supabase
          .from("ai_tools")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(8);
        
        if (error) throw error;
        return data;
      });
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

  // Collections preview
  const { data: collections } = useQuery({
    queryKey: ["collections-preview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  // Workflows preview
  const { data: workflows } = useQuery({
    queryKey: ["workflows-preview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workflows")
        .select("*")
        .limit(3);
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
      <WebsiteSchema />
      <div className="space-y-6 md:space-y-8 pb-6">
        {/* Mobile-Optimized Hero */}
        <div className="relative">
          <div className="space-y-3 md:space-y-4">
            <div className="space-y-1 md:space-y-2">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
                Discover Free AI Tools
              </h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Comprehensive directory with usage limits and expert insights
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-5 md:h-6 w-5 md:w-6 text-primary" />
              <Input
                placeholder="Search AI tools..."
                className="pl-12 md:pl-14 h-12 md:h-14 text-sm md:text-base rounded-xl md:rounded-2xl border-2 hover:border-primary transition-colors"
                onFocus={handleSearchFocus}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Featured Tool of the Week */}
        {featuredTool && (
          <section className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-accent flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-accent-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg md:text-2xl font-bold leading-tight">Featured Tool of the Week</h2>
                <p className="text-xs md:text-sm text-muted-foreground truncate">Handpicked by our experts</p>
              </div>
            </div>
            <ToolCard {...featuredTool} featured />
          </section>
        )}

        {/* Mobile-Optimized Category Chips */}
        {categories && categories.length > 0 && (
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-3 scrollbar-hide -mx-3 md:mx-0 px-3 md:px-0">
            {categories.map((category) => (
              <Badge
                key={category.id}
                className="cursor-pointer whitespace-nowrap px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors active:scale-95 border flex-shrink-0"
                variant="outline"
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
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
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
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-accent flex items-center justify-center flex-shrink-0">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-accent-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg md:text-2xl font-bold leading-tight">Recently Updated</h2>
              <p className="text-xs md:text-sm text-muted-foreground truncate">Fresh updates</p>
            </div>
          </div>
          {recentError ? (
            <ErrorState
              type="network"
              onRetry={() => refetchRecent()}
            />
          ) : recentLoading ? (
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

        {/* Curated Collections */}
        {collections && collections.length > 0 && (
          <section className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <h2 className="text-lg md:text-2xl font-bold">Curated Collections</h2>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/collections">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3">
              {collections.map((collection) => (
                <Link key={collection.id} to={`/collection/${collection.slug}`}>
                  <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer h-full">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{collection.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {collection.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Popular Workflows */}
        {workflows && workflows.length > 0 && (
          <section className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Workflow className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                </div>
                <h2 className="text-lg md:text-2xl font-bold">Popular Workflows</h2>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/workflows">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3">
              {workflows.map((workflow) => (
                <Link key={workflow.id} to={`/workflow/${workflow.slug}`}>
                  <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer h-full">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{workflow.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {workflow.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Mobile-Optimized Quick Actions */}
        <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4 pt-2">
          <Button asChild size="lg" className="h-12 md:h-14 text-xs md:text-sm bg-gradient-primary">
            <Link to="/categories">
              Browse Categories
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 md:h-14 text-xs md:text-sm">
            <Link to="/compare">
              Compare Tools
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 md:h-14 text-xs md:text-sm">
            <Link to="/workflows">
              Workflows
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 md:h-14 text-xs md:text-sm">
            <Link to="/submit">
              Submit Tool
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}