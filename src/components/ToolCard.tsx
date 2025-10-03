import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { StarRating } from "./StarRating";

interface ToolCardProps {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  free_tier: boolean;
  free_limit?: string;
  rating: number;
  reviews_count: number;
  website_url?: string;
}

export function ToolCard({
  id,
  name,
  description,
  logo_url,
  free_tier,
  free_limit,
  rating,
  reviews_count,
  website_url,
}: ToolCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            {logo_url && (
              <img
                src={logo_url}
                alt={`${name} logo`}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{name}</CardTitle>
              <div className="flex items-center gap-1 mt-1">
                <StarRating rating={rating} size={16} />
                <span className="text-xs text-muted-foreground">
                  ({reviews_count})
                </span>
              </div>
            </div>
          </div>
          {free_tier && (
            <Badge variant="secondary" className="shrink-0">
              Free
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {description && (
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        )}
        {free_limit && (
          <p className="text-xs text-muted-foreground">
            Free limit: {free_limit}
          </p>
        )}
        <div className="flex gap-2">
          <Button asChild className="flex-1" size="sm">
            <Link to={`/tool/${id}`}>View Details</Link>
          </Button>
          {website_url && (
            <Button asChild variant="outline" size="sm">
              <a href={website_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}