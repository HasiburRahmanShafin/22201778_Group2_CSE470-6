import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="inline-flex items-center space-x-2 bg-red-500 px-4 py-2 rounded-full mb-6">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">Live Monitoring Active</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Stay Prepared, Stay Safe</h1>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Real-time disaster monitoring and early warning system for Bangladesh.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
        >
          View Live Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;