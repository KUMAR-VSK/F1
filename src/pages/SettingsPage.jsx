import { useState, useEffect } from 'react';
import { Settings, Save, Link2, Bell, Shield, Sun, Moon, Globe } from 'lucide-react';

const REGIONS = [
  { code: 'IN', label: '🇮🇳 India' },
  { code: 'BE', label: '🇧🇪 Belgium' },
  { code: 'AT', label: '🇦🇹 Austria' },
  { code: 'CH', label: '🇨🇭 Switzerland' },
  { code: 'OTHER', label: '🌍 Other' },
];

export default function SettingsPage() {
  const [streamUrl, setStreamUrl] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [region, setRegion] = useState('OTHER');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem('f1_last_opened', 'settings');
    setStreamUrl(localStorage.getItem('f1_custom_stream_url') || '');
    setNotifications(localStorage.getItem('f1_notifications') !== 'false');
    setOfflineMode(localStorage.getItem('f1_offline_mode') !== 'false');
    setTheme(localStorage.getItem('f1_theme') || 'dark');
    setRegion(localStorage.getItem('f1_region') || 'OTHER');
  }, []);

  const handleSave = () => {
    localStorage.setItem('f1_custom_stream_url', streamUrl);
    localStorage.setItem('f1_notifications', notifications);
    localStorage.setItem('f1_offline_mode', offlineMode);
    localStorage.setItem('f1_theme', theme);
    localStorage.setItem('f1_region', region);
    window.dispatchEvent(new Event('storage'));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="h-full bg-darker p-8 pb-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold uppercase tracking-tight text-white flex items-center gap-3 mb-10 border-b border-gray-800 pb-4">
          <Settings className="text-f1red" size={32} /> User Preferences
        </h2>

        <div className="space-y-8">

          {/* STREAM REGION */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-800 p-8 shadow-xl">
            <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-2 flex items-center gap-2">
              <Globe size={24} className="text-f1red" /> Your Streaming Region
            </h3>
            <p className="text-gray-400 text-sm mb-6 font-mono leading-relaxed">
              Select your country to see region-relevant stream options on the Watch page. Free streams are geo-restricted — use a VPN if needed.
            </p>
            <div className="flex flex-wrap gap-3">
              {REGIONS.map(r => (
                <button
                  key={r.code}
                  onClick={() => setRegion(r.code)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all border ${region === r.code ? 'bg-f1red border-red-800 text-white shadow-[0_0_15px_rgba(225,6,0,0.3)] scale-105' : 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* STREAM CONFIG */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-800 p-8 shadow-xl">
            <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-4 flex items-center gap-2">
              <Link2 size={24} className="text-f1red" /> Built-in Player URL (HLS)
            </h3>
            <p className="text-gray-400 text-sm mb-4 font-mono leading-relaxed">
              If you have access to a legal HLS stream (.m3u8), you can provide it here to watch directly inside the "Watch Stream" player.
            </p>
            <div className="flex flex-col gap-2">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Default Stream URL</label>
               <input 
                 type="url"
                 value={streamUrl}
                 onChange={(e) => setStreamUrl(e.target.value)}
                 placeholder="https://example.com/stream.m3u8"
                 className="w-full bg-black/60 border border-gray-700 focus:border-f1red rounded-xl px-4 py-3 text-white font-mono text-sm shadow-inner outline-none transition-all placeholder-gray-600"
               />
            </div>
          </div>

          {/* APP SETTINGS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            
            <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-800 p-8 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-widest text-white mb-2 flex items-center gap-2">
                  <Bell size={20} className="text-f1red" /> Desktop Notifications
                </h3>
                <p className="text-gray-400 text-sm mb-6 font-mono leading-relaxed">
                  Receive alerts 10 minutes before a session starts and when a session goes live natively through macOS.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer group">
                 <input type="checkbox" className="sr-only peer" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
                 <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-f1red shadow-inner group-hover:bg-gray-600 group-hover:peer-checked:bg-red-500"></div>
                 <span className="ml-4 text-sm font-bold text-gray-300 uppercase tracking-widest">{notifications ? 'Enabled' : 'Disabled'}</span>
              </label>
            </div>

            <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-800 p-8 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-widest text-white mb-2 flex items-center gap-2">
                  <Shield size={20} className="text-f1red" /> Offline API Caching
                </h3>
                <p className="text-gray-400 text-sm mb-6 font-mono leading-relaxed">
                  Cache Standings and Schedule responses via localStorage, ensuring rapid loading even without an internet connection.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer group">
                 <input type="checkbox" className="sr-only peer" checked={offlineMode} onChange={(e) => setOfflineMode(e.target.checked)} />
                 <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600 shadow-inner group-hover:bg-gray-600 group-hover:peer-checked:bg-green-500"></div>
                 <span className="ml-4 text-sm font-bold text-gray-300 uppercase tracking-widest">{offlineMode ? 'Active' : 'Bypass'}</span>
              </label>
            </div>
          </div>
          
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-800 p-8 shadow-xl">
            <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-4 flex items-center gap-2">
              {theme === 'dark' ? <Moon size={24} className="text-f1red" /> : <Sun size={24} className="text-yellow-500" />} Application Theme
            </h3>
            <p className="text-gray-400 text-sm mb-6 font-mono leading-relaxed">
              Toggle the complete user experience theme. Light mode forces an inverted visual aesthetic optimized for bright rooms (Experimental).
            </p>
            <div className="flex bg-black/60 border border-gray-700 rounded-xl p-1.5 w-fit">
               <button 
                 onClick={() => setTheme('dark')}
                 className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-sm transition-all ${theme === 'dark' ? 'bg-f1red text-white shadow-md scale-105' : 'text-gray-500 hover:text-white'}`}
               >
                 <Moon size={16} /> Dark
               </button>
               <button 
                 onClick={() => setTheme('light')}
                 className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-sm transition-all ${theme === 'light' ? 'bg-f1red text-white shadow-md scale-105' : 'text-gray-500 hover:text-white'}`}
               >
                 <Sun size={16} /> Light
               </button>
            </div>
          </div>

          <div className="flex justify-end pt-4 mt-8 border-t border-gray-800/50">
            <button 
              onClick={handleSave}
              className={`flex items-center gap-2 px-10 py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${saved ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(22,163,74,0.4)]' : 'bg-white text-black hover:bg-gray-200 shadow-lg'}`}
            >
              <Save size={20} className={saved ? 'animate-pulse' : ''} />
              {saved ? 'Preferences Saved' : 'Save Changes'}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
