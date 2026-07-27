"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check } from "lucide-react";
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
import { Project, User } from "@/lib/types";
import { mockUsers } from "@/lib/data";
import { projectMembersApi, projectsApi, usersApi } from "@/lib/api";

const GRADIENTS = [
  { label: "Ocean", value: "from-blue-500 to-indigo-500" },
  { label: "Candy", value: "from-purple-500 to-pink-500" },
  { label: "Sunset", value: "from-orange-400 to-rose-400" },
  { label: "Midnight", value: "from-slate-600 to-slate-800" },
  { label: "Forest", value: "from-emerald-400 to-teal-500" },
  { label: "Sky", value: "from-cyan-400 to-blue-500" },
  { label: "Violet", value: "from-violet-500 to-purple-600" },
  { label: "Amber", value: "from-amber-400 to-orange-500" },
];

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["ACTIVE", "COMPLETED", "ON_HOLD", "PLANNING"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  dueDate: z.string().min(1, "Due date is required"),
  gradient: z.string(),
  memberIds: z.array(z.string()),
});

type FormValues = z.infer<typeof schema>;

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className="text-xs text-red-500 mt-1">{message}</p>
  ) : null;
}

function ProjectForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  defaultValues: FormValues;
  onSubmit: (v: FormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    async function getUsers() {
      const allUsers = await usersApi.findAll();
      setUsers(allUsers);
    }
    getUsers();
  }, []);

  const selectedGradient = watch("gradient");
  const selectedMemberIds = watch("memberIds");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label className="text-sm font-medium mb-1.5 block">
            Project Name
          </Label>
          <Input
            {...register("name")}
            placeholder="e.g. Website Redesign"
            className="rounded-xl"
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div className="col-span-2">
          <Label className="text-sm font-medium mb-1.5 block">
            Description
          </Label>
          <Textarea
            {...register("description")}
            placeholder="What is this project about?"
            rows={3}
            className="rounded-xl resize-none"
          />
          <FieldError message={errors.description?.message} />
        </div>

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
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
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
          <Label className="text-sm font-medium mb-1.5 block">
            Color Theme
          </Label>
          <div className="flex gap-2 flex-wrap">
            {GRADIENTS.map((g) => (
              <button
                key={g.value}
                type="button"
                title={g.label}
                onClick={() => setValue("gradient", g.value)}
                className={cn(
                  "w-8 h-8 rounded-lg bg-gradient-to-br transition-all",
                  g.value,
                  selectedGradient === g.value
                    ? "ring-2 ring-offset-2 ring-primary scale-110"
                    : "opacity-70 hover:opacity-100 hover:scale-105",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Team Members</Label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
          {users.map((user) => {
            const selected = selectedMemberIds.includes(user.id);
            return (
              <button
                key={user.id}
                type="button"
                onClick={() => {
                  setValue(
                    "memberIds",
                    selected
                      ? selectedMemberIds.filter((id) => id !== user.id)
                      : [...selectedMemberIds, user.id],
                  );
                }}
                className={cn(
                  "flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all text-sm",
                  selected
                    ? "border-primary/50 bg-primary/5 text-foreground"
                    : "border-border/50 hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                )}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  {selected ? <Check className="w-3.5 h-3.5" /> : user.avatar}
                </div>
                <span className="truncate font-medium">{user.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <DialogFooter className="gap-2 pt-2">
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
          Save Project
        </button>
      </DialogFooter>
    </form>
  );
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  change
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  change: any;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaults: z.infer<typeof schema> = {
    name: "",
    description: "",
    status: "PLANNING",
    priority: "MEDIUM",
    dueDate: "",
    gradient: GRADIENTS[0].value,
    memberIds: [],
  };

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    setIsSubmitting(true);
    try {
      const project = await projectsApi.create({
        name: values.name,
        description: values.description,
        status: values.status,
        priority: values.priority,
        startDate: new Date().toISOString(),
        dueDate: values.dueDate,
        gradient: values.gradient,
      });

      await Promise.all(
        values.memberIds.map((memberId) =>
          projectMembersApi.create(project.id, {
            userId: memberId,
            role: "MEMBER",
          }),
        ),
      );
      change(true)
      change(false)
      onOpenChange(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg rounded-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="mb-5">
            <DialogTitle className="text-xl font-bold">New Project</DialogTitle>
          </DialogHeader>
          <ProjectForm
            defaultValues={defaults}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export function EditProjectDialog({
  project,
  open,
  onOpenChange,
}: {
  project: Project;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const users = mockUsers;
  const defaults: z.infer<typeof schema> = {
    name: project.name,
    description: project.description,
    status: project.status,
    priority: project.priority,
    dueDate: project.dueDate
      ? new Date(project.dueDate).toISOString().split("T")[0]
      : "",
    gradient: project.gradient || GRADIENTS[0].value,
    memberIds: project.members!.map((m) => m.id),
  };

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    const members = (users ?? []).filter((u) =>
      values.memberIds.includes(u.id),
    );
    // await mutateAsync({
    //   id: project.id,
    //   data: {
    //     name: values.name,
    //     description: values.description,
    //     status: values.status,
    //     priority: values.priority,
    //     dueDate: new Date(values.dueDate).toISOString(),
    //     gradient: values.gradient,
    //     members,
    //   },
    // });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="mb-5">
            <DialogTitle className="text-xl font-bold">
              Edit Project
            </DialogTitle>
          </DialogHeader>
          <ProjectForm
            defaultValues={defaults}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={true}
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
