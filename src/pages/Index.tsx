import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Play, ArrowRight, CheckCircle2, Sparkles, GitBranch, Globe, Code2,
  Video, Star, Brain, TrendingDown, Clock, Eye, Target,
  Heart, MousePointerClick, Users, BarChart3, Zap, Shield, ArrowDown
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

import heroBg from "@/assets/hero-bg-abstract.jpg";
import heroDevice from "@/assets/hero-funnel-dark.png";
import comparisonVisual from "@/assets/comparison-visual.png";
import funnelPathsImage from "@/assets/funnel-paths-glow.png";
import interactiveVideo3d from "@/assets/interactive-video-3d.png";
import leadQualifyVisual from "@/assets/lead-qualify-visual.png";
import phoneMockup from "@/assets/phone-funnel-mockup.png";

/* ── Reusable Animation Wrappers ── */
function FadeUp({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }} className={className}>
      {children}
    </motion.div>
  );
}

function SlideIn({ children, className = "", delay = 0, from = "left" }: { children: React.ReactNode; className?: string; delay?: number; from?: "left" | "right" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: from === "left" ? -60 : 60 }} animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }} className={className}>
      {children}
    </motion.div>
  );
}

function ScaleReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.85 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }} className={className}>
      {children}
    </motion.div>
  );
}

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const inc = target / 60;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 33);
    return () => clearInterval(timer);
  }, [target, inView]);
  return <span ref={ref}>{count.toLocaleString('de-DE')}{suffix}</span>;
}

const plans = [
  { name: "Free", price: "0€", period: "/Monat", features: ["1 Funnel", "100 Leads/Monat", "KI-Assistent (3x)", "Basis-Analytics", "VidPath-Branding"], cta: "Kostenlos starten", highlighted: false },
  { name: "Pro", price: "29€", period: "/Monat", features: ["Unlimited Funnels", "5.000 Leads/Monat", "KI unlimited", "Custom Branding", "Export Standalone", "Priority Support"], cta: "Pro wählen", highlighted: true },
  { name: "Business", price: "79€", period: "/Monat", features: ["Alles aus Pro", "Team (5 Seats)", "API-Zugriff", "Whitelabel", "Dedicated Support", "Custom Domain"], cta: "Business wählen", highlighted: false },
];

