'use client';

import { useState, useEffect } from 'react';

interface LivePlayerProps {
  isLive: boolean;
  liveVideoId: string | null;
  youtubeChannelId: string;
  twitchChannel: string;
}

export default function LivePlayer({ isLive, liveVideoId, youtubeChannelId, twitchChannel }: LivePlayerProps) {
  const [platform, setPlatform] = useState<'youtube' | 'twitch'>('youtube');
  const [hostname, setHostname] = useState<string>('');

  useEffect(() => {
    // Only run on client side to get the correct hostname for Twitch embed
    setHostname(window.location.hostname);
  }, []);

  const youtubeSrc = liveVideoId 
    ? `https://www.youtube.com/embed/${liveVideoId}?autoplay=1` 
    : `https://www.youtube.com/embed/live_stream?channel=${youtubeChannelId}&autoplay=1`;

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-4 justify-end">
        <button 
          onClick={() => setPlatform('youtube')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest transition-colors ${
            platform === 'youtube' 
              ? 'bg-red-600 text-white' 
              : 'bg-white/10 text-white/50 hover:bg-white/20'
          }`}
        >
          YOUTUBE
        </button>
        <button 
          onClick={() => setPlatform('twitch')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest transition-colors ${
            platform === 'twitch' 
              ? 'bg-[#9146FF] text-white' 
              : 'bg-white/10 text-white/50 hover:bg-white/20'
          }`}
        >
          TWITCH
        </button>
      </div>

      <div className="relative w-full overflow-hidden rounded-xl border border-white/10" style={{ paddingTop: "56.25%" }}>
        {platform === 'youtube' ? (
          <iframe 
            className="absolute inset-0 w-full h-full bg-black" 
            src={youtubeSrc} 
            title="UPDR En Vivo YouTube" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen 
          />
        ) : (
          hostname ? (
            <iframe 
              className="absolute inset-0 w-full h-full bg-black" 
              src={`https://player.twitch.tv/?channel=${twitchChannel}&parent=${hostname}&autoplay=true`}
              title="UPDR En Vivo Twitch"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
              <span className="text-white/50">Cargando reproductor...</span>
            </div>
          )
        )}
      </div>
      
      {platform === 'youtube' && (
        <p className="mt-3 text-xs text-brand-yellow font-medium">
          ⚠️ Si el reproductor dice "Este video no está disponible" (por derechos de autor), cambiá a TWITCH usando el botón de arriba para poder verlo sin salir de la página.
        </p>
      )}
      {!isLive && platform === 'youtube' && (
        <p className="mt-2 text-xs text-white/50">
          Si no estamos al aire, YouTube puede mostrar el último directo.
        </p>
      )}
    </div>
  );
}
