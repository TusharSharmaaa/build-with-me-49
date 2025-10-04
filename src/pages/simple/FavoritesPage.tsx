import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/system/AppLayout";
import { ToolCard, ToolCardSkeleton } from "@/components/simple/ToolCard";
import { supabase, withRetry, isSupabaseConfigured } from "@/lib/supabase-service";

export function FavoritesPage() {
  const { data: favorites, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      return withRetry(() =>
        supabase
          .from("favorites")
          .select("tool_id, ai_tools(*)")
          .eq("user_id", user.id)
          .then((res) => {
            if (res.error) throw res.error;
            return res.data?.map((fav: any) => fav.ai_tools).filter(Boolean) || [];
          })
      );
    },
    enabled: isSupabaseConfigured(),
  });

  if (!isSupabaseConfigured()) {
    return <AppLayout><div className="text-center py-12">Configuration Missing</div></AppLayout>;
  }

  return (
    <AppLayout>
      <div>
        <h2 className="text-2xl font-bold mb-6">Favorites</h2>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <ToolCardSkeleton key={i} />
            ))}
          </div>
        ) : favorites && favorites.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((tool: any) => (
              <ToolCard key={tool.id} {...tool} isFavorited={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-4">
              Start exploring and save your favorite AI tools
            </p>
            <Link
              to="/categories"
              className="inline-block px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium"
            >
              Explore Tools
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
