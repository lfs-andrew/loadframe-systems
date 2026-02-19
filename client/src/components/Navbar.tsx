import { Link } from "wouter";
import { Link as ScrollLink } from "react-scroll";
import { useEffect, useState } from "react";
import logo from "@assets/LoadFrame_Logo_1771423812376.png";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Give it a little hysteresis so tiny scroll nudges don't flap the state
      // (and so it doesn't flicker if you're right at the threshold).
      const y = window.scrollY;

      setIsScrolled((prev) => {
        if (!prev && y > 40) return true;   // turn on after 40px
        if (prev && y < 20) return false;   // turn off only once back under 20px
        return prev;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Methodology", to: "methodology" },
    { name: "Deliverables", to: "deliverables" },
    { name: "Fit", to: "who-its-for" },
  ];

  return (
    <nav
      className={[
        "fixed top-0 left-0 right-0 z-50",
        "border-b transition-colors duration-300",
        // ✅ constant height — no padding changes
        "h-20",
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-border/50"
          : "bg-transparent border-transparent",
      ].join(" ")}
    >
      <div className="container-wide h-full flex items-center justify-between">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="LoadFrame Systems"
            className="h-10 w-auto rounded-sm transition-transform group-hover:rotate-3"
          />
          <span className="font-display font-bold text-xl tracking-tight text-white hidden sm:block">
            LOADFRAME <span className="text-primary/60 font-light">SYSTEMS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <ScrollLink
              key={link.name}
              to={link.to}
              smooth={true}
              duration={500}
              offset={-100}
              className="text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer transition-colors uppercase tracking-wide"
            >
              {link.name}
            </ScrollLink>
          ))}
          <ScrollLink
            to="participate"
            smooth={true}
            duration={500}
            offset={-80} // matches the new fixed header height better
            className="btn-primary flex items-center cursor-pointer"
          >
            Apply to Participate
          </ScrollLink>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground p-2"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen((v) => !v)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border p-4 flex flex-col gap-4 shadow-2xl">
          {navLinks.map((link) => (
            <ScrollLink
              key={link.name}
              to={link.to}
              smooth={true}
              duration={500}
              offset={-100}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-muted-foreground hover:text-primary py-2 cursor-pointer border-b border-border/50 last:border-0"
            >
              {link.name}
            </ScrollLink>
          ))}
          <ScrollLink
            to="participate"
            smooth={true}
            duration={500}
            offset={-80}
            onClick={() => setMobileMenuOpen(false)}
            className="btn-primary w-full flex justify-center items-center mt-2 cursor-pointer"
          >
            Apply to Participate
          </ScrollLink>
        </div>
      )}
    </nav>
  );
}
