import { BookOpen, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ToolDetailedInfoProps {
  toolName: string;
  category?: string | null;
}

export function ToolDetailedInfo({ toolName, category }: ToolDetailedInfoProps) {
  const getUseCases = () => {
    return [
      "Automate repetitive tasks and save time",
      "Generate high-quality content quickly",
      "Analyze data and extract insights",
      "Enhance creativity with AI assistance",
      "Improve productivity across workflows"
    ];
  };

  const getTips = () => {
    return [
      "Start with the free tier to explore all features",
      "Use clear and specific prompts for best results",
      "Experiment with different settings to find what works",
      "Save your frequently used configurations",
      "Check for updates and new features regularly"
    ];
  };

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Detailed Tabs */}
      <Tabs defaultValue="use-cases" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto gap-2">
          <TabsTrigger value="use-cases" className="text-xs md:text-sm py-2.5 md:py-3">
            <BookOpen className="h-4 w-4 mr-1.5 md:mr-2" />
            Use Cases
          </TabsTrigger>
          <TabsTrigger value="tips" className="text-xs md:text-sm py-2.5 md:py-3">
            <Lightbulb className="h-4 w-4 mr-1.5 md:mr-2" />
            Pro Tips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="use-cases" className="mt-4 md:mt-5">
          <Card className="card-premium">
            <CardHeader className="p-4 md:p-5">
              <CardTitle className="text-sm md:text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Common Use Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-5 pt-0">
              <ul className="space-y-2.5 md:space-y-3">
                {getUseCases().map((useCase, idx) => (
                  <li key={idx} className="flex gap-2.5 md:gap-3 items-start p-2.5 md:p-3 rounded-lg bg-muted/30">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-xs flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs md:text-sm leading-relaxed flex-1 min-w-0">{useCase}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="mt-4 md:mt-5">
          <Card className="card-premium">
            <CardHeader className="p-4 md:p-5">
              <CardTitle className="text-sm md:text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-accent" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-5 pt-0">
              <ul className="space-y-2.5 md:space-y-3">
                {getTips().map((tip, idx) => (
                  <li key={idx} className="flex gap-2.5 md:gap-3 items-start p-2.5 md:p-3 rounded-lg bg-accent/5 border border-accent/10">
                    <Lightbulb className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-xs md:text-sm leading-relaxed">{tip}</p>
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
