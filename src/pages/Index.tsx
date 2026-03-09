import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Play, Zap, BarChart3, Users, ArrowRight, CheckCircle2,
  Sparkles, MousePointerClick, GitBranch, Globe, Code2,
  Video, Shield, Rocket, Star, ChevronRight, Brain,
  TrendingDown, Clock, Eye, Target, Heart
} from "lucide-react";
import { useEffect, useState } from "react";

/* ── Funnel Examples ── */
const funnelExamples = [
  {
    title: "Immobilien-Funnel",
    description: "Qualifiziere Käufer automatisch mit Video-Fragen zu Budget, Lage und Objekttyp.",
    nodes: ["Intro-Video", "Kauf oder Miete?", "Budget-Frage", "Lage wählen", "Lead Capture", "Danke"],
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    icon: "🏠",
  },
  {
    title: "Coaching-Funnel",
    description: "Führe potenzielle Klienten durch ein Assessment und sammle qualifizierte Leads.",
    nodes: ["Willkommen", "Was ist dein Ziel?", "Erfahrungslevel", "Passender Plan", "Lead Capture", "Buchung"],
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30",
    icon: "💪",
  },
  {
    title: "E-Commerce-Funnel",
    description: "Zeige Produkte interaktiv und leite Kunden zum passenden Angebot.",
    nodes: ["Produktvideo", "Interesse?", "Größe/Variante", "Upsell-Video", "Lead Capture", "Shop-Link"],
    color: "from-orange-500/20 to-amber-500/20",
    border: "border-orange-500/30",
    icon: "🛒",
  },
];

/* ── How it works ── */
const steps = [
  {
    step: "01",
    title: "Beschreibe deinen Funnel",
    description: "Sag der KI was du brauchst — oder wähle eine Vorlage. Die KI baut die Grundstruktur in Sekunden.",
    icon: Sparkles,
  },
  {
    step: "02",
    title: "Videos hinzufügen",
    description: "Lade deine Videos hoch oder verlinke sie. Lege Antwort-Buttons, Multiple Choice oder Slider fest.",
    icon: Video,
  },
  {
    step: "03",
    title: "Pfade verbinden",
    description: "Verbinde Nodes per Drag & Drop. Erstelle Verzweigungen basierend auf Nutzer-Antworten.",
    icon: GitBranch,
  },
  {
    step: "04",
    title: "Veröffentlichen & Einbetten",
    description: "Ein Klick — dein Funnel ist live. Bette ihn per Embed-Code auf jeder Website ein.",
    icon: Globe,
  },
];

/* ── Features Grid ── */
const features = [
  { icon: Sparkles, title: "KI Funnel-Assistent", description: "Beschreibe deinen Funnel in Worten — die KI baut die komplette Struktur automatisch." },
  { icon: MousePointerClick, title: "Drag & Drop Builder", description: "Visueller Editor mit Echtzeit-Vorschau. Nodes verbinden, Videos einbetten, Logik definieren." },
  { icon: GitBranch, title: "Entscheidungspfade", description: "Button, Multiple Choice, Slider — leite Zuschauer basierend auf ihren Antworten zum passenden Inhalt." },
  { icon: Users, title: "Lead Capture", description: "Integrierte Formulare mit Name, E-Mail, Telefon und Opt-in. Leads landen direkt in deinem Dashboard." },
  { icon: BarChart3, title: "Analytics & Tracking", description: "Verfolge jede Antwort, jeden Pfad und jede Conversion in Echtzeit." },
  { icon: Code2, title: "Embed überall", description: "Ein Script-Tag — fertig. Dein Funnel läuft auf jeder Website, jedem CMS, jedem Pagebuilder." },
  { icon: Shield, title: "DSGVO-konform", description: "Daten auf europäischen Servern. Opt-in-Management und Datenschutz eingebaut." },
  { icon: Zap, title: "API-Integration", description: "Verbinde deine Funnels mit CRMs, E-Mail-Tools und Webhooks per API-Nodes." },
];

/* ── Pricing ── */
const plans = [
  {
    name: "Free",
    price: "0€",
    period: "/Monat",
    features: ["1 Funnel", "100 Leads/Monat", "KI-Assistent (3 Generierungen)", "Basis-Analytics", "VidPath-Branding"],
    cta: "Kostenlos starten",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "29€",
    period: "/Monat",
    features: ["Unlimited Funnels", "5.000 Leads/Monat", "KI-Assistent unlimited", "Custom Branding", "Export als Standalone", "Priority Support"],
    cta: "Pro wählen",
    highlighted: true,
  },
  {
    name: "Business",
    price: "79€",
    period: "/Monat",
    features: ["Alles aus Pro", "Team-Zugang (5 Seats)", "API-Zugriff", "Whitelabel", "Dedicated Support", "Custom Domain"],
    cta: "Business wählen",
    highlighted: false,
  },
];

