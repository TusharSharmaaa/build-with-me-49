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
        {/* Search */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Discover Free AI Tools
          </h2>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-12 pl-12 pr-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </form>
        </div>

        {/* Profession chips */}
        <div className="flex gap-2 flex-wrap">
          {professionChips.map((slug) => (
            <button
              key={slug}
              onClick={() => handleChipClick(slug)}
              className="px-4 py-2 border border-border rounded-full text-sm font-medium hover:bg-accent transition-colors active:scale-95"
            >
              {slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
            </button>
          ))}
        </div>

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
