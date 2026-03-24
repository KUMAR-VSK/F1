import { useEffect, useState } from 'react';
import { PlayCircle, ShieldAlert, Globe } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';

const ALL_STREAMS = [
  {
    id: 'fancode',
    label: 'FanCode',
    flag: '🇮🇳',
    region: 'India',
    price: 'Paid',
    lang: 'English',
    vpn: false,
    hoverColor: 'hover:border-blue-500',
    textColor: 'group-hover:text-blue-400',
    action: () => window.electron?.openFanCode?.(),
  },
  {
    id: 'rtbf',
    label: 'RTBF Auvio',
    flag: '🇧🇪',
    region: 'Belgium',
    price: '100% Free',
    lang: 'French',
    vpn: true,
    hoverColor: 'hover:border-red-500',
    textColor: 'group-hover:text-red-400',
    action: () => window.electron?.openRTBF?.(),
  },
  {
    id: 'orf',
    label: 'ORF',
    flag: '🇦🇹',
    region: 'Austria',
    price: '100% Free',
    lang: 'German',
    vpn: true,
    hoverColor: 'hover:border-orange-500',
    textColor: 'group-hover:text-orange-400',
    action: () => window.electron?.openORF?.(),
  },
  {
    id: 'srf',
    label: 'SRF Play',
    flag: '🇨🇭',
    region: 'Switzerland',
    price: '100% Free',
    lang: 'German',
    vpn: true,
    hoverColor: 'hover:border-red-600',
    textColor: 'group-hover:text-red-300',
    action: () => window.electron?.openSRF?.(),
  },
];

export default function WatchPage() {
  const [streamUrl, setStreamUrl] = useState('');
  const [lastStream, setLastStream] = useState(null);

  useEffect(() => {
    localStorage.setItem('f1_last_opened', 'watch');
    const storedUrl = localStorage.getItem('f1_custom_stream_url');
    if (storedUrl) setStreamUrl(storedUrl);
    const stored = localStorage.getItem('f1_last_stream');
    if (stored) setLastStream(stored);
  }, []);

  const handleStream = (stream) => {
    localStorage.setItem('f1_last_stream', stream.id);
    setLastStream(stream.id);
    stream.action();
  };

  return (
    <div className="h-full bg-darker p-8 block pb-12 overflow-hidden flex flex-col">
      <div className="mb-8 shrink-0">
        <h2 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3 uppercase">
          <PlayCircle className="text-f1red" size={32} />
          Watch Stream
        </h2>
        <p className="text-gray-400 font-mono tracking-wide mt-2 text-sm flex items-center gap-2">
           <ShieldAlert size={14} className="text-yellow-600"/> External player integration relies on a valid HLS stream provided via Settings, or choose a free web stream below.
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
               To use the built-in HLS player, navigate to <span className="text-f1red">Settings</span> and paste a valid `.m3u8` link. Otherwise, launch an official web stream below.
             </p>

             <div className="w-full max-w-3xl shrink-0">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 border-b border-gray-800 pb-2 flex-1">Verified Official Streams</h3>
                 {lastStream && (
                   <span className="text-[10px] text-gray-600 font-mono ml-4">
                     Last used: <span className="text-gray-400">{ALL_STREAMS.find(s => s.id === lastStream)?.label}</span>
                   </span>
                 )}
               </div>

               <div className="grid grid-cols-2 gap-4">
                 {ALL_STREAMS.map(stream => (
                   <button
                     key={stream.id}
                     onClick={() => handleStream(stream)}
                     className={`relative flex flex-col items-center justify-center gap-2 p-6 bg-gray-900/60 border rounded-xl hover:bg-gray-800/80 transition-all text-center group shadow-md ${lastStream === stream.id ? 'border-gray-500' : 'border-gray-800'} ${stream.hoverColor}`}
                   >
                     {lastStream === stream.id && (
                       <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-widest text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">Last Used</span>
                     )}
                     <span className={`text-lg font-bold text-white transition-colors uppercase tracking-wider ${stream.textColor}`}>
                       {stream.flag} {stream.label}
                     </span>
                     <span className="text-xs text-gray-400 font-mono flex items-center gap-2 tracking-tight">
                       <span>{stream.region}</span> • <span className={stream.price.includes('Free') ? 'text-green-400' : 'text-yellow-400'}>{stream.price}</span> • <span>{stream.lang}</span>
                     </span>
                     {stream.vpn && (
                       <span className="flex items-center gap-1 text-[10px] text-amber-600 font-mono mt-1">
                         <Globe size={10} /> Requires {stream.region} IP / VPN
                       </span>
                     )}
                   </button>
                 ))}
               </div>

               <p className="text-center text-[10px] text-gray-700 font-mono mt-4">
                 Free streams are geo-restricted. Use a VPN set to the appropriate country if outside that region.
               </p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
