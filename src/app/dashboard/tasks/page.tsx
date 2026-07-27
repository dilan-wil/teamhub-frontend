"use client";
import React, { useEffect, useState } from "react";
import { PageTransition } from "@/components/page-transition";
import { TableSkeleton } from "@/components/loading";
import {
  AvatarGroup,
  StatusBadge,
  PriorityBadge,
} from "@/components/ui-components";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CreateTaskDialog,
  EditTaskDialog,
} from "@/components/dialogs/task-dialog";
import { tasksApi } from "@/lib/api";

const ITEMS_PER_PAGE = 10;

function DeleteConfirm({
  task,
  open,
  onOpenChange,
}: {
  task: Task | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [isPending, setIsPending] = useState(false);
  const confirm = async () => {
    if (!task) return;
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-3xl">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <DialogTitle className="text-lg font-bold">Delete Task</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Delete "
            <span className="font-medium text-foreground">{task?.title}</span>"?
            This cannot be undone.
          </p>
        </DialogHeader>
        <DialogFooter className="gap-2 mt-4">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-xl border border-border/50 hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
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

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);

  useEffect(() => {
    async function getMyTasks(){
      const myTasks = await tasksApi.findAll()
      setTasks(myTasks)
    }
    getMyTasks()
  }, [])

  const filtered = tasks.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.assignee?.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchPriority =
      priorityFilter === "all" || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleFilterChange =
    (setter: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value);
      setPage(1);
    };

  return (
    <PageTransition className="space-y-6 pb-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your team's work.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:scale-95 transition-transform shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Task
        </button>
      </header>

      <div className="bg-card border border-border/50 rounded-3xl shadow-sm flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border/50 flex gap-3 items-center bg-muted/10 flex-wrap">
          <div className="relative max-w-xs flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 pl-9 pr-4 bg-background border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={handleFilterChange(setStatusFilter)}
            className="h-10 bg-background border border-border/50 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>

          <select
            value={priorityFilter}
            onChange={handleFilterChange(setPriorityFilter)}
            className="h-10 bg-background border border-border/50 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/20 uppercase">
                <tr>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Priority</th>
                  <th className="px-6 py-4 font-semibold">Assignee</th>
                  <th className="px-6 py-4 font-semibold">Project</th>
                  <th className="px-6 py-4 font-semibold">Due Date</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center text-muted-foreground"
                    >
                      No tasks match your filters.
                    </td>
                  </tr>
                ) : (
                  paginated.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium max-w-[200px]">
                        <div className="truncate">{task.title}</div>
                        {task.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {task.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-1.5 py-0.5 bg-muted rounded-full text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-purple-500 text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0">
                            {task.assignee?.avatar}
                          </div>
                          <span className="truncate max-w-[100px] text-sm">
                            {task.assignee?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <div className="truncate max-w-[120px] text-sm">
                          {task.project?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "text-sm",
                            new Date(task.dueDate) < new Date() &&
                              task.status !== "DONE"
                              ? "text-red-500 font-medium"
                              : "text-muted-foreground",
                          )}
                        >
                          {format(new Date(task.dueDate), "MMM d, yyyy")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="rounded-xl w-36"
                          >
                            <DropdownMenuItem
                              onClick={() => {
                                setSelected(task);
                                setShowEdit(true);
                              }}
                              className="rounded-lg cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelected(task);
                                setShowDelete(true);
                              }}
                              className="rounded-lg cursor-pointer text-red-500 focus:text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground bg-muted/10">
          <div>
            {filtered.length} task{filtered.length !== 1 ? "s" : ""}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-border/50 rounded-lg hover:bg-background transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
            >
              Previous
            </button>
            <span className="px-2 text-xs">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 border border-border/50 rounded-lg hover:bg-background transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <CreateTaskDialog open={showCreate} onOpenChange={setShowCreate} />
      {selected && showEdit && (
        <EditTaskDialog
          task={selected}
          open={showEdit}
          onOpenChange={setShowEdit}
        />
      )}
      <DeleteConfirm
        task={selected}
        open={showDelete}
        onOpenChange={setShowDelete}
      />
    </PageTransition>
  );
}
