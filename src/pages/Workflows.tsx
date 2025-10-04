import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Workflow, ChevronRight } from "lucide-react";
import { ToolCardSkeleton } from "@/components/skeletons/ToolCardSkeleton";
import { ErrorState } from "@/components/ErrorState";

export default function Workflows() {
  const { data: workflows, isLoading, error, refetch } = useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workflows")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout title="AI Workflows">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">AI Workflows</h1>
          <p className="text-muted-foreground">
            Step-by-step guides to accomplish tasks using multiple AI tools
          </p>
        </div>

        {error ? (
          <ErrorState type="network" onRetry={() => refetch()} />
        ) : isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <ToolCardSkeleton key={i} />
            ))}
          </div>
        ) : workflows && workflows.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {workflows.map((workflow) => {
              const steps = (workflow.steps as any) || [];
              return (
                <Link key={workflow.id} to={`/workflow/${workflow.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-accent/10">
                          <Workflow className="h-5 w-5 text-accent" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base group-hover:text-primary transition-colors">
                            {workflow.name}
                          </CardTitle>
                          <Badge variant="secondary" className="mt-2">
                            {steps.length} steps
                          </Badge>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      {workflow.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {workflow.description}
                        </p>
                      )}
                      {workflow.professions && workflow.professions.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {workflow.professions.slice(0, 3).map((prof, i) => (
                            <Badge key={i} variant="outline" className="text-xs capitalize">
                              {prof}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Workflow className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No workflows yet</h3>
              <p className="text-sm text-muted-foreground">
                Check back soon for step-by-step AI workflows
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
