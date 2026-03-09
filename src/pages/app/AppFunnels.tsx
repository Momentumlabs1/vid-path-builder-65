import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  Search, 
  Grid3X3, 
  List,
  Filter,
  PlaySquare
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FunnelCard } from '@/components/app/FunnelCard';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Funnel {
  name: string;
  created_at: string;
  is_public: boolean;
  structure: any;
}

export default function AppFunnels() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'public' | 'draft'>('all');

  useEffect(() => {
    loadFunnels();
  }, []);

  const loadFunnels = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('funnels')
        .select('*')
        .order('created_at', { ascending: false });
      setFunnels(data || []);
    } catch (error) {
      console.error('Error loading funnels:', error);
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
    loadFunnels();
  };

  const deleteFunnel = async (funnelName: string) => {
    await supabase.from('funnels').delete().eq('name', funnelName);
    toast({ title: 'Funnel gelöscht' });
    loadFunnels();
  };

  const togglePublic = async (funnelName: string, currentPublic: boolean) => {
    await supabase
      .from('funnels')
      .update({ is_public: !currentPublic })
      .eq('name', funnelName);
    toast({ title: currentPublic ? 'Funnel ist jetzt privat' : 'Funnel veröffentlicht!' });
    loadFunnels();
  };

  // Filter and search
  const filteredFunnels = funnels.filter(funnel => {
    const matchesSearch = funnel.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'public' && funnel.is_public) ||
      (filterStatus === 'draft' && !funnel.is_public);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meine Funnels</h1>
          <p className="text-muted-foreground">
            {funnels.length} {funnels.length === 1 ? 'Funnel' : 'Funnels'} insgesamt
          </p>
        </div>
        <Button onClick={() => navigate('/app/builder')} className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Neuer Funnel
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Funnels durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={(v: 'all' | 'public' | 'draft') => setFilterStatus(v)}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle</SelectItem>
              <SelectItem value="public">Öffentlich</SelectItem>
              <SelectItem value="draft">Entwürfe</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="rounded-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Funnel Grid/List */}
      {loading ? (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`rounded-2xl bg-muted animate-pulse ${viewMode === 'grid' ? 'aspect-[4/3]' : 'h-20'}`} />
          ))}
        </div>
      ) : filteredFunnels.length > 0 ? (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {filteredFunnels.map((funnel, index) => (
            <FunnelCard
              key={funnel.name}
              name={funnel.name}
              createdAt={funnel.created_at}
              isPublic={funnel.is_public}
              onCopyLink={() => copyFunnelLink(funnel.name)}
              onDuplicate={() => duplicateFunnel(funnel)}
              onDelete={() => deleteFunnel(funnel.name)}
              onTogglePublic={() => togglePublic(funnel.name, funnel.is_public)}
              delay={index * 0.05}
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
          <h3 className="font-semibold text-foreground mb-2">
            {searchTerm || filterStatus !== 'all' ? 'Keine Ergebnisse' : 'Noch keine Funnels'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'Versuche einen anderen Suchbegriff oder Filter'
              : 'Erstelle deinen ersten Video-Funnel und starte durch!'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Button onClick={() => navigate('/app/builder')} className="gap-2">
              <PlusCircle className="w-4 h-4" />
              Ersten Funnel erstellen
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}
