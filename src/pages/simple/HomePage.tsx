import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { AppLayout } from "@/components/system/AppLayout";
import { ToolCard, ToolCardSkeleton } from "@/components/simple/ToolCard";
import { supabase, withRetry, isSupabaseConfigured } from "@/lib/supabase-service";
import { trackEvent } from "@/lib/simple-analytics";
import { useTranslations } from "@/lib/i18n";

const professionChips = [
  "data-analyst",
  "developer",
  "marketer",
  "designer",
  "student",
];

export function HomePage() {
  const navigate = useNavigate();
  const [locale] = useState<"en" | "hi">("en");
  const t = useTranslations(locale);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    trackEvent("open_app");
  }, []);

  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: () =>
      withRetry(() =>
        supabase
          .from("ai_tools")
          .select("*")
          .order("rating", { ascending: false })
          .limit(8)
          .then((res) => {
            if (res.error) throw res.error;
            return res.data;
          })
      ),
    enabled: isSupabaseConfigured(),
  });

  const { data: recent, isLoading: recentLoading } = useQuery({
    queryKey: ["recent"],
    queryFn: () =>
      withRetry(() =>
        supabase
          .from("ai_tools")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(8)
          .then((res) => {
            if (res.error) throw res.error;
            return res.data;
          })
      ),
    enabled: isSupabaseConfigured(),
  });

  const { data: featured, isLoading: featuredLoading } = useQuery({
    queryKey: ["featured"],
    queryFn: () =>
      withRetry(() =>
        supabase
          .from("ai_tools")
          .select("*")
          .or("verified.eq.true,editors_pick.eq.true")
          .order("rating", { ascending: false })
          .limit(1)
          .maybeSingle()
          .then((res) => {
            if (res.error) throw res.error;
            return res.data;
          })
      ),
    enabled: isSupabaseConfigured(),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
    } else {
      navigate("/search");
    }
  };

  const handleChipClick = (slug: string) => {
    trackEvent("view_category", { category: slug });
    navigate(`/category/${slug}`);
  };

  if (!isSupabaseConfigured()) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Configuration Missing</h2>
            <p className="text-muted-foreground">
              Supabase environment variables are not set.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Hero / Greeting */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold">
            Discover the Best Free AI Tools
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find powerful AI tools with transparent pricing, free tiers, and detailed usage limits for your work.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full h-14 pl-12 pr-4 border-2 border-border rounded-2xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </form>

        {/* Profession chips - horizontal scroll */}
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-2 min-w-max pb-2">
            {professionChips.map((slug) => (
              <button
                key={slug}
                onClick={() => handleChipClick(slug)}
                className="px-5 py-2.5 border border-border rounded-full text-sm font-medium hover:bg-accent transition-all active:scale-95 whitespace-nowrap"
              >
                {slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Tool */}
        {featuredLoading ? (
          <div className="h-48 bg-muted rounded-2xl animate-pulse" />
        ) : featured ? (
          <section className="border-2 border-primary/20 rounded-2xl p-6 bg-primary/5">
            <div className="flex items-start gap-1 mb-3">
              <span className="text-lg">⭐</span>
              <h3 className="text-lg font-semibold">Featured Tool</h3>
            </div>
            <div className="flex gap-4">
              {featured.logo_url && (
                <img
                  src={featured.logo_url}
                  alt={featured.name}
                  className="w-16 h-16 rounded-xl object-cover border border-border"
                />
              )}
              <div className="flex-1">
                <h4 className="text-xl font-bold mb-2">{featured.name}</h4>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {featured.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/tool/${featured.id}`)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    View Details
                  </button>
                  {featured.website_url && (
                    <a
                      href={featured.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                    >
                      Open Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* Trending */}
        <section>
          <h3 className="text-xl font-semibold mb-4">{t.trending}</h3>
          {trendingLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <ToolCardSkeleton key={i} />
              ))}
            </div>
          ) : trending && trending.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trending.map((tool) => (
                <ToolCard key={tool.id} {...tool} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No tools available yet.</p>
          )}
        </section>

        {/* Recently Updated */}
        <section>
          <h3 className="text-xl font-semibold mb-4">{t.recentlyUpdated}</h3>
          {recentLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <ToolCardSkeleton key={i} />
              ))}
            </div>
          ) : recent && recent.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recent.map((tool) => (
                <ToolCard key={tool.id} {...tool} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No tools available yet.</p>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
