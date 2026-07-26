"use client"
import React, { useState, useEffect } from "react";
import { PageTransition } from "@/components/page-transition";
import { Task } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { AvatarGroup, PriorityBadge } from "@/components/ui-components";
import { format } from "date-fns";
import { Calendar, MoreHorizontal, Plus } from "lucide-react";
import { mockTasks } from "@/lib/data";

const COLUMNS: { id: Task["status"]; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

function KanbanCard({
  task,
  isDragging,
}: {
  task: Task;
  isDragging?: boolean;
}) {
  const priorityColors = {
    low: "border-l-gray-400",
    medium: "border-l-blue-400",
    high: "border-l-amber-400",
    urgent: "border-l-red-500",
  };

  return (
    <div
      className={cn(
        "bg-card border border-border/50 rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow",
        isDragging ? "opacity-50" : "",
        "border-l-4",
        priorityColors[task.priority],
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <PriorityBadge priority={task.priority} />
        <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <h4 className="font-medium text-sm leading-snug mb-3 line-clamp-2">
        {task.title}
      </h4>

      <div className="flex flex-wrap gap-1 mb-4">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-medium text-muted-foreground capitalize"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center mt-auto">
        <AvatarGroup users={[task.assignee]} max={1} />
        <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
          <Calendar className="w-3.5 h-3.5" />
          {format(new Date(task.dueDate), "MMM d")}
        </div>
      </div>
    </div>
  );
}

function SortableTaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "Task", task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing outline-none"
    >
      <KanbanCard task={task} isDragging={isDragging} />
    </div>
  );
}

function DroppableColumn({
  column,
  tasks,
}: {
  column: { id: Task["status"]; title: string };
  tasks: Task[];
}) {
  return (
    <div className="flex flex-col bg-muted/30 rounded-3xl p-3 pb-6 h-full border border-border/20">
      <div className="flex justify-between items-center mb-4 px-3 pt-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm">{column.title}</h3>
          <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
        <button className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 px-1 scrollbar-hide">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="h-24 rounded-2xl border-2 border-dashed border-border/50 flex items-center justify-center text-sm text-muted-foreground font-medium">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

export default function Kanban() {
  const initialTasks = mockTasks
  const [isLoading, setIsLoading] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    if (initialTasks) {
      setTasks(initialTasks);
    }
  }, [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find what column we dropped over
    let newStatus: Task["status"] | null = null;

    // Check if dropped directly on a column
    if (COLUMNS.some((c) => c.id === overId)) {
      newStatus = overId as Task["status"];
    } else {
      // Find the task we dropped over to get its column
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) newStatus = overTask.status;
    }

    if (newStatus && activeTask && activeTask.status !== newStatus) {
      // Optimistic update locally
      setTasks((prev) =>
        prev.map((t) =>
          t.id === activeId ? { ...t, status: newStatus as Task["status"] } : t,
        ),
      );

      // Update server
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col gap-6">
        <div className="h-10 w-48 bg-muted animate-pulse rounded-md" />
        <div className="flex-1 grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-muted/30 rounded-3xl border border-border/20 p-3 h-full animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.4" } },
    }),
  };

  return (
    <PageTransition className="h-full flex flex-col pb-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Board</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Drag and drop to move tasks.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex -space-x-2 mr-4">
            {/* Mock avatars for team filter */}
            <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium z-30 text-primary">
              All
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-background flex items-center justify-center text-xs font-medium z-20">
              AR
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-background flex items-center justify-center text-xs font-medium z-10">
              SC
            </div>
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:scale-95 transition-transform">
            New Task
          </button>
        </div>
      </header>
 
      <div className="relative flex-1 min-w-0 overflow-x-auto overflow-y-hidden pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex w-max gap-6">
            {COLUMNS.map((column) => (
              <div key={column.id} className="w-[320px] flex-shrink-0 h-full">
                {/* We use DndContext to wrap SortableContext. In a full app, each column needs its own droppable area. */}
                {/* Simple hack: let's make the column itself a droppable target if empty */}
                <SortableContext
                  items={[
                    column.id,
                    ...tasks
                      .filter((t) => t.status === column.id)
                      .map((t) => t.id),
                  ]}
                >
                  <div
                    className="h-full"
                    ref={(node) => {
                      // Normally you'd use useDroppable here for the column container
                    }}
                  >
                    <DroppableColumn
                      column={column}
                      tasks={tasks.filter((t) => t.status === column.id)}
                    />
                  </div>
                </SortableContext>
              </div>
            ))}
          </div>

          <DragOverlay dropAnimation={dropAnimation}>
            {activeTask ? (
              <div className="rotate-2 scale-105 shadow-xl">
                <KanbanCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </PageTransition>
  );
}
