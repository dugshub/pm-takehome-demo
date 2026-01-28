import apiClient from './client';
import type { Project, CreateProjectInput, UpdateProjectInput } from '../types';

export const projectsApi = {
  getAll: async (search?: string): Promise<Project[]> => {
    const params = search ? { search } : {};
    const { data } = await apiClient.get<Project[]>('/projects', { params });
    return data;
  },

  getById: async (id: string): Promise<Project> => {
    const { data } = await apiClient.get<Project>(`/projects/${id}`);
    return data;
  },

  create: async (input: CreateProjectInput): Promise<Project> => {
    const { data } = await apiClient.post<Project>('/projects', input);
    return data;
  },

  update: async (id: string, input: UpdateProjectInput): Promise<Project> => {
    const { data } = await apiClient.patch<Project>(`/projects/${id}`, input);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  search: async (query: string): Promise<Project[]> => {
    const { data } = await apiClient.get<Project[]>('/projects/search', {
      params: { q: query },
    });
    return data;
  },
};
