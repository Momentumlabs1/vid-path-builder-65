import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, TrendingUp, Download, Mail, Phone } from 'lucide-react';

interface Lead {
  id: string;
  funnel_name: string;
  session_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  company?: string;
  lead_score: number;
  opt_in_marketing: boolean;
  created_at: string;
}

interface Response {
  funnel_name: string;
  user_session_id: string;
  question?: string;
  answer: string;
  created_at: string;
}

const ClientDashboard = () => {
  const { funnelName } = useParams<{ funnelName: string }>();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (funnelName) {
      loadFunnelData();
    }
  }, [funnelName]);

  const loadFunnelData = async () => {
    if (!funnelName) return;
    
    try {
      setLoading(true);
      
      // Decode the funnel name from URL
      const decodedFunnelName = decodeURIComponent(funnelName);
      
      const [leadsResponse, responsesResponse] = await Promise.all([
        supabase
          .from('leads')
          .select('*')
          .eq('funnel_name', decodedFunnelName)
          .order('created_at', { ascending: false }),
        supabase
          .from('funnel_responses')
          .select('*')
          .eq('funnel_name', decodedFunnelName)
          .order('created_at', { ascending: false })
      ]);

      if (leadsResponse.error) throw leadsResponse.error;
      if (responsesResponse.error) throw responsesResponse.error;

      setLeads(leadsResponse.data || []);
      setResponses(responsesResponse.data || []);
    } catch (error) {
      console.error('Error loading funnel data:', error);
      toast({
        title: "Fehler",
        description: "Funnel-Daten konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportLeads = () => {
    if (leads.length === 0) {
      toast({
        title: "Keine Daten",
        description: "Es sind keine Leads zum Exportieren vorhanden.",
        variant: "destructive",
      });
      return;
    }

    const csv = [
      ['Vorname', 'Nachname', 'E-Mail', 'Telefon', 'Unternehmen', 'Erstellt am'],
      ...leads.map(lead => [
        lead.first_name || '',
        lead.last_name || '',
        lead.email || '',
        lead.phone || '',
        lead.company || '',
        new Date(lead.created_at).toLocaleString('de-DE')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${funnelName}_leads.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export erfolgreich",
      description: "Die Leads wurden als CSV-Datei exportiert.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUniqueSessionsCount = () => {
    const sessions = new Set(responses.map(r => r.user_session_id));
    return sessions.size;
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{decodeURIComponent(funnelName || '')}</h1>
          <p className="text-muted-foreground">Dashboard für Ihren Funnel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Gesamt Leads</p>
                  <p className="text-2xl font-bold">{leads.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Besucher</p>
                  <p className="text-2xl font-bold">{getUniqueSessionsCount()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Opt-ins</p>
                  <p className="text-2xl font-bold">
                    {leads.filter(l => l.opt_in_marketing).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <Button onClick={exportLeads} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Leads exportieren
          </Button>
        </div>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Ihre Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Noch keine Leads vorhanden.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>Kontakt</TableHead>
                    <TableHead>Marketing Opt-in</TableHead>
                    <TableHead>Erstellt</TableHead>
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
                            {lead.company && (
                              <p className="text-sm text-muted-foreground">{lead.company}</p>
                            )}
                          </div>
                        </div>
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
                      <TableCell>
                        <Badge variant={lead.opt_in_marketing ? "default" : "secondary"}>
                          {lead.opt_in_marketing ? 'Ja' : 'Nein'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(lead.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;