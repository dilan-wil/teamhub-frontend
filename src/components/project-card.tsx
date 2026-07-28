import React from 'react';
import { Project } from '@/lib/types';
import { Calendar, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { MyAvatarGroup, StatusBadge } from './ui-components';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import Link from 'next/link';

export function ProjectCard({ project }: { project: Project }) {
  const totalTasks = project._count.tasks
  const undoneTasks = project._count.notCompletedTasks
  const completedTasks = project._count.completedTasks
  const progress = totalTasks > 0 ? undoneTasks/completedTasks*100 : 0
  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <motion.div 
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="group relative bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer flex flex-col h-full"
      >
        <div className={cn("h-24 w-full bg-gradient-to-br opacity-80 group-hover:opacity-100 transition-opacity", project.gradient)} />
        
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg leading-tight tracking-tight line-clamp-1">{project.name}</h3>
            <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity p-1">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {project.description}
          </p>
          
          <div className="mt-auto space-y-4">
            <div className="flex justify-between items-center text-xs font-medium">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{undoneTasks || 0} tasks</span>
              </div>
              <span className="text-foreground">{progress}%</span>
            </div>
            
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full",
                  progress === 100 ? "bg-emerald-500" : "bg-primary"
                )} 
              />
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <MyAvatarGroup users={project.members?.map(member => member.user!).filter(Boolean) || []} max={3} />
              
              <div className="flex items-center gap-2">
                <StatusBadge status={project.status} />
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(project.dueDate), 'MMM d')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}