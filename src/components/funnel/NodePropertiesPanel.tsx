import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, Video, Settings, Clock, User, MessageSquare, Play, Check, Smartphone, Monitor, Eye, EyeOff } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Node } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { SynchronizedPreview } from './SynchronizedPreview';
import { DragDropUpload } from './DragDropUpload';

interface NodePropertiesPanelProps {
  node: Node;
  nodes: Node[];
  onUpdateNode: (nodeId: string, data: any) => void;
  onClose: () => void;
}

export function NodePropertiesPanel({ node, nodes, onUpdateNode, onClose }: NodePropertiesPanelProps) {
  const [localData, setLocalData] = useState(node.data);
  const [videos, setVideos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [viewFormat, setViewFormat] = useState<'desktop' | 'mobile'>('desktop');
  const [showOverlay, setShowOverlay] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setLocalData(node.data);
    loadVideos();
  }, [node.data]);

  const loadVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('Videos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('Videos')
        .insert({
          title: file.name,
          file_url: publicUrl,
          description: 'Uploaded from funnel builder',
          is_public: true // Mark funnel videos as public for viewing
        });

      if (dbError) throw dbError;

      await loadVideos();
      toast({
        title: "Video hochgeladen",
        description: "Das Video wurde erfolgreich hochgeladen.",
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Upload-Fehler",
        description: "Das Video konnte nicht hochgeladen werden.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const updateLocalData = (updates: any) => {
    const newData = { ...localData, ...updates };
    setLocalData(newData);
    // Live update for preview
    onUpdateNode(node.id, newData);
  };

  const addMultipleChoiceOption = () => {
    const currentAnswers = (localData.answers as string[]) || [];
    const newOption = `Option ${String.fromCharCode(65 + currentAnswers.length)}`;
    updateLocalData({
      answers: [...currentAnswers, newOption]
    });
  };

  const removeMultipleChoiceOption = (index: number) => {
    const currentAnswers = (localData.answers as string[]) || [];
    updateLocalData({
      answers: currentAnswers.filter((_, i) => i !== index)
    });
  };

  const updateMultipleChoiceOption = (index: number, value: string) => {
    const currentAnswers = (localData.answers as string[]) || [];
    const newAnswers = [...currentAnswers];
    newAnswers[index] = value;
    updateLocalData({
      answers: newAnswers
    });
  };

  const updateBranching = (answerIndex: number | string, nodeId: string) => {
    const currentNextNodes = (localData.nextNodes as Record<string, string>) || {};
    updateLocalData({
      nextNodes: {
        ...currentNextNodes,
        [answerIndex]: nodeId
      }
    });
  };

  const availableNodes = nodes.filter(n => n.id !== node.id);

  // LeadCapture node panel
  if (node.type === 'leadCapture') {
    return (
      <div className="w-80 bg-zinc-900 border-l border-zinc-800 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Lead Capture</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-white">Titel</Label>
            <Input
              value={(localData.title as string) || ''}
              onChange={(e) => updateLocalData({ title: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Kontaktdaten erfassen"
            />
          </div>
          
          <div>
            <Label className="text-white">Beschreibung</Label>
            <Textarea
              value={(localData.description as string) || ''}
              onChange={(e) => updateLocalData({ description: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Bitte geben Sie Ihre Daten ein"
              rows={3}
            />
          </div>

          <div>
            <Label className="text-white">Erforderliche Felder</Label>
            <div className="space-y-2">
              {['firstName', 'lastName', 'age', 'email', 'phone'].map((field) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={`field-${field}`}
                    checked={((localData.fields as string[]) || ['firstName', 'lastName', 'email']).includes(field)}
                    onCheckedChange={(checked) => {
                      const currentFields = (localData.fields as string[]) || ['firstName', 'lastName', 'email'];
                      const newFields = checked
                        ? [...currentFields, field]
                        : currentFields.filter(f => f !== field);
                      updateLocalData({ fields: newFields });
                    }}
                  />
                  <Label htmlFor={`field-${field}`} className="text-sm text-white">
                    {field === 'firstName' && 'Vorname'}
                    {field === 'lastName' && 'Nachname'}
                    {field === 'age' && 'Alter'}
                    {field === 'email' && 'E-Mail'}
                    {field === 'phone' && 'Telefon'}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (node.type === 'end') {
    return (
      <div className="w-80 bg-zinc-900 border-l border-zinc-800 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">End Node</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-white">Titel</Label>
            <Input
              value={(localData.title as string) || ''}
              onChange={(e) => updateLocalData({ title: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Vielen Dank!"
            />
          </div>

          <div>
            <Label className="text-white">Nachricht</Label>
            <Textarea
              value={(localData.message as string) || ''}
              onChange={(e) => updateLocalData({ message: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Sie haben den Funnel erfolgreich abgeschlossen."
              rows={3}
            />
          </div>

          <div>
            <Label className="text-white">Weiterleitung URL (optional)</Label>
            <Input
              value={(localData.redirectUrl as string) || ''}
              onChange={(e) => updateLocalData({ redirectUrl: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-zinc-800 border-l border-zinc-700 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-600/50 flex justify-between items-center bg-gradient-to-r from-purple-600/20 to-blue-600/20">
        <h2 className="text-lg font-semibold text-white">Node Settings</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-green-600/20 h-8 px-3 text-sm bg-green-600/10 border border-green-600/30"
        >
          <Check className="w-4 h-4 mr-1" />
          Done
        </Button>
      </div>

      {/* Node Name */}
      <div className="p-4 border-b border-zinc-600/50 bg-zinc-750">
        <Label className="text-white text-sm font-medium mb-2 block">Node Name</Label>
        <Input
          value={(localData.label as string) || ''}
          onChange={(e) => updateLocalData({ label: e.target.value })}
          className="bg-zinc-700 border-zinc-600 text-white focus:border-zinc-500"
          placeholder="Video Node"
        />
      </div>


      {/* Properties Panel Content */}
      <div className="flex-1">
        {/* Tabs */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="video" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-zinc-700 m-4 mb-0">
              <TabsTrigger value="video" className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Video className="w-4 h-4 mr-2" />
                Video
              </TabsTrigger>
              <TabsTrigger value="answer" className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Answer
              </TabsTrigger>
              <TabsTrigger value="logic" className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Logic
              </TabsTrigger>
            </TabsList>

            <TabsContent value="video" className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Video Upload */}
              <div>
                <Label className="text-white text-sm font-medium mb-3 block">Video Upload</Label>
                <DragDropUpload 
                  onVideoUploaded={(url, title) => {
                    updateLocalData({ videoUrl: url });
                    loadVideos(); // Refresh the video list
                  }}
                  className="mb-4"
                />
              </div>

              {/* Video Library */}
              {videos.length > 0 && (
                <div>
                  <Label className="text-white text-sm font-medium mb-3 block">Aus Bibliothek wählen</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        onClick={() => updateLocalData({ videoUrl: video.file_url })}
                        className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          localData.videoUrl === video.file_url 
                            ? 'border-purple-500 ring-2 ring-purple-500/20' 
                            : 'border-zinc-600 hover:border-zinc-500'
                        }`}
                      >
                        <video 
                          src={video.file_url} 
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          <p className="text-white text-xs truncate">{video.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual URL */}
              <div>
                <Label className="text-white text-sm font-medium mb-3 block">Video URL (manuell)</Label>
                <Input
                  value={(localData.videoUrl as string) || ''}
                  onChange={(e) => updateLocalData({ videoUrl: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="https://example.com/video.mp4"
                />
              </div>

              {/* Overlay Text Configuration */}
              <div className="space-y-4">
                <Label className="text-white text-sm font-medium mb-3 block">Overlay Text</Label>
                
                <div>
                  <Label className="text-white text-xs mb-2 block">Text</Label>
                  <Textarea
                    value={(localData.overlayText as string) || ''}
                    onChange={(e) => updateLocalData({ overlayText: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white resize-none"
                    placeholder="Was soll der Zuschauer tun oder denken?"
                    rows={2}
                  />
                </div>

                <div>
                  <Label className="text-white text-xs mb-2 block">Position</Label>
                  <Select
                    value={(localData.textPosition as string) || 'none'}
                    onValueChange={(value) => updateLocalData({ textPosition: value })}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectItem value="none">Ausgeblendet</SelectItem>
                      <SelectItem value="top-left">Oben Links</SelectItem>
                      <SelectItem value="top-center">Oben Mitte</SelectItem>
                      <SelectItem value="top-right">Oben Rechts</SelectItem>
                      <SelectItem value="middle-left">Mitte Links</SelectItem>
                      <SelectItem value="middle-center">Mitte Zentriert</SelectItem>
                      <SelectItem value="middle-right">Mitte Rechts</SelectItem>
                      <SelectItem value="bottom-left">Unten Links</SelectItem>
                      <SelectItem value="bottom-center">Unten Mitte</SelectItem>
                      <SelectItem value="bottom-right">Unten Rechts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white text-xs mb-2 block">Größe</Label>
                  <Select
                    value={(localData.textSize as string) || 'medium'}
                    onValueChange={(value) => updateLocalData({ textSize: value })}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectItem value="small">Klein</SelectItem>
                      <SelectItem value="medium">Mittel</SelectItem>
                      <SelectItem value="large">Groß</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white text-xs mb-2 block">Style</Label>
                  <Select
                    value={(localData.textStyle as string) || 'glassmorphism'}
                    onValueChange={(value) => updateLocalData({ textStyle: value })}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectItem value="glassmorphism">Glassmorphism</SelectItem>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Call to Action Configuration */}
              <div className="space-y-4">
                <Label className="text-white text-sm font-medium mb-3 block">Call to Action</Label>
                
                <div>
                  <Label className="text-white text-xs mb-2 block">Text</Label>
                  <Textarea
                    value={(localData.callToActionText as string) || ''}
                    onChange={(e) => updateLocalData({ callToActionText: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white resize-none"
                    placeholder="Call to Action Text..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label className="text-white text-xs mb-2 block">Position</Label>
                  <Select
                    value={(localData.callToActionPosition as string) || 'none'}
                    onValueChange={(value) => updateLocalData({ callToActionPosition: value })}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectItem value="none">Ausgeblendet</SelectItem>
                      <SelectItem value="top-left">Oben Links</SelectItem>
                      <SelectItem value="top-center">Oben Mitte</SelectItem>
                      <SelectItem value="top-right">Oben Rechts</SelectItem>
                      <SelectItem value="middle-left">Mitte Links</SelectItem>
                      <SelectItem value="middle-center">Mitte Zentriert</SelectItem>
                      <SelectItem value="middle-right">Mitte Rechts</SelectItem>
                      <SelectItem value="bottom-left">Unten Links</SelectItem>
                      <SelectItem value="bottom-center">Unten Mitte</SelectItem>
                      <SelectItem value="bottom-right">Unten Rechts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white text-xs mb-2 block">Größe</Label>
                  <Select
                    value={(localData.callToActionSize as string) || 'medium'}
                    onValueChange={(value) => updateLocalData({ callToActionSize: value })}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectItem value="small">Klein</SelectItem>
                      <SelectItem value="medium">Mittel</SelectItem>
                      <SelectItem value="large">Groß</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="answer" className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Answer Type */}
              <div>
                <Label className="text-white text-sm font-medium mb-3 block">Antwort-Typ</Label>
                <Select
                  value={(localData.answerType as string) || 'button'}
                  onValueChange={(value) => updateLocalData({ answerType: value })}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 text-white z-50">
                    <SelectItem value="button">Single Button</SelectItem>
                    <SelectItem value="multipleChoice">Multiple Choice</SelectItem>
                    <SelectItem value="yesno">Yes/No</SelectItem>
                    <SelectItem value="text">Text Input</SelectItem>
                    <SelectItem value="email">E-Mail</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="budgetSlider">Budget-Slider</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Button Configuration */}
              {localData.answerType === 'button' && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-white text-sm font-medium mb-2 block">Button Text</Label>
                    <Input
                      value={(localData.buttonText as string) || ''}
                      onChange={(e) => updateLocalData({ buttonText: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                      placeholder="Weiter"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-2 block">Button Farbe</Label>
                    <Select
                      value={(localData.buttonColor as string) || 'purple'}
                      onValueChange={(value) => updateLocalData({ buttonColor: value })}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectItem value="purple">Lila</SelectItem>
                        <SelectItem value="blue">Blau</SelectItem>
                        <SelectItem value="green">Grün</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="red">Rot</SelectItem>
                        <SelectItem value="white">Weiß</SelectItem>
                        <SelectItem value="yellow">Gelb</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-2 block">Button Style</Label>
                    <Select
                      value={(localData.buttonStyle as string) || 'glassmorphism'}
                      onValueChange={(value) => updateLocalData({ buttonStyle: value })}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectItem value="glassmorphism">Glassmorphism</SelectItem>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                        <SelectItem value="gradient">Gradient</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-2 block">Button Maße</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-white text-xs mb-2 block">Höhe</Label>
                        <Select
                          value={(localData.buttonHeight as string) || 'medium'}
                          onValueChange={(value) => updateLocalData({ buttonHeight: value })}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectItem value="xs">XS (24px)</SelectItem>
                            <SelectItem value="small">S (28px)</SelectItem>
                            <SelectItem value="medium">M (36px)</SelectItem>
                            <SelectItem value="large">L (44px)</SelectItem>
                            <SelectItem value="xl">XL (52px)</SelectItem>
                            <SelectItem value="2xl">2XL (60px)</SelectItem>
                            <SelectItem value="3xl">3XL (72px)</SelectItem>
                            <SelectItem value="4xl">4XL (84px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white text-xs mb-2 block">Breite</Label>
                        <Select
                          value={(localData.buttonWidth as string) || 'auto'}
                          onValueChange={(value) => updateLocalData({ buttonWidth: value })}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectItem value="auto">Auto</SelectItem>
                            <SelectItem value="xs">XS (80px)</SelectItem>
                            <SelectItem value="small">S (120px)</SelectItem>
                            <SelectItem value="medium">M (160px)</SelectItem>
                            <SelectItem value="large">L (200px)</SelectItem>
                            <SelectItem value="xl">XL (240px)</SelectItem>
                            <SelectItem value="2xl">2XL (280px)</SelectItem>
                            <SelectItem value="3xl">3XL (320px)</SelectItem>
                            <SelectItem value="4xl">4XL (360px)</SelectItem>
                            <SelectItem value="full">Volle Breite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Label className="text-white text-xs mb-2 block">Textgröße</Label>
                      <Select
                        value={(localData.buttonTextSize as string) || 'small'}
                        onValueChange={(value) => updateLocalData({ buttonTextSize: value })}
                      >
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectItem value="xs">XS (10px)</SelectItem>
                          <SelectItem value="small">Klein (12px)</SelectItem>
                          <SelectItem value="medium">Mittel (14px)</SelectItem>
                          <SelectItem value="large">Groß (16px)</SelectItem>
                          <SelectItem value="xl">XL (18px)</SelectItem>
                          <SelectItem value="2xl">2XL (20px)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-2 block">Button Position</Label>
                    <Select
                      value={(localData.buttonPosition as string) || 'bottom-center'}
                      onValueChange={(value) => updateLocalData({ buttonPosition: value })}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectItem value="top-left">Oben Links</SelectItem>
                        <SelectItem value="top-center">Oben Mitte</SelectItem>
                        <SelectItem value="top-right">Oben Rechts</SelectItem>
                        <SelectItem value="middle-left">Mitte Links</SelectItem>
                        <SelectItem value="middle-center">Mitte Zentriert</SelectItem>
                        <SelectItem value="middle-right">Mitte Rechts</SelectItem>
                        <SelectItem value="bottom-left">Unten Links</SelectItem>
                        <SelectItem value="bottom-center">Unten Mitte</SelectItem>
                        <SelectItem value="bottom-right">Unten Rechts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Yes/No Configuration */}
              {localData.answerType === 'yesno' && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-white text-sm font-medium mb-3 block">Button Texte</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-white text-xs mb-2 block">Yes Button</Label>
                        <Input
                          value={(localData.yesText as string) || 'Ja'}
                          onChange={(e) => updateLocalData({ yesText: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white text-sm"
                          placeholder="Ja"
                        />
                      </div>
                      <div>
                        <Label className="text-white text-xs mb-2 block">No Button</Label>
                        <Input
                          value={(localData.noText as string) || 'Nein'}
                          onChange={(e) => updateLocalData({ noText: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white text-sm"
                          placeholder="Nein"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-3 block">Yes Button Styling</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-white text-xs mb-2 block">Farbe</Label>
                        <Select
                          value={(localData.yesColor as string) || 'green'}
                          onValueChange={(value) => updateLocalData({ yesColor: value })}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectItem value="purple">Lila</SelectItem>
                            <SelectItem value="blue">Blau</SelectItem>
                            <SelectItem value="green">Grün</SelectItem>
                            <SelectItem value="orange">Orange</SelectItem>
                            <SelectItem value="red">Rot</SelectItem>
                            <SelectItem value="white">Weiß</SelectItem>
                            <SelectItem value="yellow">Gelb</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white text-xs mb-2 block">Style</Label>
                        <Select
                          value={(localData.yesStyle as string) || 'glassmorphism'}
                          onValueChange={(value) => updateLocalData({ yesStyle: value })}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectItem value="glassmorphism">Glassmorphism</SelectItem>
                            <SelectItem value="solid">Solid</SelectItem>
                            <SelectItem value="outline">Outline</SelectItem>
                            <SelectItem value="gradient">Gradient</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-3 block">No Button Styling</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-white text-xs mb-2 block">Farbe</Label>
                        <Select
                          value={(localData.noColor as string) || 'red'}
                          onValueChange={(value) => updateLocalData({ noColor: value })}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectItem value="purple">Lila</SelectItem>
                            <SelectItem value="blue">Blau</SelectItem>
                            <SelectItem value="green">Grün</SelectItem>
                            <SelectItem value="orange">Orange</SelectItem>
                            <SelectItem value="red">Rot</SelectItem>
                            <SelectItem value="white">Weiß</SelectItem>
                            <SelectItem value="yellow">Gelb</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white text-xs mb-2 block">Style</Label>
                        <Select
                          value={(localData.noStyle as string) || 'glassmorphism'}
                          onValueChange={(value) => updateLocalData({ noStyle: value })}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectItem value="glassmorphism">Glassmorphism</SelectItem>
                            <SelectItem value="solid">Solid</SelectItem>
                            <SelectItem value="outline">Outline</SelectItem>
                            <SelectItem value="gradient">Gradient</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-3 block">Layout & Position</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-white text-xs mb-2 block">Layout</Label>
                        <Select
                          value={(localData.yesnoLayout as string) || 'horizontal'}
                          onValueChange={(value) => updateLocalData({ yesnoLayout: value })}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectItem value="horizontal">Horizontal</SelectItem>
                            <SelectItem value="vertical">Vertikal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white text-xs mb-2 block">Breite</Label>
                        <Select
                          value={(localData.yesnoWidth as string) || 'full'}
                          onValueChange={(value) => updateLocalData({ yesnoWidth: value })}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectItem value="auto">Auto</SelectItem>
                            <SelectItem value="xs">XS (80px)</SelectItem>
                            <SelectItem value="small">S (120px)</SelectItem>
                            <SelectItem value="medium">M (160px)</SelectItem>
                            <SelectItem value="large">L (200px)</SelectItem>
                            <SelectItem value="xl">XL (240px)</SelectItem>
                            <SelectItem value="2xl">2XL (280px)</SelectItem>
                            <SelectItem value="full">Volle Breite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <Label className="text-white text-xs mb-2 block">Höhe</Label>
                        <Select
                          value={(localData.yesnoHeight as string) || 'medium'}
                          onValueChange={(value) => updateLocalData({ yesnoHeight: value })}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectItem value="xs">XS (24px)</SelectItem>
                            <SelectItem value="small">S (28px)</SelectItem>
                            <SelectItem value="medium">M (36px)</SelectItem>
                            <SelectItem value="large">L (44px)</SelectItem>
                            <SelectItem value="xl">XL (52px)</SelectItem>
                            <SelectItem value="2xl">2XL (60px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white text-xs mb-2 block">Textgröße</Label>
                        <Select
                          value={(localData.yesnoTextSize as string) || 'small'}
                          onValueChange={(value) => updateLocalData({ yesnoTextSize: value })}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectItem value="xs">XS (10px)</SelectItem>
                            <SelectItem value="small">Klein (12px)</SelectItem>
                            <SelectItem value="medium">Mittel (14px)</SelectItem>
                            <SelectItem value="large">Groß (16px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Text/Email Configuration */}
              {(localData.answerType === 'text' || localData.answerType === 'email') && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-white text-sm font-medium mb-2 block">Placeholder Text</Label>
                    <Input
                      value={(localData.placeholder as string) || ''}
                      onChange={(e) => updateLocalData({ placeholder: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                      placeholder={localData.answerType === 'email' ? 'E-Mail eingeben...' : 'Text eingeben...'}
                    />
                  </div>

                  {/* Input Field Size Controls */}
                  <div>
                    <Label className="text-white text-sm font-medium mb-3 block">Eingabefeld Größe</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-white text-xs mb-2 block">Höhe</Label>
                        <Select
                          value={(localData.inputHeight as string) || 'medium'}
                          onValueChange={(value) => updateLocalData({ inputHeight: value })}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectItem value="xs">XS (24px)</SelectItem>
                            <SelectItem value="small">S (28px)</SelectItem>
                            <SelectItem value="medium">M (36px)</SelectItem>
                            <SelectItem value="large">L (44px)</SelectItem>
                            <SelectItem value="xl">XL (52px)</SelectItem>
                            <SelectItem value="2xl">2XL (60px)</SelectItem>
                            <SelectItem value="3xl">3XL (72px)</SelectItem>
                            <SelectItem value="4xl">4XL (84px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white text-xs mb-2 block">Breite</Label>
                        <Select
                          value={(localData.inputWidth as string) || 'full'}
                          onValueChange={(value) => updateLocalData({ inputWidth: value })}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectItem value="small">S (200px)</SelectItem>
                            <SelectItem value="medium">M (280px)</SelectItem>
                            <SelectItem value="large">L (320px)</SelectItem>
                            <SelectItem value="xl">XL (400px)</SelectItem>
                            <SelectItem value="full">Volle Breite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Label className="text-white text-xs mb-2 block">Textgröße</Label>
                      <Select
                        value={(localData.inputTextSize as string) || 'small'}
                        onValueChange={(value) => updateLocalData({ inputTextSize: value })}
                      >
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectItem value="xs">XS (10px)</SelectItem>
                          <SelectItem value="small">Klein (12px)</SelectItem>
                          <SelectItem value="medium">Mittel (14px)</SelectItem>
                          <SelectItem value="large">Groß (16px)</SelectItem>
                          <SelectItem value="xl">XL (18px)</SelectItem>
                          <SelectItem value="2xl">2XL (20px)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-3 block">Submit Button</Label>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-white text-xs mb-2 block">Button Text</Label>
                        <Input
                          value={(localData.submitButtonText as string) || ''}
                          onChange={(e) => updateLocalData({ submitButtonText: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white text-sm"
                          placeholder="Senden"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-white text-xs mb-2 block">Farbe</Label>
                          <Select
                            value={(localData.submitButtonColor as string) || 'purple'}
                            onValueChange={(value) => updateLocalData({ submitButtonColor: value })}
                          >
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectItem value="purple">Lila</SelectItem>
                              <SelectItem value="blue">Blau</SelectItem>
                              <SelectItem value="green">Grün</SelectItem>
                              <SelectItem value="orange">Orange</SelectItem>
                              <SelectItem value="red">Rot</SelectItem>
                              <SelectItem value="white">Weiß</SelectItem>
                              <SelectItem value="yellow">Gelb</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white text-xs mb-2 block">Style</Label>
                          <Select
                            value={(localData.submitButtonStyle as string) || 'glassmorphism'}
                            onValueChange={(value) => updateLocalData({ submitButtonStyle: value })}
                          >
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectItem value="glassmorphism">Glassmorphism</SelectItem>
                              <SelectItem value="solid">Solid</SelectItem>
                              <SelectItem value="outline">Outline</SelectItem>
                              <SelectItem value="gradient">Gradient</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-white text-xs mb-2 block">Höhe</Label>
                          <Select
                            value={(localData.submitButtonHeight as string) || 'medium'}
                            onValueChange={(value) => updateLocalData({ submitButtonHeight: value })}
                          >
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectItem value="xs">XS (24px)</SelectItem>
                              <SelectItem value="small">S (28px)</SelectItem>
                              <SelectItem value="medium">M (36px)</SelectItem>
                              <SelectItem value="large">L (44px)</SelectItem>
                              <SelectItem value="xl">XL (52px)</SelectItem>
                              <SelectItem value="2xl">2XL (60px)</SelectItem>
                              <SelectItem value="3xl">3XL (72px)</SelectItem>
                              <SelectItem value="4xl">4XL (84px)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white text-xs mb-2 block">Breite</Label>
                          <Select
                            value={(localData.submitButtonWidth as string) || 'full'}
                            onValueChange={(value) => updateLocalData({ submitButtonWidth: value })}
                          >
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectItem value="auto">Auto</SelectItem>
                              <SelectItem value="xs">XS (80px)</SelectItem>
                              <SelectItem value="small">S (120px)</SelectItem>
                              <SelectItem value="medium">M (160px)</SelectItem>
                              <SelectItem value="large">L (200px)</SelectItem>
                              <SelectItem value="xl">XL (240px)</SelectItem>
                              <SelectItem value="2xl">2XL (280px)</SelectItem>
                              <SelectItem value="3xl">3XL (320px)</SelectItem>
                              <SelectItem value="4xl">4XL (360px)</SelectItem>
                              <SelectItem value="full">Volle Breite</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-white text-xs mb-2 block">Textgröße</Label>
                        <Select
                          value={(localData.submitButtonTextSize as string) || 'small'}
                          onValueChange={(value) => updateLocalData({ submitButtonTextSize: value })}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectItem value="xs">XS (10px)</SelectItem>
                          <SelectItem value="small">Klein (12px)</SelectItem>
                          <SelectItem value="medium">Mittel (14px)</SelectItem>
                          <SelectItem value="large">Groß (16px)</SelectItem>
                          <SelectItem value="xl">XL (18px)</SelectItem>
                          <SelectItem value="2xl">2XL (20px)</SelectItem>
                        </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rating Configuration */}
              {localData.answerType === 'rating' && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-white text-sm font-medium mb-2 block">Rating Einstellungen</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-white text-xs mb-2 block">Max. Rating</Label>
                        <Select
                          value={(localData.maxRating as string) || '5'}
                          onValueChange={(value) => updateLocalData({ maxRating: value })}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectItem value="3">3 Sterne</SelectItem>
                            <SelectItem value="5">5 Sterne</SelectItem>
                            <SelectItem value="10">10 Sterne</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-3 block">Submit Button</Label>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-white text-xs mb-2 block">Button Text</Label>
                        <Input
                          value={(localData.ratingSubmitText as string) || ''}
                          onChange={(e) => updateLocalData({ ratingSubmitText: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white text-sm"
                          placeholder="Bewertung abgeben"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-white text-xs mb-2 block">Farbe</Label>
                          <Select
                            value={(localData.ratingSubmitColor as string) || 'purple'}
                            onValueChange={(value) => updateLocalData({ ratingSubmitColor: value })}
                          >
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectItem value="purple">Lila</SelectItem>
                              <SelectItem value="blue">Blau</SelectItem>
                              <SelectItem value="green">Grün</SelectItem>
                              <SelectItem value="orange">Orange</SelectItem>
                              <SelectItem value="red">Rot</SelectItem>
                              <SelectItem value="white">Weiß</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white text-xs mb-2 block">Style</Label>
                          <Select
                            value={(localData.ratingSubmitStyle as string) || 'glassmorphism'}
                            onValueChange={(value) => updateLocalData({ ratingSubmitStyle: value })}
                          >
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectItem value="glassmorphism">Glassmorphism</SelectItem>
                              <SelectItem value="solid">Solid</SelectItem>
                              <SelectItem value="outline">Outline</SelectItem>
                              <SelectItem value="gradient">Gradient</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Budget Slider Configuration */}
              {localData.answerType === 'budgetSlider' && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-white text-sm font-medium mb-2 block">Slider Einstellungen</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-white text-xs mb-2 block">Min (€)</Label>
                        <Input
                          type="number"
                          value={(localData.sliderMin as number) || 0}
                          onChange={(e) => updateLocalData({ sliderMin: Number(e.target.value) })}
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white text-xs mb-2 block">Max (€)</Label>
                        <Input
                          type="number"
                          value={(localData.sliderMax as number) || 10000}
                          onChange={(e) => updateLocalData({ sliderMax: Number(e.target.value) })}
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <Label className="text-white text-xs mb-2 block">Schrittweite (€)</Label>
                      <Select
                        value={String((localData.sliderStep as number) || 100)}
                        onValueChange={(value) => updateLocalData({ sliderStep: Number(value) })}
                      >
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectItem value="50">€50</SelectItem>
                          <SelectItem value="100">€100</SelectItem>
                          <SelectItem value="250">€250</SelectItem>
                          <SelectItem value="500">€500</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-3 block">Submit Button</Label>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-white text-xs mb-2 block">Button Text</Label>
                        <Input
                          value={(localData.sliderSubmitText as string) || 'Weiter'}
                          onChange={(e) => updateLocalData({ sliderSubmitText: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white text-sm"
                          placeholder="Weiter"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-white text-xs mb-2 block">Farbe</Label>
                          <Select
                            value={(localData.sliderSubmitColor as string) || 'purple'}
                            onValueChange={(value) => updateLocalData({ sliderSubmitColor: value })}
                          >
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectItem value="purple">Lila</SelectItem>
                              <SelectItem value="blue">Blau</SelectItem>
                              <SelectItem value="green">Grün</SelectItem>
                              <SelectItem value="orange">Orange</SelectItem>
                              <SelectItem value="red">Rot</SelectItem>
                              <SelectItem value="white">Weiß</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white text-xs mb-2 block">Style</Label>
                          <Select
                            value={(localData.sliderSubmitStyle as string) || 'glassmorphism'}
                            onValueChange={(value) => updateLocalData({ sliderSubmitStyle: value })}
                          >
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectItem value="glassmorphism">Glassmorphism</SelectItem>
                              <SelectItem value="solid">Solid</SelectItem>
                              <SelectItem value="outline">Outline</SelectItem>
                              <SelectItem value="gradient">Gradient</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Budget Zone Preview */}
                  <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-700/50">
                    <Label className="text-white text-xs mb-2 block">Budget-Zonen Vorschau</Label>
                    <div className="flex gap-1 text-[10px]">
                      <div className="flex-1 bg-red-500/30 rounded p-1 text-center text-red-300">⚠️ Wenig<br/>€0-500</div>
                      <div className="flex-1 bg-orange-500/30 rounded p-1 text-center text-orange-300">🌱 Starter<br/>€500-1.5k</div>
                      <div className="flex-1 bg-green-500/30 rounded p-1 text-center text-green-300">✅ Solide<br/>€1.5k-4k</div>
                      <div className="flex-1 bg-cyan-500/30 rounded p-1 text-center text-cyan-300">💎 Platin<br/>€4k-7k</div>
                      <div className="flex-1 bg-yellow-500/30 rounded p-1 text-center text-yellow-300">👑 Gold<br/>€7k-10k</div>
                    </div>
                  </div>
                </div>
              )}


              {/* Multiple Choice Configuration */}
              {localData.answerType === 'multipleChoice' && (
                <div className="space-y-6">
                  {/* Multiple Choice Options */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-white text-sm font-medium">Antwort-Optionen</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addMultipleChoiceOption}
                        className="bg-purple-600/20 border-purple-600/50 text-purple-300 hover:bg-purple-600/30 hover:border-purple-500"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Option
                      </Button>
                    </div>
                    
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {((localData.answers as string[]) || []).map((answer: string, index: number) => (
                        <div key={index} className="group">
                          {/* Option Header */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center justify-center w-6 h-6 glass-effect rounded-lg text-white text-xs font-bold border border-purple-500/30">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <Label className="text-white text-xs font-medium">Option {String.fromCharCode(65 + index)}</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMultipleChoiceOption(index)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20 h-6 w-6 p-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          {/* Option Configuration */}
                          <div className="bg-zinc-800/50 rounded-lg p-3 space-y-3 border border-zinc-700/50">
                            <div>
                              <Label className="text-white text-xs mb-1 block">Text</Label>
                              <Input
                                value={answer}
                                onChange={(e) => updateMultipleChoiceOption(index, e.target.value)}
                                className="bg-zinc-800 border-zinc-700 text-white h-8 text-sm"
                                placeholder={`Option ${String.fromCharCode(65 + index)} Text`}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              {/* Individual Button Color */}
                              <div>
                                <Label className="text-white text-xs mb-1 block">Farbe</Label>
                                <Select
                                  value={(localData[`mcColor_${index}`] as string) || 'purple'}
                                  onValueChange={(value) => updateLocalData({ [`mcColor_${index}`]: value })}
                                >
                                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                    <SelectItem value="purple">Lila</SelectItem>
                                    <SelectItem value="blue">Blau</SelectItem>
                                    <SelectItem value="green">Grün</SelectItem>
                                    <SelectItem value="orange">Orange</SelectItem>
                                    <SelectItem value="red">Rot</SelectItem>
                                    <SelectItem value="white">Weiß</SelectItem>
                                    <SelectItem value="yellow">Gelb</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              {/* Individual Button Style */}
                              <div>
                                <Label className="text-white text-xs mb-1 block">Style</Label>
                                <Select
                                  value={(localData[`mcStyle_${index}`] as string) || 'glassmorphism'}
                                  onValueChange={(value) => updateLocalData({ [`mcStyle_${index}`]: value })}
                                >
                                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                    <SelectItem value="glassmorphism">Glas</SelectItem>
                                    <SelectItem value="solid">Solide</SelectItem>
                                    <SelectItem value="gradient">Gradient</SelectItem>
                                    <SelectItem value="outline">Umriss</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {((localData.answers as string[]) || []).length === 0 && (
                      <div className="text-center py-6 text-zinc-400">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Keine Optionen erstellt</p>
                        <p className="text-xs opacity-75">Klicken Sie "+ Option" um zu beginnen</p>
                      </div>
                    )}
                  </div>

                  {/* Multiple Choice Global Settings */}
                  <div className="space-y-4 border-t border-zinc-700/50 pt-4">
                    <Label className="text-white text-sm font-medium block">Layout Einstellungen</Label>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {/* Button Height */}
                      <div>
                        <Label className="text-white text-xs mb-2 block">Höhe</Label>
                        <Select
                          value={(localData.mcButtonHeight as string) || 'medium'}
                          onValueChange={(value) => updateLocalData({ mcButtonHeight: value })}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 text-white z-50">
                            <SelectItem value="xs">XS (24px)</SelectItem>
                            <SelectItem value="small">S (28px)</SelectItem>
                            <SelectItem value="medium">M (36px)</SelectItem>
                            <SelectItem value="large">L (44px)</SelectItem>
                            <SelectItem value="xl">XL (52px)</SelectItem>
                            <SelectItem value="2xl">2XL (60px)</SelectItem>
                            <SelectItem value="3xl">3XL (72px)</SelectItem>
                            <SelectItem value="4xl">4XL (84px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Text Size */}
                      <div>
                        <Label className="text-white text-xs mb-2 block">Textgröße</Label>
                        <Select
                          value={(localData.mcTextSize as string) || 'small'}
                          onValueChange={(value) => updateLocalData({ mcTextSize: value })}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 text-white z-50">
                            <SelectItem value="xs">XS (10px)</SelectItem>
                            <SelectItem value="small">Klein (12px)</SelectItem>
                            <SelectItem value="medium">Mittel (14px)</SelectItem>
                            <SelectItem value="large">Groß (16px)</SelectItem>
                            <SelectItem value="xl">XL (18px)</SelectItem>
                            <SelectItem value="2xl">2XL (20px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Layout Direction */}
                      <div>
                        <Label className="text-white text-xs mb-2 block">Layout</Label>
                        <Select
                          value={(localData.mcLayout as string) || 'vertical'}
                          onValueChange={(value) => updateLocalData({ mcLayout: value })}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectItem value="vertical">Vertikal</SelectItem>
                            <SelectItem value="horizontal">Horizontal</SelectItem>
                            <SelectItem value="grid">Grid 2x2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Button Width */}
                    <div>
                      <Label className="text-white text-xs mb-2 block">Button Breite</Label>
                      <Select
                        value={(localData.mcButtonWidth as string) || 'auto'}
                        onValueChange={(value) => updateLocalData({ mcButtonWidth: value })}
                      >
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white z-50">
                          <SelectItem value="auto">Auto</SelectItem>
                          <SelectItem value="xs">XS (80px)</SelectItem>
                          <SelectItem value="small">S (120px)</SelectItem>
                          <SelectItem value="medium">M (160px)</SelectItem>
                          <SelectItem value="large">L (200px)</SelectItem>
                          <SelectItem value="xl">XL (240px)</SelectItem>
                          <SelectItem value="2xl">2XL (280px)</SelectItem>
                          <SelectItem value="3xl">3XL (320px)</SelectItem>
                          <SelectItem value="4xl">4XL (360px)</SelectItem>
                          <SelectItem value="full">Volle Breite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Position Grid für Multiple Choice */}
                    <div>
                      <Label className="text-white text-xs mb-2 block">Position</Label>
                      <div className="grid grid-cols-3 gap-1 p-2 bg-zinc-700/30 rounded-lg max-w-[120px]">
                        {(['top-left', 'top-center', 'top-right', 'middle-left', 'middle-center', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right'] as const).map((position) => (
                          <button
                            key={position}
                            onClick={() => updateLocalData({ mcPosition: position })}
                            className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                              (localData.mcPosition as string) === position || (!localData.mcPosition && position === 'bottom-center')
                                ? 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-500/30'
                                : 'bg-zinc-700 border-zinc-600 hover:border-zinc-500 hover:bg-zinc-600'
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full mx-auto transition-colors ${
                                (localData.mcPosition as string) === position || (!localData.mcPosition && position === 'bottom-center') ? 'bg-white' : 'bg-zinc-400'
                              }`}
                              style={{
                                marginTop: position.includes('top') ? '2px' : position.includes('middle') ? '10px' : '18px',
                                marginLeft: position.includes('left') ? '2px' : position.includes('center') ? '10px' : '18px'
                              }}
                            />
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-zinc-400 mt-2">Position der Multiple Choice Button-Gruppe</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Text Input Configuration */}
              {localData.answerType === 'text' && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-white text-sm font-medium mb-3 block">Placeholder Text</Label>
                    <Input
                      value={(localData.placeholder as string) || ''}
                      onChange={(e) => updateLocalData({ placeholder: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      placeholder="Ihre Antwort hier eingeben..."
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white text-sm">Langes Textfeld (Textarea)</Label>
                    <Switch
                      checked={localData.longText as boolean}
                      onCheckedChange={(checked) => updateLocalData({ longText: checked })}
                    />
                  </div>
                </div>
              )}

              {/* Rating Configuration */}
              {localData.answerType === 'rating' && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-white text-sm font-medium mb-3 block">Maximum Rating</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[parseInt((localData.maxRating as string) || '5')]}
                        onValueChange={(value) => updateLocalData({ maxRating: value[0].toString() })}
                        max={10}
                        min={3}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-center text-zinc-400 text-sm">
                        {(localData.maxRating as string) || '5'} {parseInt((localData.maxRating as string) || '5') <= 5 ? 'Sterne' : 'Punkte'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-2 block">Submit Button Text</Label>
                    <Input
                      value={(localData.ratingSubmitText as string) || 'Bewertung abgeben'}
                      onChange={(e) => updateLocalData({ ratingSubmitText: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                      placeholder="Bewertung abgeben"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-2 block">Submit Button Farbe</Label>
                    <Select
                      value={(localData.ratingSubmitColor as string) || 'purple'}
                      onValueChange={(value) => updateLocalData({ ratingSubmitColor: value })}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectItem value="purple">Lila</SelectItem>
                        <SelectItem value="blue">Blau</SelectItem>
                        <SelectItem value="green">Grün</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="red">Rot</SelectItem>
                        <SelectItem value="white">Weiß</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-2 block">Submit Button Style</Label>
                    <Select
                      value={(localData.ratingSubmitStyle as string) || 'glassmorphism'}
                      onValueChange={(value) => updateLocalData({ ratingSubmitStyle: value })}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectItem value="glassmorphism">Glassmorphism</SelectItem>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                        <SelectItem value="gradient">Gradient</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-sm font-medium mb-2 block">Rating Position</Label>
                    <Select
                      value={(localData.buttonPosition as string) || 'bottom-center'}
                      onValueChange={(value) => updateLocalData({ buttonPosition: value })}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectItem value="top-left">Oben Links</SelectItem>
                        <SelectItem value="top-center">Oben Mitte</SelectItem>
                        <SelectItem value="top-right">Oben Rechts</SelectItem>
                        <SelectItem value="middle-left">Mitte Links</SelectItem>
                        <SelectItem value="middle-center">Mitte Zentriert</SelectItem>
                        <SelectItem value="middle-right">Mitte Rechts</SelectItem>
                        <SelectItem value="bottom-left">Unten Links</SelectItem>
                        <SelectItem value="bottom-center">Unten Mitte</SelectItem>
                        <SelectItem value="bottom-right">Unten Rechts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Advanced Settings */}
              <div className="space-y-4 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
                <h4 className="text-white text-sm font-medium flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Erweiterte Einstellungen
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-white text-sm">Kontaktdaten sammeln</Label>
                    <Switch
                      checked={localData.collectContactDetails as boolean}
                      onCheckedChange={(checked) => updateLocalData({ collectContactDetails: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white text-sm">Datensammlung überspringen</Label>
                    <Switch
                      checked={localData.skipDataCollection as boolean}
                      onCheckedChange={(checked) => updateLocalData({ skipDataCollection: checked })}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white text-sm font-medium mb-2 block flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Verzögerung (Sekunden)
                  </Label>
                  <Slider
                    value={[parseInt((localData.delaySeconds as string) || '0')]}
                    onValueChange={(value) => updateLocalData({ delaySeconds: value[0] })}
                    max={120}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center text-zinc-400 text-xs mt-1">
                    {(localData.delaySeconds as number) || 0} Sekunden
                  </div>
                </div>

                {/* Timed Visibility Feature */}
                <div className="space-y-3 border-t border-zinc-700/50 pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-400" />
                      Zeitgesteuerte Sichtbarkeit
                    </Label>
                    <Switch
                      checked={localData.timedVisibility as boolean}
                      onCheckedChange={(checked) => updateLocalData({ timedVisibility: checked })}
                    />
                  </div>
                  
                  {localData.timedVisibility && (
                    <div className="space-y-3 bg-zinc-800/50 rounded-lg p-3 border border-orange-500/30">
                      <p className="text-xs text-zinc-400">
                        Die Antwort-Optionen erscheinen nur in einem bestimmten Zeitfenster des Videos.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-white text-xs mb-1 block">Start bei (Sek.)</Label>
                          <Input
                            type="number"
                            value={(localData.visibilityStartTime as number) || 0}
                            onChange={(e) => updateLocalData({ visibilityStartTime: parseInt(e.target.value) || 0 })}
                            className="bg-zinc-800 border-zinc-700 text-white h-8 text-sm"
                            min={0}
                            placeholder="5"
                          />
                        </div>
                        <div>
                          <Label className="text-white text-xs mb-1 block">Sichtbar für (Sek.)</Label>
                          <Input
                            type="number"
                            value={(localData.visibilityDuration as number) || 10}
                            onChange={(e) => updateLocalData({ visibilityDuration: parseInt(e.target.value) || 10 })}
                            className="bg-zinc-800 border-zinc-700 text-white h-8 text-sm"
                            min={1}
                            placeholder="10"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-white text-xs">Countdown-Timer anzeigen</Label>
                        <Switch
                          checked={localData.showCountdownTimer as boolean ?? true}
                          onCheckedChange={(checked) => updateLocalData({ showCountdownTimer: checked })}
                        />
                      </div>
                      
                      <div className="text-xs text-orange-400 bg-orange-500/10 p-2 rounded">
                        ⏱️ Frage 1: Sek. {(localData.visibilityStartTime as number) || 0} - {((localData.visibilityStartTime as number) || 0) + ((localData.visibilityDuration as number) || 10)}
                      </div>

                      {/* Frage 2 Configuration */}
                      <div className="border-t border-orange-500/30 pt-3 mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-white text-sm font-medium flex items-center gap-2">
                            Frage 2
                          </Label>
                          <Switch
                            checked={localData.question2Enabled as boolean}
                            onCheckedChange={(checked) => updateLocalData({ question2Enabled: checked })}
                          />
                        </div>

                        {localData.question2Enabled && (
                          <div className="space-y-3 bg-zinc-900/50 rounded-lg p-3 border border-blue-500/30">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-white text-xs mb-1 block">Start bei (Sek.)</Label>
                                <Input
                                  type="number"
                                  value={(localData.q2StartTime as number) || 0}
                                  onChange={(e) => updateLocalData({ q2StartTime: parseInt(e.target.value) || 0 })}
                                  className="bg-zinc-800 border-zinc-700 text-white h-8 text-sm"
                                  min={0}
                                />
                              </div>
                              <div>
                                <Label className="text-white text-xs mb-1 block">Sichtbar für (Sek.)</Label>
                                <Input
                                  type="number"
                                  value={(localData.q2Duration as number) || 10}
                                  onChange={(e) => updateLocalData({ q2Duration: parseInt(e.target.value) || 10 })}
                                  className="bg-zinc-800 border-zinc-700 text-white h-8 text-sm"
                                  min={1}
                                />
                              </div>
                            </div>

                            <div>
                              <Label className="text-white text-xs mb-1 block">Antwort-Typ</Label>
                              <Select
                                value={(localData.q2AnswerType as string) || 'button'}
                                onValueChange={(value) => updateLocalData({ q2AnswerType: value })}
                              >
                                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700 text-white z-50">
                                  <SelectItem value="button">Single Button</SelectItem>
                                  <SelectItem value="multipleChoice">Multiple Choice</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {(localData.q2AnswerType as string) === 'button' && (
                              <div className="space-y-2">
                                <div>
                                  <Label className="text-white text-xs mb-1 block">Button Text</Label>
                                  <Input
                                    value={(localData.q2ButtonText as string) || 'Weiter'}
                                    onChange={(e) => updateLocalData({ q2ButtonText: e.target.value })}
                                    className="bg-zinc-800 border-zinc-700 text-white h-8 text-sm"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label className="text-white text-xs mb-1 block">Farbe</Label>
                                    <Select
                                      value={(localData.q2ButtonColor as string) || 'blue'}
                                      onValueChange={(value) => updateLocalData({ q2ButtonColor: value })}
                                    >
                                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-8 text-sm">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                        <SelectItem value="purple">Lila</SelectItem>
                                        <SelectItem value="blue">Blau</SelectItem>
                                        <SelectItem value="green">Grün</SelectItem>
                                        <SelectItem value="orange">Orange</SelectItem>
                                        <SelectItem value="red">Rot</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label className="text-white text-xs mb-1 block">Style</Label>
                                    <Select
                                      value={(localData.q2ButtonStyle as string) || 'glassmorphism'}
                                      onValueChange={(value) => updateLocalData({ q2ButtonStyle: value })}
                                    >
                                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-8 text-sm">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                        <SelectItem value="glassmorphism">Glas</SelectItem>
                                        <SelectItem value="solid">Solide</SelectItem>
                                        <SelectItem value="gradient">Gradient</SelectItem>
                                        <SelectItem value="outline">Umriss</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-white text-xs mb-1 block">Position</Label>
                                  <Select
                                    value={(localData.q2ButtonPosition as string) || 'bottom-center'}
                                    onValueChange={(value) => updateLocalData({ q2ButtonPosition: value })}
                                  >
                                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-8 text-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                      <SelectItem value="bottom-left">Unten Links</SelectItem>
                                      <SelectItem value="bottom-center">Unten Mitte</SelectItem>
                                      <SelectItem value="bottom-right">Unten Rechts</SelectItem>
                                      <SelectItem value="middle-center">Mitte Zentriert</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}

                            {(localData.q2AnswerType as string) === 'multipleChoice' && (
                              <div className="space-y-2">
                                <Label className="text-white text-xs mb-1 block">Antwortmöglichkeiten</Label>
                                {((localData.q2Answers as string[]) || ['Option A', 'Option B']).map((answer: string, index: number) => (
                                  <div key={index} className="flex gap-2">
                                    <Input
                                      value={answer}
                                      onChange={(e) => {
                                        const currentAnswers = (localData.q2Answers as string[]) || ['Option A', 'Option B'];
                                        const newAnswers = [...currentAnswers];
                                        newAnswers[index] = e.target.value;
                                        updateLocalData({ q2Answers: newAnswers });
                                      }}
                                      className="bg-zinc-800 border-zinc-700 text-white h-8 text-sm flex-1"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const currentAnswers = (localData.q2Answers as string[]) || ['Option A', 'Option B'];
                                        updateLocalData({ q2Answers: currentAnswers.filter((_, i) => i !== index) });
                                      }}
                                      className="text-red-400 hover:text-red-300 h-8 px-2"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const currentAnswers = (localData.q2Answers as string[]) || ['Option A', 'Option B'];
                                    updateLocalData({ q2Answers: [...currentAnswers, `Option ${String.fromCharCode(65 + currentAnswers.length)}`] });
                                  }}
                                  className="text-blue-400 hover:text-blue-300 h-8 text-xs"
                                >
                                  <Plus className="w-3 h-3 mr-1" /> Option hinzufügen
                                </Button>
                                <div>
                                  <Label className="text-white text-xs mb-1 block">Position</Label>
                                  <Select
                                    value={(localData.q2ButtonPosition as string) || 'bottom-center'}
                                    onValueChange={(value) => updateLocalData({ q2ButtonPosition: value })}
                                  >
                                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-8 text-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                      <SelectItem value="bottom-left">Unten Links</SelectItem>
                                      <SelectItem value="bottom-center">Unten Mitte</SelectItem>
                                      <SelectItem value="bottom-right">Unten Rechts</SelectItem>
                                      <SelectItem value="middle-center">Mitte Zentriert</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}

                            <div className="text-xs text-blue-400 bg-blue-500/10 p-2 rounded">
                              ⏱️ Frage 2: Sek. {(localData.q2StartTime as number) || 0} - {((localData.q2StartTime as number) || 0) + ((localData.q2Duration as number) || 10)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logic" className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <Label className="text-white text-lg font-medium mb-4 block">Branching Logic</Label>
                <p className="text-zinc-400 text-sm mb-6">
                  Bestimmen Sie, zu welchem Node die Benutzer nach ihrer Antwort geleitet werden.
                </p>

                {localData.answerType === 'multipleChoice' && (
                  <div className="space-y-3">
                    {((localData.answers as string[]) || []).map((answer: string, index: number) => (
                      <div key={index} className="border border-zinc-700 rounded p-3">
                        <div className="text-sm text-white mb-2">
                          {String.fromCharCode(65 + index)}. {answer} → Node
                        </div>
                        <Select
                          value={((localData.nextNodes as Record<string, string>) || {})[index] || ''}
                          onValueChange={(value) => updateBranching(index, value)}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue placeholder="Node auswählen..." />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                            {availableNodes.map((node) => (
                              <SelectItem key={node.id} value={node.id}>
                                {node.data.label as string}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                )}

                {localData.answerType === 'yesno' && (
                  <>
                    <div className="border border-zinc-700 rounded p-3 mb-3">
                      <div className="text-sm text-white mb-2">Ja → Node</div>
                      <Select
                        value={((localData.nextNodes as Record<string, string>) || {}).yes || ''}
                        onValueChange={(value) => updateBranching('yes', value)}
                      >
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue placeholder="Node auswählen..." />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                          {availableNodes.map((node) => (
                            <SelectItem key={node.id} value={node.id}>
                              {node.data.label as string}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="border border-zinc-700 rounded p-3 mb-3">
                      <div className="text-sm text-white mb-2">Nein → Node</div>
                      <Select
                        value={((localData.nextNodes as Record<string, string>) || {}).no || ''}
                        onValueChange={(value) => updateBranching('no', value)}
                      >
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue placeholder="Node auswählen..." />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                          {availableNodes.map((node) => (
                            <SelectItem key={node.id} value={node.id}>
                              {node.data.label as string}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {(localData.answerType === 'button' || localData.answerType === 'text' || localData.answerType === 'email') && (
                  <div className="border border-zinc-700 rounded p-3">
                    <div className="text-sm text-white mb-2">Nächster Node</div>
                    <Select
                      value={((localData.nextNodes as Record<string, string>) || {}).default || ''}
                      onValueChange={(value) => updateBranching('default', value)}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Node auswählen..." />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        {availableNodes.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            {node.data.label as string}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {localData.answerType === 'rating' && (
                  <div className="space-y-3">
                    <div className="text-white text-sm font-medium mb-3">Rating Branching Logic</div>
                    <p className="text-zinc-400 text-xs mb-4">
                      Erstellen Sie verschiedene Wege basierend auf der Bewertung.
                    </p>
                    
                    {/* Low Rating (1-2) */}
                    <div className="border border-zinc-700 rounded p-3">
                      <div className="text-sm text-white mb-2">Niedrige Bewertung (1-2) → Node</div>
                      <Select
                        value={((localData.nextNodes as Record<string, string>) || {}).low || ''}
                        onValueChange={(value) => updateBranching('low', value)}
                      >
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue placeholder="Node auswählen..." />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                          {availableNodes.map((node) => (
                            <SelectItem key={node.id} value={node.id}>
                              {node.data.label as string}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Medium Rating (3-4) */}
                    <div className="border border-zinc-700 rounded p-3">
                      <div className="text-sm text-white mb-2">Mittlere Bewertung (3-4) → Node</div>
                      <Select
                        value={((localData.nextNodes as Record<string, string>) || {}).medium || ''}
                        onValueChange={(value) => updateBranching('medium', value)}
                      >
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue placeholder="Node auswählen..." />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                          {availableNodes.map((node) => (
                            <SelectItem key={node.id} value={node.id}>
                              {node.data.label as string}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* High Rating (5) */}
                    <div className="border border-zinc-700 rounded p-3">
                      <div className="text-sm text-white mb-2">Hohe Bewertung (5) → Node</div>
                      <Select
                        value={((localData.nextNodes as Record<string, string>) || {}).high || ''}
                        onValueChange={(value) => updateBranching('high', value)}
                      >
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue placeholder="Node auswählen..." />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                          {availableNodes.map((node) => (
                            <SelectItem key={node.id} value={node.id}>
                              {node.data.label as string}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
