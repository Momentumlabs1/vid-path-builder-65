import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Flag } from 'lucide-react';

export const EndNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className={`bg-zinc-900 border-2 rounded-lg p-4 min-w-[200px] ${
      selected ? 'border-red-500' : 'border-zinc-700'
    }`}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-red-500 border-2 border-zinc-900"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
          <Flag className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-medium">{data.label as string}</span>
      </div>
      
      <div className="text-xs text-zinc-400">
        {(data.title as string) || 'Ende des Funnels'}
      </div>
      
      <div className="text-xs text-zinc-500 mt-1">
        {(data.message as string) || 'Vielen Dank für Ihre Teilnahme!'}
      </div>
    </div>
  );
});