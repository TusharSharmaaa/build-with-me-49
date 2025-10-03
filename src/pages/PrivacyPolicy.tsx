import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              AI Tools List collects minimal information to provide our service:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (email) when you create an account</li>
              <li>Tools you favorite and reviews you submit</li>
              <li>Usage data such as pages visited and search queries</li>
              <li>Device information and browser type for analytics</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our service</li>
              <li>Personalize your experience with saved favorites</li>
              <li>Send notifications about new tools (with your permission)</li>
              <li>Improve our service through analytics</li>
              <li>Display relevant advertisements</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Data Storage and Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your data is securely stored using industry-standard encryption. We implement
              appropriate security measures to protect your personal information from
              unauthorized access, alteration, disclosure, or destruction.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Supabase:</strong> For authentication and data storage</li>
              <li><strong>Google AdMob:</strong> For displaying advertisements</li>
              <li><strong>Analytics:</strong> To understand app usage and improve our service</li>
            </ul>
            <p className="mt-4">
              These services have their own privacy policies and may collect data as described
              in their respective policies.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Cookies and Local Storage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use cookies and local storage to maintain your session, remember your
              preferences, and cache data for offline use. You can control cookie settings
              through your browser preferences.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Push Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              With your explicit permission, we may send push notifications about new AI tools
              and updates. You can disable notifications at any time through your device settings
              or browser preferences.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our service is not directed to children under 13 years of age. We do not knowingly
              collect personal information from children under 13.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
              <li>Export your data</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may update this privacy policy from time to time. We will notify you of any
              changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have questions about this privacy policy or your personal data, please
              contact us through the app settings or via email.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
