import { useEffect, useState } from 'react';
import { PlayCircle, Globe, Zap, Radio, Tv, ChevronRight, Clock } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import { getCurrentWeekend } from '../services/sessionService';

const ALL_STREAMS = [
  {
    id: 'fancode',
    label: 'FanCode',
    description: 'Official Indian broadcaster for Formula 1',
    flag: '🇮🇳',
    region: 'India',
    price: 'Paid',
    lang: 'English',
    vpn: false,
    category: 'paid',
    accentColor: '#3b82f6',
    accentBg: 'rgba(59,130,246,0.08)',
    borderHover: 'hover:border-blue-500',
    action: () => window.electron?.openFanCode?.(),
  },
  {
    id: 'rtbf',
    label: 'RTBF Auvio',
    description: 'Belgian public broadcaster — 24 races, fully free',
    flag: '🇧🇪',
    region: 'Belgium',
    price: 'Free',
    lang: 'French',
    vpn: true,
    category: 'free',
    accentColor: '#ef4444',
    accentBg: 'rgba(239,68,68,0.08)',
    borderHover: 'hover:border-red-500',
    action: () => window.electron?.openRTBF?.(),
  },
  {
    id: 'orf',
    label: 'ORF',
    description: 'Austrian public television — free & live',
    flag: '🇦🇹',
    region: 'Austria',
    price: 'Free',
    lang: 'German',
    vpn: true,
    category: 'free',
    accentColor: '#f97316',
    accentBg: 'rgba(249,115,22,0.08)',
    borderHover: 'hover:border-orange-500',
    action: () => window.electron?.openORF?.(),
  },
  {
    id: 'srf',
    label: 'SRF Play',
    description: 'Swiss public broadcaster — free & live',
    flag: '🇨🇭',
    region: 'Switzerland',
    price: 'Free',
    lang: 'German/French',
    vpn: true,
    category: 'free',
    accentColor: '#dc2626',
    accentBg: 'rgba(220,38,38,0.08)',
    borderHover: 'hover:border-red-600',
    action: () => window.electron?.openSRF?.(),
  },
];

const TABS = ['All', 'Free', 'Paid'];

