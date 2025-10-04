import { ExternalLink, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
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
  } = props;

  // Determine pricing badge
  const getPricingBadge = () => {
    if (free_tier && free_limit) {
      return <Badge className="bg-accent text-accent-foreground">Free</Badge>;
    }
    if (pricing_note?.toLowerCase().includes('free')) {
      return <Badge variant="secondary">Freemium</Badge>;
    }
    return <Badge variant="outline">Paid</Badge>;
  };

  return (
    <Card className="flex flex-col h-full">
      <CardContent className="flex-1 p-4">
        <div className="flex gap-3">
          {/* Logo */}
          <div className="flex-shrink-0">
            {logo_url ? (
              <img
                src={logo_url}
                alt={`${name} logo`}
                className="w-10 h-10 rounded-lg object-cover border border-border"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border">
                <span className="text-sm font-medium text-muted-foreground">
                  {name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-base leading-tight line-clamp-1">
                {name}
              </h3>
              {getPricingBadge()}
            </div>

            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {description}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-1">
              <StarRating rating={rating || 0} size={14} />
              <span className="text-xs text-muted-foreground ml-1">
                ({reviews_count})
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          asChild
          size="sm"
          className="flex-1"
        >
          <Link to={`/tool/${id}`}>
            <Eye className="h-4 w-4 mr-1" />
            Details
          </Link>
        </Button>
        {website_url && (
          <Button
            asChild
            variant="outline"
            size="sm"
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
    <Card className="flex flex-col h-full animate-pulse">
      <CardContent className="flex-1 p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <div className="h-9 bg-muted rounded flex-1" />
        <div className="h-9 w-9 bg-muted rounded" />
      </CardFooter>
    </Card>
  );
}