export default function Terms() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {new Date().toISOString().slice(0, 10)}
        </p>

        <div className="prose prose-invert mt-10 max-w-none">
          <p>
            This website is operated by LoadFrame Systems. By accessing or using the site, you agree
            to these Terms &amp; Conditions.
          </p>

          <h2>1. Services</h2>
          <p>
            We may provide a structured diagnostic study and related deliverables. Any descriptions
            are provided for informational purposes and do not constitute a guarantee of outcomes.
          </p>

          <h2>2. User Submissions</h2>
          <p>
            If you submit information through forms, you represent that the information is accurate
            and that you have the right to provide it.
          </p>

          <h2>3. No Warranties</h2>
          <p>
            The site and services are provided “as is” and “as available” without warranties of any
            kind, express or implied.
          </p>

          <h2>4. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, LoadFrame Systems will not be liable for any
            indirect, incidental, special, consequential, or punitive damages.
          </p>

          <h2>5. Payments &amp; Refunds</h2>
          <p>
            If purchases are offered, payment terms and any refund policy will be presented at
            checkout or in writing.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            All site content, trademarks, and materials are owned by LoadFrame Systems or licensors.
            You may not copy, distribute, or create derivative works without permission.
          </p>

          <h2>7. Termination</h2>
          <p>
            We may suspend or terminate access to the site for any reason, including violations of
            these terms.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These terms are governed by the laws applicable to the operator’s jurisdiction.
          </p>

          <h2>9. Contact</h2>
          <p>
            Questions:{" "}
            <a href="mailto:audit@loadframesystems.com">audit@loadframesystems.com</a>
          </p>

          <p className="text-sm text-muted-foreground">
            NOTE: This is a placeholder template. Have legal counsel review before relying on it.
          </p>
        </div>
      </div>
    </main>
  );
}
