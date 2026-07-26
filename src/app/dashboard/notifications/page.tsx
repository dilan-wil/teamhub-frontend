"use client"
import React, { useState } from 'react';
import { PageTransition } from '@/components/page-transition';
import { Skeleton } from '@/components/loading';
import { Check, MessageSquare, AlertCircle, Calendar, FolderKanban, AtSign } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { mockNotifications } from '@/lib/data';

export default function Notifications() {
  const notifications = mockNotifications;
  const [isLoading, setIsLoading] = useState(false)
  const getIcon = (type: string) => {
    switch(type) {
      case 'mention': return <AtSign className="w-5 h-5 text-purple-500" />;
      case 'task': return <Check className="w-5 h-5 text-emerald-500" />;
      case 'project': return <FolderKanban className="w-5 h-5 text-blue-500" />;
      case 'comment': return <MessageSquare className="w-5 h-5 text-amber-500" />;
      case 'deadline': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <PageTransition className="space-y-6 max-w-3xl mx-auto pb-10">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated on your team's activity.</p>
        </div>
        <button className="text-sm font-medium text-primary hover:underline">
          Mark all as read
        </button>
      </header>

      <div className="bg-card border border-border/50 rounded-3xl shadow-sm overflow-hidden divide-y divide-border/50">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="p-4 flex gap-4">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))
        ) : (
          notifications?.map(notif => (
            <div 
              key={notif.id} 
              className={cn(
                "p-5 flex gap-4 transition-colors relative group",
                !notif.read ? "bg-primary/5" : "hover:bg-muted/30"
              )}
            >
              {!notif.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              )}
              
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-sm font-semibold shadow-sm">
                  {notif.user.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 bg-card rounded-full shadow-sm">
                  {getIcon(notif.type)}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-sm">{notif.title}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(notif.createdAt), 'MMM d, h:mm a')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{notif.message}</p>
                
                {!notif.read && (
                  <div className="mt-3">
                    <button className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-xs font-medium hover:scale-95 transition-transform">
                      View
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </PageTransition>
  );
}