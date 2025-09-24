import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';

export const StartNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className={`bg-gradient-to-br from-green-600 to-green-700 border-2 rounded-lg p-4 min-w-[200px] ${
      selected ? 'border-green-400 shadow-lg shadow-green-400/30' : 'border-green-500'
    }`}>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-400 border-2 border-green-700"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <Play className="w-4 h-4 text-white ml-0.5" />
        </div>
        <span className="text-white font-medium">{(data.label as string) || 'Funnel Start'}</span>
      </div>
      
      <div className="text-xs text-green-100">
        Startpunkt des Funnels
      </div>
    </div>
  );
});