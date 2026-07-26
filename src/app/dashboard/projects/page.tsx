"use client"
import React, { useState } from 'react';
import { PageTransition } from '@/components/page-transition';
import { ProjectCardSkeleton } from '@/components/loading';
import { ProjectCard } from '@/components/project-card';
import { Search, Filter, Plus } from 'lucide-react';
import { CreateProjectDialog } from '@/components/dialogs/project-dialog';
import { mockProjects } from '@/lib/data';

export default function Projects() {
  const projects = mockProjects;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const filtered = projects?.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  }) ?? [];

  return (
    <PageTransition className="space-y-6 pb-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your team's initiatives.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:scale-95 transition-transform shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </header>

      <div className="flex gap-3 items-center flex-wrap">
        <div className="relative max-w-sm flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-card border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-11 bg-card border border-border/50 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="planning">Planning</option>
          <option value="on-hold">On Hold</option>
          <option value="completed">Completed</option>
        </select>

        <button className="h-11 px-4 bg-card border border-border/50 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-muted transition-colors">
          <Filter className="w-4 h-4" /> Sort
        </button>
      </div>

      {!isLoading && filtered.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          <p className="mb-3 text-base">No projects found.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="text-sm text-primary font-medium hover:underline"
          >
            Create your first project
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading
          ? Array(6).fill(0).map((_, i) => <ProjectCardSkeleton key={i} />)
          : filtered.map(project => <ProjectCard key={project.id} project={project} />)
        }
      </div>

      <CreateProjectDialog open={showCreate} onOpenChange={setShowCreate} />
    </PageTransition>
  );
}