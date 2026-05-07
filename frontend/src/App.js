import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

// Citizen pages
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile';
import Shelters from './components/dashboard/Shelters';
import Reports from './components/dashboard/Reports';
import DisasterHistory from './components/dashboard/DisasterHistory';
import ResourceDemand from './components/dashboard/ResourceDemand';
import DisasterModulesPage from './pages/DisasterModulesPage';
import AlertHistoryPage from './pages/AlertHistoryPage';
import SubmitReport from './components/community/SubmitReport';

// Admin pages
import AdminReports from './components/admin/AdminReports';
import AdminShelters from './components/admin/AdminShelters';
import AdminResources from './components/admin/AdminResources';

import NotFound from './components/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Protected citizen routes */}
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="shelters" element={<ProtectedRoute><Shelters /></ProtectedRoute>} />
            <Route path="reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="disaster-history" element={<ProtectedRoute><DisasterHistory /></ProtectedRoute>} />
            <Route path="resource-demand" element={<ProtectedRoute><ResourceDemand /></ProtectedRoute>} />
            <Route path="disasters" element={<ProtectedRoute><DisasterModulesPage /></ProtectedRoute>} />
            <Route path="alerts" element={<ProtectedRoute><AlertHistoryPage /></ProtectedRoute>} />
            <Route path="submit-report" element={<ProtectedRoute><SubmitReport /></ProtectedRoute>} />

            {/* Admin routes – require admin role */}
            <Route path="admin/reports" element={<ProtectedRoute requiredRole="admin"><AdminReports /></ProtectedRoute>} />
            <Route path="admin/shelters" element={<ProtectedRoute requiredRole="admin"><AdminShelters /></ProtectedRoute>} />
            <Route path="admin/resources" element={<ProtectedRoute requiredRole="admin"><AdminResources /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;