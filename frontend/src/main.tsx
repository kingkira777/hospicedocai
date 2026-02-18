import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import PatientsPage from './pages/patients/index';
import HomeClientPage from './pages/home';

import DocumentsPage from './pages/documents';
import ADRPage from './pages/analysis/adr';
import MedicalNotesAnalysisApp from './pages/analysis/notes';

//Analysis
import RiskAnalysisApp from './pages/analysis/risk';



import UserPage from './pages/users';

import SignIn from './pages/auth/signIn';
import SignUp from './pages/auth/signUp';


import { ProtectedRoute } from './components/ProtectedRoute';


const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '',
            Component: () => (
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            ),
          }
        ],
      },
      {
        path: 'patients',
        Component: Layout,
        children: [
          {
            path: '',
            Component: () => (
              <ProtectedRoute allowedRoles={['admin', 'user']}>
                <PatientsPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'documents',
        Component: Layout,
        children: [
          {
            path: '',
            Component: () => (
              <ProtectedRoute allowedRoles={['admin', 'user']}>
                <DocumentsPage />
              </ProtectedRoute>
            ),
          }
        ],
      },
      {
        path: 'analysis',
        Component: Layout,
        children: [
          {
            path: 'risk',
            Component: () => (
              <ProtectedRoute allowedRoles={['admin', 'user']}>
                <RiskAnalysisApp />
              </ProtectedRoute>
            ),
          },
          {
            path: 'notes',
            Component: () => (
              <ProtectedRoute allowedRoles={['admin', 'user']}>
                <MedicalNotesAnalysisApp />
              </ProtectedRoute>
            ),
          },
          {
            path: 'adr',
            Component: () => (
              <ProtectedRoute allowedRoles={['admin', 'user']}>
                <ADRPage />
              </ProtectedRoute>
            ),
          }
        ],
      },
      {
        path: 'users',
        Component: Layout,
        children: [
          {
            path: '',
            Component: () => (
              <ProtectedRoute allowedRoles={['admin']}>
                <UserPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: '/sign-in',
        Component: SignIn,
      },
      {
        path: '/sign-up',
        Component: SignUp,
      },
      {
        path: '/home',
        Component: HomeClientPage,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);