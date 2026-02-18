import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12 md:py-16">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-4">LoadFrame Systems</h3>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Stress-testing monetized creator businesses. We identify architectural weaknesses before they become failures.
            </p>
          </div>
          <div className="md:text-right">
            <h4 className="font-display font-semibold text-white mb-4">Legal</h4>
            <div className="space-y-2">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors block text-sm">
                Privacy Policy
              </Link>
              <a 
                href="mailto:audit@loadframe.systems" 
                className="text-primary hover:text-white transition-colors block text-sm"
              >
                audit@loadframe.systems
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-8">
              &copy; {new Date().getFullYear()} LoadFrame Systems. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
