"use client";
import React, { useEffect, useState } from "react";
import { PageTransition } from "@/components/page-transition";
import { format } from "date-fns";
import { Skeleton } from "@/components/loading";
import { Activity as ActivityType} from "@/lib/types";
import { activitiesApi } from "@/lib/api";

export default function Activity() {
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityType[]>([]);

  useEffect(() => {
    async function getNotifications(){
      const activs = await activitiesApi.findAll()
      setActivities(activs)
      setIsLoading(false)
    }
    getNotifications()
  }, [])
  return (
    <PageTransition className="space-y-8 max-w-3xl mx-auto pb-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
        <p className="text-muted-foreground mt-1">
          Audit trail of all actions.
        </p>
      </header>

      <div className="relative border-l-2 border-border/50 ml-4 pl-8 space-y-12">
        {isLoading
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[41px] w-6 h-6 rounded-full bg-card border-2 border-border/50" />
                  <Skeleton className="h-24 w-full rounded-2xl" />
                </div>
              ))
          : activities?.map((activity, i) => (
              <div key={activity.id} className="relative">
                <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                </div>

                <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                      {activity.user?.avatar}
                    </div>
                    <div>
                      <span className="font-semibold text-sm mr-1">
                        {activity.user?.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {activity.description}
                      </span>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      {format(new Date(activity.createdAt), "h:mm a")}
                    </div>
                  </div>

                  {activity.project && (
                    <div className="mt-3 p-3 bg-muted/30 rounded-xl border border-border/50 text-sm">
                      Project:{" "}
                      <span className="font-medium">
                        {activity.project.name}
                      </span>
                    </div>
                  )}

                  {activity.task && (
                    <div className="mt-3 p-3 bg-muted/30 rounded-xl border border-border/50 text-sm flex gap-2 items-center">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span className="font-medium">{activity.task.title}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
      </div>
    </PageTransition>
  );
}
