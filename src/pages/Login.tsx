import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn, Play, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: "Login fehlgeschlagen", description: error.message, variant: "destructive" });
    } else {
      navigate("/app/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-purple-600" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
        
        {/* Decorative elements */}
        <motion.div 
          animate={{ y: [0, -20, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-32 h-32 rounded-full bg-white/5 blur-xl" 
        />
        <motion.div 
          animate={{ y: [0, 15, 0] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 left-16 w-48 h-48 rounded-full bg-white/5 blur-xl" 
        />
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Play className="h-5 w-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">VidPath</span>
          </Link>

          {/* Value Proposition */}
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm px-4 py-1.5 rounded-full mb-6 border border-white/10">
                <Sparkles className="h-3.5 w-3.5" /> Über 2.000 Funnels erstellt
              </div>
              <h2 className="text-3xl font-bold text-white leading-tight mb-4">
                Verwandle Zuschauer in qualifizierte Leads — automatisch.
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Mit interaktiven Video-Funnels, die sich anfühlen wie ein echtes Gespräch.
              </p>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              {["Kein Code nötig — Drag & Drop Builder", "KI erstellt deinen Funnel in Sekunden", "Unbegrenzte Leads ab Pro-Plan"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/70 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-white/50 shrink-0" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10"
          >
            <p className="text-white/80 text-sm italic mb-3">
              "Wir haben unsere Conversion Rate um 340% gesteigert — nur durch den Wechsel von klassischen Landing Pages zu VidPath."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">MK</div>
              <div>
                <div className="text-white text-sm font-medium">Markus K.</div>
                <div className="text-white/40 text-xs">Marketing-Agentur</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Play className="h-4 w-4 text-primary fill-primary" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">VidPath</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Willkommen zurück</h1>
            <p className="text-muted-foreground">Melde dich an, um deine Funnels zu verwalten</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@beispiel.de" 
                required 
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Passwort</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Vergessen?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required 
                  className="h-11 pr-10"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                  Anmeldung...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Anmelden <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Noch kein Konto?{" "}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                Kostenlos registrieren
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
