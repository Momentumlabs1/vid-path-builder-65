import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileVideo, Check, Loader2 } from 'lucide-react';
import { smartTradingFunnelStructure, SMART_TRADING_FUNNEL_NAME } from '@/data/smartTradingFunnel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
      // Check if funnel already exists
      const { data: existing } = await supabase
        .from('funnels')
        .select('name')
        .eq('name', SMART_TRADING_FUNNEL_NAME)
        .single();

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
          Smart Trading Funnel V2.0
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/95 border border-white/10 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">
            🎬 Smart Trading Video Funnel V2.0
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Kompletter interaktiver Video-Funnel mit 3 getrennten Pfaden
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Funnel Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="text-green-400 text-sm font-medium mb-2">🟢 Anfänger-Pfad</div>
              <div className="text-white/60 text-xs">
                • 8-10 Videos<br />
                • Motivation erfragen<br />
                • Starter Kurs anbieten
              </div>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <div className="text-orange-400 text-sm font-medium mb-2">🟡 Fortgeschritten</div>
              <div className="text-white/60 text-xs">
                • 10-12 Videos<br />
                • Situation analysieren<br />
                • Gruppen-Coaching anbieten
              </div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="text-red-400 text-sm font-medium mb-2">🔴 Profi-Pfad</div>
              <div className="text-white/60 text-xs">
                • 9-11 Videos<br />
                • Skalierung fokussieren<br />
                • 1:1 Mentoring anbieten
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-white font-medium mb-3">Features:</div>
            <ul className="text-white/60 text-sm space-y-2">
              <li>✓ 35+ Video-Nodes mit komplettem Branching</li>
              <li>✓ Multiple-Choice Fragen mit dynamischem Routing</li>
              <li>✓ Lead-Capture am Ende jedes Pfads</li>
              <li>✓ Personalisierte Produkt-Empfehlungen</li>
              <li>✓ Alle Texte bereits eingetragen</li>
              <li>✓ Nur noch Videos hochladen!</li>
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
