import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { ToolCard } from "@/components/ToolCard";
import { CategoryFilters, FilterOptions } from "@/components/CategoryFilters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { BannerAd } from "@/components/ads/BannerAd";

export default function CategoryTools() {
  const { fieldId } = useParams();
  const [filters, setFilters] = useState<FilterOptions>({
    freeTier: null,
    sortBy: "rating",
  });

  const { data: profession } = useQuery({
    queryKey: ["profession", fieldId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professions")
        .select("*")
        .eq("slug", fieldId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: tools, isLoading } = useQuery({
    queryKey: ["category-tools", fieldId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_tools")
        .select("*")
        .contains("profession_tags", [fieldId]);
      
      if (error) throw error;
      return data;
    },
    enabled: !!fieldId,
  });

  // Apply filters and sorting
  const filteredTools = useMemo(() => {
    if (!tools) return [];

    let filtered = [...tools];

    // Filter by free tier
    if (filters.freeTier !== null) {
      filtered = filtered.filter(tool => tool.free_tier === filters.freeTier);
    }

    // Sort
    switch (filters.sortBy) {
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "recent":
        filtered.sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        break;
    }

    return filtered;
  }, [tools, filters]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/categories">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {profession?.name || "Loading..."}
              </h1>
              <p className="text-sm text-muted-foreground">
                AI tools for {profession?.name?.toLowerCase()}
              </p>
            </div>
          </div>
          
          <CategoryFilters onFilterChange={setFilters} currentFilters={filters} />
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTools && filteredTools.length > 0 ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} {...tool} />
              ))}
            </div>
            
            {/* Banner Ad at bottom of category page */}
            <BannerAd placement="listing" className="mt-8" />
          </>
        ) : tools && tools.length > 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No tools match your filters. Try adjusting them.
              </p>
              <Button onClick={() => setFilters({ freeTier: null, sortBy: "rating" })}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No tools found for this category yet.
              </p>
              <Button asChild>
                <Link to="/submit">Submit a Tool</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}