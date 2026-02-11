import { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UniversalButton } from './UniversalButton';

export const VideoNode = memo(({ data, selected }: NodeProps) => {
  const hasVideo = data.videoUrl;
  const nodeName = data.label || (hasVideo ? 'Video Node' : 'Kein Video');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [timedCountdown, setTimedCountdown] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Preview mode detection and state management
  const isPreview = data.isPreview;
  const textInput = isPreview ? data.textInput : currentAnswer;
  const setTextInput = isPreview ? data.setTextInput : setCurrentAnswer;
  const selectedRating = isPreview ? data.selectedRating : rating;
  const setSelectedRating = isPreview ? data.setSelectedRating : setRating;

  // Timed visibility settings
  const timedVisibility = data.timedVisibility as boolean;
  const visibilityStartTime = Number(data.visibilityStartTime) || 0;
  const visibilityDuration = Number(data.visibilityDuration) || 10;
  const showCountdownTimer = data.showCountdownTimer !== false; // default true
  const visibilityEndTime = visibilityStartTime + visibilityDuration;

  // Video time tracking for timed visibility
  useEffect(() => {
    if (!isPreview || !timedVisibility) return;

    // If there's no playable video (missing URL or element not mounted), don't block interactions.
    if (!data.videoUrl) {
      setShowButtons(true);
      setTimedCountdown(null);
      return;
    }

    const video = videoRef.current;
    if (!video) {
      setShowButtons(true);
      setTimedCountdown(null);
      return;
    }

    let didReceiveTimeUpdate = false;

    const handleTimeUpdate = () => {
      didReceiveTimeUpdate = true;

      const currentTime = video.currentTime;
      const duration = video.duration || 0;
      setVideoCurrentTime(currentTime);
      setVideoDuration(duration);

      // Update progress bar
      if (duration > 0) {
        setVideoProgress((currentTime / duration) * 100);
      }

      // Timed window
      const isInWindow = currentTime >= visibilityStartTime && currentTime < visibilityEndTime;
      setShowButtons(isInWindow);

      // Update countdown
      if (isInWindow && showCountdownTimer) {
        const remaining = Math.ceil(visibilityEndTime - currentTime);
        setTimedCountdown(remaining);
      } else {
        setTimedCountdown(null);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    // Fallback: if autoplay is blocked and timeupdate never fires, don't hide buttons forever.
    const autoplayFallback = window.setTimeout(() => {
      if (!didReceiveTimeUpdate) {
        setShowButtons(true);
        setTimedCountdown(null);
      }
    }, 1500);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      window.clearTimeout(autoplayFallback);
    };
  }, [isPreview, timedVisibility, visibilityStartTime, visibilityEndTime, showCountdownTimer, data.videoUrl]);

  // Standard delay system for button visibility (when NOT using timed visibility)
  useEffect(() => {
    if (isPreview && !timedVisibility) {
      // Only apply delay when a video is actually loaded
      const delaySeconds = data.videoUrl ? (Number(data.delaySeconds) || 0) : 0;
      if (delaySeconds > 0) {
        setShowButtons(false);
        const timer = setTimeout(() => {
          setShowButtons(true);
        }, delaySeconds * 1000);
        
        return () => clearTimeout(timer);
      } else {
        setShowButtons(true);
      }
    } else if (!isPreview) {
      // Always show in builder mode
      setShowButtons(true);
    }
  }, [isPreview, data.delaySeconds, timedVisibility, data.videoUrl]);

  // 9-Positionen Grid System
  const getPositionClasses = (position: string) => {
    const positions = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'middle-left': 'top-1/2 left-4 -translate-y-1/2',
      'middle-center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      'middle-right': 'top-1/2 right-4 -translate-y-1/2',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4'
    };
    return positions[position as keyof typeof positions] || positions['bottom-center'];
  };

  const handleAnswerClick = (answer: any, answerType: string) => {
    if (isPreview && typeof data.onAnswer === 'function') {
      data.onAnswer(answer, answerType);
    } else {
      // Builder mode - just update local state
      if (answerType === 'text' || answerType === 'email') {
        setCurrentAnswer(answer);
      } else if (answerType === 'rating') {
        setRating(answer);
      }
    }
  };

  // Countdown Timer UI Component
  const renderCountdownTimer = () => {
    if (!isPreview || !timedVisibility || !showCountdownTimer || timedCountdown === null) {
      return null;
    }
    
    return (
      <div className="absolute top-2 right-2 z-50 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm rounded-full px-2.5 py-1 border border-orange-500/50">
          <Clock className="w-3 h-3 text-orange-400 animate-pulse" />
          <span className="text-orange-400 text-xs font-bold tabular-nums">
            {timedCountdown}s
          </span>
        </div>
      </div>
    );
  };

  // Get progress bar color based on button color
  const getProgressBarColor = () => {
    const buttonColor = (data.buttonColor as string) || 'purple';
    const colorMap: Record<string, string> = {
      purple: 'progress-purple',
      blue: 'progress-blue',
      green: 'progress-green',
      orange: 'progress-orange',
      red: 'progress-red',
      white: 'progress-white',
      yellow: 'progress-yellow'
    };
    return colorMap[buttonColor] || 'progress-purple';
  };

  // Render progress bar for preview mode
  const renderProgressBar = () => {
    if (!isPreview || videoDuration === 0) return null;

    // Avoid width-driven layout thrash + transition jitter by using transform-based rendering.
    const progressScale = Math.max(0, Math.min(1, videoProgress / 100));

    return (
      <div className="absolute top-0 left-0 right-0 z-50 h-1 bg-black/30">
        <div
          className={`h-full w-full ${getProgressBarColor()} rounded-r-full origin-left`}
          style={{ transform: `scaleX(${progressScale})` }}
        />
      </div>
    );
  };

  const renderAnswerButtons = () => {
    // Fallback to 'button' if no answerType is set
    const answerType = data.answerType || 'button';
    
    // Hide if explicitly set to 'none' or if delay is active
    if (answerType === 'none') return null;
    if (isPreview && !showButtons) return null;

    const buttonPosition = (data.buttonPosition as string) || 'bottom-center';

    const containerClasses = `absolute ${getPositionClasses(buttonPosition)} z-50 pointer-events-auto`;

    // =============================================================================
    // UNIFIED DIMENSION SYSTEM - Same pixel values in Builder, Preview, AND Embed
    // These values MUST match the labels shown in NodePropertiesPanel.tsx
    // =============================================================================
    
    // Width: Uses exact pixel values matching editor labels
    // XS=80px, S=120px, M=160px, L=200px, XL=240px, 2XL=280px, full=100% (max 520px)
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

    // Height: Uses exact pixel values matching editor labels
    // XS=24px, S=28px, M=36px, L=44px, XL=52px, 2XL=60px
    // NOTE: No py-* padding mixed in - height is fixed, vertical centering via flex
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

    // Text size: XS=10px, S=12px, M=14px, L=16px, XL=18px, 2XL=20px
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

    switch (answerType) {
      case 'button': {
        const buttonColor = (data.buttonColor as string) || 'purple';
        const buttonStyle = (data.buttonStyle as string) || 'glassmorphism';
        const buttonHeight = (data.buttonHeight as string) || 'medium';
        const buttonWidth = (data.buttonWidth as string) || 'auto';
        const buttonTextSize = (data.buttonTextSize as string) || 'small';

        const widthClass = getWidthClasses(buttonWidth);
        const heightClass = getHeightClasses(buttonHeight);
        const textSizeClass = getTextSizeClasses(buttonTextSize);

        return (
          <div
            className={`${containerClasses} transition-all duration-500 ease-out ${
              showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <UniversalButton
              text={(data.buttonText as string) || 'Weiter'}
              color={buttonColor as any}
              style={buttonStyle as any}
              size="small"
              onClick={() => handleAnswerClick('clicked', 'button')}
              className={`${widthClass} ${heightClass} ${textSizeClass}`}
            />
          </div>
        );
      }

      case 'multipleChoice': {
        const answers = (data.answers as string[]) || [];
        const mcPosition = (data.mcPosition as string) || 'bottom-center';
        const mcButtonHeight = (data.mcButtonHeight as string) || 'medium';
        const mcTextSize = (data.mcTextSize as string) || 'small';
        const mcLayout = (data.mcLayout as string) || 'vertical';
        const mcButtonWidth = (data.mcButtonWidth as string) || 'auto';

        // Layout classes
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

        return (
          <div
            className={`absolute ${getPositionClasses(mcPosition)} z-50 pointer-events-auto transition-all duration-500 ease-out ${
              showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className={getLayoutClasses(mcLayout)}>
              {answers.map((answer: string, index: number) => {
                const color = (data[`mcColor_${index}`] as string) || 'purple';
                const style = (data[`mcStyle_${index}`] as string) || 'glassmorphism';
                const widthClass = getWidthClasses(mcButtonWidth);
                const heightClass = getHeightClasses(mcButtonHeight);
                const textSizeClass = getTextSizeClasses(mcTextSize);

                return (
                  <UniversalButton
                    key={index}
                    text={`${String.fromCharCode(65 + index)}. ${answer}`}
                    color={color as any}
                    style={style as any}
                    size="small"
                    onClick={() => handleAnswerClick(index, 'multipleChoice')}
                    className={`${widthClass} ${heightClass} ${textSizeClass} ${
                      mcLayout === 'horizontal' && mcButtonWidth === 'auto' ? 'flex-1' : ''
                    }`}
                  />
                );
              })}
            </div>
          </div>
        );
      }

      case 'text':
      case 'email': {
        const submitButtonColor = (data.submitButtonColor as string) || 'purple';
        const submitButtonStyle = (data.submitButtonStyle as string) || 'glassmorphism';
        const submitButtonText = (data.submitButtonText as string) || 'Senden';

        const submitButtonHeight = (data.submitButtonHeight as string) || 'medium';
        const submitButtonWidth = (data.submitButtonWidth as string) || 'full';
        const submitButtonTextSize = (data.submitButtonTextSize as string) || 'small';

        // Input field sizing
        const inputHeight = (data.inputHeight as string) || 'medium';
        const inputWidth = (data.inputWidth as string) || 'full';
        const inputTextSize = (data.inputTextSize as string) || 'small';

        const submitWidthClass = getWidthClasses(submitButtonWidth);
        const submitHeightClass = getHeightClasses(submitButtonHeight);
        const submitTextSizeClass = getTextSizeClasses(submitButtonTextSize);

        // Input size classes
        const getInputHeightClass = (height: string) => {
          switch (height) {
            case 'xs': return 'h-[24px]';
            case 'small': return 'h-[28px]';
            case 'medium': return 'h-[36px]';
            case 'large': return 'h-[44px]';
            case 'xl': return 'h-[52px]';
            case '2xl': return 'h-[60px]';
            case '3xl': return 'h-[72px]';
            case '4xl': return 'h-[84px]';
            default: return 'h-[36px]';
          }
        };

        const getInputWidthClass = (width: string) => {
          switch (width) {
            case 'small': return 'w-[200px]';
            case 'medium': return 'w-[280px]';
            case 'large': return 'w-[320px]';
            case 'xl': return 'w-[400px]';
            case 'full': return 'w-full max-w-[520px]';
            default: return 'w-full max-w-[400px]';
          }
        };

        const inputHeightClass = getInputHeightClass(inputHeight);
        const inputWidthClass = getInputWidthClass(inputWidth);
        const inputTextSizeClass = getTextSizeClasses(inputTextSize);

        // Container width should match the larger of input or button
        const formWidthClass = 'w-full max-w-[520px]';

        return (
          <div
            className={`${containerClasses} transition-all duration-500 ease-out ${
              showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className={`space-y-2 ${formWidthClass}`}> 
              <input
                type={data.answerType === 'email' ? 'email' : 'text'}
                placeholder={(data.placeholder as string) || 'Hier eingeben...'}
                value={textInput as string}
                onChange={(e) => typeof setTextInput === 'function' && setTextInput(e.target.value)}
                className={`${inputWidthClass} ${inputHeightClass} ${inputTextSizeClass} px-3 glass-effect rounded-lg text-white font-figtree placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 smooth-transition`}
              />
              <UniversalButton
                text={submitButtonText}
                color={submitButtonColor as any}
                style={submitButtonStyle as any}
                size="small"
                onClick={() => handleAnswerClick(textInput, data.answerType as string)}
                disabled={!String(textInput).trim()}
                className={`${submitWidthClass} ${submitHeightClass} ${submitTextSizeClass}`}
              />
            </div>
          </div>
        );
      }

      case 'rating': {
        const maxRating = parseInt((data.maxRating as string) || '5');
        const ratingSubmitColor = (data.ratingSubmitColor as string) || 'purple';
        const ratingSubmitStyle = (data.ratingSubmitStyle as string) || 'glassmorphism';
        const ratingSubmitText = (data.ratingSubmitText as string) || 'Bewertung abgeben';

        return (
          <div
            className={`${containerClasses} transition-all duration-500 ease-out ${
              showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="space-y-4">
              <div className="flex justify-center space-x-2">
                {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
                  <button
                    key={star}
                    onClick={() => typeof setSelectedRating === 'function' && setSelectedRating(star)}
                    className="p-1 hover:scale-125 transition-all duration-300 hover:rotate-12"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= Number(selectedRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-white/40'
                      } hover:text-yellow-400 transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <UniversalButton
                text={ratingSubmitText}
                color={ratingSubmitColor as any}
                style={ratingSubmitStyle as any}
                size="medium"
                onClick={() => handleAnswerClick(selectedRating, 'rating')}
                disabled={selectedRating === 0}
              />
            </div>
          </div>
        );
      }

      case 'budgetSlider': {
        const sliderMin = Number(data.sliderMin) || 0;
        const sliderMax = Number(data.sliderMax) || 10000;
        const sliderStep = Number(data.sliderStep) || 100;
        const sliderSubmitText = (data.sliderSubmitText as string) || 'Weiter';
        const sliderSubmitColor = (data.sliderSubmitColor as string) || 'purple';
        const sliderSubmitStyle = (data.sliderSubmitStyle as string) || 'glassmorphism';
        
        // Use local state for slider value
        const sliderValue = isPreview ? (data.sliderValue as number) ?? 2500 : 2500;
        const setSliderValue = isPreview ? data.setSliderValue : () => {};

        // Budget zone calculations
        const getBudgetZone = (value: number) => {
          if (value <= 500) return { label: 'Wenig', emoji: '⚠️', color: '#FF4444', bg: 'from-red-500/30 to-red-600/20' };
          if (value <= 1500) return { label: 'Starter', emoji: '🌱', color: '#FFAA00', bg: 'from-orange-500/30 to-orange-600/20' };
          if (value <= 4000) return { label: 'Solide', emoji: '✅', color: '#44DD44', bg: 'from-green-500/30 to-green-600/20' };
          if (value <= 7000) return { label: 'Platin', emoji: '💎', color: '#00D4FF', bg: 'from-cyan-500/30 to-cyan-600/20' };
          return { label: 'Gold', emoji: '👑', color: '#FFD700', bg: 'from-yellow-500/30 to-yellow-600/20' };
        };

        const zone = getBudgetZone(sliderValue);
        const percentage = ((sliderValue - sliderMin) / (sliderMax - sliderMin)) * 100;

        return (
          <div
            className={`${containerClasses} transition-all duration-500 ease-out ${
              showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className={`w-full max-w-[320px] p-4 rounded-xl bg-gradient-to-br ${zone.bg} backdrop-blur-md border border-white/20`}>
              <div className="text-center mb-4">
                <p className="text-white/70 text-xs mb-1">Dein Budget für Trading</p>
                <div className="text-3xl font-bold text-white" style={{ color: zone.color }}>
                  €{sliderValue.toLocaleString('de-DE')}
                </div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-lg">{zone.emoji}</span>
                  <span className="text-sm font-semibold" style={{ color: zone.color }}>{zone.label}</span>
                </div>
              </div>
              
              {/* Slider Track */}
              <div className="relative mb-4">
                <div className="h-3 rounded-full bg-gradient-to-r from-red-500 via-orange-500 via-green-500 via-cyan-500 to-yellow-500 opacity-40" />
                <div 
                  className="absolute top-0 h-3 rounded-full transition-all duration-200"
                  style={{ 
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, #FF4444, #FFAA00, #44DD44, #00D4FF, #FFD700)`,
                    backgroundSize: '500% 100%',
                    backgroundPosition: '0% 0%'
                  }}
                />
                <input
                  type="range"
                  min={sliderMin}
                  max={sliderMax}
                  step={sliderStep}
                  value={sliderValue}
                  onChange={(e) => typeof setSliderValue === 'function' && setSliderValue(Number(e.target.value))}
                  className="absolute top-0 w-full h-3 opacity-0 cursor-pointer"
                  style={{ touchAction: 'manipulation' }}
                />
                {/* Slider Thumb */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-100 pointer-events-none"
                  style={{ 
                    left: `calc(${percentage}% - 12px)`,
                    backgroundColor: zone.color,
                    boxShadow: `0 0 12px ${zone.color}80`
                  }}
                />
              </div>
              
              {/* Scale Labels */}
              <div className="flex justify-between text-xs text-white/50 mb-4">
                <span>€0</span>
                <span>€2.5k</span>
                <span>€5k</span>
                <span>€7.5k</span>
                <span>€10k</span>
              </div>

              <UniversalButton
                text={sliderSubmitText}
                color={sliderSubmitColor as any}
                style={sliderSubmitStyle as any}
                size="small"
                onClick={() => handleAnswerClick(sliderValue, 'budgetSlider')}
                className="w-full h-[44px] text-[14px]"
              />
            </div>
          </div>
        );
      }

      default: {
        // Fallback zu button für alle anderen Fälle
        const fallbackColor = (data.buttonColor as string) || 'purple';
        const fallbackStyle = (data.buttonStyle as string) || 'glassmorphism';
        const fallbackSize = (data.buttonSize as string) || 'medium';

        return (
          <div
            className={`${containerClasses} transition-all duration-500 ease-out ${
              showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <UniversalButton
              text={(data.buttonText as string) || 'Weiter'}
              color={fallbackColor as any}
              style={fallbackStyle as any}
              size={fallbackSize as any}
              onClick={() => handleAnswerClick('clicked', 'button')}
            />
          </div>
        );
      }
    }
  };

  // Detect if we're in a desktop preview container
  const isDesktopPreview = isPreview && window.innerWidth >= 768;
  
  return (
    <div className={`${
      isPreview 
        ? isDesktopPreview 
          ? 'w-full h-full bg-black relative' 
          : 'fixed inset-0 bg-black'
        : 'group bg-zinc-900 border-2 rounded-xl overflow-hidden transition-all duration-300'
    } ${
      !isPreview && selected 
        ? 'border-purple-500 shadow-xl shadow-purple-500/30' 
        : !isPreview ? 'border-zinc-700 hover:border-zinc-600 hover:shadow-lg' : ''
    }`} style={!isPreview ? { width: '240px', height: '426px' } : undefined}>
      {/* Handles - only show in builder mode */}
      {!isPreview && (
        <>
          <Handle
            type="target"
            position={Position.Left}
            className="w-3 h-3 bg-purple-500 border-2 border-zinc-900 transition-colors hover:bg-purple-400"
          />
        </>
      )}
      
      {/* Video Preview */}
      <div className={`relative w-full h-full bg-black ${isPreview && !isDesktopPreview ? 'aspect-video md:aspect-auto' : ''}`} style={{ touchAction: 'manipulation' }}>        
        {/* Progress Bar */}
        {renderProgressBar()}
        
        {hasVideo ? (
          <>
            <video 
              ref={videoRef}
              src={data.videoUrl as string}
              className={`w-full h-full object-cover pointer-events-none ${isPreview ? 'opacity-100' : ''}`}
              style={{ 
                touchAction: 'manipulation', 
                willChange: 'transform, opacity',
                transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
              }}
              muted={!isPreview}
              loop
              autoPlay={!isPreview}
              playsInline
              webkit-playsinline="true"
              disablePictureInPicture
              disableRemotePlayback
              controls={false}
              preload="auto"
              
              onLoadedMetadata={(e) => {
                e.currentTarget.muted = !isPreview;
                e.currentTarget.volume = isPreview ? 1 : 0;
              }}
               onCanPlay={(e) => {
                 e.currentTarget.muted = !isPreview;
                 e.currentTarget.volume = isPreview ? 1 : 0;
                 if (isPreview) {
                   e.currentTarget.style.opacity = '1';
                   e.currentTarget.play().catch(() => {
                     if (timedVisibility) setShowButtons(true);
                   });
                 }
               }}
              onError={(e) => {
                // Bei Video-Fehler trotzdem sichtbar machen
                e.currentTarget.style.opacity = '1';
                console.error('Video load error:', e);
              }}
               onLoadedData={(e) => {
                 const video = e.currentTarget;
                 if (!isPreview) {
                   video.currentTime = 2;
                 } else {
                   video.style.opacity = '1';
                   video.play().catch(() => {
                     if (timedVisibility) setShowButtons(true);
                   });
                 }
               }}
            />
            
            {/* Play Button Overlay - only in builder mode */}
            {!isPreview && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-6 h-6 text-white ml-1" />
                </div>
              </div>
            )}

            {/* Text Overlay with Gradient Background */}
            {data.overlayText && data.textPosition && data.textPosition !== 'none' && (
              <div className={`absolute ${getPositionClasses(data.textPosition as string)} max-w-xs pointer-events-none z-30 slide-up`}>
                {/* Gradient Background for better readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-xl -m-2"></div>
                <div className={`relative px-6 py-3 rounded-xl smooth-transition ${
                  data.textStyle === 'solid' ? 'bg-black/80' :
                  data.textStyle === 'outline' ? 'border-2 border-white/50 bg-transparent' :
                  'glass-effect'
                }`}>
                  <p className={`text-white font-figtree font-medium text-gradient text-shadow-glow ${
                    data.textSize === 'small' ? 'text-sm' :
                    data.textSize === 'large' ? 'text-lg' :
                    'text-base'
                  }`}>{data.overlayText as string}</p>
                </div>
              </div>
            )}

            {/* Call to action text with Gradient Background */}
            {data.callToActionText && data.callToActionPosition && data.callToActionPosition !== 'none' && (
              <div className={`absolute ${getPositionClasses(data.callToActionPosition as string)} max-w-md pointer-events-none z-30 slide-up`} style={{ animationDelay: '0.3s' }}>
                {/* Gradient Background for better readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-xl -m-2"></div>
                <div className="relative glass-effect px-8 py-4 rounded-xl">
                  <p className={`text-white font-figtree font-semibold text-center text-gradient text-shadow-glow ${
                    data.callToActionSize === 'small' ? 'text-sm' :
                    data.callToActionSize === 'medium' ? 'text-lg' :
                    data.callToActionSize === 'large' ? 'text-xl' :
                    'text-lg'
                  }`}>{data.callToActionText as string}</p>
                </div>
              </div>
            )}

            {/* Countdown Timer for Timed Visibility */}
            {renderCountdownTimer()}

            {/* Answer Buttons/Inputs Overlay */}
            {renderAnswerButtons()}

            {/* Timed Visibility Indicator im Builder */}
            {!isPreview && timedVisibility && (
              <div className="absolute top-4 right-4 bg-orange-500/20 backdrop-blur-sm px-3 py-1 rounded-lg z-40 border border-orange-500/50">
                <p className="text-orange-300 text-xs font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {visibilityStartTime}s - {visibilityEndTime}s
                </p>
              </div>
            )}

            {/* Delay Indicator für debugging - nur im Builder (non-timed mode) */}
            {!isPreview && !timedVisibility && Number(data.delaySeconds) > 0 && (
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg z-40">
                <p className="text-white text-sm font-medium">
                  Delay: {String(data.delaySeconds)}s
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-zinc-800 flex flex-col items-center justify-center">
            <div className="text-center text-zinc-400">
              <Play className="w-8 h-8 mx-auto mb-3" />
              <p className="text-sm font-medium">Kein Video</p>
              <p className="text-xs opacity-75">Klicken zum Bearbeiten</p>
            </div>
          </div>
        )}
      </div>

      {/* Node Info Panel - only in builder mode - takes up to half the height */}
      {!isPreview && (
        <>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-zinc-900 via-zinc-900/98 to-zinc-900/80 p-3 flex flex-col justify-end">
            {/* Top section - Description/Context */}
            <div className="flex-1 overflow-hidden mb-2">
              {data.description ? (
                <p className="text-zinc-400 text-[10px] leading-tight line-clamp-3">
                  {String(data.description)}
                </p>
              ) : data.overlayText ? (
                <p className="text-zinc-400 text-[10px] leading-tight line-clamp-3 italic">
                  "{String(data.overlayText)}"
                </p>
              ) : (
                <p className="text-zinc-500 text-[10px] leading-tight italic">
                  Keine Beschreibung
                </p>
              )}
            </div>
            
            {/* Middle section - Answer Type & Options */}
            <div className="mb-2 space-y-1">
              {/* Answer Type Badge */}
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 bg-purple-600/30 text-purple-300 text-[9px] font-medium rounded uppercase tracking-wide">
                  {(data.answerType as string) || 'button'}
                </span>
                {data.delaySeconds && Number(data.delaySeconds) > 0 && (
                  <span className="px-1.5 py-0.5 bg-amber-600/30 text-amber-300 text-[9px] font-medium rounded">
                    {String(data.delaySeconds)}s Delay
                  </span>
                )}
              </div>
              
              {/* Answer Options Preview */}
              {data.answerType === 'multipleChoice' && (data.answers as string[])?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {((data.answers as string[]) || []).slice(0, 3).map((answer: string, i: number) => (
                    <span key={i} className="px-1 py-0.5 bg-zinc-700/50 text-zinc-400 text-[8px] rounded truncate max-w-[60px]">
                      {String.fromCharCode(65 + i)}. {answer}
                    </span>
                  ))}
                  {((data.answers as string[]) || []).length > 3 && (
                    <span className="text-zinc-500 text-[8px]">+{((data.answers as string[]) || []).length - 3}</span>
                  )}
                </div>
              )}
              
              {/* Button Text Preview */}
              {(data.answerType === 'button' || !data.answerType) && data.buttonText && (
                <div className="flex items-center gap-1">
                  <span className="text-[8px] text-zinc-500">CTA:</span>
                  <span className="text-[9px] text-zinc-300 truncate">"{String(data.buttonText)}"</span>
                </div>
              )}
            </div>
            
            {/* Bottom section - Node Name & Icon */}
            <div className="flex items-center gap-2 pt-1 border-t border-zinc-700/50">
              <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Play className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-white font-semibold text-xs truncate flex-1">{String(nodeName)}</span>
            </div>
          </div>

          <Handle
            type="source"
            position={Position.Right}
            className="w-3 h-3 bg-purple-500 border-2 border-zinc-900 transition-colors hover:bg-purple-400"
          />
        </>
      )}
    </div>
  );
});