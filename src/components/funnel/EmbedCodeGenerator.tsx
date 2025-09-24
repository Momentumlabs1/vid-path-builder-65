import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EmbedCodeGeneratorProps {
  funnelName: string;
  isPublic?: boolean;
}

export const EmbedCodeGenerator = ({ funnelName, isPublic = false }: EmbedCodeGeneratorProps) => {
  const [embedType, setEmbedType] = useState('widget');
  const [position, setPosition] = useState('bottom-right');
  const [buttonText, setButtonText] = useState('Funnel starten');
  const [containerHeight, setContainerHeight] = useState('600');
  const [autoOpen, setAutoOpen] = useState(false);
  const [delay, setDelay] = useState('3000');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const { toast } = useToast();

  const baseUrl = window.location.origin;
  const embedUrl = `${baseUrl}/embed/${encodeURIComponent(funnelName)}`;

  const generateEmbedCode = () => {
    const config = {
      funnelId: funnelName,
      type: embedType,
      position: embedType === 'widget' ? position : undefined,
      buttonText: embedType === 'modal' ? buttonText : undefined,
      height: embedType === 'inline' ? `${containerHeight}px` : undefined,
      autoOpen: autoOpen,
      delay: autoOpen ? parseInt(delay) : undefined,
      contact_name: contactName || undefined,
      contact_email: contactEmail || undefined,
      utm_source: utmSource || undefined,
      container: embedType === 'inline' || embedType === 'modal' ? 'funnel-embed' : undefined
    };

    // Clean undefined values
    Object.keys(config).forEach(key => {
      if (config[key as keyof typeof config] === undefined) {
        delete config[key as keyof typeof config];
      }
    });

    const configString = JSON.stringify(config, null, 2);

    if (embedType === 'inline') {
      return `<!-- Funnel Embed Container -->
<div id="funnel-embed"></div>

<!-- Funnel Embed Script -->
<script src="${baseUrl}/embed.js"></script>
<script>
window.FUNNEL_EMBED_CONFIG = ${configString};
</script>`;
    }

    if (embedType === 'modal') {
      return `<!-- Funnel Embed Container -->
<div id="funnel-embed"></div>

<!-- Funnel Embed Script -->
<script src="${baseUrl}/embed.js"></script>
<script>
window.FUNNEL_EMBED_CONFIG = ${configString};
</script>`;
    }

    return `<!-- Funnel Embed Script -->
<script src="${baseUrl}/embed.js"></script>
<script>
window.FUNNEL_EMBED_CONFIG = ${configString};
</script>`;
  };

  const generateIframeCode = () => {
    const params = new URLSearchParams();
    if (contactName) params.append('contact_name', contactName);
    if (contactEmail) params.append('contact_email', contactEmail);
    if (utmSource) params.append('utm_source', utmSource);
    
    const queryString = params.toString();
    const separator = queryString ? '?' : '';
    const fullUrl = `${embedUrl}${separator}${queryString}`;

    return `<iframe 
  src="${fullUrl}"
  width="100%" 
  height="${containerHeight}px"
  frameborder="0"
  allowfullscreen
  allow="camera; microphone; autoplay; encrypted-media; fullscreen"
  style="border-radius: 8px; border: none;">
</iframe>`;
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast({
        title: "Code kopiert!",
        description: "Der Embed-Code wurde in die Zwischenablage kopiert.",
      });
    }).catch(() => {
      toast({
        title: "Fehler",
        description: "Code konnte nicht kopiert werden.",
        variant: "destructive",
      });
    });
  };

  const openPreview = () => {
    const params = new URLSearchParams();
    if (contactName) params.append('contact_name', contactName);
    if (contactEmail) params.append('contact_email', contactEmail);
    if (utmSource) params.append('utm_source', utmSource);
    
    const queryString = params.toString();
    const separator = queryString ? '?' : '';
    const fullUrl = `${embedUrl}${separator}${queryString}`;
    
    window.open(fullUrl, '_blank');
  };

  return (
    <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-white">Embed Code Generator</CardTitle>
        <p className="text-white/60">Generiere Code zum Einbetten deines Funnels auf anderen Websites</p>
        {!isPublic && (
          <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4 mt-4">
            <h4 className="text-orange-300 font-medium mb-2">⚠️ Funnel nicht öffentlich</h4>
            <p className="text-orange-200/80 text-sm">
              Dieser Funnel ist aktuell privat und kann nicht eingebettet werden. 
              Markieren Sie ihn als öffentlich im Dashboard, um Embeds zu ermöglichen.
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Embed Type Selection */}
          <div className="space-y-2">
            <Label className="text-white">Embed-Typ</Label>
            <Select value={embedType} onValueChange={setEmbedType}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                <SelectItem value="widget">Floating Widget</SelectItem>
                <SelectItem value="modal">Modal Button</SelectItem>
                <SelectItem value="inline">Inline Embed</SelectItem>
                <SelectItem value="fullscreen">Fullscreen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Widget Position */}
          {embedType === 'widget' && (
            <div className="space-y-2">
              <Label className="text-white">Position</Label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  <SelectItem value="bottom-right">Unten Rechts</SelectItem>
                  <SelectItem value="bottom-left">Unten Links</SelectItem>
                  <SelectItem value="top-right">Oben Rechts</SelectItem>
                  <SelectItem value="top-left">Oben Links</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Button Text for Modal */}
          {embedType === 'modal' && (
            <div className="space-y-2">
              <Label className="text-white">Button Text</Label>
              <Input
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="Funnel starten"
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          )}

          {/* Height for Inline */}
          {embedType === 'inline' && (
            <div className="space-y-2">
              <Label className="text-white">Höhe (px)</Label>
              <Input
                value={containerHeight}
                onChange={(e) => setContainerHeight(e.target.value)}
                placeholder="600"
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          )}

          {/* Auto Open Options */}
          {(embedType === 'widget' || embedType === 'fullscreen') && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoOpen"
                  checked={autoOpen}
                  onChange={(e) => setAutoOpen(e.target.checked)}
                  className="rounded border-white/20"
                />
                <Label htmlFor="autoOpen" className="text-white">Automatisch öffnen</Label>
              </div>
              
              {autoOpen && (
                <div className="space-y-2">
                  <Label className="text-white">Verzögerung (ms)</Label>
                  <Input
                    value={delay}
                    onChange={(e) => setDelay(e.target.value)}
                    placeholder="3000"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              )}
            </div>
          )}

          {/* Personalization */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Personalisierung (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Kontakt Name</Label>
                <Input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="z.B. ${user.name}"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Kontakt Email</Label>
                <Input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="z.B. ${user.email}"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">UTM Source</Label>
              <Input
                value={utmSource}
                onChange={(e) => setUtmSource(e.target.value)}
                placeholder="z.B. website"
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </div>

          {/* Generated Code */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Generierter Code</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openPreview}
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Vorschau
                </Button>
              </div>
            </div>

            <Tabs defaultValue="embed" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-sm border border-white/10">
                <TabsTrigger value="embed" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10">
                  JavaScript Embed
                </TabsTrigger>
                <TabsTrigger value="iframe" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10">
                  Simple iFrame
                </TabsTrigger>
              </TabsList>

              <TabsContent value="embed" className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={generateEmbedCode()}
                    readOnly
                    className="bg-black/50 border-white/20 text-white font-mono text-sm min-h-[200px]"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generateEmbedCode())}
                    className="absolute top-2 right-2 border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="iframe" className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={generateIframeCode()}
                    readOnly
                    className="bg-black/50 border-white/20 text-white font-mono text-sm min-h-[120px]"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generateIframeCode())}
                    className="absolute top-2 right-2 border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Usage Instructions */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white">Verwendung</h3>
            <div className="space-y-3 text-white/80">
              <div>
                <h4 className="font-medium text-white">JavaScript Embed (Empfohlen)</h4>
                <p className="text-sm">Vollständige Funktionalität mit Events und erweiterten Optionen. Füge den Code vor dem schließenden &lt;/body&gt; Tag ein.</p>
              </div>
              <div>
                <h4 className="font-medium text-white">Simple iFrame</h4>
                <p className="text-sm">Einfache Integration ohne JavaScript. Funktioniert überall, aber weniger Funktionalität.</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};