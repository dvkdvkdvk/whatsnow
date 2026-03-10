export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground font-sans">OmniFlow</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground font-sans text-balance mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground font-sans">Last updated: March 10, 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-10 font-sans text-foreground leading-relaxed">

          <section>
            <p className="text-muted-foreground">
              OmniFlow ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our WhatsApp automation platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Account Information</h3>
                <p>When you sign in, we collect your WhatsApp phone number to create and manage your account.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">WhatsApp Business Data</h3>
                <p>When you connect your WhatsApp Business account, we access and store message content, contact information, and conversation history through the Meta WhatsApp Business API in order to provide automation services.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Usage Data</h3>
                <p>We collect information about how you interact with our platform, including automation rules you create, settings you configure, and features you use.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <ul className="space-y-2 text-muted-foreground list-none">
              {[
                "To provide, operate, and maintain our WhatsApp automation platform",
                "To process and respond to WhatsApp messages on your behalf via automations",
                "To authenticate your identity and manage your account",
                "To improve and personalize your experience",
                "To send important service-related notifications",
                "To comply with legal obligations",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. WhatsApp and Meta Data</h2>
            <p className="text-muted-foreground">
              OmniFlow integrates with the Meta WhatsApp Business API. By connecting your WhatsApp Business account, you authorize us to send and receive messages on your behalf. Message data is processed in accordance with Meta's Data Policy and WhatsApp Business Terms of Service. We do not sell your WhatsApp message data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-muted-foreground mb-3">We do not sell, trade, or rent your personal information. We may share information with:</p>
            <ul className="space-y-2 text-muted-foreground list-none">
              {[
                "Meta Platforms, Inc. — as required to operate the WhatsApp Business API",
                "Service providers (e.g. database hosting, analytics) who process data on our behalf under strict confidentiality",
                "Law enforcement or regulatory authorities when required by law",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting us. Message data may be retained for up to 90 days after deletion for legal and compliance purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
            <p className="text-muted-foreground">
              We implement industry-standard security measures including encrypted connections (HTTPS), hashed authentication tokens, and access controls to protect your data. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p className="text-muted-foreground mb-3">Depending on your location, you may have the right to:</p>
            <ul className="space-y-2 text-muted-foreground list-none">
              {[
                "Access the personal data we hold about you",
                "Correct inaccurate or incomplete data",
                "Request deletion of your personal data",
                "Object to or restrict processing of your data",
                "Data portability — receive your data in a structured format",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
            <p className="text-muted-foreground">
              OmniFlow is not intended for use by anyone under the age of 16. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date. Continued use of OmniFlow after changes constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions or concerns about this Privacy Policy or your data, please contact us at:
            </p>
            <div className="mt-4 p-5 bg-secondary rounded-xl border border-border">
              <p className="font-semibold text-foreground">OmniFlow</p>
              <p className="text-muted-foreground mt-1">Email: privacy@omniflow.app</p>
              <p className="text-muted-foreground">Website: https://whatsnow.vercel.app</p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground font-sans">
          <p>© 2026 OmniFlow. All rights reserved.</p>
          <p className="mt-1">
            <a href="/" className="text-primary hover:underline">Back to OmniFlow</a>
          </p>
        </div>
      </div>
    </main>
  )
}
