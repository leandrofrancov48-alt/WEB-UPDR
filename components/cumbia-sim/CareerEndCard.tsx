"use client";

import React, { useState } from 'react';
import { CumbiaPlayer, LegacyTier, SeasonHistory } from '@/lib/cumbia-sim/types';
import { calculateLegacyTier } from '@/lib/cumbia-sim/simulation';
import { Trophy, Sparkles, RefreshCw, Share2, Crown, Music2, Star, Check } from 'lucide-react';

interface CareerEndCardProps {
  player: CumbiaPlayer;
  history: SeasonHistory[];
  onRestart: () => void;
}

export function CareerEndCard({ player, history, onRestart }: CareerEndCardProps) {
  const [copied, setCopied] = useState(false);
  const legacy = calculateLegacyTier(player, history);

  const totalShows = history.reduce((acc, h) => acc + h.showsPlayed, 0);
  const totalMoney = player.attributes.money;
  const maxListeners = Math.max(...history.map(h => h.listenersMonthly), 0);

  const uniqueVenues = Array.from(new Set(history.map(h => h.venueConquered.name)));
  const allAwards = Array.from(new Set(history.flatMap(h => h.awardsWon)));

  const handleShare = () => {
    const text = `🎶 ¡Terminé mi carrera en el Simulador de Cumbia de Un Poco de Ruido!\n👑 Nivel alcanzado: ${legacy.title}\n🎤 Artista: ${player.nickname}\n🏟️ Máximo escenario: ${history[history.length - 1]?.venueConquered.name || 'Barrio'}\n🔥 ¡Jugá vos también!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* Tarjeta Visual de Legado */}
      <div className="bg-gradient-to-b from-[#111f44] via-[#091126] to-black border-2 border-brand-yellow/50 rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(232,212,63,0.15)] relative overflow-hidden text-center space-y-6">
        {/* Glow dorado */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-yellow/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Badge de Legado */}
        <div className="flex justify-center">
          <span className="text-xs font-black uppercase tracking-widest bg-brand-yellow text-black px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-lg">
            <Crown className="w-4 h-4" /> {legacy.badge}
          </span>
        </div>

        {/* Nombre y Rol */}
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black font-yellow text-brand-yellow tracking-wider uppercase">
            {player.nickname}
          </h1>
          <p className="text-xs md:text-sm text-white/60 font-mono">
            {player.name} • {player.role} de {player.subgenre.replace('_', ' ')}
          </p>
        </div>

        {/* Veredicto de la Carrera */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 max-w-xl mx-auto space-y-2">
          <h3 className="text-base md:text-lg font-black text-white font-yellow uppercase text-brand-yellow">
            {legacy.title}
          </h3>
          <p className="text-xs md:text-sm text-white/70 leading-relaxed">
            {legacy.description}
          </p>
        </div>

        {/* Números Finales */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
          <div className="bg-black/40 border border-white/5 p-3.5 rounded-2xl">
            <span className="text-[10px] text-white/40 uppercase font-bold block">Shows Totales</span>
            <span className="text-xl font-black font-yellow text-white">{totalShows}</span>
          </div>
          <div className="bg-black/40 border border-white/5 p-3.5 rounded-2xl">
            <span className="text-[10px] text-white/40 uppercase font-bold block">Oyentes Récord</span>
            <span className="text-xl font-black font-yellow text-purple-400">
              {(maxListeners / 1000000).toFixed(1)}M
            </span>
          </div>
          <div className="bg-black/40 border border-white/5 p-3.5 rounded-2xl">
            <span className="text-[10px] text-white/40 uppercase font-bold block">Fortuna Ganada</span>
            <span className="text-xl font-black font-yellow text-emerald-400">
              ${(totalMoney / 1000000).toFixed(1)}M
            </span>
          </div>
          <div className="bg-black/40 border border-white/5 p-3.5 rounded-2xl">
            <span className="text-[10px] text-white/40 uppercase font-bold block">OVR Final</span>
            <span className="text-xl font-black font-yellow text-brand-yellow">
              {Math.round((player.attributes.talent + player.attributes.charisma) / 2)}
            </span>
          </div>
        </div>

        {/* Premios y Templos Conquistados */}
        <div className="space-y-3 pt-2 text-left max-w-xl mx-auto">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block text-center">
            🏆 Templos y Escenarios Conquistados:
          </span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {uniqueVenues.map((v, i) => (
              <span key={i} className="text-[11px] font-bold bg-white/10 text-white/90 border border-white/10 px-3 py-1 rounded-xl">
                {v}
              </span>
            ))}
          </div>
        </div>

        {allAwards.length > 0 && (
          <div className="space-y-2 pt-2 text-left max-w-xl mx-auto">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block text-center">
              ⭐ Vitrina de Premios:
            </span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {allAwards.map((a, i) => (
                <span key={i} className="text-[11px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-xl">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-white/10 text-[10px] text-white/30 font-mono">
          Un Poco de Ruido © 2026 • Simulador de Carrera de Cumbia
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          type="button"
          onClick={handleShare}
          className="flex-1 py-4 bg-brand-yellow hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 font-sans"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-800" /> : <Share2 className="w-4 h-4" />}
          {copied ? '¡Copiado al Portapapeles!' : 'Compartir Resultado'}
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="py-4 px-8 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-2 active:scale-95 font-sans"
        >
          <RefreshCw className="w-4 h-4" /> Jugar de Nuevo
        </button>
      </div>
    </div>
  );
}
