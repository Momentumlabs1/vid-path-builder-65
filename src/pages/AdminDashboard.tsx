import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, TrendingUp, Target, Mail, Phone, Building } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Lead {
  id: string;
  funnel_name: string;
  session_id: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  age: number | null;
  opt_in: boolean | null;
  created_at: string;
}

interface LeadStatus {
  id: string;
  lead_id: string;
  status: string;
  notes?: string;
  created_at: string;
}

interface Funnel {
  name: string;
  created_at: string;
  structure: any;
}

interface Response {
  funnel_name: string;
  user_session_id: string;
  question?: string;
  answer: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadStatuses, setLeadStatuses] = useState<LeadStatus[]>([]);
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [leadsResponse, statusResponse, funnelsResponse, responsesResponse] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('lead_status').select('*').order('created_at', { ascending: false }),
        supabase.from('funnels').select('*').order('created_at', { ascending: false }),
        supabase.from('funnel_responses').select('*').order('created_at', { ascending: false })
      ]);

      if (leadsResponse.error) throw leadsResponse.error;
      if (statusResponse.error) throw statusResponse.error;
      if (funnelsResponse.error) throw funnelsResponse.error;
      if (responsesResponse.error) throw responsesResponse.error;

      setLeads(leadsResponse.data || []);
      setLeadStatuses(statusResponse.data || []);
      setFunnels(funnelsResponse.data || []);
      setResponses(responsesResponse.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Fehler",
        description: "Daten konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: string, notes?: string) => {
    try {
      const { error } = await supabase.from('lead_status').insert({
        lead_id: leadId,
        status,
        notes,
      });

      if (error) throw error;

      toast({
        title: "Status aktualisiert",
        description: "Lead-Status wurde erfolgreich aktualisiert.",
      });

      loadData();
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast({
        title: "Fehler",
        description: "Status konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    }
  };

  const getLatestStatus = (leadId: string) => {
    const statuses = leadStatuses.filter(s => s.lead_id === leadId);
    return statuses.length > 0 ? statuses[0].status : 'new';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'scheduled': return 'bg-purple-500';
      case 'converted': return 'bg-green-500';
      case 'lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLeadResponses = (sessionId: string) => {
    return responses.filter(r => r.user_session_id === sessionId);
  };

  const stats = {
    totalLeads: leads.length,
    newLeads: leads.filter(l => getLatestStatus(l.id) === 'new').length,
    convertedLeads: leads.filter(l => getLatestStatus(l.id) === 'converted').length,
    totalFunnels: funnels.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Lade Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Verwalten Sie Ihre Leads und Funnels</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Gesamt Leads</p>
                  <p className="text-2xl font-bold">{stats.totalLeads}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Neue Leads</p>
                  <p className="text-2xl font-bold">{stats.newLeads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Konvertiert</p>
                  <p className="text-2xl font-bold">{stats.convertedLeads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Aktive Funnels</p>
                  <p className="text-2xl font-bold">{stats.totalFunnels}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="leads">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="leads">Lead Management</TabsTrigger>
            <TabsTrigger value="funnels">Funnel Übersicht</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lead</TableHead>
                      <TableHead>Funnel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Kontakt</TableHead>
                      <TableHead>Erstellt</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                {(lead.first_name?.[0] || '') + (lead.last_name?.[0] || '')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {lead.first_name} {lead.last_name}
                              </p>
                              {lead.age && (
                                <p className="text-sm text-muted-foreground">Alter: {lead.age}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{lead.funnel_name}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(getLatestStatus(lead.id))}>
                            {getLatestStatus(lead.id)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {lead.email && (
                              <div className="flex items-center text-sm">
                                <Mail className="h-4 w-4 mr-2" />
                                {lead.email}
                              </div>
                            )}
                            {lead.phone && (
                              <div className="flex items-center text-sm">
                                <Phone className="h-4 w-4 mr-2" />
                                {lead.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(lead.created_at)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedLead(lead)}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funnels">
            <Card>
              <CardHeader>
                <CardTitle>Funnel Übersicht</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {funnels.map((funnel) => {
                    const funnelLeads = leads.filter(l => l.funnel_name === funnel.name);
                    const funnelResponses = responses.filter(r => r.funnel_name === funnel.name);
                    
                    return (
                      <Card key={funnel.name}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">{funnel.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Erstellt: {formatDate(funnel.created_at)}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Bearbeiten
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-600">{funnelLeads.length}</p>
                              <p className="text-sm text-muted-foreground">Leads</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">
                                {funnelLeads.filter(l => getLatestStatus(l.id) === 'converted').length}
                              </p>
                              <p className="text-sm text-muted-foreground">Konvertiert</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-purple-600">{funnelResponses.length}</p>
                              <p className="text-sm text-muted-foreground">Antworten</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Erweiterte Analytics folgen in Kürze...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Lead Details Modal/Panel */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>
                      {selectedLead.first_name} {selectedLead.last_name}
                    </CardTitle>
                    <p className="text-muted-foreground">{selectedLead.funnel_name}</p>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedLead(null)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Lead Info */}
                <div>
                  <h4 className="font-semibold mb-2">Kontaktdaten</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>E-Mail: {selectedLead.email || 'N/A'}</div>
                    <div>Telefon: {selectedLead.phone || 'N/A'}</div>
                    <div>Alter: {selectedLead.age || 'N/A'}</div>
                    <div>Opt-in: {selectedLead.opt_in ? 'Ja' : 'Nein'}</div>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <h4 className="font-semibold mb-2">Status aktualisieren</h4>
                  <div className="flex gap-2 mb-2">
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Neu</SelectItem>
                        <SelectItem value="contacted">Kontaktiert</SelectItem>
                        <SelectItem value="scheduled">Termin</SelectItem>
                        <SelectItem value="converted">Konvertiert</SelectItem>
                        <SelectItem value="lost">Verloren</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => {
                        if (newStatus) {
                          updateLeadStatus(selectedLead.id, newStatus, newNote);
                          setNewStatus('');
                          setNewNote('');
                        }
                      }}
                      disabled={!newStatus}
                    >
                      Status aktualisieren
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Notizen hinzufügen..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                </div>

                {/* Responses */}
                <div>
                  <h4 className="font-semibold mb-2">Funnel Antworten</h4>
                  <div className="space-y-2">
                    {getLeadResponses(selectedLead.session_id).map((response, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        {response.question && (
                          <p className="font-medium text-sm">{response.question}</p>
                        )}
                        <p className="text-sm">{response.answer}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(response.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;