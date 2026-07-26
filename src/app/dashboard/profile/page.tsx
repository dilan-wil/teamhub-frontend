"use client"
import React, { useState } from 'react';
import { PageTransition } from '@/components/page-transition';
import { Mail, Calendar, Briefcase, MapPin } from 'lucide-react';
import { StatsCard } from '@/components/stats-card';
import { mockUsers } from '@/lib/data';

export default function Profile() {
  const user = mockUsers[0]
  const [isLoading, setIsLoading] = useState(false)
  if (isLoading) {
    return <div className="animate-pulse h-96 bg-muted rounded-3xl" />;
  }

  if (!user) return null;

  return (
    <PageTransition className="space-y-8 max-w-4xl mx-auto pb-10">
      <div className="relative">
        <div className="h-48 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-sm overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
        </div>
        
        <div className="px-8 flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 relative z-10">
          <div className="w-32 h-32 rounded-full border-4 border-background bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg shrink-0 group cursor-pointer relative overflow-hidden">
            {user.avatar}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-sm font-medium">Edit</span>
            </div>
          </div>
          
          <div className="flex-1 pb-2">
            <h1 className="text-3xl font-bold tracking-tight mb-1">{user.name}</h1>
            <div className="text-muted-foreground font-medium flex items-center gap-2">
              <span className="capitalize">{user.role}</span>
              <span>•</span>
              <span>{user.department}</span>
            </div>
          </div>
          
          <div className="pb-2">
            <button className="bg-card border border-border/50 shadow-sm text-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">About</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4 text-foreground/70" />
                <span className="text-foreground">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Briefcase className="w-4 h-4 text-foreground/70" />
                <span className="text-foreground">{user.department}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-foreground/70" />
                <span className="text-foreground">San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="w-4 h-4 text-foreground/70" />
                <span className="text-foreground">Joined {new Date(user.createdAt).getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <StatsCard title="Tasks Completed" value={10} icon={CheckSquareIcon} />
            <StatsCard title="Completion Rate" value={Math.round((10/20)*100)} suffix="%" icon={TrendingUpIcon} />
          </div>
          
          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Activity Heatmap</h3>
            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: 84 }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-4 h-4 rounded-sm bg-primary"
                  style={{ opacity: Math.max(0.1, Math.random()) }}
                  title={`Activity ${i}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

// Inline icons since imports are at top
function CheckSquareIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>; }
function TrendingUpIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>; }