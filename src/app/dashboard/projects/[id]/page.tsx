"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageTransition } from "@/components/page-transition";
import { usePathname } from "next/navigation";
import { useParams, useRouter } from "next/navigation";
import {
  MyAvatarGroup,
  StatusBadge,
  PriorityBadge,
} from "@/components/ui-components";
import { format } from "date-fns";
import {
  Calendar,
  Users,
  CheckSquare,
  Clock,
  ArrowLeft,
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  UserPlus,
  Settings,
  UploadCloud,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  CreateTaskDialog,
  EditTaskDialog,
} from "@/components/dialogs/task-dialog";
import { EditProjectDialog } from "@/components/dialogs/project-dialog";
import { AddMemberToProjectDialog } from "@/components/dialogs/member-dialog";
import { Project, Task, User } from "@/lib/types";
import Link from "next/link";
import { projectMembersApi, projectsApi, tasksApi } from "@/lib/api";
import { toast } from "@/components/ui/toast";

const TABS = ["overview", "tasks", "members", "settings"] as const;
type Tab = (typeof TABS)[number];

const STATUS_COLORS: Record<string, string> = {
  TODO: "bg-slate-500",
  "IN_PROGRESS": "bg-blue-500",
  REVIEW: "bg-amber-500",
  DONE: "bg-emerald-500",
};

