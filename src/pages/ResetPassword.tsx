import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      // Supabase handles the session automatically
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Fehler", description: "Passwort muss mindestens 6 Zeichen lang sein", variant: "destructive" });
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Passwort aktualisiert", description: "Du kannst dich jetzt mit deinem neuen Passwort anmelden." });
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Neues Passwort setzen</CardTitle>
          <CardDescription>Wähle ein neues Passwort für dein Konto.</CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdate}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Neues Passwort</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 Zeichen" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Wird gespeichert..." : "Passwort speichern"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
