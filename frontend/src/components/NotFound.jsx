import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Go Home</Link>
      </div>
    </div>
  );
};

export default NotFound;