import { AppLayout } from "@/components/system/AppLayout";

export function AboutPage() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">About AI Tools List</h1>
          <p className="text-muted-foreground leading-relaxed">
            AI Tools List is a comprehensive directory helping professionals discover
            reliable, free AI tools. We provide transparent information about pricing,
            usage limits, and tool capabilities across various professions.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              <strong>Data Collection:</strong> We collect minimal data necessary to
              provide our service, including tool preferences and usage patterns.
            </p>
            <p>
              <strong>Cookies & Storage:</strong> We use localStorage to save your
              preferences and improve your experience.
            </p>
            <p>
              <strong>Third-Party Services:</strong> We use Supabase for data storage
              and may display advertisements through AdMob.
            </p>
            <p>
              <strong>Data Security:</strong> Your data is encrypted and stored securely.
              We never sell your personal information.
            </p>
            <p>
              <strong>Your Rights:</strong> You can request data deletion or export at
              any time by contacting us.
            </p>
            <p className="pt-4">
              <strong>Contact:</strong> For privacy concerns, email support@aitoolslist.app
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              By using AI Tools List, you agree to use the service responsibly and
              acknowledge that tool information is provided as-is. We make reasonable
              efforts to keep information accurate but cannot guarantee completeness.
            </p>
            <p>
              Users must be 13+ years old to use this service. If under 18, parental
              consent is required.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
