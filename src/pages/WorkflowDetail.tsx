import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Lightbulb } from "lucide-react";
import { ErrorState } from "@/components/ErrorState";

export default function WorkflowDetail() {
  const { slug } = useParams();

  const { data: workflow, isLoading, error } = useQuery({
    queryKey: ["workflow", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workflows")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const steps = (workflow?.steps as any) || [];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/workflows">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div>
            <div className="h-8 w-64 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-96 bg-muted animate-pulse rounded" />
          </div>
        ) : error ? (
          <ErrorState type="error" />
        ) : workflow ? (
          <>
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-bold">{workflow.name}</h1>
              {workflow.description && (
                <p className="text-muted-foreground text-lg">{workflow.description}</p>
              )}
              {workflow.professions && workflow.professions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {workflow.professions.map((prof, i) => (
                    <Badge key={i} variant="secondary" className="capitalize">
                      {prof}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {steps.map((step: any, index: number) => (
                <Card key={index} className="relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <CardContent className="py-6 pl-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                          <p className="text-muted-foreground">{step.text}</p>
                        </div>
                        
                        {step.tip && (
                          <div className="flex items-start gap-2 p-3 bg-accent/10 rounded-lg">
                            <Lightbulb className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-accent-foreground">
                              <span className="font-medium">Pro tip:</span> {step.tip}
                            </p>
                          </div>
                        )}
                        
                        {step.tool_id && (
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/tool/${step.tool_id}`}>
                              View Tool →
                            </Link>
                          </Button>
                        )}
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-6 text-center">
                <h3 className="font-semibold mb-2">Ready to try this workflow?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start with step 1 and work your way through
                </p>
                <Button asChild>
                  <Link to="/categories">
                    Explore AI Tools
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </Layout>
  );
}
