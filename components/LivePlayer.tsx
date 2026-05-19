'use client';

import { useState, useEffect } from 'react';
import { Radio, Clock, ExternalLink } from 'lucide-react';

interface LivePlayerProps {
  isLive: boolean;
  liveVideoId: string | null;
  youtubeChannelId: string;
}

interface ProgramInfo {
  dayNum: number; // 1 = Lunes, 2 = Martes, etc.
  dayName: string;
  hours: string;
  title: string;
}

const SCHEDULE: ProgramInfo[] = [
  { dayNum: 1, dayName: 'Lunes', hours: '18:00 a 20:00 hs', title: 'LA BANDURRIA' },
  { dayNum: 1, dayName: 'Lunes', hours: '20:00 a 22:00 hs', title: 'TODO POR LA MISMA' },
  { dayNum: 2, dayName: 'Martes', hours: '18:00 a 20:00 hs', title: 'LA BANDURRIA' },
  { dayNum: 3, dayName: 'Miércoles', hours: '21:00 a 23:00 hs', title: 'UN POCO DE RUIDO' },
  { dayNum: 4, dayName: 'Jueves', hours: '18:00 a 20:00 hs', title: 'LA BANDURRIA' },
];

export default function LivePlayer({ isLive, liveVideoId, youtubeChannelId }: LivePlayerProps) {
  const [origin, setOrigin] = useState<string>('');
  const [argDay, setArgDay] = useState<number>(0);
  const [argHour, setArgHour] = useState<number>(0);

  useEffect(() => {
    setOrigin(window.location.origin);
    try {
      const nowInArg = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
      setArgDay(nowInArg.getDay());
      setArgHour(nowInArg.getHours());
    } catch (e) {
      setArgDay(new Date().getDay());
      setArgHour(new Date().getHours());
    }
  }, []);

  if (isLive && liveVideoId) {
    const youtubeSrc = `https://www.youtube.com/embed/${liveVideoId}?autoplay=1${origin ? `&origin=${encodeURIComponent(origin)}` : ''}`;

    return (
      <div className="w-full">
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-brand-yellow/50 shadow-[0_0_50px_rgba(232,212,63,0.15)]" style={{ paddingTop: "56.25%" }}>
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-red-600 text-white font-bold text-[10px] tracking-widest px-3 py-1 rounded-full animate-pulse shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            EN VIVO AHORA
          </div>
          <iframe 
            className="absolute inset-0 w-full h-full bg-black" 
            src={youtubeSrc} 
            title="UPDR En Vivo" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen 
          />
        </div>
      </div>
    );
  }

  // Placa Offline Premium
  return (
    <div className="w-full bg-[#050b1a]/40 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
      {/* Luces de fondo decorativas */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-yellow/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-yellow/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full">
        {/* Indicador de Estado */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold tracking-widest uppercase mb-6">
          <Radio className="w-3.5 h-3.5 text-white/40 animate-pulse" />
          Transmisión Offline
        </div>

        {/* Título Principal */}
        <h3 className="text-2xl md:text-3xl font-yellow text-white tracking-wide mb-2">
          EL SHOW VUELVE EN VIVO PRONTO
        </h3>
        <p className="text-xs text-white/60 mb-8 max-w-md leading-relaxed">
          Actualmente la radio está fuera del aire. Agendate los horarios de transmisión en vivo para no perderte ningún programa.
        </p>

        {/* Agenda Semanal */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-8 text-left">
          {SCHEDULE.map((prog, index) => {
            const isToday = argDay === prog.dayNum;
            
            // Lógica súper precisa para saber si es el bloque horario exacto al aire
            let isCurrentSlot = false;
            if (isToday) {
              if (prog.hours.includes('18:00') && argHour >= 18 && argHour < 20) {
                isCurrentSlot = true;
              } else if (prog.hours.includes('20:00') && argHour >= 20 && argHour < 22) {
                isCurrentSlot = true;
              } else if (prog.hours.includes('21:00') && argHour >= 21 && argHour < 23) {
                isCurrentSlot = true;
              }
            }

            return (
              <div 
                key={`${prog.dayName}-${prog.title}-${index}`} 
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  isCurrentSlot 
                    ? 'bg-brand-yellow/10 border-brand-yellow/50 shadow-[0_0_20px_rgba(232,212,63,0.12)] scale-[1.03]' 
                    : isToday
                      ? 'bg-white/[0.04] border-white/20 hover:border-brand-yellow/30'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${isCurrentSlot ? 'text-brand-yellow' : 'text-white/40'}`}>
                    {prog.dayName}
                  </span>
                  {isCurrentSlot ? (
                    <span className="inline-flex items-center gap-1 bg-brand-yellow/20 text-brand-yellow font-bold text-[8px] tracking-wider px-2 py-0.5 rounded-full animate-pulse">
                      AL AIRE AHORA
                    </span>
                  ) : isToday ? (
                    <span className="inline-flex items-center gap-1 bg-white/10 text-white/80 font-semibold text-[8px] tracking-wider px-2 py-0.5 rounded-full">
                      ¡HOY!
                    </span>
                  ) : null}
                </div>
                <h4 className={`text-sm font-bold tracking-wider mb-1 ${isCurrentSlot ? 'text-brand-yellow' : 'text-white/90'}`}>{prog.title}</h4>
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                  <Clock className="w-3.5 h-3.5 text-brand-yellow/70" />
                  <span>{prog.hours}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <a 
            href={`https://www.youtube.com/@Updr`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider rounded-full hover:scale-105 transition-all shadow-md"
          >
            <svg 
              className="w-4 h-4 fill-current text-white" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            IR AL CANAL DE YOUTUBE
          </a>
          <a 
            href="https://unpocoderuido2.mitiendanube.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs tracking-wider rounded-full hover:scale-105 transition-all"
          >
            <span>VER MERCH OFICIAL</span>
            <ExternalLink className="w-3.5 h-3.5 text-white/60" />
          </a>
        </div>
      </div>
    </div>
  );
}

