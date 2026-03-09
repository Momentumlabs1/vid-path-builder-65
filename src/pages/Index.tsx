import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Play, Zap, BarChart3, Users, ArrowRight, CheckCircle2,
  Sparkles, MousePointerClick, GitBranch, Globe, Code2,
  Video, Shield, Rocket, Star, ChevronRight, Brain,
  TrendingDown, Clock, Eye, Target, Heart
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

import heroImage from "@/assets/hero-funnel-dark.png";
import funnelPathsImage from "@/assets/funnel-paths-glow.png";
import interactiveVideoImage from "@/assets/interactive-video-3d.png";
import leadQualifyImage from "@/assets/lead-qualify-visual.png";

/* ── Animation Helpers ── */
function FadeIn({ children, className = "", delay = 0, direction = "up" }: {
  children: React.ReactNode; className?: string; delay?: number; direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const dirs = { up: [40, 0], down: [-40, 0], left: [0, 40], right: [0, -40] };
  const [y, x] = direction === "left" || direction === "right" ? [0, dirs[direction][1]] : [dirs[direction][0], 0];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ScaleIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Funnel Examples ── */
const funnelExamples = [
  {
    title: "Immobilien-Funnel",
    description: "Qualifiziere Käufer automatisch mit Video-Fragen zu Budget, Lage und Objekttyp.",
    nodes: ["Intro-Video", "Kauf oder Miete?", "Budget", "Lage", "Lead Capture", "Danke"],
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    icon: "🏠",
  },
  {
    title: "Coaching-Funnel",
    description: "Führe potenzielle Klienten durch ein Assessment und sammle qualifizierte Leads.",
    nodes: ["Willkommen", "Dein Ziel?", "Erfahrung", "Plan", "Lead Capture", "Buchung"],
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30",
    icon: "💪",
  },
  {
    title: "E-Commerce-Funnel",
    description: "Zeige Produkte interaktiv und leite Kunden zum passenden Angebot.",
    nodes: ["Produktvideo", "Interesse?", "Variante", "Upsell", "Lead Capture", "Shop"],
    color: "from-orange-500/20 to-amber-500/20",
    border: "border-orange-500/30",
    icon: "🛒",
  },
];

/* ── How it works ── */
const steps = [
  { step: "01", title: "Beschreibe deinen Funnel", description: "Sag der KI was du brauchst — oder wähle eine Vorlage. Die KI baut die Grundstruktur in Sekunden.", icon: Sparkles },
  { step: "02", title: "Videos hinzufügen", description: "Lade deine Videos hoch oder verlinke sie. Lege Antwort-Buttons, Multiple Choice oder Slider fest.", icon: Video },
  { step: "03", title: "Pfade verbinden", description: "Verbinde Nodes per Drag & Drop. Erstelle Verzweigungen basierend auf Nutzer-Antworten.", icon: GitBranch },
  { step: "04", title: "Veröffentlichen", description: "Ein Klick — dein Funnel ist live. Bette ihn per Embed-Code auf jeder Website ein.", icon: Globe },
];

/* ── Features ── */
const features = [
  { icon: Sparkles, title: "KI Funnel-Assistent", description: "Beschreibe deinen Funnel in Worten — die KI baut die komplette Struktur automatisch." },
  { icon: MousePointerClick, title: "Drag & Drop Builder", description: "Visueller Editor mit Echtzeit-Vorschau. Nodes verbinden, Videos einbetten, Logik definieren." },
  { icon: GitBranch, title: "Entscheidungspfade", description: "Button, Multiple Choice, Slider — leite Zuschauer zum passenden Inhalt." },
  { icon: Users, title: "Lead Capture", description: "Integrierte Formulare. Leads landen direkt in deinem Dashboard." },
  { icon: BarChart3, title: "Analytics", description: "Verfolge jede Antwort, jeden Pfad und jede Conversion in Echtzeit." },
  { icon: Code2, title: "Embed überall", description: "Ein Script-Tag — fertig. Dein Funnel läuft auf jeder Website." },
  { icon: Shield, title: "DSGVO-konform", description: "Europäische Server. Opt-in-Management und Datenschutz eingebaut." },
  { icon: Zap, title: "API-Integration", description: "Verbinde Funnels mit CRMs, E-Mail-Tools und Webhooks." },
];

/* ── Pricing ── */
const plans = [
  { name: "Free", price: "0€", period: "/Monat", features: ["1 Funnel", "100 Leads/Monat", "KI-Assistent (3x)", "Basis-Analytics", "VidPath-Branding"], cta: "Kostenlos starten", highlighted: false },
  { name: "Pro", price: "29€", period: "/Monat", features: ["Unlimited Funnels", "5.000 Leads/Monat", "KI unlimited", "Custom Branding", "Export Standalone", "Priority Support"], cta: "Pro wählen", highlighted: true },
  { name: "Business", price: "79€", period: "/Monat", features: ["Alles aus Pro", "Team (5 Seats)", "API-Zugriff", "Whitelabel", "Dedicated Support", "Custom Domain"], cta: "Business wählen", highlighted: false },
];

/* ── Animated counter ── */
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (!isInView) return;
    const dur = 2000;
    const numSteps = 60;
    const inc = target / numSteps;
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, dur / numSteps);
    return () => clearInterval(timer);
  }, [target, isInView]);
  return <span ref={ref}>{count.toLocaleString('de-DE')}{suffix}</span>;
}

