import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ExternalLink, Heart, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { StarRating } from "@/components/StarRating";
import { ReviewSection } from "@/components/ReviewSection";
import { InterstitialAd } from "@/components/ads/InterstitialAd";
import { useAdFrequency } from "@/hooks/useAdFrequency";
import { ToolDetailedInfo } from "@/components/ToolDetailedInfo";
import { ShareButton } from "@/components/ShareButton";
import { SimilarTools } from "@/components/SimilarTools";
import { ToolBadges } from "@/components/ToolBadges";
import { LazyImage } from "@/components/LazyImage";
import { RichToolDetail } from "@/components/RichToolDetail";
import { ToolSchema } from "@/components/JsonLd";

export default function ToolDetail() {
  const { toolId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);

  // Track tool detail views for interstitial ad
  const {
    shouldShow: shouldShowInterstitial,
    incrementView,
    resetAd
  } = useAdFrequency({
    key: "tool_detail",
    maxViews: 2,
    resetInterval: 1800000 // 30 minutes
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    
    // Increment view count for interstitial ad (only once per page load)
    incrementView();
    
    // Track analytics
    if (toolId) {
      import("@/lib/analytics").then(({ trackEvent }) => {
        trackEvent('view_tool_detail', { tool_id: toolId });
      });
      import("@/lib/ads").then(({ trackDetailView }) => {
        trackDetailView();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolId]); // Only run when toolId changes

  const { data: tool, isLoading } = useQuery({
    queryKey: ["tool", toolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_tools")
        .select("*")
        .eq("id", toolId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: isFavorited } = useQuery({
    queryKey: ["favorite", toolId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("tool_id", toolId)
        .eq("user_id", user.id)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user && !!toolId,
  });

  const toggleFavorite = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Must be logged in");
      
      if (isFavorited) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("tool_id", toolId)
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ tool_id: toolId, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite", toolId] });
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleShare = async () => {
    if (navigator.share && tool) {
      try {
        await navigator.share({
          title: tool.name,
          text: tool.description || `Check out ${tool.name}`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  if (!tool) {
    return (
      <Layout>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Tool not found</p>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <ToolSchema tool={tool} />
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {tool.logo_url && (
                  <LazyImage
                    src={tool.logo_url}
                    alt={`${tool.name} logo`}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <CardTitle className="text-2xl">{tool.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating rating={tool.rating} size={20} />
                    <span className="text-sm text-muted-foreground">
                      ({tool.reviews_count} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <ShareButton
                  toolName={tool.name}
                  description={tool.description || undefined}
                  profession={tool.category || undefined}
                  freeLimit={tool.free_limit || undefined}
                />
                <Button
                  variant={isFavorited ? "default" : "outline"}
                  size="icon"
                  onClick={() => toggleFavorite.mutate()}
                  disabled={!user}
                >
                  <Heart className={isFavorited ? "fill-current" : ""} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ToolBadges
              featured={tool.featured}
              curated={tool.curated}
              rating={tool.rating}
              createdAt={tool.created_at}
            />

            {tool.free_tier && (
              <div className="flex gap-2">
                <Badge variant="secondary">Free Tier Available</Badge>
                {tool.free_limit && (
                  <Badge variant="outline">Limit: {tool.free_limit}</Badge>
                )}
              </div>
            )}

            {tool.description && (
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground">{tool.description}</p>
              </div>
            )}

            {/* Pricing Details */}
            {(tool.pricing_note || tool.pricing_model || tool.pricing_url || tool.rate_limit_note) && (
              <div className="space-y-3">
                <h3 className="font-semibold">Pricing & Limits</h3>
                {tool.pricing_model && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{tool.pricing_model}</Badge>
                  </div>
                )}
                {tool.pricing_note && (
                  <p className="text-sm text-muted-foreground">{tool.pricing_note}</p>
                )}
                {tool.rate_limit_note && (
                  <p className="text-sm">
                    <span className="font-medium">Rate limit:</span> {tool.rate_limit_note}
                  </p>
                )}
                {tool.pricing_url && (
                  <Button asChild variant="outline" size="sm">
                    <a href={tool.pricing_url} target="_blank" rel="noopener noreferrer">
                      View Full Pricing
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            )}

            {/* Modalities */}
            {tool.modalities && tool.modalities.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Supported Modalities</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.modalities.map((modality: string, i: number) => (
                    <Badge key={i} variant="outline" className="capitalize">
                      {modality}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {tool.website_url && (
              <Button asChild className="w-full" size="lg">
                <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
                  Visit Website
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Rich Content Sections */}
        <RichToolDetail tool={tool} />

        <ReviewSection toolId={toolId!} />

        {/* Similar Tools */}
        <SimilarTools
          currentToolId={tool.id}
          category={tool.category || undefined}
          professionTags={tool.profession_tags || undefined}
        />
      </div>

      {/* Interstitial Ad Modal */}
      <InterstitialAd
        isOpen={shouldShowInterstitial}
        onClose={resetAd}
        autoCloseDelay={5000}
      />
    </Layout>
  );
}