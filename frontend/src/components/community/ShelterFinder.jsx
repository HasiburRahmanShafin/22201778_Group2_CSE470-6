import { useEffect, useState } from 'react';
import API from '../../services/api';
import { Navigation } from 'lucide-react';

const ShelterFinder = () => {
  const [shelters, setShelters] = useState([]);
  const [nearest, setNearest] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get all shelters
    API.get('/community/shelters').then(res => setShelters(res.data)).catch(console.error);
  }, []);

  const findNearest = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      setLoading(true);
      try {
        const res = await API.get(`/community/shelters/nearby?lng=${pos.coords.longitude}&lat=${pos.coords.latitude}`);
        setNearest(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Emergency Shelters</h2>
      <button onClick={findNearest} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"><Navigation className="w-4 h-4"/> Find Nearest Shelter</button>
      {loading && <p>Searching...</p>}
      {nearest.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Nearest Open Shelters</h3>
          <div className="grid md:grid-cols-2 gap-4 mt-2">
            {nearest.map(s => (
              <div key={s._id} className="border p-3 rounded shadow">
                <h4 className="font-bold">{s.name}</h4>
                <p className="text-sm">Distance: {(s.distance / 1000).toFixed(1)} km</p>
                <p>Capacity: {s.occupied}/{s.capacity}</p>
                <p>Contact: {s.contact}</p>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${s.location.coordinates[1]},${s.location.coordinates[0]}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm">Get Directions →</a>
              </div>
            ))}
          </div>
        </div>
      )}
      <h3 className="text-xl font-semibold mt-6">All Shelters</h3>
      <div className="grid md:grid-cols-2 gap-4 mt-2">
        {shelters.map(s => (
          <div key={s._id} className="border p-3 rounded shadow">
            <h4 className="font-bold">{s.name}</h4>
            <p>Upazila: {s.upazila}</p>
            <p>Status: {s.status}</p>
            <p>Contact: {s.contact}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ShelterFinder;