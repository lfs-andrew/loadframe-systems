import { Link } from "wouter";
import { Link as ScrollLink } from "react-scroll";
import { useState, useEffect } from "react";
import logo from "@assets/ChatGPT_Image_Feb_18,_2026,_08_51_22_AM_1771422884921.png";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Methodology", to: "methodology" },
    { name: "Deliverables", to: "deliverables" },
    { name: "Fit", to: "who-its-for" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-border/50 py-3"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="container-wide flex items-center justify-between">
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="LoadFrame Systems" className="h-10 w-auto rounded-sm" />
          <span className="font-display font-bold text-xl tracking-tight text-white hidden sm:block">
            LoadFrame
          </span>
        </div>

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
            offset={-50}
            className="btn-primary flex items-center cursor-pointer"
          >
            Participate
          </ScrollLink>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
            offset={-50}
            onClick={() => setMobileMenuOpen(false)}
            className="btn-primary w-full flex justify-center items-center mt-2 cursor-pointer"
          >
            Participate
          </ScrollLink>
        </div>
      )}
    </nav>
  );
}
