import { useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Sparkles, Loader2, Wand2 } from 'lucide-react';

interface FunnelAIChatProps {
  onApplyFunnel: (nodes: Node[], edges: Edge[]) => void;
  onClose: () => void;
}

type Message = { role: 'user' | 'assistant'; content: string };

const quickActions = [
  { label: '🏠 Immobilien-Funnel', prompt: 'Erstelle einen Immobilien-Funnel: Intro-Video, dann Frage ob Kauf oder Miete, dann Budget-Frage, dann Lead-Capture mit Kontaktdaten, dann Danke-Seite.' },
  { label: '💪 Coaching-Funnel', prompt: 'Erstelle einen Coaching-Funnel: Intro-Video über das Coaching-Angebot, dann Frage nach dem Ziel (Abnehmen, Muskelaufbau, Fitness), passende Videos pro Ziel, dann Lead-Capture, dann Ende.' },
  { label: '🛒 E-Commerce-Funnel', prompt: 'Erstelle einen E-Commerce-Funnel: Produkt-Vorstellungsvideo, dann Frage nach Interesse (Ja/Nein), bei Ja weitere Produktdetails, dann Lead-Capture für Newsletter, dann Ende mit Link zum Shop.' },
  { label: '📚 Online-Kurs-Funnel', prompt: 'Erstelle einen Online-Kurs-Funnel: Teaser-Video, Frage nach Vorkenntnissen (Anfänger/Fortgeschritten), passende Vorschau-Videos, Lead-Capture für Warteliste, Ende.' },
];

export function FunnelAIChat({ onApplyFunnel, onClose }: FunnelAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastFunnel, setLastFunnel] = useState<{ nodes: Node[]; edges: Edge[]; description: string } | null>(null);
  const { toast } = useToast();

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setLastFunnel(null);

    try {
      const { data, error } = await supabase.functions.invoke('funnel-ai', {
        body: { messages: newMessages },
      });

      if (error) throw error;

      if (data?.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `❌ ${data.error}` }]);
      } else if (data?.nodes && data?.edges) {
        setLastFunnel({ nodes: data.nodes, edges: data.edges, description: data.description || '' });
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `✅ **Funnel generiert!**\n\n${data.description || ''}\n\n📊 ${data.nodes.length} Nodes, ${data.edges.length} Verbindungen\n\nKlicke "Anwenden" um den Funnel in den Editor zu laden.`
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Konnte keinen Funnel generieren. Bitte beschreibe genauer, was du brauchst.' }]);
      }
    } catch (e: any) {
      console.error('AI chat error:', e);
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Fehler: ${e.message || 'Verbindungsfehler'}` }]);
      toast({ title: 'KI-Fehler', description: 'Funnel konnte nicht generiert werden.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const applyFunnel = () => {
    if (!lastFunnel) return;
    onApplyFunnel(lastFunnel.nodes, lastFunnel.edges);
    toast({ title: '✅ Funnel angewendet', description: `${lastFunnel.nodes.length} Nodes wurden in den Editor geladen.` });
  };

  return (
    <div className="w-96 bg-gradient-to-b from-zinc-900/95 to-black/95 backdrop-blur-xl border-l border-zinc-700/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">KI Funnel-Assistent</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-zinc-400 hover:text-white hover:bg-white/10">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <p className="text-zinc-400 text-sm">Beschreibe den Funnel, den du bauen möchtest, oder wähle einen Vorschlag:</p>
            <div className="grid gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.prompt)}
                  disabled={loading}
                  className="text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-zinc-700/50 hover:border-purple-500/50 transition-all text-sm text-zinc-300 hover:text-white"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-purple-600/30 text-white'
                    : 'bg-zinc-800/80 text-zinc-200'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800/80 rounded-lg px-3 py-2 flex items-center gap-2 text-sm text-zinc-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generiere Funnel...
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Apply Button */}
      {lastFunnel && (
        <div className="px-4 pb-2">
          <Button onClick={applyFunnel} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            <Wand2 className="w-4 h-4 mr-2" />
            Funnel anwenden ({lastFunnel.nodes.length} Nodes)
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-zinc-700/50">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Beschreibe deinen Funnel..."
            className="bg-white/5 border-zinc-700 text-white placeholder:text-zinc-500 resize-none min-h-[44px] max-h-[120px]"
            rows={1}
            disabled={loading}
          />
          <Button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} size="sm" className="bg-purple-600 hover:bg-purple-700 self-end">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
