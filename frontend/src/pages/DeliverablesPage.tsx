import React, { useState, useMemo } from 'react';
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
  useDeliverables,
  useCreateDeliverable,
  useProjects,
  useProjectManagers,
} from '../hooks';
import type { Deliverable, CreateDeliverableInput, DeliverableStatus } from '../types';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
];

const statusOptionsForm = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
];

export const DeliverablesPage: React.FC = () => {
  const [filters, setFilters] = useState({
    projectId: '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateDeliverableInput>({
    name: '',
    description: '',
    dueDate: '',
    status: 'pending',
    projectId: '',
    projectManagerId: '',
  });

  const { data: deliverables = [], isLoading: deliverablesLoading } = useDeliverables(
    Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
  );
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: projectManagers = [], isLoading: pmsLoading } = useProjectManagers();

  const createDeliverable = useCreateDeliverable();

  const isLoading = deliverablesLoading || projectsLoading || pmsLoading;

  const filteredDeliverables = useMemo(() => {
    return deliverables.filter((d) => {
      if (filters.startDate && new Date(d.dueDate) < new Date(filters.startDate)) {
        return false;
      }
      if (filters.endDate && new Date(d.dueDate) > new Date(filters.endDate)) {
        return false;
      }
      return true;
    });
  }, [deliverables, filters.startDate, filters.endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDeliverable.mutateAsync(formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        description: '',
        dueDate: '',
        status: 'pending',
        projectId: '',
        projectManagerId: '',
      });
    } catch (error) {
      console.error('Failed to create deliverable:', error);
    }
  };

  const columns = [
    { key: 'name', header: 'Name', sortable: true },
    {
      key: 'project',
      header: 'Project',
      render: (d: Deliverable) => d.project?.name || '-',
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
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (d: Deliverable) => new Date(d.createdAt).toLocaleDateString(),
    },
  ];

  const projectOptions = [
    { value: '', label: 'All Projects' },
    ...projects.map((p) => ({ value: p.id, label: p.name })),
  ];

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div>
      <Header
        title="Deliverables"
        subtitle={`${filteredDeliverables.length} deliverables total`}
        action={<Button onClick={() => setIsModalOpen(true)}>Add Deliverable</Button>}
      />

      <div className="p-8">
        <Card>
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Project"
              options={projectOptions}
              value={filters.projectId}
              onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
            />
            <Select
              label="Status"
              options={statusOptions}
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            />
            <DatePicker
              label="From Date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
            <DatePicker
              label="To Date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>

          {(filters.projectId || filters.status || filters.startDate || filters.endDate) && (
            <div className="mb-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFilters({ projectId: '', status: '', startDate: '', endDate: '' })}
              >
                Clear Filters
              </Button>
            </div>
          )}

          <Table
            columns={columns}
            data={filteredDeliverables}
            keyExtractor={(d) => d.id}
            emptyMessage="No deliverables found. Create your first deliverable!"
          />
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Deliverable"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Deliverable Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Enter deliverable name"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-sm border"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter deliverable description"
            />
          </div>

          <Select
            label="Project"
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            placeholder="Select a project"
            required
          />

          <Select
            label="Project Manager"
            options={projectManagers.map((pm) => ({
              value: pm.id,
              label: `${pm.firstName} ${pm.lastName}`,
            }))}
            value={formData.projectManagerId}
            onChange={(e) => setFormData({ ...formData, projectManagerId: e.target.value })}
            placeholder="Select a project manager"
            required
          />

          <DatePicker
            label="Due Date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />

          <Select
            label="Status"
            options={statusOptionsForm}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as DeliverableStatus })}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createDeliverable.isPending}>
              Create Deliverable
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
