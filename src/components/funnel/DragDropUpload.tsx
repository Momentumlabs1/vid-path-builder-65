import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DragDropUploadProps {
  onVideoUploaded: (videoUrl: string, videoTitle: string) => void;
  className?: string;
}

export function DragDropUpload({ onVideoUploaded, className = "" }: DragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (videoFile) {
      handleFileUpload(videoFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      // Simuliere Upload Progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('Videos')
        .insert({
          title: file.name,
          file_url: publicUrl,
          description: 'Uploaded from funnel builder',
          is_public: true // Mark funnel videos as public for viewing
        });

      if (dbError) throw dbError;

      setUploadedFile(file.name);
      onVideoUploaded(publicUrl, file.name);

      toast({
        title: "Video hochgeladen",
        description: `"${file.name}" wurde erfolgreich hochgeladen.`,
      });

      // Reset nach 2 Sekunden
      setTimeout(() => {
        setUploadedFile(null);
        setUploadProgress(0);
      }, 2000);

    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Upload-Fehler",
        description: "Das Video konnte nicht hochgeladen werden.",
        variant: "destructive",
      });
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  if (uploadedFile) {
    return (
      <div className={`border-2 border-green-500 border-dashed rounded-lg p-8 text-center bg-green-500/10 ${className}`}>
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <p className="text-green-400 font-medium">Video erfolgreich hochgeladen!</p>
        <p className="text-sm text-zinc-400 mt-1">{uploadedFile}</p>
      </div>
    );
  }

  if (isUploading) {
    return (
      <div className={`border-2 border-blue-500 border-dashed rounded-lg p-8 text-center bg-blue-500/10 ${className}`}>
        <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
        <p className="text-blue-400 font-medium">Upload läuft...</p>
        <div className="w-full bg-zinc-700 rounded-full h-2 mt-4">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
        <p className="text-sm text-zinc-400 mt-2">{uploadProgress}%</p>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
        isDragging 
          ? 'border-purple-500 bg-purple-500/10' 
          : 'border-zinc-600 hover:border-zinc-500 hover:bg-zinc-800/50'
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-purple-500' : 'text-zinc-400'}`} />
      <p className={`font-medium ${isDragging ? 'text-purple-400' : 'text-white'}`}>
        {isDragging ? 'Video hier ablegen...' : 'Video hochladen'}
      </p>
      <p className="text-sm text-zinc-400 mt-1">
        Drag & Drop oder klicken zum Auswählen
      </p>
      <p className="text-xs text-zinc-500 mt-2">
        Unterstützte Formate: MP4, MOV, AVI, WebM
      </p>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}