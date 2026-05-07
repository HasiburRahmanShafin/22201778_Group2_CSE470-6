import { useEffect, useState } from 'react';
import API from '../../services/api';
import { Package } from 'lucide-react';

const ResourceBoard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get('/community/resources');
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const offerHelp = async (requestId) => {
    try {
      await API.post(`/community/resources/${requestId}/offer`);
      alert('Help offered! Shelter will contact you.');
      // Refresh
      const res = await API.get('/community/resources');
      setRequests(res.data);
    } catch (err) {
      alert('Failed to offer help');
    }
  };

  const getUrgencyColor = (urgency) => {
    if (urgency === 'critical') return 'bg-red-100 text-red-700';
    if (urgency === 'high') return 'bg-orange-100 text-orange-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  if (loading) return <div>Loading resources...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Package /> Resource Demand Board</h2>
      <div className="space-y-4">
        {requests.map(req => (
          <div key={req._id} className="border p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{req.item}</h3>
                <p>Shelter: {req.shelter?.name}</p>
                <p>Quantity needed: {req.quantity}</p>
                <p>Fulfilled: {req.fulfilled}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded ${getUrgencyColor(req.urgency)}`}>{req.urgency} urgency</span>
              </div>
              <button onClick={() => offerHelp(req._id)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Offer Help</button>
            </div>
          </div>
        ))}
        {requests.length === 0 && <p>No active resource requests.</p>}
      </div>
    </div>
  );
};
export default ResourceBoard;