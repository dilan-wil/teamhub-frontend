import React from 'react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-muted rounded-md", className)} />
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex flex-col gap-4", className)}>
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <Skeleton className="h-10 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm h-full flex flex-col">
      <Skeleton className="h-24 w-full rounded-none" />
      <div className="p-5 flex-1 flex flex-col gap-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="mt-auto space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-1.5 w-full rounded-full" />
          <div className="flex justify-between pt-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
      <div className="border-b border-border/50 p-4">
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-5 w-24" />
          ))}
        </div>
      </div>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="border-b border-border/50 p-4 flex gap-4 items-center">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <div className="flex items-center gap-2 w-1/4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-5 w-24" />
        </div>
      ))}
    </div>
  );
}