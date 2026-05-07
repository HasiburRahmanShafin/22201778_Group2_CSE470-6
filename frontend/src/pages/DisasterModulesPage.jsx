import FloodMonitoring from '../components/dashboard/FloodMonitoring';
import EarthquakeTracker from '../components/dashboard/EarthquakeTracker';
import FloodForecast from '../components/dashboard/FloodForecast';
import MultiDisasterTimeline from '../components/dashboard/MultiDisasterTimeline';

const DisasterModulesPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <FloodMonitoring />
      <div className="grid md:grid-cols-2 gap-8 my-8">
        <EarthquakeTracker />
        <div className="space-y-8">
          <FloodForecast />
          <MultiDisasterTimeline />
        </div>
      </div>
    </div>
  );
};
export default DisasterModulesPage;