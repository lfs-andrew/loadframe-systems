import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-20 font-sans">
      <div className="container-wide max-w-3xl">
        <Link href="/" className="text-primary hover:underline mb-8 inline-block font-mono text-sm">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-display font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">Data Collection</h2>
            <p>
              We collect information provided through our study application form, including name, email, business links, and operational data (revenue ranges, platform usage, and monetization details).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">Purpose of Collection</h2>
            <p>
              This data is collected strictly for the purpose of our structural diagnostic research study and to contact potential participants about their results or follow-up calls.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">Data Storage & Security</h2>
            <p>
              Your information is stored securely in our private database. We do not sell, rent, or share your personal or business data with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3">Your Rights</h2>
            <p>
              You may request the deletion of your data at any time by contacting us at the email provided in the footer of our main site.
            </p>
          </section>

          <section className="pt-8 border-t border-border/40">
            <p className="text-xs font-mono uppercase tracking-widest">
              Last Updated: February 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
