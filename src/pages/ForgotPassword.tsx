import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, Play, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2.5 mb-10">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Play className="h-4 w-4 text-primary fill-primary" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">VidPath</span>
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3">E-Mail gesendet</h1>
            <p className="text-muted-foreground mb-6">
              Überprüfe dein Postfach (<span className="text-foreground font-medium">{email}</span>) für den Reset-Link.
            </p>
            <Link to="/login">
              <Button variant="outline" className="gap-2">
                Zum Login <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Passwort zurücksetzen</h1>
              <p className="text-muted-foreground">Gib deine E-Mail ein und wir senden dir einen Reset-Link.</p>
            </div>

            <form onSubmit={handleReset} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@beispiel.de" required className="h-11" />
              </div>

              <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                {loading ? "Wird gesendet..." : "Reset-Link senden"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" /> Zurück zum Login
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
