import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import { useJobStore } from './stores/jobStore';
import { initializeMockData } from './utils/mockData';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Report } from './pages/Report';
import { DashboardWorker } from './pages/DashboardWorker';
import { DashboardSeniorWorker } from './pages/DashboardSeniorWorker';
import { DashboardSupervisor } from './pages/DashboardSupervisor';
import { DashboardManager } from './pages/DashboardManager';
import { Jobs } from './pages/Jobs';
import { Profile } from './pages/Profile';

function App() {
  const { initAuth } = useAuthStore();
  const { loadJobs } = useJobStore();

  useEffect(() => {
    // Initialize mock data and auth
    initializeMockData();
    initAuth();
    loadJobs();
  }, [initAuth, loadJobs]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes without layout */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Public routes with layout */}
        <Route path="/report" element={<Layout><Report /></Layout>} />
        
        {/* Protected routes with layout */}
        <Route
          path="/dashboard/worker"
          element={
            <ProtectedRoute allowedRoles={['worker']}>
              <Layout><DashboardWorker /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/senior-worker"
          element={
            <ProtectedRoute allowedRoles={['senior-worker']}>
              <Layout><DashboardSeniorWorker /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/supervisor"
          element={
            <ProtectedRoute allowedRoles={['supervisor']}>
              <Layout><DashboardSupervisor /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manager"
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <Layout><DashboardManager /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute allowedRoles={['worker', 'senior-worker']}>
              <Layout><Jobs /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
