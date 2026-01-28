import React, { useState } from 'react';
import { Header } from '../components/layout';
import {
  Button,
  Card,
  Table,
  StatusBadge,
  Modal,
  Input,
  PageLoader,
} from '../components/ui';
import {
  useProjectManagers,
  useCreateProjectManager,
  useProjectManagerDeliverables,
} from '../hooks';
import type { ProjectManager, CreateProjectManagerInput, Deliverable } from '../types';

export const ProjectManagersPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPM, setSelectedPM] = useState<ProjectManager | null>(null);
  const [formData, setFormData] = useState<CreateProjectManagerInput>({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
  });

  const { data: projectManagers = [], isLoading } = useProjectManagers();
  const createProjectManager = useCreateProjectManager();
  const { data: pmDeliverables = [], isLoading: deliverablesLoading } = useProjectManagerDeliverables(
    selectedPM?.id || ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProjectManager.mutateAsync({
        ...formData,
        department: formData.department || undefined,
      });
      setIsAddModalOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
      });
    } catch (error) {
      console.error('Failed to create project manager:', error);
    }
  };

  const pmColumns = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (pm: ProjectManager) => `${pm.firstName} ${pm.lastName}`,
    },
    { key: 'email', header: 'Email', sortable: true },
    {
      key: 'department',
      header: 'Department',
      render: (pm: ProjectManager) => pm.department || '-',
    },
    {
      key: 'createdAt',
      header: 'Added',
      sortable: true,
      render: (pm: ProjectManager) => new Date(pm.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: '',
      render: (pm: ProjectManager) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPM(pm);
          }}
        >
          View Deliverables
        </Button>
      ),
    },
  ];

  const deliverableColumns = [
    { key: 'name', header: 'Deliverable', sortable: true },
    {
      key: 'project',
      header: 'Project',
      render: (d: Deliverable) => d.project?.name || '-',
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
  ];

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div>
      <Header
        title="Project Managers"
        subtitle={`${projectManagers.length} project managers total`}
        action={<Button onClick={() => setIsAddModalOpen(true)}>Add Project Manager</Button>}
      />

      <div className="p-8">
        <Card>
          <Table
            columns={pmColumns}
            data={projectManagers}
            keyExtractor={(pm) => pm.id}
            emptyMessage="No project managers yet. Add your first one!"
          />
        </Card>
      </div>

      {/* Add Project Manager Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Project Manager"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              placeholder="John"
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              placeholder="Doe"
            />
          </div>

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="john.doe@company.com"
          />

          <Input
            label="Department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="Engineering (optional)"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createProjectManager.isPending}>
              Add Project Manager
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Deliverables Modal */}
      <Modal
        isOpen={!!selectedPM}
        onClose={() => setSelectedPM(null)}
        title={selectedPM ? `Deliverables for ${selectedPM.firstName} ${selectedPM.lastName}` : ''}
        size="lg"
      >
        {deliverablesLoading ? (
          <PageLoader />
        ) : (
          <Table
            columns={deliverableColumns}
            data={pmDeliverables}
            keyExtractor={(d) => d.id}
            emptyMessage="No deliverables assigned to this project manager"
          />
        )}
        <div className="flex justify-end pt-4">
          <Button variant="secondary" onClick={() => setSelectedPM(null)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};
