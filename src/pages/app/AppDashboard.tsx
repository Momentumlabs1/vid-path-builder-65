import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  PlaySquare, 
  Users, 
  Eye, 
  TrendingUp,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { StatWidget } from '@/components/app/StatWidget';
import { FunnelCard } from '@/components/app/FunnelCard';
import { useToast } from '@/hooks/use-toast';

interface Funnel {
  name: string;
  created_at: string;
  is_public: boolean;
  structure: any;
}

export default function AppDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: funnelData } = await supabase
        .from('funnels')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: leadsData } = await supabase
        .from('leads')
        .select('id');

      const { data: responsesData } = await supabase
        .from('funnel_responses')
        .select('user_session_id');

      setFunnels(funnelData || []);
      setTotalLeads(leadsData?.length || 0);
      
      // Count unique sessions as views
      const uniqueSessions = new Set(responsesData?.map(r => r.user_session_id) || []);
      setTotalViews(uniqueSessions.size);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyFunnelLink = (funnelName: string) => {
    const url = `${window.location.origin}/funnel/${encodeURIComponent(funnelName)}`;
    navigator.clipboard.writeText(url);
    toast({ title: 'Link kopiert!' });
  };

  const duplicateFunnel = async (funnel: Funnel) => {
    const newName = `${funnel.name} (Kopie)`;
    await supabase.from('funnels').insert({
      name: newName,
      structure: funnel.structure,
      is_public: false
    });
    toast({ title: 'Funnel dupliziert!' });
    loadData();
  };

  const deleteFunnel = async (funnelName: string) => {
    await supabase.from('funnels').delete().eq('name', funnelName);
    toast({ title: 'Funnel gelöscht' });
    loadData();
  };

  const togglePublic = async (funnelName: string, currentPublic: boolean) => {
    await supabase
      .from('funnels')
      .update({ is_public: !currentPublic })
      .eq('name', funnelName);
    toast({ title: currentPublic ? 'Funnel ist jetzt privat' : 'Funnel veröffentlicht!' });
    loadData();
  };

  const recentFunnels = funnels.slice(0, 4);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 border border-primary/20"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Willkommen zurück</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dein Video Funnel Dashboard
          </h1>
          <p className="text-muted-foreground mb-6 max-w-xl">
            Erstelle interaktive Video-Funnels, die deine Besucher in Leads verwandeln. 
            Starte jetzt mit deinem ersten Funnel.
          </p>
          <Button 
            onClick={() => navigate('/app/builder')} 
            size="lg"
            className="gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Neuen Funnel erstellen
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget
          title="Funnels"
          value={funnels.length}
          icon={PlaySquare}
          delay={0}
        />
        <StatWidget
          title="Leads"
          value={totalLeads}
          change={12}
          icon={Users}
          delay={0.1}
        />
        <StatWidget
          title="Aufrufe"
          value={totalViews}
          change={8}
          icon={Eye}
          delay={0.2}
        />
        <StatWidget
          title="Conversion"
          value={totalViews > 0 ? `${((totalLeads / totalViews) * 100).toFixed(1)}%` : '0%'}
          change={5}
          icon={TrendingUp}
          delay={0.3}
        />
      </div>

      {/* Recent Funnels */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Letzte Funnels</h2>
            <p className="text-sm text-muted-foreground">Deine zuletzt bearbeiteten Funnels</p>
          </div>
          {funnels.length > 4 && (
            <Button variant="ghost" onClick={() => navigate('/app/funnels')} className="gap-2">
              Alle anzeigen
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : recentFunnels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentFunnels.map((funnel, index) => (
              <FunnelCard
                key={funnel.name}
                name={funnel.name}
                createdAt={funnel.created_at}
                isPublic={funnel.is_public}
                onCopyLink={() => copyFunnelLink(funnel.name)}
                onDuplicate={() => duplicateFunnel(funnel)}
                onDelete={() => deleteFunnel(funnel.name)}
                onTogglePublic={() => togglePublic(funnel.name, funnel.is_public)}
                delay={index * 0.1}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 rounded-2xl border border-dashed border-border"
          >
            <PlaySquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Noch keine Funnels</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Erstelle deinen ersten Video-Funnel und starte durch!
            </p>
            <Button onClick={() => navigate('/app/builder')} className="gap-2">
              <PlusCircle className="w-4 h-4" />
              Ersten Funnel erstellen
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
