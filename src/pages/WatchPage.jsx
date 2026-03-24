import { useEffect, useState } from 'react';
import { PlayCircle, ShieldAlert } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';

export default function WatchPage() {
  const [streamUrl, setStreamUrl] = useState('');

  useEffect(() => {
    localStorage.setItem('f1_last_opened', 'watch');
    // Load custom URL if they set it in settings
    const storedUrl = localStorage.getItem('f1_custom_stream_url');
    if (storedUrl) setStreamUrl(storedUrl);
  }, []);

  return (
    <div className="h-full bg-darker p-8 block pb-12 overflow-hidden flex flex-col">
      <div className="mb-8 shrink-0">
        <h2 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3 uppercase">
          <PlayCircle className="text-f1red" size={32} />
          Watch Stream
        </h2>
        <p className="text-gray-400 font-mono tracking-wide mt-2 text-sm flex items-center gap-2">
           <ShieldAlert size={14} className="text-yellow-600"/> External player integration relies on a valid HLS stream provided via Settings.
        </p>
      </div>

      <div className="flex-1 min-h-0 bg-gray-900/60 backdrop-blur-md rounded-3xl border border-gray-800 shadow-2xl relative p-4 flex flex-col items-center justify-center">
        {streamUrl ? (
          <VideoPlayer streamUrl={streamUrl} />
        ) : (
          <div className="w-full h-full bg-black/60 rounded-2xl flex flex-col items-center justify-center border border-gray-800 p-8 shadow-inner">
             <PlayCircle size={64} className="text-gray-800 mb-6" />
             <p className="text-2xl font-black uppercase tracking-widest text-gray-400 mb-2">No HLS Source Configured</p>
             <p className="text-gray-600 font-mono text-sm max-w-lg text-center leading-relaxed">
               By default, this application redirects to the official FanCode streaming page to respect broadcasting rights. To securely override the player locally, please navigate to <span className="text-f1red">Settings</span> and paste a valid `.m3u8` link.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
