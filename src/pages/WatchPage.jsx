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
          <div className="w-full h-full bg-black/60 rounded-2xl flex flex-col items-center justify-center border border-gray-800 p-8 shadow-inner overflow-y-auto">
             <PlayCircle size={64} className="text-gray-800 mb-6 shrink-0" />
             <p className="text-2xl font-black uppercase tracking-widest text-gray-400 mb-2 text-center shrink-0">No Local Player Configured</p>
             <p className="text-gray-600 font-mono text-sm max-w-lg text-center leading-relaxed mb-8 shrink-0">
               To securely override the player locally with an HLS stream, please navigate to <span className="text-f1red">Settings</span> and paste a valid `.m3u8` link. Otherwise, choose an official web stream below.
             </p>
             
             <div className="w-full max-w-2xl shrink-0">
               <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4 border-b border-gray-800 pb-2">Verified External Streams</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <button 
                   onClick={() => window.electron?.openFanCode?.()} 
                   className="flex flex-col items-center justify-center gap-2 p-6 bg-gray-900/60 border border-gray-800 rounded-xl hover:border-blue-500 hover:bg-gray-800/80 transition-all text-center group shadow-md"
                 >
                   <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-wider">FanCode</span>
                   <span className="text-xs text-gray-400 font-mono flex items-center gap-2 tracking-tight"><span>🇮🇳 India</span> • <span>Paid</span> • <span>English</span></span>
                 </button>
                 
                 <button 
                   onClick={() => window.electron?.openRTBF?.()} 
                   className="flex flex-col items-center justify-center gap-2 p-6 bg-gray-900/60 border border-gray-800 rounded-xl hover:border-f1red hover:bg-gray-800/80 transition-all text-center group shadow-md"
                 >
                   <span className="text-lg font-bold text-white group-hover:text-f1red transition-colors uppercase tracking-wider">RTBF Auvio</span>
                   <span className="text-xs text-gray-400 font-mono flex items-center gap-2 tracking-tight"><span>🇧🇪 Belgium</span> • <span>100% Free</span> • <span>French</span></span>
                 </button>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
