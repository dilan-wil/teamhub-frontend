import React from 'react';
import { cn } from '@/lib/utils';
import { User } from '@/lib/types';

export function AvatarGroup({ users, max = 4, className }: { users: User[], max?: number, className?: string }) {
  const visible = users.slice(0, max);
  const overflow = users.length - max;

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {visible.map((user, i) => (
        <div 
          key={user.id} 
          className="w-8 h-8 rounded-full border-2 border-card bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-xs font-semibold shadow-sm z-10"
          style={{ zIndex: 10 - i }}
          title={user.name}
        >
          {user.avatar}
        </div>
      ))}
      {overflow > 0 && (
        <div className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-medium z-0 text-muted-foreground shadow-sm">
          +{overflow}
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ status, className }: { status: string, className?: string }) {
  const variants: Record<string, string> = {
    'active': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    'completed': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    'on-hold': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    'planning': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    'todo': 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
    'in-progress': 'bg-primary/10 text-primary border-primary/20',
    'review': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    'done': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  };

  const labels: Record<string, string> = {
    'in-progress': 'In Progress',
    'on-hold': 'On Hold'
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize whitespace-nowrap",
      variants[status] || variants['todo'],
      className
    )}>
      {labels[status] || status}
    </span>
  );
}

export function PriorityBadge({ priority, className }: { priority: string, className?: string }) {
  const variants: Record<string, { bg: string, dot: string }> = {
    'low': { bg: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20', dot: 'bg-gray-500' },
    'medium': { bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', dot: 'bg-blue-500' },
    'high': { bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', dot: 'bg-amber-500' },
    'urgent': { bg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20', dot: 'bg-red-500 animate-pulse' },
  };

  const v = variants[priority] || variants['low'];

  return (
    <span className={cn(
      "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize",
      v.bg,
      className
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", v.dot)} />
      {priority}
    </span>
  );
}