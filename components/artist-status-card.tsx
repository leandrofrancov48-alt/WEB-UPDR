"use client";

import { CheckCircle2, Clock, XCircle, Music, Users, ExternalLink } from "lucide-react";
import Link from "next/link";

interface ArtistStatusCardProps {
  application?: {
    status: string;
    artistName: string;
    createdAt: string;
  };
  isMusician: boolean;
  userId: string;
  bandsOwned: any[];
  memberships?: any[];
}

export function ArtistStatusCard({ application, isMusician, userId, bandsOwned, memberships = [] }: ArtistStatusCardProps) {
  const handleMembership = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/memberships/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (!application && !isMusician && bandsOwned.length === 0 && memberships.length === 0) {
    return (
      <div className="rounded-2xl border border-brand-yellow/30 bg-brand-yellow/5 p-6 space-y-4">
        <h2 className="text-xl font-bold text-brand-yellow flex items-center gap-2">
          <Music className="w-5 h-5" />
          ¿Sos artista?
        </h2>
        <p className="text-sm text-white/70">
          Postulate como artista emergente para ser parte de Un Poco de Ruido. 
          Podrás subir tu material y ser parte de nuestra comunidad.
        </p>
        <Link 
          href="/emergente" 
          className="inline-block rounded-xl bg-brand-yellow px-6 py-3 text-black font-bold hover:scale-105 transition-transform"
        >
          Postularme ahora
        </Link>
      </div>
    );
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          icon: <Clock className="w-5 h-5 text-yellow-400" />,
          text: "En revisión",
          color: "text-yellow-400",
          bgColor: "bg-yellow-400/10",
          borderColor: "border-yellow-400/20"
        };
      case "APPROVED":
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,
          text: "Perfil Activo",
          color: "text-green-400",
          bgColor: "bg-green-400/10",
          borderColor: "border-green-400/20"
        };
      case "REJECTED":
        return {
          icon: <XCircle className="w-5 h-5 text-red-400" />,
          text: "No seleccionado",
          color: "text-red-400",
          bgColor: "bg-red-400/10",
          borderColor: "border-red-400/20"
        };
      default:
        return {
          icon: <Clock className="w-5 h-5 text-white/40" />,
          text: "Desconocido",
          color: "text-white/40",
          bgColor: "bg-white/5",
          borderColor: "border-white/10"
        };
    }
  };

  const status = application ? getStatusDisplay(application.status) : getStatusDisplay("APPROVED");

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-black uppercase tracking-[0.2em] text-brand-yellow/80">Tu estado de artista</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Application Status */}
        {application && (
          <div className="glass-card p-6 border border-white/10 bg-white/5 rounded-3xl overflow-hidden relative group">
            <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest ${status.bgColor} ${status.color} border-l border-b ${status.borderColor}`}>
              {status.text}
            </div>
            
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl ${status.bgColor} ${status.borderColor} border`}>
                {status.icon}
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Postulación enviada</p>
                <h3 className="text-xl font-bold text-white">{application.artistName}</h3>
                <p className="text-[10px] text-white/30 uppercase">Enviada el {new Date(application.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {application.status === "APPROVED" && isMusician && (
              <div className="mt-6 pt-6 border-t border-white/5">
                <Link 
                  href={`/musico/${userId}`}
                  className="flex items-center justify-between group/link bg-brand-yellow/10 hover:bg-brand-yellow/20 border border-brand-yellow/20 p-4 rounded-2xl transition-all"
                >
                  <span className="font-bold text-brand-yellow">Ver mi perfil público</span>
                  <ExternalLink className="w-4 h-4 text-brand-yellow group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Active Bands */}
        {bandsOwned.map((band) => (
          <div key={band.id} className="glass-card p-6 border border-brand-blue/20 bg-brand-blue/5 rounded-3xl relative">
             <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest bg-brand-blue/20 text-brand-blue border-l border-b border-brand-blue/30">
              Banda Activa
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 text-brand-blue">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Tu Banda</p>
                <h3 className="text-xl font-bold text-white">{band.name}</h3>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/5">
              <Link 
                href={`/banda/${band.id}`}
                className="flex items-center justify-between group/link bg-brand-blue/10 hover:bg-brand-blue/20 border border-brand-blue/20 p-4 rounded-2xl transition-all"
              >
                <span className="font-bold text-brand-blue">Administrar Banda</span>
                <ExternalLink className="w-4 h-4 text-brand-blue group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}

        {/* Band Invitations */}
        {memberships.map((m) => (
          <div key={m.id} className="glass-card p-6 border border-brand-orange/20 bg-brand-orange/5 rounded-3xl relative">
            <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest bg-brand-orange/20 text-brand-orange border-l border-b border-brand-orange/30">
              Invitación Pendiente
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 text-brand-orange">
                <Music className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Te invitaron a unirte a</p>
                <h3 className="text-xl font-bold text-white">{m.band.name}</h3>
                <p className="text-[10px] text-white/30 uppercase">Como {m.role || "Músico"}</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
              <button 
                onClick={() => handleMembership(m.id, 'ACCEPTED')}
                className="flex-1 rounded-xl bg-brand-orange px-4 py-2 text-black font-bold text-sm hover:scale-105 transition-transform"
              >
                Aceptar
              </button>
              <button 
                onClick={() => handleMembership(m.id, 'REJECTED')}
                className="flex-1 rounded-xl border border-white/10 px-4 py-2 text-white/60 font-bold text-sm hover:bg-white/5 transition-colors"
              >
                Rechazar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
