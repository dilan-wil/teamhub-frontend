import React from "react";
import { cn } from "@/lib/utils";
import { User } from "@/lib/types";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "./ui/avatar";
import { getInitials } from "@/lib/get-initials";

export function MyAvatarGroup({
  users,
  max = 3,
  className,
}: {
  users: User[];
  max?: number;
  className?: string;
}) {
  const visible = users.slice(0, max);
  const overflow = users.length - max;

  return (
    <AvatarGroup>
      {visible.map((user, i) => (
        <Avatar>
          <AvatarImage src={user.avatar || ""} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      ))}
      {overflow > 0 && <AvatarGroupCount>+{overflow}</AvatarGroupCount>}
    </AvatarGroup>
  );
}

export function MyAvatar({ user }: { user: User }) {
  return (
    <Avatar>
      <AvatarImage src={user.avatar || ""} />
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
  );
}

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const variants: Record<string, string> = {
    ACTIVE:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    COMPLETED:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    ON_HOLD:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    PLANNING:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    TODO: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
    IN_PROGRESS: "bg-primary/10 text-primary border-primary/20",
    REVIEW:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    DONE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  };

  const labels: Record<string, string> = {
    "in-progress": "In Progress",
    "on-hold": "On Hold",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize whitespace-nowrap",
        variants[status] || variants["TODO"],
        className,
      )}
    >
      {labels[status] || status}
    </span>
  );
}

export function PriorityBadge({
  priority,
  className,
}: {
  priority: string;
  className?: string;
}) {
  const variants: Record<string, { bg: string; dot: string }> = {
    low: {
      bg: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
      dot: "bg-gray-500",
    },
    medium: {
      bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      dot: "bg-blue-500",
    },
    high: {
      bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      dot: "bg-amber-500",
    },
    urgent: {
      bg: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
      dot: "bg-red-500 animate-pulse",
    },
  };

  const v = variants[priority] || variants["low"];

  return (
    <span
      className={cn(
        "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize",
        v.bg,
        className,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", v.dot)} />
      {priority}
    </span>
  );
}
