import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Share2 } from "lucide-react";
import { LazyImage } from "@/components/LazyImage";
import { useToast } from "@/hooks/use-toast";
import { shareViaNative, copyToClipboard } from "@/lib/share";

export default function Compare() {
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: tools } = useQuery({
    queryKey: ["tools-for-compare"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_tools")
        .select("*")
        .order("rating", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const { data: comparedTools } = useQuery({
    queryKey: ["compared-tools", selectedTools],
    queryFn: async () => {
      if (selectedTools.length === 0) return [];
      const { data, error } = await supabase
        .from("ai_tools")
        .select("*")
        .in("id", selectedTools);
      if (error) throw error;
      return data;
    },
    enabled: selectedTools.length > 0,
  });

  const toggleTool = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      setSelectedTools(selectedTools.filter(id => id !== toolId));
    } else if (selectedTools.length < 3) {
      setSelectedTools([...selectedTools, toolId]);
    } else {
      toast({ title: "Maximum 3 tools", description: "Remove one to add another" });
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/compare?tools=${selectedTools.join(",")}`;
    const shared = await shareViaNative({
      title: "Tool Comparison",
      description: `Compare: ${comparedTools?.map(t => t.name).join(" vs ")}`,
      url,
    });
    if (!shared) {
      copyToClipboard(url);
      toast({ title: "Link copied!" });
    }
  };

  return (
    <Layout title="Compare Tools">
      <div className="space-y-6">
        {/* Tool Selection */}
        {selectedTools.length < 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Select tools to compare ({selectedTools.length}/3)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {tools?.slice(0, 12).map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => toggleTool(tool.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      selectedTools.includes(tool.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {tool.logo_url && (
                      <LazyImage
                        src={tool.logo_url}
                        alt={tool.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {tool.category}
                      </p>
                    </div>
                    {selectedTools.includes(tool.id) && (
                      <X className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comparison Table */}
        {comparedTools && comparedTools.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Comparison</h2>
              <Button onClick={handleShare} variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 border text-left bg-muted font-semibold">Feature</th>
                    {comparedTools.map((tool) => (
                      <th key={tool.id} className="p-3 border text-left min-w-[200px]">
                        <div className="flex items-center gap-2">
                          {tool.logo_url && (
                            <LazyImage
                              src={tool.logo_url}
                              alt={tool.name}
                              className="w-8 h-8 rounded"
                            />
                          )}
                          <span className="font-semibold">{tool.name}</span>
                          <button
                            onClick={() => toggleTool(tool.id)}
                            className="ml-auto text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border font-medium bg-muted">Pricing</td>
                    {comparedTools.map((tool) => (
                      <td key={tool.id} className="p-3 border">
                        <Badge variant={tool.free_tier ? "secondary" : "outline"}>
                          {tool.free_tier ? "🟢 Free Tier" : "🔴 Paid"}
                        </Badge>
                        <p className="text-sm mt-1">{tool.pricing_model || "N/A"}</p>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium bg-muted">Free Limit</td>
                    {comparedTools.map((tool) => (
                      <td key={tool.id} className="p-3 border text-sm">
                        {tool.free_limit || "—"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium bg-muted">Requires Login</td>
                    {comparedTools.map((tool) => (
                      <td key={tool.id} className="p-3 border text-sm">
                        {tool.free_requires_login ? "Yes" : "No"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium bg-muted">Watermark</td>
                    {comparedTools.map((tool) => (
                      <td key={tool.id} className="p-3 border text-sm">
                        {tool.has_watermark ? "Yes" : "No"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium bg-muted">Modalities</td>
                    {comparedTools.map((tool) => (
                      <td key={tool.id} className="p-3 border">
                        <div className="flex flex-wrap gap-1">
                          {tool.modalities?.map((m, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {m}
                            </Badge>
                          )) || "—"}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium bg-muted">Use Cases</td>
                    {comparedTools.map((tool) => (
                      <td key={tool.id} className="p-3 border">
                        <ul className="text-sm space-y-1">
                          {tool.use_cases?.slice(0, 3).map((uc, i) => (
                            <li key={i}>• {uc}</li>
                          )) || <span>—</span>}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium bg-muted">Pros</td>
                    {comparedTools.map((tool) => (
                      <td key={tool.id} className="p-3 border">
                        <ul className="text-sm space-y-1 text-green-600 dark:text-green-400">
                          {tool.pros?.slice(0, 3).map((p, i) => (
                            <li key={i}>+ {p}</li>
                          )) || <span>—</span>}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium bg-muted">Cons</td>
                    {comparedTools.map((tool) => (
                      <td key={tool.id} className="p-3 border">
                        <ul className="text-sm space-y-1 text-red-600 dark:text-red-400">
                          {tool.cons?.slice(0, 3).map((c, i) => (
                            <li key={i}>− {c}</li>
                          )) || <span>—</span>}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium bg-muted">Rating</td>
                    {comparedTools.map((tool) => (
                      <td key={tool.id} className="p-3 border">
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-semibold">{tool.rating?.toFixed(1)}</span>
                          <span className="text-sm text-muted-foreground">
                            ⭐ ({tool.reviews_count})
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium bg-muted">Link</td>
                    {comparedTools.map((tool) => (
                      <td key={tool.id} className="p-3 border">
                        {tool.website_url && (
                          <Button asChild variant="outline" size="sm" className="w-full">
                            <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
                              Visit Website
                            </a>
                          </Button>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {selectedTools.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Start Comparing</h3>
              <p className="text-sm text-muted-foreground">
                Select up to 3 tools to see a side-by-side comparison
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
