import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, HelpCircle, Mail, ExternalLink } from "lucide-react";

export default function About() {
  return (
    <Layout title="About">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">About AI Tools List</h1>
          <p className="text-muted-foreground">
            Your trusted directory for discovering free AI tools
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              AI Tools List helps professionals discover, compare, and make informed decisions
              about AI tools. We provide transparent information about pricing, usage limits,
              and capabilities so you can find the perfect tool for your needs.
            </p>
            <p>
              Whether you're a data analyst, developer, designer, marketer, or student,
              we've curated tools specifically for your profession with detailed guides
              and workflows to get you started quickly.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We respect your privacy. We only collect essential data to improve your
              experience, such as favorited tools and usage statistics. Your data is
              never sold to third parties.
            </p>
            <Button variant="outline" asChild>
              <Link to="/privacy-policy">
                Read Full Privacy Policy
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Help & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Frequently Asked Questions</h4>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm">How do I submit a new tool?</p>
                  <p className="text-sm text-muted-foreground">
                    Visit the Submit page and fill out the form with tool details. We review
                    all submissions before adding them to the directory.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm">Are all tools really free?</p>
                  <p className="text-sm text-muted-foreground">
                    Tools marked with 🟢 Free have a free tier. We clearly display usage
                    limits and whether login is required. Some have paid upgrades for
                    additional features.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm">How often is information updated?</p>
                  <p className="text-sm text-muted-foreground">
                    We verify tool details regularly and rely on community feedback. If
                    you notice outdated information, please report it on the tool's detail
                    page.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Have questions, feedback, or want to report an issue? We'd love to hear from you.
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>General Inquiries:</strong> hello@aitoolslist.app
              </p>
              <p>
                <strong>Tool Submissions:</strong> submit@aitoolslist.app
              </p>
              <p>
                <strong>Support:</strong> support@aitoolslist.app
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Like AI Tools List?</h3>
                <p className="text-sm text-muted-foreground">
                  Help us grow by rating the app
                </p>
              </div>
              <Button asChild>
                <a
                  href="https://play.google.com/store/apps/details?id=app.lovable.6d6ef95b79434044814ce44ec5423c6d"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Rate on Play Store
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
