"use client";

import { useState } from "react";
import { CldUploadButton } from "next-cloudinary";

const EVENTOS = [
  { id: "fiesta-noviembre", nombre: "EDICIÓN NOVIEMBRE" },
  { id: "fiesta-diciembre", nombre: "EDICIÓN DICIEMBRE" },
];

export default function AdminPage() {
  const [pass, setPass] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  // Default en Diciembre
  const [selectedEvent, setSelectedEvent] = useState(EVENTOS[1].id);

  const checkPass = () => {
    if (pass === "RUIDO") setIsLogged(true); 
    else alert("Contraseña incorrecta");
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-white p-8 font-sans">
      {!isLogged ? (
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <h1 className="text-brand-yellow font-yellow text-4xl mb-6">ACCESO STAFF</h1>
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="p-3 rounded text-black mb-4 outline-none border-2 border-brand-yellow focus:scale-105 transition-transform"
            onChange={(e) => setPass(e.target.value)}
          />
          <button onClick={checkPass} className="bg-brand-yellow text-black font-bold py-2 px-8 rounded hover:bg-white transition-colors">
            ENTRAR
          </button>
        </div>
      ) : (
        <>
          <header className="flex justify-between items-center mb-10 border-b border-white/20 pb-4">
            <h1 className="text-3xl font-yellow text-brand-yellow">PANEL DE CARGA</h1>
            <div className="flex gap-4 items-center">
              <span className="text-xs text-neutral-400">MODO: CARPETAS CLOUDINARY</span>
              <button onClick={() => setIsLogged(false)} className="text-sm text-red-400 hover:text-red-300 border border-red-900 px-3 py-1 rounded">
                SALIR
              </button>
            </div>
          </header>

          <div className="max-w-2xl mx-auto bg-black p-8 rounded-xl border border-brand-yellow/30 shadow-2xl">
            
            {/* 1. SELECTOR DE EVENTO */}
            <div className="mb-8">
              <label className="block text-brand-yellow text-sm font-bold mb-3 uppercase tracking-widest">
                1. ¿A qué evento pertenecen estas fotos?
              </label>
              <select 
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full p-4 bg-neutral-800 text-white border border-neutral-600 rounded focus:border-brand-yellow outline-none text-xl transition-colors cursor-pointer"
              >
                {EVENTOS.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.nombre}</option>
                ))}
              </select>
              <p className="text-xs text-neutral-500 mt-2">
                Carpeta destino: <span className="text-white font-mono">{selectedEvent}</span>
              </p>
            </div>

            {/* 2. ZONA DE CARGA */}
            <div className="mb-4">
              <label className="block text-brand-yellow text-sm font-bold mb-4 uppercase tracking-widest">
                2. Arrastra las fotos
              </label>
              
              <div className="bg-neutral-800 hover:bg-neutral-700 transition-colors rounded-xl border-2 border-dashed border-neutral-500 hover:border-brand-yellow group cursor-pointer relative overflow-hidden">
                
                {/* SOLUCIÓN APLICADA: key={selectedEvent}
                   Esto fuerza a React a destruir y crear un botón nuevo cada vez que 
                   cambias la opción del select. Así se actualiza la carpeta "folder" sí o sí.
                */}
                <CldUploadButton
                  key={selectedEvent} 
                  uploadPreset="fotos_ruido" 
                  options={{
                    sources: ['local'], 
                    multiple: true,
                    folder: selectedEvent, 
                    tags: [selectedEvent]
                  }}
                  onSuccess={(result) => console.log("Subida OK a carpeta:", selectedEvent)}
                  className="w-full h-40 flex flex-col items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-neutral-400 group-hover:text-brand-yellow transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="text-neutral-400 group-hover:text-white font-bold text-lg">CLICK PARA SUBIR FOTOS</span>
                  <span className="text-xs text-neutral-500 uppercase tracking-widest bg-black/50 px-2 py-1 rounded">
                    Destino actual: {selectedEvent}
                  </span>
                </CldUploadButton>
              </div>
            </div>

            <div className="bg-blue-900/20 p-4 rounded border border-blue-900/50 mt-8">
              <h3 className="text-blue-400 text-xs font-bold uppercase mb-2">Información Técnica</h3>
              <ul className="text-xs text-blue-200/70 list-disc pl-4 space-y-1">
                <li>Las fotos se suben directamente a Cloudinary.</li>
                <li>Si cambias el evento arriba, el botón se reinicia.</li>
                <li>La galería se actualizará automáticamente al recargar la página.</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </main>
  );
}