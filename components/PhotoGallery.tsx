"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// En components/PhotoGallery.tsx

const NOMBRES_OFICIALES: Record<string, string> = {
  // Mapeamos las carpetas REALES a los títulos bonitos
  "fiesta-noviembre": "GRAN ZAPADA - 13/11",
  "fiesta-diciembre": "GRAN ZAPADA 2° ROUND - 3/12",
  
  // Dejamos Varios como algo genérico por si acaso falla algo
  "Varios": "OTRAS FOTOS / SIN CLASIFICAR", 
};

interface Photo {
  _id: string;
  url: string;
  folder: string;
  publicId: string;
  width: number;
  height: number;
}

interface GroupedPhotos {
  [key: string]: Photo[];
}

export default function PhotoGallery() {
  const [groupedPhotos, setGroupedPhotos] = useState<GroupedPhotos>({});
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  
  // AHORA INICIA EN NULL (Todo cerrado)
  const [openFolder, setOpenFolder] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch("/api/photos");
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const groups = data.reduce((acc: GroupedPhotos, photo: Photo) => {
            if (!photo.url || photo.url.trim() === "") return acc;
            const folderName = photo.folder || "Otras";
            if (!acc[folderName]) acc[folderName] = [];
            acc[folderName].push(photo);
            return acc;
          }, {});
          
          setGroupedPhotos(groups);
        }
      } catch (error) {
        console.error("Error al cargar fotos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  const toggleFolder = (folderName: string) => {
    // Si toco la que está abierta, la cierro. Si toco otra, abro esa.
    if (openFolder === folderName) {
      setOpenFolder(null); 
    } else {
      setOpenFolder(folderName);
    }
  };

  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedPhoto]);

  const getDownloadUrl = (url: string) => {
    return url.replace('/upload/', '/upload/fl_attachment/');
  };

  const formatTitle = (folderRaw: string) => {
    return NOMBRES_OFICIALES[folderRaw] || folderRaw.toUpperCase().replace(/-/g, ' ');
  };

  if (loading) {
    return <div className="text-center text-white mt-20 font-sans tracking-widest animate-pulse">CARGANDO GALERÍA...</div>;
  }

  const folders = Object.keys(groupedPhotos).sort();

  return (
    <div className="container mx-auto px-4 py-8">
      {folders.length === 0 ? (
        <div className="text-center text-white/50 font-sans tracking-widest mt-10">NO HAY FOTOS DISPONIBLES</div>
      ) : (
        folders.map((folderName, folderIndex) => {
          const isOpen = openFolder === folderName;
          const displayName = formatTitle(folderName);

          return (
            <div key={`${folderName}-${folderIndex}`} className="mb-6 animate-fade-in-up">
              
              <button 
                onClick={() => toggleFolder(folderName)}
                className={`w-full flex items-center justify-between group p-6 border border-white/10 transition-all duration-300 ${isOpen ? 'bg-white/10 rounded-t-lg border-b-transparent' : 'bg-white/5 hover:bg-white/10 rounded-lg'}`}
              >
                <div className="flex items-center">
                  <h2 className={`text-2xl md:text-4xl font-yellow uppercase tracking-wider drop-shadow-md text-left transition-colors duration-300 ${isOpen ? 'text-brand-yellow' : 'text-white/80 group-hover:text-brand-yellow'}`}>
                    {displayName}
                  </h2>
                  <span className={`ml-4 text-xs font-sans tracking-widest px-2 py-1 rounded transition-colors duration-300 ${isOpen ? 'bg-brand-yellow text-black font-bold' : 'bg-black/50 text-neutral-400'}`}>
                    {groupedPhotos[folderName].length} FOTOS
                  </span>
                </div>
                
                <div className={`transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={isOpen ? "#E8D43F" : "currentColor"} className="w-8 h-8 text-white/50 group-hover:text-brand-yellow transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </button>

              <div 
                className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <div className="bg-black/20 border-x border-b border-white/10 p-6 rounded-b-lg">
                    <div className={`columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 transition-opacity duration-700 delay-100 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                      {groupedPhotos[folderName].map((photo, photoIndex) => (
                        <div 
                          key={photo._id || `photo-${folderIndex}-${photoIndex}`} 
                          className="break-inside-avoid relative group cursor-pointer mb-6 rounded-sm border border-white/5 shadow-md overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(232,212,63,0.2)] hover:border-brand-yellow/40 hover:-translate-y-1"
                          onClick={() => setSelectedPhoto(photo)}
                        >
                          <Image
                            src={photo.url}
                            alt={`${folderName}`}
                            width={photo.width}
                            height={photo.height}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="w-full h-auto object-contain"
                            priority={folderIndex === 0 && photoIndex < 4}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-10 h-10 drop-shadow-lg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                              </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}

      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Botón de cerrar superior (Lo dejé por si acaso, pero el importante es el de abajo) */}
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[110]"
            onClick={() => setSelectedPhoto(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div 
            className="relative w-full max-w-5xl h-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={selectedPhoto.url}
                alt="Vista completa"
                fill
                className="object-contain"
                quality={100}
                priority 
              />
            </div>
            
            {/* === AQUÍ ESTÁ EL CAMBIO === */}
            {/* Agrupamos los botones en un div Flex para que estén lado a lado */}
            <div className="mt-4 flex items-center gap-4 z-[120]">
              
              {/* Botón Descargar (Tu diseño original) */}
              <a 
                href={getDownloadUrl(selectedPhoto.url)} 
                download 
                className="bg-brand-yellow text-black font-bold py-3 px-8 rounded-full hover:bg-white transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(232,212,63,0.4)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M12 12.75l-4.5-4.5M12 12.75l4.5-4.5M12 12.75V3" />
                </svg>
                DESCARGAR
              </a>

              {/* NUEVO: Botón Cerrar (X) Circular al lado */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="bg-white/10 border border-white/20 text-white p-3 rounded-full hover:bg-white/20 transition-all shadow-lg"
                aria-label="Cerrar foto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

            </div>
            {/* === FIN DEL CAMBIO === */}

          </div>
        </div>
      )}
    </div>
  );
}