import { useEffect, useState } from 'react';
import API from '../../services/api';
import { Calendar, Droplets, TrendingUp, Wind, Sun } from 'lucide-react';

const MultiDisasterTimeline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await API.get('/disaster/timeline');
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  const getTypeIcon = (type) => {
    if (type === 'flood') return <Droplets className="w-5 h-5 text-blue-600" />;
    if (type === 'earthquake') return <TrendingUp className="w-5 h-5 text-orange-600" />;
    if (type === 'cyclone') return <Wind className="w-5 h-5 text-purple-600" />;
    return <Sun className="w-5 h-5 text-red-600" />;
  };

  if (loading) return <div>Loading timeline...</div>;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center"><Calendar className="mr-2"/> Multi‑Disaster Timeline</h2>
      <div className="relative border-l-2 border-gray-200 ml-3 pl-6 space-y-6">
        {events.map((event, idx) => (
          <div key={idx} className="relative">
            <div className="absolute -left-8 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
            <div className="flex items-center gap-2 mb-1">
              {getTypeIcon(event.type)}
              <span className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
              <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-gray-200">{event.severity}</span>
            </div>
            <h3 className="font-semibold">{event.title}</h3>
            <p className="text-sm text-gray-600">{event.description}</p>
            <p className="text-xs text-gray-400 mt-1">Location: {event.upazila}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MultiDisasterTimeline;