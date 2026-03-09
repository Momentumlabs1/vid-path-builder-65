import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { StatWidget } from '@/components/app/StatWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export default function AppAnalytics() {
  const [funnels, setFunnels] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedFunnel, setSelectedFunnel] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [funnelsRes, responsesRes, leadsRes] = await Promise.all([
        supabase.from('funnels').select('*'),
        supabase.from('funnel_responses').select('*').order('created_at', { ascending: true }),
        supabase.from('leads').select('*').order('created_at', { ascending: true })
      ]);
      
      setFunnels(funnelsRes.data || []);
      setResponses(responsesRes.data || []);
      setLeads(leadsRes.data || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const filteredResponses = selectedFunnel === 'all' 
    ? responses 
    : responses.filter(r => r.funnel_name === selectedFunnel);
  
  const filteredLeads = selectedFunnel === 'all'
    ? leads
    : leads.filter(l => l.funnel_name === selectedFunnel);

  const uniqueSessions = new Set(filteredResponses.map(r => r.user_session_id)).size;
  const totalLeads = filteredLeads.length;
  const conversionRate = uniqueSessions > 0 ? ((totalLeads / uniqueSessions) * 100).toFixed(1) : '0';

  // Generate chart data (last 7 days)
  const generateChartData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayResponses = filteredResponses.filter(r => 
        r.created_at.startsWith(dateStr)
      );
      const dayLeads = filteredLeads.filter(l => 
        l.created_at.startsWith(dateStr)
      );
      const daySessions = new Set(dayResponses.map(r => r.user_session_id)).size;

      data.push({
        date: date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' }),
        views: daySessions,
        leads: dayLeads.length,
        interactions: dayResponses.length
      });
    }
    
    return data;
  };

  const chartData = generateChartData();

  // Top performing funnels
  const funnelPerformance = funnels.map(funnel => {
    const funnelResponses = responses.filter(r => r.funnel_name === funnel.name);
    const funnelLeads = leads.filter(l => l.funnel_name === funnel.name);
    const sessions = new Set(funnelResponses.map(r => r.user_session_id)).size;
    
    return {
      name: funnel.name,
      views: sessions,
      leads: funnelLeads.length,
      conversion: sessions > 0 ? ((funnelLeads.length / sessions) * 100).toFixed(1) : '0'
    };
  }).sort((a, b) => b.leads - a.leads);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Performance deiner Video-Funnels</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedFunnel} onValueChange={setSelectedFunnel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Funnel wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Funnels</SelectItem>
              {funnels.map(funnel => (
                <SelectItem key={funnel.name} value={funnel.name}>
                  {funnel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Tage</SelectItem>
              <SelectItem value="30d">30 Tage</SelectItem>
              <SelectItem value="90d">90 Tage</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget
          title="Aufrufe"
          value={uniqueSessions}
          change={12}
          icon={Eye}
          delay={0}
        />
        <StatWidget
          title="Leads"
          value={totalLeads}
          change={8}
          icon={Users}
          delay={0.1}
        />
        <StatWidget
          title="Conversion Rate"
          value={`${conversionRate}%`}
          change={5}
          icon={TrendingUp}
          delay={0.2}
        />
        <StatWidget
          title="Interaktionen"
          value={filteredResponses.length}
          change={15}
          icon={MousePointer}
          delay={0.3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views & Leads Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aufrufe & Leads</CardTitle>
            <CardDescription>Entwicklung über Zeit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorViews)" 
                    name="Aufrufe"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="leads" 
                    stroke="hsl(142 76% 36%)" 
                    fillOpacity={1} 
                    fill="url(#colorLeads)" 
                    name="Leads"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Interactions Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interaktionen</CardTitle>
            <CardDescription>Tägliche Nutzeraktionen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="interactions" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    name="Interaktionen"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Funnels */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Funnels</CardTitle>
          <CardDescription>Performance nach Funnel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelPerformance.slice(0, 5).map((funnel, index) => (
              <motion.div
                key={funnel.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{funnel.name}</p>
                    <p className="text-sm text-muted-foreground">{funnel.views} Aufrufe</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{funnel.leads}</p>
                    <p className="text-xs text-muted-foreground">Leads</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {parseFloat(funnel.conversion) > 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={parseFloat(funnel.conversion) > 0 ? 'text-green-500' : 'text-muted-foreground'}>
                      {funnel.conversion}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {funnelPerformance.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>Noch keine Daten vorhanden</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
