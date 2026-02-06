import { useParams, useSearchParams } from 'react-router-dom';
import { VideoFunnelPreview } from '@/components/funnel/VideoFunnelPreview';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Node } from '@xyflow/react';

const EmbedViewer = () => {
  const { funnelId } = useParams();
  const [searchParams] = useSearchParams();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract URL parameters for personalization
  const urlParams = {
    contact_name: searchParams.get('contact_name'),
    contact_email: searchParams.get('contact_email'),
    utm_source: searchParams.get('utm_source'),
    utm_medium: searchParams.get('utm_medium'),
    utm_campaign: searchParams.get('utm_campaign'),
  };

  useEffect(() => {
    if (!funnelId) return;
    
    const loadFunnel = async () => {
      try {
        setLoading(true);
        
        // Try both decoded and original funnelId
        const funnelIds = [decodeURIComponent(funnelId), funnelId];
        let funnelData = null;
        
        for (const id of funnelIds) {
          const { data, error } = await supabase
            .from('funnels')
            .select('structure, is_public')
            .eq('name', id)
            .eq('is_public', true)
            .single();
          
          if (data && !error) {
            funnelData = data;
            break;
          }
        }
        
        if (!funnelData) {
          throw new Error('Funnel not found');
        }
        
        const structure = funnelData.structure;
        const loadedNodes = structure?.nodes || [];
        const loadedEdges = structure?.edges || [];
        
        // Make edges globally available for VideoFunnelPreview
        (window as any).funnelEdges = loadedEdges;
        console.log('Loaded edges for funnel:', loadedEdges.length);
        
        // Inject URL parameters into lead capture nodes
        const enhancedNodes = loadedNodes.map((node: any) => {
          if (node.type === 'end' && node.data?.isLeadCapture) {
            return {
              ...node,
              data: {
                ...node.data,
                prefillData: urlParams
              }
            };
          }
          return node;
        });
        
        setNodes(enhancedNodes);
        
        // Send embed event to parent
        sendEventToParent('funnel_loaded', {
          funnelId,
          nodeCount: enhancedNodes.length,
          urlParams
        });
        
      } catch (err) {
        console.error('Error loading funnel:', err);
        setError('Funnel konnte nicht geladen werden');
        sendEventToParent('funnel_error', { error: 'Load failed' });
      } finally {
        setLoading(false);
      }
    };
    
    loadFunnel();
  }, [funnelId]);

  const sendEventToParent = (eventType: string, data: any = {}) => {
    // Send to parent window (for iframe embeds)
    if (window.parent !== window) {
      window.parent.postMessage({
        type: `funnel_${eventType}`,
        funnelId,
        data
      }, '*');
    }
  };

  const handleClose = () => {
    sendEventToParent('funnel_closed');
    
    // For standalone embeds, try to close the window
    if (window.opener) {
      window.close();
    } else if (window.parent !== window) {
      // For iframe embeds, send close message to parent
      sendEventToParent('funnel_close_requested');
    }
  };

  // Send funnel completion event
  const handleFunnelComplete = (data: any) => {
    sendEventToParent('funnel_completed', data);
  };

  // Send lead capture event
  const handleLeadCaptured = (data: any) => {
    sendEventToParent('lead_captured', data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl font-semibold text-white/80">Lade Funnel...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-red-400 mb-4">Fehler</div>
          <div className="text-white/60">{error}</div>
        </div>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-white/80 mb-4">Funnel nicht gefunden</div>
          <div className="text-white/60">Der angeforderte Funnel existiert nicht oder konnte nicht geladen werden.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <VideoFunnelPreview 
        nodes={nodes} 
        onClose={handleClose}
        mode="embed"
      />
    </div>
  );
};

export default EmbedViewer;