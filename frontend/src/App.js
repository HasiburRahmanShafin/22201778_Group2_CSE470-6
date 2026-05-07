import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import FloodMonitoring from './components/dashboard/FloodMonitoring';
import EarthquakeTracker from './components/dashboard/EarthquakeTracker';
import Shelters from './components/dashboard/Shelters';
import Reports from './components/dashboard/Reports';
import DisasterHistory from './components/dashboard/DisasterHistory';
import ResourceDemand from './components/dashboard/ResourceDemand';
import Profile from './components/profile/Profile';
import AlertHistory from './components/dashboard/AlertHistory';   // <-- import AlertHistory
import AlertHistoryPage from './pages/AlertHistoryPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="flood-monitoring" element={<ProtectedRoute><FloodMonitoring /></ProtectedRoute>} />
            <Route path="earthquake-tracker" element={<ProtectedRoute><EarthquakeTracker /></ProtectedRoute>} />
            <Route path="shelters" element={<ProtectedRoute><Shelters /></ProtectedRoute>} />
            <Route path="reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="disaster-history" element={<ProtectedRoute><DisasterHistory /></ProtectedRoute>} />
            <Route path="resource-demand" element={<ProtectedRoute><ResourceDemand /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="alerts" element={<ProtectedRoute><AlertHistory /></ProtectedRoute>} />   {/* new route */}
            <Route path="/alerts" element={<ProtectedRoute><AlertHistoryPage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;