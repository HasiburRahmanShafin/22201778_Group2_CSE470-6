import { useEffect, useState } from 'react';
import API from '../../services/api';
import { TrendingUp, TrendingDown, Minus, MapPin } from 'lucide-react';

const FloodMonitoring = () => {
  const [stations, setStations] = useState([]);
  const [affected, setAffected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationsRes, affectedRes] = await Promise.all([
          API.get('/disaster/river-stations'),
          API.get('/disaster/affected-upazilas')
        ]);
        setStations(stationsRes.data);
        setAffected(affectedRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load flood data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getTrendIcon = (trend) => {
    if (trend === 'rising') return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (trend === 'falling') return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getStatusColor = (level, danger) => {
    if (level > danger) return 'bg-red-100 border-red-500';
    if (level > danger - 0.5) return 'bg-orange-100 border-orange-500';
    return 'bg-green-100 border-green-500';
  };

  if (loading) return <div className="p-8 text-center">Loading flood monitoring data...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Flood Monitoring Dashboard</h1>
      
      {/* Affected Areas Alert */}
      {affected.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="font-semibold">⚠️ Affected Upazilas:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {affected.map(upa => <span key={upa} className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">{upa}</span>)}
          </div>
        </div>
      )}

      {/* River Stations Grid */}
      <h2 className="text-xl font-semibold mb-4">River Monitoring Stations</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map(station => (
          <div key={station.stationId} className={`border-l-4 rounded-lg p-4 shadow-sm ${getStatusColor(station.currentLevel, station.dangerLevel)}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{station.name}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1"><MapPin className="w-3 h-3"/>{station.upazila}</p>
              </div>
              {getTrendIcon(station.trend)}
            </div>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Current Level: <strong>{station.currentLevel}m</strong></span>
                <span>Danger Level: {station.dangerLevel}m</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, (station.currentLevel / station.dangerLevel) * 100)}%` }}></div>
              </div>
              <div className="text-xs text-gray-500">Upstream Rain: {station.upstreamRainfall} mm (24h)</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloodMonitoring;