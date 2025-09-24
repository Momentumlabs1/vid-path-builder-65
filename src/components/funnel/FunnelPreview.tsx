import { useState } from 'react';
import { Node } from '@xyflow/react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { X, ChevronLeft, Star } from 'lucide-react';

interface FunnelPreviewProps {
  nodes: Node[];
  startNodeId: string;
  onClose: () => void;
}

export function FunnelPreview({ nodes, startNodeId, onClose }: FunnelPreviewProps) {
  const [currentNodeId, setCurrentNodeId] = useState(startNodeId);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [textInput, setTextInput] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [sessionId] = useState(() => crypto.randomUUID());

  const currentNode = nodes.find(node => node.id === currentNodeId);
  const totalNodes = nodes.length;
  const currentStep = nodes.findIndex(node => node.id === currentNodeId) + 1;
  const progress = (currentStep / totalNodes) * 100;

  // Save response to database
  const saveResponse = async (question: string, answer: string, answerType: string, nodeId: string) => {
    try {
      // Get funnel name from URL or use a default
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
        ip_address: null, // Could be implemented with a service
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

    // Branching Logic
    let nextNodeId = null;
    const nextNodes = currentNode.data.nextNodes as Record<string, string>;
    
    if (answerType === 'multipleChoice' && typeof answer === 'number') {
      nextNodeId = nextNodes?.[answer];
    } else if (answerType === 'yesno') {
      nextNodeId = nextNodes?.[answer ? 'yes' : 'no'];
    } else {
      nextNodeId = nextNodes?.default;
    }

    // Fallback: find next node in sequence
    if (!nextNodeId) {
      const currentIndex = nodes.findIndex(n => n.id === currentNodeId);
      if (currentIndex < nodes.length - 1) {
        nextNodeId = nodes[currentIndex + 1].id;
      }
    }

    if (nextNodeId) {
      setTimeout(() => {
        setCurrentNodeId(nextNodeId);
        setTextInput('');
        setSelectedRating(0);
      }, 300);
    }
  };

  const goBack = () => {
    const currentIndex = nodes.findIndex(n => n.id === currentNodeId);
    if (currentIndex > 0) {
      setCurrentNodeId(nodes[currentIndex - 1].id);
    }
  };

  if (!currentNode) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
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

  if (currentNode.type === 'end') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-black border-b border-zinc-800 p-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={goBack} disabled={currentStep === 1}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 mx-4">
          <Progress value={progress} className="h-2" />
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block absolute top-4 right-4 z-10">
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white bg-black bg-opacity-50">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="h-full flex flex-col md:flex-row">
        {/* Video Section */}
        <div className="flex-1 relative bg-black flex items-center justify-center">
          {currentNode.data.videoUrl ? (
            <video
              src={currentNode.data.videoUrl as string}
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-64 md:h-full bg-zinc-800 flex items-center justify-center">
              <div className="text-center text-zinc-400">
                <div className="w-16 h-16 bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">▶</span>
                </div>
                <p>Video wird hier angezeigt</p>
              </div>
            </div>
          )}

          {/* Video Overlay */}
          {currentNode.data.overlayText && (
            <div className="absolute top-4 left-4 right-4 md:top-8 md:left-8 md:right-8">
              <div className="bg-black bg-opacity-70 p-4 rounded-lg">
                <h2 className="text-xl md:text-2xl text-white font-semibold">
                  {currentNode.data.overlayText as string}
                </h2>
              </div>
            </div>
          )}
        </div>

        {/* Interaction Panel */}
        <div className="w-full md:w-96 bg-zinc-900 p-6 flex flex-col justify-center">
          <div className="hidden md:block mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Schritt {currentStep} von {totalNodes}</span>
              <Button variant="ghost" size="sm" onClick={goBack} disabled={currentStep === 1}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Answer Interactions */}
          <div className="space-y-4">
            {currentNode.data.answerType === 'button' && (
              <Button
                onClick={() => handleAnswer('continue', 'button')}
                className="w-full h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg font-semibold shadow-lg shadow-purple-500/25"
              >
                Weiter
              </Button>
            )}

            {currentNode.data.answerType === 'multipleChoice' && (
              <div className="space-y-3">
                <p className="text-white text-lg mb-4">Bitte wählen Sie eine Option:</p>
                {((currentNode.data.answers as string[]) || []).map((answer: string, index: number) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(index, 'multipleChoice')}
                    variant="outline"
                    className="w-full h-12 justify-start text-left bg-zinc-800 border-zinc-700 text-white hover:bg-purple-600 hover:border-purple-500 transition-all"
                  >
                    <span className="font-semibold mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {answer}
                  </Button>
                ))}
              </div>
            )}

            {currentNode.data.answerType === 'yesno' && (
              <div className="space-y-3">
                <p className="text-white text-lg mb-4">Ihre Antwort:</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleAnswer(true, 'yesno')}
                    className="h-12 bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    Ja
                  </Button>
                  <Button
                    onClick={() => handleAnswer(false, 'yesno')}
                    className="h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
                  >
                    Nein
                  </Button>
                </div>
              </div>
            )}

            {(currentNode.data.answerType === 'text' || currentNode.data.answerType === 'email') && (
              <div className="space-y-4">
                <p className="text-white text-lg">
                  {currentNode.data.answerType === 'email' ? 'Ihre E-Mail-Adresse:' : 'Ihre Antwort:'}
                </p>
                <Input
                  type={currentNode.data.answerType === 'email' ? 'email' : 'text'}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={(currentNode.data.placeholder as string) || 'Hier eingeben...'}
                  className="bg-zinc-800 border-zinc-700 text-white h-12"
                />
                <Button
                  onClick={() => handleAnswer(textInput, currentNode.data.answerType as string)}
                  disabled={!textInput.trim()}
                  className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                >
                  Weiter
                </Button>
              </div>
            )}

            {currentNode.data.answerType === 'rating' && (
              <div className="space-y-4">
                <p className="text-white text-lg mb-4">Wie würden Sie uns bewerten?</p>
                <div className="flex justify-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSelectedRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= selectedRating
                            ? 'text-yellow-400 fill-current'
                            : 'text-zinc-500'
                        } hover:text-yellow-400 transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                <Button
                  onClick={() => handleAnswer(selectedRating, 'rating')}
                  disabled={selectedRating === 0}
                  className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                >
                  Bewertung abgeben
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}