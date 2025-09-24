import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoPreviewProps {
  videoUrl: string;
  overlayText?: string;
  className?: string;
}

export function VideoPreview({ videoUrl, overlayText, className = "" }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  if (!videoUrl) {
    return (
      <div className={`bg-zinc-800 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-zinc-400">
          <Play className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Kein Video ausgewählt</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      <video
        src={videoUrl}
        className="w-full h-full object-cover"
        muted={isMuted}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {overlayText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-center">
            <p className="text-sm font-medium">{overlayText}</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-2 left-2 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const video = e.currentTarget.parentElement?.parentElement?.querySelector('video');
            if (video) {
              if (video.paused) {
                video.play();
              } else {
                video.pause();
              }
            }
          }}
          className="bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}