/* ── Mini Flow Viz ── */
function FunnelFlowViz({ nodes, color }: { nodes: string[]; color: string }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-4">
      {nodes.map((node, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className={`px-2.5 py-1 rounded-md bg-gradient-to-r ${color} text-xs font-medium text-foreground border border-border/30`}>
            {node}
          </div>
          {i < nodes.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
        </div>
      ))}
    </div>
  );
}

export default function Index() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Nav ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border/40 backdrop-blur-xl sticky top-0 z-50 bg-background/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Play className="h-4 w-4 text-primary-foreground fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-primary">Vid</span>Path
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#problem" className="hover:text-foreground transition-colors">Das Problem</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">So funktioniert's</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Preise</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" size="sm">Anmelden</Button></Link>
            <Link to="/signup"><Button size="sm">Kostenlos starten</Button></Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative py-20 sm:py-28 px-4 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-primary/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.03, 0.06, 0.03] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"
          />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-8"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Das Verkaufsgespräch der Zukunft — als Video-Erlebnis
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Dein Verkaufsgespräch.{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Interaktiv. Personalisiert. 24/7.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Verwandle dein bestes Verkaufsgespräch in ein interaktives Video-Erlebnis.
            Jeder Zuschauer wählt seinen eigenen Weg — und bekommt genau die Antworten,
            die ihn zum Abschluss führen.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/signup">
              <Button size="lg" className="text-base px-8 h-12 shadow-lg shadow-primary/20">
                Kostenlos starten <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#problem">
              <Button variant="outline" size="lg" className="text-base px-8 h-12">
                <Play className="mr-2 h-4 w-4" /> Warum das funktioniert
              </Button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-foreground"><AnimatedNumber target={8} /></div>
              <div className="text-sm text-muted-foreground mt-1">Sek. Aufmerksamkeit</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-foreground"><AnimatedNumber target={3} suffix="x" /></div>
              <div className="text-sm text-muted-foreground mt-1">höhere Conversion</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-foreground"><AnimatedNumber target={100} suffix="%" /></div>
              <div className="text-sm text-muted-foreground mt-1">personalisiert</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Visual */}
        <ScaleIn className="max-w-5xl mx-auto mt-16 relative" delay={0.4}>
          <div className="rounded-2xl overflow-hidden border border-border/30 shadow-2xl shadow-primary/10">
            <img
              src={heroImage}
              alt="VidPath Funnel Builder — interaktive Video-Funnels mit Verzweigungspfaden"
              className="w-full h-auto"
              loading="eager"
            />
            {/* Gradient overlay for seamless blend */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40 pointer-events-none" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-primary/30 flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" /> Jeder Zuschauer erlebt seinen eigenen Pfad
          </motion.div>
        </ScaleIn>
      </section>

      {/* ── THE PROBLEM ── */}
      <section id="problem" className="py-24 px-4 relative overflow-hidden">
        {/* Background visual */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]">
          <img src={leadQualifyImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-muted/80 via-muted/90 to-muted/80 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <TrendingDown className="h-3.5 w-3.5" /> Das Problem
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Die Aufmerksamkeit deiner Zielgruppe ist{" "}
              <span className="text-destructive">tot</span>.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              8 Sekunden. So lange hast du, bevor dein Zuschauer weiterscrollt.
              Klassische Videos, Landing Pages und PDFs haben keine Chance mehr.
              <strong className="text-foreground"> Menschen wollen eine Storyline. Sie wollen entertainet werden.</strong>
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { icon: Clock, title: "8 Sekunden", desc: "Die Aufmerksamkeitsspanne ist kürzer als die eines Goldfischs. Passive Inhalte verlieren sofort.", delay: 0 },
              { icon: Eye, title: "95% scrollen weiter", desc: "Klassische Videos werden nach 10 Sek. abgebrochen. Landing Pages haben 70%+ Bounce Rate.", delay: 0.1 },
              { icon: Target, title: "Einheitsbrei konvertiert nicht", desc: "Jeder Kunde hat andere Fragen. Ein Video für alle = für niemanden relevant.", delay: 0.2 },
            ].map((item) => (
              <FadeIn key={item.title} delay={item.delay}>
                <Card className="border-destructive/20 bg-destructive/5 h-full">
                  <CardContent className="pt-6">
                    <item.icon className="h-8 w-8 text-destructive mb-4" />
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>

          {/* Divider */}
          <FadeIn className="relative mb-20">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div>
            <div className="relative flex justify-center">
              <motion.span
                whileInView={{ scale: [0.8, 1.05, 1] }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-background px-6 py-2 rounded-full text-sm font-semibold text-primary border border-primary/20"
              >
                ↓ Die Lösung ↓
              </motion.span>
            </div>
          </FadeIn>

          {/* Solution cards with visual */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                { icon: Heart, title: "Entertainment statt Langeweile", desc: "Menschen wollen eine Storyline. Sie wollen entertainet werden, mitentscheiden, Teil der Geschichte sein. VidPath macht genau das.", delay: 0 },
                { icon: GitBranch, title: "Jeder bekommt seinen Weg", desc: "Durch interaktive Verzweigungen erlebt jeder Zuschauer ein maßgeschneidertes Erlebnis — wie ein persönliches Verkaufsgespräch, aber skalierbar.", delay: 0.1 },
                { icon: Brain, title: "Qualifizierung auf Autopilot", desc: "Jede Antwort verrät dir mehr über deinen Lead. Am Ende weißt du genau, was er will und ob er qualifiziert ist — bevor du einen Finger rührst.", delay: 0.2 },
              ].map((item) => (
                <FadeIn key={item.title} delay={item.delay} direction="left">
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
            <ScaleIn delay={0.2}>
              <div className="relative rounded-2xl overflow-hidden border border-primary/20 shadow-xl shadow-primary/10">
                <img
                  src={interactiveVideoImage}
                  alt="Interaktiver Video-Player mit Antwort-Buttons"
                  className="w-full h-auto"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* ── Comparison ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Vom passiven Zuschauer zum <span className="text-primary">aktiven Teilnehmer</span>
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            <FadeIn delay={0} direction="left">
              <Card className="border-destructive/20 h-full">
                <CardContent className="pt-6">
                  <div className="text-sm font-semibold text-destructive uppercase tracking-wider mb-4">❌ Klassisch</div>
                  <ul className="space-y-4">
                    {["Lineares Video — für alle gleich", "Zuschauer ist passiv, scrollt weiter", "Keine Daten über Interessen", "Lead-Formular am Ende — 90% sind weg", "Jeder bekommt die gleiche Botschaft"].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <TrendingDown className="h-4 w-4 text-destructive mt-0.5 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </FadeIn>
            <FadeIn delay={0.15} direction="right">
              <Card className="border-primary/30 shadow-lg shadow-primary/5 h-full">
                <CardContent className="pt-6">
                  <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">✅ Mit VidPath</div>
                  <ul className="space-y-4">
                    {["Interaktive Pfade — jeder erlebt seinen Weg", "Zuschauer entscheidet aktiv mit", "Jede Antwort = Datenpunkt über den Lead", "Lead Capture fühlt sich natürlich an", "Personalisierte Storyline, die fesselt"].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Fullwidth Visual Break: Funnel Paths ── */}
      <section className="relative py-32 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className="absolute inset-0"
        >
          <img
            src={funnelPathsImage}
            alt="Verzweigungspfade Visualisierung"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background" />
        </motion.div>
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <FadeIn>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Ein Einstieg.<br />
              <span className="text-primary">Unendliche Wege.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Jeder Zuschauer navigiert sich durch seinen individuellen Pfad.
              Du sammelst Daten bei jedem Schritt — und weißt am Ende genau, wer dein Traumkunde ist.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <Rocket className="h-3.5 w-3.5" /> In 4 Schritten zum Funnel
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">So baust du deinen Video-Funnel</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Vom ersten Prompt bis zum eingebetteten Funnel — in wenigen Minuten.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <FadeIn key={s.step} delay={i * 0.1}>
                <div className="relative group">
                  <div className="text-6xl font-bold text-primary/10 mb-4">{s.step}</div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4"
                  >
                    <s.icon className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Alles was du brauchst</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Ein Tool für den gesamten Funnel-Lifecycle — von der KI-Erstellung bis zur Analyse.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.05}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <Card className="border-border/50 bg-card/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full">
                    <CardContent className="pt-6">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <f.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Funnel Examples ── */}
      <section id="examples" className="py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <GitBranch className="h-3.5 w-3.5" /> Fertige Vorlagen
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Funnel-Beispiele</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Starte mit einer Vorlage oder lass die KI deinen individuellen Funnel bauen.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {funnelExamples.map((ex, i) => (
              <FadeIn key={ex.title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
                  <Card className={`${ex.border} bg-card/50 hover:shadow-xl transition-all duration-300 h-full`}>
                    <CardContent className="pt-6">
                      <div className="text-4xl mb-4">{ex.icon}</div>
                      <h3 className="text-lg font-semibold mb-2">{ex.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{ex.description}</p>
                      <FunnelFlowViz nodes={ex.nodes} color={ex.color} />
                      <Link to="/signup" className="block mt-6">
                        <Button variant="outline" size="sm" className="w-full">
                          Diese Vorlage nutzen <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn><h2 className="text-3xl sm:text-4xl font-bold mb-16">Was Nutzer sagen</h2></FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "Mein Verkaufsgespräch läuft jetzt 24/7 — als interaktives Video. Die Leads sind deutlich besser qualifiziert.", name: "Sarah M.", role: "Immobilienmaklerin" },
              { quote: "Die Leute lieben es, selbst zu entscheiden. Die Verweildauer ist 4x höher als bei normalen Videos.", name: "Thomas K.", role: "Online-Coach" },
              { quote: "Embed-Code kopiert, auf meine Seite gesetzt — fertig. Die Conversion hat sich verdreifacht.", name: "Lisa W.", role: "E-Commerce" },
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Card className="border-border/50 bg-card/50 text-left h-full">
                  <CardContent className="pt-6">
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{t.quote}"</p>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Einfache, transparente Preise</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Starte kostenlos. Upgrade wenn dein Business wächst.</p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.1}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <Card className={`relative flex flex-col h-full ${
                    plan.highlighted ? "border-primary shadow-xl shadow-primary/10 scale-[1.02]" : "border-border/50 hover:border-primary/30"
                  }`}>
                    {plan.highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                        Am beliebtesten
                      </div>
                    )}
                    <CardContent className="pt-8 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                      <div className="mb-6">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground text-sm">{plan.period}</span>
                      </div>
                      <ul className="space-y-3 mb-8 flex-1">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />{f}
                          </li>
                        ))}
                      </ul>
                      <Link to="/signup">
                        <Button className="w-full" variant={plan.highlighted ? "default" : "outline"}>{plan.cta}</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]">
          <img src={leadQualifyImage} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background pointer-events-none" />
        <FadeIn className="max-w-3xl mx-auto text-center relative z-10">
          <Sparkles className="h-10 w-10 text-primary mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Dein bestes Verkaufsgespräch — als interaktives Video. Für immer.
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Hör auf, die gleichen Fragen immer wieder zu beantworten.
            Lass dein Video die Arbeit machen — personalisiert, skalierbar, rund um die Uhr.
          </p>
          <Link to="/signup">
            <Button size="lg" className="text-base px-8 h-12 shadow-lg shadow-primary/20">
              Jetzt kostenlos starten <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-4">Keine Kreditkarte nötig · Kostenloser Plan verfügbar</p>
        </FadeIn>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/40 py-12 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                  <Play className="h-3.5 w-3.5 text-primary-foreground fill-current" />
                </div>
                <span className="font-bold"><span className="text-primary">Vid</span>Path</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Das interaktive Verkaufsgespräch als Video — personalisiert, skalierbar, 24/7.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Produkt</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Preise</a></li>
                <li><a href="#examples" className="hover:text-foreground transition-colors">Beispiele</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Konto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/login" className="hover:text-foreground transition-colors">Anmelden</Link></li>
                <li><Link to="/signup" className="hover:text-foreground transition-colors">Registrieren</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Rechtliches</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="cursor-default">Datenschutz</span></li>
                <li><span className="cursor-default">Impressum</span></li>
                <li><span className="cursor-default">AGB</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            © 2026 VidPath. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  );
}
