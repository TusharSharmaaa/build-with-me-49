import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { ToolCard } from "@/components/ToolCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featuredTools, isLoading } = useQuery({
    queryKey: ["featured-tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_tools")
        .select("*")
        .order("rating", { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["professions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professions")
        .select("*")
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">AI Tools List</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover free AI tools tailored to your profession. Find the perfect tools with transparent pricing and usage limits.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button asChild size="lg">
              <Link to="/categories">Browse Categories</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/premium">
                <Sparkles className="mr-2 h-4 w-4" />
                Premium Tools
              </Link>
            </Button>
          </div>
        </section>

        {/* Quick Categories */}
        {categories && categories.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">
                      <Link to={`/category/${category.slug}`}>
                        {category.name}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Featured Tools */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Top Rated Tools</h2>
          </div>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredTools && featuredTools.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredTools.map((tool) => (
                <ToolCard key={tool.id} {...tool} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No tools available yet. Check back soon!
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </Layout>
  );
}