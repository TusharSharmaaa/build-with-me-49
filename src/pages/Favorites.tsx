import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart, Grid3x3 } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { ToolCardSkeleton } from "@/components/skeletons/ToolCardSkeleton";
import { withRetry } from "@/lib/network";

export default function Favorites() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const { data: favoriteTools, isLoading } = useQuery({
    queryKey: ["favorite-tools", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      return withRetry(async () => {
        const { data, error } = await supabase
          .from("favorites")
          .select(`
            tool_id,
            ai_tools (*)
          `)
          .eq("user_id", user.id);
        
        if (error) throw error;
        return data.map((fav: any) => fav.ai_tools);
      });
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <Layout title="Favorites">
        <EmptyState
          icon={Heart}
          title="Sign in to save favorites"
          description="Log in to bookmark tools and access them quickly anytime."
          actionLabel="Sign In"
          onAction={() => navigate("/auth")}
        />
      </Layout>
    );
  }

  return (
    <Layout title="Favorites">
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <ToolCardSkeleton key={i} />)}
        </div>
      ) : favoriteTools && favoriteTools.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favoriteTools.map((tool: any) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Browse tools and tap the heart icon to save them here."
          actionLabel="Browse Tools"
          onAction={() => navigate("/categories")}
        />
      )}
    </Layout>
  );
}
