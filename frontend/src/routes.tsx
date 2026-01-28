import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout';
import {
  DashboardPage,
  ProjectsPage,
  ProjectDetailPage,
  DeliverablesPage,
  ProjectManagersPage,
} from './pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'projects',
        element: <ProjectsPage />,
      },
      {
        path: 'projects/:id',
        element: <ProjectDetailPage />,
      },
      {
        path: 'deliverables',
        element: <DeliverablesPage />,
      },
      {
        path: 'project-managers',
        element: <ProjectManagersPage />,
      },
    ],
  },
]);
