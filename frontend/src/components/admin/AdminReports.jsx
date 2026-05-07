import { useEffect, useState } from 'react';
import API from '../../services/api';
import { FileCheck } from 'lucide-react';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  useEffect(() => {
    API.get('/community/reports?status=pending').then(res => setReports(res.data)).catch(console.error);
  }, []);
  const verify = async (id, status) => {
    await API.put('/community/reports/verify', { reportId: id, status });
    setReports(reports.filter(r => r._id !== id));
  };
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Verify Reports</h2>
      {reports.map(r => (
        <div key={r._id} className="border p-4 mb-2 rounded">
          <h3>{r.title}</h3>
          <p>{r.description}</p>
          <div className="mt-2 space-x-2">
            <button onClick={() => verify(r._id, 'approved')} className="bg-green-500 text-white px-3 py-1 rounded">Approve</button>
            <button onClick={() => verify(r._id, 'rejected')} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default AdminReports;