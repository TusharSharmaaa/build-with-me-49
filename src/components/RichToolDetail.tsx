import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  Code, 
  Lock, 
  Globe,
  Copy,
  ImageIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { copyToClipboard } from "@/lib/share";
import { LazyImage } from "./LazyImage";

interface RichToolDetailProps {
  tool: any;
}

export function RichToolDetail({ tool }: RichToolDetailProps) {
  const { toast } = useToast();

  const handleCopyPrompt = (prompt: string) => {
    copyToClipboard(prompt);
    toast({ title: "Prompt copied!" });
  };

  return (
    <div className="space-y-6">
      {/* Quickstart */}
      {tool.quickstart && tool.quickstart.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {tool.quickstart.map((step: string, i: number) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Use Cases */}
      {tool.use_cases && tool.use_cases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Popular Use Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tool.use_cases.map((useCase: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      {tool.features && tool.features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 md:grid-cols-2">
              {tool.features.map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Pros & Cons */}
      {((tool.pros && tool.pros.length > 0) || (tool.cons && tool.cons.length > 0)) && (
        <Card>
          <CardHeader>
            <CardTitle>Pros & Cons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {tool.pros && tool.pros.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Pros
                  </h4>
                  <ul className="space-y-2">
                    {tool.pros.map((pro: string, i: number) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">+</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tool.cons && tool.cons.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Cons
                  </h4>
                  <ul className="space-y-2">
                    {tool.cons.map((con: string, i: number) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-red-600 dark:text-red-400">−</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      {tool.tips && tool.tips.length > 0 && (
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tool.tips.map((tip: string, i: number) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-accent font-bold">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Sample Prompts */}
      {tool.sample_prompts && tool.sample_prompts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sample Prompts</CardTitle>
            <p className="text-sm text-muted-foreground">
              Try these prompts to get started
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {tool.sample_prompts.map((prompt: string, i: number) => (
              <div
                key={i}
                className="p-3 bg-muted rounded-lg flex items-start justify-between gap-3 group"
              >
                <p className="text-sm font-mono flex-1">{prompt}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyPrompt(prompt)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Input/Output Examples */}
      {((tool.input_examples && tool.input_examples.length > 0) || 
        (tool.output_examples && tool.output_examples.length > 0)) && (
        <Card>
          <CardHeader>
            <CardTitle>Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tool.input_examples && tool.input_examples.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Sample Input
                </h4>
                {tool.input_examples.map((example: string, i: number) => (
                  <pre key={i} className="p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                    {example}
                  </pre>
                ))}
              </div>
            )}
            {tool.output_examples && tool.output_examples.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Sample Output
                </h4>
                {tool.output_examples.map((example: string, i: number) => (
                  <pre key={i} className="p-3 bg-accent/10 rounded-lg text-xs overflow-x-auto">
                    {example}
                  </pre>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Screenshots */}
      {tool.screenshots && tool.screenshots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Screenshots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {tool.screenshots.map((screenshot: string, i: number) => (
                <LazyImage
                  key={i}
                  src={screenshot}
                  alt={`${tool.name} screenshot ${i + 1}`}
                  className="w-full rounded-lg border"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy & Security */}
      {(tool.privacy_note || tool.security_note || tool.region_limits) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tool.privacy_note && (
              <div>
                <h4 className="font-semibold text-sm mb-1">Privacy</h4>
                <p className="text-sm text-muted-foreground">{tool.privacy_note}</p>
              </div>
            )}
            {tool.security_note && (
              <div>
                <h4 className="font-semibold text-sm mb-1">Security</h4>
                <p className="text-sm text-muted-foreground">{tool.security_note}</p>
              </div>
            )}
            {tool.region_limits && (
              <div>
                <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Regional Limitations
                </h4>
                <Badge variant="outline">{tool.region_limits}</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
