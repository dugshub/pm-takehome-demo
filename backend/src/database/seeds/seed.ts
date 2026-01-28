import { DataSource } from 'typeorm';
import { Project, ProjectStatus } from '../../modules/projects/project.entity';
import { ProjectManager } from '../../modules/project-managers/project-manager.entity';
import {
  Deliverable,
  DeliverableStatus,
} from '../../modules/deliverables/deliverable.entity';

const dataSource = new DataSource({
  type: 'sqlite',
  database: 'data/database.sqlite',
  entities: [Project, ProjectManager, Deliverable],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();
  console.log('Database connection established');

  const projectRepo = dataSource.getRepository(Project);
  const pmRepo = dataSource.getRepository(ProjectManager);
  const deliverableRepo = dataSource.getRepository(Deliverable);

  // Clear existing data using query builder
  await deliverableRepo.createQueryBuilder().delete().execute();
  await projectRepo.createQueryBuilder().delete().execute();
  await pmRepo.createQueryBuilder().delete().execute();

  // Create Project Managers
  const projectManagers = await pmRepo.save([
    {
      firstName: 'Sarah',
      lastName: 'Chen',
      email: 'sarah.chen@aiig.ca',
      department: 'Infrastructure',
    },
    {
      firstName: 'Michael',
      lastName: 'Thompson',
      email: 'michael.thompson@aiig.ca',
      department: 'Engineering',
    },
    {
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@aiig.ca',
      department: 'Planning',
    },
    {
      firstName: 'David',
      lastName: 'Kim',
      email: 'david.kim@aiig.ca',
      department: 'Construction',
    },
    {
      firstName: 'Jennifer',
      lastName: 'Patel',
      email: 'jennifer.patel@aiig.ca',
      department: 'Operations',
    },
  ]);

  console.log(`Created ${projectManagers.length} project managers`);

  // Create Projects
  const projects = await projectRepo.save([
    {
      name: 'Toronto General Hospital Expansion',
      description:
        'Major expansion of the Toronto General Hospital including new patient wing and upgraded emergency facilities',
      status: ProjectStatus.ACTIVE,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2026-06-30'),
    },
    {
      name: 'Vancouver Lions Gate Bridge Retrofit',
      description:
        'Seismic retrofit and structural upgrades to the Lions Gate Bridge',
      status: ProjectStatus.ACTIVE,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2025-12-15'),
    },
    {
      name: 'Calgary Transit LRT Extension',
      description:
        'Extension of the Green Line LRT system to serve southeast Calgary communities',
      status: ProjectStatus.ACTIVE,
      startDate: new Date('2023-09-01'),
      endDate: new Date('2027-03-31'),
    },
    {
      name: 'Montreal Water Treatment Facility',
      description:
        'Construction of a new state-of-the-art water treatment facility for the greater Montreal area',
      status: ProjectStatus.ON_HOLD,
      startDate: new Date('2024-06-01'),
      endDate: new Date('2026-12-31'),
    },
    {
      name: 'Ottawa Parliament Restoration',
      description:
        'Heritage restoration and modernization of Parliament building infrastructure',
      status: ProjectStatus.COMPLETED,
      startDate: new Date('2022-01-01'),
      endDate: new Date('2024-11-30'),
    },
  ]);

  console.log(`Created ${projects.length} projects`);

  // Helper to get dates relative to today
  const addDays = (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };

  // Create Deliverables
  const deliverables = await deliverableRepo.save([
    // Toronto Hospital deliverables
    {
      name: 'Foundation Engineering Report',
      description: 'Complete geotechnical analysis and foundation design report',
      dueDate: addDays(-15),
      status: DeliverableStatus.COMPLETED,
      projectId: projects[0].id,
      projectManagerId: projectManagers[0].id,
    },
    {
      name: 'Patient Wing Architectural Plans',
      description: 'Final architectural drawings for the new patient wing',
      dueDate: addDays(7),
      status: DeliverableStatus.IN_PROGRESS,
      projectId: projects[0].id,
      projectManagerId: projectManagers[0].id,
    },
    {
      name: 'HVAC System Design',
      description: 'Medical-grade HVAC system specifications and design',
      dueDate: addDays(21),
      status: DeliverableStatus.PENDING,
      projectId: projects[0].id,
      projectManagerId: projectManagers[1].id,
    },
    {
      name: 'Emergency Room Layout Approval',
      description: 'Final approval for emergency room floor plan and equipment layout',
      dueDate: addDays(-5),
      status: DeliverableStatus.OVERDUE,
      projectId: projects[0].id,
      projectManagerId: projectManagers[0].id,
    },

    // Vancouver Bridge deliverables
    {
      name: 'Seismic Assessment Report',
      description: 'Comprehensive seismic vulnerability assessment',
      dueDate: addDays(-30),
      status: DeliverableStatus.COMPLETED,
      projectId: projects[1].id,
      projectManagerId: projectManagers[1].id,
    },
    {
      name: 'Steel Reinforcement Specifications',
      description: 'Detailed specifications for structural steel reinforcement',
      dueDate: addDays(14),
      status: DeliverableStatus.IN_PROGRESS,
      projectId: projects[1].id,
      projectManagerId: projectManagers[1].id,
    },
    {
      name: 'Traffic Management Plan',
      description: 'Plan for managing traffic during construction phases',
      dueDate: addDays(28),
      status: DeliverableStatus.PENDING,
      projectId: projects[1].id,
      projectManagerId: projectManagers[2].id,
    },

    // Calgary LRT deliverables
    {
      name: 'Environmental Impact Study',
      description: 'Complete environmental assessment for the LRT corridor',
      dueDate: addDays(-45),
      status: DeliverableStatus.COMPLETED,
      projectId: projects[2].id,
      projectManagerId: projectManagers[2].id,
    },
    {
      name: 'Station Design Concepts',
      description: 'Architectural concepts for 6 new LRT stations',
      dueDate: addDays(10),
      status: DeliverableStatus.IN_PROGRESS,
      projectId: projects[2].id,
      projectManagerId: projectManagers[2].id,
    },
    {
      name: 'Land Acquisition Report',
      description: 'Status report on land acquisition for right-of-way',
      dueDate: addDays(-10),
      status: DeliverableStatus.OVERDUE,
      projectId: projects[2].id,
      projectManagerId: projectManagers[3].id,
    },
    {
      name: 'Track Alignment Final Survey',
      description: 'Final surveying and alignment for the track route',
      dueDate: addDays(45),
      status: DeliverableStatus.PENDING,
      projectId: projects[2].id,
      projectManagerId: projectManagers[3].id,
    },

    // Montreal Water Treatment deliverables
    {
      name: 'Preliminary Site Assessment',
      description: 'Initial site assessment and feasibility study',
      dueDate: addDays(-60),
      status: DeliverableStatus.COMPLETED,
      projectId: projects[3].id,
      projectManagerId: projectManagers[3].id,
    },
    {
      name: 'Filtration System Design',
      description: 'Design specifications for the primary filtration system',
      dueDate: addDays(60),
      status: DeliverableStatus.PENDING,
      projectId: projects[3].id,
      projectManagerId: projectManagers[4].id,
    },
    {
      name: 'Regulatory Compliance Documentation',
      description: 'Documentation for provincial environmental compliance',
      dueDate: addDays(35),
      status: DeliverableStatus.PENDING,
      projectId: projects[3].id,
      projectManagerId: projectManagers[4].id,
    },

    // Ottawa Parliament deliverables
    {
      name: 'Heritage Assessment Complete',
      description: 'Full heritage impact assessment and preservation plan',
      dueDate: addDays(-120),
      status: DeliverableStatus.COMPLETED,
      projectId: projects[4].id,
      projectManagerId: projectManagers[4].id,
    },
    {
      name: 'Electrical System Upgrade Plans',
      description: 'Modernized electrical system design documents',
      dueDate: addDays(-90),
      status: DeliverableStatus.COMPLETED,
      projectId: projects[4].id,
      projectManagerId: projectManagers[0].id,
    },
    {
      name: 'Final Inspection Report',
      description: 'Comprehensive final inspection and certification report',
      dueDate: addDays(-30),
      status: DeliverableStatus.COMPLETED,
      projectId: projects[4].id,
      projectManagerId: projectManagers[4].id,
    },
    {
      name: 'Project Closeout Documentation',
      description: 'Final project documentation and handover materials',
      dueDate: addDays(3),
      status: DeliverableStatus.IN_PROGRESS,
      projectId: projects[4].id,
      projectManagerId: projectManagers[4].id,
    },
  ]);

  console.log(`Created ${deliverables.length} deliverables`);

  await dataSource.destroy();
  console.log('Seed completed successfully!');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
