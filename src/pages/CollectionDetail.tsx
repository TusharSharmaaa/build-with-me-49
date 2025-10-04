import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { ToolCardSkeleton } from "@/components/skeletons/ToolCardSkeleton";
import { ErrorState } from "@/components/ErrorState";

export default function CollectionDetail() {
  const { slug } = useParams();

  const { data: collection, isLoading, error } = useQuery({
    queryKey: ["collection", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: tools, isLoading: toolsLoading } = useQuery({
    queryKey: ["collection-tools", collection?.id],
    queryFn: async () => {
      if (!collection?.id) return [];
      const { data, error } = await supabase
        .from("collection_items")
        .select(`
          rank,
          ai_tools(*)
        `)
        .eq("collection_id", collection.id)
        .order("rank", { ascending: true });
      if (error) throw error;
      return data.map((item: any) => item.ai_tools);
    },
    enabled: !!collection?.id,
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/collections">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div>
            <div className="h-8 w-64 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-96 bg-muted animate-pulse rounded" />
          </div>
        ) : collection ? (
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">{collection.name}</h1>
            {collection.description && (
              <p className="text-muted-foreground text-lg">{collection.description}</p>
            )}
          </div>
        ) : null}

        {error ? (
          <ErrorState type="error" />
        ) : toolsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <ToolCardSkeleton key={i} />
            ))}
          </div>
        ) : tools && tools.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No tools in this collection yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
