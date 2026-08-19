"use client";

import React, { useState } from 'react';
import { CumbiaPlayer, MusicalRole, CumbiaSubgenre, OriginProvince } from '@/lib/cumbia-sim/types';
import { User, Sparkles, Disc, MapPin, ArrowRight, RefreshCw, Trophy, Repeat } from 'lucide-react';

interface CharacterCreatorProps {
  onStartCareer: (player: CumbiaPlayer) => void;
  savedCareer?: any | null;
  onDeleteSave?: () => void;
  onLoadSave?: () => void;
}

const NICKNAMES_SUGGESTIONS = [
  'El Rey de la Noche',
  'La Joya de la Cumbia',
  'El Mágico',
  'El Bombón Cumbiero',
  'El Titán de la Bailanta',
  'La Voz del Pueblo',
  'El Maestro del Repique',
  'El Príncipe Tropical',
  'La Sombra del Boliche',
  'El Huracán Santiagueño'
];

export const ARGENTINE_PROVINCES: { id: OriginProvince; name: string; icon: string }[] = [
  { id: 'BSAS_ZONA_SUR', name: 'Bs As - Zona Sur (Lomas, Quilmes, Lanús)', icon: '🌴' },
  { id: 'BSAS_ZONA_OESTE', name: 'Bs As - Zona Oeste (La Matanza, Morón, Merlo)', icon: '🔥' },
  { id: 'BSAS_ZONA_NORTE', name: 'Bs As - Zona Norte (Tigre, San Martín, Pilar)', icon: '🚤' },
  { id: 'BSAS_LA_PLATA', name: 'Bs As - La Plata y Alrededores', icon: '🏛️' },
  { id: 'BSAS_COSTA_ATLANTICA', name: 'Bs As - Costa Atlántica (Mar del Plata)', icon: '🌊' },
  { id: 'BSAS_INTERIOR', name: 'Bs As - Interior (Bahía Blanca, Tandil)', icon: '🚜' },
  { id: 'BUENOS_AIRES', name: 'CABA (Capital Federal)', icon: '🏙️' },
  { id: 'SANTA_FE', name: 'Santa Fe (Cumbia Santafesina)', icon: '🪗' },
  { id: 'CORDOBA', name: 'Córdoba (Tierra del Cuarteto)', icon: '🎹' },
  { id: 'SANTIAGO_DEL_ESTERO', name: 'Santiago del Estero (Guaracha)', icon: '💃' },
  { id: 'SALTA', name: 'Salta', icon: '⛰️' },
  { id: 'JUJUY', name: 'Jujuy', icon: '🌵' },
  { id: 'TUCUMAN', name: 'Tucumán', icon: '🍋' },
  { id: 'ENTRE_RIOS', name: 'Entre Ríos', icon: '🌊' },
  { id: 'CORRIENTES', name: 'Corrientes', icon: '🐊' },
  { id: 'MISIONES', name: 'Misiones', icon: '🍃' },
  { id: 'CHACO', name: 'Chaco', icon: '🌾' },
  { id: 'FORMOSA', name: 'Formosa', icon: '☀️' },
  { id: 'MENDOZA', name: 'Mendoza', icon: '🍷' },
  { id: 'SAN_JUAN', name: 'San Juan', icon: '🍇' },
  { id: 'SAN_LUIS', name: 'San Luis', icon: '🏔️' },
  { id: 'LA_RIOJA', name: 'La Rioja', icon: '🎶' },
  { id: 'CATAMARCA', name: 'Catamarca', icon: '⛰️' },
  { id: 'NEUQUEN', name: 'Neuquén', icon: '🎿' },
  { id: 'RIO_NEGRO', name: 'Río Negro', icon: '🍏' },
  { id: 'CHUBUT', name: 'Chubut', icon: '🐋' },
  { id: 'SANTA_CRUZ', name: 'Santa Cruz', icon: '🧊' },
  { id: 'TIERRA_DEL_FUEGO', name: 'Tierra del Fuego', icon: '🐧' },
  { id: 'LA_PAMPA', name: 'La Pampa', icon: '🐎' }
];

