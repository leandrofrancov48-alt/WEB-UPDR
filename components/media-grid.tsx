"use client";

import { Play, Music, FileVideo } from "lucide-react";

interface MediaGridProps {
  urls: string[];
}

export function MediaGrid({ urls }: MediaGridProps) {
  if (!urls || urls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
        <FileVideo className="w-12 h-12 text-white/10 mb-4" />
        <p className="text-white/30 text-sm italic">No hay material cargado aún.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {urls.map((url, index) => {
        const isVideo = url.endsWith(".mp4") || url.includes("video") || url.includes("cloudinary");
        
        return (
          <div key={index} className="group relative glass-card p-2 border border-white/10 overflow-hidden rounded-3xl hover:border-brand-yellow/50 transition-all duration-500">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40">
              {isVideo ? (
                <video 
                  src={url} 
                  className="w-full h-full object-cover"
                  controls
                  poster={url.replace(".mp4", ".jpg")} // Cloudinary auto-poster attempt
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-yellow/20">
                  <Music size={48} />
                </div>
              )}
              
              {!isVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none">
                   <div className="w-16 h-16 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-brand-yellow fill-brand-yellow" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h4 className="text-sm font-bold text-white/80 uppercase tracking-widest">Video #{index + 1}</h4>
              <p className="text-[10px] text-white/30 mt-1 uppercase font-black">Material Destacado</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
