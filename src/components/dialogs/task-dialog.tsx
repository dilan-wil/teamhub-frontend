"use client";
import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, ChevronDown, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Project, Task, User } from "@/lib/types";
import { projectsApi, tasksApi, usersApi } from "@/lib/api";

const ALL_TAGS = [
  "frontend",
  "backend",
  "design",
  "research",
  "qa",
  "docs",
  "infra",
  "mobile",
];

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  assigneeId: z.string().min(1, "Assignee is required"),
  projectId: z.string().min(1, "Project is required"),
  dueDate: z.string().min(1, "Due date is required"),
  estimatedHours: z.coerce.number().min(0).default(1),
  tags: z.array(z.string()),
});

type FormValues = z.infer<typeof schema>;

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className="text-xs text-red-500 mt-1">{message}</p>
  ) : null;
}

function UserSelect({
  value,
  onChange,
  placeholder = "Select assignee",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = users.find((u) => u.id === value);

  useEffect(() => {
    async function getUsers() {
      const allUsers = await usersApi.findAll();
      setUsers(allUsers);
    }
    getUsers();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center justify-between gap-2 h-10 px-3 rounded-xl border border-input bg-background text-sm transition-colors hover:bg-muted/50",
          !selected && "text-muted-foreground",
        )}
      >
        {selected ? (
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-500 text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0">
              {selected.avatar}
            </span>
            {selected.name}
          </span>
        ) : (
          placeholder
        )}
        <ChevronDown className="w-4 h-4 shrink-0 opacity-50" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-popover border border-border/50 rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-48 overflow-y-auto p-1">
            {users.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  onChange(u.id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                  value === u.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted",
                )}
              >
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-purple-500 text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                  {u.avatar}
                </span>
                <div>
                  <div className="font-medium leading-none">{u.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {u.department}
                  </div>
                </div>
                {value === u.id && <Check className="w-3.5 h-3.5 ml-auto" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  lockedProjectId,
}: {
  defaultValues: FormValues;
  onSubmit: (v: FormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  lockedProjectId?: string;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    // resolver: zodResolver(schema),
    defaultValues,
  });
  const selectedTags = watch("tags");

  useEffect(() => {
    async function getProjects() {
      const allProjects = await projectsApi.findAll();
      setProjects(allProjects);
    }
    getProjects();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label className="text-sm font-medium mb-1.5 block">Title</Label>
        <Input
          {...register("title")}
          placeholder="What needs to be done?"
          className="rounded-xl"
        />
        <FieldError message={errors.title?.message} />
      </div>

      <div>
        <Label className="text-sm font-medium mb-1.5 block">Description</Label>
        <Textarea
          {...register("description")}
          placeholder="Add more details..."
          rows={2}
          className="rounded-xl resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium mb-1.5 block">Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-1.5 block">Priority</Label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-1.5 block">Due Date</Label>
          <Input {...register("dueDate")} type="date" className="rounded-xl" />
          <FieldError message={errors.dueDate?.message} />
        </div>

        <div>
          <Label className="text-sm font-medium mb-1.5 block">Est. Hours</Label>
          <Input
            {...register("estimatedHours")}
            type="number"
            min={0}
            placeholder="4"
            className="rounded-xl"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-1.5 block">Assignee</Label>
        <Controller
          name="assigneeId"
          control={control}
          render={({ field }) => (
            <UserSelect value={field.value} onChange={field.onChange} />
          )}
        />
        <FieldError message={errors.assigneeId?.message} />
      </div>

      <div>
        <Label className="text-sm font-medium mb-1.5 block">Project</Label>
        <Controller
          name="projectId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={!!lockedProjectId}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.projectId?.message} />
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Tags</Label>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  setValue(
                    "tags",
                    active
                      ? selectedTags.filter((t) => t !== tag)
                      : [...selectedTags, tag],
                  )
                }
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                  active
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted",
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <DialogFooter className="pt-2 gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium rounded-xl border border-border/50 hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Save Task
        </button>
      </DialogFooter>
    </form>
  );
}

// ─── Create ──────────────────────────────────────────────────────────────────

export function CreateTaskDialog({
  open,
  onOpenChange,
  defaultProjectId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultProjectId?: string;
}) {
  const [isPending, setIsPending] = useState(false)
  const defaults: FormValues = {
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    assigneeId: "",
    projectId: defaultProjectId || "",
    dueDate: "",
    estimatedHours: 1,
    tags: [],
  };

  const handleSubmit = async (values: FormValues) => {
    try{
      setIsPending(true)
      await tasksApi.create(values)
    onOpenChange(false);
    } catch(error){
      console.log(error)
    } finally{
      setIsPending(false)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold">New Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            defaultValues={defaults}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isPending}
            lockedProjectId={defaultProjectId}
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export function EditTaskDialog({
  task,
  open,
  onOpenChange,
}: {
  task: Task;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const defaults: FormValues = {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assigneeId: task.assignee?.id ?? "",
    projectId: task.project?.id ?? "",
    dueDate: task.dueDate
      ? new Date(task.dueDate).toISOString().split("T")[0]
      : "",
    estimatedHours: task.estimatedHours,
    tags: task.tags,
  };

  const handleSubmit = async (values: FormValues) => {
    // await mutateAsync({
    //   id: task.id,
    //   data: {
    //     title: values.title,
    //     description: values.description ?? "",
    //     status: values.status,
    //     priority: values.priority,
    //     assignee,
    //     project,
    //     dueDate: new Date(values.dueDate).toISOString(),
    //     estimatedHours: values.estimatedHours,
    //     tags: values.tags,
    //   },
    // });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold">Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            defaultValues={defaults}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={false}
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
