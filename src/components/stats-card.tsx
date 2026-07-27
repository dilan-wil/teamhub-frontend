import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend?: number;
  trendLabel?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, trendLabel, prefix = '', suffix = '', className }: StatsCardProps) {
  const [count, setCount] = useState(0);
  const isNumber = typeof value === 'number';

  useEffect(() => {
    if (!isNumber) return;
    
    let start = 0;
    const end = value;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(end * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, isNumber]);

  return (
    <div className={cn("bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex flex-col justify-between overflow-hidden relative group", className)}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150" />
      
      <div className="flex justify-between items-start relative z-10 mb-4">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="p-2.5 bg-muted rounded-xl text-foreground">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="text-3xl font-bold tracking-tight text-foreground flex items-baseline gap-1">
          {prefix && <span className="text-xl text-muted-foreground">{prefix}</span>}
          {isNumber ? count : value}
          {suffix && <span className="text-xl text-muted-foreground">{suffix}</span>}
        </div>
        
        {/* {trend !== undefined && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className={cn(
              "flex items-center text-xs font-medium px-1.5 py-0.5 rounded-md",
              trend > 0 ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400" : 
              trend < 0 ? "text-red-600 bg-red-500/10 dark:text-red-400" : 
              "text-gray-600 bg-gray-500/10 dark:text-gray-400"
            )}>
              {trend > 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : 
               trend < 0 ? <ArrowDownRight className="w-3 h-3 mr-0.5" /> : 
               <ArrowRight className="w-3 h-3 mr-0.5" />}
              {Math.abs(trend)}%
            </span>
            {trendLabel && <span className="text-xs text-muted-foreground">{trendLabel}</span>}
          </div>
        )} */}
      </div>
    </div>
  );
}