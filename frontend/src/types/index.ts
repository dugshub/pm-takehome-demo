export type ProjectStatus = 'active' | 'completed' | 'on_hold';
export type DeliverableStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  deliverables?: Deliverable[];
}

export interface ProjectManager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deliverable {
  id: string;
  name: string;
  description?: string;
  dueDate: string;
  status: DeliverableStatus;
  projectId: string;
  projectManagerId: string;
  project?: Project;
  projectManager?: ProjectManager;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {}

export interface CreateProjectManagerInput {
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
}

export interface UpdateProjectManagerInput extends Partial<CreateProjectManagerInput> {}

export interface CreateDeliverableInput {
  name: string;
  description?: string;
  dueDate: string;
  status?: DeliverableStatus;
  projectId: string;
  projectManagerId: string;
}

export interface UpdateDeliverableInput extends Partial<CreateDeliverableInput> {}