function LiveBanner({ session }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!session) return null;

  const isLive = session.status === 'LIVE';
  const diff = session.timestamp - now;
  const h = Math.max(0, Math.floor(diff / 3600000));
  const m = Math.max(0, Math.floor((diff % 3600000) / 60000));
  const s = Math.max(0, Math.floor((diff % 60000) / 1000));
  const countdown = `${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;

  return (
    <div className={`shrink-0 mb-6 rounded-2xl border p-4 flex items-center justify-between ${
      isLive
        ? 'bg-gradient-to-r from-red-950/60 to-f1red/10 border-red-800 shadow-[0_0_25px_rgba(225,6,0,0.2)]'
        : 'bg-gray-900/60 border-gray-800'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLive ? 'bg-f1red/20' : 'bg-gray-800'}`}>
          {isLive ? <Radio size={20} className="text-f1red animate-pulse" /> : <Clock size={20} className="text-gray-500" />}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
            {isLive ? 'Session Live Now' : 'Next Session'}
          </p>
          <p className="text-white font-bold tracking-wide">
            {session.raceName} — <span className={isLive ? 'text-f1red' : 'text-gray-300'}>{session.name}</span>
          </p>
        </div>
      </div>
      {isLive ? (
        <span className="flex items-center gap-2 text-sm font-black uppercase text-white bg-f1red px-4 py-1.5 rounded-full animate-pulse shadow-[0_0_15px_rgba(225,6,0,0.4)]">
          <Radio size={14}/> Live
        </span>
      ) : (
        <span className="text-f1red font-mono text-sm font-bold bg-red-950/40 border border-red-900/30 px-4 py-1.5 rounded-full">
          {countdown}
        </span>
      )}
    </div>
  );
}

function StreamCard({ stream, isLastUsed, onLaunch }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => onLaunch(stream)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative flex flex-col gap-3 p-6 rounded-2xl border transition-all duration-300 text-left w-full group ${
        isLastUsed ? 'border-gray-600' : 'border-gray-800'
      } ${stream.borderHover}`}
      style={{
        background: hovered ? stream.accentBg : 'rgba(17,17,20,0.7)',
        boxShadow: hovered ? `0 0 30px ${stream.accentColor}22` : 'none',
      }}
    >
      {isLastUsed && (
        <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-800 border border-gray-700 px-2 py-0.5 rounded-full">
          Last Used
        </span>
      )}

      <div className="flex items-center gap-3">
        <span className="text-3xl">{stream.flag}</span>
        <div>
          <p className="text-white font-black text-lg uppercase tracking-wide leading-none">{stream.label}</p>
          <p className="text-gray-500 text-[11px] font-mono mt-0.5">{stream.region}</p>
        </div>
      </div>

      <p className="text-gray-400 text-xs font-mono leading-relaxed">{stream.description}</p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-800/60">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
            stream.price === 'Free'
              ? 'text-green-400 border-green-900 bg-green-950/40'
              : 'text-yellow-400 border-yellow-900 bg-yellow-950/40'
          }`}>
            {stream.price}
          </span>
          <span className="text-[10px] text-gray-500 font-mono">{stream.lang}</span>
          {stream.vpn && (
            <span className="flex items-center gap-1 text-[10px] text-amber-600 font-mono">
              <Globe size={9} /> VPN
            </span>
          )}
        </div>
        <ChevronRight
          size={18}
          className="text-gray-600 group-hover:text-white transition-all group-hover:translate-x-1"
          style={{ color: hovered ? stream.accentColor : undefined }}
        />
      </div>
    </button>
  );
}

export default function WatchPage() {
  const [streamUrl, setStreamUrl] = useState('');
  const [lastStream, setLastStream] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [nextSession, setNextSession] = useState(null);

  useEffect(() => {
    localStorage.setItem('f1_last_opened', 'watch');
    const storedUrl = localStorage.getItem('f1_custom_stream_url');
    if (storedUrl) setStreamUrl(storedUrl);
    setLastStream(localStorage.getItem('f1_last_stream'));

    getCurrentWeekend().then(sessions => {
      if (!sessions) return;
      const live = sessions.find(s => s.status === 'LIVE');
      const next = sessions.find(s => s.status === 'UPCOMING');
      setNextSession(live || next || null);
    });
  }, []);

  const handleStream = (stream) => {
    localStorage.setItem('f1_last_stream', stream.id);
    setLastStream(stream.id);
    stream.action();
  };

  const filteredStreams = ALL_STREAMS.filter(s => {
    if (activeTab === 'Free') return s.category === 'free';
    if (activeTab === 'Paid') return s.category === 'paid';
    return true;
  });

  const lastUsedStream = ALL_STREAMS.find(s => s.id === lastStream);

  if (streamUrl) {
    return (
      <div className="h-full bg-darker p-6 flex flex-col">
        <div className="mb-4 flex items-center justify-between shrink-0">
          <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3 uppercase">
            <Tv className="text-f1red" size={28} /> HLS Player
          </h2>
          <button
            onClick={() => { setStreamUrl(''); localStorage.removeItem('f1_custom_stream_url'); }}
            className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white px-4 py-2 rounded-lg border border-gray-800 hover:border-gray-600 transition-all"
          >
            × Clear Stream
          </button>
        </div>
        <div className="flex-1 min-h-0 bg-black rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
          <VideoPlayer streamUrl={streamUrl} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-darker flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-8 pt-8 pb-0">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3 uppercase">
              <PlayCircle className="text-f1red" size={32} />
              Watch Stream
            </h2>
            <p className="text-gray-500 font-mono text-sm mt-2">
              Launch an official broadcast or configure a custom HLS stream from Settings.
            </p>
          </div>
          {lastUsedStream && (
            <button
              onClick={() => handleStream(lastUsedStream)}
              className="shrink-0 flex items-center gap-3 px-5 py-3 bg-f1red hover:bg-red-600 text-white font-bold uppercase tracking-widest text-sm rounded-xl shadow-[0_0_20px_rgba(225,6,0,0.3)] hover:scale-105 active:scale-95 transition-all"
            >
              <Zap size={16} className="animate-pulse" />
              Resume {lastUsedStream.label}
            </button>
          )}
        </div>

        <LiveBanner session={nextSession} />

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-black/40 border border-gray-800 rounded-xl p-1 w-fit">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? 'bg-f1red text-white shadow-md scale-105'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Stream Cards */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <div className="grid grid-cols-2 gap-4 max-w-4xl">
          {filteredStreams.map(stream => (
            <StreamCard
              key={stream.id}
              stream={stream}
              isLastUsed={lastStream === stream.id}
              onLaunch={handleStream}
            />
          ))}
        </div>

        <p className="text-[10px] text-gray-700 font-mono mt-6 max-w-2xl leading-relaxed">
          🔒 All streams open in isolated Electron windows. Free streams are geo-restricted — a VPN set to the broadcaster's country is required when outside that region.
        </p>
      </div>
    </div>
  );
}
