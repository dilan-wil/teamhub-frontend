import React from 'react';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <Sidebar />
      
      <main className="flex-1 min-w-0 flex flex-col ml-[288px] min-h-screen">
        <Navbar />
        <div className="flex-1 min-w-0 p-8 overflow-x-hidden overflow-y-auto">
          <div className="w-full h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}