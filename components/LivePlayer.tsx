'use client';

import { useState, useEffect } from 'react';

interface LivePlayerProps {
  isLive: boolean;
  liveVideoId: string | null;
  youtubeChannelId: string;
}

export default function LivePlayer({ isLive, liveVideoId, youtubeChannelId }: LivePlayerProps) {
  const [origin, setOrigin] = useState<string>('');

  useEffect(() => {
    // Definimos el origin en el cliente para pasarlo al iframe de YouTube
    setOrigin(window.location.origin);
  }, []);

  // Construimos la URL de YouTube agregando el parámetro origin que muchas veces soluciona bloqueos
  const youtubeSrc = liveVideoId 
    ? `https://www.youtube.com/embed/${liveVideoId}?autoplay=1${origin ? `&origin=${encodeURIComponent(origin)}` : ''}` 
    : `https://www.youtube.com/embed/live_stream?channel=${youtubeChannelId}&autoplay=1${origin ? `&origin=${encodeURIComponent(origin)}` : ''}`;

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden rounded-xl border border-white/10" style={{ paddingTop: "56.25%" }}>
        <iframe 
          className="absolute inset-0 w-full h-full bg-black" 
          src={youtubeSrc} 
          title="UPDR En Vivo" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen 
        />
      </div>
      
      {!isLive && (
        <p className="mt-3 text-xs text-white/50">
          Si no estamos al aire, YouTube puede mostrar el último directo.
        </p>
      )}
    </div>
  );
}
