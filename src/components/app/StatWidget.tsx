import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatWidgetProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  className?: string;
  delay?: number;
}

export function StatWidget({ 
  title, 
  value, 
  change, 
  changeLabel = 'vs. letzte Woche',
  icon: Icon,
  className,
  delay = 0
}: StatWidgetProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "relative p-6 rounded-2xl bg-card border border-border overflow-hidden group hover:border-primary/30 transition-all duration-300",
        className
      )}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
            )}>
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>

        <div className="space-y-1">
          <motion.p 
            className="text-3xl font-bold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            {value}
          </motion.p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>

        {change !== undefined && (
          <p className="text-xs text-muted-foreground/60 mt-3">{changeLabel}</p>
        )}
      </div>
    </motion.div>
  );
}
