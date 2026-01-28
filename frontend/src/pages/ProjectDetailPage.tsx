import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import {
  Button,
  Card,
  Table,
  StatusBadge,
  Modal,
  Input,
  Select,
  DatePicker,
  PageLoader,
  Avatar,
} from '../components/ui';
import {
  useProject,
  useUpdateProject,
  useDeleteProject,
  useProjectDeliverables,
  useCreateDeliverable,
  useProjectManagers,
} from '../hooks';
import type { Project, CreateDeliverableInput, DeliverableStatus, ProjectStatus, Deliverable } from '../types';

const projectStatusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On Hold' },
];

const deliverableStatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
];

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading: projectLoading } = useProject(id!);
  const { data: deliverables = [], isLoading: deliverablesLoading } = useProjectDeliverables(id!);
  const { data: projectManagers = [] } = useProjectManagers();

  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const createDeliverable = useCreateDeliverable();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddDeliverableModalOpen, setIsAddDeliverableModalOpen] = useState(false);

  const [editFormData, setEditFormData] = useState<Partial<Project>>({});
  const [deliverableFormData, setDeliverableFormData] = useState<CreateDeliverableInput>({
    name: '',
    description: '',
    dueDate: '',
    status: 'pending',
    projectId: id!,
    projectManagerId: '',
  });

  const isLoading = projectLoading || deliverablesLoading;

  const handleEditOpen = () => {
    if (project) {
      setEditFormData({
        name: project.name,
        description: project.description || '',
        status: project.status,
        startDate: project.startDate?.split('T')[0] || '',
        endDate: project.endDate?.split('T')[0] || '',
      });
      setIsEditModalOpen(true);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await updateProject.mutateAsync({
        id,
        input: {
          ...editFormData,
          startDate: editFormData.startDate || undefined,
          endDate: editFormData.endDate || undefined,
        },
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteProject.mutateAsync(id);
      navigate('/projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleAddDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDeliverable.mutateAsync(deliverableFormData);
      setIsAddDeliverableModalOpen(false);
      setDeliverableFormData({
        name: '',
        description: '',
        dueDate: '',
        status: 'pending',
        projectId: id!,
        projectManagerId: '',
      });
    } catch (error) {
      console.error('Failed to create deliverable:', error);
    }
  };

  const deliverableColumns = [
    { key: 'name', header: 'Name', sortable: true },
    {
      key: 'description',
      header: 'Description',
      render: (d: Deliverable) =>
        d.description
          ? d.description.length > 40
            ? `${d.description.substring(0, 40)}...`
            : d.description
          : '-',
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      render: (d: Deliverable) => new Date(d.dueDate).toLocaleDateString(),
    },
    {
      key: 'status',
      header: 'Status',
      render: (d: Deliverable) => <StatusBadge status={d.status} />,
    },
    {
      key: 'projectManager',
      header: 'Project Manager',
      render: (d: Deliverable) =>
        d.projectManager ? (
          <Avatar
            firstName={d.projectManager.firstName}
            lastName={d.projectManager.lastName}
            size="sm"
          />
        ) : '-',
    },
  ];

  if (isLoading) {
    return <PageLoader />;
  }

  if (!project) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900">Project not found</h2>
        <Button onClick={() => navigate('/projects')} className="mt-4">
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Header
        title={project.name}
        subtitle={project.description || 'No description'}
        action={
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={handleEditOpen}>
              Edit Project
            </Button>
            <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
              Delete Project
            </Button>
          </div>
        }
      />

      <div className="p-8">
        {/* Project Details */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <div className="mt-1">
                <StatusBadge status={project.status} type="project" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Start Date</p>
              <p className="mt-1 text-sm text-gray-900">
                {project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">End Date</p>
              <p className="mt-1 text-sm text-gray-900">
                {project.endDate ? new Date(project.endDate).toLocaleDateString() : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created</p>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Deliverables */}
        <Card
          title={`Deliverables (${deliverables.length})`}
        >
          <div className="mb-4">
            <Button onClick={() => setIsAddDeliverableModalOpen(true)}>
              Add Deliverable
            </Button>
          </div>
          <Table
            columns={deliverableColumns}
            data={deliverables}
            keyExtractor={(d) => d.id}
            emptyMessage="No deliverables for this project yet"
          />
        </Card>
      </div>

      {/* Edit Project Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project"
        size="lg"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Project Name"
            value={editFormData.name || ''}
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-sm border"
              rows={3}
              value={editFormData.description || ''}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
            />
          </div>

          <Select
            label="Status"
            options={projectStatusOptions}
            value={editFormData.status || 'active'}
            onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as ProjectStatus })}
          />

          <div className="grid grid-cols-2 gap-4">
            <DatePicker
              label="Start Date"
              value={editFormData.startDate || ''}
              onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
            />
            <DatePicker
              label="End Date"
              value={editFormData.endDate || ''}
              onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={updateProject.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Project"
        size="sm"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{project.name}"? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={deleteProject.isPending}>
            Delete Project
          </Button>
        </div>
      </Modal>

      {/* Add Deliverable Modal */}
      <Modal
        isOpen={isAddDeliverableModalOpen}
        onClose={() => setIsAddDeliverableModalOpen(false)}
        title="Add Deliverable"
        size="lg"
      >
        <form onSubmit={handleAddDeliverable} className="space-y-4">
          <Input
            label="Deliverable Name"
            value={deliverableFormData.name}
            onChange={(e) => setDeliverableFormData({ ...deliverableFormData, name: e.target.value })}
            required
            placeholder="Enter deliverable name"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-sm border"
              rows={3}
              value={deliverableFormData.description}
              onChange={(e) =>
                setDeliverableFormData({ ...deliverableFormData, description: e.target.value })
              }
              placeholder="Enter deliverable description"
            />
          </div>

          <DatePicker
            label="Due Date"
            value={deliverableFormData.dueDate}
            onChange={(e) => setDeliverableFormData({ ...deliverableFormData, dueDate: e.target.value })}
            required
          />

          <Select
            label="Status"
            options={deliverableStatusOptions}
            value={deliverableFormData.status}
            onChange={(e) =>
              setDeliverableFormData({ ...deliverableFormData, status: e.target.value as DeliverableStatus })
            }
          />

          <Select
            label="Project Manager"
            options={projectManagers.map((pm) => ({
              value: pm.id,
              label: `${pm.firstName} ${pm.lastName}`,
            }))}
            value={deliverableFormData.projectManagerId}
            onChange={(e) =>
              setDeliverableFormData({ ...deliverableFormData, projectManagerId: e.target.value })
            }
            placeholder="Select a project manager"
            required
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddDeliverableModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={createDeliverable.isPending}>
              Add Deliverable
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
