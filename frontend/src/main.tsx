import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import PatientsPage from './pages/patients/index';

import CasesPage from './pages/cases';
import DocumentsPage from './pages/documents';

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
        path: 'cases',
        Component: Layout,
        children: [
          {
            path: '',
            Component: () => (
              <ProtectedRoute allowedRoles={['admin', 'user']}>
                <CasesPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'documents',
            Component: () => (
              <ProtectedRoute allowedRoles={['admin', 'user']}>
                <DocumentsPage />
              </ProtectedRoute>
            ),
          }
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