import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Users } from 'lucide-react';

export const LeadCaptureNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className={`bg-gradient-to-br from-blue-600 to-blue-700 border-2 rounded-lg p-4 min-w-[200px] ${
      selected ? 'border-blue-400 shadow-lg shadow-blue-400/30' : 'border-blue-500'
    }`}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-400 border-2 border-blue-700"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-400 border-2 border-blue-700"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <Users className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-medium">{(data.label as string) || 'Lead Capture'}</span>
      </div>
      
      <div className="text-xs text-blue-100">
        {(data.title as string) || 'Kontaktdaten erfassen'}
      </div>
      
      <div className="text-xs text-blue-200 mt-1">
        Name, Alter, Email, Telefon
      </div>
    </div>
  );
});