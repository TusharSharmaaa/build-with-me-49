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

          {/* Pricing */}
          <div>
            <h3 className="font-semibold mb-2">Pricing & Limits</h3>
            <div className="space-y-2">
              {tool.free_tier && (
                <div className="inline-block px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-sm">
                  Free Tier Available
                </div>
              )}
              {tool.free_limit && (
                <p className="text-sm"><strong>Free limit:</strong> {tool.free_limit}</p>
              )}
              {tool.pricing_note && (
                <p className="text-sm text-muted-foreground">{tool.pricing_note}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {tool.website_url && (
              <a
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-11 px-4 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-sm font-medium hover:bg-primary/90"
                onClick={() => trackEvent("click_open_website", { tool_id: id })}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Website
              </a>
            )}
            <button
              onClick={toggleFavorite}
              className={`h-11 w-11 rounded-lg border flex items-center justify-center ${
                isFavorited
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-accent"
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleShare}
              className="h-11 w-11 rounded-lg border border-border hover:bg-accent flex items-center justify-center"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
