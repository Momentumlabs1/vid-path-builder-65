import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Node } from '@xyflow/react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { X, ChevronLeft, Star, Users, Flag } from 'lucide-react';
import { VideoNode } from './VideoNode';
import { LeadCapture } from './LeadCapture';

interface VideoFunnelPreviewProps {
  nodes: Node[];
  onClose: () => void;
  /** 'builderPreview' = fixed 400x711 device sim, 'embed' = fill available space */
  mode?: 'builderPreview' | 'embed';
}

export function VideoFunnelPreview({ nodes, onClose, mode = 'builderPreview' }: VideoFunnelPreviewProps) {
  const [currentNodeId, setCurrentNodeId] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nodeKey, setNodeKey] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [textInput, setTextInput] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sliderValue, setSliderValue] = useState(2500);

  // Body scroll lock while preview is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Initial node selection: always skip the start node and jump to first connected/video node
  useEffect(() => {
    console.log('VideoFunnelPreview nodes:', nodes);

    if (nodes.length === 0) return;

    const edges = (window as any).funnelEdges || [];
    console.log('Available edges:', edges);

    const startNode = nodes.find(
      (node) => node.type === 'start' || node.id.toLowerCase().includes('start')
    );

    let initialNode: Node | null = null;

    if (startNode && edges.length > 0) {
      const startEdge = edges.find((edge: any) => edge.source === startNode.id);
      if (startEdge) {
        const connectedNode = nodes.find((node) => node.id === startEdge.target);
        if (connectedNode) {
          initialNode = connectedNode;
          console.log('Following edge to connected node:', connectedNode);
        }
      }
    }

    // Fallbacks
    if (!initialNode) initialNode = nodes.find((node) => node.type === 'video') || null;
    if (!initialNode) initialNode = nodes.find((node) => node.type !== 'start') || null;
    if (!initialNode && nodes.length > 0) initialNode = nodes[0];

    if (initialNode) {
      setCurrentNodeId(initialNode.id);
    }
  }, [nodes]);

  const currentNode = nodes.find(node => node.id === currentNodeId);
  const totalNodes = nodes.length;
  const currentStep = nodes.findIndex(node => node.id === currentNodeId) + 1;
  const progress = (currentStep / totalNodes) * 100;

  // If we ever land on a start node (e.g. back navigation), immediately skip it
  useEffect(() => {
    const node = nodes.find((n) => n.id === currentNodeId);
    if (!node || node.type !== 'start') return;

    const edges = (window as any).funnelEdges || [];
    const startEdge = edges.find((edge: any) => edge.source === node.id);

    const targetId =
      startEdge?.target ||
      nodes.find((n) => n.type === 'video')?.id ||
      nodes.find((n) => n.type !== 'start')?.id;

    if (targetId && targetId !== node.id) {
      setCurrentNodeId(targetId);
    }
  }, [currentNodeId, nodes]);
  const saveResponse = async (question: string, answer: string, answerType: string, nodeId: string) => {
    try {
      const funnelName = window.location.pathname.includes('/funnel/') 
        ? window.location.pathname.split('/funnel/')[1]
        : 'preview';

      await supabase.from('funnel_responses').insert({
        funnel_name: funnelName,
        node_id: nodeId,
        question: question,
        answer: answer,
        answer_type: answerType,
        user_session_id: sessionId,
        ip_address: null,
        user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Error saving response:', error);
    }
  };

  const handleAnswer = async (answer: any, answerType: string) => {
    if (!currentNode) return;

    setUserAnswers(prev => ({
      ...prev,
      [currentNodeId]: { answer, answerType }
    }));

    // Save to database
    await saveResponse(
      (currentNode.data.overlayText as string) || 'Question',
      typeof answer === 'string' ? answer : JSON.stringify(answer),
      answerType,
      currentNode.id
    );

    // Priority 1: nextNodes mapping (respects user's answer choice)
    const nextNodes = currentNode.data.nextNodes as Record<string, string> | undefined;
    let nextNodeId: string | null = null;

    if (nextNodes) {
      if (answerType === 'multipleChoice' && typeof answer === 'number') {
        nextNodeId = nextNodes[String(answer)] || null;
      } else if (answerType === 'yesno') {
        nextNodeId = nextNodes[answer ? 'yes' : 'no'] || null;
      } else {
        nextNodeId = nextNodes['default'] || null;
      }
    }

    // Priority 2: Edge fallback (only if nextNodes didn't resolve)
    if (!nextNodeId) {
      const edges = (window as any).funnelEdges || [];
      const outgoingEdge = edges.find((edge: any) => edge.source === currentNode.id);
      if (outgoingEdge) {
        nextNodeId = outgoingEdge.target;
      }
    }

    // Priority 3: Sequential fallback
    if (!nextNodeId) {
      const currentIndex = nodes.findIndex(n => n.id === currentNodeId);
      if (currentIndex < nodes.length - 1) {
        nextNodeId = nodes[currentIndex + 1].id;
      }
    }

    if (nextNodeId) {
      const nextNode = nodes.find(n => n.id === nextNodeId);
      if (nextNode?.type === 'leadCapture') {
        setShowLeadCapture(true);
        setCurrentNodeId(nextNodeId);
      } else {
        // Smooth transition with crossfade
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentNodeId(nextNodeId);
          setNodeKey(prev => prev + 1);
          setTextInput('');
          setSelectedRating(0);
          setTimeout(() => {
            setIsTransitioning(false);
          }, 100);
        }, 200);
      }
    } else {
      setIsCompleted(true);
    }
  };

  const goBack = () => {
    const currentIndex = nodes.findIndex(n => n.id === currentNodeId);
    if (currentIndex <= 0) return;

    for (let i = currentIndex - 1; i >= 0; i--) {
      if (nodes[i]?.type !== 'start') {
        setCurrentNodeId(nodes[i].id);
        return;
      }
    }
  };

  // Handle lead capture completion
  const handleLeadCaptureComplete = () => {
    setShowLeadCapture(false);
    
    // Look for next node after lead capture
    const edges = (window as any).funnelEdges || [];
    const connectedEdge = edges.find((edge: any) => edge.source === currentNodeId);
    
    if (connectedEdge) {
      const nextNode = nodes.find(n => n.id === connectedEdge.target);
      if (nextNode) {
        setCurrentNodeId(connectedEdge.target);
      } else {
        setIsCompleted(true);
      }
    } else {
      setIsCompleted(true);
    }
  };

  // Show lead capture before completion
  if (showLeadCapture && !isCompleted) {
    const funnelName = window.location.pathname.includes('/funnel/') 
      ? window.location.pathname.split('/funnel/')[1]
      : 'preview';
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999] isolate pointer-events-auto">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20"></div>
          <div className="relative z-10 max-w-md mx-auto px-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/30">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Kontaktdaten erfassen
                </h2>
                <p className="text-blue-100">
                  Bitte geben Sie Ihre Daten ein
                </p>
              </div>
              
              <LeadCapture
                funnel_name={funnelName}
                session_id={sessionId}
                onComplete={handleLeadCaptureComplete}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show completion screen if no current node or completed
  if (!currentNode || isCompleted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999] isolate pointer-events-auto">
        <div className="bg-zinc-900 p-6 rounded-lg text-center">
          <h2 className="text-xl text-white mb-2">Funnel beendet</h2>
          <p className="text-zinc-400 mb-4">Vielen Dank für Ihre Teilnahme!</p>
          <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">
            Schließen
          </Button>
        </div>
      </div>
    );
  }

  // Handle end nodes - show lead capture first
  if (currentNode.type === 'end') {
    if (!showLeadCapture && !isCompleted) {
      setShowLeadCapture(true);
      return null; // Will be handled by lead capture rendering above
    }
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999] isolate pointer-events-auto">
        <div className="bg-zinc-900 p-8 rounded-lg text-center max-w-md">
          <h2 className="text-2xl text-white mb-4">{currentNode.data.title as string}</h2>
          <p className="text-zinc-400 mb-6">{currentNode.data.message as string}</p>
          {currentNode.data.redirectUrl ? (
            <Button 
              onClick={() => window.open(currentNode.data.redirectUrl as string, '_blank')}
              className="bg-purple-600 hover:bg-purple-700 mr-2"
            >
              Weiter
            </Button>
          ) : null}
          <Button onClick={onClose} variant="ghost" className="text-white">
            Schließen
          </Button>
        </div>
      </div>
    );
  }

  // Detect mobile vs desktop for responsive preview
  const isMobile = window.innerWidth < 768;
  const isEmbedMode = mode === 'embed';

  // Start nodes should never be visible in the preview/embed player.
  // If we land here briefly, show a neutral placeholder while the effect above skips ahead.
  if (currentNode.type === 'start') {
    return <div className="fixed inset-0 bg-black z-50" />;
  }

  // Handle leadCapture nodes
  if (currentNode.type === 'leadCapture') {
    const funnelName = window.location.pathname.includes('/funnel/') 
      ? window.location.pathname.split('/funnel/')[1]
      : 'preview';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999] isolate pointer-events-auto">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20"></div>
          <div className="relative z-10 max-w-md mx-auto px-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/30">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {(currentNode.data.title as string) || 'Kontaktdaten erfassen'}
                </h2>
                <p className="text-blue-100">
                  {(currentNode.data.description as string) || 'Bitte geben Sie Ihre Daten ein'}
                </p>
              </div>
              
              <LeadCapture
                funnel_name={funnelName}
                session_id={sessionId}
                onComplete={handleLeadCaptureComplete}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For video nodes, render in fullscreen with interactive elements
  if (currentNode.type === 'video') {
    return (
      <div className="fixed inset-0 bg-black z-[9999] isolate pointer-events-auto flex items-center justify-center">
        {/* Mobile Header */}
        <div className="md:hidden bg-black/80 backdrop-blur-sm border-b border-white/10 p-4 flex items-center justify-between absolute top-0 left-0 right-0 z-10">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goBack} 
            disabled={currentStep === 1}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 mx-4">
            <Progress value={progress} className="h-2" />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block absolute top-4 right-4 z-10">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={goBack} 
              disabled={currentStep === 1}
              className="text-white bg-black/50 hover:bg-black/70 backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="text-white bg-black/50 hover:bg-black/70 backdrop-blur-sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Video Node Component - Responsive Container */}
        {/* In embed mode: fill the available space (100% width/height, aspect-ratio optional) */}
        {/* In builderPreview mode: fixed 400x711 "phone" simulation */}
        <div className={`${
          isEmbedMode
            ? 'w-full h-full max-w-[100vw]'
            : isMobile 
              ? 'w-full h-full' 
              : 'w-[400px] h-[711px] max-w-[90vw] max-h-[90vh]'
        } relative transition-opacity duration-300 ease-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <VideoNode
            key={nodeKey}
            id={currentNode.id}
            data={{
              ...currentNode.data,
              isPreview: true,
              onAnswer: handleAnswer,
              textInput,
              setTextInput,
              selectedRating,
              setSelectedRating,
              sliderValue,
              setSliderValue
            }}
            selected={false}
            type="video"
            dragging={false}
            zIndex={1}
            isConnectable={false}
            selectable={false}
            deletable={false}
            draggable={false}
            positionAbsoluteX={0}
            positionAbsoluteY={0}
          />
        </div>
      </div>
    );
  }

  // Fallback for other node types (use original preview)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-[9999] isolate pointer-events-auto">
      <div className="h-full flex flex-col md:flex-row">
        <div className="flex-1 relative bg-black flex items-center justify-center">
          <div className="w-full h-64 md:h-full bg-zinc-800 flex items-center justify-center">
            <div className="text-center text-zinc-400">
              <div className="w-16 h-16 bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">?</span>
              </div>
              <p>Unbekannter Node-Typ: {currentNode.type}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}