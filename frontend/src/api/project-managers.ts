import apiClient from './client';
import type { ProjectManager, CreateProjectManagerInput, UpdateProjectManagerInput } from '../types';

export const projectManagersApi = {
  getAll: async (): Promise<ProjectManager[]> => {
    const { data } = await apiClient.get<ProjectManager[]>('/project-managers');
    return data;
  },

  getById: async (id: string): Promise<ProjectManager> => {
    const { data } = await apiClient.get<ProjectManager>(`/project-managers/${id}`);
    return data;
  },

  create: async (input: CreateProjectManagerInput): Promise<ProjectManager> => {
    const { data } = await apiClient.post<ProjectManager>('/project-managers', input);
    return data;
  },

  update: async (id: string, input: UpdateProjectManagerInput): Promise<ProjectManager> => {
    const { data } = await apiClient.patch<ProjectManager>(`/project-managers/${id}`, input);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/project-managers/${id}`);
  },
};
