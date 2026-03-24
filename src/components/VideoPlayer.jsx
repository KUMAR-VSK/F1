import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

export default function VideoPlayer({ streamUrl }) {
  const videoRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let hls;
    const video = videoRef.current;

    if (!streamUrl) {
      setError('');
      return;
    }

    if (Hls.isSupported() && streamUrl.includes('.m3u8')) {
      hls = new Hls({ maxMaxBufferLength: 30 });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          setError('Failed to load stream. Please check the URL.');
          hls.destroy();
        }
      });
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.log('Autoplay prevented', e));
        setError('');
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari / MacOS fallback
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => console.log('Autoplay prevented', e));
        setError('');
      });
      video.addEventListener('error', () => {
        setError('Failed to load native stream playback.');
      });
    } else {
      // MP4 fallback
      video.src = streamUrl;
      video.play().catch(e => console.log('Autoplay prevented', e));
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [streamUrl]);

  return (
    <div className="relative w-full flex-1 bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <p className="text-f1red font-semibold bg-red-900/20 px-4 py-2 rounded-lg border border-red-900">{error}</p>
        </div>
      )}
      {!streamUrl && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 text-gray-500 flex-col gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center border border-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
          <p>Please enter a valid video stream URL to start watching</p>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full object-contain focus:outline-none bg-black"
        controls
        autoPlay
        playsInline
      />
    </div>
  );
}
