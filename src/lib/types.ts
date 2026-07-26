// =======================
// ENUMS
// =======================

export type Role = "ADMIN" | "MANAGER" | "MEMBER";

export type ProjectStatus = "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED";

export type ProjectRole = "MANAGER" | "MEMBER";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type NotificationType =
  | "WELCOME"
  | "MENTION"
  | "TASK"
  | "PROJECT"
  | "COMMENT"
  | "DEADLINE";

// =======================
// USER
// =======================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  department?: string | null;
  role: Role;
  lastActive?: string | null;
  refreshToken?: string | null;
  createdAt: string;
  updatedAt: string;
  ownedProjects?: Project[];
  memberships?: ProjectMember[];
  assignedTasks?: Task[];
  notifications?: Notification[];
  activities?: Activity[];
}

// =======================
// PROJECT
// =======================

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  priority: TaskPriority;
  gradient?: string | null;
  startDate: string;
  dueDate: string;
  ownerId: string;
  owner?: User;
  members?: ProjectMember[];
  tasks?: Task[];
  activities?: Activity[];
  createdAt: string;
  updatedAt: string;
}

// =======================
// PROJECT MEMBER
// =======================

export interface ProjectMember {
  id: string;
  role: ProjectRole;
  joinedAt: string;
  projectId: string;
  userId: string;
  project?: Project;
  user?: User;
}

// =======================
// TASK
// =======================

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedHours: number;
  dueDate: string;
  assigneeId?: string | null;
  assignee?: User | null;
  projectId: string;
  project?: Project;
  tags: string[];
  activities?: Activity[];
  createdAt: string;
  updatedAt: string;
}

// =======================
// NOTIFICATION
// =======================

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  type: NotificationType;
  userId: string;
  user?: User;
  createdAt: string;
}

// =======================
// ACTIVITY
// =======================

export interface Activity {
  id: string;
  type: string;
  description: string;
  userId: string;
  projectId?: string | null;
  taskId?: string | null;
  user?: User;
  project?: Project;
  task?: Task;
  createdAt: string;
}

// =======================
// AUTH
// =======================

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  role: Role;
  department?: string;
}

export interface UpdateUserDto {
  name?: string;
  avatar?: string;
  department?: string;
  role?: Role;
}

export interface CreateProjectDto {
  name: string;
  description: string;
  priority: TaskPriority;
  startDate: string;
  dueDate: string;
  gradient?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  progress?: number;
  priority?: TaskPriority;
  startDate?: string;
  dueDate?: string;
  gradient?: string;
}

export interface CreateProjectMemberDto {
  projectId: string;
  userId: string;
  role?: ProjectRole;
}

export interface UpdateProjectMemberDto {
  role?: ProjectRole;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  priority: TaskPriority;
  estimatedHours: number;
  dueDate: string;
  projectId: string;
  assigneeId?: string;
  tags: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  estimatedHours?: number;
  dueDate?: string;
  assigneeId?: string;
  tags?: string[];
}

export interface AssignTaskDto {
  assigneeId: string;
}

export interface ChangeStatusDto {
  status: TaskStatus;
}
