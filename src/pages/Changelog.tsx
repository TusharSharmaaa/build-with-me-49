import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, Zap, Bug, Shield } from "lucide-react";

const updates = [
  {
    version: "2.0.0",
    date: "2025-10-04",
    changes: [
      { type: "feature", icon: Sparkles, text: "Compare up to 3 AI tools side-by-side" },
      { type: "feature", icon: Plus, text: "Curated Collections of top tools by profession" },
      { type: "feature", icon: Zap, text: "Step-by-step Workflows for common tasks" },
      { type: "feature", icon: Plus, text: "Rich tool details with pros/cons, tips, and samples" },
      { type: "improvement", icon: Zap, text: "Enhanced filtering with modalities and use cases" },
      { type: "improvement", icon: Shield, text: "Improved offline support and caching" },
    ],
  },
  {
    version: "1.5.0",
    date: "2025-09-15",
    changes: [
      { type: "feature", icon: Plus, text: "Favorite tools for quick access" },
      { type: "feature", icon: Plus, text: "Share tools via WhatsApp and native share" },
      { type: "feature", icon: Plus, text: "Search history with quick access chips" },
      { type: "improvement", icon: Zap, text: "Faster load times with lazy loading" },
      { type: "fix", icon: Bug, text: "Fixed scroll position restoration on Android" },
    ],
  },
  {
    version: "1.0.0",
    date: "2025-08-01",
    changes: [
      { type: "feature", icon: Sparkles, text: "Initial release" },
      { type: "feature", icon: Plus, text: "Browse AI tools by profession" },
      { type: "feature", icon: Plus, text: "Filter by pricing and free tier" },
      { type: "feature", icon: Plus, text: "Ratings and reviews system" },
      { type: "feature", icon: Shield, text: "Hindi/English language support" },
    ],
  },
];

const typeConfig = {
  feature: { label: "New", variant: "default" as const, color: "text-green-600 dark:text-green-400" },
  improvement: { label: "Improved", variant: "secondary" as const, color: "text-blue-600 dark:text-blue-400" },
  fix: { label: "Fix", variant: "outline" as const, color: "text-orange-600 dark:text-orange-400" },
};

export default function Changelog() {
  return (
    <Layout title="What's New">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Changelog</h1>
          <p className="text-muted-foreground">
            New features, improvements, and bug fixes
          </p>
        </div>

        <div className="space-y-6">
          {updates.map((update, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Version {update.version}</CardTitle>
                  <Badge variant="outline">{update.date}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {update.changes.map((change, changeIndex) => {
                    const Icon = change.icon;
                    const config = typeConfig[change.type as keyof typeof typeConfig];
                    return (
                      <li key={changeIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <Icon className={`h-4 w-4 ${config.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={config.variant} className="text-xs">
                              {config.label}
                            </Badge>
                            <span className="text-sm">{change.text}</span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-6 text-center">
            <Sparkles className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              We're constantly improving AI Tools List. Check back regularly for new
              features and tool additions!
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