function DeleteConfirmDialog({
  title,
  message,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: {
  title: string;
  message: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-3xl">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
        </DialogHeader>
        <DialogFooter className="gap-2 mt-4">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-xl border border-border/50 hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = usePathname();
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showEditProject, setShowEditProject] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskSearch, setTaskSearch] = useState("");
  const [taskStatus, setTaskStatus] = useState<string>("all");
  const [savedSettings, setSavedSettings] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false)
  const [tasksLoading, setTasksLoading] = useState(false)
  const [deleteTaskPending, setDeleteTaskPending] = useState(false)
  const [deleteProjectPending, setDeleteProjectPending] = useState(false)
  const [updateProjectPending, setUpdateProjectPending] = useState(false)
  const [changeTask, setChangeTask] = useState(false)
  const [changeMember, setChangeMember] = useState(false)

  useEffect(() => {
    setProjectLoading(true)
    async function getProject(){
      const proj = await projectsApi.findOne(id)
      setProject(proj)
      setProjectLoading(false)
    }
    getProject()
  }, [id])

  useEffect(() => {
    setTasksLoading(true)
    async function getTasks(){
      const t = await tasksApi.findProjectTasks(id)
      setTasks(t)
      setTasksLoading(false)
    }
    getTasks()
  }, [id, changeTask])

   useEffect(() => {
    async function getMembers(){
      const m = await projectMembersApi.findByProject(id)
      setMembers(m)
    }
    getMembers()
  }, [id, changeMember])

  if (projectLoading) {
    return (
      <div className="space-y-6">
        <div className="h-64 rounded-3xl bg-muted animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground mb-4">Project not found.</p>
        <Link
          href="/projects"
          className="text-primary text-sm font-medium hover:underline"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  const taskCounts = {
    TODO: tasks.filter((t) => t.status === "TODO").length,
    "IN_PROGRESS": tasks.filter((t) => t.status === "IN_PROGRESS").length,
    REVIEW: tasks.filter((t) => t.status === "REVIEW").length,
    DONE: tasks.filter((t) => t.status === "DONE").length,
  };

  const filteredTasks = tasks.filter((t) => {
    const matchSearch = t.title
      .toLowerCase()
      .includes(taskSearch.toLowerCase());
    const matchStatus = taskStatus === "all" || t.status === taskStatus;
    return matchSearch && matchStatus;
  });

  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(project.dueDate).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24),
    ),
  );

  const handleAddMember = async (userId: string) => {
    await projectMembersApi.create(project.id, {
      userId: userId,
      role: "MEMBER"
      })
      toast.add({
        title: "Member Added",
        type: "success"
      })
      setChangeMember(!changeMember)
  }
  const handleRemoveMember = async (memberId: string) => {
    await projectMembersApi.remove(
      project.id,
      memberId
    );

      toast.add({
        title: "Member Removed",
        type: "success"
      })
      setChangeMember(!changeMember)
  };

  const handleDeleteProject = async () => {
    await projectsApi.remove(project.id);
    router.push("/dashboard/projects");
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    await tasksApi.remove(selectedTask.id);
    setChangeTask(!changeTask)
    toast.add({
      title: "Task Deleted Successfully",
      type: "success"
    })
    setShowDeleteTask(false);
    setSelectedTask(null);
  };

  return (
    <PageTransition className="space-y-6 pb-12">
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Projects
      </Link>

      {/* Hero */}
      <div
        className={cn(
          "relative rounded-3xl overflow-hidden shadow-md bg-gradient-to-br min-h-[220px] flex flex-col justify-end p-8 text-white",
          project.gradient,
        )}
      >
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative z-10 flex justify-between items-end gap-4">
          <div className="max-w-2xl">
            <StatusBadge
              status={project.status}
              className="mb-3 bg-white/20 border-white/30 text-white"
            />
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              {project.name}
            </h1>
            <p className="text-white/80 text-base leading-relaxed">
              {project.description}
            </p>
          </div>
          {/* <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowEditProject(true)}
              className="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-semibold hover:scale-95 transition-transform shadow-sm flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" /> Edit
            </button>
          </div> */}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: CheckSquare,
            color: "text-primary bg-primary/10",
            label: "Progress",
            value: `${tasks.filter((task: Task) => task.status === "DONE").length/tasks.length*100}%`,
          },
          {
            icon: Users,
            color: "text-emerald-600 bg-emerald-500/10",
            label: "Team",
            value: `${members?.length ?? 0} members`,
          },
          {
            icon: Clock,
            color: "text-amber-600 bg-amber-500/10",
            label: "Timeline",
            value: `${daysLeft} days left`,
          },
          {
            icon: Calendar,
            color: "text-purple-600 bg-purple-500/10",
            label: "Due Date",
            value: format(new Date(project.dueDate), "MMM d, yyyy"),
          },
        ].map(({ icon: Icon, color, label, value }) => (
          <div
            key={label}
            className="bg-card border border-border/50 rounded-2xl p-5 flex items-center gap-4 shadow-sm"
          >
            <div className={cn("p-3 rounded-xl", color)}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-0.5">
                {label}
              </div>
              <div className="text-lg font-bold leading-none">{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-border/50">
        <nav className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative px-4 pb-3 pt-1 text-sm font-medium transition-colors capitalize",
                activeTab === tab
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="projectTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="min-h-[400px]"
        >
          {/* ─ OVERVIEW ─────────────────────────────────── */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Progress card */}
                <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold">Overall Progress</h3>
                    <span className="text-2xl font-bold text-primary">
                      {tasks.filter((task: Task) => task.status === "DONE").length/tasks.length*100}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={cn(
                        "h-full rounded-full bg-gradient-to-r",
                        project.gradient,
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${tasks.filter((task: Task) => task.status === "DONE").length/tasks.length*100}%` }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <div className="flex gap-4 mt-4">
                    {(["TODO", "IN_PROGRESS", "REVIEW", "DONE"] as const).map(
                      (s) => (
                        <div
                          key={s}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground"
                        >
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full",
                              STATUS_COLORS[s],
                            )}
                          />
                          <span className="capitalize">
                            {s === "IN_PROGRESS" ? "In Progress" : s}
                          </span>
                          <span className="font-semibold text-foreground">
                            {taskCounts[s]}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Recent tasks */}
                <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold">Recent Tasks</h3>
                    <button
                      onClick={() => setActiveTab("tasks")}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      View all
                    </button>
                  </div>
                  {tasksLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-12 bg-muted animate-pulse rounded-xl"
                        />
                      ))}
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No tasks yet.{" "}
                      <button
                        onClick={() => setShowCreateTask(true)}
                        className="text-primary hover:underline font-medium"
                      >
                        Create one
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {tasks.slice(0, 6).map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/40 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <StatusBadge
                              status={task.status}
                              className="shrink-0"
                            />
                            <span className="text-sm font-medium truncate">
                              {task.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <PriorityBadge priority={task.priority} />
                            <MyAvatarGroup users={[task.assignee!]} max={1} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Team sidebar */}
              <div className="space-y-6">
                <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold">Team</h3>
                    <button
                      onClick={() => setActiveTab("members")}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Manage
                    </button>
                  </div>
                  <div className="space-y-3">
                    {members?.map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-500 text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                          {member.user?.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold truncate">
                            {member.user?.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {member.role}
                          </div>
                        </div>
                      </div>
                    ))}
                    {members?.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No members yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─ TASKS ─────────────────────────────────────── */}
          {activeTab === "tasks" && (
            <div className="bg-card border border-border/50 rounded-3xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-border/50">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative max-w-xs flex-1">
                    <input
                      type="search"
                      placeholder="Search tasks..."
                      value={taskSearch}
                      onChange={(e) => setTaskSearch(e.target.value)}
                      className="w-full h-9 pl-9 pr-4 bg-background border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    className="h-9 bg-background border border-border/50 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="all">All</option>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowCreateTask(true)}
                  className="ml-3 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" /> New Task
                </button>
              </div>

              {tasksLoading ? (
                <div className="p-4 space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-12 bg-muted animate-pulse rounded-xl"
                    />
                  ))}
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="py-16 text-center">
                  <CheckCircle2 className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {tasks.length === 0
                      ? "No tasks yet."
                      : "No tasks match your filters."}
                  </p>
                  {tasks.length === 0 && (
                    <button
                      onClick={() => setShowCreateTask(true)}
                      className="mt-3 text-sm text-primary font-medium hover:underline"
                    >
                      Create the first task
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/20">
                      <tr>
                        <th className="px-5 py-3 text-left font-semibold">
                          Title
                        </th>
                        <th className="px-5 py-3 text-left font-semibold">
                          Status
                        </th>
                        <th className="px-5 py-3 text-left font-semibold">
                          Priority
                        </th>
                        <th className="px-5 py-3 text-left font-semibold">
                          Assignee
                        </th>
                        <th className="px-5 py-3 text-left font-semibold">
                          Due
                        </th>
                        <th className="px-5 py-3 text-right font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {filteredTasks.map((task) => (
                        <tr
                          key={task.id}
                          className="hover:bg-muted/30 transition-colors group"
                        >
                          <td className="px-5 py-3.5 font-medium max-w-[200px] truncate">
                            {task.title}
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={task.status} />
                          </td>
                          <td className="px-5 py-3.5">
                            <PriorityBadge priority={task.priority} />
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-500 text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0">
                                {task.assignee?.avatar}
                              </div>
                              <span className="text-sm truncate max-w-[90px]">
                                {task.assignee?.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground text-xs">
                            {format(new Date(task.dueDate), "MMM d")}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <button className="p-1.5 rounded-lg hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="rounded-xl w-36"
                              >
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setShowEditTask(true);
                                  }}
                                  className="rounded-lg cursor-pointer"
                                >
                                  <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setShowDeleteTask(true);
                                  }}
                                  className="rounded-lg cursor-pointer text-red-500 focus:text-red-500"
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="px-5 py-3 border-t border-border/50 text-xs text-muted-foreground bg-muted/10">
                {filteredTasks.length} task
                {filteredTasks.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}

          {/* ─ MEMBERS ───────────────────────────────────── */}
          {activeTab === "members" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {members?.length} member
                  {members?.length !== 1 ? "s" : ""} in this project
                </p>
                <button
                  onClick={() => setShowAddMember(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <UserPlus className="w-4 h-4" /> Add Member
                </button>
              </div>

              {members?.length === 0 ? (
                <div className="bg-card border border-border/50 rounded-3xl py-16 flex flex-col items-center text-center">
                  <Users className="w-10 h-10 text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">
                    No members in this project yet.
                  </p>
                  <button
                    onClick={() => setShowAddMember(true)}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    Add the first member
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members?.map((member) => (
                    <motion.div
                      key={member.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-card border border-border/50 rounded-3xl p-5 shadow-sm flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                        {member.user?.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {member.user?.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {member.user?.department}
                        </div>
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-muted rounded-full capitalize mt-1 inline-block">
                          {member.role}
                        </span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <button className="p-1.5 rounded-lg hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-xl w-36"
                        >
                          <DropdownMenuItem
                            onClick={() => handleRemoveMember(member.id)}
                            className="rounded-lg cursor-pointer text-red-500 focus:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─ SETTINGS ──────────────────────────────────── */}
          {activeTab === "settings" && (
            <ProjectSettingsTab
              project={project}
              onSaved={setProject}
              savedSettings={savedSettings}
              onDeleteRequest={() => setShowDeleteProject(true)}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dialogs */}
      {showEditProject && (
        <EditProjectDialog
          project={project}
          open={showEditProject}
          onOpenChange={setShowEditProject}
        />
      )}
      <CreateTaskDialog
        open={showCreateTask}
        onOpenChange={setShowCreateTask}
        defaultProjectId={project.id}
        change={() => {setChangeTask(!changeTask)}}
      />
      {showEditTask && selectedTask && (
        <EditTaskDialog
          task={selectedTask}
          open={showEditTask}
          onOpenChange={setShowEditTask}
          change={() => {setChangeTask(!changeTask)}}
        />
      )}
      <DeleteConfirmDialog
        title="Delete Task"
        message={`Are you sure you want to delete "${selectedTask?.title}"? This cannot be undone.`}
        open={showDeleteTask}
        onOpenChange={setShowDeleteTask}
        onConfirm={handleDeleteTask}
        isPending={deleteTaskPending}
      />
      <AddMemberToProjectDialog
        project={project}
        open={showAddMember}
        onOpenChange={setShowAddMember}
        onAdd={handleAddMember}
      />
      <DeleteConfirmDialog
        title="Delete Project"
        message={`Delete "${project.name}"? All tasks will also be removed. This cannot be undone.`}
        open={showDeleteProject}
        onOpenChange={setShowDeleteProject}
        onConfirm={handleDeleteProject}
        isPending={deleteProjectPending}
      />
    </PageTransition>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

const settingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["ACTIVE", "COMPLETED", "ON_HOLD", "PLANNING"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  dueDate: z.string().min(1, "Due date is required"),
});
type SettingsValues = z.infer<typeof settingsSchema>;

function ProjectSettingsTab({
  project,
  onSaved,
  savedSettings,
  onDeleteRequest,
}: {
  project: any;
  onSaved: any;
  savedSettings: boolean;
  onDeleteRequest: () => void;
}) {
  const [updateProjectPending, setUpdateProjectPending] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      dueDate: project.dueDate
        ? new Date(project.dueDate).toISOString().split("T")[0]
        : "",
    },
  });

  React.useEffect(() => {
    reset({
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      dueDate: project.dueDate
        ? new Date(project.dueDate).toISOString().split("T")[0]
        : "",
    });
  }, [project]);

  const onSubmit = async (values: SettingsValues) => {
    setUpdateProjectPending(true)
    const newProject = await projectsApi.update(
      project.id,
      {
        name: values.name,
        description: values.description,
        status: values.status,
        priority: values.priority,
        dueDate: new Date(values.dueDate).toISOString(),
      
    })
    onSaved(newProject);
    reset(values);
    setUpdateProjectPending(false)
  };

  return (
    <div className="max-w-2xl space-y-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm space-y-5"
      >
        <h3 className="text-base font-bold">General Settings</h3>

        <div>
          <Label className="text-sm font-medium mb-1.5 block">
            Project Name
          </Label>
          <Input {...register("name")} className="rounded-xl" />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium mb-1.5 block">
            Description
          </Label>
          <Textarea
            {...register("description")}
            rows={3}
            className="rounded-xl resize-none"
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
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
                    <SelectItem value="PLANNING">Planning</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
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
                    <SelectItem value="HIG">High</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-1.5 block">Due Date</Label>
            <Input
              {...register("dueDate")}
              type="date"
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <AnimatePresence>
            {savedSettings && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium"
              >
                <CheckCircle2 className="w-4 h-4" /> Changes saved
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="submit"
            disabled={updateProjectPending || !isDirty}
            className="ml-auto px-5 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {updateProjectPending && (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            )}
            Save Changes
          </button>
        </div>
      </form>

      {/* Danger zone */}
      <div className="bg-card border border-red-500/20 rounded-3xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-red-600 mb-1">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Deleting this project is permanent and cannot be undone. All tasks
          will be removed.
        </p>
        <button
          type="button"
          onClick={onDeleteRequest}
          className="px-4 py-2 text-sm font-medium rounded-xl border border-red-500/40 text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" /> Delete Project
        </button>
      </div>
    </div>
  );
}
