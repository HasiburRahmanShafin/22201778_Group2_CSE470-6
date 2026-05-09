import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Bell, Lock, Save, X, MapPin } from 'lucide-react';
import API from '../../services/api';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    contact: '',
    homeLocation: '',
  });
  
  const [alertPrefs, setAlertPrefs] = useState({
    floodAlerts: true,
    earthquakeAlerts: true,
    emailNotifications: false,
    smsNotifications: true,
  });
  
  const [followedUpazilas, setFollowedUpazilas] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  
  // Home search
  const [homeSearchTerm, setHomeSearchTerm] = useState('');
  const [homeSuggestions, setHomeSuggestions] = useState([]);
  const [showHomeDropdown, setShowHomeDropdown] = useState(false);
  const [homeSearching, setHomeSearching] = useState(false);
  const homeTimeout = useRef();
  
  // Follow search
  const [followSearchTerm, setFollowSearchTerm] = useState('');
  const [followSuggestions, setFollowSuggestions] = useState([]);
  const [showFollowDropdown, setShowFollowDropdown] = useState(false);
  const followTimeout = useRef();
  
  // Password
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Load user data
  useEffect(() => {
    if (user) {
      console.log('User data loaded:', user); // debug
      setProfile({
        name: user.name || '',
        email: user.email || '',
        contact: user.contact || '',
        homeLocation: user.homeLocation || '',
      });
      setAlertPrefs(user.alertPreferences || {
        floodAlerts: true,
        earthquakeAlerts: true,
        emailNotifications: false,
        smsNotifications: true,
      });
      setFollowedUpazilas(user.preferredUpazilas || []);
      // Update search term from homeLocation
      setHomeSearchTerm(user.homeLocation || '');
    }
  }, [user]);
  
  // Search function – unchanged but ensure it works
  const searchUpazilas = async (query) => {
    if (!query || query.length < 2) return [];
    try {
      setHomeSearching(true);
      const res = await API.get(`/locations?search=${encodeURIComponent(query)}&type=upazila`);
      if (res.data && Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    } catch (err) {
      console.error('Search API error:', err);
      if (err.response?.status === 401) {
        setMessage({ type: 'error', text: 'Session expired. Please logout and login again.' });
      } else if (err.response?.status === 500) {
        setMessage({ type: 'error', text: 'Backend error. Try again later.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to search locations.' });
      }
      return [];
    } finally {
      setHomeSearching(false);
    }
  };
  
  // Debounced home search
  useEffect(() => {
    if (homeTimeout.current) clearTimeout(homeTimeout.current);
    if (homeSearchTerm.length >= 2) {
      homeTimeout.current = setTimeout(async () => {
        const results = await searchUpazilas(homeSearchTerm);
        setHomeSuggestions(results);
        setShowHomeDropdown(results.length > 0);
      }, 400);
    } else {
      setHomeSuggestions([]);
      setShowHomeDropdown(false);
    }
    return () => clearTimeout(homeTimeout.current);
  }, [homeSearchTerm]);
  
  // Debounced follow search
  useEffect(() => {
    if (followTimeout.current) clearTimeout(followTimeout.current);
    if (followSearchTerm.length >= 2) {
      followTimeout.current = setTimeout(async () => {
        const results = await searchUpazilas(followSearchTerm);
        const filtered = results.filter(loc => !followedUpazilas.includes(loc.name));
        setFollowSuggestions(filtered);
        setShowFollowDropdown(filtered.length > 0);
      }, 400);
    } else {
      setFollowSuggestions([]);
      setShowFollowDropdown(false);
    }
    return () => clearTimeout(followTimeout.current);
  }, [followSearchTerm, followedUpazilas]);
  
  const selectHomeLocation = (loc) => {
    setProfile({ ...profile, homeLocation: loc.name });
    setHomeSearchTerm(loc.name);
    setShowHomeDropdown(false);
  };
  
  const addFollowUpazila = (loc) => {
    if (!followedUpazilas.includes(loc.name)) {
      setFollowedUpazilas([...followedUpazilas, loc.name]);
    }
    setFollowSearchTerm('');
    setShowFollowDropdown(false);
  };
  
  const removeFollowUpazila = (name) => {
    setFollowedUpazilas(followedUpazilas.filter(n => n !== name));
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        name: profile.name,
        contact: profile.contact,
        homeLocation: profile.homeLocation,
        alertPreferences: alertPrefs,
        preferredUpazilas: followedUpazilas,
      });
      setProfile(prev => ({
      ...prev,
      name: profile.name,
      contact: profile.contact,
      homeLocation: profile.homeLocation,
    }));
      setHomeSearchTerm(profile.homeLocation);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Force a small delay to ensure backend has saved, then refetch will happen in updateProfile
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to update profile.' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setLoading(true);
    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to change password.' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account, location preferences & notifications</p>
      </div>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}
      
      {/* Personal Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center space-x-2 mb-6">
          <User className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold">Personal Information</h2>
        </div>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={profile.email} disabled className="w-full px-4 py-2 bg-gray-100 border rounded-lg cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
              <input type="tel" value={profile.contact} onChange={e => setProfile({...profile, contact: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            
            {/* Home Location with dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Home Upazila</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={homeSearchTerm}
                  onChange={(e) => setHomeSearchTerm(e.target.value)}
                  onFocus={() => homeSearchTerm.length >= 2 && setShowHomeDropdown(true)}
                  placeholder="Type at least 2 letters..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {homeSearching && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
              </div>
              {showHomeDropdown && (
                <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-auto shadow-lg">
                  {homeSuggestions.length === 0 ? (
                    <li className="px-4 py-2 text-gray-500">No results found</li>
                  ) : (
                    homeSuggestions.map(loc => (
                      <li key={loc._id} onClick={() => selectHomeLocation(loc)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        {loc.name}
                      </li>
                    ))
                  )}
                </ul>
              )}
              {profile.homeLocation && !showHomeDropdown && (
                <div className="mt-2 text-sm text-blue-600 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  Selected: {profile.homeLocation}
                </div>
              )}
            </div>
          </div>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50">
            <Save className="w-4 h-4" /><span>Save Changes</span>
          </button>
        </form>
      </div>
      
      {/* Followed Upazilas – unchanged */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center space-x-2 mb-6">
          <Bell className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold">Followed Upazilas</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">You will receive alerts only for these upazilas.</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {followedUpazilas.map(name => (
            <span key={name} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {name}
              <button onClick={() => removeFollowUpazila(name)} className="hover:text-red-600"><X className="w-3 h-3" /></button>
            </span>
          ))}
          {followedUpazilas.length === 0 && <span className="text-gray-400 text-sm">No upazilas followed yet</span>}
        </div>
        <div className="relative">
          <input
            type="text"
            value={followSearchTerm}
            onChange={(e) => setFollowSearchTerm(e.target.value)}
            placeholder="Search upazila to follow..."
            className="w-full px-4 py-2 border rounded-lg"
          />
          {showFollowDropdown && (
            <ul className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-auto shadow-lg">
              {followSuggestions.length === 0 ? (
                <li className="px-4 py-2 text-gray-500">No results found</li>
              ) : (
                followSuggestions.map(loc => (
                  <li key={loc._id} onClick={() => addFollowUpazila(loc)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    {loc.name}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
      
      {/* Alert Preferences and Change Password sections unchanged – they are fine */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center space-x-2 mb-6"><Bell className="w-5 h-5 text-gray-600" /><h2 className="text-xl font-semibold">Alert Preferences</h2></div>
        <div className="space-y-4">
          {[
            { key: 'floodAlerts', label: 'Flood Alerts', desc: 'Receive notifications about flood warnings' },
            { key: 'earthquakeAlerts', label: 'Earthquake Alerts', desc: 'Receive notifications about seismic activity' },
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive alerts via email' },
            { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive alerts via SMS' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100">
              <div><h3 className="font-medium">{item.label}</h3><p className="text-sm text-gray-600">{item.desc}</p></div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={alertPrefs[item.key]} onChange={(e) => setAlertPrefs({...alertPrefs, [item.key]: e.target.checked})} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 mb-6"><Lock className="w-5 h-5 text-gray-600" /><h2 className="text-xl font-semibold">Change Password</h2></div>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label><input type="password" value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">New Password</label><input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} required minLength={6} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label><input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" /></div>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;