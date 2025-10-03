import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";

export default function SubmitTool() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    tool_name: "",
    description: "",
    category: "",
    website_url: "",
    free_tier: false,
    free_limit: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && !formData.tool_name) {
      toast({
        title: "Required",
        description: "Tool name is required",
        variant: "destructive",
      });
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    const { error } = await supabase.from("submissions").insert({
      user_id: user.id,
      tool_name: formData.tool_name,
      description: formData.description || null,
      category: formData.category || null,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ 
        title: "Tool submitted successfully!",
        description: "We'll review your submission and add it soon."
      });
      navigate("/profile");
    }
  };

  if (!user) {
    return (
      <Layout>
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground">
              Please log in to submit a tool
            </p>
            <Button asChild>
              <Link to="/auth">Log In</Link>
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2">Submit a Tool</h1>
          <p className="text-muted-foreground">
            Help the community by suggesting new AI tools
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tool Information</CardTitle>
            <p className="text-sm text-muted-foreground">
              Step {step} of 2
            </p>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleNext} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tool_name">Tool Name *</Label>
                  <Input
                    id="tool_name"
                    value={formData.tool_name}
                    onChange={(e) => setFormData({ ...formData, tool_name: e.target.value })}
                    required
                    placeholder="e.g., ChatGPT"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website_url">Website URL</Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Writing, Design, Development"
                    maxLength={50}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Next
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of what the tool does..."
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="free_limit">Free Usage Limit (if any)</Label>
                  <Input
                    id="free_limit"
                    value={formData.free_limit}
                    onChange={(e) => setFormData({ ...formData, free_limit: e.target.value })}
                    placeholder="e.g., 20 messages per day"
                    maxLength={100}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Submitting..." : "Submit Tool"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}