export function CharacterCreator({ onStartCareer, savedCareer, onDeleteSave, onLoadSave }: CharacterCreatorProps) {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('La Joya de la Cumbia');
  const [selectedRoles, setSelectedRoles] = useState<MusicalRole[]>(['TIMBALETERO', 'OCTAPAD']);
  const [subgenre, setSubgenre] = useState<CumbiaSubgenre>('CUMBIA_BASE');
  const [originProvince, setOriginProvince] = useState<OriginProvince>('BSAS_ZONA_SUR');

  const handleRandomNickname = () => {
    const random = NICKNAMES_SUGGESTIONS[Math.floor(Math.random() * NICKNAMES_SUGGESTIONS.length)];
    setNickname(random);
  };

  const handleToggleRole = (roleId: MusicalRole) => {
    if (selectedRoles.includes(roleId)) {
      // Permitir deseleccionar si hay más de 1 seleccionado
      if (selectedRoles.length > 1) {
        setSelectedRoles(prev => prev.filter(r => r !== roleId));
      }
    } else {
      if (selectedRoles.length < 2) {
        setSelectedRoles(prev => [...prev, roleId]);
      } else {
        // Si ya hay 2 seleccionados, rotar: reemplazar el primero por el segundo y poner el nuevo al final
        setSelectedRoles(prev => [prev[1], roleId]);
      }
    }
  };

  const handleSwapRoles = () => {
    if (selectedRoles.length === 2) {
      setSelectedRoles([selectedRoles[1], selectedRoles[0]]);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedRoles.length === 0) return;

    let initialTalent = 50;
    let initialCharisma = 50;

    selectedRoles.forEach((r) => {
      if (r === 'TIMBALETERO' || r === 'OCTAPAD' || r === 'CONGUERO' || r === 'GUIRO') {
        initialTalent += 3;
      } else if (r === 'COROS_ANIMADOR' || r === 'CANTANTE') {
        initialCharisma += 4;
      } else if (r === 'ACORDEON' || r === 'GUITARRISTA' || r === 'VIENTOS') {
        initialTalent += 3;
        initialCharisma += 1;
      }
    });

    if (subgenre === 'GUARACHA') initialTalent += 2;
    if (subgenre === 'CUARTETO') initialCharisma += 3;

    const newPlayer: CumbiaPlayer = {
      id: `player_${Date.now()}`,
      name: name.trim(),
      nickname: nickname.trim() || 'El Mágico',
      role: selectedRoles[0],
      secondaryRole: selectedRoles[1] || selectedRoles[0],
      roles: selectedRoles,
      subgenre,
      originProvince,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${name.trim()}`,
      attributes: {
        talent: Math.min(99, initialTalent),
        charisma: Math.min(99, initialCharisma),
        stamina: 60,
        discipline: 55,
        bardo: 20,
        money: 50000
      }
    };

    onStartCareer(newPlayer);
  };

  const calculatedOvr = Math.round(
    ((50 + (selectedRoles.some(r => ['TIMBALETERO', 'OCTAPAD', 'CONGUERO', 'ACORDEON', 'GUITARRISTA', 'VIENTOS', 'GUIRO'].includes(r)) ? 5 : 0)) + 
     (50 + (selectedRoles.some(r => ['COROS_ANIMADOR', 'CANTANTE'].includes(r)) ? 6 : 0))) / 2
  );

  return (
    <div className="max-w-4xl mx-auto bg-[#141821] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* BANNER DE CONTINUAR PARTIDA GUARDADA */}
      {savedCareer && (
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-400/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black text-xl shrink-0 shadow">
              🎤
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                💾 PARTIDA GUARDADA ENCONTRADA
              </span>
              <h3 className="text-lg font-black text-white">
                {savedCareer.player.nickname} ({savedCareer.player.name})
              </h3>
              <p className="text-xs text-white/60 font-mono">
                Edad: {savedCareer.timeline[savedCareer.timeline.length - 1]?.age || 16} años • Banda: {savedCareer.currentBand?.name || 'Independiente'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onLoadSave && (
              <button
                type="button"
                onClick={onLoadSave}
                className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-400 text-black font-black text-sm px-5 py-2.5 rounded-xl transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trophy className="w-4 h-4" /> CONTINUAR CARRERA
              </button>
            )}
            {onDeleteSave && (
              <button
                type="button"
                onClick={onDeleteSave}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Eliminar partida guardada"
              >
                🗑️ Borrar
              </button>
            )}
          </div>
        </div>
      )}

      <div className="text-center space-y-2 relative z-10">
        <span className="text-xs font-black tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full inline-block">
          🇦🇷 CREACIÓN DE FIGURA CUMBIERA
        </span>
        <h1 className="text-3xl md:text-5xl font-black font-yellow text-white tracking-tight uppercase">
          Armá tu Músico Popular
        </h1>
        <p className="text-sm md:text-base text-white/60 max-w-xl mx-auto">
          Elegí tu nombre, <strong className="text-amber-400">tus 2 instrumentos de inicio</strong>, estilo tropical y tu zona o provincia de origen.
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
              placeholder="Ej: Gonzalo, Pablo, Romina..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-white/30 font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-white/70 tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Apodo o Nombre de Escenario
              </span>
              <button
                type="button"
                onClick={handleRandomNickname}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Aleatorio
              </button>
            </label>
            <input
              type="text"
              required
              placeholder="Ej: El Mágico, La Joya..."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-white/30 font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
            />
          </div>
        </div>

        {/* SELECCIÓN DE 2 INSTRUMENTOS / ROLES */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-black uppercase text-white/70 tracking-wider flex items-center gap-2">
              <Disc className="w-4 h-4 text-amber-400" /> Selección de Instrumentos / Roles (Hasta 2)
            </label>
            
            <div className="flex items-center gap-2">
              {selectedRoles.length === 2 && (
                <button
                  type="button"
                  onClick={handleSwapRoles}
                  className="text-xs bg-amber-500/20 border border-amber-400/40 hover:bg-amber-500/30 text-amber-300 font-bold px-3 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Repeat className="w-3.5 h-3.5" /> Invertir 1° y 2°
                </button>
              )}
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                selectedRoles.length === 2 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
              }`}>
                ({selectedRoles.length}/2 SELECCIONADOS)
              </span>
            </div>
          </div>

          <p className="text-xs text-white/50 font-mono">
            Hacé click sobre los instrumentos para elegirlos. Si hacés click en un 3er instrumento, reemplazará al 2° automáticamente.
          </p>

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
            ].map((r) => {
              const isSelected = selectedRoles.includes(r.id as MusicalRole);
              const orderIndex = selectedRoles.indexOf(r.id as MusicalRole);

              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleToggleRole(r.id as MusicalRole)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/10 scale-[1.02]'
                      : 'bg-white/5 border-white/10 hover:border-white/30 text-white/80'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 text-[10px] font-mono font-black bg-amber-500 text-black px-2 py-0.5 rounded-full shadow">
                      {orderIndex === 0 ? '1° PRINCIPAL' : '2° SECUNDARIO'}
                    </span>
                  )}
                  <span className="font-bold text-sm md:text-base">{r.label}</span>
                  <span className="text-[11px] text-white/50 font-mono mt-1">{r.desc}</span>
                </button>
              );
            })}
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

        {/* SELECCIÓN DE ZONA O PROVINCIA */}
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
              <span className="font-bold text-white block">MEDIA INICIAL CALCULADA (2 INSTRUMENTOS)</span>
              Comenzás a los 16 años con $50.000 ARS y contrato inicial directo.
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || selectedRoles.length === 0}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black font-black text-lg px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
          >
            ¡ARRANCAR CARRERA CUMBIERA! <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </form>
    </div>
  );
}
