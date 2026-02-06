import React, { useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Download, FileCode, FolderArchive, ExternalLink } from 'lucide-react';
import { generateExportBundle, downloadFile } from '@/lib/export/generateStandalonePlayer';
import { useToast } from '@/hooks/use-toast';

interface FunnelExporterProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node[];
  edges: Edge[];
  funnelName: string;
}

export const FunnelExporter: React.FC<FunnelExporterProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  funnelName
}) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [format, setFormat] = useState<'html' | 'zip'>('html');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (!funnelName.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib dem Funnel einen Namen bevor du exportierst.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);

    try {
      const bundle = generateExportBundle(nodes, edges, {
        format,
        webhookUrl: webhookUrl.trim() || undefined,
        funnelName: funnelName.trim()
      });

      if (bundle.type === 'html') {
        downloadFile(bundle.filename, bundle.content, 'text/html');
        toast({
          title: "✅ Export erfolgreich!",
          description: `${bundle.filename} wurde heruntergeladen.`
        });
      } else {
        // For ZIP, download each file
        for (const file of bundle.files) {
          const mimeType = file.name.endsWith('.json') ? 'application/json' 
            : file.name.endsWith('.css') ? 'text/css'
            : file.name.endsWith('.js') ? 'application/javascript'
            : file.name.endsWith('.md') ? 'text/markdown'
            : 'text/html';
          
          downloadFile(`${funnelName}-${file.name}`, file.content, mimeType);
        }
        toast({
          title: "✅ Export erfolgreich!",
          description: `${bundle.files.length} Dateien wurden heruntergeladen.`
        });
      }

      onClose();
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "❌ Export fehlgeschlagen",
        description: "Es gab einen Fehler beim Exportieren des Funnels.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const videoNodes = nodes.filter(n => n.type === 'video');
  const hasVideos = videoNodes.some(n => n.data?.videoUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-yellow-400" />
            Funnel exportieren
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Exportiere den Funnel als eigenständigen Code für deine Website.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Funnel Info */}
          <div className="bg-zinc-800/50 rounded-lg p-3 space-y-1">
            <div className="text-sm text-zinc-400">Funnel</div>
            <div className="font-semibold">{funnelName || 'Unbenannt'}</div>
            <div className="text-xs text-zinc-500">
              {nodes.length} Nodes · {edges.length} Verbindungen
              {hasVideos && ` · ${videoNodes.length} Videos`}
            </div>
          </div>

          {/* Webhook URL */}
          <div className="space-y-2">
            <Label htmlFor="webhook-url" className="text-sm font-medium">
              Webhook-URL (optional)
            </Label>
            <Input
              id="webhook-url"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://deine-website.com/api/leads"
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            />
            <p className="text-xs text-zinc-500">
              Wenn angegeben, werden Antworten und Lead-Daten an diese URL gesendet.
            </p>
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Export-Format</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as 'html' | 'zip')}>
              <div className="flex items-start space-x-3 p-3 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors">
                <RadioGroupItem value="html" id="html" className="mt-1" />
                <label htmlFor="html" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 font-medium">
                    <FileCode className="w-4 h-4 text-blue-400" />
                    Standalone HTML
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Eine einzige Datei mit allem drin. Einfach hochladen und fertig.
                  </p>
                </label>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors">
                <RadioGroupItem value="zip" id="zip" className="mt-1" />
                <label htmlFor="zip" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 font-medium">
                    <FolderArchive className="w-4 h-4 text-green-400" />
                    Separate Dateien
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    HTML, JS, CSS und JSON getrennt. Für individuelle Integration.
                  </p>
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* Video Info */}
          {hasVideos && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <ExternalLink className="w-4 h-4 text-blue-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-blue-400">Video-URLs bleiben erhalten</div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Die Videos werden von den öffentlichen URLs geladen. Kein Supabase-Login nötig.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white hover:bg-zinc-800">
            Abbrechen
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExporting || !funnelName.trim()}
            className="bg-yellow-500 text-black hover:bg-yellow-400"
          >
            {isExporting ? (
              <>Exportieren...</>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exportieren
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
