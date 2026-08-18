"use client";

import React, { useState } from 'react';
import { CumbiaPlayer, CumbiaSubgenre, MusicalRole, OriginProvince } from '@/lib/cumbia-sim/types';
import { Mic, Music, Sparkles, Disc, Flame, Shield, MapPin, Shuffle } from 'lucide-react';

interface CharacterCreatorProps {
  onStartCareer: (player: CumbiaPlayer) => void;
}

const NICKNAMES_SUGGESTIONS = [
  'El Rey del Güiro',
  'El Mago del Acordeón',
  'La Joya de Córdoba',
  'El Maestro de Santa Fe',
  'La Voz del Norte',
  'El Pibe de Buenos Aires',
  'El Mágico del Octapad',
  'El Ángel de las Congas',
  'El Rey de la Guaracha'
];

export const ARGENTINE_PROVINCES: { id: OriginProvince; name: string; icon: string }[] = [
  { id: 'BUENOS_AIRES', name: 'Buenos Aires', icon: '🏙️' },
  { id: 'CORDOBA', name: 'Córdoba', icon: '🎹' },
  { id: 'SANTA_FE', name: 'Santa Fe', icon: '🪗' },
  { id: 'SANTIAGO_DEL_ESTERO', name: 'Santiago del Estero', icon: '💃' },
  { id: 'TUCUMAN', name: 'Tucumán', icon: '🍋' },
  { id: 'SALTA', name: 'Salta', icon: '🏜️' },
  { id: 'JUJUY', name: 'Jujuy', icon: '🏔️' },
  { id: 'ENTRE_RIOS', name: 'Entre Ríos', icon: '🌊' },
  { id: 'CORRIENTES', name: 'Corrientes', icon: '🐊' },
  { id: 'MENDOZA', name: 'Mendoza', icon: '🍷' },
  { id: 'CHACO', name: 'Chaco', icon: '🌿' },
  { id: 'MISIONES', name: 'Misiones', icon: '🏞️' },
  { id: 'SAN_LUIS', name: 'San Luis', icon: '⛰️' },
  { id: 'SAN_JUAN', name: 'San Juan', icon: '☀️' },
  { id: 'LA_RIOJA', name: 'La Rioja', icon: '🌵' },
  { id: 'CATAMARCA', name: 'Catamarca', icon: '⛰️' },
  { id: 'FORMOSA', name: 'Formosa', icon: '🌳' },
  { id: 'NEUQUEN', name: 'Neuquén', icon: '🌲' },
  { id: 'RIO_NEGRO', name: 'Río Negro', icon: '🍏' },
  { id: 'CHUBUT', name: 'Chubut', icon: '🐋' },
  { id: 'SANTA_CRUZ', name: 'Santa Cruz', icon: '🧊' },
  { id: 'TIERRA_DEL_FUEGO', name: 'Tierra del Fuego', icon: '❄️' },
  { id: 'LA_PAMPA', name: 'La Pampa', icon: '🌾' },
];

