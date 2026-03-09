import { useParams } from 'react-router-dom';
import { FunnelBuilder } from '@/components/funnel/FunnelBuilder';

export default function AppBuilder() {
  const { funnelId } = useParams();

  // The FunnelBuilder component handles loading existing funnels via URL params
  // We just need to pass through and let it handle the logic
  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <FunnelBuilder />
    </div>
  );
}
