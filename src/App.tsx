import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import LoginPage from './pages/LoginPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeMonitoring from './pages/EmployeeMonitoring';
import WorkUploadPage from './pages/WorkUploadPage';
import AttendanceHistoryPage from './pages/AttendanceHistoryPage';
import SessionHistoryPage from './pages/SessionHistoryPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import EmployeeDetailView from './pages/EmployeeDetailView';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Employee Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['Employee']}>
              <Layout><EmployeeDashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/attendance" element={
            <ProtectedRoute allowedRoles={['Employee']}>
              <Layout><AttendanceHistoryPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/sessions" element={
            <ProtectedRoute allowedRoles={['Employee']}>
              <Layout><SessionHistoryPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute allowedRoles={['Employee']}>
              <Layout><WorkUploadPage /></Layout>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['CTO']}>
              <Layout><AdminDashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/monitoring" element={
            <ProtectedRoute allowedRoles={['CTO']}>
              <Layout><EmployeeMonitoring /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/employees/:id" element={
            <ProtectedRoute allowedRoles={['CTO']}>
              <Layout><EmployeeDetailView /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={['CTO']}>
              <Layout><ReportsPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRoles={['CTO']}>
              <Layout><SettingsPage /></Layout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
