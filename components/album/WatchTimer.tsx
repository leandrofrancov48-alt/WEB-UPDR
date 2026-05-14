'use client';

import { useEffect, useRef } from 'react';

interface WatchTimerProps {
  userId: string | undefined;
}

export default function WatchTimer({ userId }: WatchTimerProps) {
  const lastHeartbeat = useRef<number>(Date.now());

  useEffect(() => {
    if (!userId) return;

    console.log('WatchTimer initialized for user:', userId);

    const interval = setInterval(async () => {
      const now = Date.now();
      const elapsedMs = now - lastHeartbeat.current;
      const elapsedMinutes = Math.floor(elapsedMs / 60000);

      // Ping every 5 minutes or if we have accumulated at least 5 minutes
      if (elapsedMinutes >= 5) {
        try {
          const res = await fetch('/api/album/heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ minutes: elapsedMinutes }),
          });

          if (res.ok) {
            const data = await res.json();
            lastHeartbeat.current = now;
            if (data.grantedPack) {
              console.log('¡GANASTE UN SOBRE POR VER EL VIVO!');
              // You could trigger a toast here if you have a toast system
            }
          }
        } catch (error) {
          console.error('Error sending heartbeat:', error);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [userId]);

  return null; // Invisible component
}
