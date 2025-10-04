import { ExternalLink, Eye, Sparkles, Zap, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { StarRating } from "./StarRating";

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
    <Card className="card-premium group overflow-hidden">
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* Enhanced Logo */}
          <div className="flex-shrink-0">
            {logo_url ? (
              <div className="relative">
                <img
                  src={logo_url}
                  alt={`${name} logo`}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-border shadow-premium transition-smooth group-hover:scale-110 group-hover:shadow-premium-lg"
                />
                {free_tier && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-accent rounded-full flex items-center justify-center shadow-accent">
                    <Gift className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center border-2 border-border shadow-primary transition-smooth group-hover:scale-110">
                <span className="text-lg font-bold text-primary-foreground">
                  {name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-smooth">
                {name}
              </h3>
              {getPricingBadge()}
            </div>

            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                {description}
              </p>
            )}

            {/* Free Limit Highlight */}
            {free_limit && (
              <div className="mb-3 p-2 bg-accent/10 border border-accent/20 rounded-lg">
                <p className="text-xs font-medium text-accent flex items-center gap-1">
                  <Gift className="h-3 w-3" />
                  Free: {free_limit}
                </p>
              </div>
            )}

            {/* Rating & Category */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <StarRating rating={rating || 0} size={14} />
                <span className="text-xs font-medium text-muted-foreground ml-1">
                  {rating?.toFixed(1)} ({reviews_count})
                </span>
              </div>
              {category && (
                <Badge variant="outline" className="text-xs">
                  {category}
                </Badge>
              )}
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 bg-muted rounded-md text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex gap-2">
        <Button
          asChild
          size="default"
          className="flex-1 bg-gradient-primary hover:shadow-primary transition-smooth"
        >
          <Link to={`/tool/${id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </Button>
        {website_url && (
          <Button
            asChild
            variant="outline"
            size="default"
            className="hover-lift"
          >
            <a href={website_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
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