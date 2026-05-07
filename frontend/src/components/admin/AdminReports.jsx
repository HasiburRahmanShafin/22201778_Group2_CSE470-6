import { useEffect, useState } from 'react';
import API from '../../services/api';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get('/community/reports?status=pending');
        setReports(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const verify = async (reportId, status) => {
    try {
      await API.put('/community/reports/verify', { reportId, status });
      setReports(reports.filter(r => r._id !== reportId));
    } catch (err) {
      alert('Verification failed');
    }
  };

  if (loading) return <div>Loading reports...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Reports</h2>
      {reports.length === 0 && <p>No pending reports</p>}
      <div className="space-y-4">
        {reports.map(report => (
          <div key={report._id} className="border p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{report.title}</h3>
                <p className="text-sm text-gray-600">{report.description}</p>
                <p className="text-xs text-gray-500">Upazila: {report.upazila}</p>
                {report.photo && <img src={report.photo} alt="report" className="mt-2 h-24 object-cover" />}
              </div>
              <div className="space-x-2">
                <button onClick={() => verify(report._id, 'approved')} className="bg-green-500 text-white px-3 py-1 rounded">Approve</button>
                <button onClick={() => verify(report._id, 'rejected')} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminReports;