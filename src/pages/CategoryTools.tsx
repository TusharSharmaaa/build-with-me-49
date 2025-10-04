import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { BannerAd } from "@/components/ads/BannerAd";

export default function CategoryTools() {
  const { fieldId } = useParams();

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
        .contains("profession_tags", [fieldId])
        .order("rating", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!fieldId,
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/categories">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {profession?.name || "Loading..."}
            </h1>
            <p className="text-muted-foreground">
              AI tools for {profession?.name?.toLowerCase()}
            </p>
          </div>
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
        ) : tools && tools.length > 0 ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.id} {...tool} />
              ))}
            </div>
            
            {/* Banner Ad at bottom of category page */}
            <BannerAd placement="listing" className="mt-8" />
          </>
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