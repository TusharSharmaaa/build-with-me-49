import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { ToolCard } from "@/components/ToolCard";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: tools, isLoading } = useQuery({
    queryKey: ["search-tools", searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      
      const { data, error } = await supabase
        .from("ai_tools")
        .select("*")
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .order("rating", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: searchQuery.length > 2,
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Search AI Tools</h1>
          <p className="text-muted-foreground">
            Find the perfect tool for your needs
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>

        {searchQuery.length > 2 && (
          <>
            {isLoading ? (
              <p className="text-center text-muted-foreground">Searching...</p>
            ) : tools && tools.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Found {tools.length} tool{tools.length !== 1 ? "s" : ""}
                </p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tools.map((tool) => (
                    <ToolCard key={tool.id} {...tool} />
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No tools found matching "{searchQuery}"
                </CardContent>
              </Card>
            )}
          </>
        )}

        {searchQuery.length <= 2 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Enter at least 3 characters to search
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}