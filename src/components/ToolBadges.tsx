import { Badge } from "./ui/badge";
import { Sparkles, TrendingUp, Award } from "lucide-react";

interface ToolBadgesProps {
  featured?: boolean;
  curated?: boolean;
  featuredOrder?: number;
  rating?: number;
  createdAt?: string;
}

export function ToolBadges({ featured, curated, featuredOrder, rating, createdAt }: ToolBadgesProps) {
  const badges = [];
  
  // Editor's Pick (curated)
  if (curated) {
    badges.push(
      <Badge key="curated" className="bg-gradient-primary text-primary-foreground">
        <Award className="mr-1 h-3 w-3" />
        Editor's Pick
      </Badge>
    );
  }
  
  // Featured
  if (featured) {
    badges.push(
      <Badge key="featured" variant="secondary">
        <Sparkles className="mr-1 h-3 w-3" />
        Featured
      </Badge>
    );
  }
  
  // Trending (top rated)
  if (rating && rating >= 4.5) {
    badges.push(
      <Badge key="trending" variant="outline" className="border-accent text-accent">
        <TrendingUp className="mr-1 h-3 w-3" />
        Trending
      </Badge>
    );
  }
  
  // New (created within last 7 days)
  if (createdAt) {
    const createdDate = new Date(createdAt);
    const daysSince = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince <= 7) {
      badges.push(
        <Badge key="new" variant="outline">
          New
        </Badge>
      );
    }
  }
  
  if (badges.length === 0) return null;
  
  return <div className="flex flex-wrap gap-1.5">{badges}</div>;
}
