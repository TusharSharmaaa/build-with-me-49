import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Filter } from "lucide-react";
import { AppLayout } from "@/components/system/AppLayout";
import { ToolCard, ToolCardSkeleton } from "@/components/simple/ToolCard";
import { supabase, withRetry, isSupabaseConfigured } from "@/lib/supabase-service";

export function CategoryToolsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "updated">("rating");

  const { data: tools, isLoading } = useQuery({
    queryKey: ["category-tools", slug, freeOnly, sortBy],
    queryFn: () =>
      withRetry(() =>
        supabase
          .from("ai_tools")
          .select("*")
          .contains("profession_tags", [slug])
          .then((res) => {
            if (res.error) throw res.error;
            let data = res.data || [];
            
            if (freeOnly) {
              data = data.filter((t) => t.free_tier);
            }
            
            if (sortBy === "rating") {
              data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            } else {
              data.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
            }
            
            return data;
          })
      ),
    enabled: isSupabaseConfigured() && !!slug,
  });

  if (!isSupabaseConfigured()) {
    return <AppLayout><div className="text-center py-12">Configuration Missing</div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/categories")}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold capitalize flex-1">
            {slug?.replace("-", " ")} Tools
          </h2>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-accent"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>

        {/* Simple filter panel */}
        {filterOpen && (
          <div className="border border-border rounded-xl p-4 space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={freeOnly}
                onChange={(e) => setFreeOnly(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Free tools only</span>
            </label>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort by:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy("rating")}
                  className={`px-3 py-1.5 text-sm rounded-lg ${
                    sortBy === "rating" ? "bg-primary text-primary-foreground" : "border border-border"
                  }`}
                >
                  Rating
                </button>
                <button
                  onClick={() => setSortBy("updated")}
                  className={`px-3 py-1.5 text-sm rounded-lg ${
                    sortBy === "updated" ? "bg-primary text-primary-foreground" : "border border-border"
                  }`}
                >
                  Recently Updated
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <ToolCardSkeleton key={i} />
            ))}
          </div>
        ) : tools && tools.length > 0 ? (
          <>
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
            <p className="text-muted-foreground mb-4">No tools found for this category.</p>
            <Link to="/submit" className="text-primary underline">
              Submit a tool
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
