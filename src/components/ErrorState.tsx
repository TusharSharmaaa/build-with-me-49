import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { WifiOff, AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  type?: "network" | "error";
}

export function ErrorState({
  title,
  description,
  onRetry,
  type = "error"
}: ErrorStateProps) {
  const Icon = type === "network" ? WifiOff : AlertCircle;
  
  const defaultTitle = type === "network" 
    ? "No internet connection"
    : "Something went wrong";
  
  const defaultDescription = type === "network"
    ? "Please check your connection and try again"
    : "We couldn't load this data. Please try again";

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {title || defaultTitle}
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          {description || defaultDescription}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