/* ── Animated counter ── */
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
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
  }, [target]);
  return <span>{count.toLocaleString('de-DE')}{suffix}</span>;
}

/* ── Mini Funnel Flow Visualization ── */
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
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Nav ── */}
      <nav className="border-b border-border/40 backdrop-blur-xl sticky top-0 z-50 bg-background/80">
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
            <a href="#examples" className="hover:text-foreground transition-colors">Beispiele</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Preise</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Anmelden</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Kostenlos starten</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative py-20 sm:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-8 fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            Das Verkaufsgespräch der Zukunft — als Video-Erlebnis
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Dein Verkaufsgespräch.{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Interaktiv. Personalisiert. 24/7.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Verwandle dein bestes Verkaufsgespräch in ein interaktives Video-Erlebnis. 
            Jeder Zuschauer wählt seinen eigenen Weg — und bekommt genau die Antworten, 
            die ihn zum Abschluss führen. Kein passives Zuschauen. Kein Einheitsbrei. 
            Sondern ein Erlebnis, das konvertiert.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
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
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
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
          </div>
        </div>

        {/* Builder Preview Mock */}
        <div className="max-w-5xl mx-auto mt-20 relative">
          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl shadow-black/10 overflow-hidden">
            <div className="h-10 bg-muted/50 border-b border-border/40 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-green-400/60" />
              </div>
              <span className="text-xs text-muted-foreground ml-4">VidPath Builder — Interaktives Verkaufsgespräch</span>
            </div>
            <div className="p-8 bg-gradient-to-br from-muted/20 to-muted/40 min-h-[320px]">
              {/* Branching visualization */}
              <div className="flex flex-col items-center gap-4">
                <div className="px-5 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-sm font-medium shadow-sm">
                  ▶️ Willkommen — Dein persönliches Angebot
                </div>
                <div className="w-px h-6 bg-border" />
                <div className="px-5 py-3 rounded-lg bg-primary/5 border border-primary/20 text-sm font-medium shadow-sm">
                  🎬 Was interessiert dich am meisten?
                </div>
                <div className="flex items-start gap-8 mt-2">
                  {/* Branch left */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-px h-6 bg-border" />
                    <div className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-xs font-medium">
                      💰 "Wie spare ich Geld?"
                    </div>
                    <div className="w-px h-4 bg-border" />
                    <div className="px-3 py-1.5 rounded-md bg-purple-500/5 border border-purple-500/20 text-xs">
                      Video: Spar-Tipps
                    </div>
                  </div>
                  {/* Branch center */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-px h-6 bg-border" />
                    <div className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs font-medium">
                      📈 "Wie wachse ich schneller?"
                    </div>
                    <div className="w-px h-4 bg-border" />
                    <div className="px-3 py-1.5 rounded-md bg-blue-500/5 border border-blue-500/20 text-xs">
                      Video: Wachstum
                    </div>
                  </div>
                  {/* Branch right */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-px h-6 bg-border" />
                    <div className="px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-xs font-medium">
                      🚀 "Zeig mir alles!"
                    </div>
                    <div className="w-px h-4 bg-border" />
                    <div className="px-3 py-1.5 rounded-md bg-orange-500/5 border border-orange-500/20 text-xs">
                      Video: Komplett-Paket
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-20 h-px bg-border" />
                  <div className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs font-medium">
                    📋 Lead Capture
                  </div>
                  <div className="w-20 h-px bg-border" />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-primary/30 flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Jeder Zuschauer erlebt seinen eigenen Pfad
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section id="problem" className="py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <TrendingDown className="h-3.5 w-3.5" /> Das Problem
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Die Aufmerksamkeit deiner Zielgruppe ist <span className="text-destructive">tot</span>.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              8 Sekunden. So lange hast du, bevor dein Zuschauer weiterscrollt. 
              Klassische Videos, Landing Pages und PDFs haben keine Chance mehr.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="pt-6">
                <Clock className="h-8 w-8 text-destructive mb-4" />
                <h3 className="font-semibold text-lg mb-2">8 Sekunden Aufmerksamkeit</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Die durchschnittliche Aufmerksamkeitsspanne ist kürzer als die eines Goldfischs. 
                  Passive Inhalte verlieren sofort.
                </p>
              </CardContent>
            </Card>
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="pt-6">
                <Eye className="h-8 w-8 text-destructive mb-4" />
                <h3 className="font-semibold text-lg mb-2">95% scrollen weiter</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Klassische Videos werden nach 10 Sekunden abgebrochen. 
                  Landing Pages haben Bounce-Rates von 70%+. Dein Content verpufft.
                </p>
              </CardContent>
            </Card>
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="pt-6">
                <Target className="h-8 w-8 text-destructive mb-4" />
                <h3 className="font-semibold text-lg mb-2">Einheitsbrei konvertiert nicht</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Jeder Kunde hat andere Fragen, andere Bedürfnisse. 
                  Ein Video für alle = für niemanden relevant.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* The Solution */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-muted/50 px-6 py-2 rounded-full text-sm font-semibold text-primary border border-primary/20 backdrop-blur-sm">
                ↓ Die Lösung ↓
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <Heart className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Entertainment statt Langeweile</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Menschen wollen eine <strong>Storyline</strong>. Sie wollen entertainet werden, 
                  mitentscheiden, Teil der Geschichte sein. VidPath macht genau das.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <GitBranch className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Jeder bekommt seinen Weg</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Durch interaktive Verzweigungen erlebt jeder Zuschauer ein <strong>maßgeschneidertes Erlebnis</strong> — 
                  wie ein persönliches Verkaufsgespräch, aber skalierbar.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <Brain className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Qualifizierung auf Autopilot</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Jede Antwort verrät dir mehr über deinen Lead. Am Ende weißt du genau, 
                  <strong> was er will und ob er qualifiziert ist</strong> — bevor du einen Finger rührst.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── The Shift — Why interactive video wins ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Vom passiven Zuschauer zum <span className="text-primary">aktiven Teilnehmer</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Der Unterschied zwischen einem vergessenen Video und einem, das verkauft.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Old way */}
            <Card className="border-destructive/20">
              <CardContent className="pt-6">
                <div className="text-sm font-semibold text-destructive uppercase tracking-wider mb-4">❌ Klassisch</div>
                <ul className="space-y-4">
                  {[
                    "Lineares Video — für alle gleich",
                    "Zuschauer ist passiv, scrollt weiter",
                    "Keine Daten über Interessen",
                    "Lead-Formular am Ende — 90% sind weg",
                    "Jeder bekommt die gleiche Botschaft"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <TrendingDown className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* New way */}
            <Card className="border-primary/30 shadow-lg shadow-primary/5">
              <CardContent className="pt-6">
                <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">✅ Mit VidPath</div>
                <ul className="space-y-4">
                  {[
                    "Interaktive Pfade — jeder erlebt seinen Weg",
                    "Zuschauer entscheidet aktiv mit",
                    "Jede Antwort = Datenpunkt über den Lead",
                    "Lead Capture fühlt sich natürlich an",
                    "Personalisierte Storyline, die fesselt"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <Rocket className="h-3.5 w-3.5" /> In 4 Schritten zum Funnel
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">So baust du deinen Video-Funnel</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Vom ersten Prompt bis zum eingebetteten Funnel — in wenigen Minuten.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="relative group">
                <div className="text-6xl font-bold text-primary/10 mb-4">{s.step}</div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Alles was du brauchst</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Ein Tool für den gesamten Funnel-Lifecycle — von der KI-Erstellung bis zur Analyse.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-border/50 bg-card/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                <CardContent className="pt-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Funnel Examples ── */}
      <section id="examples" className="py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <GitBranch className="h-3.5 w-3.5" /> Fertige Vorlagen
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Funnel-Beispiele</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Starte mit einer Vorlage oder lass die KI deinen individuellen Funnel bauen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {funnelExamples.map((ex) => (
              <Card key={ex.title} className={`${ex.border} bg-card/50 hover:shadow-lg transition-all duration-300`}>
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
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-16">Was Nutzer sagen</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "Mein Verkaufsgespräch läuft jetzt 24/7 — als interaktives Video. Die Leads sind deutlich besser qualifiziert.", name: "Sarah M.", role: "Immobilienmaklerin", stars: 5 },
              { quote: "Die Leute lieben es, selbst zu entscheiden. Die Verweildauer ist 4x höher als bei normalen Videos.", name: "Thomas K.", role: "Online-Coach", stars: 5 },
              { quote: "Embed-Code kopiert, auf meine Seite gesetzt — fertig. Die Conversion hat sich verdreifacht.", name: "Lisa W.", role: "E-Commerce", stars: 5 },
            ].map((t, i) => (
              <Card key={i} className="border-border/50 bg-card/50 text-left">
                <CardContent className="pt-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.stars }).map((_, j) => (
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
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Einfache, transparente Preise</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Starte kostenlos. Upgrade wenn dein Business wächst.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col transition-all duration-300 ${
                  plan.highlighted
                    ? "border-primary shadow-xl shadow-primary/10 scale-[1.02]"
                    : "border-border/50 hover:border-primary/30"
                }`}
              >
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
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup">
                    <Button className="w-full" variant={plan.highlighted ? "default" : "outline"}>
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Sparkles className="h-10 w-10 text-primary mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Dein bestes Verkaufsgespräch — als interaktives Video. Für immer.
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Hör auf, die gleichen Fragen immer wieder zu beantworten. 
            Lass dein Video die Arbeit machen — personalisiert, skalierbar und rund um die Uhr.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="text-base px-8 h-12 shadow-lg shadow-primary/20">
                Jetzt kostenlos starten <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Keine Kreditkarte nötig · Kostenloser Plan verfügbar</p>
        </div>
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
