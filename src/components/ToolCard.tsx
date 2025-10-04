import { ExternalLink, Eye, Sparkles, Zap, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { StarRating } from "./StarRating";
import { ToolBadges } from "./ToolBadges";
import { LazyImage } from "./LazyImage";

interface ToolCardProps {
  id: string;
  name: string;
  description?: string | null;
  logo_url?: string | null;
  free_tier?: boolean | null;
  free_limit?: string | null;
  pricing_note?: string | null;
  rating?: number | null;
  reviews_count?: number | null;
  website_url?: string | null;
  tags?: string[] | null;
  category?: string | null;
  featured?: boolean;
  curated?: boolean;
  featured_order?: number;
  created_at?: string;
  compact?: boolean;
}

export function ToolCard(props: ToolCardProps) {
  const {
    id,
    name,
    description,
    logo_url,
    free_tier,
    free_limit,
    pricing_note,
    rating = 0,
    reviews_count = 0,
    website_url,
    tags,
    category,
    featured = false,
    curated = false,
    featured_order = 0,
    created_at,
    compact = false,
  } = props;

  // Determine pricing badge with icon
  const getPricingBadge = () => {
    if (free_tier && free_limit) {
      return (
        <Badge className="bg-gradient-accent text-accent-foreground shadow-accent gap-1">
          <Gift className="h-3 w-3" />
          Free Tier
        </Badge>
      );
    }
    if (pricing_note?.toLowerCase().includes('free')) {
      return (
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="h-3 w-3" />
          Freemium
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1">
        <Zap className="h-3 w-3" />
        Premium
      </Badge>
    );
  };

  return (
    <Card className={`card-premium group overflow-hidden ${featured ? 'border-2 border-primary shadow-lg' : ''}`}>
      <CardContent className="p-4 md:p-5">
        <div className="flex gap-3 md:gap-4">
          {/* Mobile-Optimized Logo */}
          <div className="flex-shrink-0">
            {logo_url ? (
              <div className="relative">
                <LazyImage
                  src={logo_url}
                  alt={`${name} logo`}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl object-cover border-2 border-border transition-transform group-hover:scale-105"
                />
                {free_tier && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-gradient-accent rounded-full flex items-center justify-center">
                    <Gift className="h-2.5 w-2.5 md:h-3 md:w-3 text-white" />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-primary flex items-center justify-center border-2 border-border transition-transform group-hover:scale-105">
                <span className="text-base md:text-lg font-bold text-primary-foreground">
                  {name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Mobile-Optimized Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1.5 md:mb-2">
              <h3 className="font-bold text-base md:text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                {name}
              </h3>
              {getPricingBadge()}
            </div>

            <ToolBadges
              featured={featured}
              curated={curated}
              featuredOrder={featured_order}
              rating={rating}
              createdAt={created_at}
            />

            {description && (
              <p className={`text-xs md:text-sm text-muted-foreground mb-2 md:mb-3 leading-relaxed ${compact ? 'line-clamp-1' : 'line-clamp-2'}`}>
                {description}
              </p>
            )}

            {/* Free Limit Highlight */}
            {free_limit && (
              <div className="mb-2 md:mb-3 p-1.5 md:p-2 bg-accent/10 border border-accent/20 rounded-lg">
                <p className="text-xs font-medium text-accent flex items-center gap-1">
                  <Gift className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">Free: {free_limit}</span>
                </p>
              </div>
            )}

            {/* Rating & Category */}
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <StarRating rating={rating || 0} size={12} />
                <span className="text-xs font-medium text-muted-foreground ml-0.5">
                  {rating?.toFixed(1)} ({reviews_count})
                </span>
              </div>
              {category && (
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  {category}
                </Badge>
              )}
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex gap-1 mt-1.5 md:mt-2 flex-wrap">
                {tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-1.5 md:px-2 py-0.5 bg-muted rounded text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 md:p-5 pt-0 flex gap-2">
        <Button
          asChild
          size="sm"
          className="flex-1 h-9 md:h-10 text-xs md:text-sm bg-gradient-primary transition-colors"
        >
          <Link to={`/tool/${id}`}>
            <Eye className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
            View Details
          </Link>
        </Button>
        {website_url && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 md:h-10 w-9 md:w-10 p-0 flex-shrink-0 transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <a href={website_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function ToolCardSkeleton() {
  return (
    <Card className="card-premium overflow-hidden">
      <CardContent className="p-5">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-xl shimmer" />
          <div className="flex-1 space-y-3">
            <div className="h-6 shimmer rounded-lg w-3/4" />
            <div className="h-4 shimmer rounded w-full" />
            <div className="h-4 shimmer rounded w-5/6" />
            <div className="flex gap-2 mt-3">
              <div className="h-4 shimmer rounded w-20" />
              <div className="h-4 shimmer rounded w-16" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex gap-2">
        <div className="h-10 shimmer rounded-lg flex-1" />
        <div className="h-10 w-10 shimmer rounded-lg" />
      </CardFooter>
    </Card>
  );
}