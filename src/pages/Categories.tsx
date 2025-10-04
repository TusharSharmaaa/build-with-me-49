import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Search, Grid3x3 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { Link } from "react-router-dom";
import { CategorySkeleton } from "@/components/skeletons/CategorySkeleton";
import { EmptyState } from "@/components/EmptyState";
import { withRetry } from "@/lib/network";

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: professions, isLoading } = useQuery({
    queryKey: ["professions"],
    queryFn: async () => {
      return withRetry(async () => {
        const { data, error } = await supabase
          .from("professions")
          .select("*")
          .order("name");
        
        if (error) throw error;
        return data;
      });
    },
  });

  const { data: toolCounts } = useQuery({
    queryKey: ["profession-tool-counts"],
    queryFn: async () => {
      return withRetry(async () => {
        const { data, error } = await supabase
          .from("ai_tools")
          .select("profession_tags");
        
        if (error) throw error;
        
        const counts: Record<string, number> = {};
        data.forEach(tool => {
          tool.profession_tags?.forEach((tag: string) => {
            counts[tag] = (counts[tag] || 0) + 1;
          });
        });
        return counts;
      });
    },
  });

  const filteredProfessions = useMemo(() => {
    return professions?.filter((prof) =>
      prof.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [professions, searchQuery]);

  return (
    <Layout title="Categories">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search professions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
            {[...Array(9)].map((_, i) => <CategorySkeleton key={i} />)}
          </div>
        ) : filteredProfessions && filteredProfessions.length > 0 ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
            {filteredProfessions.map((profession) => (
              <Link
                key={profession.id}
                to={`/category/${profession.slug}`}
                onClick={() => trackEvent('view_category', { category: profession.slug })}
              >
                <Card className="h-full hover:shadow-md transition-all cursor-pointer active:scale-95">
                  <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Grid3x3 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">
                        {profession.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {toolCounts?.[profession.slug] || 0} tools
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Grid3x3}
            title="No categories found"
            description={`No professions match "${searchQuery}"`}
          />
        )}
      </div>
    </Layout>
  );
}
