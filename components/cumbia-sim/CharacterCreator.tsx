"use client";

import React, { useState } from 'react';
import { CumbiaPlayer, CumbiaSubgenre, MusicalRole, OriginZone } from '@/lib/cumbia-sim/types';
import { Mic, Music, Sparkles, Disc, Flame, Shield, MapPin, Shuffle } from 'lucide-react';

interface CharacterCreatorProps {
  onStartCareer: (player: CumbiaPlayer) => void;
}

const NICKNAMES_SUGGESTIONS = [
  'El Polaco de Fiorito',
  'La Joya de Varela',
  'El Maestro de Pacheco',
  'El Ángel de Morón',
  'El Pibe de Lanús',
  'El Mago del Teclado',
  'La Voz de Oro',
  'El Rey de Casanova'
];

export function CharacterCreator({ onStartCareer }: CharacterCreatorProps) {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('La Joya de Varela');
  const [role, setRole] = useState<MusicalRole>('CANTANTE');
  const [subgenre, setSubgenre] = useState<CumbiaSubgenre>('CUMBIA_VILLERA');
  const [origin, setOrigin] = useState<OriginZone>('ZONA_SUR');

  const handleRandomNickname = () => {
    const random = NICKNAMES_SUGGESTIONS[Math.floor(Math.random() * NICKNAMES_SUGGESTIONS.length)];
    setNickname(random);
  };

  const getInitialAttributes = (role: MusicalRole, subgenre: CumbiaSubgenre) => {
    let talent = 55;
    let charisma = 55;
    let stamina = 60;
    let discipline = 50;

    if (role === 'CANTANTE') {
      charisma += 10;
      talent += 5;
    } else if (role === 'TECLADISTA') {
      talent += 15;
      discipline += 5;
    } else if (role === 'TIMBALERO') {
      stamina += 15;
      charisma += 5;
    } else if (role === 'BAJISTA') {
      talent += 10;
      stamina += 10;
    } else if (role === 'VIENTOS') {
      talent += 12;
      charisma += 8;
    }

    if (subgenre === 'CUMBIA_VILLERA') {
      stamina += 5;
      charisma += 5;
    } else if (subgenre === 'CUMBIA_SANTAFESINA') {
      talent += 8;
    }

    return {
      talent,
      charisma,
      stamina,
      discipline,
      bardo: 10,
      money: 50000
    };
  };

  const currentAttributes = getInitialAttributes(role, subgenre);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPlayer: CumbiaPlayer = {
      name: name.trim(),
      nickname: nickname.trim() || name.trim(),
      role,
      subgenre,
      origin,
      avatarSeed: Math.random().toString(36).substring(2, 9),
      attributes: currentAttributes
    };

    onStartCareer(newPlayer);
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#141821] border border-white/15 rounded-3xl p-6 md:p-12 shadow-2xl space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> Modo Carrera Tropical
        </span>
        <h1 className="text-3xl md:text-5xl font-black font-yellow text-white uppercase tracking-wider">
          Creá tu Leyenda de la Cumbia
        </h1>
        <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Elegí tu instrumento, tus raíces y tu estilo. Empezá desde la placita del barrio y tomá decisiones para llegar a llenar el Estadio Monumental.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Paso 1: Identidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-bold text-white/90 uppercase tracking-wider">Nombre Real</label>
            <input 
              type="text"
              required
              placeholder="Ej: Leandro Gómez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-2xl px-5 py-3.5 text-base text-white focus:border-amber-400 outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs md:text-sm font-bold text-white/90 uppercase tracking-wider">Apodo Artístico</label>
              <button 
                type="button"
                onClick={handleRandomNickname}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-bold"
              >
                <Shuffle className="w-3.5 h-3.5" /> Aleatorio
              </button>
            </div>
            <input 
              type="text"
              required
              placeholder="Ej: La Joya de Varela"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-2xl px-5 py-3.5 text-base text-amber-400 font-bold focus:border-amber-400 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Paso 2: Rol Musical */}
        <div className="space-y-3">
          <label className="text-xs md:text-sm font-bold text-white/90 uppercase tracking-wider flex items-center gap-2">
            <Mic className="w-4 h-4 text-amber-400" /> Elegí tu Rol en la Banda
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { id: 'CANTANTE', label: '🎤 Cantante', desc: '+Carisma y Fama' },
              { id: 'TECLADISTA', label: '🎹 Tecladista', desc: '+Virtuosismo (Roland)' },
              { id: 'TIMBALERO', label: '🪘 Timbalero', desc: '+Aguante y Ritmo' },
              { id: 'BAJISTA', label: '🎸 Bajista', desc: '+Groove y Base' },
              { id: 'VIENTOS', label: '🎺 Vientos / Acordeón', desc: '+Magia Santafesina' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRole(item.id as MusicalRole)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  role === item.id 
                    ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <span className="text-sm font-black text-white">{item.label}</span>
                <span className="text-xs text-white/50 mt-1">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Paso 3: Subgénero y Origen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2.5">
            <label className="text-xs md:text-sm font-bold text-white/90 uppercase tracking-wider flex items-center gap-2">
              <Disc className="w-4 h-4 text-emerald-400" /> Subgénero Principal
            </label>
            <select
              value={subgenre}
              onChange={(e) => setSubgenre(e.target.value as CumbiaSubgenre)}
              className="w-full bg-neutral-900 border border-white/15 rounded-2xl px-4 py-3.5 text-sm md:text-base text-white focus:border-amber-400 outline-none transition-colors cursor-pointer"
            >
              <option value="CUMBIA_VILLERA">🔥 Cumbia Villera (Sonido Callejero)</option>
              <option value="CUMBIA_SANTAFESINA">🎺 Cumbia Santafesina (Guitarra & Acordeón)</option>
              <option value="CUMBIA_ROMANTICA">❤️ Cumbia Romántica / Clásica</option>
              <option value="CUMBIA_RKT">🚀 Cumbia RKT / Sonido Turreo</option>
              <option value="CUMBIA_POP">✨ Cumbia Pop / Boliche Moderno</option>
              <option value="CUARTETO">🎹 Cuarteto Cordobés</option>
            </select>
          </div>

          <div className="space-y-2.5">
            <label className="text-xs md:text-sm font-bold text-white/90 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" /> Barrio / Origen
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value as OriginZone)}
              className="w-full bg-neutral-900 border border-white/15 rounded-2xl px-4 py-3.5 text-sm md:text-base text-white focus:border-amber-400 outline-none transition-colors cursor-pointer"
            >
              <option value="ZONA_SUR">Zona Sur (Lanús, Varela, Quilmes, Avellaneda)</option>
              <option value="ZONA_OESTE">Zona Oeste (Morón, Casanova, Moreno, Laferrere)</option>
              <option value="ZONA_NORTE">Zona Norte (Pacheco, Tigre, San Martín, José C. Paz)</option>
              <option value="SANTA_FE">Santa Fe Capital & Rosario</option>
              <option value="CORDOBA">Córdoba Capital</option>
              <option value="INTERIOR">Interior del País</option>
            </select>
          </div>
        </div>

        {/* Preview de Stats Iniciales */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 space-y-4">
          <span className="text-xs font-black text-white/60 uppercase tracking-widest block">
            Estadísticas Base a los 16 años:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-white/50 font-bold uppercase block">Talento (OVR)</span>
              <span className="text-2xl font-black font-yellow text-amber-400 mt-0.5 block">{currentAttributes.talent}</span>
            </div>
            <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-white/50 font-bold uppercase block">Carisma</span>
              <span className="text-2xl font-black font-yellow text-purple-400 mt-0.5 block">{currentAttributes.charisma}</span>
            </div>
            <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-white/50 font-bold uppercase block">Aguante</span>
              <span className="text-2xl font-black font-yellow text-emerald-400 mt-0.5 block">{currentAttributes.stamina}</span>
            </div>
            <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-white/50 font-bold uppercase block">Disciplina</span>
              <span className="text-2xl font-black font-yellow text-blue-400 mt-0.5 block">{currentAttributes.discipline}</span>
            </div>
          </div>
        </div>

        {/* Botón de Comienzo */}
        <button
          type="submit"
          className="w-full py-5 bg-amber-500 hover:bg-amber-400 text-black font-black text-sm md:text-base uppercase tracking-widest rounded-2xl transition-all shadow-[0_10px_35px_rgba(245,158,11,0.35)] hover:scale-[1.01] active:scale-95 cursor-pointer"
        >
          🚀 Arrancar Carrera Musical (A los 16 años)
        </button>
      </form>
    </div>
  );
}
