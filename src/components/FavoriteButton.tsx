import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  toolId: string;
  variant?: "icon" | "default";
  size?: "sm" | "default" | "lg" | "icon";
  className?: string;
}

export function FavoriteButton({ 
  toolId, 
  variant = "icon", 
  size = "icon",
  className 
}: FavoriteButtonProps) {
  const [user, setUser] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        checkFavorite(user.id);
      }
    });
  }, [toolId]);

  const checkFavorite = async (userId: string) => {
    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("tool_id", toolId)
      .eq("user_id", userId)
      .maybeSingle();
    
    setIsFavorited(!!data);
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to save favorites",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorited) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("tool_id", toolId)
          .eq("user_id", user.id);
        
        if (error) throw error;
        setIsFavorited(false);
        toast({ title: "Removed from favorites" });
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ tool_id: toolId, user_id: user.id });
        
        if (error) throw error;
        setIsFavorited(true);
        toast({ title: "Added to favorites" });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant === "icon" ? "ghost" : "outline"}
      size={size}
      onClick={toggleFavorite}
      disabled={isLoading}
      className={cn(
        "transition-all",
        isFavorited && "text-red-500 hover:text-red-600",
        className
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4",
          isFavorited && "fill-current"
        )}
      />
    </Button>
  );
}
