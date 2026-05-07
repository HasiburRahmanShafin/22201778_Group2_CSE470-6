import { useEffect, useState } from 'react';
import API from '../../services/api';
import { Package } from 'lucide-react';

const AdminResources = () => {
  const [shelters, setShelters] = useState([]);
  const [formData, setFormData] = useState({ shelter: '', item: '', quantity: '', urgency: 'medium' });
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchShelters();
    fetchRequests();
  }, []);

  const fetchShelters = async () => {
    try {
      const res = await API.get('/community/shelters');
      setShelters(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchRequests = async () => {
    try {
      const res = await API.get('/community/resources');
      setRequests(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/community/resources', formData);
      setMessage('Resource request posted');
      setFormData({ shelter: '', item: '', quantity: '', urgency: 'medium' });
      fetchRequests();
    } catch (err) {
      setMessage('Failed to post request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Package /> Post Resource Request</h2>
      {message && <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">{message}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-3">
        <select value={formData.shelter} onChange={e => setFormData({...formData, shelter: e.target.value})} required className="w-full p-2 border rounded">
          <option value="">Select Shelter</option>
          {shelters.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <input type="text" placeholder="Item name (e.g., Drinking Water)" value={formData.item} onChange={e => setFormData({...formData, item: e.target.value})} required className="w-full p-2 border rounded" />
        <input type="text" placeholder="Quantity (e.g., 500 bottles)" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required className="w-full p-2 border rounded" />
        <select value={formData.urgency} onChange={e => setFormData({...formData, urgency: e.target.value})} className="w-full p-2 border rounded">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Post Request</button>
      </form>

      <h3 className="font-semibold text-lg mb-2">Active Requests</h3>
      <div className="space-y-2">
        {requests.map(r => (
          <div key={r._id} className="border p-3 rounded">
            <strong>{r.item}</strong> – {r.quantity}<br/>
            Shelter: {r.shelter?.name} | Urgency: {r.urgency}
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminResources;