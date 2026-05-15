"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Music, Mic2, ArrowRight, MapPin, Search, User, Map as MapIcon, LayoutGrid } from "lucide-react";
import dynamic from "next/dynamic";

const ArtistMap = dynamic(() => import("./artist-map"), { 
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-white/5 rounded-[2rem] animate-pulse flex items-center justify-center text-white/20 uppercase tracking-widest text-xs font-bold">Cargando Mapa...</div>
});

interface Band {
  id: string;
  name: string;
  genre: string | null;
  city: string | null;
  profilePic: string | null;
  bio: string | null;
  _count: { members: number };
  latitude: number | null;
  longitude: number | null;
}

interface Musician {
  id: string;
  username: string;
  nombre: string;
  apellido: string;
  instrument: string | null;
  profilePic: string | null;
  bio: string | null;
  latitude: number | null;
  longitude: number | null;
}

export function ArtistasGallery({ bands, musicians }: { bands: Band[]; musicians: Musician[] }) {
  const [view, setView] = useState<'bands' | 'musicians'>('bands');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [search, setSearch] = useState("");

  const filteredBands = bands.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    (b.genre?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const filteredMusicians = musicians.filter(m => 
    m.nombre.toLowerCase().includes(search.toLowerCase()) || 
    (m.instrument?.toLowerCase() || "").includes(search.toLowerCase()) ||
    m.username.toLowerCase().includes(search.toLowerCase())
  );
  
  // Prepare markers for the map
  const bandMarkers = filteredBands
    .filter(b => b.latitude && b.longitude)
    .map(b => ({
      id: b.id,
      name: b.name,
      type: "band" as const,
      lat: b.latitude!,
      lng: b.longitude!,
      profilePic: b.profilePic || undefined,
      genreOrInstrument: b.genre || "Cumbia",
      city: b.city || undefined,
    }));

  const musicianMarkers = filteredMusicians
    .filter(m => m.latitude && m.longitude)
    .map(m => ({
      id: m.id,
      name: m.nombre,
      type: "musician" as const,
      lat: m.latitude!,
      lng: m.longitude!,
      profilePic: m.profilePic || undefined,
      genreOrInstrument: m.instrument || "Músico",
      city: undefined, // Musicians don't have city directly in User model currently
    }));

  const mapArtists = view === 'bands' ? bandMarkers : musicianMarkers;

  return (
    <div className="space-y-12">
      {/* Tabs and Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 w-full md:w-auto">
          <button
            onClick={() => setView('bands')}
            className={`flex-1 md:px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
              view === 'bands' ? 'bg-brand-yellow text-black' : 'text-white/40 hover:text-white'
            }`}
          >
            Bandas
          </button>
          <button
            onClick={() => setView('musicians')}
            className={`flex-1 md:px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
              view === 'musicians' ? 'bg-brand-orange text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            Músicos
          </button>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-all ${
                viewMode === 'grid' ? 'bg-white/10 text-brand-yellow' : 'text-white/40 hover:text-white'
              }`}
              title="Vista de Grilla"
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-3 rounded-xl transition-all ${
                viewMode === 'map' ? 'bg-white/10 text-brand-yellow' : 'text-white/40 hover:text-white'
              }`}
              title="Vista de Mapa"
            >
              <MapIcon size={20} />
            </button>
          </div>

          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="text"
              placeholder={view === 'bands' ? "Buscar por nombre o género..." : "Buscar por instrumento o nombre..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:border-brand-yellow/50 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'map' ? (
        <div className="animate-fade-in">
          <ArtistMap artists={mapArtists} />
          {mapArtists.length === 0 && (
            <p className="mt-4 text-center text-white/30 text-xs uppercase tracking-widest font-bold">
              No hay {view === 'bands' ? 'bandas' : 'músicos'} con ubicación registrada para esta búsqueda.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {view === 'bands' ? (
            <>
              {filteredBands.map((band) => (
              <Link 
                key={band.id} 
                href={`/banda/${band.id}`}
                className="group relative flex flex-col glass-card border border-white/10 hover:border-brand-yellow/50 transition-all duration-500 overflow-hidden rounded-[2rem]"
              >
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/5 to-transparent z-0" />
                <div className="p-6 flex flex-col items-center text-center relative z-10">
                  <div className="relative w-28 h-28 mb-4">
                    <div className="absolute inset-0 bg-brand-yellow/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                    <div className="w-full h-full rounded-3xl overflow-hidden border-2 border-white/10 group-hover:border-brand-yellow/50 transition-colors relative bg-black/40">
                      {band.profilePic ? (
                        <Image src={band.profilePic} alt={band.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                          <Users size={40} />
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-yellow transition-colors line-clamp-1">{band.name}</h3>
                  <div className="flex flex-col items-center gap-1 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-yellow/60 bg-brand-yellow/5 px-2 py-0.5 rounded-full border border-brand-yellow/10">
                        {band.genre || "Cumbia"}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-white/40 uppercase font-bold tracking-widest">
                        <Users size={10} />
                        {band._count.members}
                      </div>
                    </div>
                    {band.city && (
                      <div className="flex items-center gap-1 text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">
                        <MapPin size={10} className="text-brand-yellow/40" />
                        {band.city}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-4 line-clamp-2 italic h-8">{band.bio}</p>
                  <div className="mt-6 pt-6 border-t border-white/5 w-full flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] text-white/30 uppercase font-bold tracking-widest"><Music size={12} /> Banda</div>
                    <div className="flex items-center gap-1 text-[10px] text-brand-yellow font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Ver Perfil <ArrowRight size={10} /></div>
                  </div>
                </div>
              </Link>
            ))}
          </>
        ) : (
          <>
            {filteredMusicians.map((musician) => (
              <Link 
                key={musician.id} 
                href={`/musico/${musician.id}`}
                className="group relative flex flex-col glass-card border border-white/10 hover:border-brand-orange/50 transition-all duration-500 overflow-hidden rounded-[2rem]"
              >
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/5 to-transparent z-0" />
                <div className="p-6 flex flex-col items-center text-center relative z-10">
                  <div className="relative w-28 h-28 mb-4">
                    <div className="absolute inset-0 bg-brand-orange/20 rounded-full blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10 group-hover:border-brand-orange/50 transition-colors relative bg-black/40">
                      {musician.profilePic ? (
                        <Image src={musician.profilePic} alt={musician.nombre} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                          <User size={40} />
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-orange transition-colors line-clamp-1">{musician.nombre}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange/80 bg-brand-orange/5 px-3 py-1 rounded-full border border-brand-orange/20">
                      {musician.instrument || "Músico"}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-4 line-clamp-2 italic h-8">{musician.bio}</p>
                  <div className="mt-6 pt-6 border-t border-white/5 w-full flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] text-white/30 uppercase font-bold tracking-widest"><Mic2 size={12} /> Músico</div>
                    <div className="flex items-center gap-1 text-[10px] text-brand-orange font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Ver Perfil <ArrowRight size={10} /></div>
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}

        {/* Empty State / CTA */}
        <Link 
          href="/emergente"
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/5 rounded-[2rem] hover:border-brand-yellow/30 transition-all group gap-4 bg-white/[0.02]"
        >
          <div className="p-4 rounded-full bg-white/5 group-hover:bg-brand-yellow/10 transition-colors">
            <Mic2 className="w-8 h-8 text-white/20 group-hover:text-brand-yellow transition-colors" />
          </div>
          <div className="text-center">
            <p className="font-bold text-white/60">¿Sos artista?</p>
            <p className="text-xs text-white/30 mt-1">Postulate para aparecer acá.</p>
          </div>
        </Link>
      </div>
      )}
    </div>
  );
}
