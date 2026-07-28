"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Kanban as KanbanIcon,
  Users,
  Bell,
  Activity,
  User,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/theme-provider";
import { useAuth } from "@/contexts/auth-context";
import { MyAvatar } from "./ui-components";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FolderKanban, label: "Projects", href: "/dashboard/projects" },
  { icon: CheckSquare, label: "Tasks", href: "/dashboard/tasks" },
  { icon: KanbanIcon, label: "Kanban", href: "/dashboard/kanban" },
  { icon: Users, label: "Members", href: "/dashboard/members" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: Activity, label: "Activity", href: "/dashboard/activity" },
];

const BOTTOM_NAV_ITEMS = [
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
  const location = usePathname();
  const {user} = useAuth()
  const { theme, setTheme } = useTheme();

  return (
    <aside className="fixed left-4 top-4 bottom-4 w-64 glass-panel rounded-3xl flex flex-col z-40 overflow-hidden py-6">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
          <div className="w-4 h-4 rounded-full border-2 border-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">TeamHub</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1 scrollbar-hide">
        {NAV_ITEMS.map((item) => {
          const isActive = location.startsWith(item.href);
          if(item.label === "Members" && user?.role === "MEMBER") return
          return (
            <Link key={item.label} href={item.href} className="block relative">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div
                className={cn(
                  "relative z-10 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5",
                )}
              >
                <item.icon
                  className={cn("w-5 h-5", isActive && "fill-primary/20")}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.label}
              </div>
            </Link>
          );
        })}

        <div className="mt-8 mb-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Account
        </div>

        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = location.startsWith(item.href);
          return (
            <Link key={item.label} href={item.href} className="block relative">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div
                className={cn(
                  "relative z-10 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5",
                )}
              >
                <item.icon
                  className="w-5 h-5"
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="px-4 mt-auto pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {user ? (
            <MyAvatar user={user}/>
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-semibold truncate w-24">
              {user?.name || "Loading..."}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {user?.role || "..."}
            </span>
          </div>
        </div>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
