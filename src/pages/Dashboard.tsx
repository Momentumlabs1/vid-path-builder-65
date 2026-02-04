import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Eye, Plus, Settings, Users, Copy, Trash2, MoreVertical, Link, Code, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EmbedCodeGenerator } from '@/components/funnel/EmbedCodeGenerator';
import { FunnelTemplateLoader } from '@/components/funnel/FunnelTemplateLoader';

interface Funnel {
  name: string;
  created_at: string;
  structure: any;
  is_public: boolean;
}

interface Response {
  id: string;
  funnel_name: string;
  node_id: string;
  question: string;
  answer: string;
  answer_type: string;
  user_session_id: string;
  created_at: string;
}

const Dashboard = () => {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [selectedFunnel, setSelectedFunnel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load funnels
      const { data: funnelData, error: funnelError } = await supabase
        .from('funnels')
        .select('name, structure, created_at, is_public')
        .order('created_at', { ascending: false });

      if (funnelError) throw funnelError;
      setFunnels(funnelData || []);

      // Load responses
      const { data: responseData, error: responseError } = await supabase
        .from('funnel_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (responseError) throw responseError;
      setResponses(responseData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Fehler beim Laden",
        description: "Daten konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getResponsesForFunnel = (funnelName: string) => {
    return responses.filter(r => r.funnel_name === funnelName);
  };

  const getUniqueSessionsForFunnel = (funnelName: string) => {
    const funnelResponses = getResponsesForFunnel(funnelName);
    const uniqueSessions = new Set(funnelResponses.map(r => r.user_session_id));
    return uniqueSessions.size;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAvatarColor = (sessionId: string) => {
    const colors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-destructive', 'bg-primary/80', 'bg-accent/80'];
    const index = sessionId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const copyFunnelLink = async (funnelName: string) => {
    const url = `${window.location.origin}/funnel/${funnelName}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link kopiert!",
        description: "Funnel-Link wurde in die Zwischenablage kopiert.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Link konnte nicht kopiert werden.",
        variant: "destructive",
      });
    }
  };

  const duplicateFunnel = async (funnel: Funnel) => {
    try {
      const newName = `${funnel.name} (Kopie)`;
      
      const { error } = await supabase
        .from('funnels')
        .insert({
          name: newName,
          structure: funnel.structure,
          user_id: crypto.randomUUID()
        });

      if (error) throw error;

      toast({
        title: "Funnel dupliziert!",
        description: `"${newName}" wurde erfolgreich erstellt.`,
      });
      
      loadData(); // Reload data
    } catch (error) {
      console.error('Error duplicating funnel:', error);
      toast({
        title: "Fehler",
        description: "Funnel konnte nicht dupliziert werden.",
        variant: "destructive",
      });
    }
  };

  const deleteFunnel = async (funnelName: string) => {
    try {
      const { error } = await supabase
        .from('funnels')
        .delete()
        .eq('name', funnelName);

      if (error) throw error;

      toast({
        title: "Funnel gelöscht!",
        description: `"${funnelName}" wurde erfolgreich gelöscht.`,
      });
      
      loadData(); // Reload data
    } catch (error) {
      console.error('Error deleting funnel:', error);
      toast({
        title: "Fehler",
        description: "Funnel konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  const toggleFunnelPublic = async (funnelName: string, currentPublic: boolean) => {
    try {
      const { error } = await supabase
        .from('funnels')
        .update({ is_public: !currentPublic })
        .eq('name', funnelName);

      if (error) throw error;

      toast({
        title: "Erfolgreich",
        description: `Funnel ist jetzt ${!currentPublic ? 'öffentlich' : 'privat'}.`,
      });
      
      loadData(); // Reload data
    } catch (error) {
      console.error('Error updating funnel visibility:', error);
      toast({
        title: "Fehler",
        description: "Funnel-Sichtbarkeit konnte nicht geändert werden.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-2xl font-semibold text-white/80">Lade Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl"></div>
      </div>
      
      {/* Header */}
      <div className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-bold mb-2">
                Momentumlabs-Interaktive Videofunnel Demo
              </h1>
              <p className="text-white/60 text-lg">Die Zukunft der Interaktion beginnt heute.</p>
            </div>
            <div className="flex gap-3">
              <FunnelTemplateLoader onFunnelLoaded={loadData} />
              <Button 
                onClick={() => navigate('/builder')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm px-6 py-3 text-lg"
              >
                Neuer Funnel
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-sm border border-white/10">
            <TabsTrigger value="overview" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10">Übersicht</TabsTrigger>
            <TabsTrigger value="funnels" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10">Funnels</TabsTrigger>
            <TabsTrigger value="interactions" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10">Alle Antworten</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 mt-8">
            {/* Hero Section */}
            <div className="text-center py-16">
              <h2 className="text-4xl font-bold mb-6">
                Verwalte deine Funnels und Antworten
              </h2>
              <p className="text-white/60 text-xl max-w-2xl mx-auto">
                Erstelle interaktive Video-Experiences und analysiere die Ergebnisse in Echtzeit.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/80">Gesamt Funnels</CardTitle>
                  <Settings className="h-6 w-6 text-white/60" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{funnels.length}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/80">Gesamt Antworten</CardTitle>
                  <Users className="h-6 w-6 text-white/60" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{responses.length}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/80">Unique Sessions</CardTitle>
                  <Eye className="h-6 w-6 text-white/60" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {new Set(responses.map(r => r.user_session_id)).size}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Funnels */}
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Neueste Funnels</CardTitle>
              </CardHeader>
              <CardContent>
                {funnels.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-white/60 text-xl mb-8">Noch keine Funnels erstellt</div>
                    <Button 
                      onClick={() => navigate('/builder')}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm px-8 py-4 text-lg"
                    >
                      <Plus className="w-5 h-5 mr-3" />
                      Ersten Funnel erstellen
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {funnels.slice(0, 5).map((funnel) => (
                      <div key={funnel.name} className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div>
                          <h3 className="text-xl font-medium text-white mb-2">{funnel.name}</h3>
                          <p className="text-white/60">
                            {getUniqueSessionsForFunnel(funnel.name)} Teilnehmer • {getResponsesForFunnel(funnel.name).length} Antworten
                          </p>
                        </div>
                        <div className="flex gap-3 items-center">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`/funnel/${funnel.name}`, '_blank')}
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ansehen
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/builder?funnel=${funnel.name}`)}
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          >
                            Bearbeiten
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-white/20 text-white hover:bg-white/10 bg-transparent p-2"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-black/90 backdrop-blur-sm border border-white/10">
                              <DropdownMenuItem 
                                onClick={() => copyFunnelLink(funnel.name)}
                                className="text-white hover:bg-white/10 cursor-pointer"
                              >
                                <Link className="w-4 h-4 mr-2" />
                                Link kopieren
                              </DropdownMenuItem>
                               <DropdownMenuItem 
                                onClick={() => duplicateFunnel(funnel)}
                                className="text-white hover:bg-white/10 cursor-pointer"
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Duplizieren
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => toggleFunnelPublic(funnel.name, funnel.is_public)}
                                className="text-white hover:bg-white/10 cursor-pointer"
                              >
                                <Globe className="w-4 h-4 mr-2" />
                                {funnel.is_public ? 'Privat machen' : 'Öffentlich machen'}
                              </DropdownMenuItem>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem 
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-white hover:bg-white/10 cursor-pointer"
                                  >
                                    <Code className="w-4 h-4 mr-2" />
                                    Embed Code
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="bg-black/90 backdrop-blur-sm border border-white/10 max-w-4xl">
                                  <DialogHeader>
                                    <DialogTitle className="text-white">Embed Code für {funnel.name}</DialogTitle>
                                  </DialogHeader>
                                  <EmbedCodeGenerator funnelName={funnel.name} isPublic={funnel.is_public} />
                                </DialogContent>
                              </Dialog>
                              <DropdownMenuSeparator className="bg-white/10" />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-red-400 hover:bg-red-400/10 cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Löschen
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-black/90 backdrop-blur-sm border border-white/10">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-white">Funnel löschen?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-white/60">
                                      Möchtest du "{funnel.name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-white/5 text-white border-white/20 hover:bg-white/10">
                                      Abbrechen
                                    </AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => deleteFunnel(funnel.name)}
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                      Löschen
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funnels" className="space-y-8 mt-8">
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold text-white mb-4">Alle Funnels</h2>
              <p className="text-white/60 text-lg">Verwalte und bearbeite deine Video-Funnels</p>
            </div>
            
            {funnels.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-white/60 text-2xl mb-12">Noch keine Funnels vorhanden</div>
                <Button 
                  onClick={() => navigate('/builder')}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm px-8 py-4 text-lg"
                  size="lg"
                >
                  <Plus className="w-6 h-6 mr-3" />
                  Ersten Funnel erstellen
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {funnels.map((funnel) => (
                  <Card key={funnel.name} className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">{funnel.name}</CardTitle>
                      <p className="text-white/60">
                        Erstellt am {formatDate(funnel.created_at)}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex justify-between">
                          <span className="text-white/60">Teilnehmer:</span>
                          <span className="text-white font-semibold text-lg">{getUniqueSessionsForFunnel(funnel.name)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Antworten:</span>
                          <span className="text-white font-semibold text-lg">{getResponsesForFunnel(funnel.name).length}</span>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                            onClick={() => window.open(`/funnel/${funnel.name}`, '_blank')}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ansehen
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                            onClick={() => navigate(`/builder?funnel=${funnel.name}`)}
                          >
                            Bearbeiten
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-white/20 text-white hover:bg-white/10 bg-transparent p-2"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-black/90 backdrop-blur-sm border border-white/10">
                              <DropdownMenuItem 
                                onClick={() => copyFunnelLink(funnel.name)}
                                className="text-white hover:bg-white/10 cursor-pointer"
                              >
                                <Link className="w-4 h-4 mr-2" />
                                Link kopieren
                              </DropdownMenuItem>
                               <DropdownMenuItem 
                                onClick={() => duplicateFunnel(funnel)}
                                className="text-white hover:bg-white/10 cursor-pointer"
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Duplizieren
                              </DropdownMenuItem>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem 
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-white hover:bg-white/10 cursor-pointer"
                                  >
                                    <Code className="w-4 h-4 mr-2" />
                                    Embed Code
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="bg-black/90 backdrop-blur-sm border border-white/10 max-w-4xl">
                                  <DialogHeader>
                                    <DialogTitle className="text-white">Embed Code für {funnel.name}</DialogTitle>
                                  </DialogHeader>
                                  <EmbedCodeGenerator funnelName={funnel.name} isPublic={funnel.is_public} />
                                </DialogContent>
                              </Dialog>
                              <DropdownMenuSeparator className="bg-white/10" />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-red-400 hover:bg-red-400/10 cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Löschen
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-black/90 backdrop-blur-sm border border-white/10">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-white">Funnel löschen?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-white/60">
                                      Möchtest du "{funnel.name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-white/5 text-white border-white/20 hover:bg-white/10">
                                      Abbrechen
                                    </AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => deleteFunnel(funnel.name)}
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                      Löschen
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="interactions" className="space-y-8 mt-8">
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold text-white mb-4">Alle Antworten</h2>
              <p className="text-white/60 text-lg">Analysiere die Interaktionen deiner Benutzer</p>
            </div>
            
            <div className="flex gap-4 mb-8">
              <select 
                className="bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
                value={selectedFunnel || ''}
                onChange={(e) => setSelectedFunnel(e.target.value || null)}
              >
                <option value="">Alle Funnels</option>
                {funnels.map(funnel => (
                  <option key={funnel.name} value={funnel.name}>{funnel.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-6">
              {Object.entries(responses
                .filter(response => !selectedFunnel || response.funnel_name === selectedFunnel)
                .reduce((acc, response) => {
                  const session = response.user_session_id;
                  if (!acc[session]) {
                    acc[session] = [];
                  }
                  acc[session].push(response);
                  return acc;
                }, {} as Record<string, Response[]>))
                .map(([sessionId, sessionResponses]) => (
                  <Card key={sessionId} className="bg-white/5 backdrop-blur-sm border border-white/10">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Avatar className={`${getAvatarColor(sessionId)} w-12 h-12`}>
                          <AvatarFallback className="text-white font-bold text-lg">
                            A
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-white text-lg">Anonymous</h3>
                          <div className="flex items-center gap-6 text-white/60">
                            <span>{formatDate(sessionResponses[0].created_at)} via {sessionResponses[0].funnel_name}</span>
                            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                              Abgeschlossen
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {sessionResponses.map((response, index) => (
                          <div key={response.id} className="border-l-2 border-white/30 pl-6">
                            <div className="text-white/60 mb-2">
                              Frage {index + 1}: {response.question || `${response.answer_type} Antwort`}
                            </div>
                            <div className="text-white text-lg font-medium">{response.answer}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;