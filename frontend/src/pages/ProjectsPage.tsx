import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import { Button, Card, SearchInput, Table, StatusBadge, Modal, Input, Select, DatePicker, PageLoader, Avatar } from '../components/ui';
import { useProjects, useCreateProject, useProjectManagers } from '../hooks';
import type { Project, CreateProjectInput, ProjectStatus } from '../types';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On Hold' },
];

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateProjectInput>({
    name: '',
    description: '',
    status: 'active',
    startDate: '',
    endDate: '',
    projectManagerId: '',
  });

  const { data: projects = [], isLoading } = useProjects();
  const { data: projectManagers = [] } = useProjectManagers();
  const createProject = useCreateProject();

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    const query = searchQuery.toLowerCase();
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.status.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject.mutateAsync({
        ...formData,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
      });
      setIsModalOpen(false);
      setFormData({
        name: '',
        description: '',
        status: 'active',
        startDate: '',
        endDate: '',
        projectManagerId: '',
      });
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const columns = [
    { key: 'name', header: 'Project Name', sortable: true },
    {
      key: 'projectManager',
      header: 'Owner',
      render: (project: Project) =>
        project.projectManager ? (
          <Avatar
            firstName={project.projectManager.firstName}
            lastName={project.projectManager.lastName}
            size="sm"
          />
        ) : '-',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (project: Project) => <StatusBadge status={project.status} type="project" />,
    },
    {
      key: 'startDate',
      header: 'Start Date',
      sortable: true,
      render: (project: Project) =>
        project.startDate ? new Date(project.startDate).toLocaleDateString() : '-',
    },
    {
      key: 'endDate',
      header: 'End Date',
      sortable: true,
      render: (project: Project) =>
        project.endDate ? new Date(project.endDate).toLocaleDateString() : '-',
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (project: Project) => new Date(project.createdAt).toLocaleDateString(),
    },
  ];

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div>
      <Header
        title="Projects"
        subtitle={`${projects.length} projects total`}
        action={
          <Button onClick={() => setIsModalOpen(true)}>Add Project</Button>
        }
      />

      <div className="p-8">
        <Card>
          <div className="mb-6">
            <SearchInput
              placeholder="Search projects by name, description, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
            />
          </div>

          <Table
            columns={columns}
            data={filteredProjects}
            keyExtractor={(project) => project.id}
            onRowClick={(project) => navigate(`/projects/${project.id}`)}
            emptyMessage={searchQuery ? 'No projects found matching your search' : 'No projects yet. Create your first project!'}
          />
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Project"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Project Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Enter project name"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-sm border"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter project description"
            />
          </div>

          <Select
            label="Project Owner"
            options={projectManagers.map((pm) => ({
              value: pm.id,
              label: `${pm.firstName} ${pm.lastName}`,
            }))}
            value={formData.projectManagerId}
            onChange={(e) => setFormData({ ...formData, projectManagerId: e.target.value })}
            placeholder="Select project owner"
            required
          />

          <Select
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
          />

          <div className="grid grid-cols-2 gap-4">
            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <DatePicker
              label="End Date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={createProject.isPending}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
