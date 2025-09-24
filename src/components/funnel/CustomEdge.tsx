import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  Edge,
} from '@xyflow/react';
import { Plus, Video, Square, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CustomEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: any;
  targetPosition: any;
  style?: React.CSSProperties;
  markerEnd?: string;
  data?: any;
}

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: CustomEdgeProps) {
  const { setNodes, setEdges, getEdges, getNodes } = useReactFlow();
  
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const addNodeBetween = (nodeType: string) => {
    const edge = getEdges().find(e => e.id === id);
    if (!edge) return;

    const nodeId = `${nodeType}-${Date.now()}`;
    const middleX = (sourceX + targetX) / 2;
    const middleY = (sourceY + targetY) / 2;

    // Create new node data based on type
    let nodeData;
    switch (nodeType) {
      case 'video':
        nodeData = {
          label: 'Neues Video',
          videoUrl: '',
          overlayText: 'Video Overlay Text',
          answerType: 'button',
          answers: [],
          nextNodes: {}
        };
        break;
      case 'api':
        nodeData = {
          label: 'API Call',
          apiUrl: '',
          method: 'POST',
          headers: {},
          body: '',
          responseMapping: {}
        };
        break;
      case 'end':
        nodeData = {
          label: 'Ende',
          title: 'Vielen Dank!',
          message: 'Sie haben den Funnel erfolgreich abgeschlossen.',
          redirectUrl: ''
        };
        break;
      default:
        return;
    }

    const newNode = {
      id: nodeId,
      type: nodeType,
      position: { x: middleX - 90, y: middleY - 100 },
      data: nodeData,
    };

    // Add the new node
    setNodes((nodes) => [...nodes, newNode]);

    // Remove the current edge and add two new edges
    setEdges((edges) => {
      const filteredEdges = edges.filter(e => e.id !== id);
      const newEdges = [
        {
          id: `${edge.source}-${nodeId}`,
          source: edge.source,
          target: nodeId,
          type: 'custom',
          animated: true,
          style: { stroke: '#8b5cf6', strokeWidth: 2 }
        },
        {
          id: `${nodeId}-${edge.target}`,
          source: nodeId,
          target: edge.target,
          type: 'custom',
          animated: true,
          style: { stroke: '#8b5cf6', strokeWidth: 2 }
        }
      ];
      return [...filteredEdges, ...newEdges];
    });
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          className="absolute pointer-events-all"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="w-8 h-8 p-0 rounded-full bg-purple-600 hover:bg-purple-700 border-2 border-white shadow-lg transition-all duration-200 hover:scale-110"
              >
                <Plus className="w-4 h-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="center" 
              className="bg-zinc-800 border-zinc-700 text-white"
            >
              <DropdownMenuItem 
                onClick={() => addNodeBetween('video')}
                className="cursor-pointer hover:bg-zinc-700"
              >
                <Video className="w-4 h-4 mr-2 text-purple-400" />
                Video hinzufügen
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => addNodeBetween('api')}
                className="cursor-pointer hover:bg-zinc-700"
              >
                <Zap className="w-4 h-4 mr-2 text-blue-400" />
                API-Anbindung
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => addNodeBetween('end')}
                className="cursor-pointer hover:bg-zinc-700"
              >
                <Square className="w-4 h-4 mr-2 text-red-400" />
                Ende hinzufügen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}