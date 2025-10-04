import { BookOpen, DollarSign, TrendingUp, Users, Zap, Shield } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function ValueProposition() {
  const features = [
    {
      icon: DollarSign,
      title: "100% Free Access",
      description: "No hidden costs. Browse all tools and their free tiers without paying a cent.",
      color: "text-accent"
    },
    {
      icon: BookOpen,
      title: "In-Depth Guides",
      description: "Get tutorials, use cases, and pro tips for every tool to maximize your results.",
      color: "text-primary"
    },
    {
      icon: TrendingUp,
      title: "Updated Daily",
      description: "Fresh tool additions and free limit updates so you never miss new opportunities.",
      color: "text-accent"
    },
    {
      icon: Users,
      title: "Community Verified",
      description: "Real reviews from real users. No fake ratings or sponsored placements.",
      color: "text-primary"
    },
    {
      icon: Zap,
      title: "Expert Comparisons",
      description: "Side-by-side tool comparisons to help you choose the perfect AI solution.",
      color: "text-accent"
    },
    {
      icon: Shield,
      title: "Privacy Focused",
      description: "Your data stays yours. We don't track, sell, or share your information.",
      color: "text-primary"
    }
  ];

  return (
    <section className="space-y-4 md:space-y-6 py-6 md:py-8">
      <div className="text-center space-y-2 md:space-y-3">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Why Professionals Choose Us
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          More than just a directory—your complete AI tools knowledge platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {features.map((feature, idx) => (
          <Card key={idx} className="card-premium group cursor-default">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center text-center space-y-2 md:space-y-3">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-primary flex items-center justify-center shadow-primary transition-smooth group-hover:scale-110">
                  <feature.icon className={`h-6 w-6 md:h-7 md:w-7 text-primary-foreground`} />
                </div>
                <h3 className="font-bold text-base md:text-lg leading-tight">{feature.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 pt-4 md:pt-6 text-center">
        <div className="space-y-1">
          <p className="text-2xl md:text-3xl font-bold text-primary">500+</p>
          <p className="text-xs md:text-sm text-muted-foreground">AI Tools Listed</p>
        </div>
        <div className="w-px h-12 bg-border hidden md:block" />
        <div className="space-y-1">
          <p className="text-2xl md:text-3xl font-bold text-accent">50K+</p>
          <p className="text-xs md:text-sm text-muted-foreground">Active Users</p>
        </div>
        <div className="w-px h-12 bg-border hidden md:block" />
        <div className="space-y-1">
          <p className="text-2xl md:text-3xl font-bold text-primary">10K+</p>
          <p className="text-xs md:text-sm text-muted-foreground">Expert Reviews</p>
        </div>
        <div className="w-px h-12 bg-border hidden md:block" />
        <div className="space-y-1">
          <p className="text-2xl md:text-3xl font-bold text-accent">Daily</p>
          <p className="text-xs md:text-sm text-muted-foreground">Updates</p>
        </div>
      </div>
    </section>
  );
}
