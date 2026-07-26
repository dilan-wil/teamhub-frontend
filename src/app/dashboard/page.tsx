"use client";
import React, { useState } from "react";
import {
  PageTransition,
  staggerContainer,
  staggerItem,
} from "@/components/page-transition";
import { StatsCard } from "@/components/stats-card";
import { ProjectCard } from "@/components/project-card";
import { ProgressRing } from "@/components/progress-ring";
import { CardSkeleton, ProjectCardSkeleton } from "@/components/loading";
import {
  FolderKanban,
  CheckSquare,
  Users,
  TrendingUp,
  MoreHorizontal,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, subDays } from "date-fns";
import {
  AvatarGroup,
  StatusBadge,
  PriorityBadge,
} from "@/components/ui-components";
import { mockActivities, mockProjects, mockTasks, mockUsers } from "@/lib/data";

export default function Dashboard() {
  const user = mockUsers[0];
  const projects = mockProjects;
  const tasks = mockTasks;
  const team = mockUsers;
  const activities = mockActivities;
  const [isLoading, setIsLoading] = useState(false);

  const activeProjects =
    projects?.filter((p) => p.status === "active").length || 0;
  const tasksToday = tasks?.filter((t) => t.status !== "done").length || 0; // Simplified for mock
  const completionRate = tasks
    ? Math.round(
        (tasks.filter((t) => t.status === "done").length / tasks.length) * 100,
      )
    : 0;

  // Chart data
  const chartData = Array.from({ length: 7 }).map((_, i) => ({
    name: format(subDays(new Date(), 6 - i), "EEE"),
    completed: Math.floor(Math.random() * 15) + 5,
    added: Math.floor(Math.random() * 10) + 2,
  }));

  const pieData = [
    {
      name: "Todo",
      value: tasks?.filter((t) => t.status === "todo").length || 0,
      color: "hsl(var(--muted-foreground))",
    },
    {
      name: "In Progress",
      value: tasks?.filter((t) => t.status === "in-progress").length || 0,
      color: "hsl(var(--primary))",
    },
    {
      name: "Review",
      value: tasks?.filter((t) => t.status === "review").length || 0,
      color: "hsl(38, 92%, 50%)",
    },
    {
      name: "Done",
      value: tasks?.filter((t) => t.status === "done").length || 0,
      color: "hsl(142, 71%, 45%)",
    },
  ];

  return (
    <PageTransition className="space-y-8 pb-10">
      <header className="flex justify-between items-end">
        <div>
          {false ? (
            <div className="h-10 w-64 bg-muted animate-pulse rounded-md" />
          ) : (
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-4xl font-bold tracking-tight"
            >
              Good morning, {user?.name.split(" ")[0]}
            </motion.h1>
          )}
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your team today.
          </p>
        </div>
      </header>

      {/* KPI Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {isLoading ? (
          Array(4)
            .fill(0)
            .map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <motion.div>
              <StatsCard
                title="Active Projects"
                value={activeProjects}
                icon={FolderKanban}
                trend={12}
                trendLabel="vs last month"
              />
            </motion.div>
            <motion.div>
              <StatsCard
                title="Tasks Pending"
                value={tasksToday}
                icon={CheckSquare}
                trend={-5}
                trendLabel="vs last week"
              />
            </motion.div>
            <motion.div>
              <StatsCard
                title="Team Members"
                value={team?.length || 0}
                icon={Users}
                trend={2}
                trendLabel="new this month"
              />
            </motion.div>
            <motion.div>
              <StatsCard
                title="Completion Rate"
                value={completionRate}
                suffix="%"
                icon={TrendingUp}
                trend={8}
                trendLabel="vs last week"
              />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold tracking-tight">
                Productivity Trend
              </h2>
              <select className="bg-muted text-sm rounded-lg px-3 py-1.5 border-none outline-none focus:ring-2 focus:ring-primary/20">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorCompleted"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid hsl(var(--border))",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Active Projects */}
          <div>
            <div className="flex justify-between items-center mb-4 px-1">
              <h2 className="text-lg font-bold tracking-tight">
                Active Projects
              </h2>
              <a
                href="/projects"
                className="text-sm text-primary font-medium hover:underline"
              >
                View all
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoading
                ? Array(2)
                    .fill(0)
                    .map((_, i) => <ProjectCardSkeleton key={i} />)
                : projects
                    ?.filter((p) => p.status === "active")
                    .slice(0, 2)
                    .map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
            </div>
          </div>
        </div>

        {/* Sidebar/Right Column */}
        <div className="space-y-6">
          {/* Progress Ring & Task Dist */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold tracking-tight mb-6">
              Task Distribution
            </h2>
            <div className="flex justify-center mb-6">
              <ProgressRing
                progress={completionRate}
                size={160}
                strokeWidth={12}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold tracking-tight">
                    {completionRate}%
                  </div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Done
                  </div>
                </div>
              </ProgressRing>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <div className="text-sm font-medium">{item.value}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex flex-col h-[350px]"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold tracking-tight">
                Recent Activity
              </h2>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide">
              {isLoading
                ? Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted animate-pulse shrink-0" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                          <div className="h-3 bg-muted animate-pulse rounded w-1/4" />
                        </div>
                      </div>
                    ))
                : activities?.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex gap-3 group">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xs font-medium shrink-0 shadow-sm">
                        {activity.user.avatar}
                      </div>
                      <div>
                        <p className="text-sm text-foreground leading-snug">
                          <span className="font-semibold">
                            {activity.user.name}
                          </span>{" "}
                          <span className="text-muted-foreground">
                            {activity.description}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {format(new Date(activity.createdAt), "h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
