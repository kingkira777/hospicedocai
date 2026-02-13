import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import PatientsPage from './pages/patients/index';

import CasesPage from './pages/cases';
import DocumentsPage from './pages/documents';
import ADRPage from './pages/adr';
import MedicalNotesAnalysisApp from './pages/notes';

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
          },
          {
            path: 'notes',
            Component: () => (
              <ProtectedRoute allowedRoles={['admin', 'user']}>
                <MedicalNotesAnalysisApp />
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
        'path': 'adr',
        'Component': Layout,
        'children': [
          {
            'path': '',
            'Component': () => (
              <ProtectedRoute allowedRoles={['admin', 'user']}>
                <ADRPage />
              </ProtectedRoute>
            ),
          }
        ]
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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);