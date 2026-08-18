"use client";

import React, { useState } from 'react';
import { CumbiaPlayer, LegacyTier, SeasonHistory } from '@/lib/cumbia-sim/types';
import { calculateLegacyTier } from '@/lib/cumbia-sim/simulation';
import { Trophy, Sparkles, RefreshCw, Share2, Crown, Music2, Star, Check, AlertOctagon, Disc } from 'lucide-react';

interface CareerEndCardProps {
  player: CumbiaPlayer;
  history: SeasonHistory[];
  earlyRetireReason?: string | null;
  onRestart: () => void;
}

export function CareerEndCard({ player, history, earlyRetireReason, onRestart }: CareerEndCardProps) {
  const [copied, setCopied] = useState(false);
  const legacy = calculateLegacyTier(player, history, earlyRetireReason);

  const totalShows = history.reduce((acc, h) => acc + h.showsPlayed, 0);
  const totalMoney = player.attributes.money;
  const maxListeners = Math.max(...history.map(h => h.listenersMonthly), 0);
  const finalAge = history[history.length - 1]?.age || 38;
  const finalOvr = Math.round((player.attributes.talent + player.attributes.charisma) / 2);

  const allAwards = Array.from(new Set(history.flatMap(h => h.awardsWon)));

  const handleShare = () => {
    const text = `🎶 ¡Terminé mi carrera en el Simulador de Cumbia de Un Poco de Ruido!\n👑 Nivel alcanzado: ${legacy.title}\n🎤 Artista: ${player.nickname} (${finalOvr} OVR - Retirado a los ${finalAge} años)\n🏟️ Shows totales: ${totalShows}\n🔥 ¡Jugá vos también!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* ================= FIGURITA COLECCIONABLE DEL ÁLBUM UPDR ================= */}
      <div className="max-w-sm mx-auto bg-gradient-to-b from-[#2a2208] via-[#141821] to-[#0a0d14] border-4 border-amber-400 rounded-3xl p-6 shadow-[0_0_60px_rgba(245,158,11,0.3)] relative overflow-hidden text-center space-y-5 animate-scaleUp">
        {/* Efecto holográfico de fondo */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-amber-400/20 via-orange-500/10 to-transparent pointer-events-none"></div>

        {/* Encabezado del Cromo */}
        <div className="flex items-center justify-between border-b border-amber-400/30 pb-3 relative z-10 font-mono text-xs">
          <span className="font-black text-amber-300 bg-amber-500/20 border border-amber-400/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> FIGURITA N° 00
          </span>
          <span className="font-black text-white/70">ÁLBUM UPDR</span>
        </div>

        {/* Avatar / Badge central */}
        <div className="relative w-28 h-28 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 border-2 border-amber-300 flex flex-col items-center justify-center shadow-xl">
          <span className="text-4xl">🎤</span>
          <div className="absolute -bottom-3 bg-black border border-amber-400 text-amber-300 font-mono font-black text-xs px-3 py-0.5 rounded-full shadow">
            {finalOvr} OVR
          </div>
        </div>

        {/* Nombre & Datos del Cromo */}
        <div className="space-y-1 relative z-10 pt-2">
          <h2 className="text-2xl font-black font-yellow text-amber-400 uppercase tracking-wide">
            {player.nickname}
          </h2>
          <p className="text-xs text-white/80 font-mono font-semibold">
            {player.role.replace(/_/g, ' ')} • {player.subgenre.replace(/_/g, ' ')}
          </p>
          <p className="text-[11px] text-white/50 font-mono">
            Orígenes: {player.originProvince.replace(/_/g, ' ')}
          </p>
        </div>

        {/* Estadísticas de la Figurita */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-amber-400/20 font-mono text-center">
          <div className="bg-black/40 p-2 rounded-xl border border-white/5">
            <span className="text-[9px] text-white/40 font-bold block">TALENTO</span>
            <span className="text-sm font-black text-amber-400">{player.attributes.talent}</span>
          </div>
          <div className="bg-black/40 p-2 rounded-xl border border-white/5">
            <span className="text-[9px] text-white/40 font-bold block">CARISMA</span>
            <span className="text-sm font-black text-amber-400">{player.attributes.charisma}</span>
          </div>
          <div className="bg-black/40 p-2 rounded-xl border border-white/5">
            <span className="text-[9px] text-white/40 font-bold block">SHOWS</span>
            <span className="text-sm font-black text-emerald-400">{totalShows}</span>
          </div>
        </div>

        {/* Sello de Autenticidad */}
        <div className="text-[10px] text-amber-400/80 font-mono tracking-widest uppercase border-t border-amber-400/20 pt-2">
          ★ FIGURITA COLECCIONABLE OFICIAL UN POCO DE RUIDO ★
        </div>
      </div>

      {/* Tarjeta Visual de Legado Completo */}
      <div className="bg-gradient-to-b from-[#111f44] via-[#091126] to-black border-2 border-amber-400/50 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden text-center space-y-6">
        
        {/* Badge de Legado */}
        <div className="flex justify-center">
          <span className={`text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-lg ${
            earlyRetireReason 
              ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
              : 'bg-amber-400 text-black'
          }`}>
            {earlyRetireReason ? <AlertOctagon className="w-4 h-4 text-red-400" /> : <Crown className="w-4 h-4" />}
            {legacy.badge} • RETIRADO A LOS {finalAge} AÑOS
          </span>
        </div>

        {/* Nombre y Rol */}
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black font-yellow text-amber-400 tracking-wider uppercase">
            {player.nickname}
          </h1>
          <p className="text-xs md:text-sm text-white/60 font-mono">
            {player.name} • {player.role.replace(/_/g, ' ')} de {player.subgenre.replace(/_/g, ' ')}
          </p>
        </div>

        {/* Veredicto de la Carrera */}
        <div className={`border rounded-2xl p-5 md:p-6 max-w-xl mx-auto space-y-2 ${
          earlyRetireReason 
            ? 'bg-red-500/10 border-red-500/30' 
            : 'bg-white/5 border-white/10'
        }`}>
          <h3 className="text-base md:text-lg font-black text-white font-yellow uppercase text-amber-300">
            {legacy.title}
          </h3>
          <p className="text-xs md:text-sm text-white/80 leading-relaxed">
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
            <span className="text-xl font-black font-yellow text-amber-400">
              {finalOvr}
            </span>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={handleShare}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black font-black text-sm px-6 py-3.5 rounded-2xl transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-black" /> : <Share2 className="w-4 h-4" />}
            {copied ? '¡COPIADO PARA COMPARTIR!' : 'COMPARTIR RESULTADO'}
          </button>

          <button
            onClick={onRestart}
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-6 py-3.5 rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            JUGAR OTRA CARRERA
          </button>
        </div>

      </div>

    </div>
  );
}
