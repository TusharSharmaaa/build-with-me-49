import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ArrowLeft, ExternalLink, Heart, Share2 } from "lucide-react";
import { AppLayout } from "@/components/system/AppLayout";
import { supabase, withRetry, isSupabaseConfigured } from "@/lib/supabase-service";
import { trackEvent } from "@/lib/simple-analytics";
import { trackDetailView, shouldShowInterstitial } from "@/lib/simple-ads";

export function ToolDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    trackEvent("view_tool_detail", { tool_id: id });
    trackDetailView();
    
    // Check if interstitial should show
    if (shouldShowInterstitial()) {
      setShowInterstitial(true);
    }
  }, [id]);

  const { data: tool, isLoading } = useQuery({
    queryKey: ["tool", id],
    queryFn: () =>
      withRetry(() =>
        supabase
          .from("ai_tools")
          .select("*")
          .eq("id", id)
          .single()
          .then((res) => {
            if (res.error) throw res.error;
            return res.data;
          })
      ),
    enabled: isSupabaseConfigured() && !!id,
  });

  const { data: relatedTools } = useQuery({
    queryKey: ["related", tool?.category, id],
    queryFn: () =>
      withRetry(() =>
        supabase
          .from("ai_tools")
          .select("*")
          .eq("category", tool?.category)
          .neq("id", id)
          .order("rating", { ascending: false })
          .limit(6)
          .then((res) => {
            if (res.error) throw res.error;
            return res.data;
          })
      ),
    enabled: isSupabaseConfigured() && !!tool?.category,
  });

  const handleShare = async () => {
    if (navigator.share && tool) {
      try {
        await navigator.share({
          title: tool.name,
          text: tool.description || `Check out ${tool.name}`,
          url: window.location.href,
        });
        trackEvent("share_tool", { tool_id: id });
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const toggleFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please sign in to add favorites");
      return;
    }

    if (isFavorited) {
      await withRetry(() =>
        supabase
          .from("favorites")
          .delete()
          .eq("tool_id", id)
          .eq("user_id", user.id)
          .then((res) => {
            if (res.error) throw res.error;
            return res;
          })
      );
      setIsFavorited(false);
    } else {
      await withRetry(() =>
        supabase.from("favorites").insert({ tool_id: id, user_id: user.id }).then((res) => {
          if (res.error) throw res.error;
          return res;
        })
      );
      setIsFavorited(true);
    }
  };

  if (!isSupabaseConfigured()) {
    return <AppLayout><div className="text-center py-12">Configuration Missing</div></AppLayout>;
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <div className="h-12 bg-muted rounded-xl animate-pulse" />
          <div className="h-64 bg-muted rounded-2xl animate-pulse" />
        </div>
      </AppLayout>
    );
  }

  if (!tool) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Tool not found</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Interstitial Ad Modal */}
      {showInterstitial && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-semibold mb-2">Advertisement</h3>
            <div className="h-48 bg-muted/30 rounded-lg flex items-center justify-center mb-4">
              <p className="text-muted-foreground text-sm">Simulated ad</p>
            </div>
            <button
              onClick={() => setShowInterstitial(false)}
              className="w-full h-10 bg-primary text-primary-foreground rounded-lg font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="border border-border rounded-2xl p-6 space-y-6">
          {/* Header */}
          <div className="flex gap-4">
            {tool.logo_url && (
              <img
                src={tool.logo_url}
                alt={`${tool.name} logo`}
                className="w-16 h-16 rounded-xl object-cover border border-border"
                loading="lazy"
              />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{tool.name}</h1>
              <div className="flex items-center gap-2 text-sm">
                <span>⭐ {(tool.rating || 0).toFixed(1)}</span>
                <span className="text-muted-foreground">({tool.reviews_count || 0} reviews)</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {tool.description && (
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-muted-foreground">{tool.description}</p>
            </div>
          )}

          {/* Profession Tags */}
          {tool.profession_tags && tool.profession_tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Best For</h3>
              <div className="flex flex-wrap gap-2">
                {tool.profession_tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-muted rounded-lg text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          <div>
            <h3 className="font-semibold mb-2">Pricing & Limits</h3>
            <div className="space-y-2">
              {tool.free_tier && (
                <div className="inline-block px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium">
                  ✓ Free Tier Available
                </div>
              )}
              {tool.free_limit && (
                <p className="text-sm"><strong>Free limit:</strong> {tool.free_limit}</p>
              )}
              {tool.pricing_model && (
                <p className="text-sm"><strong>Model:</strong> {tool.pricing_model}</p>
              )}
              {tool.pricing_note && (
                <p className="text-sm text-muted-foreground">{tool.pricing_note}</p>
              )}
            </div>
          </div>

          {/* Features */}
          {tool.features && tool.features.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Key Features</h3>
              <ul className="space-y-1.5">
                {tool.features.map((feature: string, idx: number) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pros & Cons */}
          {((tool.pros && tool.pros.length > 0) || (tool.cons && tool.cons.length > 0)) && (
            <div className="grid md:grid-cols-2 gap-4">
              {tool.pros && tool.pros.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-green-600 dark:text-green-400">✓ Pros</h3>
                  <ul className="space-y-1.5">
                    {tool.pros.map((pro: string, idx: number) => (
                      <li key={idx} className="text-sm">{pro}</li>
                    ))}
                  </ul>
                </div>
              )}
              {tool.cons && tool.cons.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-red-600 dark:text-red-400">✗ Cons</h3>
                  <ul className="space-y-1.5">
                    {tool.cons.map((con: string, idx: number) => (
                      <li key={idx} className="text-sm">{con}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Sample Prompts */}
          {tool.sample_prompts && tool.sample_prompts.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Sample Prompts</h3>
              <div className="space-y-2">
                {tool.sample_prompts.map((prompt: string, idx: number) => (
                  <div key={idx} className="p-3 bg-muted rounded-lg text-sm flex items-start justify-between gap-2">
                    <code className="flex-1">{prompt}</code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(prompt);
                        trackEvent("copy_prompt", { tool_id: id });
                      }}
                      className="text-primary hover:text-primary/80 text-xs font-medium"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Use Cases */}
          {tool.use_cases && tool.use_cases.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Use Cases</h3>
              <div className="flex flex-wrap gap-2">
                {tool.use_cases.map((useCase: string) => (
                  <span key={useCase} className="px-3 py-1 bg-accent rounded-lg text-sm">
                    {useCase}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {tool.tips && tool.tips.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">💡 Tips</h3>
              <ul className="space-y-1.5">
                {tool.tips.map((tip: string, idx: number) => (
                  <li key={idx} className="text-sm text-muted-foreground">{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {tool.website_url && (
              <a
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-11 px-4 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-sm font-medium hover:bg-primary/90 transition-colors active:scale-98"
                onClick={() => trackEvent("click_open_website", { tool_id: id })}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Website
              </a>
            )}
            <button
              onClick={toggleFavorite}
              className={`h-11 w-11 rounded-lg border flex items-center justify-center transition-all active:scale-95 ${
                isFavorited
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-accent"
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleShare}
              className="h-11 w-11 rounded-lg border border-border hover:bg-accent flex items-center justify-center transition-all active:scale-95"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Related Tools */}
        {relatedTools && relatedTools.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Related Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTools.map((relatedTool) => (
                <button
                  key={relatedTool.id}
                  onClick={() => navigate(`/tool/${relatedTool.id}`)}
                  className="border border-border rounded-xl p-4 hover:bg-accent transition-colors text-left"
                >
                  <div className="flex gap-3 items-start">
                    {relatedTool.logo_url && (
                      <img
                        src={relatedTool.logo_url}
                        alt={relatedTool.name}
                        className="w-12 h-12 rounded-lg object-cover border border-border"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium mb-1 truncate">{relatedTool.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedTool.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span>⭐ {(relatedTool.rating || 0).toFixed(1)}</span>
                        {relatedTool.free_tier && (
                          <span className="text-green-600 dark:text-green-400">Free</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
