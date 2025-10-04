import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Search } from "lucide-react";

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

  const filteredProfessions = professions?.filter((prof) =>
    prof.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProfessions.map((profession) => (
              <Card
                key={profession.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <CardTitle>
                    <Link to={`/category/${profession.slug}`}>
                      {profession.name}
                    </Link>
                  </CardTitle>
                </CardHeader>
              </Card>
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