import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, ChevronRight } from "lucide-react";
import { ToolCardSkeleton } from "@/components/skeletons/ToolCardSkeleton";
import { ErrorState } from "@/components/ErrorState";

export default function Collections() {
  const { data: collections, isLoading, error, refetch } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select(`
          *,
          collection_items(count)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout title="Curated Collections">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Curated Collections</h1>
          <p className="text-muted-foreground">
            Handpicked AI tool lists for every profession and use case
          </p>
        </div>

        {error ? (
          <ErrorState
            type="network"
            onRetry={() => refetch()}
          />
        ) : isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <ToolCardSkeleton key={i} />
            ))}
          </div>
        ) : collections && collections.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <Link key={collection.id} to={`/collection/${collection.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer group">
                  {collection.cover_url && (
                    <div className="w-full h-32 bg-gradient-primary rounded-t-lg" />
                  )}
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FolderOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base group-hover:text-primary transition-colors">
                          {collection.name}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-2">
                          {(collection.collection_items as any)?.[0]?.count || 0} tools
                        </Badge>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardHeader>
                  {collection.description && (
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {collection.description}
                      </p>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
              <p className="text-sm text-muted-foreground">
                Check back soon for curated tool lists
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
