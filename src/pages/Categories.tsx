import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { Search, Grid3x3 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: professions, isLoading } = useQuery({
    queryKey: ["professions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professions")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  // Get tool counts for each profession
  const { data: toolCounts } = useQuery({
    queryKey: ["profession-tool-counts"],
    queryFn: async () => {
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
    },
  });

  const filteredProfessions = useMemo(() => {
    return professions?.filter((prof) =>
      prof.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [professions, searchQuery]);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Browse by Profession</h1>
          <p className="text-muted-foreground">
            Select your field to discover relevant AI tools
          </p>
        </div>

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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredProfessions && filteredProfessions.length > 0 ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
            {filteredProfessions.map((profession) => (
              <Link
                key={profession.id}
                to={`/category/${profession.slug}`}
                onClick={() => trackEvent('view_category', { category: profession.slug })}
              >
                <Card className="h-full hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Grid3x3 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base mb-1">
                        {profession.name}
                      </CardTitle>
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
          <Card>
            <CardHeader>
              <p className="text-center text-muted-foreground">
                No professions found matching "{searchQuery}"
              </p>
            </CardHeader>
          </Card>
        )}
      </div>
    </Layout>
  );
}