import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Play, Sparkles, CheckCircle2, ArrowRight, Zap, Shield, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Fehler", description: "Passwort muss mindestens 6 Zeichen lang sein", variant: "destructive" });
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: `${window.location.origin}/app/dashboard`,
      },
    });

    if (error) {
      toast({ title: "Registrierung fehlgeschlagen", description: error.message, variant: "destructive" });
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Bestätigungsmail gesendet!</h1>
          <p className="text-muted-foreground mb-6">
            Überprüfe dein Postfach (<span className="text-foreground font-medium">{email}</span>) und klicke auf den Bestätigungslink, um dein Konto zu aktivieren.
          </p>
          <Link to="/login">
            <Button variant="outline" className="gap-2">
              Zum Login <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-purple-600" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
        
        <motion.div 
          animate={{ y: [0, -20, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-16 w-40 h-40 rounded-full bg-white/5 blur-xl" 
        />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Play className="h-5 w-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">VidPath</span>
          </Link>

          <div className="max-w-md">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-3xl font-bold text-white leading-tight mb-4">
                Starte kostenlos. Upgrade wenn du wächst.
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Keine Kreditkarte nötig. Erstelle deinen ersten Video-Funnel in unter 5 Minuten.
              </p>
            </motion.div>

            {/* Feature highlights */}
            <div className="space-y-4">
              {[
                { icon: Zap, title: "Sofort loslegen", desc: "KI generiert deinen Funnel in Sekunden" },
                { icon: Shield, title: "DSGVO-konform", desc: "Daten bleiben in der EU" },
                { icon: BarChart3, title: "Echtzeit Analytics", desc: "Sehe live, wie Leads reinkommen" },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <f.icon className="h-5 w-5 text-white/80" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{f.title}</div>
                    <div className="text-white/50 text-xs">{f.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-white/30 text-xs">
            Bereits über <span className="text-white/60 font-medium">500+</span> zufriedene Nutzer
          </div>
        </div>
      </div>

      {/* Right: Signup Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Play className="h-4 w-4 text-primary fill-primary" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">VidPath</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Konto erstellen</h1>
            <p className="text-muted-foreground">Kostenlos starten — keine Kreditkarte nötig</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Dein Name" required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@beispiel.de" required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 Zeichen" required className="h-11 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                  Wird erstellt...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Kostenlos registrieren <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Mit der Registrierung akzeptierst du unsere{" "}
              <a href="#" className="text-primary hover:underline">AGB</a> und{" "}
              <a href="#" className="text-primary hover:underline">Datenschutzerklärung</a>.
            </p>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Bereits ein Konto?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">Anmelden</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
