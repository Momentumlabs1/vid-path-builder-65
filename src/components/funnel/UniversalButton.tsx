import { memo } from 'react';

interface UniversalButtonProps {
  text: string;
  color: 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'white' | 'yellow';
  style: 'glassmorphism' | 'solid' | 'outline' | 'gradient';
  size: 'small' | 'medium' | 'large';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const UniversalButton = memo(({ 
  text, 
  color, 
  style, 
  size, 
  onClick, 
  disabled = false,
  className = ''
}: UniversalButtonProps) => {
  
  // Size classes - optimized for mobile
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'px-3 py-1.5 text-xs';
      case 'large':
        return 'px-6 py-3 text-base';
      default: // medium
        return 'px-4 py-2 text-sm';
    }
  };
  
  // Get button classes based on color and style
  const getButtonClasses = (color: string, style: string) => {
    // IMPORTANT: Avoid scale() transforms here because they change the visual size
    // without changing the layout box (causes mismatch with readability containers in embeds).
    const baseClasses = 'font-figtree font-semibold transition-all duration-500 hover:shadow-xl border-2 min-w-0 flex items-center justify-center rounded-xl backdrop-blur-md transform-gpu hover:-translate-y-1 active:translate-y-0 button-float';
    
    // Color variations
    const colorClasses = {
      purple: 'bg-purple-600/30 border-purple-400/50 text-white hover:bg-purple-500/40 hover:border-purple-300 shadow-lg shadow-purple-500/25',
      blue: 'bg-blue-600/30 border-blue-400/50 text-white hover:bg-blue-500/40 hover:border-blue-300 shadow-lg shadow-blue-500/25',
      green: 'bg-green-600/30 border-green-400/50 text-white hover:bg-green-500/40 hover:border-green-300 shadow-lg shadow-green-500/25',
      orange: 'bg-orange-600/30 border-orange-400/50 text-white hover:bg-orange-500/40 hover:border-orange-300 shadow-lg shadow-orange-500/25',
      red: 'bg-red-600/30 border-red-400/50 text-white hover:bg-red-500/40 hover:border-red-300 shadow-lg shadow-red-500/25',
      white: 'bg-white/20 border-white/50 text-white hover:bg-white/30 hover:border-white/70 shadow-lg shadow-white/25',
      yellow: 'bg-yellow-500/30 border-yellow-400/50 text-white hover:bg-yellow-400/40 hover:border-yellow-300 shadow-lg shadow-yellow-500/25'
    };
    
    // Style modifications
    let finalClasses = `${baseClasses} ${colorClasses[color as keyof typeof colorClasses] || colorClasses.purple}`;
    
    switch (style) {
      case 'solid':
        finalClasses = finalClasses.replace('/30', '/80').replace('/20', '/60');
        break;
      case 'outline':
        finalClasses = finalClasses.replace('bg-', 'bg-transparent hover:bg-').replace('/30', '/20').replace('/20', '/10');
        break;
      case 'gradient':
        const gradientColors = {
          purple: 'bg-gradient-to-r from-purple-600/40 to-purple-500/60',
          blue: 'bg-gradient-to-r from-blue-600/40 to-blue-500/60',
          green: 'bg-gradient-to-r from-green-600/40 to-green-500/60',
          orange: 'bg-gradient-to-r from-orange-600/40 to-orange-500/60',
          red: 'bg-gradient-to-r from-red-600/40 to-red-500/60',
          white: 'bg-gradient-to-r from-white/40 to-white/60',
          yellow: 'bg-gradient-to-r from-yellow-500/40 to-yellow-400/60'
        };
        finalClasses = finalClasses.replace(/bg-\w+-\d+\/\d+/, gradientColors[color as keyof typeof gradientColors] || gradientColors.purple);
        break;
      default: // glassmorphism
        break;
    }
    
    return finalClasses;
  };

  return (
    <button
      className={`
        ${getSizeClasses(size)}
        ${getButtonClasses(color, style)}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
});

UniversalButton.displayName = 'UniversalButton';