import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ToolCard } from "./ToolCard";
import { ToolCardSkeleton } from "./skeletons/ToolCardSkeleton";

interface SimilarToolsProps {
  currentToolId: string;
  category?: string;
  professionTags?: string[];
}

export function SimilarTools({ currentToolId, category, professionTags }: SimilarToolsProps) {
  const { data: similarTools, isLoading } = useQuery({
    queryKey: ["similar-tools", currentToolId, category],
    queryFn: async () => {
      let query = supabase
        .from("ai_tools")
        .select("*")
        .neq("id", currentToolId)
        .limit(4);
      
      // Prefer same category
      if (category) {
        query = query.eq("category", category);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      // If less than 4 results, fetch more without category filter
      if (data && data.length < 4) {
        const { data: moreTools } = await supabase
          .from("ai_tools")
          .select("*")
          .neq("id", currentToolId)
          .order("rating", { ascending: false })
          .limit(4 - data.length);
        
        return [...data, ...(moreTools || [])];
      }
      
      return data;
    },
    enabled: !!currentToolId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Similar Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <ToolCardSkeleton key={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!similarTools || similarTools.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar Tools</CardTitle>
        <p className="text-sm text-muted-foreground">
          Other tools you might find useful
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
          {similarTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} compact />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
