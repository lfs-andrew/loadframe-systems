import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Layers, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import logo from "@assets/ChatGPT_Image_Feb_18,_2026,_08_51_22_AM_1771422884921.png";
import { Link as ScrollLink } from "react-scroll";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 container-wide">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl"
        >
          <motion.div variants={fadeIn} className="flex items-center gap-2 mb-6">
            <span className="h-px w-12 bg-primary"></span>
            <span className="text-primary font-mono text-xs uppercase tracking-widest">Systemic Risk Analysis</span>
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-display font-bold leading-tight mb-8 text-white">
            Reduce revenue fragility and <span className="text-primary">platform dependence.</span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12 border-l-2 border-primary/30 pl-6">
            LoadFrame stress-tests monetized creator businesses to identify structural weaknesses before algorithmic shifts or market corrections cause collapse.
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
            <ScrollLink 
              to="participate" 
              smooth={true} 
              offset={-50} 
              className="btn-primary flex items-center justify-center gap-2 cursor-pointer"
            >
              Participate in the Study <ArrowRight size={16} />
            </ScrollLink>
            <ScrollLink 
              to="methodology" 
              smooth={true} 
              offset={-100} 
              className="btn-outline flex items-center justify-center cursor-pointer"
            >
              How it works
            </ScrollLink>
          </motion.div>
        </motion.div>
      </section>

      {/* What We Measure Section */}
      <section id="methodology" className="py-24 bg-card border-y border-border relative">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">What We Measure</h2>
              <p className="text-muted-foreground max-w-lg">
                Our audit process analyzes three critical vectors of business stability.
              </p>
            </div>
            <div className="hidden md:block h-px flex-1 bg-border mx-8 mb-2"></div>
            <div className="text-right text-xs font-mono text-primary uppercase tracking-widest">
              Core Metrics
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="w-8 h-8 text-primary" />,
                title: "Revenue Concentration",
                desc: "We analyze income sources to detect dangerous single-point dependencies. If 80% of revenue comes from one sponsor or ad stream, you are fragile."
              },
              {
                icon: <Layers className="w-8 h-8 text-primary" />,
                title: "Platform Dependency",
                desc: "Quantifying your 'Platform Risk Score'. How much of your distribution is owned vs. rented? What happens if your main algorithm changes tomorrow?"
              },
              {
                icon: <ShieldAlert className="w-8 h-8 text-primary" />,
                title: "Offer Architecture",
                desc: "Evaluating the structural integrity of your product ladder. Are you monetizing attention efficiently, or leaving 60% of LTV on the table?"
              }
            ].map((card, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-background border border-border p-8 hover:border-primary/50 transition-colors group"
              >
                <div className="mb-6 p-3 bg-card w-fit border border-border group-hover:border-primary/30 transition-colors">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-display">{card.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables Section */}
      <section id="deliverables" className="py-24 container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary font-mono text-xs uppercase tracking-widest mb-4 block">The Output</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-8">
              Engineered for <br/>
              <span className="text-muted-foreground">Clarity & Action.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We don't provide vague advice. You receive a technical audit document containing specific, calculated metrics about your business health.
            </p>
            
            <ul className="space-y-6">
              {[
                { title: "The Load Map", desc: "Visual representation of your traffic-to-revenue efficiency." },
                { title: "Fragility Index Score", desc: "A single 0-100 metric rating your business's ability to survive shocks." },
                { title: "Structural Risk Findings", desc: "Three prioritized architectural flaws needing immediate remediation." },
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="mt-1 h-2 w-2 bg-primary rotate-45 flex-shrink-0" />
                  <div>
                    <strong className="text-white block font-display text-lg">{item.title}</strong>
                    <span className="text-muted-foreground text-sm">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative h-[500px] w-full bg-card border border-border p-8 flex items-center justify-center overflow-hidden">
            {/* Abstract representation of a report/dashboard */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(197,160,89,0.03)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
            
            <div className="w-full max-w-sm space-y-4 relative z-10">
              <div className="h-4 w-1/3 bg-primary/20 mb-8" />
              <div className="h-32 w-full bg-background border border-border p-4 relative">
                <div className="absolute top-4 right-4 text-primary font-mono text-xs">SCORE: 72/100</div>
                <div className="h-full w-full flex items-end gap-2">
                  <div className="h-[40%] w-1/5 bg-muted" />
                  <div className="h-[60%] w-1/5 bg-muted" />
                  <div className="h-[30%] w-1/5 bg-primary" />
                  <div className="h-[80%] w-1/5 bg-muted" />
                  <div className="h-[50%] w-1/5 bg-muted" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-background border border-border" />
                <div className="h-20 bg-background border border-border" />
              </div>
              <div className="h-4 w-2/3 bg-muted/20" />
              <div className="h-4 w-1/2 bg-muted/20" />
            </div>
            
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary" />
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section id="who-its-for" className="py-24 bg-card border-y border-border">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Is this for you?</h2>
            <p className="text-muted-foreground">We only work with creators where our methodology applies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-background/50 border border-primary/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="text-primary w-6 h-6" />
                <h3 className="text-xl font-bold text-white font-display">The Right Fit</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Generating $50k+ in annual revenue",
                  "Relying on organic content for >60% of leads",
                  "Worried about platform volatility",
                  "Looking to build genuine enterprise value"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-muted-foreground text-sm">
                    <span className="w-1.5 h-1.5 bg-primary mt-2 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background/50 border border-border p-8 opacity-70">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="text-muted-foreground w-6 h-6" />
                <h3 className="text-xl font-bold text-muted-foreground font-display">Not a Fit</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Just starting out (Pre-revenue)",
                  "Looking for 'growth hacks' or viral tricks",
                  "Exclusively paid-ads driven businesses",
                  "Unwilling to share financial data for audit"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-muted-foreground/60 text-sm">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/40 mt-2 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="participate" className="py-24 container-wide">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              Participate in the Study
            </h2>
            <p className="text-muted-foreground text-lg">
              Complete the form below to apply. Selected participants receive a complimentary <span className="text-primary">LoadFrame Fragility Audit</span>.
            </p>
          </div>

          <div className="bg-card border border-border p-6 md:p-10 shadow-2xl shadow-black/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
            <LeadForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
