import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import { AppLayout } from "@/components/system/AppLayout";
import { ToolCard, ToolCardSkeleton } from "@/components/simple/ToolCard";
import { supabase, withRetry, isSupabaseConfigured } from "@/lib/supabase-service";
import { trackEvent } from "@/lib/simple-analytics";
import { useTranslations } from "@/lib/i18n";

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const [debouncedQuery, setDebouncedQuery] = useState(searchInput);
  const t = useTranslations("en");

  // Debounce search
  useState(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput);
    }, 250);
    return () => clearTimeout(timer);
  });

  const { data: tools, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => {
      if (!debouncedQuery || debouncedQuery.length < 3) return [];
      
      trackEvent("search_submit", { query: debouncedQuery });
      
      return withRetry(() =>
        supabase
          .from("ai_tools")
          .select("*")
          .or(`name.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`)
          .order("rating", { ascending: false })
          .limit(20)
          .then((res) => {
            if (res.error) throw res.error;
            return res.data;
          })
      );
    },
    enabled: isSupabaseConfigured() && debouncedQuery.length >= 3,
  });

  if (!isSupabaseConfigured()) {
    return <AppLayout><div className="text-center py-12">Configuration Missing</div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full h-12 pl-12 pr-12 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
        </div>

        {debouncedQuery.length >= 3 && (
          <>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <ToolCardSkeleton key={i} />
                ))}
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
                {/* Banner Ad Placeholder */}
                <div className="w-full h-14 bg-muted/30 border border-border rounded-lg flex items-center justify-center text-xs text-muted-foreground mt-8">
                  Ad Space
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No results found for "{debouncedQuery}"</p>
              </div>
            )}
          </>
        )}

        {debouncedQuery.length > 0 && debouncedQuery.length < 3 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Type at least 3 characters to search
          </p>
        )}
      </div>
    </AppLayout>
  );
}
