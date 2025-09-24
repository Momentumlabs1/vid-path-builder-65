import { useState, useEffect } from 'react';
import { VideoPreview } from './VideoPreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, StarIcon } from 'lucide-react';

interface SynchronizedPreviewProps {
  nodeData: any;
  className?: string;
  viewFormat?: 'desktop' | 'mobile';
  showOverlay?: boolean;
}

export function SynchronizedPreview({ 
  nodeData, 
  className = "", 
  viewFormat = 'desktop',
  showOverlay = true 
}: SynchronizedPreviewProps) {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    setCurrentAnswer('');
    setSelectedOptions([]);
    setRating(0);
  }, [nodeData.answerType]);

  const renderAnswerInput = () => {
    const answerType = nodeData.answerType || 'button';

    switch (answerType) {
      case 'button':
        const buttonSize = nodeData.buttonSize || 'default';
        const buttonStyle = nodeData.buttonStyle || 'primary';
        
        const sizeClasses = {
          small: 'py-2 px-4 text-sm',
          default: 'py-3 px-6 text-base',
          large: 'py-4 px-8 text-lg'
        };
        
        const styleClasses = {
          primary: 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600 border shadow-lg',
          transparent: 'bg-white/10 hover:bg-white/20 text-white border-white/40 border backdrop-blur-sm'
        };
        
        return (
          <div className="space-y-3">
            <Button 
              className={`w-full rounded-lg font-medium transition-all duration-200 ${sizeClasses[buttonSize]} ${styleClasses[buttonStyle]}`}
            >
              {nodeData.buttonText || 'Weiter'}
            </Button>
          </div>
        );

      case 'multipleChoice':
        const mcButtonSize = nodeData.buttonSize || 'default';
        const mcButtonStyle = nodeData.buttonStyle || 'primary';
        
        const mcSizeClasses = {
          small: 'py-2 px-3 text-sm',
          default: 'py-3 px-4 text-base',
          large: 'py-4 px-6 text-lg'
        };
        
        return (
          <div className="space-y-2">
            {(nodeData.answers || ['Option A', 'Option B']).map((option: string, index: number) => {
              const isSelected = selectedOptions.includes(option);
              const baseClasses = `w-full text-left justify-start rounded-lg font-medium transition-all duration-200 ${mcSizeClasses[mcButtonSize]}`;
              
              const buttonClasses = mcButtonStyle === 'primary'
                ? isSelected 
                  ? `${baseClasses} bg-purple-600 hover:bg-purple-700 text-white border-purple-600 border shadow-lg`
                  : `${baseClasses} bg-purple-600/20 hover:bg-purple-600/30 text-white border-purple-600/50 border`
                : isSelected
                  ? `${baseClasses} bg-white/20 hover:bg-white/30 text-white border-white border backdrop-blur-sm`
                  : `${baseClasses} bg-white/10 hover:bg-white/20 text-white border-white/40 border backdrop-blur-sm`;
              
              return (
                <button
                  key={index}
                  className={buttonClasses}
                  onClick={() => {
                    if (nodeData.allowMultipleSelection) {
                      setSelectedOptions(prev => 
                        prev.includes(option) 
                          ? prev.filter(o => o !== option)
                          : [...prev, option]
                      );
                    } else {
                      setSelectedOptions([option]);
                    }
                  }}
                >
                  <span className="w-5 h-5 rounded-full border-2 border-current mr-3 flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              );
            })}
            {nodeData.showOptionCount && (
              <p className="text-xs text-zinc-400 text-center mt-2">
                {nodeData.answers?.length || 0} Optionen verfügbar
              </p>
            )}
          </div>
        );

      case 'yesno':
        const ynButtonSize = nodeData.buttonSize || 'default';
        const ynButtonStyle = nodeData.buttonStyle || 'primary';
        
        const ynSizeClasses = {
          small: 'py-2 px-3 text-sm',
          default: 'py-3 px-4 text-base',
          large: 'py-4 px-6 text-lg'
        };
        
        const getYnButtonClasses = (isSelected: boolean) => {
          const baseClasses = `rounded-lg font-medium transition-all duration-200 ${ynSizeClasses[ynButtonSize]}`;
          
          if (ynButtonStyle === 'primary') {
            return isSelected 
              ? `${baseClasses} bg-purple-600 hover:bg-purple-700 text-white border-purple-600 border shadow-lg`
              : `${baseClasses} bg-purple-600/20 hover:bg-purple-600/30 text-white border-purple-600/50 border`;
          } else {
            return isSelected
              ? `${baseClasses} bg-white/20 hover:bg-white/30 text-white border-white border backdrop-blur-sm`
              : `${baseClasses} bg-white/10 hover:bg-white/20 text-white border-white/40 border backdrop-blur-sm`;
          }
        };
        
        return (
          <div className="grid grid-cols-2 gap-3">
            <button 
              className={getYnButtonClasses(currentAnswer === 'yes')}
              onClick={() => setCurrentAnswer('yes')}
            >
              {nodeData.yesText || 'Ja'}
            </button>
            <button 
              className={getYnButtonClasses(currentAnswer === 'no')}
              onClick={() => setCurrentAnswer('no')}
            >
              {nodeData.noText || 'Nein'}
            </button>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-3">
            {nodeData.longText ? (
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder={nodeData.placeholder || 'Ihre Antwort hier eingeben...'}
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white resize-none min-h-[100px]"
                rows={4}
              />
            ) : (
              <Input
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder={nodeData.placeholder || 'Ihre Antwort hier eingeben...'}
                className="bg-zinc-800 border-zinc-700 text-white py-3"
              />
            )}
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
              disabled={!currentAnswer.trim()}
            >
              Antwort senden
            </Button>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-3">
            <Input
              type="email"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="ihre@email.de"
              className="bg-zinc-800 border-zinc-700 text-white py-3"
            />
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
              disabled={!currentAnswer.includes('@')}
            >
              E-Mail bestätigen
            </Button>
          </div>
        );

      case 'rating':
        const maxRating = parseInt(nodeData.maxRating || '5');
        return (
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {Array.from({ length: maxRating }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setRating(i + 1)}
                  className={`w-8 h-8 transition-colors ${
                    i < rating ? 'text-yellow-400' : 'text-zinc-600'
                  }`}
                >
                  <Star className="w-full h-full fill-current" />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-zinc-400">
              {rating > 0 ? `${rating} von ${maxRating} ${maxRating <= 5 ? 'Sternen' : 'Punkten'}` : 'Bewertung auswählen'}
            </p>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
              disabled={rating === 0}
            >
              Bewertung abgeben
            </Button>
          </div>
        );

      default:
        return (
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3">
            Weiter
          </Button>
        );
    }
  };

  const hasDelay = nodeData.delaySeconds > 0;
  const isMobile = viewFormat === 'mobile';
  const videoAspectRatio = isMobile ? 'aspect-[9/16]' : 'aspect-video';
  
  // Set default values for missing properties
  const buttonPosition = nodeData.buttonPosition || 'bottom-center';
  const overlayPosition = nodeData.overlayPosition || 'bottom-center';
  const buttonSize = nodeData.buttonSize || 'default';
  const buttonStyle = nodeData.buttonStyle || 'primary';
  
  // Position calculation function for 9-grid system
  const getPositionClasses = (position: string) => {
    const positions = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'center-left': 'top-1/2 -translate-y-1/2 left-4',
      'center-center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      'center-right': 'top-1/2 -translate-y-1/2 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4'
    };
    return positions[position as keyof typeof positions] || positions['bottom-center'];
  };
  
  return (
    <div className={`bg-gradient-to-br from-zinc-900 to-black rounded-xl overflow-hidden border border-zinc-700/50 ${className}`}>
      {/* Video Preview Container with Integrated Button Overlay */}
      <div className={`relative ${videoAspectRatio} bg-zinc-900`}>
        <VideoPreview 
          videoUrl={nodeData.videoUrl}
          overlayText={nodeData.overlayText}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Overlay Text Display */}
        {nodeData.overlayText && (
          <div className={`absolute pointer-events-none z-10 ${getPositionClasses(overlayPosition)}`}>
            <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-2xl max-w-xs">
              <p className="text-white text-sm font-medium text-center">
                {nodeData.overlayText}
              </p>
            </div>
          </div>
        )}

        {/* Mobile Button Overlay - 9-Position System */}
        {isMobile && showOverlay && !hasDelay && (
          <div className={`absolute pointer-events-auto z-20 ${getPositionClasses(buttonPosition)} ${
            buttonPosition.includes('center') && !buttonPosition.includes('left') && !buttonPosition.includes('right') 
              ? 'w-auto px-4' : 'w-auto'
          }`}>
            <div className="bg-black/70 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-2xl">
              {renderAnswerInput()}
            </div>
          </div>
        )}

        {/* Mobile Delay Message */}
        {isMobile && showOverlay && hasDelay && (
          <div className={`absolute pointer-events-none z-20 ${getPositionClasses(buttonPosition)}`}>
            <div className="bg-black/80 backdrop-blur-sm border border-orange-700/50 rounded-lg p-3">
              <p className="text-orange-400 text-sm text-center">
                ⏱️ Antwort-Optionen erscheinen nach {nodeData.delaySeconds} Sekunden
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Desktop Answer Interface OR Mobile External Interface (when overlay is off) */}
      {(!isMobile || !showOverlay) && (
        <div className="p-4">
          {hasDelay ? (
            <div className="mb-4 p-3 bg-orange-900/20 border border-orange-700 rounded-lg">
              <p className="text-orange-400 text-sm text-center">
                ⏱️ Antwort-Optionen erscheinen nach {nodeData.delaySeconds} Sekunden
              </p>
            </div>
          ) : (
            renderAnswerInput()
          )}
          
          {/* Data Collection Info */}
          {(nodeData.collectContactDetails || !nodeData.skipDataCollection) && (
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
              <p className="text-blue-400 text-xs text-center">
                {nodeData.collectContactDetails ? '📧 Kontaktdaten werden gesammelt' : '📊 Antworten werden gespeichert'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}