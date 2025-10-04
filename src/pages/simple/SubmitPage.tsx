import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/system/AppLayout";
import { supabase, withRetry, isSupabaseConfigured } from "@/lib/supabase-service";
import { trackEvent } from "@/lib/simple-analytics";

export function SubmitPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tool_name: "",
    website_url: "",
    description: "",
    pricing_model: "free",
    free_tier: false,
    free_limit: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tool_name || !formData.website_url) {
      alert("Please fill in required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await withRetry(() =>
        supabase
          .from("submissions")
          .insert({
            ...formData,
            user_id: user?.id || null,
            status: "pending",
          })
          .then((res) => {
            if (res.error) throw res.error;
            return res;
          })
      );

      trackEvent("submit_tool", { tool_name: formData.tool_name });
      alert("Tool submitted successfully! We'll review it soon.");
      navigate("/");
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit tool. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSupabaseConfigured()) {
    return <AppLayout><div className="text-center py-12">Configuration Missing</div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Submit AI Tool</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tool Name *</label>
            <input
              type="text"
              value={formData.tool_name}
              onChange={(e) => setFormData({ ...formData, tool_name: e.target.value })}
              className="w-full h-11 px-4 border border-border rounded-lg bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Website URL *</label>
            <input
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              className="w-full h-11 px-4 border border-border rounded-lg bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full h-24 px-4 py-2 border border-border rounded-lg bg-background resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pricing Model</label>
            <select
              value={formData.pricing_model}
              onChange={(e) => setFormData({ ...formData, pricing_model: e.target.value })}
              className="w-full h-11 px-4 border border-border rounded-lg bg-background"
            >
              <option value="free">Free</option>
              <option value="freemium">Freemium</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.free_tier}
                onChange={(e) => setFormData({ ...formData, free_tier: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Has free tier</span>
            </label>
          </div>

          {formData.free_tier && (
            <div>
              <label className="block text-sm font-medium mb-2">Free Limit</label>
              <input
                type="text"
                value={formData.free_limit}
                onChange={(e) => setFormData({ ...formData, free_limit: e.target.value })}
                placeholder="e.g., 10 prompts/day"
                className="w-full h-11 px-4 border border-border rounded-lg bg-background"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Tool"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