export default function Index() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen bg-[hsl(240,10%,4%)] text-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          HERO — Cinematic dark with floating device mockup
      ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col">
        {/* Ambient background — CSS gradient, no image overlap issues */}
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(240,10%,4%)]/70 via-transparent to-[hsl(240,10%,4%)]" />
        </motion.div>

        {/* Nav */}
        <nav className="relative z-20 px-4 sm:px-8 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Play className="h-4 w-4 text-white fill-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">VidPath</span>
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
              <a href="#problem" className="hover:text-white transition-colors">Problem</a>
              <a href="#solution" className="hover:text-white transition-colors">Lösung</a>
              <a href="#demo" className="hover:text-white transition-colors">Demo</a>
              <a href="#pricing" className="hover:text-white transition-colors">Preise</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login"><Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">Anmelden</Button></Link>
              <Link to="/signup"><Button size="sm" className="bg-white text-black hover:bg-white/90">Starten</Button></Link>
            </div>
          </div>
        </nav>

        {/* Hero content — text left, device right */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 flex-1 flex items-center px-4">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-5 gap-8 items-center">
            {/* Left text — 3 cols */}
            <div className="lg:col-span-3">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm text-white/80 text-sm px-4 py-1.5 rounded-full mb-6 border border-white/10">
                <Sparkles className="h-3.5 w-3.5 text-purple-400" /> Interaktive Video-Funnels mit KI
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] mb-6 tracking-tight">
                Dein bestes Verkaufs&shy;gespräch.<br />
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Als interaktives Video.
                </span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
                className="text-lg text-white/50 max-w-xl mb-10 leading-relaxed">
                Jeder Zuschauer wählt seinen eigenen Weg. Jede Antwort qualifiziert deinen Lead.
                Dein Verkaufsgespräch läuft 24/7 — personalisiert und skalierbar.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.65 }}
                className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-white text-black hover:bg-white/90 text-base px-8 h-13 shadow-2xl shadow-white/10">
                    Kostenlos starten <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#demo">
                  <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-base px-8 h-13">
                    <Play className="mr-2 h-4 w-4" /> Demo ansehen
                  </Button>
                </a>
              </motion.div>
            </div>

            {/* Right device — 2 cols, transparent PNG on dark bg = clean */}
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:col-span-2 hidden lg:block">
              <div className="relative">
                {/* Glow behind device */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-cyan-500/20 blur-[80px] rounded-full scale-110" />
                <img src={heroDevice} alt="VidPath Funnel Builder auf Laptop und Smartphone" className="relative w-full h-auto" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="relative z-10 pb-8 flex justify-center">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
            className="text-white/20">
            <ArrowDown className="h-6 w-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2: THE PROBLEM — Stats on dark
      ═══════════════════════════════════════════ */}
      <section id="problem" className="py-32 px-4 bg-[hsl(240,10%,6%)]">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-20">
            <span className="text-sm font-mono uppercase tracking-[0.3em] text-red-400 mb-4 block">Das Problem</span>
            <h2 className="text-4xl sm:text-6xl font-bold leading-tight mb-8">
              Niemand schaut<br />dein Video zu Ende.
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Die Aufmerksamkeitsspanne deiner Zielgruppe ist bei <strong className="text-white">8 Sekunden</strong>.
              Kürzer als die eines Goldfischs. Und du versuchst sie mit einem linearen 3-Minuten-Video zu überzeugen?
            </p>
          </FadeUp>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-24">
            {[
              { num: 95, suffix: "%", label: "brechen nach 10 Sek. ab", icon: Eye },
              { num: 70, suffix: "%", label: "Bounce Rate auf Landing Pages", icon: TrendingDown },
              { num: 8, suffix: "s", label: "Aufmerksamkeitsspanne", icon: Clock },
            ].map((stat, i) => (
              <FadeUp key={stat.label} delay={i * 0.15}>
                <div className="text-center p-6 sm:p-8 rounded-2xl bg-red-500/5 border border-red-500/10">
                  <stat.icon className="h-6 w-6 text-red-400 mx-auto mb-3" />
                  <div className="text-3xl sm:text-5xl font-bold text-red-400 mb-2">
                    <AnimatedNumber target={stat.num} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-white/40">{stat.label}</div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Comparison — clean transparent PNG */}
          <ScaleReveal>
            <div className="relative rounded-2xl overflow-hidden bg-[hsl(240,10%,8%)] border border-white/5 p-8">
              <img src={comparisonVisual} alt="Vergleich: Langweiliges Video vs. interaktiver VidPath Funnel" className="w-full h-auto" loading="lazy" />
            </div>
            <div className="grid grid-cols-2 mt-4 text-center text-sm">
              <span className="text-white/30">❌ Klassisches Video — passiv, langweilig</span>
              <span className="text-purple-400 font-medium">✅ VidPath — interaktiv, fesselnd</span>
            </div>
          </ScaleReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3: THE SHIFT — Full-bleed cinematic image
      ═══════════════════════════════════════════ */}
      <section className="relative py-40 overflow-hidden">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.5 }}
          viewport={{ once: true }} className="absolute inset-0">
          <img src={funnelPathsImage} alt="" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(240,10%,6%)] via-black/40 to-[hsl(240,10%,4%)]" />
        </motion.div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <FadeUp>
            <span className="text-sm font-mono uppercase tracking-[0.3em] text-purple-400 mb-6 block">Der Wandel</span>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8">
              Menschen wollen keine<br />Videos schauen.<br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Sie wollen Geschichten erleben.
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-white/40 max-w-2xl mx-auto">
              Sie wollen entertainet werden. Mitentscheiden. Teil der Story sein.
              VidPath macht dein Verkaufsgespräch genau dazu.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4: SOLUTION — Alternating features with distinct visuals
      ═══════════════════════════════════════════ */}
      <section id="solution" className="py-32 px-4 bg-[hsl(240,10%,4%)]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-24">
            <span className="text-sm font-mono uppercase tracking-[0.3em] text-purple-400 mb-4 block">Die Lösung</span>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Ein Verkaufsgespräch,<br />das sich anfühlt wie Netflix.
            </h2>
          </FadeUp>

          {/* Feature 1: Interactive Storyline — phone mockup right */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <SlideIn from="left">
              <div>
                <div className="inline-flex items-center gap-2 text-purple-400 text-sm font-medium mb-4">
                  <Heart className="h-4 w-4" /> Storyline statt Monolog
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">Jeder Zuschauer wird zum Hauptdarsteller</h3>
                <p className="text-white/50 text-lg leading-relaxed mb-6">
                  Dein Zuschauer klickt, wählt, entscheidet — und bekommt im nächsten Video genau die Antwort,
                  die auf <em className="text-white/70">seine</em> Situation passt. Das fühlt sich nicht wie Marketing an.
                  Das fühlt sich wie ein echtes Gespräch an.
                </p>
                <ul className="space-y-3">
                  {["Personalisierte Pfade statt Einheitsbrei", "Jede Antwort = qualifizierter Datenpunkt", "Bis zu 3x höhere Watch-Time"].map((t) => (
                    <li key={t} className="flex items-center gap-3 text-sm text-white/70">
                      <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />{t}
                    </li>
                  ))}
                </ul>
              </div>
            </SlideIn>
            <SlideIn from="right" delay={0.15}>
              <div className="relative flex justify-center">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/15 to-transparent blur-[60px] rounded-full" />
                <img src={phoneMockup} alt="Smartphone zeigt interaktiven Video-Funnel mit Auswahlbuttons" 
                  className="relative w-56 sm:w-64 h-auto" loading="lazy" />
              </div>
            </SlideIn>
          </div>

          {/* Feature 2: KI Builder — 3D visual left */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <SlideIn from="left" className="order-2 lg:order-1">
              <div className="relative flex justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 to-transparent blur-[60px] rounded-full" />
                <img src={interactiveVideo3d} alt="3D-Darstellung des interaktiven Video-Players mit Analytics" 
                  className="relative w-full max-w-md h-auto" loading="lazy" />
              </div>
            </SlideIn>
            <SlideIn from="right" delay={0.15} className="order-1 lg:order-2">
              <div>
                <div className="inline-flex items-center gap-2 text-cyan-400 text-sm font-medium mb-4">
                  <Sparkles className="h-4 w-4" /> KI-gestützt
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">Sag der KI, was du brauchst</h3>
                <p className="text-white/50 text-lg leading-relaxed mb-6">
                  "Ich brauche einen Coaching-Funnel mit 5 Videos und Lead-Capture."
                  — Die KI baut dir die komplette Struktur in unter 10 Sekunden.
                </p>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-purple-400" />
                    </div>
                    <span className="text-sm font-medium">KI Funnel-Assistent</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-sm text-white/40 italic border border-white/5">
                    "Erstelle einen Immobilien-Funnel: Intro → Kauf oder Miete → Budget → Lage → Lead Capture"
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-cyan-400">
                    <CheckCircle2 className="h-3 w-3" /> 6 Nodes generiert · 5 Verbindungen erstellt
                  </div>
                </div>
              </div>
            </SlideIn>
          </div>

          {/* Feature 3: Lead Qualification — dashboard visual */}
          <FadeUp>
            <div className="grid lg:grid-cols-2 gap-12 items-center rounded-3xl bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border border-white/5 p-8 sm:p-12">
              <div>
                <div className="inline-flex items-center gap-2 text-white text-sm font-medium mb-4">
                  <Brain className="h-4 w-4 text-purple-400" /> Automatische Lead-Qualifizierung
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                  Wisse alles über deinen Lead — bevor du ihn anrufst
                </h3>
                <p className="text-white/50 text-lg leading-relaxed mb-8">
                  Jede Entscheidung im Funnel ist ein Datenpunkt. Budget? Erfahrung? Ziel?
                  Dein CRM bekommt einen fertig qualifizierten Lead.
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { label: "Antwort-Tracking", desc: "Jede Entscheidung gespeichert" },
                    { label: "Lead Scoring", desc: "Automatische Qualifizierung" },
                    { label: "CRM-Export", desc: "Via API oder Webhook" },
                  ].map((f) => (
                    <div key={f.label} className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="font-semibold text-sm mb-1">{f.label}</div>
                      <div className="text-xs text-white/40">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 blur-[40px] rounded-full" />
                  <img src={leadQualifyVisual} alt="Dashboard mit Lead-Qualifizierungs-Daten und Funnel-Analytics"
                    className="relative w-full max-w-sm h-auto" loading="lazy" />
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5: LIVE DEMO PLACEHOLDER
      ═══════════════════════════════════════════ */}
      <section id="demo" className="py-32 px-4 bg-[hsl(240,10%,6%)]">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-12">
            <span className="text-sm font-mono uppercase tracking-[0.3em] text-purple-400 mb-4 block">Sieh selbst</span>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Erlebe einen Video-Funnel live</h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Klicke Play und erlebe, wie sich ein interaktiver Video-Funnel anfühlt — aus Zuschauer-Perspektive.
            </p>
          </FadeUp>

          <ScaleReveal>
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-white/10 shadow-2xl shadow-purple-500/5 group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-950/80 via-black to-cyan-950/80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Play className="h-8 w-8 text-white fill-white ml-1" />
                </motion.div>
                <span className="text-white/30 text-sm">Demo-Video — hier wird dein Funnel eingebettet</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div animate={{ width: ["0%", "35%"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" />
                </div>
                <span className="text-white/20 text-xs font-mono">1:24 / 3:45</span>
              </div>
            </div>
          </ScaleReveal>

          <FadeUp delay={0.3} className="mt-6 flex justify-center gap-3 flex-wrap">
            {["💰 Geld sparen", "📈 Schneller wachsen", "🚀 Alles zeigen"].map((btn) => (
              <motion.div key={btn} whileHover={{ y: -2 }}
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium cursor-default hover:bg-white/10 transition-colors">
                {btn}
              </motion.div>
            ))}
          </FadeUp>
          <p className="text-center text-xs text-white/20 mt-3">
            ↑ So sehen die interaktiven Buttons unter deinem Video aus
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 6: HOW IT WORKS — Clean timeline
      ═══════════════════════════════════════════ */}
      <section className="py-32 px-4 bg-[hsl(240,10%,4%)]">
        <div className="max-w-3xl mx-auto">
          <FadeUp className="text-center mb-20">
            <span className="text-sm font-mono uppercase tracking-[0.3em] text-purple-400 mb-4 block">So einfach geht's</span>
            <h2 className="text-3xl sm:text-5xl font-bold">In 4 Schritten live</h2>
          </FadeUp>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-pink-500/50 to-cyan-500/50" />
            {[
              { step: "01", title: "Beschreibe deinen Funnel", desc: "Sag der KI in einem Satz, was du brauchst. Oder wähle eine fertige Vorlage.", icon: Sparkles, color: "text-purple-400" },
              { step: "02", title: "Videos & Antworten hinzufügen", desc: "Lade Videos hoch, definiere Buttons, Multiple Choice oder Slider. Drag & Drop.", icon: Video, color: "text-pink-400" },
              { step: "03", title: "Pfade & Logik verbinden", desc: "Verbinde Entscheidungen mit Nodes. Die KI hilft dir bei der optimalen Struktur.", icon: GitBranch, color: "text-cyan-400" },
              { step: "04", title: "Embed & Go Live", desc: "Ein Klick — dein Funnel ist live. Ein Script-Tag — er läuft auf deiner Website.", icon: Globe, color: "text-green-400" },
            ].map((s, i) => (
              <FadeUp key={s.step} delay={i * 0.1} className="relative pl-20 pb-16 last:pb-0">
                <div className="absolute left-4 top-1 h-9 w-9 rounded-full bg-[hsl(240,10%,8%)] border-2 border-white/10 flex items-center justify-center">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div className="text-xs font-mono text-white/30 mb-2">{s.step}</div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-white/40 leading-relaxed">{s.desc}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 7: FEATURES — Bento grid with distinct cards
      ═══════════════════════════════════════════ */}
      <section className="py-32 px-4 bg-[hsl(240,10%,6%)]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-16">
            <span className="text-sm font-mono uppercase tracking-[0.3em] text-purple-400 mb-4 block">Features</span>
            <h2 className="text-3xl sm:text-5xl font-bold">Alles in einem Tool</h2>
          </FadeUp>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Sparkles, title: "KI-Assistent", desc: "Funnel per Prompt generieren", span: "col-span-2", gradient: "from-purple-500/10 to-pink-500/10", border: "border-purple-500/15" },
              { icon: MousePointerClick, title: "Drag & Drop", desc: "Visueller Node-Editor", span: "", gradient: "from-blue-500/10 to-cyan-500/10", border: "border-blue-500/15" },
              { icon: GitBranch, title: "Verzweigungen", desc: "Buttons, MC, Slider", span: "", gradient: "from-emerald-500/10 to-teal-500/10", border: "border-emerald-500/15" },
              { icon: Users, title: "Lead Capture", desc: "Formulare direkt im Funnel", span: "", gradient: "from-orange-500/10 to-amber-500/10", border: "border-orange-500/15" },
              { icon: BarChart3, title: "Analytics", desc: "Echtzeit-Tracking aller Pfade", span: "", gradient: "from-pink-500/10 to-rose-500/10", border: "border-pink-500/15" },
              { icon: Code2, title: "Embed", desc: "1 Zeile Code, jede Website", span: "col-span-2", gradient: "from-cyan-500/10 to-blue-500/10", border: "border-cyan-500/15" },
              { icon: Shield, title: "DSGVO", desc: "EU-Server, Opt-in eingebaut", span: "", gradient: "from-green-500/10 to-emerald-500/10", border: "border-green-500/15" },
              { icon: Zap, title: "API & Webhooks", desc: "CRM, E-Mail, alles verbinden", span: "", gradient: "from-yellow-500/10 to-orange-500/10", border: "border-yellow-500/15" },
            ].map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.05} className={f.span}>
                <motion.div whileHover={{ y: -3 }} className={`p-6 rounded-2xl border ${f.border} bg-gradient-to-br ${f.gradient} h-full transition-all`}>
                  <f.icon className="h-6 w-6 text-white/80 mb-3" />
                  <h3 className="font-bold mb-1">{f.title}</h3>
                  <p className="text-sm text-white/40">{f.desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 8: SOCIAL PROOF
      ═══════════════════════════════════════════ */}
      <section className="py-32 px-4 bg-[hsl(240,10%,4%)]">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Erfolgsgeschichten</h2>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "Mein Verkaufsgespräch läuft jetzt 24/7. Die Leads sind 3x besser qualifiziert als vorher.", name: "Sarah M.", role: "Immobilienmaklerin", metric: "+312% Conversion" },
              { quote: "Die Verweildauer ist 4x höher als bei normalen Videos. Die Leute LIEBEN es, selbst zu entscheiden.", name: "Thomas K.", role: "Online-Coach", metric: "4x Watch-Time" },
              { quote: "Einen Code kopiert, auf meine Seite gesetzt — und die Conversion hat sich verdreifacht.", name: "Lisa W.", role: "E-Commerce", metric: "2 Min. Setup" },
            ].map((t, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] h-full flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed flex-1 mb-6">"{t.quote}"</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-white/30">{t.role}</div>
                    </div>
                    <div className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full">
                      {t.metric}
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 9: PRICING
      ═══════════════════════════════════════════ */}
      <section id="pricing" className="py-32 px-4 bg-[hsl(240,10%,6%)]">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-16">
            <span className="text-sm font-mono uppercase tracking-[0.3em] text-purple-400 mb-4 block">Preise</span>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Starte kostenlos. Wachse unbegrenzt.</h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <FadeUp key={plan.name} delay={i * 0.1}>
                <motion.div whileHover={{ y: -4 }}>
                  <Card className={`relative h-full bg-white/[0.02] border-white/5 ${plan.highlighted ? "border-purple-500/50 shadow-xl shadow-purple-500/10" : ""}`}>
                    {plan.highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                        Beliebt
                      </div>
                    )}
                    <CardContent className="pt-8 flex flex-col h-full">
                      <h3 className="text-lg font-semibold mb-1 text-white">{plan.name}</h3>
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-white">{plan.price}</span>
                        <span className="text-white/40 text-sm">{plan.period}</span>
                      </div>
                      <ul className="space-y-3 mb-8 flex-1">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                            <CheckCircle2 className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />{f}
                          </li>
                        ))}
                      </ul>
                      <Link to="/signup">
                        <Button className={`w-full ${plan.highlighted ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:opacity-90 border-0" : "bg-white/10 text-white border border-white/10 hover:bg-white/20"}`}>
                          {plan.cta}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 10: FINAL CTA
      ═══════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(240,10%,6%)] via-[hsl(270,50%,8%)] to-[hsl(240,10%,4%)]" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        </div>
        <FadeUp className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-8" />
          </motion.div>
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Bereit, dein Verkaufs&shy;gespräch unsterblich zu machen?
          </h2>
          <p className="text-lg text-white/40 mb-10 max-w-xl mx-auto">
            Starte kostenlos. Baue deinen ersten Funnel in 5 Minuten. Keine Kreditkarte.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-black hover:bg-white/90 text-base px-10 h-14 shadow-2xl shadow-white/10">
              Jetzt loslegen <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </FadeUp>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-16 px-4 bg-[hsl(240,10%,4%)]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center">
                <Play className="h-4 w-4 text-white fill-current" />
              </div>
              <span className="font-bold text-lg">VidPath</span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed">
              Interaktive Video-Funnels. Personalisiert. Skalierbar. 24/7.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Produkt</h4>
            <ul className="space-y-2 text-sm text-white/30">
              <li><a href="#solution" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Preise</a></li>
              <li><a href="#demo" className="hover:text-white transition-colors">Demo</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Konto</h4>
            <ul className="space-y-2 text-sm text-white/30">
              <li><Link to="/login" className="hover:text-white transition-colors">Anmelden</Link></li>
              <li><Link to="/signup" className="hover:text-white transition-colors">Registrieren</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Rechtliches</h4>
            <ul className="space-y-2 text-sm text-white/30">
              <li>Datenschutz</li><li>Impressum</li><li>AGB</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/5 mt-12 pt-8 text-center text-sm text-white/20">
          © 2026 VidPath. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  );
}
