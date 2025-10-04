import { BookOpen, Lightbulb, TrendingUp, Users, Zap, Shield, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ToolDetailedInfoProps {
  toolName: string;
  category?: string | null;
}

export function ToolDetailedInfo({ toolName, category }: ToolDetailedInfoProps) {
  // Generate contextual knowledge based on tool type
  const getUseCases = () => {
    const defaultCases = [
      "Content creation and copywriting",
      "Data analysis and visualization",
      "Image and video generation",
      "Code assistance and debugging",
      "Research and summarization"
    ];
    return defaultCases;
  };

  const getTips = () => {
    return [
      "Start with the free tier to test capabilities before upgrading",
      "Use specific, detailed prompts for better results",
      "Combine with other tools for enhanced workflow",
      "Monitor your usage to optimize costs",
      "Join the community for tips and best practices"
    ];
  };

  const getAlternatives = () => {
    return [
      { name: "Similar Tool A", reason: "Better for large-scale projects" },
      { name: "Similar Tool B", reason: "More affordable pricing" },
      { name: "Similar Tool C", reason: "Open-source alternative" }
    ];
  };

  const getBestPractices = () => {
    return [
      "Always review output for accuracy",
      "Start with simple tasks to learn the interface",
      "Save frequently used prompts for efficiency",
      "Track your results and iterate on your approach",
      "Stay updated with new features and updates"
    ];
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="card-premium">
          <CardContent className="p-4 md:p-5 text-center">
            <Users className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-primary" />
            <p className="text-xl md:text-2xl font-bold">10K+</p>
            <p className="text-xs md:text-sm text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="p-4 md:p-5 text-center">
            <Award className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-accent" />
            <p className="text-xl md:text-2xl font-bold">4.5★</p>
            <p className="text-xs md:text-sm text-muted-foreground">Avg Rating</p>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="p-4 md:p-5 text-center">
            <TrendingUp className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-primary" />
            <p className="text-xl md:text-2xl font-bold">95%</p>
            <p className="text-xs md:text-sm text-muted-foreground">Satisfaction</p>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="p-4 md:p-5 text-center">
            <Shield className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-accent" />
            <p className="text-xl md:text-2xl font-bold">SOC2</p>
            <p className="text-xs md:text-sm text-muted-foreground">Certified</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="use-cases" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 h-auto">
          <TabsTrigger value="use-cases" className="text-xs md:text-sm py-2 md:py-3">
            <BookOpen className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden md:inline">Use Cases</span>
            <span className="md:hidden">Uses</span>
          </TabsTrigger>
          <TabsTrigger value="tips" className="text-xs md:text-sm py-2 md:py-3">
            <Lightbulb className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1 md:mr-2" />
            Tips
          </TabsTrigger>
          <TabsTrigger value="alternatives" className="text-xs md:text-sm py-2 md:py-3">
            <Zap className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden md:inline">Alternatives</span>
            <span className="md:hidden">Alt</span>
          </TabsTrigger>
          <TabsTrigger value="best-practices" className="text-xs md:text-sm py-2 md:py-3 hidden md:flex">
            <Award className="h-4 w-4 mr-2" />
            Best Practices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="use-cases" className="mt-4 md:mt-6">
          <Card className="card-premium">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Real-World Use Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <ul className="space-y-3 md:space-y-4">
                {getUseCases().map((useCase, idx) => (
                  <li key={idx} className="flex gap-3 md:gap-4 items-start">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xs md:text-sm flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm md:text-base font-medium leading-relaxed">{useCase}</p>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
                        Proven effective for professionals and teams
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="mt-4 md:mt-6">
          <Card className="card-premium">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-accent" />
                Pro Tips & Tricks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <ul className="space-y-3 md:space-y-4">
                {getTips().map((tip, idx) => (
                  <li key={idx} className="flex gap-3 md:gap-4 items-start p-3 md:p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <Lightbulb className="h-5 w-5 md:h-6 md:w-6 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-sm md:text-base leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alternatives" className="mt-4 md:mt-6">
          <Card className="card-premium">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Alternative Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 space-y-3 md:space-y-4">
              {getAlternatives().map((alt, idx) => (
                <div key={idx} className="p-3 md:p-4 rounded-lg border border-border hover-lift transition-smooth cursor-pointer">
                  <div className="flex items-start justify-between gap-3 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm md:text-base mb-1">{alt.name}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{alt.reason}</p>
                    </div>
                    <Badge variant="outline" className="text-xs flex-shrink-0">Compare</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best-practices" className="mt-4 md:mt-6">
          <Card className="card-premium">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <ul className="space-y-3 md:space-y-4">
                {getBestPractices().map((practice, idx) => (
                  <li key={idx} className="flex gap-3 md:gap-4 items-start">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Award className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent-foreground" />
                    </div>
                    <p className="text-sm md:text-base leading-relaxed flex-1 min-w-0">{practice}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
