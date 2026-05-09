"use client";

import { useEffect, useState } from "react";

interface Application {
  id: string;
  artistName: string;
  genre: string;
  bio: string;
  instagram: string;
  spotify: string;
  youtube: string;
  address: string;
  city: string;
  mediaUrls: string[];
  createdAt: string;
  user: {
    nombre: string;
    apellido: string;
    email: string;
  };
}

export default function EmergentesClient() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    fetch("/api/admin/artist-applications")
      .then((r) => r.json())
      .then((data) => {
        if (data.applications) setApps(data.applications);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-white">Cargando postulaciones...</div>;

  return (
    <main className="min-h-screen bg-neutral-900 text-white p-8 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-yellow text-brand-yellow uppercase">Artistas Emergentes</h1>
          <p className="text-neutral-400 text-xs md:text-sm">Gestioná las postulaciones y revisá el material.</p>
        </div>
        <a href="/control-updr-admin" className="text-xs text-neutral-400 hover:text-brand-yellow transition-colors underline">Volver al panel</a>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List */}
        <div className="lg:col-span-1 space-y-4">
          {apps.length === 0 ? (
            <p className="text-neutral-500 italic">No hay postulaciones todavía.</p>
          ) : (
            apps.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedApp?.id === app.id
                    ? "bg-brand-yellow/10 border-brand-yellow"
                    : "bg-neutral-800 border-white/5 hover:border-white/20"
                }`}
              >
                <h3 className="font-bold text-lg">{app.artistName}</h3>
                <p className="text-xs text-brand-yellow uppercase tracking-wider mb-2">{app.genre}</p>
                <div className="flex justify-between items-center text-[10px] text-neutral-500 uppercase">
                  <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                  <span>{app.city || "Sin ciudad"}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selectedApp ? (
            <div className="bg-black p-4 md:p-8 rounded-2xl border border-white/10 space-y-6 md:space-y-8 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-yellow text-brand-yellow break-words leading-tight">{selectedApp.artistName}</h2>
                  <p className="text-base md:text-lg text-white/70 italic">{selectedApp.genre}</p>
                </div>
                <div className="text-left md:text-right text-[10px] md:text-xs text-neutral-500 bg-white/5 md:bg-transparent p-2 md:p-0 rounded-lg w-full md:w-auto">
                  <p className="font-bold md:font-normal">Postulado por: {selectedApp.user.nombre} {selectedApp.user.apellido}</p>
                  <p className="opacity-70">{selectedApp.user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-brand-yellow tracking-widest mb-1">Biografía</h4>
                    <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{selectedApp.bio || "Sin biografía."}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-brand-yellow tracking-widest mb-1">Ubicación</h4>
                    <p className="text-sm text-white/80">{selectedApp.address}</p>
                  </div>
                  <div className="flex gap-4 pt-2">
                    {selectedApp.instagram && (
                      <a href={`https://instagram.com/${selectedApp.instagram.replace("@", "")}`} target="_blank" className="text-xs bg-white/5 px-3 py-1 rounded-full border border-white/10 hover:bg-white/10">Instagram</a>
                    )}
                    {selectedApp.spotify && (
                      <a href={selectedApp.spotify} target="_blank" className="text-xs bg-white/5 px-3 py-1 rounded-full border border-white/10 hover:bg-white/10">Spotify</a>
                    )}
                    {selectedApp.youtube && (
                      <a href={selectedApp.youtube} target="_blank" className="text-xs bg-white/5 px-3 py-1 rounded-full border border-white/10 hover:bg-white/10">YouTube</a>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase font-bold text-brand-yellow tracking-widest mb-2">Material Subido ({selectedApp.mediaUrls.length}/2)</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedApp.mediaUrls.length === 0 ? (
                      <p className="text-xs text-neutral-600 italic">El artista no subió material.</p>
                    ) : (
                      selectedApp.mediaUrls.map((url, i) => (
                        <div key={i} className="rounded-xl overflow-hidden border border-white/20 bg-neutral-800">
                          <video controls className="w-full aspect-video">
                            <source src={url} />
                            Tu navegador no soporta el tag de video.
                          </video>
                          <div className="p-2 text-center">
                            <a href={url} target="_blank" className="text-[10px] text-brand-yellow uppercase font-bold hover:underline">Abrir original</a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl p-12 text-neutral-600">
              Seleccioná un artista para ver los detalles.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
