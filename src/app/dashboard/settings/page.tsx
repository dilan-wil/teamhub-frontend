"use client"
import React, { useState } from 'react';
import { PageTransition } from '@/components/page-transition';
import { useTheme } from '@/contexts/theme-provider';
import { cn } from '@/lib/utils';
import { Moon, Sun, Monitor, Bell, Lock, Users, CreditCard, Palette } from 'lucide-react';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');

  const tabs = [
    // { id: 'general', label: 'General', icon: Monitor },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    // { id: 'notifications', label: 'Notifications', icon: Bell },
    // { id: 'security', label: 'Security', icon: Lock },
    // { id: 'team', label: 'Team', icon: Users },
    // { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <PageTransition className="max-w-5xl mx-auto pb-10 flex flex-col md:flex-row gap-8 mt-4">
      <aside className="w-full md:w-64 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight mb-6 px-2">Settings</h1>
        <nav className="flex flex-col gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors text-left",
                activeTab === tab.id 
                  ? "bg-card text-primary shadow-sm border border-border/50" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 space-y-8">
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Theme</h2>
              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => setTheme('light')}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                    theme === 'light' ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50"
                  )}
                >
                  <div className="w-full h-24 bg-[#FAFAFC] rounded-xl border border-gray-200 shadow-sm flex flex-col p-2 gap-2">
                    <div className="w-full h-3 bg-white rounded-md border border-gray-100" />
                    <div className="w-1/2 h-2 bg-gray-200 rounded" />
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Sun className="w-4 h-4" /> Light
                  </div>
                </button>

                <button 
                  onClick={() => setTheme('dark')}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                    theme === 'dark' ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50"
                  )}
                >
                  <div className="w-full h-24 bg-[#0A0A0F] rounded-xl border border-gray-800 shadow-sm flex flex-col p-2 gap-2">
                    <div className="w-full h-3 bg-[#111118] rounded-md border border-gray-800" />
                    <div className="w-1/2 h-2 bg-gray-800 rounded" />
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Moon className="w-4 h-4" /> Dark
                  </div>
                </button>

                <button 
                  onClick={() => setTheme('system')}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                    theme === 'system' ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50"
                  )}
                >
                  <div className="w-full h-24 rounded-xl shadow-sm flex overflow-hidden border border-border">
                    <div className="w-1/2 bg-[#FAFAFC]" />
                    <div className="w-1/2 bg-[#0A0A0F]" />
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Monitor className="w-4 h-4" /> System
                  </div>
                </button>
              </div>
            </div>
            
            <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Accent Color</h2>
              <p className="text-sm text-muted-foreground mb-4">Choose your team's primary accent color.</p>
              <div className="flex gap-4">
                {['#6366F1', '#22C55E', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'].map(color => (
                  <button 
                    key={color}
                    className="w-10 h-10 rounded-full border-2 border-background shadow-sm hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Full Name</label>
                  <input type="text" defaultValue="Alex Rivera" className="w-full h-11 px-4 bg-background border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Email Address</label>
                  <input type="email" defaultValue="alex@teamhub.io" className="w-full h-11 px-4 bg-background border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="pt-2">
                  <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:scale-95 transition-transform">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab !== 'general' && activeTab !== 'appearance' && (
          <div className="bg-card border border-border/50 rounded-3xl p-12 shadow-sm text-center">
            <h2 className="text-xl font-bold mb-2 capitalize">{activeTab} Settings</h2>
            <p className="text-muted-foreground">This section is available in the fully implemented version.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}