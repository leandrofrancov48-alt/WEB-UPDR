"use client";

import { useEffect, useState, useTransition } from "react";
import { approveArtistApplication, rejectArtistApplication, deleteArtistOrBand } from "@/lib/actions/admin";


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
  contactPhone?: string;
  showEmail: boolean;
  showName: boolean;
  showPhone: boolean;
  user: {
    nombre: string;
    apellido: string;
    email: string;
  };
  status: string;
}

export default function EmergentesClient() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAction = (id: string, action: "APPROVE" | "REJECT") => {
    startTransition(async () => {
      try {
        if (action === "APPROVE") {
          await approveArtistApplication(id);
        } else {
          await rejectArtistApplication(id);
        }
        // Update local state
        setApps(apps.map(app => app.id === id ? { ...app, status: action === "APPROVE" ? "APPROVED" : "REJECTED" } : app));
        if (selectedApp?.id === id) {
          setSelectedApp(prev => prev ? { ...prev, status: action === "APPROVE" ? "APPROVED" : "REJECTED" } : null);
        }
      } catch (error) {
        alert("Ocurrió un error.");
      }
    });
  };

  const handleDelete = (id: string) => {
    const app = apps.find(a => a.id === id);
    if (!app) return;

    const message = app.status === "APPROVED"
      ? `¿Estás seguro de que deseas eliminar permanentemente a "${app.artistName}"? AL ESTAR APROBADO, se revertirá su estado de músico/banda (se borrará el perfil de la banda o se quitará el flag de músico de su usuario). Esta acción no se puede deshacer.`
      : `¿Estás seguro de que deseas eliminar permanentemente la postulación de "${app.artistName}"? Esta acción no se puede deshacer.`;

    if (!confirm(message)) return;

    startTransition(async () => {
      try {
        const res = await deleteArtistOrBand(id);
        if (res.success) {
          // Remove from local state
          setApps(apps.filter(a => a.id !== id));
          if (selectedApp?.id === id) {
            setSelectedApp(null);
          }
        } else {
          alert("Ocurrió un error al intentar eliminar.");
        }
      } catch (error) {
        alert("Ocurrió un error al intentar eliminar.");
      }
    });
  };

  useEffect(() => {
    fetch("/api/admin/artist-applications")
      .then((r) => r.json())
      .then((data) => {
        if (data.applications) setApps(data.applications);
        setLoading(false);
      });
  }, []);

  const filteredApps = apps.filter((app) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    const nameMatch = app.artistName?.toLowerCase().includes(term);
    const genreMatch = app.genre?.toLowerCase().includes(term);
    const bioMatch = app.bio?.toLowerCase().includes(term);
    const cityMatch = app.city?.toLowerCase().includes(term) || app.address?.toLowerCase().includes(term);
    const userMatch = (
      app.user?.nombre?.toLowerCase().includes(term) ||
      app.user?.apellido?.toLowerCase().includes(term) ||
      `${app.user?.nombre} ${app.user?.apellido}`.toLowerCase().includes(term) ||
      app.user?.email?.toLowerCase().includes(term)
    );
    
    let statusText = "";
    if (app.status === "PENDING") statusText = "pendiente pending";
    else if (app.status === "APPROVED") statusText = "aprobado approved";
    else if (app.status === "REJECTED") statusText = "rechazado rejected";
    const statusMatch = statusText.includes(term);

    return nameMatch || genreMatch || bioMatch || cityMatch || userMatch || statusMatch;
  });

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
          {/* Search bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre, género, ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-800 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")} 
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>

          {filteredApps.length === 0 ? (
            <p className="text-neutral-500 italic">No se encontraron postulaciones.</p>
          ) : (
            filteredApps.map((app) => (
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
                  <span className={`font-bold ${
                    app.status === 'APPROVED' ? 'text-green-500' : 
                    app.status === 'REJECTED' ? 'text-red-500' : 
                    'text-brand-yellow'
                  }`}>
                    {app.status === 'PENDING' ? 'PENDIENTE' : 
                     app.status === 'APPROVED' ? 'APROBADO' : 'RECHAZADO'}
                  </span>
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
                  <p className={`font-bold md:font-normal ${!selectedApp.showName ? 'opacity-30' : ''}`}>
                    Postulado por: {selectedApp.user.nombre} {selectedApp.user.apellido} {!selectedApp.showName && "(Oculto)"}
                  </p>
                  <p className={`opacity-70 ${!selectedApp.showEmail ? 'opacity-20' : ''}`}>
                    {selectedApp.user.email} {!selectedApp.showEmail && "(Oculto)"}
                  </p>
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
                  <div className="flex flex-wrap gap-4 pt-2">
                    {selectedApp.contactPhone && (
                      <div className={`text-xs bg-brand-yellow/10 px-3 py-1 rounded-full border border-brand-yellow/30 text-brand-yellow flex items-center gap-2 ${!selectedApp.showPhone ? 'opacity-30' : ''}`}>
                        <span className="font-bold">TEL:</span> {selectedApp.contactPhone} {!selectedApp.showPhone && "(Oculto)"}
                      </div>
                    )}
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

              <div className="pt-6 border-t border-white/10 flex flex-wrap gap-4 justify-between items-center">
                {/* Left side: Delete action */}
                <button
                  onClick={() => handleDelete(selectedApp.id)}
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl text-red-500 font-bold border border-red-500/30 hover:bg-red-500/10 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  {selectedApp.status === "APPROVED" ? "Eliminar Registro" : "Eliminar Postulación"}
                </button>

                {/* Right side: Approve / Reject for PENDING */}
                {selectedApp.status === "PENDING" && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAction(selectedApp.id, "REJECT")}
                      disabled={isPending}
                      className="px-6 py-2 rounded-xl text-red-500 font-bold border border-red-500/30 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={() => handleAction(selectedApp.id, "APPROVE")}
                      disabled={isPending}
                      className="px-6 py-2 rounded-xl bg-brand-yellow text-black font-bold hover:scale-105 disabled:opacity-50 transition-all"
                    >
                      Aprobar Registro
                    </button>
                  </div>
                )}
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
