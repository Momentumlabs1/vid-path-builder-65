import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Zap, Globe, Server } from 'lucide-react';

export const ApiNode = memo(({ data, selected }: NodeProps) => {
  const hasApiUrl = data.apiUrl;
  const nodeName = String(data.label || 'API Call');
  const method = String(data.method || 'POST');
  
  return (
    <div className={`bg-zinc-900 border-2 rounded-lg overflow-hidden min-w-[180px] max-w-[180px] ${
      selected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-zinc-700'
    }`}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-zinc-900"
      />
      
      {/* API Visual */}
      <div className="w-full aspect-[9/16] bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-3">
          <Zap className="w-8 h-8 text-blue-400" />
        </div>
        
        <div className="text-center px-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-xs font-bold">{method}</span>
          </div>
          
          {hasApiUrl ? (
            <div className="bg-black/40 rounded px-2 py-1">
              <p className="text-white text-xs font-mono truncate">
                {new URL(String(data.apiUrl)).hostname}
              </p>
            </div>
          ) : (
            <div className="bg-black/40 rounded px-2 py-1">
              <p className="text-zinc-400 text-xs">Keine URL</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Node Info */}
      <div className="p-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
            <Server className="w-2 h-2 text-white" />
          </div>
          <span className="text-white font-medium text-xs truncate">{nodeName}</span>
        </div>
        
        <div className="space-y-0.5">
          <div className="text-xs text-zinc-400">
            <span className="text-blue-400">API Integration</span>
          </div>
          {data.timeout && (
            <div className="text-xs text-zinc-400">
              <span className="text-orange-400">{String(data.timeout)}ms timeout</span>
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-zinc-900"
      />
    </div>
  );
});