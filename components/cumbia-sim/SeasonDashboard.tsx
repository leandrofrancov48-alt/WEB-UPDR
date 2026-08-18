"use client";

import React from 'react';
import { CumbiaPlayer, SeasonHistory, Venue } from '@/lib/cumbia-sim/types';
import { Sparkles, Mic, MapPin, DollarSign, Trophy, Play, Music2, AlertCircle } from 'lucide-react';

interface SeasonDashboardProps {
  player: CumbiaPlayer;
  age: number;
  currentVenue: Venue;
  history: SeasonHistory[];
  onTriggerNextSeason: () => void;
  isGameOver: boolean;
}

export function SeasonDashboard({
  player,
  age,
  currentVenue,
  history,
  onTriggerNextSeason,
  isGameOver
}: SeasonDashboardProps) {
  const latestSeason = history[history.length - 1];

  const getRoleIcon = (role: string) => {
    if (role === 'CANTANTE') return '🎤';
    if (role === 'TECLADISTA') return '🎹';
    if (role === 'TIMBALERO') return '🪘';
    if (role === 'BAJISTA') return '🎸';
    return '🎺';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* 1. Header del Músico */}
      <div className="bg-black/60 border border-white/15 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Glow de fondo */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase tracking-widest bg-brand-yellow text-black px-3 py-1 rounded-full">
              {age} AÑOS
            </span>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/10 text-white/80 border border-white/10 px-3 py-1 rounded-full flex items-center gap-1">
              {getRoleIcon(player.role)} {player.role}
            </span>
            <span className="text-xs text-white/50 border border-white/5 px-2.5 py-1 rounded-full font-mono">
              {player.subgenre.replace('_', ' ')}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black font-yellow text-brand-yellow tracking-wide">
            {player.nickname}
          </h1>
          <p className="text-xs text-white/50 font-mono">
            {player.name} • {(player.origin || player.originProvince || 'ARG').replace(/_/g, ' ')}
          </p>
        </div>

        {/* Stats Meters */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full md:w-auto">
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center min-w-[70px]">
            <span className="text-[9px] text-white/40 uppercase font-bold block">Talento</span>
            <span className="text-lg font-black font-yellow text-brand-yellow">{player.attributes.talent}</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center min-w-[70px]">
            <span className="text-[9px] text-white/40 uppercase font-bold block">Carisma</span>
            <span className="text-lg font-black font-yellow text-purple-400">{player.attributes.charisma}</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center min-w-[70px]">
            <span className="text-[9px] text-white/40 uppercase font-bold block">Aguante</span>
            <span className="text-lg font-black font-yellow text-emerald-400">{player.attributes.stamina}</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center min-w-[70px]">
            <span className="text-[9px] text-white/40 uppercase font-bold block">Disciplina</span>
            <span className="text-lg font-black font-yellow text-blue-400">{player.attributes.discipline}</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center min-w-[70px]">
            <span className="text-[9px] text-white/40 uppercase font-bold block">Bardo</span>
            <span className="text-lg font-black font-yellow text-red-400">{player.attributes.bardo}</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center min-w-[90px]">
            <span className="text-[9px] text-white/40 uppercase font-bold block">Billetera</span>
            <span className="text-xs font-black font-mono text-emerald-300 mt-1 block">
              ${(player.attributes.money / 1000000).toFixed(1)}M
            </span>
          </div>
        </div>
      </div>

      {/* 2. Escenario Actual Conquistado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-[#0c1938] to-[#050b1a] border border-white/15 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentVenue.icon}</span>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                currentVenue.category === 'ESTADIO' 
                  ? 'bg-amber-400/20 text-brand-yellow border-brand-yellow/50 animate-pulse'
                  : currentVenue.category === 'ARENA'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-white/10 text-white/70 border-white/10'
              }`}>
                {currentVenue.category === 'ESTADIO' ? '👑 EL MUNDIAL DE LA CUMBIA' : `Nivel ${currentVenue.category}`}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black font-yellow text-white">
              {currentVenue.name}
            </h2>
            <p className="text-xs text-white/60 leading-relaxed">
              {currentVenue.description}
            </p>
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-white/40 pt-4 border-t border-white/10">
            <span>Capacidad: <strong className="text-white">{currentVenue.capacity.toLocaleString('es-AR')} personas</strong></span>
            <span>Ubicación: <strong className="text-white">{currentVenue.location}</strong></span>
          </div>
        </div>

        {/* Resumen de Último Hit */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-yellow block flex items-center gap-1">
              <Music2 className="w-3.5 h-3.5" /> Último Hit de Temporada
            </span>
            <h3 className="text-lg font-bold text-white leading-snug">
              {latestSeason ? latestSeason.hitSongTitle : 'Enganchados de la Placita'}
            </h3>
            <p className="text-xs text-white/50 font-mono">
              {latestSeason ? `${latestSeason.listenersMonthly.toLocaleString('es-AR')} oyentes mensuales` : 'Primeros ensayos'}
            </p>
          </div>

          <div className="space-y-1">
            {latestSeason && latestSeason.awardsWon.length > 0 && (
              <div className="space-y-1">
                {latestSeason.awardsWon.map((award, i) => (
                  <span key={i} className="text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-lg block truncate">
                    {award}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Botón de Acción Principal */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onTriggerNextSeason}
          className="w-full py-5 bg-brand-yellow hover:bg-yellow-400 text-black font-black text-sm md:text-base uppercase tracking-widest rounded-2xl transition-all shadow-[0_10px_35px_rgba(232,212,63,0.35)] hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 font-sans"
        >
          <Play className="w-5 h-5 fill-current" />
          {isGameOver ? 'Ver Resumen Final de Carrera 🏆' : `Avanzar Temporada: A los ${age + 2} Años ➔`}
        </button>
      </div>

      {/* 4. Historial de Temporadas */}
      {history.length > 0 && (
        <div className="bg-black/40 border border-white/10 rounded-3xl p-6 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-white/50 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-brand-yellow" /> Historial de la Carrera
          </h4>
          <div className="space-y-2 overflow-y-auto max-h-56 pr-2">
            {history.slice().reverse().map((h, index) => (
              <div key={index} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-black text-brand-yellow font-mono text-sm">{h.age} años</span>
                  <div>
                    <span className="font-bold text-white">{h.venueConquered.name}</span>
                    <span className="text-[10px] text-white/40 block">Tema: {h.hitSongTitle}</span>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-emerald-400 font-bold">+${(h.moneyEarned / 1000000).toFixed(1)}M</span>
                  <span className="text-[10px] text-white/40 block">{h.showsPlayed} shows</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
