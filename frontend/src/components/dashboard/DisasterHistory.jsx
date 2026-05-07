import { useEffect, useState } from 'react';
import API from '../../services/api';
import { Calendar, Droplets, TrendingUp, Wind, Sun, AlertTriangle } from 'lucide-react';

const DisasterHistory = () => {
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
    switch (type) {
      case 'flood': return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'earthquake': return <TrendingUp className="w-5 h-5 text-orange-600" />;
      case 'cyclone': return <Wind className="w-5 h-5 text-purple-600" />;
      default: return <Sun className="w-5 h-5 text-red-600" />;
    }
  };

  const getSeverityColor = (severity) => {
    if (severity === 'severe') return 'bg-red-100 text-red-700';
    if (severity === 'moderate') return 'bg-orange-100 text-orange-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  if (loading) return <div className="text-center py-8">Loading disaster history...</div>;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5" /> Disaster History Timeline</h2>
      {events.length === 0 && <p className="text-gray-500">No historical events recorded.</p>}
      <div className="relative border-l-2 border-gray-200 ml-4 pl-6 space-y-6">
        {events.map((event, idx) => (
          <div key={idx} className="relative">
            <div className="absolute -left-8 top-1 w-4 h-4 bg-blue-500 rounded-full"></div>
            <div className="flex items-center gap-2 mb-1">
              {getTypeIcon(event.type)}
              <span className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
              <span className={`text-xs px-2 py-0.5 rounded uppercase font-semibold ${getSeverityColor(event.severity)}`}>{event.severity}</span>
            </div>
            <h3 className="font-semibold">{event.title}</h3>
            <p className="text-sm text-gray-600">{event.description}</p>
            <p className="text-xs text-gray-400 mt-1 uppercase">{event.upazila}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default DisasterHistory;