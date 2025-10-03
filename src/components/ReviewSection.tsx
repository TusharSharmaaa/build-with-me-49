import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./StarRating";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface ReviewSectionProps {
  toolId: string;
}

export function ReviewSection({ toolId }: ReviewSectionProps) {
  const [user, setUser] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", toolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("tool_id", toolId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: userReview } = useQuery({
    queryKey: ["user-review", toolId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("tool_id", toolId)
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const submitReview = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Must be logged in");
      if (rating === 0) throw new Error("Please select a rating");

      const { error } = await supabase.from("reviews").insert({
        tool_id: toolId,
        user_id: user.id,
        rating,
        review_text: reviewText.trim() || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", toolId] });
      queryClient.invalidateQueries({ queryKey: ["user-review", toolId] });
      queryClient.invalidateQueries({ queryKey: ["tool", toolId] });
      setRating(0);
      setReviewText("");
      setIsSubmitting(false);
      toast({ title: "Review submitted successfully!" });
    },
    onError: (error: any) => {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    submitReview.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews & Ratings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {user && !userReview && (
          <form onSubmit={handleSubmit} className="space-y-4 pb-6 border-b">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Your Rating *
              </label>
              <StarRating
                rating={rating}
                interactive
                onRatingChange={setRating}
                size={32}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Your Review (optional)
              </label>
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this tool..."
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {reviewText.length}/500 characters
              </p>
            </div>
            <Button type="submit" disabled={isSubmitting || rating === 0}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        )}

        {userReview && (
          <div className="p-4 bg-muted rounded-lg mb-6">
            <p className="text-sm font-medium mb-2">Your Review</p>
            <StarRating rating={userReview.rating} size={20} />
            {userReview.review_text && (
              <p className="text-sm text-muted-foreground mt-2">
                {userReview.review_text}
              </p>
            )}
          </div>
        )}

        {!user && (
          <div className="text-center p-4 bg-muted rounded-lg mb-6">
            <p className="text-sm text-muted-foreground">
              Log in to leave a review
            </p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold">
            All Reviews ({reviews?.length || 0})
          </h3>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading reviews...</p>
          ) : reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} size={16} />
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {review.review_text && (
                    <p className="text-sm text-muted-foreground">
                      {review.review_text}
                    </p>
                  )}
                  <Separator />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No reviews yet. Be the first to review!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}