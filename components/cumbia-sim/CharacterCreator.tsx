"use client";

import React, { useState } from 'react';
import { CumbiaPlayer, MusicalRole, CumbiaSubgenre, OriginProvince } from '@/lib/cumbia-sim/types';
import { Sparkles, Dices, User, Music2, MapPin, Disc, Shield, ArrowRight } from 'lucide-react';

interface CharacterCreatorProps {
  onStartCareer: (player: CumbiaPlayer) => void;
}

const NICKNAMES_SUGGESTIONS = [
  'La Joya de la Cumbia',
  'El Pibe de Oro',
  'El Rey del Timbal',
  'El Romántico de la Zona Sur',
  'El Maestro de Santa Fe',
  'La Voz del Norte',
  'El Pibe del Conurbano',
  'El Mágico del Octapad',
  'El Ángel de las Congas',
  'El Rey de la Guaracha'
];

export const ARGENTINE_PROVINCES: { id: OriginProvince; name: string; icon: string }[] = [
  // --- ZONAS Y REGIONES DE BUENOS AIRES ---
  { id: 'BSAS_ZONA_SUR', name: 'BsAs - Zona Sur (Lanús, Varela, Avellaneda, Lomas)', icon: '🏙️' },
  { id: 'BSAS_ZONA_OESTE', name: 'BsAs - Zona Oeste (La Matanza, Morón, Merlo, Moreno)', icon: '🏭' },
  { id: 'BSAS_ZONA_NORTE', name: 'BsAs - Zona Norte (San Martín, San Isidro, Tigre, Pilar)', icon: '⛵' },
  { id: 'BSAS_LA_PLATA', name: 'BsAs - La Plata & Alrededores', icon: '🏛️' },
  { id: 'BSAS_COSTA_ATLANTICA', name: 'BsAs - Mar del Plata & Costa Atlántica', icon: '🌊' },
  { id: 'BSAS_INTERIOR', name: 'BsAs - Interior (Bahía Blanca, Tandil, Pergamino)', icon: '🌾' },
  { id: 'BUENOS_AIRES', name: 'Buenos Aires Capital (CABA)', icon: '🏙️' },

  // --- RESTO DE LAS PROVINCIAS ARGENTINAS ---
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
  const [originProvince, setOriginProvince] = useState<OriginProvince>('BSAS_ZONA_SUR');

  const handleRandomNickname = () => {
    const random = NICKNAMES_SUGGESTIONS[Math.floor(Math.random() * NICKNAMES_SUGGESTIONS.length)];
    setNickname(random);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Stats iniciales ajustadas según el instrumento y subgénero elegido
    let initialTalent = 50;
    let initialCharisma = 50;

    if (role === 'TIMBALETERO' || role === 'OCTAPAD' || role === 'CONGUERO') {
      initialTalent += 5;
    } else if (role === 'COROS_ANIMADOR' || role === 'CANTANTE') {
      initialCharisma += 6;
    } else if (role === 'ACORDEON' || role === 'GUITARRISTA' || role === 'VIENTOS') {
      initialTalent += 4;
      initialCharisma += 2;
    }

    if (subgenre === 'GUARACHA') initialTalent += 2;
    if (subgenre === 'CUARTETO') initialCharisma += 3;

    const newPlayer: CumbiaPlayer = {
      id: `player_${Date.now()}`,
      name: name.trim(),
      nickname: nickname.trim() || 'El Mágico',
      role,
      subgenre,
      originProvince,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${name.trim()}`,
      attributes: {
        talent: Math.min(99, initialTalent),
        charisma: Math.min(99, initialCharisma),
        stamina: 60,
        discipline: 55,
        bardo: 20,
        money: 50000 // $50K ARS base
      }
    };

    onStartCareer(newPlayer);
  };

  const calculatedOvr = Math.round(
    ((role === 'TIMBALETERO' || role === 'OCTAPAD' || role === 'CONGUERO' ? 55 : 50) + 
     (role === 'COROS_ANIMADOR' || role === 'CANTANTE' ? 56 : 50)) / 2
  );

  return (
    <div className="max-w-4xl mx-auto bg-[#141821] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="text-center space-y-2 relative z-10">
        <span className="text-xs font-black tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full inline-block">
          🇦🇷 CREACIÓN DE FIGURA CUMBIERA
        </span>
        <h1 className="text-3xl md:text-5xl font-black font-yellow text-white tracking-tight uppercase">
          Armá tu Músico Popular
        </h1>
        <p className="text-sm md:text-base text-white/60 max-w-xl mx-auto">
          Elegí tu nombre, tu instrumento de inicio, estilo tropical y tu zona o provincia de origen.
        </p>
      </div>

      <form onSubmit={handleCreate} className="space-y-8 relative z-10">
        
        {/* CAMPOS DE NOMBRE Y APODO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-white/70 tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" /> Nombre Real o Artístico
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Pablo Lescano, El Polaco, Román..."
              className="w-full bg-white/5 border border-white/15 focus:border-amber-400 rounded-2xl px-5 py-3.5 text-white placeholder:text-white/30 text-base font-bold focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-white/70 tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Apodo de la Noche
              </span>
              <button
                type="button"
                onClick={handleRandomNickname}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 cursor-pointer"
              >
                <Dices className="w-3.5 h-3.5" /> Aleatorio
              </button>
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Ej: La Joya, El Mágico, El Rey..."
              className="w-full bg-white/5 border border-white/15 focus:border-amber-400 rounded-2xl px-5 py-3.5 text-amber-300 placeholder:text-white/30 text-base font-bold focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* SELECCIÓN DE INSTRUMENTO / ROL EN LA BANDA (9 OPCIONES) */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase text-white/70 tracking-wider flex items-center gap-2">
            <Music2 className="w-4 h-4 text-amber-400" /> Instrumento / Rol de Inicio (A los 16 Años)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
            {[
              { id: 'TIMBALETERO', label: '🪘 Timbaletero', desc: 'Repique y ritmo' },
              { id: 'GUITARRISTA', label: '🎸 Guitarrista', desc: 'Punteos y virtuosismo' },
              { id: 'VIENTOS', label: '🎺 Vientos', desc: 'Trompeta y saxo' },
              { id: 'ACORDEON', label: '🪗 Acordeonista', desc: 'Melodía sabrosa' },
              { id: 'GUIRO', label: '🪇 Güiro', desc: 'Sabor y cadencia' },
              { id: 'OCTAPAD', label: '🎛️ Octapad', desc: 'Efectos y fiesta' },
              { id: 'CONGUERO', label: '🥁 Conguero', desc: 'Base percusionista' },
              { id: 'COROS_ANIMADOR', label: '🎙️ Coros & Animación', desc: 'Arenga al público' },
              { id: 'CANTANTE', label: '🎤 Cantante Líder', desc: 'Voz principal' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id as MusicalRole)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  role === r.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/10 scale-[1.02]'
                    : 'bg-white/5 border-white/10 hover:border-white/30 text-white/80'
                }`}
              >
                <span className="font-bold text-sm md:text-base">{r.label}</span>
                <span className="text-[11px] text-white/50 font-mono mt-1">{r.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SELECCIÓN DE SUBGÉNERO */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase text-white/70 tracking-wider flex items-center gap-2">
            <Disc className="w-4 h-4 text-amber-400" /> Estilo / Subgénero Musical
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'CUMBIA_BASE', label: '🔥 Cumbia Base', desc: 'Ritmo clásico bailable' },
              { id: 'CUMBIA_NORTENA', label: '🪗 Cumbia Norteña', desc: 'Acordeón y peñas' },
              { id: 'CUARTETO', label: '🎹 Cuarteto', desc: 'Tutti y baile cordobés' },
              { id: 'GUARACHA', label: '💃 Guaracha', desc: 'Velocidad santiagueña' }
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSubgenre(sub.id as CumbiaSubgenre)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  subgenre === sub.id
                    ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-lg shadow-purple-500/10 scale-[1.02]'
                    : 'bg-white/5 border-white/10 hover:border-white/30 text-white/80'
                }`}
              >
                <span className="font-bold text-sm md:text-base block">{sub.label}</span>
                <span className="text-[11px] text-white/50 font-mono mt-1 block">{sub.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SELECCIÓN DE ZONA / PROVINCIA DE ORIGEN DE BUENOS AIRES Y ARGENTINA */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase text-white/70 tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" /> Zona o Provincia de Origen
            </span>
            <span className="text-[11px] text-white/40 font-mono">
              Todas las zonas de Buenos Aires + 22 Provincias
            </span>
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-2 bg-white/[0.02] border border-white/10 rounded-2xl scrollbar-thin scrollbar-thumb-white/20">
            {ARGENTINE_PROVINCES.map((prov) => (
              <button
                key={prov.id}
                type="button"
                onClick={() => setOriginProvince(prov.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                  originProvince === prov.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-md'
                    : 'bg-white/5 border-white/5 hover:border-white/20 text-white/70'
                }`}
              >
                <span className="text-lg shrink-0">{prov.icon}</span>
                <span className="text-xs md:text-sm truncate">{prov.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* BOTÓN DE ARRANQUE */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-black flex flex-col items-center justify-center font-black font-yellow shadow-lg shadow-amber-500/20 shrink-0">
              <span className="text-[10px] uppercase tracking-widest text-black/70">OVR</span>
              <span className="text-2xl leading-none">{calculatedOvr}</span>
            </div>
            <div className="text-xs text-white/60">
              <span className="font-bold text-white block">MEDIA INICIAL CALCULADA</span>
              Comenzás a los 16 años con $50.000 ARS y contrato inicial directo.
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black font-black text-lg px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
          >
            ¡ARRANCAR CARRERA CUMBIERA! <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </form>
    </div>
  );
}
