"use client";
import { useAuth } from "@/contexts/auth-context";
import { Search, Bell, Command } from "lucide-react";
import Link from "next/link";
import { MyAvatar } from "./ui-components";
import { useEffect, useState } from "react";
import { Notification } from "@/lib/types";
import { notificationsApi } from "@/lib/api";

export function Navbar() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    async function getUnreadNotifications(){
      const notifs = await notificationsApi.findAllUnread()
      setNotifications(notifs)
    }
    getUnreadNotifications()
  }, [])

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-background/60 backdrop-blur-xl border-b border-border/50">
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search everywhere..."
          className="w-full h-10 pl-10 pr-12 bg-white/50 dark:bg-white/5 border border-border/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50">
          <Command className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">K</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/notifications"
          className="relative p-2 rounded-xl text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {notifications.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-destructive rounded-full border-2 border-background" />
          )}
        </Link>

        {user ? (
          <MyAvatar user={user} />
        ) : (
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
        )}
      </div>
    </header>
  );
}
