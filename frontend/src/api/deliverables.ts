import apiClient from './client';
import type { Deliverable, CreateDeliverableInput, UpdateDeliverableInput } from '../types';

export interface DeliverableFilters {
  projectId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export const deliverablesApi = {
  getAll: async (filters?: DeliverableFilters): Promise<Deliverable[]> => {
    const { data } = await apiClient.get<Deliverable[]>('/deliverables', { params: filters });
    return data;
  },

  getById: async (id: string): Promise<Deliverable> => {
    const { data } = await apiClient.get<Deliverable>(`/deliverables/${id}`);
    return data;
  },

  create: async (input: CreateDeliverableInput): Promise<Deliverable> => {
    const { data } = await apiClient.post<Deliverable>('/deliverables', input);
    return data;
  },

  update: async (id: string, input: UpdateDeliverableInput): Promise<Deliverable> => {
    const { data } = await apiClient.patch<Deliverable>(`/deliverables/${id}`, input);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/deliverables/${id}`);
  },

  getUpcoming: async (days: number = 30): Promise<Deliverable[]> => {
    const { data } = await apiClient.get<Deliverable[]>('/deliverables/upcoming', {
      params: { days },
    });
    return data;
  },

  getOverdue: async (): Promise<Deliverable[]> => {
    const { data } = await apiClient.get<Deliverable[]>('/deliverables', {
      params: { status: 'overdue' },
    });
    return data;
  },

  getByProject: async (projectId: string): Promise<Deliverable[]> => {
    const { data } = await apiClient.get<Deliverable[]>('/deliverables', {
      params: { projectId },
    });
    return data;
  },

  getByProjectManager: async (projectManagerId: string): Promise<Deliverable[]> => {
    const { data } = await apiClient.get<Deliverable[]>('/deliverables', {
      params: { projectManagerId },
    });
    return data;
  },
};
