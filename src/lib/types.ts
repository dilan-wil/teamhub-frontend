export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'member' | 'viewer';
  department: string;
  joinedAt: string;
  lastActive: string;
  tasksCompleted: number;
  tasksTotal: number;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'planning';
  progress: number;
  startDate: string;
  dueDate: string;
  members: User[];
  tasksTotal: number;
  tasksCompleted: number;
  priority: 'low' | 'medium' | 'high';
  gradient: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: User;
  project: Project;
  dueDate: string;
  createdAt: string;
  tags: string[];
  estimatedHours: number;
};

export type Notification = {
  id: string;
  type: 'mention' | 'task' | 'project' | 'comment' | 'deadline';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  user: User;
};

export type ActivityEvent = {
  id: string;
  type: string;
  description: string;
  user: User;
  project?: Project;
  task?: Task;
  createdAt: string;
};