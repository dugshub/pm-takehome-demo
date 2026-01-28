import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectManagersApi } from '../api/project-managers';
import type { CreateProjectManagerInput, UpdateProjectManagerInput } from '../types';

export const useProjectManagers = () => {
  return useQuery({
    queryKey: ['projectManagers'],
    queryFn: () => projectManagersApi.getAll(),
  });
};

export const useProjectManager = (id: string) => {
  return useQuery({
    queryKey: ['projectManagers', id],
    queryFn: () => projectManagersApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateProjectManager = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProjectManagerInput) => projectManagersApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectManagers'] });
    },
  });
};

export const useUpdateProjectManager = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProjectManagerInput }) =>
      projectManagersApi.update(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projectManagers'] });
      queryClient.invalidateQueries({ queryKey: ['projectManagers', id] });
    },
  });
};

export const useDeleteProjectManager = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectManagersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectManagers'] });
    },
  });
};
