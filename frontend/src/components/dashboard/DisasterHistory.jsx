import { useEffect, useState } from 'react';
import API from '../../services/api';
import {
  Calendar,
  Droplets,
  TrendingUp,
  Users,
  AlertTriangle,
  X
} from 'lucide-react';

const DisasterHistory = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get('/disasters');
        setEvents(res.data);
      } catch (err) {
        console.error('Failed to load disaster history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getTypeIcon = (type) => {
    if (type === 'flood')
      return <Droplets className="w-5 h-5 text-blue-600" />;
    return <TrendingUp className="w-5 h-5 text-orange-600" />;
  };

  const getSeverityColor = (severity) => {
    if (severity === 'severe') return 'bg-red-100 text-red-700';
    if (severity === 'moderate') return 'bg-orange-100 text-orange-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  if (loading) {
    return <div className="p-8 text-center">Loading disaster history...</div>;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        <Calendar className="w-6 h-6 mr-2 text-blue-600" />
        Disaster History Timeline
      </h2>

      <div className="space-y-5 max-h-[600px] overflow-y-auto">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            className="cursor-pointer border rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
          >
            <div className="flex gap-4">
              <img
                src={event.thumbnail}
                alt={event.title}
                className="w-28 h-24 object-cover rounded-lg"
              />

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(event.type)}
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(
                      event.severity
                    )}`}
                  >
                    {event.severity}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  {event.description}
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {event.date}
                  </span>
                  <span className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {event.affected}
                  </span>
                  <span className="flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {event.damage}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-[700px] rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-full h-64 object-cover rounded-xl mb-4"
            />

            <h2 className="text-2xl font-bold mb-2">
              {selectedEvent.title}
            </h2>

            <p className="text-gray-600 mb-4">
              {selectedEvent.fullDescription}
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <p className="text-sm text-gray-500">Affected</p>
                <p className="font-bold text-lg">{selectedEvent.affected}</p>
              </div>

              <div className="bg-red-50 p-4 rounded-xl text-center">
                <p className="text-sm text-gray-500">Damage</p>
                <p className="font-bold text-lg">{selectedEvent.damage}</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-xl text-center">
                <p className="text-sm text-gray-500">Severity</p>
                <p className="font-bold text-lg capitalize">
                  {selectedEvent.severity}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisasterHistory;