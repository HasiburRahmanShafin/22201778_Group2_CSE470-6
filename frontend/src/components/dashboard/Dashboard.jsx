import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Cloud, MapPin, TrendingUp } from 'lucide-react';
import API from '../../services/api';
import RiskMap from '../map/RiskMap';
import DisasterHistory from './DisasterHistory';
import AlertFeed from './AlertFeed';
// Import new Sprint 4 components
import FloodMonitoring from './FloodMonitoring';
import EarthquakeTracker from './EarthquakeTracker';
import FloodForecast from './FloodForecast';
import MultiDisasterTimeline from './MultiDisasterTimeline';

const Dashboard = () => {
  // Mock stats (can be replaced with real counts later)
  const stats = [
    { label: 'Active Alerts', value: '3', icon: AlertTriangle, color: 'text-red-600' },
    { label: 'High Risk Areas', value: '8', icon: MapPin, color: 'text-orange-600' },
    { label: 'Open Shelters', value: '124', icon: Cloud, color: 'text-green-600' },
    { label: 'Recent Reports', value: '47', icon: TrendingUp, color: 'text-blue-600' },
  ];

  const [topRiskDistricts, setTopRiskDistricts] = useState([]);

  // Fetch top risky districts from backend
  useEffect(() => {
    const fetchRiskSummary = async () => {
      try {
        const res = await API.get('/locations/risk-summary');
        if (res.data && res.data.length) {
          setTopRiskDistricts(res.data.slice(0, 4));
        } else {
          // fallback mock data
          setTopRiskDistricts([
            { name: 'Dhaka', riskScore: 65 },
            { name: 'Sylhet', riskScore: 85 },
            { name: 'Chittagong', riskScore: 45 },
            { name: 'Rajshahi', riskScore: 32 },
          ]);
        }
      } catch (err) {
        console.error('Failed to load risk summary', err);
        // fallback
        setTopRiskDistricts([
          { name: 'Dhaka', riskScore: 65 },
          { name: 'Sylhet', riskScore: 85 },
          { name: 'Chittagong', riskScore: 45 },
          { name: 'Rajshahi', riskScore: 32 },
        ]);
      }
    };
    fetchRiskSummary();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Real-time disaster monitoring and early warning alerts</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Risk Map Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Risk Map (Districts)</h2>
        <RiskMap />
      </div>

      {/* Alert Feed (real-time) */}
      <div className="mb-8">
        <AlertFeed />
        <div className="text-right mt-2">
          <Link to="/alerts" className="text-sm text-blue-600 hover:underline">View full history →</Link>
        </div>
      </div>

      {/* Two Columns: Risk Summary + Disaster History */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Left: Risk Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Top Risk Districts</h2>
          <div className="space-y-3">
            {topRiskDistricts.map((district) => (
              <div key={district.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{district.name}</span>
                  <span>{district.riskScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${district.riskScore >= 70 ? 'bg-red-500' : district.riskScore >= 40 ? 'bg-orange-500' : 'bg-green-500'}`}
                    style={{ width: `${district.riskScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Disaster History */}
        <DisasterHistory />
      </div>

      {/* ========== SPRINT 4 – DISASTER MONITORING MODULES ========== */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Disaster Monitoring Modules</h2>

        {/* Flood Monitoring Dashboard */}
        <div className="mb-10">
          <FloodMonitoring />
        </div>

        {/* Two columns: Earthquake Tracker + (Forecast & Timeline) */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Earthquake Tracker (includes aftershocks) */}
          <div>
            <EarthquakeTracker />
          </div>

          {/* Right: Flood Forecast + Multi‑Disaster Timeline */}
          <div className="space-y-8">
            <FloodForecast />
            <MultiDisasterTimeline />
          </div>
        </div>
      </div>

      {/* Quick Actions (optional) */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Find Nearest Shelter</button>
        <button className="p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Submit a Report</button>
        <button className="p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">View Flood Map</button>
      </div>
    </div>
  );
};

export default Dashboard;