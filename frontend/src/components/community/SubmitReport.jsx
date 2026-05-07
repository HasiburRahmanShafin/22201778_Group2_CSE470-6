import { useState, useEffect } from 'react';
import API from '../../services/api';
import { MapPin } from 'lucide-react';

const SubmitReport = () => {
  const [formData, setFormData] = useState({
    type: 'flood',
    title: '',
    description: '',
    upazila: ''
  });
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Auto-capture GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => console.error(err)
      );
    }
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      setMessage('Please enable GPS to submit report');
      return;
    }
    setLoading(true);
    try {
      await API.post('/community/reports', {
        ...formData,
        lat: location.lat,
        lng: location.lng,
        photo: photo || ''
      });
      setMessage('Report submitted successfully! Pending admin review.');
      setFormData({ type: 'flood', title: '', description: '', upazila: '' });
      setPhoto(null);
    } catch (err) {
      setMessage('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Submit Disaster Report</h2>
      {message && <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Type</label>
          <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-2 border rounded">
            <option value="flood">Flood</option>
            <option value="earthquake">Earthquake</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Title</label>
          <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="w-full p-2 border rounded" rows="3" />
        </div>
        <div>
          <label className="block mb-1">Upazila</label>
          <input type="text" value={formData.upazila} onChange={e => setFormData({...formData, upazila: e.target.value})} required placeholder="e.g., Sylhet Sadar" className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-1">Photo (optional)</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full" />
          {photo && <img src={photo} alt="Preview" className="mt-2 h-32 object-cover rounded" />}
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {location ? `Location captured: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Capturing GPS...'}
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};
export default SubmitReport;