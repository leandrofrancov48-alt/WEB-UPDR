"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// --- DICCIONARIO DE FIGURITAS ---
// Agregué 6 para que veas cómo funciona el sistema de pasar de página (4 por página)
const FIGURITAS = [
  { id: 1, codigo: "ZAPADA24", img: "/logo.png", titulo: "La Gran Zapada" },
  { id: 2, codigo: "RUIDO", img: "/logo.png", titulo: "Un Poco De Ruido" },
  { id: 3, codigo: "CUMBIA", img: "/logo.png", titulo: "Comunidad Cumbiera" },
  { id: 4, codigo: "TURRO", img: "/logo.png", titulo: "ATR" },
  { id: 5, codigo: "FERNET", img: "/logo.png", titulo: "El Viaje" },
  { id: 6, codigo: "PREVIA", img: "/logo.png", titulo: "Arranca la joda" },
];

const FIGS_POR_PAGINA = 4;

export default function AlbumPage() {
  const [desbloqueadas, setDesbloqueadas] = useState<number[]>([]);
  const [paginaActual, setPaginaActual] = useState(0);
  const [animando, setAnimando] = useState(false);

  // 1. CARGAR PROGRESO
  useEffect(() => {
    const progresoGuardado = localStorage.getItem("album_1pdr");
    if (progresoGuardado) {
      setDesbloqueadas(JSON.parse(progresoGuardado));
    }
  }, []);

  // 2. FUNCIÓN GLOBAL PARA CANJEAR (La usan las figuritas individuales)
  const intentarDesbloquear = (idFigurita: number, codigoIngresado: string) => {
    const figEncontrada = FIGURITAS.find((fig) => fig.id === idFigurita);
    
    if (figEncontrada && figEncontrada.codigo === codigoIngresado.trim().toUpperCase()) {
      const nuevas = [...desbloqueadas, idFigurita];
      setDesbloqueadas(nuevas);
      localStorage.setItem("album_1pdr", JSON.stringify(nuevas));
      return true; // Éxito
    }
    return false; // Error
  };

  // 3. LÓGICA DE PÁGINAS
  const totalPaginas = Math.ceil(FIGURITAS.length / FIGS_POR_PAGINA);
  const figsEnEstaPagina = FIGURITAS.slice(
    paginaActual * FIGS_POR_PAGINA, 
    (paginaActual + 1) * FIGS_POR_PAGINA
  );

  const cambiarPagina = (nuevaPagina: number) => {
    setAnimando(true);
    setTimeout(() => {
      setPaginaActual(nuevaPagina);
      setAnimando(false);
    }, 300); // Duración de la animación de "pasar hoja"
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center overflow-hidden">
      
      {/* TÍTULO DEL ÁLBUM */}
      <div className="text-center mb-6 animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-yellow text-[#E8D43F] drop-shadow-[0_0_15px_rgba(232,212,63,0.5)]">
          ÁLBUM OFICIAL
        </h1>
        <p className="text-white/60 tracking-[0.2em] text-xs md:text-sm mt-2 uppercase font-bold">
          Progreso: {desbloqueadas.length} / {FIGURITAS.length} figuritas
        </p>
      </div>

      {/* EL LIBRO (Contenedor principal) */}
      <div className="relative w-full max-w-4xl bg-black/60 border-2 border-white/10 rounded-2xl p-4 md:p-8 shadow-2xl backdrop-blur-md">
        
        {/* Efecto visual de lomo de libro en el medio (solo visible en PC) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-transparent via-black/40 to-transparent pointer-events-none z-0"></div>

        {/* GRILLA DE FIGURITAS DE LA PÁGINA ACTUAL */}
        <div className={`grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-10 relative z-10 transition-all duration-300 transform 
          ${animando ? "opacity-0 scale-95 -translate-x-10" : "opacity-100 scale-100 translate-x-0"}
        `}>
          {figsEnEstaPagina.map((fig) => (
            <FiguritaSlot 
              key={fig.id} 
              fig={fig} 
              laTengo={desbloqueadas.includes(fig.id)} 
              onCanjear={intentarDesbloquear} 
            />
          ))}
        </div>

        {/* CONTROLES DEL ÁLBUM (Flechas) */}
        <div className="flex items-center justify-between mt-8 md:mt-12 pt-4 border-t border-white/10">
          <button 
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold tracking-widest text-xs transition-all
              ${paginaActual === 0 ? "opacity-30 cursor-not-allowed text-white/50" : "text-[#E8D43F] hover:bg-white/10"}
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            ANTERIOR
          </button>

          <span className="text-white/40 text-xs tracking-widest font-sans">
            PÁG {paginaActual + 1} DE {totalPaginas}
          </span>

          <button 
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold tracking-widest text-xs transition-all
              ${paginaActual === totalPaginas - 1 ? "opacity-30 cursor-not-allowed text-white/50" : "text-[#E8D43F] hover:bg-white/10"}
            `}
          >
            SIGUIENTE
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTE: EL RECUADRO DE LA FIGURITA
// ==========================================
function FiguritaSlot({ fig, laTengo, onCanjear }: { fig: any, laTengo: boolean, onCanjear: any }) {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState(false);
  const [recienDesbloqueada, setRecienDesbloqueada] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim()) return;

    const exito = onCanjear(fig.id, codigo);
    if (exito) {
      setRecienDesbloqueada(true); // Dispara la animación de brillo
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000); // El borde rojo dura 2 segs
    }
  };

  return (
    <div 
      className={`relative aspect-[3/4] rounded-xl overflow-hidden transition-all duration-700 bg-black/80
        ${laTengo 
          ? `border-2 border-[#E8D43F] ${recienDesbloqueada ? 'shadow-[0_0_40px_rgba(232,212,63,0.8)] scale-105 z-20' : 'shadow-[0_0_15px_rgba(232,212,63,0.2)]'}` 
          : "border border-white/10 border-dashed hover:border-white/30 scale-95"
        }
      `}
    >
      {/* 1. LA IMAGEN EN SÍ */}
      <div className="absolute inset-0 flex items-center justify-center p-2 md:p-4">
        <Image
          src={fig.img}
          alt={fig.titulo}
          width={300}
          height={400}
          className={`w-full h-full object-cover rounded-lg transition-all duration-1000
            ${laTengo 
              ? "grayscale-0 blur-0 opacity-100" 
              : "grayscale blur-xl opacity-20"
            }
          `}
        />
      </div>

      {/* 2. SI NO LA TIENE: MUESTRA EL FORMULARIO ARRIBA DEL BLUR */}
      {!laTengo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/40 z-10">
          <div className="text-white/50 font-yellow text-4xl mb-4 opacity-30">?</div>
          
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2 relative z-20">
            <label className="text-[9px] md:text-[10px] text-white/70 text-center uppercase tracking-[0.2em] font-bold">
              Figurita N° {fig.id.toString().padStart(2, '0')}
            </label>
            
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="CÓDIGO"
              className={`w-full bg-black/60 backdrop-blur-md border ${error ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'border-white/20'} rounded-lg text-center text-white text-xs md:text-sm py-2 focus:border-[#E8D43F] outline-none uppercase font-bold tracking-widest transition-all placeholder-white/30`}
            />
            
            <button 
              type="submit" 
              className="bg-white/10 border border-white/20 hover:bg-[#E8D43F] hover:text-black hover:border-[#E8D43F] text-white text-[10px] md:text-xs font-bold py-2 rounded-lg uppercase tracking-widest transition-colors"
            >
              PEgar
            </button>
          </form>
        </div>
      )}

      {/* 3. SI LA TIENE: TÍTULO DE LA FIGURITA ABAJO */}
      {laTengo && (
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-8 pb-3 px-2 text-center z-10">
          <span className="text-[#E8D43F] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase drop-shadow-md">
            {fig.titulo}
          </span>
        </div>
      )}
    </div>
  );
}