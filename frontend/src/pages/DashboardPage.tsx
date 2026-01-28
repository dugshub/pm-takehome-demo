import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import { Card, SearchInput, Table, StatusBadge, PageLoader, Avatar } from '../components/ui';
import { useProjects, useDeliverables, useUpcomingDeliverables } from '../hooks';
import type { Project, Deliverable } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: allDeliverables = [], isLoading: deliverablesLoading } = useDeliverables();
  const { data: upcomingDeliverables = [], isLoading: upcomingLoading } = useUpcomingDeliverables(30);

  const isLoading = projectsLoading || deliverablesLoading || upcomingLoading;

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    const query = searchQuery.toLowerCase();
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  const overdueDeliverables = useMemo(() => {
    return allDeliverables.filter((d) => d.status === 'overdue');
  }, [allDeliverables]);

  const stats = useMemo(() => {
    return {
      totalProjects: projects.length,
      totalDeliverables: allDeliverables.length,
      overdueCount: overdueDeliverables.length,
    };
  }, [projects, allDeliverables, overdueDeliverables]);

  const projectColumns = [
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
      render: (project: Project) => <StatusBadge status={project.status} type="project" />,
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
      <Header title="Dashboard" subtitle="Overview of your projects and deliverables" />

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="!py-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
              <p className="text-sm text-gray-500 mt-1">Total Projects</p>
            </div>
          </Card>
          <Card className="!py-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.totalDeliverables}</p>
              <p className="text-sm text-gray-500 mt-1">Total Deliverables</p>
            </div>
          </Card>
          <Card className="!py-6">
            <div className="text-center">
              <p className={`text-3xl font-bold ${stats.overdueCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {stats.overdueCount}
              </p>
              <p className="text-sm text-gray-500 mt-1">Overdue Deliverables</p>
            </div>
          </Card>
        </div>

        {/* Search Projects */}
        <Card title="Search Projects" className="mb-8">
          <div className="mb-4">
            <SearchInput
              placeholder="Search projects by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
            />
          </div>
          <Table
            columns={projectColumns}
            data={filteredProjects.slice(0, 5)}
            keyExtractor={(project) => project.id}
            onRowClick={(project) => navigate(`/projects/${project.id}`)}
            emptyMessage={searchQuery ? 'No projects found' : 'No projects yet'}
          />
          {filteredProjects.length > 5 && (
            <p className="mt-4 text-sm text-gray-500 text-center">
              Showing 5 of {filteredProjects.length} projects.{' '}
              <button
                onClick={() => navigate('/projects')}
                className="text-blue-600 hover:text-blue-800"
              >
                View all
              </button>
            </p>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Deliverables */}
          <Card title="Upcoming Deliverables (Next 30 Days)">
            <Table
              columns={deliverableColumns}
              data={upcomingDeliverables.slice(0, 5)}
              keyExtractor={(d) => d.id}
              onRowClick={() => navigate(`/deliverables`)}
              emptyMessage="No upcoming deliverables"
            />
            {upcomingDeliverables.length > 5 && (
              <p className="mt-4 text-sm text-gray-500 text-center">
                Showing 5 of {upcomingDeliverables.length} deliverables.{' '}
                <button
                  onClick={() => navigate('/deliverables')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View all
                </button>
              </p>
            )}
          </Card>

          {/* Overdue Deliverables */}
          <Card title="Overdue Deliverables">
            <div className={overdueDeliverables.length > 0 ? 'bg-red-50 -mx-6 -my-4 px-6 py-4 rounded-b-lg' : ''}>
              <Table
                columns={deliverableColumns}
                data={overdueDeliverables.slice(0, 5)}
                keyExtractor={(d) => d.id}
                onRowClick={() => navigate(`/deliverables`)}
                emptyMessage="No overdue deliverables"
              />
              {overdueDeliverables.length > 5 && (
                <p className="mt-4 text-sm text-red-700 text-center">
                  Showing 5 of {overdueDeliverables.length} overdue deliverables.{' '}
                  <button
                    onClick={() => navigate('/deliverables')}
                    className="text-red-800 hover:text-red-900 underline"
                  >
                    View all
                  </button>
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
