import axios from "axios";
import { Project, User, ProjectMember, Task } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(
      error.response?.data?.message || error.message || "Something went wrong",
    );
  },
);

export const authApi = {
  login: async (data: {email: string, password: string}) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  register: async (data: {email: string, name: string, role: string, department: string}) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  profile: async () => {
    const res = await api.get<User>("/auth/profile");
    return res.data;
  },
};

export const usersApi = {
  findAll: async () => {
    const res = await api.get<User[]>("/users");
    return res.data;
  },

  findOne: async (id: string) => {
    const res = await api.get<User>(`/users/${id}`);
    return res.data;
  },

  update: async (id: string, data: User) => {
    const res = await api.patch(`/users/${id}`, data);
    return res.data;
  },

  remove: async (id: string) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};

export const projectsApi = {
  create: async (data: Partial<Project>) => {
    const res = await api.post<Project>("/projects", data);
    return res.data;
  },

  findAll: async () => {
    const res = await api.get<Project[]>("/projects");
    return res.data;
  },

  findMyProjects: async () => {
    const res = await api.get<Project[]>("/projects/my");
    return res.data;
  },

  findOne: async (id: string) => {
    const res = await api.get<Project>(`/projects/${id}`);
    return res.data;
  },

  update: async (id: string, data: Partial<Project>) => {
    const res = await api.patch(`/projects/${id}`, data);
    return res.data;
  },

  remove: async (id: string) => {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  },
};

export const projectMembersApi = {
  create: async (projectId: string, data: any) => {
    const res = await api.post(`/projects/${projectId}/members`, data);
    return res.data;
  },

  findByProject: async (projectId: string) => {
    const res = await api.get(`/projects/${projectId}/members`);
    return res.data;
  },

  update: async (projectId: string, id: string, data: any) => {
    const res = await api.patch(`/projects/${projectId}/members/${id}`, data);
    return res.data;
  },

  remove: async (projectId: string,id: string) => {
    const res = await api.delete(`/projects/${projectId}/members/${id}`);
    return res.data;
  },
};

export const tasksApi = {
  create: async (data: any) => {
    const res = await api.post<Task>("/tasks", data);
    return res.data;
  },

  findAll: async () => {
    const res = await api.get<Task[]>("/tasks");
    return res.data;
  },

  findProjectTasks: async (projectId: string) => {
    const res = await api.get<Task[]>(`/tasks/project/${projectId}`);
    return res.data;
  },

  findOne: async (id: string) => {
    const res = await api.get<Task>(`/tasks/${id}`);
    return res.data;
  },

  update: async (id: string, data: any) => {
    const res = await api.patch(`/tasks/${id}`, data);
    return res.data;
  },

  remove: async (id: string) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },

  assign: async (id: string, assigneeId: string) => {
    const res = await api.patch(`/tasks/${id}/assign`, {
      assigneeId,
    });

    return res.data;
  },

  changeStatus: async (id: string, status: string) => {
    const res = await api.patch(`/tasks/${id}/status`, {
      status,
    });

    return res.data;
  },
};

export const notificationsApi = {
  create: async (data: any) => {
    const res = await api.post("/notifications", data);
    return res.data;
  },

  findAll: async () => {
    const res = await api.get("/notifications");
    return res.data;
  },

  findAllUnread: async () => {
    const res = await api.get("/notifications/unread");
    return res.data;
  },

  markAsRead: async (id: string) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await api.patch("/notifications/read-all");
    return res.data;
  },

  remove: async (id: string) => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  },
};

export const activitiesApi = {
  findAll: async () => {
    const res = await api.get("/activities");
    return res.data;
  },

  findAllByProjectId: async (projectId: string) => {
    const res = await api.get(`activities/project/${projectId}`)
  },

  findAllByUserId: async (userId: string) => {
    const res = await api.get(`activities/project/${userId}`)
  }
};

export const dashboardApi = {
  getStats: async () => {
    const res = await api.get("/dashboard/my");
    return res.data;
  },
};