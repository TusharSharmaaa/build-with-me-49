import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminRole } from "@/hooks/useAdminRole";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Bell, CheckCircle, XCircle, Star } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Admin() {
  const { isAdmin, isLoading: roleLoading } = useAdminRole();
  const queryClient = useQueryClient();
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationBody, setNotificationBody] = useState("");
  const [notificationUrl, setNotificationUrl] = useState("");

  // Fetch pending submissions
  const { data: submissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ["admin-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  // Approve submission mutation
  const approveMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      const { error } = await supabase
        .from("submissions")
        .update({ status: "approved" })
        .eq("id", submissionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });
      toast.success("Submission approved!");
    },
    onError: (error) => {
      toast.error("Failed to approve submission");
      console.error(error);
    },
  });

  // Reject submission mutation
  const rejectMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      const { error } = await supabase
        .from("submissions")
        .update({ status: "rejected" })
        .eq("id", submissionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });
      toast.success("Submission rejected");
    },
    onError: (error) => {
      toast.error("Failed to reject submission");
      console.error(error);
    },
  });

  // Send push notification
  const sendNotificationMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.functions.invoke("send-push-notification", {
        body: {
          title: notificationTitle,
          body: notificationBody,
          url: notificationUrl || "/",
        },
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Push notification sent!");
      setNotificationTitle("");
      setNotificationBody("");
      setNotificationUrl("");
    },
    onError: (error) => {
      toast.error("Failed to send notification");
      console.error(error);
    },
  });

  if (roleLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <Skeleton className="h-32 w-full max-w-md" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage submissions and notifications</p>
          </div>
        </div>

        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="featured">Featured Tools</TabsTrigger>
          </TabsList>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="space-y-4">
            {submissionsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : submissions && submissions.length > 0 ? (
              submissions.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{submission.tool_name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Category: {submission.category}
                        </p>
                      </div>
                      <Badge variant={
                        submission.status === "approved" ? "default" :
                        submission.status === "rejected" ? "destructive" :
                        "secondary"
                      }>
                        {submission.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{submission.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted: {new Date(submission.created_at).toLocaleDateString()}
                    </p>
                    {submission.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate(submission.id)}
                          disabled={approveMutation.isPending}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectMutation.mutate(submission.id)}
                          disabled={rejectMutation.isPending}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No submissions yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Send Push Notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notification-title">Title</Label>
                  <Input
                    id="notification-title"
                    placeholder="New AI Tools Available!"
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notification-body">Message</Label>
                  <Textarea
                    id="notification-body"
                    placeholder="Check out the latest AI tools for developers..."
                    value={notificationBody}
                    onChange={(e) => setNotificationBody(e.target.value)}
                    maxLength={500}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notification-url">URL (optional)</Label>
                  <Input
                    id="notification-url"
                    placeholder="/category/software-developer"
                    value={notificationUrl}
                    onChange={(e) => setNotificationUrl(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => sendNotificationMutation.mutate()}
                  disabled={
                    !notificationTitle ||
                    !notificationBody ||
                    sendNotificationMutation.isPending
                  }
                >
                  Send Notification
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Featured Tools Tab */}
          <TabsContent value="featured">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Featured Tools Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Featured tools management interface coming soon. You can manually
                  update the database to mark tools as featured for now.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
