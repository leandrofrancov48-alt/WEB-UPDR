"use client";

import { useState } from "react";
import { CldUploadButton } from "next-cloudinary";

const EVENTOS = [
  { id: "fiesta-noviembre", nombre: "EDICIÓN NOVIEMBRE" },
  { id: "fiesta-diciembre", nombre: "EDICIÓN DICIEMBRE" },
];

export default function AdminPage() {
  const [selectedEvent, setSelectedEvent] = useState(EVENTOS[1].id);

  return (
    <main className="min-h-screen bg-neutral-900 text-white p-8 font-sans">
      <header className="flex justify-between items-center mb-10 border-b border-white/20 pb-4">
        <h1 className="text-3xl font-yellow text-brand-yellow">PANEL DE CARGA</h1>
        <span className="text-xs text-neutral-400">ACCESO PROTEGIDO POR AUTH DE SERVIDOR</span>
      </header>

      <div className="max-w-2xl mx-auto bg-black p-8 rounded-xl border border-brand-yellow/30 shadow-2xl">
        <div className="mb-8">
          <label className="block text-brand-yellow text-sm font-bold mb-3 uppercase tracking-widest">
            1. ¿A qué evento pertenecen estas fotos?
          </label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full p-4 bg-neutral-800 text-white border border-neutral-600 rounded focus:border-brand-yellow outline-none text-xl transition-colors cursor-pointer"
          >
            {EVENTOS.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.nombre}
              </option>
            ))}
          </select>
          <p className="text-xs text-neutral-500 mt-2">
            Carpeta destino: <span className="text-white font-mono">{selectedEvent}</span>
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-brand-yellow text-sm font-bold mb-4 uppercase tracking-widest">
            2. Arrastra las fotos
          </label>

          <div className="bg-neutral-800 hover:bg-neutral-700 transition-colors rounded-xl border-2 border-dashed border-neutral-500 hover:border-brand-yellow group cursor-pointer relative overflow-hidden">
            <CldUploadButton
              key={selectedEvent}
              uploadPreset="fotos_ruido"
              options={{
                sources: ["local"],
                multiple: true,
                folder: selectedEvent,
                tags: [selectedEvent],
              }}
              onSuccess={() => console.log("Subida OK a carpeta:", selectedEvent)}
              className="w-full h-40 flex flex-col items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-neutral-400 group-hover:text-brand-yellow transition-colors"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
              </svg>
              <span className="text-neutral-400 group-hover:text-white font-bold text-lg">CLICK PARA SUBIR FOTOS</span>
              <span className="text-xs text-neutral-500 uppercase tracking-widest bg-black/50 px-2 py-1 rounded">
                Destino actual: {selectedEvent}
              </span>
            </CldUploadButton>
          </div>
        </div>
      </div>
    </main>
  );
}
