import { User, Project, Task, Notification, ActivityEvent } from './types';
import { subDays, subHours, subMinutes } from 'date-fns';

export let mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Alex Rivera',
    email: 'alex@teamhub.io',
    avatar: 'AR',
    role: 'admin',
    department: 'Design',
    joinedAt: subDays(new Date(), 365).toISOString(),
    lastActive: new Date().toISOString(),
    tasksCompleted: 142,
    tasksTotal: 156
  },
  {
    id: 'u2',
    name: 'Sarah Chen',
    email: 'sarah@teamhub.io',
    avatar: 'SC',
    role: 'member',
    department: 'Engineering',
    joinedAt: subDays(new Date(), 200).toISOString(),
    lastActive: subHours(new Date(), 2).toISOString(),
    tasksCompleted: 89,
    tasksTotal: 94
  },
  {
    id: 'u3',
    name: 'Marcus Johnson',
    email: 'marcus@teamhub.io',
    avatar: 'MJ',
    role: 'member',
    department: 'Product',
    joinedAt: subDays(new Date(), 150).toISOString(),
    lastActive: subMinutes(new Date(), 15).toISOString(),
    tasksCompleted: 64,
    tasksTotal: 72
  },
  {
    id: 'u4',
    name: 'Elena Rodriguez',
    email: 'elena@teamhub.io',
    avatar: 'ER',
    role: 'member',
    department: 'Marketing',
    joinedAt: subDays(new Date(), 80).toISOString(),
    lastActive: subDays(new Date(), 1).toISOString(),
    tasksCompleted: 24,
    tasksTotal: 30
  },
  {
    id: 'u5',
    name: 'David Kim',
    email: 'david@teamhub.io',
    avatar: 'DK',
    role: 'member',
    department: 'Engineering',
    joinedAt: subDays(new Date(), 400).toISOString(),
    lastActive: subMinutes(new Date(), 5).toISOString(),
    tasksCompleted: 210,
    tasksTotal: 225
  },
  {
    id: 'u6',
    name: 'Sophia Patel',
    email: 'sophia@teamhub.io',
    avatar: 'SP',
    role: 'viewer',
    department: 'Design',
    joinedAt: subDays(new Date(), 50).toISOString(),
    lastActive: subHours(new Date(), 5).toISOString(),
    tasksCompleted: 12,
    tasksTotal: 18
  },
  {
    id: 'u7',
    name: 'James Wilson',
    email: 'james@teamhub.io',
    avatar: 'JW',
    role: 'member',
    department: 'Sales',
    joinedAt: subDays(new Date(), 300).toISOString(),
    lastActive: subDays(new Date(), 2).toISOString(),
    tasksCompleted: 105,
    tasksTotal: 110
  },
  {
    id: 'u8',
    name: 'Olivia Martinez',
    email: 'olivia@teamhub.io',
    avatar: 'OM',
    role: 'admin',
    department: 'Operations',
    joinedAt: subDays(new Date(), 500).toISOString(),
    lastActive: new Date().toISOString(),
    tasksCompleted: 340,
    tasksTotal: 350
  }
];

export let mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'Overhaul of the main marketing site with new branding.',
    status: 'active',
    progress: 68,
    startDate: subDays(new Date(), 45).toISOString(),
    dueDate: subDays(new Date(), -15).toISOString(),
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    tasksTotal: 24,
    tasksCompleted: 16,
    priority: 'high',
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'p2',
    name: 'Mobile App MVP',
    description: 'Initial release of the iOS and Android applications.',
    status: 'active',
    progress: 32,
    startDate: subDays(new Date(), 10).toISOString(),
    dueDate: subDays(new Date(), -60).toISOString(),
    members: [mockUsers[1], mockUsers[4], mockUsers[5]],
    tasksTotal: 45,
    tasksCompleted: 14,
    priority: 'urgent' as any,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'p3',
    name: 'Q3 Marketing Campaign',
    description: 'Asset generation and planning for Q3 ad spend.',
    status: 'planning',
    progress: 10,
    startDate: subDays(new Date(), -5).toISOString(),
    dueDate: subDays(new Date(), -40).toISOString(),
    members: [mockUsers[3], mockUsers[0]],
    tasksTotal: 15,
    tasksCompleted: 1,
    priority: 'medium',
    gradient: 'from-orange-400 to-rose-400'
  },
  {
    id: 'p4',
    name: 'Infrastructure Upgrade',
    description: 'Migrating legacy databases to the new cluster.',
    status: 'on-hold',
    progress: 45,
    startDate: subDays(new Date(), 60).toISOString(),
    dueDate: subDays(new Date(), -20).toISOString(),
    members: [mockUsers[4], mockUsers[1]],
    tasksTotal: 30,
    tasksCompleted: 13,
    priority: 'high',
    gradient: 'from-slate-600 to-slate-800'
  },
  {
    id: 'p5',
    name: 'User Research Q2',
    description: 'Interviewing 50 core users about the new navigation.',
    status: 'completed',
    progress: 100,
    startDate: subDays(new Date(), 90).toISOString(),
    dueDate: subDays(new Date(), 5).toISOString(),
    members: [mockUsers[2], mockUsers[5]],
    tasksTotal: 20,
    tasksCompleted: 20,
    priority: 'medium',
    gradient: 'from-emerald-400 to-teal-500'
  },
  {
    id: 'p6',
    name: 'Design System 2.0',
    description: 'Updating all components to match the new visual language.',
    status: 'active',
    progress: 85,
    startDate: subDays(new Date(), 30).toISOString(),
    dueDate: subDays(new Date(), -10).toISOString(),
    members: [mockUsers[0], mockUsers[5]],
    tasksTotal: 40,
    tasksCompleted: 34,
    priority: 'medium',
    gradient: 'from-cyan-400 to-blue-500'
  }
];

