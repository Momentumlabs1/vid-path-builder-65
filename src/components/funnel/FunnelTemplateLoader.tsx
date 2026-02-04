import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileVideo, Check, Loader2 } from 'lucide-react';
import { smartTradingNodes, smartTradingEdges, SMART_TRADING_FUNNEL_NAME } from '@/data/smartTradingFunnel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Build structure from nodes and edges - V4.0 FINAL (16 Videos, perfekte Psychologie)
const smartTradingFunnelStructure = {
  nodes: smartTradingNodes.map(node => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: node.data
  })),
  edges: smartTradingEdges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: edge.type,
    label: edge.label
  }))
};

interface FunnelTemplateLoaderProps {
  onFunnelLoaded?: () => void;
}

export function FunnelTemplateLoader({ onFunnelLoaded }: FunnelTemplateLoaderProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const loadSmartTradingFunnel = async () => {
    setLoading(true);
    try {
      // Check if funnel already exists - use maybeSingle to avoid error when not found
      const { data: existing } = await supabase
        .from('funnels')
        .select('name')
        .eq('name', SMART_TRADING_FUNNEL_NAME)
        .maybeSingle();

      if (existing) {
        // Update existing funnel
        const { error } = await supabase
          .from('funnels')
          .update({
            structure: smartTradingFunnelStructure as any
          })
          .eq('name', SMART_TRADING_FUNNEL_NAME);

        if (error) throw error;

        toast({
          title: '✅ Funnel aktualisiert',
          description: `"${SMART_TRADING_FUNNEL_NAME}" wurde erfolgreich aktualisiert.`,
        });
      } else {
        // Create new funnel
        const { error } = await supabase
          .from('funnels')
          .insert({
            name: SMART_TRADING_FUNNEL_NAME,
            structure: smartTradingFunnelStructure as any,
            user_id: null, // Allow anonymous for demo
            is_public: true
          });

        if (error) throw error;

        toast({
          title: '🎉 Funnel erstellt',
          description: `"${SMART_TRADING_FUNNEL_NAME}" wurde erfolgreich erstellt!`,
        });
      }

      setSuccess(true);
      onFunnelLoaded?.();

      // Reset success state after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error loading funnel:', error);
      toast({
        title: '❌ Fehler',
        description: 'Funnel konnte nicht geladen werden.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20 bg-purple-500/10"
        >
          <FileVideo className="w-4 h-4 mr-2" />
          Smart Trading Funnel V4.0 FINAL
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/95 border border-white/10 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">
            🎬 Smart Trading Video Funnel V4.0 FINAL
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Perfekter psychologischer Aufbau – 16 Videos, ~14 Min Content
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Psychologie-Flow */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="text-purple-400 text-sm font-medium mb-2">🧠 Psychologischer Flow:</div>
            <div className="text-white/60 text-xs space-y-1">
              <div>1. Hook → 2. Vertrauen → 3. Qualifizierung → 4. Traum</div>
              <div>5. Schmerz → 6. Aha-Moment → 7. Social Proof → 8. Lösung</div>
              <div>9. Urgency → 10. Doppel-CTA → 11. Open Loop</div>
            </div>
          </div>

          {/* Funnel Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="text-green-400 text-sm font-medium mb-2">🟢 Anfänger-Pfad</div>
              <div className="text-white/60 text-xs">
                • 4 Videos<br />
                • Traum → Schmerz → Aha → Lösung<br />
                • Starter Programm + E-Mail-Kurs
              </div>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <div className="text-orange-400 text-sm font-medium mb-2">🟡 Fortgeschritten</div>
              <div className="text-white/60 text-xs">
                • 4 Videos<br />
                • Situation → Traum → Problem → Lösung<br />
                • Gruppen-Coaching + Workshop
              </div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="text-red-400 text-sm font-medium mb-2">🔴 Profi-Pfad</div>
              <div className="text-white/60 text-xs">
                • 4 Videos<br />
                • Status → Engpass → Aha → Lösung<br />
                • 1:1 Mentoring + Mastermind
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-white font-medium mb-3">Features V4.0 FINAL:</div>
            <ul className="text-white/60 text-sm space-y-2">
              <li>✓ 16 Video-Elemente (~14 Min Content)</li>
              <li>✓ 3 gemeinsame Videos (Hook, Story, Abschluss)</li>
              <li>✓ Social Proof Zwischenscreen</li>
              <li>✓ Pattern Interrupt + Vulnerability</li>
              <li>✓ Aha-Moment in jedem Pfad</li>
              <li>✓ Doppel-CTA: Bezahlt + Kostenlos</li>
              <li>✓ Open Loop am Ende</li>
            </ul>
          </div>

          {/* Action Button */}
          <Button
            onClick={loadSmartTradingFunnel}
            disabled={loading}
            className={`w-full py-6 text-lg font-semibold ${
              success
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Lade Funnel...
              </>
            ) : success ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Funnel erfolgreich geladen!
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Funnel in Datenbank laden
              </>
            )}
          </Button>

          {success && (
            <div className="text-center text-white/60 text-sm">
              Öffne den Builder und lade "{SMART_TRADING_FUNNEL_NAME}" um den Funnel zu bearbeiten.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
