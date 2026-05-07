import { useEffect, useState } from 'react';
import API from '../../services/api';
import AftershockList from './AftershockList';
import { Loader } from 'lucide-react';

// Fallback mock data if backend fails
const FALLBACK_EARTHQUAKES = [
  { magnitude: 5.2, depth: 35, place: "45km NE of Cox's Bazar", time: new Date().toISOString(), source: 'usgs' },
  { magnitude: 4.8, depth: 20, place: "30km S of Sylhet", time: new Date(Date.now() - 2*24*60*60*1000).toISOString(), source: 'usgs' },
  { magnitude: 6.2, depth: 50, place: "Chittagong region", time: new Date(Date.now() - 30*24*60*60*1000).toISOString(), source: 'db', title: "Magnitude 6.2 Earthquake - Chittagong" }
];

const EarthquakeTracker = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usgsRes, majorRes] = await Promise.all([
          API.get('/disaster/earthquakes/recent'),
          API.get('/disaster/earthquakes/major')
        ]);
        let usgs = (usgsRes.data || []).map(q => ({ ...q, source: 'usgs' }));
        let major = (majorRes.data || []).map(q => ({
          ...q,
          source: 'db',
          magnitude: parseFloat(q.title?.match(/\d+(?:\.\d+)?/)?.[0] || 5)
        }));
        let combined = [...usgs, ...major];
        if (combined.length === 0) {
          console.log('No data from backend – using fallback mock');
          combined = FALLBACK_EARTHQUAKES;
        }
        combined.sort((a,b) => new Date(b.time || b.timestamp) - new Date(a.time || a.timestamp));
        setEarthquakes(combined);
      } catch (err) {
        console.error('Error fetching earthquakes – using fallback mock', err);
        setEarthquakes(FALLBACK_EARTHQUAKES);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="bg-white rounded-xl p-8 text-center"><Loader className="animate-spin inline-block mr-2" /> Loading earthquakes...</div>;
  }

  if (earthquakes.length === 0) {
    return <div className="bg-white rounded-xl p-8 text-center text-gray-500">No recent earthquakes detected.</div>;
  }

  const getImpactRadius = (mag) => {
    if (mag >= 6) return 'severe (100km+)';
    if (mag >= 5) return 'moderate (50-100km)';
    return 'light (<50km)';
  };

  const getMagnitudeClass = (mag) => {
    if (mag >= 6) return 'text-red-600';
    if (mag >= 5) return 'text-orange-600';
    return 'text-yellow-600';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Earthquake Event Tracker</h2>
      <div className="space-y-4">
        {earthquakes.map((eq, idx) => (
          <div key={idx} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${getMagnitudeClass(eq.magnitude)}`}>{eq.magnitude}</span>
                  <span className="text-xs text-gray-500">{eq.source === 'usgs' ? 'Real time' : 'Historical'}</span>
                </div>
                <p className="text-gray-600 mt-1">{eq.place || eq.title}</p>
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                  <div>Depth: {eq.depth || 'N/A'} km</div>
                  <div>Impact: {getImpactRadius(eq.magnitude)}</div>
                  <div>Time: {new Date(eq.time || eq.timestamp).toLocaleString()}</div>
                </div>
              </div>
            </div>
            {eq.source === 'db' && eq._id && <AftershockList eventId={eq._id} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EarthquakeTracker;