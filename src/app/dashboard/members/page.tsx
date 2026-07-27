"use client";
import React, { useEffect, useState } from "react";
import { PageTransition } from "@/components/page-transition";
import { CardSkeleton } from "@/components/loading";
import {
  Search,
  UserPlus,
  Mail,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InviteMemberDialog,
  EditMemberDialog,
} from "@/components/dialogs/member-dialog";
import { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { mockUsers } from "@/lib/data";
import { usersApi } from "@/lib/api";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  member: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  viewer: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
};

const AVATAR_GRADIENTS = [
  "from-blue-500 to-indigo-500",
  "from-purple-500 to-pink-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-cyan-400 to-blue-500",
  "from-rose-400 to-pink-500",
  "from-violet-500 to-purple-600",
  "from-green-400 to-emerald-500",
];

export default function Members() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showInvite, setShowInvite] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    async function getMembers(){
      const allUsers = await usersApi.findAll();
      setUsers(allUsers)
      setIsLoading(false)
    }
    getMembers()
  }, [])

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.department?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <PageTransition className="space-y-6 pb-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground mt-1">
            {users.length} people in your organization.
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:scale-95 transition-transform shadow-sm flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Invite Member
        </button>
      </header>

      {/* Filters */}
      <div className="flex gap-3 items-center flex-wrap">
        <div className="relative max-w-sm flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, department, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-card border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-11 bg-card border border-border/50 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="all">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="MEMBER">Member</option>
          <option value="MANAGER">Member</option>
        </select>
      </div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        layout
      >
        <AnimatePresence>
          {isLoading
            ? Array(8)
                .fill(0)
                .map((_, i) => <CardSkeleton key={i} />)
            : filtered.map((user, i) => {
                const gradient = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
                const activityPct = Math.round(
                  (10 / Math.max(20, 1)) * 100,
                );
                const isOnline =
                  new Date(user.lastActive ?? Date.now()) >
                  new Date(Date.now() - 30 * 60 * 1000);

                return (
                  <motion.div
                    key={user.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: (i % 8) * 0.04 }}
                    whileHover={{ y: -4 }}
                    className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex flex-col relative group"
                  >
                    {/* Dropdown menu */}
                    <div className="absolute top-4 right-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger> 
                          <button className="p-1.5 text-muted-foreground cursor-pointer hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-muted">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-xl w-40"
                        >
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEdit(true);
                            }}
                            className="rounded-lg cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5 mr-2" /> Edit Member
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem className="rounded-lg cursor-pointer">
                            <Mail className="w-3.5 h-3.5 mr-2" /> Send Email
                          </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Avatar */}
                    <div className="flex flex-col items-center text-center mb-5">
                      <div className="relative mb-3">
                        <div
                          className={cn(
                            "w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xl font-bold shadow-sm",
                            gradient,
                          )}
                        >
                          {user.avatar}
                        </div>
                        <div
                          className={cn(
                            "absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-card",
                            isOnline ? "bg-emerald-500" : "bg-slate-400",
                          )}
                        />
                      </div>
                      <h3 className="font-bold text-base leading-tight">
                        {user.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {user.department}
                      </p>
                      <span
                        className={cn(
                          "mt-2 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize",
                          ROLE_COLORS[user.role],
                        )}
                      >
                        {user.role}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="mt-auto space-y-4 w-full">
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="bg-muted/50 rounded-xl p-2.5">
                          <div className="text-lg font-bold leading-none">
                            {10}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            Completed
                          </div>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-2.5">
                          <div className="text-lg font-bold leading-none">
                            {20 - 10}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            Remaining
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-medium mb-1.5">
                          <span className="text-muted-foreground">
                            Activity
                          </span>
                          <span>{activityPct}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={cn(
                              "h-full rounded-full bg-gradient-to-r",
                              gradient,
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${activityPct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.05 }}
                          />
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground text-center">
                        Active{" "}
                        {isOnline
                          ? "now"
                          : formatDistanceToNow(new Date(user.lastActive ?? Date.now()), {
                              addSuffix: true,
                            })}
                      </div>

                      <button className="w-full bg-muted hover:bg-muted/80 text-foreground py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <Mail className="w-4 h-4" /> Message
                      </button>
                    </div>
                  </motion.div>
                );
              })}
        </AnimatePresence>
      </motion.div>

      {!isLoading && filtered.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          <p className="mb-3">No members found.</p>
          <button
            onClick={() => setShowInvite(true)}
            className="text-sm text-primary font-medium hover:underline"
          >
            Invite someone
          </button>
        </div>
      )}

      <InviteMemberDialog open={showInvite} onOpenChange={setShowInvite} />
      {selectedUser && (
        <EditMemberDialog
          user={selectedUser}
          open={showEdit}
          onOpenChange={setShowEdit}
        />
      )}
    </PageTransition>
  );
}
