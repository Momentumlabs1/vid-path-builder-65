import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { VideoFunnelPreview } from '@/components/funnel/VideoFunnelPreview';
import { Node } from '@xyflow/react';

const FunnelViewer = () => {
  const { funnelId } = useParams();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFunnel = async () => {
      if (!funnelId) {
        setError('Keine Funnel-ID gefunden');
        setLoading(false);
        return;
      }

      try {
        // Try decoding the URL in case it's encoded
        const decodedFunnelId = decodeURIComponent(funnelId);
        
        // Try both original and decoded funnel ID
        let { data, error } = await supabase
          .from('funnels')
          .select('structure')
          .eq('name', decodedFunnelId)
          .maybeSingle();

        // If not found with decoded name, try original
        if (!data && !error) {
          const result = await supabase
            .from('funnels')
            .select('structure')
            .eq('name', funnelId)
            .maybeSingle();
          data = result.data;
          error = result.error;
        }

        if (error) throw error;
        
        if (data?.structure && typeof data.structure === 'object') {
          const structure = data.structure as any;
          setNodes(structure.nodes || []);
        } else {
          setError('Funnel wurde nicht gefunden. Überprüfen Sie die URL.');
        }
      } catch (err) {
        console.error('Error loading funnel:', err);
        setError(`Funnel "${funnelId}" konnte nicht geladen werden`);
      } finally {
        setLoading(false);
      }
    };

    loadFunnel();
  }, [funnelId]);

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Lade Funnel...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">{error}</div>
      </div>
    );
  }

  if (nodes.length === 0) {
    return <Navigate to="/404" replace />;
  }

  return (
    <VideoFunnelPreview
      nodes={nodes}
      onClose={() => window.close()}
    />
  );
};

export default FunnelViewer;