export let mockTasks: Task[] = Array.from({ length: 25 }).map((_, i) => {
  const project = mockProjects[i % mockProjects.length];
  const assignee = project.members[i % project.members.length];
  const statuses: Task['status'][] = ['todo', 'in-progress', 'review', 'done'];
  const priorities: Task['priority'][] = ['low', 'medium', 'high', 'urgent'];
  
  return {
    id: `t${i + 1}`,
    title: `Task ${i + 1} for ${project.name}`,
    description: `This is a detailed description for task ${i + 1}. It involves various steps and requires collaboration.`,
    status: statuses[i % 4],
    priority: priorities[i % 4],
    assignee,
    project,
    dueDate: subDays(new Date(), (i % 10) - 5).toISOString(),
    createdAt: subDays(new Date(), 20 - i).toISOString(),
    tags: ['frontend', 'design', 'backend', 'research'].sort(() => 0.5 - Math.random()).slice(0, 2),
    estimatedHours: (i % 8) + 2
  };
});

export let mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'mention',
    title: 'Sarah Chen mentioned you',
    message: 'Can you review the latest designs for the dashboard?',
    read: false,
    createdAt: subMinutes(new Date(), 5).toISOString(),
    user: mockUsers[1]
  },
  {
    id: 'n2',
    type: 'task',
    title: 'Task assigned to you',
    message: 'Marcus Johnson assigned "Update Hero Copy" to you.',
    read: false,
    createdAt: subHours(new Date(), 2).toISOString(),
    user: mockUsers[2]
  },
  {
    id: 'n3',
    type: 'deadline',
    title: 'Approaching Deadline',
    message: 'The task "API Integration" is due tomorrow.',
    read: true,
    createdAt: subDays(new Date(), 1).toISOString(),
    user: mockUsers[4]
  },
  {
    id: 'n4',
    type: 'comment',
    title: 'New comment on your task',
    message: 'Elena left a comment on "Marketing Assets".',
    read: true,
    createdAt: subDays(new Date(), 2).toISOString(),
    user: mockUsers[3]
  },
  {
    id: 'n5',
    type: 'project',
    title: 'Project Status Changed',
    message: 'Website Redesign is now Active.',
    read: true,
    createdAt: subDays(new Date(), 3).toISOString(),
    user: mockUsers[7]
  }
];

export let mockActivities: ActivityEvent[] = [
  {
    id: 'a1',
    type: 'completed_task',
    description: 'completed task "Setup repository"',
    user: mockUsers[1],
    project: mockProjects[1],
    createdAt: subMinutes(new Date(), 30).toISOString()
  },
  {
    id: 'a2',
    type: 'commented',
    description: 'commented on "Design Review"',
    user: mockUsers[0],
    task: mockTasks[2],
    createdAt: subHours(new Date(), 2).toISOString()
  },
  {
    id: 'a3',
    type: 'created_project',
    description: 'created project "Q3 Marketing Campaign"',
    user: mockUsers[7],
    project: mockProjects[2],
    createdAt: subDays(new Date(), 1).toISOString()
  },
  {
    id: 'a4',
    type: 'status_change',
    description: 'moved task to In Progress',
    user: mockUsers[2],
    task: mockTasks[5],
    createdAt: subDays(new Date(), 2).toISOString()
  }
];