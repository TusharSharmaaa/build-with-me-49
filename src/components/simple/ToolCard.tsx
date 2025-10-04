import { ExternalLink, Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase, withRetry } from "@/lib/supabase-service";
import { trackEvent } from "@/lib/simple-analytics";

interface ToolCardProps {
  id: string;
  name: string;
  description?: string | null;
  logo_url?: string | null;
  free_tier?: boolean | null;
  free_limit?: string | null;
  pricing_model?: string | null;
  rating?: number | null;
  reviews_count?: number | null;
  website_url?: string | null;
  isFavorited?: boolean;
}

export function ToolCard(props: ToolCardProps) {
  const {
    id,
    name,
    description,
    logo_url,
    free_tier,
    free_limit,
    pricing_model,
    rating = 0,
    reviews_count = 0,
    website_url,
    isFavorited: initialFavorited = false,
  } = props;

  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isToggling, setIsToggling] = useState(false);

  const getPricingBadge = () => {
    if (free_tier && free_limit) {
      return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">🟢 Free</span>;
    }
    if (pricing_model === "freemium") {
      return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">🟡 Freemium</span>;
    }
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">🔴 Paid</span>;
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsToggling(true);
    try {
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
        trackEvent("favorite_remove", { tool_id: id });
      } else {
        await withRetry(() =>
          supabase.from("favorites").insert({ tool_id: id, user_id: user.id }).then((res) => {
            if (res.error) throw res.error;
            return res;
          })
        );
        setIsFavorited(true);
        trackEvent("favorite_add", { tool_id: id });
      }
    } catch (error) {
      console.error("Favorite toggle error:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="border border-border rounded-2xl p-4 bg-card hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
      <div className="flex gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg border border-border flex-shrink-0 overflow-hidden bg-muted">
          {logo_url ? (
            <img
              src={logo_url}
              alt={`${name} logo`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg font-bold text-muted-foreground">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-tight line-clamp-1">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            {getPricingBadge()}
            <span className="text-xs text-muted-foreground">
              ⭐ {rating.toFixed(1)} ({reviews_count})
            </span>
          </div>
        </div>
      </div>

      {description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
      )}

      {free_limit && (
        <div className="mb-3 p-2 bg-green-500/5 border border-green-500/20 rounded-lg">
          <p className="text-xs text-green-600 dark:text-green-400">Free: {free_limit}</p>
        </div>
      )}

      <div className="flex gap-2">
        <Link
          to={`/tool/${id}`}
          className="flex-1 h-9 px-3 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Eye className="h-4 w-4 mr-1.5" />
          Details
        </Link>
        <button
          onClick={toggleFavorite}
          disabled={isToggling}
          className={`h-9 w-9 rounded-lg border flex items-center justify-center transition-colors ${
            isFavorited
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border hover:bg-accent"
          }`}
          aria-label="Toggle favorite"
        >
          <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
        </button>
        {website_url && (
          <a
            href={website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 w-9 rounded-lg border border-border hover:bg-accent flex items-center justify-center transition-colors"
            aria-label="Open website"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}

export function ToolCardSkeleton() {
  return (
    <div className="border border-border rounded-2xl p-4 bg-card animate-pulse">
      <div className="flex gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg bg-muted" />
        <div className="flex-1">
          <div className="h-5 bg-muted rounded w-3/4 mb-2" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
      <div className="h-4 bg-muted rounded w-full mb-2" />
      <div className="h-4 bg-muted rounded w-5/6 mb-3" />
      <div className="flex gap-2">
        <div className="h-9 bg-muted rounded-lg flex-1" />
        <div className="h-9 w-9 bg-muted rounded-lg" />
        <div className="h-9 w-9 bg-muted rounded-lg" />
      </div>
    </div>
  );
}
