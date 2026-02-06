import { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { VideoPreview } from './VideoPreview';
import { UniversalButton } from './UniversalButton';

interface SynchronizedPreviewProps {
  nodeData: any;
  className?: string;
  viewFormat?: 'desktop' | 'mobile';
  showOverlay?: boolean;
}

// Keep these mappings aligned with VideoNode.tsx (unified dimension system)
const getWidthClasses = (width: string) => {
  switch (width) {
    case 'xs':
      return 'w-[80px]';
    case 'small':
      return 'w-[120px]';
    case 'medium':
      return 'w-[160px]';
    case 'large':
      return 'w-[200px]';
    case 'xl':
      return 'w-[240px]';
    case '2xl':
      return 'w-[280px]';
    case '3xl':
      return 'w-[320px]';
    case '4xl':
      return 'w-[360px]';
    case 'full':
      return 'w-full max-w-[520px]';
    default:
      return 'w-auto min-w-[80px]';
  }
};

const getHeightClasses = (height: string) => {
  switch (height) {
    case 'xs':
      return 'h-[24px]';
    case 'small':
      return 'h-[28px]';
    case 'medium':
      return 'h-[36px]';
    case 'large':
      return 'h-[44px]';
    case 'xl':
      return 'h-[52px]';
    case '2xl':
      return 'h-[60px]';
    case '3xl':
      return 'h-[72px]';
    case '4xl':
      return 'h-[84px]';
    default:
      return 'h-[36px]';
  }
};

const getTextSizeClasses = (size: string) => {
  switch (size) {
    case 'xs':
      return 'text-[10px]';
    case 'small':
      return 'text-[12px]';
    case 'medium':
      return 'text-[14px]';
    case 'large':
      return 'text-[16px]';
    case 'xl':
      return 'text-[18px]';
    case '2xl':
      return 'text-[20px]';
    default:
      return 'text-[12px]';
  }
};

// Same keys as VideoNode.tsx / NodePropertiesPanel.tsx
const getPositionClasses = (position: string) => {
  const positions: Record<string, string> = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'middle-left': 'top-1/2 left-4 -translate-y-1/2',
    'middle-center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'middle-right': 'top-1/2 right-4 -translate-y-1/2',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };

  return positions[position] || positions['bottom-center'];
};

export function SynchronizedPreview({
  nodeData,
  className = '',
  viewFormat = 'desktop',
  showOverlay = true,
}: SynchronizedPreviewProps) {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    setCurrentAnswer('');
    setSelectedOptions([]);
    setRating(0);
  }, [nodeData?.answerType, nodeData?.videoUrl]);

  const answerType = (nodeData?.answerType as string) || 'button';
  const hasDelay = Number(nodeData?.delaySeconds) > 0;

  const overlayTextEnabled = Boolean(nodeData?.overlayText);
  const textPosition = (nodeData?.textPosition as string) || 'none';
  const textStyle = (nodeData?.textStyle as string) || 'glassmorphism';
  const textSize = (nodeData?.textSize as string) || 'medium';

  // Funnel player renders vertical content; preview should match that.
  const videoAspectRatio = viewFormat === 'mobile' ? 'aspect-[9/16]' : 'aspect-[9/16]';

  const renderAnswerUi = () => {
    if (answerType === 'none') return null;

    const buttonPosition = (nodeData?.buttonPosition as string) || 'bottom-center';
    const wrapperBase = `absolute ${getPositionClasses(buttonPosition)} z-50 pointer-events-auto`;

    switch (answerType) {
      case 'button': {
        const buttonColor = (nodeData?.buttonColor as string) || 'purple';
        const buttonStyle = (nodeData?.buttonStyle as string) || 'glassmorphism';
        const buttonHeight = (nodeData?.buttonHeight as string) || 'medium';
        const buttonWidth = (nodeData?.buttonWidth as string) || 'auto';
        const buttonTextSize = (nodeData?.buttonTextSize as string) || 'small';

        const widthClass = getWidthClasses(buttonWidth);
        const heightClass = getHeightClasses(buttonHeight);
        const textSizeClass = getTextSizeClasses(buttonTextSize);

        const ui = (
          <UniversalButton
            text={(nodeData?.buttonText as string) || 'Weiter'}
            color={buttonColor as any}
            style={buttonStyle as any}
            size="small"
            onClick={() => setCurrentAnswer('clicked')}
            className={`${widthClass} ${heightClass} ${textSizeClass}`}
          />
        );

        return showOverlay ? <div className={wrapperBase}>{ui}</div> : <div className="mt-4">{ui}</div>;
      }

      case 'multipleChoice': {
        const answers = (nodeData?.answers as string[]) || ['Option A', 'Option B'];
        const allowMultipleSelection = Boolean(nodeData?.allowMultipleSelection);

        const mcPosition = (nodeData?.mcPosition as string) || (nodeData?.buttonPosition as string) || 'bottom-center';
        const mcButtonHeight = (nodeData?.mcButtonHeight as string) || 'medium';
        const mcTextSize = (nodeData?.mcTextSize as string) || 'small';
        const mcLayout = (nodeData?.mcLayout as string) || 'vertical';
        const mcButtonWidth = (nodeData?.mcButtonWidth as string) || 'auto';

        const widthClass = getWidthClasses(mcButtonWidth);
        const heightClass = getHeightClasses(mcButtonHeight);
        const textSizeClass = getTextSizeClasses(mcTextSize);

        const getLayoutClasses = (layout: string) => {
          switch (layout) {
            case 'horizontal':
              return 'flex gap-2 flex-wrap justify-center';
            case 'grid':
              return 'grid grid-cols-2 gap-2 max-w-md';
            default:
              return 'space-y-2';
          }
        };

        const ui = (
          <div className={getLayoutClasses(mcLayout)}>
            {answers.map((answer: string, index: number) => {
              const color = (nodeData?.[`mcColor_${index}`] as string) || (nodeData?.buttonColor as string) || 'purple';
              const style = (nodeData?.[`mcStyle_${index}`] as string) || (nodeData?.buttonStyle as string) || 'glassmorphism';
              const isSelected = selectedOptions.includes(answer);

              return (
                <UniversalButton
                  key={index}
                  text={`${String.fromCharCode(65 + index)}. ${answer}`}
                  color={color as any}
                  style={style as any}
                  size="small"
                  onClick={() => {
                    if (allowMultipleSelection) {
                      setSelectedOptions((prev) =>
                        prev.includes(answer) ? prev.filter((o) => o !== answer) : [...prev, answer]
                      );
                    } else {
                      setSelectedOptions([answer]);
                    }
                  }}
                  className={`${widthClass} ${heightClass} ${textSizeClass} ${isSelected ? 'ring-2 ring-white/40' : ''}`}
                />
              );
            })}
          </div>
        );

        return showOverlay ? (
          <div className={`absolute ${getPositionClasses(mcPosition)} z-50 pointer-events-auto`}>{ui}</div>
        ) : (
          <div className="mt-4">{ui}</div>
        );
      }

      case 'yesno': {
        const ynPosition = (nodeData?.ynPosition as string) || (nodeData?.buttonPosition as string) || 'bottom-center';

        const ui = (
          <div className="grid grid-cols-2 gap-2 w-[280px] max-w-[90vw]">
            <UniversalButton
              text={(nodeData?.yesText as string) || 'Ja'}
              color={((nodeData?.yesColor as string) || 'green') as any}
              style={((nodeData?.yesStyle as string) || 'glassmorphism') as any}
              size="small"
              onClick={() => setCurrentAnswer('yes')}
              className={`${getHeightClasses((nodeData?.ynButtonHeight as string) || 'medium')} ${getTextSizeClasses((nodeData?.ynTextSize as string) || 'small')}`}
            />
            <UniversalButton
              text={(nodeData?.noText as string) || 'Nein'}
              color={((nodeData?.noColor as string) || 'red') as any}
              style={((nodeData?.noStyle as string) || 'glassmorphism') as any}
              size="small"
              onClick={() => setCurrentAnswer('no')}
              className={`${getHeightClasses((nodeData?.ynButtonHeight as string) || 'medium')} ${getTextSizeClasses((nodeData?.ynTextSize as string) || 'small')}`}
            />
          </div>
        );

        return showOverlay ? (
          <div className={`absolute ${getPositionClasses(ynPosition)} z-50 pointer-events-auto`}>{ui}</div>
        ) : (
          <div className="mt-4">{ui}</div>
        );
      }

      case 'text':
      case 'email': {
        const inputHeight = (nodeData?.inputHeight as string) || 'medium';
        const inputWidth = (nodeData?.inputWidth as string) || 'full';
        const inputTextSize = (nodeData?.inputTextSize as string) || 'small';

        const submitButtonColor = (nodeData?.submitButtonColor as string) || 'purple';
        const submitButtonStyle = (nodeData?.submitButtonStyle as string) || 'glassmorphism';
        const submitButtonText = (nodeData?.submitButtonText as string) || 'Senden';
        const submitButtonHeight = (nodeData?.submitButtonHeight as string) || 'medium';
        const submitButtonWidth = (nodeData?.submitButtonWidth as string) || 'full';
        const submitButtonTextSize = (nodeData?.submitButtonTextSize as string) || 'small';

        const getInputWidthClass = (width: string) => {
          switch (width) {
            case 'small':
              return 'w-[200px]';
            case 'medium':
              return 'w-[280px]';
            case 'large':
              return 'w-[320px]';
            case 'xl':
              return 'w-[400px]';
            case 'full':
              return 'w-full max-w-[520px]';
            default:
              return 'w-full max-w-[400px]';
          }
        };

        const inputHeightClass = getHeightClasses(inputHeight);
        const inputWidthClass = getInputWidthClass(inputWidth);
        const inputTextSizeClass = getTextSizeClasses(inputTextSize);

        const submitWidthClass = getWidthClasses(submitButtonWidth);
        const submitHeightClass = getHeightClasses(submitButtonHeight);
        const submitTextSizeClass = getTextSizeClasses(submitButtonTextSize);

        const ui = (
          <div className="space-y-2 w-full max-w-[520px]">
            <Input
              type={answerType === 'email' ? 'email' : 'text'}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder={(nodeData?.placeholder as string) || 'Hier eingeben...'}
              className={`${inputWidthClass} ${inputHeightClass} ${inputTextSizeClass} px-3 glass-effect rounded-lg text-white font-figtree placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 smooth-transition`}
            />
            <UniversalButton
              text={submitButtonText}
              color={submitButtonColor as any}
              style={submitButtonStyle as any}
              size="small"
              onClick={() => setCurrentAnswer('submitted')}
              disabled={!String(currentAnswer).trim()}
              className={`${submitWidthClass} ${submitHeightClass} ${submitTextSizeClass}`}
            />
          </div>
        );

        return showOverlay ? <div className={wrapperBase}>{ui}</div> : <div className="mt-4">{ui}</div>;
      }

      case 'rating': {
        const maxRating = parseInt((nodeData?.maxRating as string) || '5', 10);

        const ui = (
          <div className="space-y-3">
            <div className="flex justify-center gap-2">
              {Array.from({ length: maxRating }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setRating(i + 1)}
                  className={`w-8 h-8 transition-colors ${i < rating ? 'text-yellow-400' : 'text-zinc-600'}`}
                >
                  <Star className="w-full h-full fill-current" />
                </button>
              ))}
            </div>
            <UniversalButton
              text={(nodeData?.ratingSubmitText as string) || 'Bewertung abgeben'}
              color={((nodeData?.ratingSubmitColor as string) || 'purple') as any}
              style={((nodeData?.ratingSubmitStyle as string) || 'glassmorphism') as any}
              size="small"
              onClick={() => setCurrentAnswer('rated')}
              disabled={rating === 0}
              className={`${getWidthClasses('full')} ${getHeightClasses((nodeData?.ratingSubmitHeight as string) || 'medium')} ${getTextSizeClasses((nodeData?.ratingSubmitTextSize as string) || 'small')}`}
            />
          </div>
        );

        return showOverlay ? <div className={wrapperBase}>{ui}</div> : <div className="mt-4">{ui}</div>;
      }

      default:
        return null;
    }
  };

  const textOverlay = useMemo(() => {
    if (!overlayTextEnabled) return null;
    if (!textPosition || textPosition === 'none') return null;

    return (
      <div className={`absolute ${getPositionClasses(textPosition)} max-w-xs pointer-events-none z-30 slide-up`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-xl -m-2" />
        <div
          className={`relative px-6 py-3 rounded-xl smooth-transition ${
            textStyle === 'solid'
              ? 'bg-black/80'
              : textStyle === 'outline'
                ? 'border-2 border-white/50 bg-transparent'
                : 'glass-effect'
          }`}
        >
          <p
            className={`text-white font-figtree font-medium text-gradient text-shadow-glow ${
              textSize === 'small' ? 'text-sm' : textSize === 'large' ? 'text-lg' : 'text-base'
            }`}
          >
            {String(nodeData?.overlayText || '')}
          </p>
        </div>
      </div>
    );
  }, [overlayTextEnabled, textPosition, textStyle, textSize, nodeData?.overlayText]);

  return (
    <div className={`bg-gradient-to-br from-zinc-900 to-black rounded-xl overflow-hidden border border-zinc-700/50 ${className}`}>
      <div className={`relative ${videoAspectRatio} bg-zinc-900`}>
        <VideoPreview
          videoUrl={String(nodeData?.videoUrl || '')}
          overlayText={undefined}
          className="absolute inset-0 w-full h-full"
        />

        {showOverlay && hasDelay && (
          <div className={`absolute ${getPositionClasses((nodeData?.buttonPosition as string) || 'bottom-center')} z-40 pointer-events-none`}>
            <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-2xl">
              <p className="text-white text-xs font-medium text-center">
                Antwort-Optionen erscheinen nach {Number(nodeData?.delaySeconds)}s
              </p>
            </div>
          </div>
        )}

        {textOverlay}

        {showOverlay && !hasDelay && renderAnswerUi()}
      </div>

      {!showOverlay && <div className="p-4">{renderAnswerUi()}</div>}
    </div>
  );
}
