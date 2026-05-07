import { useEffect, useState } from 'react';
import API from '../../services/api';
import { CloudRain, AlertTriangle } from 'lucide-react';

const FloodForecast = () => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await API.get('/disaster/flood-forecast');
        setForecast(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, []);

  if (loading) return <div>Loading forecast...</div>;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <CloudRain className="mr-2" /> Flood Forecast (48h)
      </h2>
      <div className="space-y-6">
        {forecast.map((item) => (
          <div key={item.upazila} className="border-b pb-4 last:border-0">
            <div className="flex justify-between font-medium mb-1">
              <span>{item.upazila}</span>
              <span
                className={`text-sm font-bold ${
                  item.riskLevel === 'high'
                    ? 'text-red-600'
                    : item.riskLevel === 'medium'
                    ? 'text-orange-500'
                    : 'text-green-600'
                }`}
              >
                {item.riskLevel.toUpperCase()} risk
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
              <div>📊 Current: {item.currentLevel}m</div>
              <div>⏰ 24h: {item.forecast24h}m</div>
              <div>⏰ 48h: {item.forecast48h}m</div>
            </div>
            {/* Optional: simple visual bar for 48h level */}
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, (item.forecast48h / (item.dangerLevel || 8)) * 100)}%` }}
              />
            </div>
            {item.riskLevel !== 'low' && (
              <div className="mt-2 flex items-center text-xs text-red-600">
                <AlertTriangle className="w-3 h-3 mr-1" /> Preparation advised
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloodForecast;