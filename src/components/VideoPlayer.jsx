import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { AlertTriangle } from 'lucide-react';

export default function VideoPlayer({ streamUrl, errorMsg }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let hls;
    if (streamUrl && videoRef.current) {
      const video = videoRef.current;
      
      if (Hls.isSupported()) {
        hls = new Hls({ maxBufferLength: 30, enableWorker: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(e => console.error("Auto-play prevented", e));
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error("HLS Fatal Error", data);
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari/macOS)
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(e => console.error("Auto-play prevented", e));
        });
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamUrl]);

  if (!streamUrl) {
    return (
      <div className="w-full h-full bg-black flex flex-col items-center justify-center border border-gray-800 rounded-2xl shadow-xl p-8 text-center text-gray-500">
        <AlertTriangle size={48} className="mb-4 text-gray-600" />
        <p className="uppercase tracking-widest font-mono text-sm">{errorMsg || "No Stream URL Provided"}</p>
        <p className="text-xs mt-2 text-gray-600">Please provide a valid HLS (.m3u8) string in settings.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-gray-800 isolate">
      <video 
        ref={videoRef}
        controls 
        className="w-full h-full object-contain"
        poster="/stream-poster.png"
      />
    </div>
  );
}