export function CharacterCreator({ onStartCareer }: CharacterCreatorProps) {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('La Joya de la Cumbia');
  const [role, setRole] = useState<MusicalRole>('TIMBALETERO');
  const [subgenre, setSubgenre] = useState<CumbiaSubgenre>('CUMBIA_BASE');
  const [originProvince, setOriginProvince] = useState<OriginProvince>('BUENOS_AIRES');

  const handleRandomNickname = () => {
    const random = NICKNAMES_SUGGESTIONS[Math.floor(Math.random() * NICKNAMES_SUGGESTIONS.length)];
    setNickname(random);
  };

  const getInitialAttributes = (role: MusicalRole, subgenre: CumbiaSubgenre) => {
    let talent = 48;
    let charisma = 48;
    let stamina = 50;
    let discipline = 45;

    if (role === 'CANTANTE') {
      charisma += 5;
      talent += 2;
    } else if (role === 'TIMBALETERO') {
      stamina += 5;
      charisma += 2;
    } else if (role === 'GUITARRISTA') {
      talent += 4;
      discipline += 2;
    } else if (role === 'VIENTOS') {
      talent += 3;
      charisma += 3;
    } else if (role === 'ACORDEON') {
      talent += 5;
    } else if (role === 'GUIRO') {
      stamina += 4;
      charisma += 3;
    } else if (role === 'OCTAPAD') {
      talent += 3;
      stamina += 3;
    } else if (role === 'CONGUERO') {
      stamina += 4;
      charisma += 2;
    } else if (role === 'COROS_ANIMADOR') {
      charisma += 5;
      stamina += 3;
    }

    if (subgenre === 'CUMBIA_BASE') {
      stamina += 2;
      charisma += 2;
    } else if (subgenre === 'CUMBIA_NORTENA') {
      talent += 3;
    } else if (subgenre === 'CUARTETO') {
      charisma += 4;
      stamina += 3;
    } else if (subgenre === 'GUARACHA') {
      stamina += 5;
      charisma += 2;
    }

    return {
      talent,
      charisma,
      stamina,
      discipline,
      bardo: 5,
      money: 25000
    };
  };

  const currentAttributes = getInitialAttributes(role, subgenre);
  const startingOvr = Math.round((currentAttributes.talent + currentAttributes.charisma) / 2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPlayer: CumbiaPlayer = {
      id: Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      nickname: nickname.trim() || name.trim(),
      role,
      subgenre,
      originProvince,
      origin: originProvince,
      avatarUrl: '',
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
        <h1 className="text-3xl md:text-5xl font-black text-white font-yellow tracking-wide">
          CREÁ TU MÚSICO DE CUMBIA
        </h1>
        <p className="text-sm md:text-base text-white/60 max-w-xl mx-auto">
          Arrancás a los 16 años desde tu provincia. Construí tu legado tropical paso a paso.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Nombre y Apodo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-white/70 uppercase">Nombre y Apellido</label>
            <input
              type="text"
              required
              placeholder="Ej: Rodrigo Tapari"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1c2230] border border-white/15 rounded-2xl px-5 py-4 text-white font-bold placeholder-white/30 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold text-white/70 uppercase">Apodo Artístico</label>
              <button
                type="button"
                onClick={handleRandomNickname}
                className="text-[11px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <Shuffle className="w-3 h-3" /> Aleatorio
              </button>
            </div>
            <input
              type="text"
              placeholder="Ej: El Mago del Acordeón"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-[#1c2230] border border-white/15 rounded-2xl px-5 py-4 text-white font-bold placeholder-white/30 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        </div>

        {/* Rol / Instrumento */}
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold text-white/70 uppercase block">
            Rol Inicial en la Banda (Instrumento o Animación)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
            {[
              { id: 'TIMBALETERO', label: '🪘 TIMBALETERO', sub: 'Timbales & Percusión' },
              { id: 'GUITARRISTA', label: '🎸 GUITARRISTA', sub: 'Guitarra Tropical' },
              { id: 'VIENTOS', label: '🎺 VIENTOS', sub: 'Trompeta & Vientos' },
              { id: 'ACORDEON', label: '🪗 ACORDEON', sub: 'Acordeón Cumbiero' },
              { id: 'GUIRO', label: '🪇 GUIRO', sub: 'Güiro Cumbiero' },
              { id: 'OCTAPAD', label: '🎛️ OCTAPAD', sub: 'Octapad & Electrónica' },
              { id: 'CONGUERO', label: '🥁 CONGUERO', sub: 'Congas & Tumbadoras' },
              { id: 'COROS_ANIMADOR', label: '🎙️ COROS / ANIMADOR', sub: 'Animación & Vueltas' },
              { id: 'CANTANTE', label: '🎤 CANTANTE', sub: 'Voz Líder' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id as MusicalRole)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  role === r.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/10'
                    : 'bg-[#1c2230] border-white/10 text-white/70 hover:border-white/30'
                }`}
              >
                <div className="font-bold text-sm">{r.label}</div>
                <div className="text-[11px] text-white/50 font-mono mt-0.5">{r.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Subgénero Musical */}
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold text-white/70 uppercase block">Subgénero Musical Principal</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'CUMBIA_BASE', label: '🔥 CUMBIA BASE', desc: 'Bases potentes y timbales' },
              { id: 'CUMBIA_NORTENA', label: '🪗 CUMBIA NORTEÑA', desc: 'Acordeón, güiro y sentimiento' },
              { id: 'CUARTETO', label: '🎹 CUARTETO', desc: 'Tutti, piano y fiesta cordobesa' },
              { id: 'GUARACHA', label: '💃 GUARACHA', desc: 'Velocidad, repique y guarachón' },
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSubgenre(sub.id as CumbiaSubgenre)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  subgenre === sub.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/10'
                    : 'bg-[#1c2230] border-white/10 text-white/70 hover:border-white/30'
                }`}
              >
                <div className="font-bold text-sm">{sub.label}</div>
                <div className="text-[11px] text-white/50 font-mono mt-1">{sub.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Provincia de Origen */}
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold text-white/70 uppercase block">Provincia de Origen</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto custom-scrollbar p-1">
            {ARGENTINE_PROVINCES.map((prov) => (
              <button
                key={prov.id}
                type="button"
                onClick={() => setOriginProvince(prov.id)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                  originProvince === prov.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-[#1c2230] border-white/10 text-white/70 hover:border-white/30'
                }`}
              >
                <span className="text-lg">{prov.icon}</span>
                <span className="font-bold text-xs truncate">{prov.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Resumen de Stats Iniciales */}
        <div className="bg-[#1c2230] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 font-mono">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-black font-black text-3xl flex items-center justify-center shadow-lg">
              {startingOvr}
            </div>
            <div>
              <div className="text-xs text-white/50 font-bold uppercase">OVR INICIAL A LOS 16 AÑOS</div>
              <div className="text-lg font-bold text-white">Nivel Promesa Tropical</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-[10px] text-white/50 font-bold">TALENTO</div>
              <div className="text-base font-bold text-amber-400">{currentAttributes.talent}</div>
            </div>
            <div>
              <div className="text-[10px] text-white/50 font-bold">CARISMA</div>
              <div className="text-base font-bold text-amber-400">{currentAttributes.charisma}</div>
            </div>
            <div>
              <div className="text-[10px] text-white/50 font-bold">AGUANTE</div>
              <div className="text-base font-bold text-amber-400">{currentAttributes.stamina}</div>
            </div>
            <div>
              <div className="text-[10px] text-white/50 font-bold">MONEDA</div>
              <div className="text-base font-bold text-emerald-400">$25K</div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black text-lg py-5 rounded-2xl transition-all shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-95 cursor-pointer uppercase tracking-wider"
        >
          🚀 ARRANCAR CARRERA A LOS 16 AÑOS
        </button>

      </form>
    </div>
  );
}
