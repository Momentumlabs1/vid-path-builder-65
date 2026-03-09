import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Zap, BarChart3, Users, ArrowRight, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Play,
    title: "Video Funnels",
    description: "Erstelle interaktive Video-Funnels mit Drag & Drop. Deine Zuschauer entscheiden, was als nächstes passiert.",
  },
  {
    icon: Users,
    title: "Lead Capture",
    description: "Sammle Leads direkt in deinen Funnels mit anpassbaren Formularen und Opt-in-Feldern.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Verfolge Conversions, Absprungraten und Nutzerverhalten in Echtzeit.",
  },
  {
    icon: Zap,
    title: "Embed & Teilen",
    description: "Bette Funnels auf jeder Website ein oder teile sie direkt per Link.",
  },
];

const plans = [
  {
    name: "Free",
    price: "0€",
    period: "/Monat",
    features: ["1 Funnel", "100 Leads/Monat", "Basis-Analytics", "Lovable-Branding"],
    cta: "Kostenlos starten",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "29€",
    period: "/Monat",
    features: ["Unlimited Funnels", "5.000 Leads/Monat", "Custom Branding", "Export-Funktion", "Priority Support"],
    cta: "Pro wählen",
    highlighted: true,
  },
  {
    name: "Business",
    price: "79€",
    period: "/Monat",
    features: ["Alles aus Pro", "Team-Zugang", "API-Zugriff", "Whitelabel", "Dedicated Support"],
    cta: "Business wählen",
    highlighted: false,
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-primary">Vid</span>Path
          </span>
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

      {/* Hero */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Zap className="h-3.5 w-3.5" /> Video Funnels, die konvertieren
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight mb-6">
            Verwandle Videos in{" "}
            <span className="text-primary">interaktive Funnels</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Erstelle Video-Funnels mit Entscheidungspfaden, sammle Leads und steigere deine Conversion-Rate — ohne eine Zeile Code.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="text-base px-8">
                Kostenlos starten <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="#features">
              <Button variant="outline" size="lg" className="text-base px-8">
                Features ansehen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Alles was du brauchst</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Von der Erstellung bis zur Analyse — VidPath gibt dir alle Tools für erfolgreiche Video Funnels.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Einfache Preise</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Starte kostenlos und upgrade, wenn du wächst.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col ${
                  plan.highlighted
                    ? "border-primary shadow-lg shadow-primary/10 scale-105"
                    : "border-border/50"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    Beliebt
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
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Bereit loszulegen?</h2>
          <p className="text-muted-foreground mb-8">
            Erstelle deinen ersten Video Funnel in wenigen Minuten — kostenlos.
          </p>
          <Link to="/signup">
            <Button size="lg" className="text-base px-8">
              Jetzt kostenlos starten <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© 2026 VidPath. Alle Rechte vorbehalten.</span>
          <div className="flex gap-6">
            <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
            <a href="#pricing" className="hover:text-foreground transition-colors">Preise</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
