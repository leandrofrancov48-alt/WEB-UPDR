"use client";

import { useState } from "react";
import { CldUploadButton } from "next-cloudinary";
import { ArrowLeft, UploadCloud, Sparkles, Image as ImageIcon } from "lucide-react";

const EVENTOS = [
  { id: "fiesta-noviembre", nombre: "EDICIÓN NOVIEMBRE" },
  { id: "fiesta-diciembre", nombre: "EDICIÓN DICIEMBRE" },
];

export default function GaleriaAdminClient() {
  const [selectedEvent, setSelectedEvent] = useState(EVENTOS[1].id);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUploadSuccess = (result: any) => {
    console.log("Subida OK a carpeta:", selectedEvent, result);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 4000);
  };

  return (
    <main className="min-h-screen bg-[#050b1a] text-white p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Luces de fondo decorativas */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-yellow/5 rounded-full blur-[150px] pointer-events-none"></div>

      <header className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <a 
              href="/control-updr-admin" 
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-brand-yellow transition-colors font-bold uppercase"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al panel
            </a>
          </div>
          <h1 className="text-3xl md:text-4xl font-yellow text-brand-yellow flex items-center gap-3 tracking-wider uppercase">
            <ImageIcon className="w-8 h-8 text-brand-yellow" /> Gestión de Galería
          </h1>
          <p className="text-neutral-400 text-xs md:text-sm mt-1">Carga fotos oficiales de los eventos del show para la sección multimedia.</p>
        </div>
        <span className="text-[10px] tracking-widest text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/20 px-3 py-1.5 rounded-full font-black uppercase">
          Acceso Administrador
        </span>
      </header>

      <section className="max-w-2xl mx-auto relative z-10">
        <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl space-y-8">
          
          <div className="space-y-3">
            <label className="block text-brand-yellow text-xs md:text-sm font-black uppercase tracking-widest">
              1. Seleccioná el Evento / Edición
            </label>
            <p className="text-xs text-white/40 italic">Las fotos se subirán y agruparán automáticamente en este evento.</p>
            <select 
              value={selectedEvent} 
              onChange={(e) => setSelectedEvent(e.target.value)} 
              className="w-full p-4 bg-black/40 text-white border border-white/10 rounded-2xl focus:border-brand-yellow outline-none text-lg transition-all cursor-pointer font-bold"
            >
              {EVENTOS.map((ev) => (
                <option key={ev.id} value={ev.id} className="bg-[#050b1a]">{ev.nombre}</option>
              ))}
            </select>
            <div className="text-xs text-neutral-400 font-mono mt-1 flex items-center gap-2">
              <span>Carpeta en la nube:</span>
              <span className="text-brand-yellow font-bold">{selectedEvent}</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-brand-yellow text-xs md:text-sm font-black uppercase tracking-widest">
              2. Subir Fotos
            </label>
            
            <div className="bg-black/45 hover:bg-black/60 transition-all rounded-3xl border-2 border-dashed border-white/10 hover:border-brand-yellow/50 group cursor-pointer relative overflow-hidden">
              <CldUploadButton 
                key={selectedEvent} 
                uploadPreset="fotos_ruido" 
                options={{ 
                  sources: ["local"], 
                  multiple: true, 
                  folder: selectedEvent, 
                  tags: [selectedEvent] 
                }} 
                onSuccess={handleUploadSuccess} 
                className="w-full py-12 flex flex-col items-center justify-center gap-4 text-center px-4"
              >
                <div className="p-4 rounded-full bg-white/5 group-hover:bg-brand-yellow/10 transition-colors">
                  <UploadCloud className="w-10 h-10 text-neutral-400 group-hover:text-brand-yellow group-hover:scale-110 transition-all" />
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-300 group-hover:text-white font-black text-lg block transition-colors">
                    HACÉ CLICK PARA SUBIR FOTOS
                  </span>
                  <span className="text-xs text-neutral-500 block">
                    Formatos admitidos: JPG, PNG, WEBP (Permite selección múltiple)
                  </span>
                </div>
              </CldUploadButton>
            </div>
          </div>

          {uploadSuccess && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center gap-3 animate-fadeIn">
              <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold">¡Fotos subidas con éxito!</p>
                <p className="text-[10px] opacity-80">El material ya está disponible y clasificado en la carpeta "{selectedEvent}".</p>
              </div>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
