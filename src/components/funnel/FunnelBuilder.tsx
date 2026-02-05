import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
  NodeTypes,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import { VideoNode } from './VideoNode';
import { EndNode } from './EndNode';
import { ApiNode } from './ApiNode';
import { StartNode } from './StartNode';
import { LeadCaptureNode } from './LeadCaptureNode';
import { NodePropertiesPanel } from './NodePropertiesPanel';
import { VideoFunnelPreview } from './VideoFunnelPreview';
import CustomEdge from './CustomEdge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Settings, Share2, Save, FolderOpen, Copy, Home, Users, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  placeNodeAvoidingOverlaps,
  resolveOverlaps,
  resolveOverlapsForNode,
} from '@/lib/flow/avoidOverlaps';

const nodeTypes: NodeTypes = {
  video: VideoNode,
  end: EndNode,
  api: ApiNode,
  start: StartNode,
  leadCapture: LeadCaptureNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

// BEREINIGTER START - Nur ein Start-Node, keine vordefinierten Funnels
const initialNodes: Node[] = [
  {
    id: 'start-node',
    type: 'start',
    position: { x: 400, y: 300 },
    data: { 
      label: 'Start',
    },
  }
];

// Keine vordefinierten Verbindungen
const initialEdges: Edge[] = [];

function FunnelBuilderInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [funnelName, setFunnelName] = useState('');
  const [currentFunnelId, setCurrentFunnelId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const reactFlowInstance = useReactFlow();
  const panelRef = useRef<HTMLDivElement>(null);

  // NOTE: Embed codes are generated against the published URL.
  // Preview (lovableproject.com / id-preview) and Published (lovable.app) use separate environments.
  const PRODUCTION_BASE_URL = 'https://vid-path-builder-65.lovable.app';
  const isPreviewEnvironment =
    typeof window !== 'undefined' &&
    (window.location.hostname.includes('lovableproject.com') || window.location.hostname.startsWith('id-preview--'));

  const effectiveFunnelName = (currentFunnelId || funnelName).trim();
  const liveBuilderUrl = effectiveFunnelName
    ? `${PRODUCTION_BASE_URL}/builder?funnel=${encodeURIComponent(effectiveFunnelName)}`
    : `${PRODUCTION_BASE_URL}/builder`;
  const liveEmbedUrl = effectiveFunnelName
    ? `${PRODUCTION_BASE_URL}/embed/${encodeURIComponent(effectiveFunnelName)}`
    : `${PRODUCTION_BASE_URL}/embed`;

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    
    // Auto-zoom to node with smooth animation
    setTimeout(() => {
      reactFlowInstance.fitView({ 
        nodes: [{ id: node.id }], 
        duration: 800,
        padding: 0.3,
        maxZoom: 1.2
      });
    }, 100);
  }, [reactFlowInstance]);

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  }, [setNodes]);

  const addVideoNode = useCallback(() => {
    const newNode: Node = {
      id: `video-${Date.now()}`,
      type: 'video',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: {
        label: 'Neues Video',
        videoUrl: '',
        overlayText: 'Video Overlay Text',
        answerType: 'button',
        answers: [],
        nextNodes: {}
      },
    };
    setNodes((nds) => [...nds, placeNodeAvoidingOverlaps(nds, newNode)]);
  }, [setNodes]);

  const addEndNode = useCallback(() => {
    const newNode: Node = {
      id: `end-${Date.now()}`,
      type: 'end',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: {
        label: 'Ende',
        title: 'Vielen Dank!',
        message: 'Sie haben den Funnel erfolgreich abgeschlossen.',
        redirectUrl: ''
      },
    };
    setNodes((nds) => [...nds, placeNodeAvoidingOverlaps(nds, newNode)]);
  }, [setNodes]);

  const addApiNode = useCallback(() => {
    const newNode: Node = {
      id: `api-${Date.now()}`,
      type: 'api',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: {
        label: 'API Call',
        apiUrl: '',
        method: 'POST',
        headers: {},
        body: '',
        responseMapping: {}
      },
    };
    setNodes((nds) => [...nds, placeNodeAvoidingOverlaps(nds, newNode)]);
  }, [setNodes]);

  const addLeadCaptureNode = useCallback(() => {
    const newNode: Node = {
      id: `leadCapture-${Date.now()}`,
      type: 'leadCapture',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: {
        label: 'Lead Capture',
        title: 'Kontaktdaten erfassen',
        description: 'Bitte geben Sie Ihre Daten ein',
        fields: ['firstName', 'lastName', 'age', 'email', 'phone'],
        optInText: 'Ich möchte weitere Informationen erhalten'
      },
    };
    setNodes((nds) => [...nds, placeNodeAvoidingOverlaps(nds, newNode)]);
  }, [setNodes]);

  const saveFunnel = async () => {
    let nameToSave = funnelName.trim();
    
    // Auto-generate name if empty
    if (!nameToSave) {
      nameToSave = `funnel-${Date.now()}`;
      setFunnelName(nameToSave);
    }

    setSaving(true);
    try {
      const funnelStructure = {
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type
        }))
      };

      if (currentFunnelId) {
        const { error } = await supabase
          .from('funnels')
          .update({
            structure: funnelStructure as any
          })
          .eq('name', currentFunnelId);
        
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('funnels')
          .insert({
            name: nameToSave,
            structure: funnelStructure as any,
            user_id: null // Allow anonymous saves for testing
          })
          .select('*')
          .single();
        
        if (error) throw error;
        if (data) setCurrentFunnelId(data.name);
      }

      toast({
        title: "✅ Gespeichert",
        description: `Funnel "${nameToSave}" wurde erfolgreich gespeichert`,
      });
    } catch (error) {
      console.error('Error saving funnel:', error);
      toast({
        title: "❌ Fehler beim Speichern",
        description: "Funnel konnte nicht gespeichert werden. Versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const publishFunnel = async () => {
    let nameToSave = funnelName.trim();
    
    if (!nameToSave) {
      nameToSave = `funnel-${Date.now()}`;
      setFunnelName(nameToSave);
    }

    setSaving(true);
    try {
      const funnelStructure = {
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type
        }))
      };

      const { error } = await supabase
        .from('funnels')
        .upsert({
          name: nameToSave,
          structure: funnelStructure as any,
          is_public: true,
          user_id: null
        });
      
      if (error) throw error;
      setCurrentFunnelId(nameToSave);

      toast({
        title: isPreviewEnvironment ? '✅ Veröffentlicht (Preview)' : '🚀 Veröffentlicht!',
        description: isPreviewEnvironment
          ? `Für deine Website musst du im Live-Builder veröffentlichen: ${PRODUCTION_BASE_URL}/builder?funnel=${encodeURIComponent(nameToSave)}`
          : `Funnel ist jetzt live unter: ${PRODUCTION_BASE_URL}/embed/${encodeURIComponent(nameToSave)}`,
      });
    } catch (error) {
      console.error('Error publishing funnel:', error);
      toast({
        title: "❌ Fehler beim Veröffentlichen",
        description: "Funnel konnte nicht veröffentlicht werden.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const generatePublicUrl = async () => {
    let nameToUse = funnelName.trim();
    
    // Auto-save if not saved yet
    if (!nameToUse) {
      nameToUse = `funnel-${Date.now()}`;
      setFunnelName(nameToUse);
      
      // Save first
      try {
        const { error } = await supabase
          .from('funnels')
          .upsert({
            name: nameToUse,
            structure: {
              nodes: nodes.map(node => ({
                id: node.id,
                type: node.type,
                position: node.position,
                data: node.data
              })),
              edges: edges.map(edge => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                type: edge.type
              }))
            } as any,
            user_id: null
          });
        if (error) throw error;
        setCurrentFunnelId(nameToUse);
      } catch (error) {
        toast({
          title: "❌ Fehler",
          description: "Funnel konnte nicht gespeichert werden",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      const url = `${window.location.origin}/funnel/${encodeURIComponent(nameToUse)}`;
      
      // Try modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      toast({
        title: "🔗 URL kopiert",
        description: `Öffentliche URL wurde kopiert: ${nameToUse}`,
      });
    } catch (error) {
      console.error('Error copying URL:', error);
      // Show URL in dialog as fallback
      prompt('URL manuell kopieren:', `${window.location.origin}/funnel/${encodeURIComponent(nameToUse)}`);
    }
  };

  // Load funnel from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const funnelParam = urlParams.get('funnel');
    
    if (funnelParam) {
      loadFunnel(funnelParam);
    }
  }, []);

  const loadFunnel = async (funnelName: string) => {
    try {
      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .eq('name', funnelName)
        .single();

      if (error) throw error;

      if (data?.structure && typeof data.structure === 'object') {
        const structure = data.structure as any;
        const loadedNodes: Node[] = structure.nodes || [];
        setNodes(resolveOverlaps(loadedNodes));
        setEdges(structure.edges || []);
        setFunnelName(data.name);
        setCurrentFunnelId(data.name);

        toast({
          title: "Funnel geladen",
          description: `"${data.name}" wurde erfolgreich geladen.`,
        });
      }
    } catch (error) {
      console.error('Error loading funnel:', error);
      toast({
        title: "Laden fehlgeschlagen",
        description: "Der Funnel konnte nicht geladen werden.",
        variant: "destructive",
      });
    }
  };

  // Make edges available globally for preview navigation
  useEffect(() => {
    (window as any).funnelEdges = edges;
    console.log('FunnelBuilder: Updated global edges:', edges);
  }, [edges]);

  // One-time cleanup: ensure loaded funnels aren't stacked on top of each other
  useEffect(() => {
    if (!currentFunnelId) return;
    setNodes((nds) => resolveOverlaps(nds));
  }, [currentFunnelId, setNodes]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedNode) {
        setSelectedNode(null);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (selectedNode && panelRef.current && !panelRef.current.contains(e.target as HTMLElement)) {
        const reactFlowWrapper = document.querySelector('.react-flow');
        if (reactFlowWrapper && reactFlowWrapper.contains(e.target as HTMLElement)) {
          setSelectedNode(null);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedNode]);

  return (
    <div className="h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white flex flex-col">
      {/* Header with Glassmorphism */}
      <div className="bg-black/80 backdrop-blur-xl border-b border-zinc-800/50 p-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/10 transition-all duration-300"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Input
              value={funnelName}
              onChange={(e) => setFunnelName(e.target.value)}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white text-xl font-semibold placeholder:text-white/50 focus:bg-white/15"
              placeholder="Funnel Name eingeben..."
            />
            {currentFunnelId && (
              <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded-full">● Gespeichert</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={saveFunnel}
              disabled={saving}
              className="text-white hover:bg-white/10 transition-all duration-300"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Speichern...' : 'Speichern'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowPreview(true)}
              className="text-white hover:bg-white/10 transition-all duration-300"
            >
              <Play className="w-4 h-4 mr-2" />
              Vorschau
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={generatePublicUrl}
              className="text-white hover:bg-white/10 transition-all duration-300"
            >
              <Copy className="w-4 h-4 mr-2" />
              URL kopieren
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={publishFunnel}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Globe className="w-4 h-4 mr-2" />
              {saving ? 'Veröffentlichen...' : 'Veröffentlichen'}
            </Button>
          </div>
        </div>

        {isPreviewEnvironment && (
          <div className="relative z-10 mt-3 rounded-lg border border-border/40 bg-muted/30 px-3 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="text-sm text-muted-foreground">
              Du bist im <span className="font-semibold text-foreground">Preview/Test</span>. Deine externe Website lädt aber den <span className="font-semibold text-foreground">Live</span>-Funnel von <span className="font-mono text-foreground">{PRODUCTION_BASE_URL}</span>.
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.open(liveBuilderUrl, '_blank')}
              >
                Live-Builder öffnen
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(liveEmbedUrl, '_blank')}
              >
                Live-Embed öffnen
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Enhanced Toolbar */}
        <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl border-r border-zinc-700/50 p-4 w-20 flex flex-col gap-3">
          <Button 
            onClick={addVideoNode}
            variant="ghost" 
            size="sm" 
            className="w-12 h-12 p-0 text-white hover:bg-purple-600/20 hover:scale-105 transition-all duration-300 flex flex-col gap-1 group"
          >
            <div className="w-6 h-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded group-hover:shadow-lg group-hover:shadow-purple-500/30"></div>
            <span className="text-xs">Video</span>
          </Button>
          <Button 
            onClick={addApiNode}
            variant="ghost" 
            size="sm" 
            className="w-12 h-12 p-0 text-white hover:bg-blue-600/20 hover:scale-105 transition-all duration-300 flex flex-col gap-1 group"
          >
            <div className="w-6 h-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded group-hover:shadow-lg group-hover:shadow-blue-500/30"></div>
            <span className="text-xs">API</span>
          </Button>
          <Button 
            onClick={addLeadCaptureNode}
            variant="ghost" 
            size="sm" 
            className="w-12 h-12 p-0 text-white hover:bg-blue-600/20 hover:scale-105 transition-all duration-300 flex flex-col gap-1 group"
          >
            <Users className="w-4 h-4 text-white group-hover:text-blue-300" />
            <span className="text-xs">Lead</span>
          </Button>
          <Button 
            onClick={addEndNode}
            variant="ghost" 
            size="sm" 
            className="w-12 h-12 p-0 text-white hover:bg-red-600/20 hover:scale-105 transition-all duration-300 flex flex-col gap-1 group"
          >
            <div className="w-6 h-4 bg-gradient-to-br from-red-500 to-orange-500 rounded group-hover:shadow-lg group-hover:shadow-red-500/30"></div>
            <span className="text-xs">Ende</span>
          </Button>
        </div>

        {/* Main Canvas with Smart Layout */}
        <div className={`transition-all duration-500 relative ${selectedNode ? 'flex-1' : 'flex-1'}`}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodeDragStop={(_, node) =>
              setNodes((nds) => resolveOverlapsForNode(nds, node.id))
            }
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            minZoom={0.05}
            maxZoom={4}
            className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900"
          >
            <Controls className="bg-zinc-800/80 backdrop-blur-sm border-zinc-700" />
            <Background color="#444" />
          </ReactFlow>
        </div>

        {/* Fixed Properties Panel */}
        {selectedNode && selectedNode.type !== 'start' && (
          <div 
            ref={panelRef}
            className="w-80 bg-gradient-to-b from-zinc-900/95 to-black/95 backdrop-blur-xl border-l border-zinc-700/50 flex flex-col animate-slide-in-right"
          >
            <NodePropertiesPanel
              node={selectedNode}
              nodes={nodes}
              onUpdateNode={updateNodeData}
              onClose={() => setSelectedNode(null)}
            />
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <VideoFunnelPreview
          nodes={nodes}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

export function FunnelBuilder() {
  return (
    <ReactFlowProvider>
      <FunnelBuilderInner />
    </ReactFlowProvider>
  );
}