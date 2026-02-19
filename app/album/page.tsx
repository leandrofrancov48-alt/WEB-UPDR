"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// --- DICCIONARIO DE FIGURITAS SECRETAS ---
// Acá definimos qué código desbloquea qué figurita.
const FIGURITAS = [
  { id: 1, codigo: "ZAPADA24", img: "/logo.png", titulo: "La Gran Zapada" },
  { id: 2, codigo: "RUIDO", img: "/logo.png", titulo: "Un Poco De Ruido" },
  { id: 3, codigo: "CUMBIA", img: "/logo.png", titulo: "Comunidad Cumbiera" },
  { id: 4, codigo: "TURRO", img: "/logo.png", titulo: "ATR" },
];

export default function AlbumPage() {
  const [desbloqueadas, setDesbloqueadas] = useState<number[]>([]);
  const [codigoIngresado, setCodigoIngresado] = useState("");
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  // 1. CARGAR PROGRESO GUARDADO (Al entrar a la página)
  useEffect(() => {
    const progresoGuardado = localStorage.getItem("album_1pdr");
    if (progresoGuardado) {
      setDesbloqueadas(JSON.parse(progresoGuardado));
    }
  }, []);

  // 2. FUNCIÓN PARA CANJEAR EL CÓDIGO
  const canjearCodigo = (e: React.FormEvent) => {
    e.preventDefault();
    const codigoLimpio = codigoIngresado.trim().toUpperCase(); // Todo a mayúscula para que no haya errores

    // Buscamos si el código existe en nuestra lista
    const figEncontrada = FIGURITAS.find((fig) => fig.codigo === codigoLimpio);

    if (!figEncontrada) {
      setMensaje({ texto: "Código incorrecto o no existe ❌", tipo: "error" });
      setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
      return;
    }

    if (desbloqueadas.includes(figEncontrada.id)) {
      setMensaje({ texto: "¡Ya tenés esta figurita! 😅", tipo: "aviso" });
      setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
      return;
    }

    // Si el código es válido y no la tiene, la desbloqueamos
    const nuevasDesbloqueadas = [...desbloqueadas, figEncontrada.id];
    setDesbloqueadas(nuevasDesbloqueadas);
    
    // Guardamos en el navegador (localStorage)
    localStorage.setItem("album_1pdr", JSON.stringify(nuevasDesbloqueadas));

    setMensaje({ texto: `¡Desbloqueaste: ${figEncontrada.titulo}! 🎉`, tipo: "exito" });
    setCodigoIngresado(""); // Limpiamos el input
    setTimeout(() => setMensaje({ texto: "", tipo: "" }), 4000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center">
      
      {/* TÍTULO */}
      <div className="text-center mb-10 animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-yellow text-[#E8D43F] drop-shadow-[0_0_15px_rgba(232,212,63,0.5)]">
          ÁLBUM OFICIAL
        </h1>
        <p className="text-white/60 tracking-[0.2em] text-sm mt-2 uppercase font-bold">
          Encontrá los códigos en el stream
        </p>
      </div>

      {/* ZONA DE CANJEO DE CÓDIGOS */}
      <div className="w-full max-w-md mb-12 bg-black/50 p-6 rounded-xl border border-white/10 backdrop-blur-sm shadow-lg">
        <form onSubmit={canjearCodigo} className="flex flex-col gap-4">
          <label className="text-white/80 text-xs tracking-widest uppercase font-bold text-center">
            Ingresá tu código secreto
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={codigoIngresado}
              onChange={(e) => setCodigoIngresado(e.target.value)}
              placeholder="Ej: RUIDO24"
              className="flex-grow bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 outline-none focus:border-[#E8D43F] focus:ring-1 focus:ring-[#E8D43F] transition-all uppercase text-center font-bold tracking-wider"
            />
            <button
              type="submit"
              className="bg-[#E8D43F] text-black font-bold px-6 py-3 rounded-lg hover:bg-white transition-colors duration-300"
            >
              CANJEAR
            </button>
          </div>
          
          {/* Mensajes de éxito o error */}
          {mensaje.texto && (
            <div className={`text-center text-sm font-bold tracking-wider py-2 rounded ${
              mensaje.tipo === "error" ? "text-red-400 bg-red-400/10" : 
              mensaje.tipo === "aviso" ? "text-yellow-400 bg-yellow-400/10" : 
              "text-green-400 bg-green-400/10 animate-pulse"
            }`}>
              {mensaje.texto}
            </div>
          )}
        </form>
      </div>

      {/* GRILLA DE FIGURITAS */}
      <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {FIGURITAS.map((fig) => {
          const laTengo = desbloqueadas.includes(fig.id);

          return (
            <div 
              key={fig.id} 
              className={`relative aspect-[3/4] rounded-lg border-2 overflow-hidden transition-all duration-500 
                ${laTengo 
                  ? "border-[#E8D43F] shadow-[0_0_20px_rgba(232,212,63,0.3)] scale-100" 
                  : "border-white/10 bg-black/40 scale-95 opacity-80"
                }
              `}
            >
              {/* IMAGEN DE LA FIGURITA */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <Image
                  src={fig.img}
                  alt={fig.titulo}
                  width={200}
                  height={200}
                  className={`w-full h-auto object-contain transition-all duration-700
                    ${laTengo 
                      ? "grayscale-0 blur-0 opacity-100" 
                      : "grayscale blur-md opacity-30"
                    }
                  `}
                />
              </div>

              {/* OVERLAY CUANDO ESTÁ BLOQUEADA (Candadito o Signo de Pregunta) */}
              {!laTengo && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="rgba(255,255,255,0.5)" className="w-12 h-12 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <span className="text-white/50 font-yellow text-2xl tracking-widest">???</span>
                </div>
              )}

              {/* NÚMERO DE FIGURITA ABAJO */}
              <div className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-sm border-t border-white/10 py-2 text-center">
                <span className={`text-xs font-bold tracking-widest uppercase ${laTengo ? "text-[#E8D43F]" : "text-white/50"}`}>
                  {laTengo ? fig.titulo : `Nº ${fig.id.toString().padStart(3, '0')}`}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}