"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Photo {
  _id: string;
  url: string;
  folder: string;
  publicId: string;
  width: number;
  height: number;
}

// Diccionario para mostrar nombres bonitos en la web
const NOMBRES_OFICIALES: Record<string, string> = {
  "fiesta-noviembre": "GRAN ZAPADA - 13/11",
  "fiesta-diciembre": "GRAN ZAPADA 2 ROUND - 3/12",
  "Varios": "OTRAS FOTOS"
};

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("todas");

  useEffect(() => {
    fetch('/api/photos')
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Obtener carpetas únicas para las pestañas
  const folders = Array.from(new Set(photos.map(p => p.folder))).sort();

  // Filtrar fotos según la pestaña activa
  const filteredPhotos = activeTab === "todas" 
    ? photos 
    : photos.filter(p => p.folder === activeTab);

  if (loading) return <div className="text-white text-center p-10">Cargando fotos...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-20">
      
      {/* --- PESTAÑAS DE FILTRO --- */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <button
          onClick={() => setActiveTab("todas")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === "todas" 
              ? "bg-white text-black" 
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          TODAS
        </button>
        {folders.map(folder => (
          <button
            key={folder}
            onClick={() => setActiveTab(folder)}
            className={`px-4 py-2 rounded-full text-sm font-medium uppercase transition-all ${
              activeTab === folder 
                ? "bg-white text-black" 
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {NOMBRES_OFICIALES[folder] || folder}
          </button>
        ))}
      </div>

      {/* --- GRILLA DE FOTOS --- */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {filteredPhotos.map((photo) => (
          <div 
            key={photo._id} 
            className="break-inside-avoid relative group cursor-zoom-in overflow-hidden rounded-lg"
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={photo.url}
              alt="Foto evento"
              width={500}
              height={500}
              className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}
      </div>

      {/* --- MODAL (FOTO EN GRANDE) --- */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)} // Cerrar al hacer clic en el fondo
        >
          
          {/* Imagen Grande */}
          <div className="relative max-w-full max-h-[85vh] w-auto h-auto" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedPhoto.url}
              alt="Foto grande"
              width={1200}
              height={1200}
              className="max-h-[80vh] w-auto object-contain rounded-md shadow-2xl"
              priority
            />
          </div>

          {/* --- BARRA DE BOTONES (DESCARGAR + CERRAR) --- */}
          <div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50" 
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* BOTÓN DESCARGAR */}
            <a
              href={selectedPhoto.url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3-3m3 3l3-3m-3 3V3" />
              </svg>
              DESCARGAR
            </a>

            {/* BOTÓN CERRAR (X) */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-md transition-all shadow-lg border border-white/10"
              aria-label="Cerrar foto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

          </div>
        </div>
      )}
    </div>
  );
}