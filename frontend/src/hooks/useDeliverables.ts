import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deliverablesApi, type DeliverableFilters } from '../api/deliverables';
import type { CreateDeliverableInput, UpdateDeliverableInput } from '../types';

export const useDeliverables = (filters?: DeliverableFilters) => {
  return useQuery({
    queryKey: ['deliverables', filters],
    queryFn: () => deliverablesApi.getAll(filters),
  });
};

export const useDeliverable = (id: string) => {
  return useQuery({
    queryKey: ['deliverables', id],
    queryFn: () => deliverablesApi.getById(id),
    enabled: !!id,
  });
};

export const useUpcomingDeliverables = (days: number = 30) => {
  return useQuery({
    queryKey: ['deliverables', 'upcoming', days],
    queryFn: () => deliverablesApi.getUpcoming(days),
  });
};

export const useOverdueDeliverables = () => {
  return useQuery({
    queryKey: ['deliverables', 'overdue'],
    queryFn: () => deliverablesApi.getOverdue(),
  });
};

export const useProjectDeliverables = (projectId: string) => {
  return useQuery({
    queryKey: ['deliverables', 'project', projectId],
    queryFn: () => deliverablesApi.getByProject(projectId),
    enabled: !!projectId,
  });
};

export const useProjectManagerDeliverables = (projectManagerId: string) => {
  return useQuery({
    queryKey: ['deliverables', 'projectManager', projectManagerId],
    queryFn: () => deliverablesApi.getByProjectManager(projectManagerId),
    enabled: !!projectManagerId,
  });
};

export const useCreateDeliverable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateDeliverableInput) => deliverablesApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliverables'] });
    },
  });
};

export const useUpdateDeliverable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDeliverableInput }) =>
      deliverablesApi.update(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['deliverables'] });
      queryClient.invalidateQueries({ queryKey: ['deliverables', id] });
    },
  });
};

export const useDeleteDeliverable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deliverablesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliverables'] });
    },
  });
};
