import { motion } from 'framer-motion';
import { 
  Play, 
  MoreVertical, 
  Copy, 
  Trash2, 
  ExternalLink, 
  Code,
  Eye,
  Users,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface FunnelCardProps {
  name: string;
  createdAt: string;
  isPublic: boolean;
  views?: number;
  leads?: number;
  onCopyLink?: () => void;
  onCopyEmbed?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onTogglePublic?: () => void;
  delay?: number;
}

export function FunnelCard({
  name,
  createdAt,
  isPublic,
  views = 0,
  leads = 0,
  onCopyLink,
  onCopyEmbed,
  onDuplicate,
  onDelete,
  onTogglePublic,
  delay = 0
}: FunnelCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group relative rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
    >
      {/* Preview Area */}
      <div 
        className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 cursor-pointer overflow-hidden"
        onClick={() => navigate(`/app/builder/${encodeURIComponent(name)}`)}
      >
        {/* Placeholder Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.3),transparent_70%)]" />
          <div className="grid grid-cols-3 gap-4 p-8 opacity-30">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-foreground/10" />
            ))}
          </div>
        </div>

        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/60 backdrop-blur-sm">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg"
          >
            <Play className="w-6 h-6 text-primary-foreground ml-1" />
          </motion.div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge 
            variant={isPublic ? 'default' : 'secondary'}
            className={cn(
              "text-xs",
              isPublic ? "bg-green-500/90 hover:bg-green-500" : ""
            )}
          >
            {isPublic ? 'Öffentlich' : 'Entwurf'}
          </Badge>
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary" className="w-8 h-8 bg-background/80 backdrop-blur-sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate(`/app/builder/${encodeURIComponent(name)}`)}>
                <Play className="w-4 h-4 mr-2" />
                Bearbeiten
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCopyLink}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Link kopieren
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCopyEmbed}>
                <Code className="w-4 h-4 mr-2" />
                Embed-Code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="w-4 h-4 mr-2" />
                Duplizieren
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onTogglePublic}>
                <Eye className="w-4 h-4 mr-2" />
                {isPublic ? 'Privat machen' : 'Veröffentlichen'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Löschen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Info Area */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground truncate mb-2">{name}</h3>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{leads}</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
