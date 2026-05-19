'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Package, X } from 'lucide-react';
import Link from 'next/link';

interface WatchTimerProps {
  userId: string | undefined;
}

export default function WatchTimer({ userId }: WatchTimerProps) {
  const lastHeartbeat = useRef<number>(Date.now());
  const [showToast, setShowToast] = useState(false);

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
              setShowToast(true);
            }
          }
        } catch (error) {
          console.error('Error sending heartbeat:', error);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [userId]);

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-5 right-5 left-5 sm:left-auto z-50 max-w-sm bg-[#050b1a]/95 border border-brand-yellow/50 backdrop-blur-md text-white p-6 rounded-2xl shadow-[0_0_40px_rgba(255,204,0,0.2)] flex gap-4"
        >
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20">
            <Package className="w-6 h-6 text-brand-yellow" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-brand-yellow tracking-wider uppercase mb-1">
              ¡SOBRE CONSEGUIDO!
            </h4>
            <p className="text-xs text-white/70 leading-relaxed mb-4">
              Completaste 60 minutos viendo el vivo y ganaste 1 sobre para tu álbum.
            </p>
            <div className="flex gap-2">
              <Link
                href="/album"
                onClick={() => setShowToast(false)}
                className="inline-flex items-center justify-center px-4 py-2 bg-brand-yellow text-black font-bold text-[10px] tracking-wider rounded-xl hover:scale-105 transition-all shadow-md"
              >
                IR A MI ÁLBUM
              </Link>
              <button
                onClick={() => setShowToast(false)}
                className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-[10px] tracking-wider font-semibold text-white/70"
              >
                CERRAR
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
